import 'dotenv/config';
import pg from 'pg';

const { Pool } = pg;

const HF_API_TOKEN = process.env.HUGGINGFACE_API_TOKEN;
const FRED_EMBEDDING_MODEL =
  process.env.FRED_EMBEDDING_MODEL || 'sentence-transformers/all-MiniLM-L6-v2';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const SOURCE_ID = 'maintenance_kb_v1';

const knowledgeChunks = [
  {
    topic: 'Core Maintenance Principles',
    content:
      'Regular maintenance prevents breakdowns. Small issues become expensive if ignored. Clean bikes last longer. Fluids are the lifeblood of motorcycles. Tires affect safety more than any other component.',
  },
  {
    topic: 'Engine Oil',
    content:
      'Change every 3,000–5,000 km or per manufacturer specification. Always replace the oil filter. Warm the engine before draining. Use the correct viscosity specified for the motorcycle.',
  },
  {
    topic: 'Brake Fluid',
    content:
      'Replace brake fluid every 1–2 years. Keep the reservoir clean and sealed. Never mix different brake fluid types. Old fluid can cause brake fade and spongy lever feel.',
  },
  {
    topic: 'Coolant',
    content:
      'For liquid-cooled bikes, replace coolant about every 2 years. Use motorcycle-specific coolant. Never mix incompatible coolants and keep the system properly bled of air.',
  },
  {
    topic: 'Chain Maintenance',
    content:
      'Clean the chain every 500–1,000 km, or more often in wet or dirty conditions. Lube the chain after cleaning and after wet rides. Adjust slack to the manufacturer specification. Inspect for rust, stiff links, and uneven wear.',
  },
  {
    topic: 'Sprockets',
    content:
      'Inspect sprockets for hooked or pointed teeth. Replace sprockets when teeth are worn or hooked. Sprockets are usually changed together with the chain as a set.',
  },
  {
    topic: 'Tires',
    content:
      'Check tire pressure weekly and before long rides. Inspect for cracks, punctures, or embedded objects. Replace tires when tread is worn or when the rubber has aged and lost grip. Always follow the pressure recommendations on the manufacturer sticker or in the manual.',
  },
  {
    topic: 'Brakes',
    content:
      'Inspect brake pads regularly and replace them before the friction material is too thin or metal contacts the disc. Check disc thickness and surface condition. Watch for vibration, squealing, or a soft lever, which can indicate pad, fluid, or disc issues.',
  },
  {
    topic: 'Battery',
    content:
      'Keep battery terminals clean and tight. Charge the battery if the bike is unused for extended periods. Typical battery life is about 2–4 years. Weak batteries often cause hard starting, dim lights, and intermittent electrical issues.',
  },
  {
    topic: 'Air Filter',
    content:
      'Clean the air filter every 5,000–10,000 km, or more often in dusty conditions. Replace the filter if it is damaged or excessively dirty. A clogged air filter reduces performance and can increase fuel consumption.',
  },
  {
    topic: 'Spark Plugs',
    content:
      'Inspect spark plugs for deposits, wear, and correct gap. Replace plugs at the recommended service interval. Misfires, poor starting, or rough running can indicate spark plug or ignition issues.',
  },
  {
    topic: 'Suspension',
    content:
      'Check fork seals for leaks or oil on the fork legs. Replace fork oil periodically to maintain damping performance. Inspect the rear shock for leaks, damage, and proper damping. Suspension condition affects comfort, handling, and braking.',
  },
  {
    topic: 'Cables And Controls',
    content:
      'Lube throttle and clutch cables periodically if they are not self-lubricating. Ensure smooth, snag-free movement of controls. Adjust clutch free play to the specified range to avoid clutch slip or drag.',
  },
  {
    topic: 'Common Problems: Hard Starting',
    content:
      'Typical causes of hard starting include a weak or discharged battery, dirty or worn spark plugs, and fuel delivery issues such as clogged jets or filters. Always check battery health and basic ignition before deeper troubleshooting.',
  },
  {
    topic: 'Common Problems: Poor Acceleration',
    content:
      'Poor acceleration is often caused by a dirty air filter, a worn or neglected drive chain and sprockets, or fuel system problems. Check for air intake restrictions and drivetrain condition before assuming major engine issues.',
  },
  {
    topic: 'Common Problems: Overheating',
    content:
      'Overheating can result from low coolant level, a blocked or dirty radiator, poor airflow, or lean fuel mixture. Verify coolant level, radiator cleanliness, and fan operation. Persistent overheating should be inspected promptly to avoid engine damage.',
  },
  {
    topic: 'Common Problems: Brake Fade',
    content:
      'Brake fade is commonly caused by old or overheated brake fluid, worn pads, or excessive heat in the braking system. Replace aged fluid, ensure pads are in good condition, and avoid dragging the brakes on long descents.',
  },
  {
    topic: 'Routine Maintenance Schedule',
    content:
      'Before every ride, check tires, brakes, and lights. Weekly, lube the chain and check tire pressures. Monthly, check oil level and fasteners. Every 3–6 months, change engine oil and check the air filter. Yearly, renew brake fluid, refresh coolant, and perform a full inspection.',
  },
  {
    topic: 'Cleaning Tips',
    content:
      'Use mild soap and water to clean the motorcycle. Avoid high-pressure washers on bearings, seals, and electrical areas. Dry the bike completely after washing and lube the chain once it is dry.',
  },
  {
    topic: 'Riding Habits',
    content:
      'Warm the engine gently before hard riding. Avoid frequent over-revving and harsh acceleration. Shift smoothly and keep the engine in its optimal RPM range. Smooth, controlled riding reduces wear on the engine, drivetrain, and brakes.',
  },
  {
    topic: 'Cost Saving Tips',
    content:
      'Save money by doing basic maintenance yourself when you can. Buy parts in kits or sets when it makes sense, such as chain and sprocket kits. Track maintenance and repair expenses to spot patterns. Preventive care usually costs less than major repairs.',
  },
  {
    topic: 'Safety Essentials',
    content:
      'Good tires are critical to safety. Brakes must be in excellent condition. All lights and indicators must function correctly. Always wear a helmet and appropriate protective gear. Never compromise on safety-related maintenance.',
  },
  {
    topic: 'Storage Tips',
    content:
      'For storage, use fuel stabilizer if the bike will sit for weeks or months. Disconnect or maintain the battery to prevent discharge. Inflate tires to correct pressure and keep the bike covered and protected from the elements.',
  },
  {
    topic: 'Seasonal Maintenance',
    content:
      'In rainy seasons, lube the chain more often and pay close attention to brake performance. In hot weather, monitor coolant level and tire pressure frequently. For cold storage, focus on battery care and fuel stabilizer to keep the bike ready for the next season.',
  },
  {
    topic: 'Maintenance Mindset',
    content:
      'A motorcycle is a machine that rewards regular care. Routine attention prevents breakdowns, improves safety, and saves money over the life of the bike.',
  },
];

async function fetchEmbedding(text) {
  if (!HF_API_TOKEN) {
    throw new Error('HUGGINGFACE_API_TOKEN is not configured');
  }
  const response = await fetch(
    `https://router.huggingface.co/hf-inference/models/${encodeURIComponent(
      FRED_EMBEDDING_MODEL
    )}`,
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
    const text = await response.text();
    throw new Error(`Embedding request failed: ${response.status} ${text}`);
  }
  const data = await response.json();
  if (Array.isArray(data) && Array.isArray(data[0])) {
    return data[0].map((v) => Number(v) || 0);
  }
  if (Array.isArray(data)) {
    return data.map((v) => Number(v) || 0);
  }
  throw new Error('Unexpected embedding response format');
}

async function loadKnowledge() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not configured');
  }

  console.log('Removing existing Fred chunks for source', SOURCE_ID);
  await pool.query('DELETE FROM fred_chunks WHERE source = $1', [SOURCE_ID]);

  for (const chunk of knowledgeChunks) {
    const text = chunk.content;
    console.log('Embedding chunk for topic:', chunk.topic);
    const embedding = await fetchEmbedding(text);
    await pool.query(
      'INSERT INTO fred_chunks (content, embedding, topic, source) VALUES ($1, $2::jsonb, $3, $4)',
      [text, JSON.stringify(embedding), chunk.topic, SOURCE_ID]
    );
  }
}

async function main() {
  try {
    await loadKnowledge();
    console.log('Fred knowledge base loaded successfully.');
  } catch (err) {
    console.error('Failed to load Fred knowledge base:', err.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

main();
