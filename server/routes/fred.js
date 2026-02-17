import { Router } from 'express';
import pool from '../db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();
router.use(authMiddleware);

const HF_API_TOKEN = process.env.HUGGINGFACE_API_TOKEN;
const FRED_EMBEDDING_MODEL =
  process.env.FRED_EMBEDDING_MODEL || 'sentence-transformers/all-MiniLM-L6-v2';
const FRED_LLM_MODEL =
  process.env.FRED_LLM_MODEL || 'meta-llama/Llama-3.1-8B-Instruct:cerebras';

async function fetchEmbedding(text) {
  if (!HF_API_TOKEN) {
    throw new Error('HUGGINGFACE_API_TOKEN is not configured');
  }
  const response = await fetch(
    `https://router.huggingface.co/hf-inference/models/${FRED_EMBEDDING_MODEL}/pipeline/feature-extraction`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${HF_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ inputs: text }),
    }
  );
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Embedding request failed: ${response.status} ${body}`);
  }
  const data = await response.json();
  if (Array.isArray(data) && Array.isArray(data[0])) {
    return data[0].map((v) => Number(v) || 0);
  }
  if (Array.isArray(data)) {
    return data.map((v) => Number(v) || 0);
  }
  throw new Error(`Unexpected embedding response format: ${JSON.stringify(data).slice(0, 200)}`);
}

function dotProduct(a, b) {
  let sum = 0;
  for (let i = 0; i < a.length && i < b.length; i += 1) {
    sum += a[i] * b[i];
  }
  return sum;
}

function vectorNorm(a) {
  return Math.sqrt(dotProduct(a, a));
}

function cosineSimilarity(a, b) {
  const normA = vectorNorm(a);
  const normB = vectorNorm(b);
  if (!normA || !normB) return 0;
  return dotProduct(a, b) / (normA * normB);
}

async function fetchRelevantChunks(embedding, limit = 5) {
  const { rows } = await pool.query(
    'SELECT id, content, topic, source, embedding FROM fred_chunks'
  );
  if (!rows.length) {
    return [];
  }
  const scored = rows
    .map((row) => {
      const rowEmbedding =
        Array.isArray(row.embedding) && row.embedding.length
          ? row.embedding.map((v) => Number(v) || 0)
          : Array.isArray(row.embedding?.data)
          ? row.embedding.data.map((v) => Number(v) || 0)
          : [];
      return {
        id: row.id,
        content: row.content,
        topic: row.topic,
        source: row.source,
        score: cosineSimilarity(embedding, rowEmbedding),
      };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
  return scored;
}

async function generateAnswer(question, chunks) {
  if (!HF_API_TOKEN) {
    throw new Error('HUGGINGFACE_API_TOKEN is not configured');
  }
  const contextText = chunks
    .map((c, index) => {
      const label = c.topic || c.source || `Chunk ${index + 1}`;
      return `${label}:\n${c.content}`;
    })
    .join('\n\n');
  const prompt = [
    'You are Fred, an AI assistant that helps motorcycle owners with maintenance, troubleshooting, and ownership questions.',
    'Use only the maintenance information provided in the CONTEXT to answer.',
    'If the answer is not in the context, say you are not sure and suggest consulting the motorcycle manual or a qualified mechanic.',
    'Keep answers concise, practical, and focused on safety.',
    '',
    'CONTEXT:',
    contextText || 'No context available.',
    '',
    'QUESTION:',
    question,
  ].join('\n');

  const response = await fetch(
    'https://router.huggingface.co/v1/chat/completions',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${HF_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: FRED_LLM_MODEL,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 256,
        temperature: 0.3,
      }),
    }
  );
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`LLM request failed: ${response.status} ${text}`);
  }
  const data = await response.json();
  if (Array.isArray(data?.choices) && data.choices[0]?.message?.content) {
    return String(data.choices[0].message.content).trim();
  }
  return JSON.stringify(data);
}

router.post('/ask', async (req, res) => {
  try {
    const { question } = req.body;
    if (!question || !String(question).trim()) {
      return res.status(400).json({ error: 'Question is required' });
    }

    const query = String(question).trim();

    // Try semantic search; fall back to no context if embedding fails
    let chunks = [];
    try {
      const queryEmbedding = await fetchEmbedding(query);
      chunks = await fetchRelevantChunks(queryEmbedding, 5);
    } catch (embeddingErr) {
      console.warn('Fred embedding failed (answering without context):', embeddingErr.message);
    }

    const answer = await generateAnswer(query, chunks);
    return res.json({
      answer,
      retrievedChunks: chunks.map((c) => ({
        id: c.id,
        topic: c.topic,
        source: c.source,
        content: c.content,
      })),
    });
  } catch (err) {
    console.error('Fred /api/fred/ask error:', err);
    res.status(500).json({
      error: err.message || 'Failed to process question',
    });
  }
});

export default router;