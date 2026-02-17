import { useState } from 'react';
import { apiPost, getAuthUser } from '../api';

const INITIAL_MESSAGE = {
  role: 'fred',
  text: 'Hi, I am Fred. Ask me anything about motorcycle maintenance, troubleshooting, or care.',
};

export default function FredChat() {
  const user = getAuthUser();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  if (!user) {
    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const question = input.trim();
    if (!question || loading) return;

    setInput('');
    setMessages((prev) => [...prev, { role: 'user', text: question }]);
    setLoading(true);

    try {
      const res = await apiPost('/api/fred/ask', { question });
      const answer = res?.answer || 'I could not find a clear answer. Please check your manual or consult a mechanic.';
      setMessages((prev) => [...prev, { role: 'fred', text: answer }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'fred',
          text: `I had trouble answering your question: ${err.message}. Please try again in a moment.`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {open ? (
        <div className="w-80 md:w-96 rounded-2xl bg-black/90 border border-white/10 shadow-2xl backdrop-blur-xl flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-gradient-to-r from-accent/20 to-transparent">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-black font-heading font-bold text-lg">
                F
              </div>
              <div className="flex flex-col">
                <span className="font-heading text-sm font-semibold">Fred</span>
                <span className="text-xs text-white/60">MotoCare maintenance assistant</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="p-1.5 rounded-full hover:bg-white/10 transition"
              aria-label="Close Fred chat"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 flex flex-col gap-3 px-4 py-3 overflow-y-auto max-h-80 text-sm">
            {messages.map((m, idx) => (
              <div
                key={`${m.role}-${idx}`}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`px-3 py-2 rounded-2xl max-w-[80%] leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-accent text-black rounded-br-sm'
                      : 'bg-white/10 text-white rounded-bl-sm'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-2 text-xs text-white/60">
                <span className="w-2 h-2 rounded-full bg-accent animate-bounce" />
                <span>Fred is thinking…</span>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="border-t border-white/10 px-3 py-2 flex items-center gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              placeholder="Ask about oil changes, tires, chains…"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2 rounded-xl bg-accent hover:bg-accent-hover text-black disabled:opacity-60 disabled:cursor-not-allowed transition flex items-center justify-center"
              aria-label="Send question to Fred"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </button>
          </form>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex items-center gap-3 px-4 py-3 rounded-full bg-accent hover:bg-accent-hover text-black shadow-lg shadow-accent/30 hover:shadow-accent/50 hover:scale-105 transition"
          aria-label="Open Fred chat"
        >
          <div className="w-8 h-8 rounded-full bg-black/20 flex items-center justify-center">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.8}
                d="M8 10h.01M12 10h.01M16 10h.01M9 16l-2.5 2.5M12 4a8 8 0 00-8 8c0 4.418 3.582 8 8 8s8-3.582 8-8-3.582-8-8-8z"
              />
            </svg>
          </div>
          <span className="font-heading text-sm font-semibold">Ask Fred</span>
        </button>
      )}
    </div>
  );
}

