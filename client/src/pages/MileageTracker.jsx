import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiGet, apiPost, apiDelete } from '../api';

export default function MileageTracker() {
  const { bikeId } = useParams();
  const [bike, setBike] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);
  const [form, setForm] = useState({ date: new Date().toISOString().slice(0, 10), mileage: '' });

  const base = `/api/bikes/${bikeId}/mileage`;

  function load() {
    Promise.all([
      apiGet(`/api/bikes/${bikeId}`),
      apiGet(base),
    ])
      .then(([bikeData, logsData]) => {
        setBike(bikeData);
        setLogs(logsData);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    setMounted(true);
    load();
  }, [bikeId]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      await apiPost(base, { date: form.date, mileage: parseInt(form.mileage, 10) });
      setForm((f) => ({ ...f, mileage: '' }));
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(logId) {
    if (!confirm('Delete this mileage entry?')) return;
    try {
      await apiDelete(`${base}/${logId}`);
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-accent/30 border-t-accent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/60">Loading mileage…</p>
        </div>
      </div>
    );
  }

  if (!bike) return <p className="text-red-400">{error || 'Bike not found'}</p>;

  return (
    <div className="space-y-8 pb-12">
      <div className={`transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
        <Link to={`/bikes/${bikeId}`} className="inline-flex items-center gap-2 text-white/60 hover:text-accent text-sm mb-4 transition group">
          <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
          Back to bike
        </Link>
        <div>
          <h1 className="font-heading text-4xl font-bold mb-2">Mileage Tracker</h1>
          <p className="text-white/60">{bike.brand} {bike.model} · {bike.year}</p>
        </div>
      </div>

      {error && (
        <div className="rounded-xl bg-red-400/10 border border-red-400/30 px-5 py-4 flex items-start gap-3">
          <svg className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      <div className={`rounded-2xl bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20 p-8 backdrop-blur-sm transition-all duration-700 delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-xl bg-accent/20 border border-accent/30 flex items-center justify-center text-accent">
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h2 className="font-heading text-xl font-semibold mb-1">Current Mileage</h2>
            <p className="text-accent font-heading text-4xl font-bold">{bike.current_mileage?.toLocaleString() ?? 0} km</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className={`rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 p-6 md:p-8 max-w-xl backdrop-blur-sm transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <h2 className="font-heading text-2xl font-semibold">Log Mileage</h2>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm text-white/70 mb-2 font-medium">Date</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-white/70 mb-2 font-medium">Mileage (km)</label>
            <input
              type="number"
              value={form.mileage}
              onChange={(e) => setForm((f) => ({ ...f, mileage: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition"
              min="0"
              placeholder="e.g. 15250"
              required
            />
          </div>
        </div>
        <button type="submit" className="mt-6 px-6 py-3 rounded-xl bg-accent hover:bg-accent-hover text-black font-semibold transition-all shadow-lg shadow-accent/20 hover:shadow-accent/40 hover:scale-105">
          Add Entry
        </button>
      </form>

      <div className={`transition-all duration-700 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <h2 className="font-heading text-2xl font-semibold mb-6 flex items-center gap-2">
          <svg className="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Mileage History
        </h2>

        {logs.length > 0 ? (
          <div className="space-y-3">
            {logs.map((log, i) => (
              <div
                key={log.log_id}
                className="flex justify-between items-center py-4 px-6 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 hover:border-accent/30 transition-all group"
                style={{ transitionDelay: `${i * 30}ms` }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/60 group-hover:text-accent transition-colors">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white/80 font-medium">{log.date}</p>
                    <p className="text-white/50 text-sm">Entry #{logs.length - i}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="px-4 py-2 rounded-lg bg-accent/10 border border-accent/20">
                    <span className="text-accent font-semibold">{Number(log.mileage).toLocaleString()} km</span>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => handleDelete(log.log_id)} 
                    className="text-sm text-red-400/80 hover:text-red-400 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <p className="text-white/60 text-lg mb-2">No mileage entries yet</p>
            <p className="text-white/40 text-sm">Log your first entry above</p>
          </div>
        )}
      </div>
    </div>
  );
}
