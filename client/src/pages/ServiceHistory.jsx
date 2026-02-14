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
  const [mounted, setMounted] = useState(false);
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
    setMounted(true);
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
    setShowForm(true);
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
      }
      setShowForm(false);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-accent/30 border-t-accent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/60">Loading service history…</p>
        </div>
      </div>
    );
  }

  if (!bike) return <p className="text-red-400">{error || 'Bike not found'}</p>;

  const totalCost = services.reduce((sum, s) => sum + Number(s.cost || 0), 0);

  return (
    <div className="space-y-8 pb-12">
      {/* Breadcrumb & Header */}
      <div className={`transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
        <Link to={`/bikes/${bikeId}`} className="inline-flex items-center gap-2 text-white/60 hover:text-accent text-sm mb-4 transition group">
          <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
          Back to bike
        </Link>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="font-heading text-4xl font-bold mb-2">Service History</h1>
            <p className="text-white/60">{bike.brand} {bike.model} · {bike.year}</p>
          </div>
          <button
            type="button"
            onClick={() => { 
              setShowForm(true); 
              setEditingId(null); 
              setForm({ service_type: '', description: '', service_date: new Date().toISOString().slice(0, 10), mileage_at_service: '', cost: '', shop_name: '' }); 
            }}
            className="group flex items-center gap-2 px-6 py-3 rounded-xl bg-accent hover:bg-accent-hover text-black font-semibold transition-all shadow-lg shadow-accent/20 hover:shadow-accent/40 hover:scale-105"
          >
            <svg className="w-5 h-5 transition-transform group-hover:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            Add service
          </button>
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

      {/* Stats Card */}
      <div className={`grid sm:grid-cols-2 gap-6 transition-all duration-700 delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div className="rounded-2xl bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20 p-6 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-accent/20 border border-accent/30 flex items-center justify-center text-accent">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-white/60 text-sm font-medium">Total service cost</p>
              <p className="text-accent font-heading text-3xl font-bold">${totalCost.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 p-6 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/60">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <div>
              <p className="text-white/60 text-sm font-medium">Services logged</p>
              <p className="text-white font-heading text-3xl font-bold">{services.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Service Form */}
      {showForm && (
        <div className={`rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 p-6 md:p-8 max-w-2xl backdrop-blur-sm animate-slide-down transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
            <h2 className="font-heading text-2xl font-semibold">{editingId ? 'Edit service' : 'Log new service'}</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm text-white/70 mb-2 font-medium">Service type *</label>
              <input
                value={form.service_type}
                onChange={(e) => setForm((f) => ({ ...f, service_type: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition"
                placeholder="e.g. Oil change, Tire replacement, Chain adjustment"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-white/70 mb-2 font-medium">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition resize-none"
                rows={3}
                placeholder="Additional notes about this service..."
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm text-white/70 mb-2 font-medium">Service date *</label>
                <input
                  type="date"
                  value={form.service_date}
                  onChange={(e) => setForm((f) => ({ ...f, service_date: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-white/70 mb-2 font-medium">Mileage at service</label>
                <input
                  type="number"
                  value={form.mileage_at_service}
                  onChange={(e) => setForm((f) => ({ ...f, mileage_at_service: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition"
                  min="0"
                  placeholder="km"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm text-white/70 mb-2 font-medium">Cost</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-white/40">$</span>
                  </div>
                  <input
                    type="number"
                    step="0.01"
                    value={form.cost}
                    onChange={(e) => setForm((f) => ({ ...f, cost: e.target.value }))}
                    className="w-full pl-8 pr-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition"
                    min="0"
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-white/70 mb-2 font-medium">Shop name</label>
                <input
                  value={form.shop_name}
                  onChange={(e) => setForm((f) => ({ ...f, shop_name: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition"
                  placeholder="Where was it serviced?"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button type="submit" className="px-6 py-3 rounded-xl bg-accent hover:bg-accent-hover text-black font-semibold transition-all shadow-lg shadow-accent/20 hover:shadow-accent/40 hover:scale-105">
                {editingId ? 'Update service' : 'Save service'}
              </button>
              <button 
                type="button" 
                onClick={() => { setShowForm(false); setEditingId(null); }} 
                className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 hover:border-white/20 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Services List */}
      {services.length > 0 ? (
        <div className="space-y-4">
          {services.map((s, i) => (
            <div
              key={s.service_id}
              className={`group rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 p-6 backdrop-blur-sm hover:border-accent/30 transition-all duration-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              style={{ transitionDelay: `${i * 50 + 300}ms` }}
            >
              <div className="flex flex-wrap justify-between items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center text-accent flex-shrink-0 group-hover:scale-110 transition-transform">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-heading font-semibold text-xl mb-1">{s.service_type}</h3>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-white/60">
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {s.service_date}
                        </span>
                        {s.mileage_at_service != null && (
                          <>
                            <span className="text-white/30">•</span>
                            <span className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                              </svg>
                              {s.mileage_at_service.toLocaleString()} km
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {s.description && (
                    <p className="text-white/70 mb-3 pl-13">{s.description}</p>
                  )}

                  {s.shop_name && (
                    <p className="text-white/50 text-sm flex items-center gap-2 pl-13">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      {s.shop_name}
                    </p>
                  )}
                </div>

                <div className="flex flex-col items-end gap-3">
                  {s.cost != null && Number(s.cost) > 0 && (
                    <div className="px-4 py-2 rounded-lg bg-accent/10 border border-accent/20">
                      <span className="text-accent font-semibold text-lg">${Number(s.cost).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <button 
                      type="button" 
                      onClick={() => openEdit(s)} 
                      className="text-sm text-white/60 hover:text-white font-medium transition flex items-center gap-1 group/edit"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </button>
                    <span className="text-white/20">•</span>
                    <button 
                      type="button" 
                      onClick={() => handleDelete(s.service_id)} 
                      className="text-sm text-red-400/80 hover:text-red-400 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : !showForm && (
        <div className={`text-center py-20 transition-all duration-700 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <p className="text-white/60 text-lg mb-2">No service records yet</p>
          <p className="text-white/40 text-sm">Click "Add service" to log your first maintenance</p>
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