import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiGet, apiPost, apiPut, apiDelete } from '../api';

export default function ServiceHistory() {
  const { bikeId } = useParams();
  const [bike, setBike] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    service_type: '',
    description: '',
    service_date: new Date().toISOString().slice(0, 10),
    mileage_at_service: '',
    cost: '',
    shop_name: '',
  });

  const base = `/api/bikes/${bikeId}/services`;

  function load() {
    Promise.all([
      apiGet(`/api/bikes/${bikeId}`),
      apiGet(`${base}`),
    ])
      .then(([bikeData, servicesData]) => {
        setBike(bikeData);
        setServices(servicesData);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, [bikeId]);

  function openEdit(s) {
    setEditingId(s.service_id);
    setForm({
      service_type: s.service_type,
      description: s.description || '',
      service_date: s.service_date,
      mileage_at_service: s.mileage_at_service ?? '',
      cost: s.cost ?? '',
      shop_name: s.shop_name || '',
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      if (editingId) {
        await apiPut(`${base}/${editingId}`, form);
        setEditingId(null);
      } else {
        await apiPost(base, form);
        setShowForm(false);
      }
      setForm({ service_type: '', description: '', service_date: new Date().toISOString().slice(0, 10), mileage_at_service: '', cost: '', shop_name: '' });
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(serviceId) {
    if (!confirm('Delete this service record?')) return;
    try {
      await apiDelete(`${base}/${serviceId}`);
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
        <h1 className="font-heading text-3xl font-bold">Service history</h1>
        <span className="text-white/60">{bike.brand} {bike.model}</span>
      </div>

      {error && (
        <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/30 rounded-lg px-4 py-2">{error}</p>
      )}

      <div className="flex justify-between items-center">
        <button
          type="button"
          onClick={() => { setShowForm(true); setEditingId(null); setForm({ service_type: '', description: '', service_date: new Date().toISOString().slice(0, 10), mileage_at_service: '', cost: '', shop_name: '' }); }}
          className="px-5 py-2 rounded-lg bg-accent hover:bg-accent-hover text-black font-semibold"
        >
          Add service
        </button>
      </div>

      {(showForm || editingId) && (
        <form onSubmit={handleSubmit} className="rounded-xl bg-white/5 border border-white/10 p-6 max-w-xl space-y-4">
          <h2 className="font-heading text-xl font-semibold">{editingId ? 'Edit service' : 'New service'}</h2>
          <div>
            <label className="block text-sm text-white/70 mb-1">Service type *</label>
            <input
              value={form.service_type}
              onChange={(e) => setForm((f) => ({ ...f, service_type: e.target.value }))}
              className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/20 text-white"
              placeholder="e.g. Oil change, Tire replacement"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-white/70 mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/20 text-white"
              rows={2}
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-white/70 mb-1">Date *</label>
              <input
                type="date"
                value={form.service_date}
                onChange={(e) => setForm((f) => ({ ...f, service_date: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/20 text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-1">Mileage at service</label>
              <input
                type="number"
                value={form.mileage_at_service}
                onChange={(e) => setForm((f) => ({ ...f, mileage_at_service: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/20 text-white"
                min="0"
              />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-white/70 mb-1">Cost</label>
              <input
                type="number"
                step="0.01"
                value={form.cost}
                onChange={(e) => setForm((f) => ({ ...f, cost: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/20 text-white"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-1">Shop name</label>
              <input
                value={form.shop_name}
                onChange={(e) => setForm((f) => ({ ...f, shop_name: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/20 text-white"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button type="submit" className="px-4 py-2 rounded-lg bg-accent hover:bg-accent-hover text-black font-semibold">Save</button>
            <button type="button" onClick={() => { setShowForm(false); setEditingId(null); }} className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20">Cancel</button>
          </div>
        </form>
      )}

      <ul className="space-y-4">
        {services.map((s) => (
          <li key={s.service_id} className="rounded-xl bg-white/5 border border-white/10 p-5 flex flex-wrap justify-between items-start gap-4">
            <div>
              <h3 className="font-heading font-semibold text-lg">{s.service_type}</h3>
              <p className="text-white/60 text-sm">{s.service_date} {s.mileage_at_service != null ? ` · ${s.mileage_at_service.toLocaleString()} km` : ''}</p>
              {s.description && <p className="text-white/70 mt-1">{s.description}</p>}
              {s.shop_name && <p className="text-white/50 text-sm mt-1">{s.shop_name}</p>}
            </div>
            <div className="flex items-center gap-3">
              {s.cost != null && Number(s.cost) > 0 && (
                <span className="text-accent font-semibold">${Number(s.cost).toFixed(2)}</span>
              )}
              <button type="button" onClick={() => openEdit(s)} className="text-sm text-white/60 hover:text-white">Edit</button>
              <button type="button" onClick={() => handleDelete(s.service_id)} className="text-sm text-red-400 hover:underline">Delete</button>
            </div>
          </li>
        ))}
      </ul>

      {services.length === 0 && !showForm && <p className="text-white/50">No services logged yet.</p>}
    </div>
  );
}
