import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiGet, apiPost, apiDelete } from '../api';

export default function MileageTracker() {
  const { bikeId } = useParams();
  const [bike, setBike] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
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

  if (loading) return <p className="text-white/60">Loading…</p>;
  if (!bike) return <p className="text-red-400">{error || 'Bike not found'}</p>;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center gap-4">
        <Link to={`/bikes/${bikeId}`} className="text-white/60 hover:text-white text-sm">← Bike</Link>
        <h1 className="font-heading text-3xl font-bold">Mileage</h1>
        <span className="text-white/60">{bike.brand} {bike.model}</span>
      </div>

      {error && (
        <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/30 rounded-lg px-4 py-2">{error}</p>
      )}

      <div className="rounded-xl bg-white/5 border border-white/10 p-6 max-w-md">
        <h2 className="font-heading text-xl font-semibold mb-4">Current mileage</h2>
        <p className="text-accent font-heading text-3xl font-bold">{bike.current_mileage?.toLocaleString() ?? 0} km</p>
      </div>

      <form onSubmit={handleSubmit} className="rounded-xl bg-white/5 border border-white/10 p-6 max-w-md space-y-4">
        <h2 className="font-heading text-xl font-semibold">Log mileage</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-white/70 mb-1">Date</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
              className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/20 text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-white/70 mb-1">Mileage (km)</label>
            <input
              type="number"
              value={form.mileage}
              onChange={(e) => setForm((f) => ({ ...f, mileage: e.target.value }))}
              className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/20 text-white"
              min="0"
              required
            />
          </div>
        </div>
        <button type="submit" className="px-5 py-2 rounded-lg bg-accent hover:bg-accent-hover text-black font-semibold">Add entry</button>
      </form>

      <div>
        <h2 className="font-heading text-xl font-semibold mb-4">History</h2>
        <ul className="space-y-2">
          {logs.map((log) => (
            <li key={log.log_id} className="flex justify-between items-center py-3 border-b border-white/10">
              <span className="text-white/80">{log.date}</span>
              <span className="text-accent font-medium">{Number(log.mileage).toLocaleString()} km</span>
              <button type="button" onClick={() => handleDelete(log.log_id)} className="text-sm text-red-400 hover:underline">Delete</button>
            </li>
          ))}
        </ul>
        {logs.length === 0 && <p className="text-white/50">No mileage entries yet.</p>}
      </div>
    </div>
  );
}
