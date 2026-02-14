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
  const [mounted, setMounted] = useState(false);

  function loadBikes() {
    apiGet('/api/bikes')
      .then(setBikes)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    setMounted(true);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-accent/30 border-t-accent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/60">Loading bikes…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-12">
      {/* Header */}
      <div className={`flex flex-wrap items-center justify-between gap-4 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
        <div>
          <h1 className="font-heading text-4xl font-bold mb-2">Your garage</h1>
          <p className="text-white/60">Manage your motorcycle collection</p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="group flex items-center gap-2 px-6 py-3 rounded-xl bg-accent hover:bg-accent-hover text-black font-semibold transition-all shadow-lg shadow-accent/20 hover:shadow-accent/40 hover:scale-105"
        >
          {showForm ? (
            <>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Cancel
            </>
          ) : (
            <>
              <svg className="w-5 h-5 transition-transform group-hover:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              Add bike
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="rounded-xl bg-red-400/10 border border-red-400/30 px-5 py-4 flex items-start gap-3">
          <svg className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Add Bike Form */}
      {showForm && (
        <div className="rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 p-6 md:p-8 max-w-2xl backdrop-blur-sm animate-slide-down">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h2 className="font-heading text-2xl font-semibold">Add new bike</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm text-white/70 mb-2 font-medium">Brand *</label>
                <input
                  value={form.brand}
                  onChange={(e) => setForm((f) => ({ ...f, brand: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition"
                  placeholder="e.g. Honda"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-white/70 mb-2 font-medium">Model *</label>
                <input
                  value={form.model}
                  onChange={(e) => setForm((f) => ({ ...f, model: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition"
                  placeholder="e.g. CBR600RR"
                  required
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm text-white/70 mb-2 font-medium">Year *</label>
                <input
                  type="number"
                  value={form.year}
                  onChange={(e) => setForm((f) => ({ ...f, year: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition"
                  min="1900"
                  max={new Date().getFullYear() + 1}
                  placeholder="e.g. 2023"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-white/70 mb-2 font-medium">Plate number</label>
                <input
                  value={form.plate_number}
                  onChange={(e) => setForm((f) => ({ ...f, plate_number: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition"
                  placeholder="e.g. ABC-1234"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm text-white/70 mb-2 font-medium">Engine (cc)</label>
                <input
                  type="number"
                  value={form.engine_cc}
                  onChange={(e) => setForm((f) => ({ ...f, engine_cc: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition"
                  placeholder="e.g. 600"
                />
              </div>
              <div>
                <label className="block text-sm text-white/70 mb-2 font-medium">Current mileage (km)</label>
                <input
                  type="number"
                  value={form.current_mileage}
                  onChange={(e) => setForm((f) => ({ ...f, current_mileage: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition"
                  min="0"
                  placeholder="e.g. 15000"
                />
              </div>
            </div>

            <button type="submit" className="w-full sm:w-auto px-8 py-3 rounded-xl bg-accent hover:bg-accent-hover text-black font-semibold transition-all shadow-lg shadow-accent/20 hover:shadow-accent/40 hover:scale-105">
              Add bike
            </button>
          </form>
        </div>
      )}

      {/* Bikes Grid */}
      {bikes.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {bikes.map((bike, i) => (
            <div
              key={bike.bike_id}
              className={`group rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 overflow-hidden hover:border-accent/30 transition-all duration-300 hover:transform hover:-translate-y-2 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              style={{ transitionDelay: `${i * 50}ms` }}
            >
              {/* Bike Image */}
              <div className="relative aspect-video bg-gradient-to-br from-white/5 to-transparent flex items-center justify-center overflow-hidden">
                {bike.photo ? (
                  <img 
                    src={`${API_BASE}${bike.photo}`} 
                    alt={`${bike.brand} ${bike.model}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                  />
                ) : (
                  <div className="text-center">
                    <svg className="w-16 h-16 text-white/20 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-white/30 font-heading text-lg">{bike.brand}</span>
                  </div>
                )}
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              {/* Bike Info */}
              <div className="p-6">
                <h2 className="font-heading text-xl font-semibold mb-2 group-hover:text-accent transition-colors">
                  {bike.brand} {bike.model}
                </h2>
                
                <div className="flex items-center gap-3 text-sm text-white/60 mb-4">
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {bike.year}
                  </span>
                  {bike.engine_cc && (
                    <>
                      <span className="text-white/30">•</span>
                      <span>{bike.engine_cc} cc</span>
                    </>
                  )}
                </div>

                {/* Mileage Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent/10 border border-accent/20 mb-5">
                  <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span className="text-accent font-semibold text-sm">
                    {bike.current_mileage?.toLocaleString() ?? 0} km
                  </span>
                </div>

                {/* Action Links */}
                <div className="flex flex-wrap gap-2 pt-4 border-t border-white/10">
                  <Link 
                    to={`/bikes/${bike.bike_id}`} 
                    className="text-sm text-accent hover:text-accent-hover font-medium transition flex items-center gap-1 group/link"
                  >
                    Edit
                    <svg className="w-3 h-3 transition-transform group-hover/link:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                  <span className="text-white/20">•</span>
                  <Link to={`/bikes/${bike.bike_id}/services`} className="text-sm text-white/60 hover:text-white transition">Services</Link>
                  <span className="text-white/20">•</span>
                  <Link to={`/bikes/${bike.bike_id}/mileage`} className="text-sm text-white/60 hover:text-white transition">Mileage</Link>
                  <span className="text-white/20">•</span>
                  <Link to={`/bikes/${bike.bike_id}/expenses`} className="text-sm text-white/60 hover:text-white transition">Expenses</Link>
                </div>

                {/* Delete Button */}
                <button 
                  type="button" 
                  onClick={() => handleDelete(bike.bike_id)} 
                  className="mt-4 w-full py-2 rounded-lg text-sm text-red-400/80 hover:text-red-400 hover:bg-red-400/10 border border-transparent hover:border-red-400/20 transition-all"
                >
                  Delete bike
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : !showForm && (
        <div className="text-center py-20">
          <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <p className="text-white/60 text-lg mb-2">Your garage is empty</p>
          <p className="text-white/40 text-sm">Click "Add bike" to get started</p>
        </div>
      )}

      <style>{`
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}