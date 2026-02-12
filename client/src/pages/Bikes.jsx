import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiGet, apiPost, apiDelete } from '../api';

const API_BASE = import.meta.env.VITE_API_URL || '';

export default function Bikes() {
  const [bikes, setBikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ brand: '', model: '', year: '', plate_number: '', engine_cc: '', current_mileage: '' });

  function loadBikes() {
    apiGet('/api/bikes')
      .then(setBikes)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadBikes();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      await apiPost('/api/bikes', {
        brand: form.brand,
        model: form.model,
        year: form.year || undefined,
        plate_number: form.plate_number || undefined,
        engine_cc: form.engine_cc || undefined,
        current_mileage: form.current_mileage || undefined,
      });
      setForm({ brand: '', model: '', year: '', plate_number: '', engine_cc: '', current_mileage: '' });
      setShowForm(false);
      loadBikes();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(bikeId) {
    if (!confirm('Delete this bike and all its data?')) return;
    try {
      await apiDelete(`/api/bikes/${bikeId}`);
      loadBikes();
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) return <p className="text-white/60">Loading bikes…</p>;

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-heading text-4xl font-bold">Bikes</h1>
        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-3 rounded-lg bg-accent hover:bg-accent-hover text-black font-semibold transition"
        >
          {showForm ? 'Cancel' : 'Add bike'}
        </button>
      </div>

      {error && (
        <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/30 rounded-lg px-4 py-2">{error}</p>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-xl bg-white/5 border border-white/10 p-6 max-w-lg space-y-4">
          <h2 className="font-heading text-xl font-semibold">New bike</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-white/70 mb-1">Brand *</label>
              <input
                value={form.brand}
                onChange={(e) => setForm((f) => ({ ...f, brand: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/20 text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-1">Model *</label>
              <input
                value={form.model}
                onChange={(e) => setForm((f) => ({ ...f, model: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/20 text-white"
                required
              />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-white/70 mb-1">Year *</label>
              <input
                type="number"
                value={form.year}
                onChange={(e) => setForm((f) => ({ ...f, year: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/20 text-white"
                min="1900"
                max={new Date().getFullYear() + 1}
                required
              />
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-1">Plate number</label>
              <input
                value={form.plate_number}
                onChange={(e) => setForm((f) => ({ ...f, plate_number: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/20 text-white"
              />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-white/70 mb-1">Engine (cc)</label>
              <input
                type="number"
                value={form.engine_cc}
                onChange={(e) => setForm((f) => ({ ...f, engine_cc: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/20 text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-1">Current mileage</label>
              <input
                type="number"
                value={form.current_mileage}
                onChange={(e) => setForm((f) => ({ ...f, current_mileage: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/20 text-white"
                min="0"
              />
            </div>
          </div>
          <button type="submit" className="px-6 py-2 rounded-lg bg-accent hover:bg-accent-hover text-black font-semibold">
            Add bike
          </button>
        </form>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {bikes.map((bike) => (
          <div key={bike.bike_id} className="rounded-xl bg-white/5 border border-white/10 overflow-hidden">
            <div className="aspect-video bg-white/5 flex items-center justify-center">
              {bike.photo ? (
                <img src={`${API_BASE}${bike.photo}`} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="text-white/30 font-heading text-4xl">{bike.brand}</span>
              )}
            </div>
            <div className="p-5">
              <h2 className="font-heading text-xl font-semibold">{bike.brand} {bike.model}</h2>
              <p className="text-white/60 text-sm mt-1">{bike.year} {bike.engine_cc ? ` · ${bike.engine_cc} cc` : ''}</p>
              <p className="text-accent font-medium mt-2">{bike.current_mileage?.toLocaleString() ?? 0} km</p>
              <div className="flex flex-wrap gap-2 mt-4">
                <Link to={`/bikes/${bike.bike_id}`} className="text-sm text-accent hover:underline">Edit</Link>
                <Link to={`/bikes/${bike.bike_id}/services`} className="text-sm text-white/70 hover:underline">Services</Link>
                <Link to={`/bikes/${bike.bike_id}/mileage`} className="text-sm text-white/70 hover:underline">Mileage</Link>
                <Link to={`/bikes/${bike.bike_id}/expenses`} className="text-sm text-white/70 hover:underline">Expenses</Link>
                <button type="button" onClick={() => handleDelete(bike.bike_id)} className="text-sm text-red-400 hover:underline">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {bikes.length === 0 && !showForm && (
        <p className="text-white/60">No bikes yet. Click “Add bike” to get started.</p>
      )}
    </div>
  );
}
