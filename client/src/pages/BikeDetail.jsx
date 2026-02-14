import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiGet, apiPut, apiUpload } from '../api';

const API_BASE = import.meta.env.VITE_API_URL || '';

export default function BikeDetail() {
  const { bikeId } = useParams();
  const [bike, setBike] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [photoFile, setPhotoFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    apiGet(`/api/bikes/${bikeId}`)
      .then((data) => {
        setBike(data);
        setForm({
          brand: data.brand,
          model: data.model,
          year: data.year,
          plate_number: data.plate_number || '',
          engine_cc: data.engine_cc || '',
          current_mileage: data.current_mileage ?? '',
        });
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [bikeId]);

  async function handleSave(e) {
    e.preventDefault();
    setError('');
    try {
      const updated = await apiPut(`/api/bikes/${bikeId}`, {
        ...form,
        year: form.year ? parseInt(form.year, 10) : undefined,
        engine_cc: form.engine_cc ? parseInt(form.engine_cc, 10) : undefined,
        current_mileage: form.current_mileage != null && form.current_mileage !== '' ? parseInt(form.current_mileage, 10) : undefined,
      });
      setBike(updated);
      setEditing(false);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handlePhotoUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError('');
    const fd = new FormData();
    fd.append('photo', file);
    try {
      const result = await apiUpload(`/api/bikes/${bikeId}/photo`, fd);
      setBike((b) => ({ ...b, photo: result.photo }));
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
      setPhotoFile(null);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-accent/30 border-t-accent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/60">Loading…</p>
        </div>
      </div>
    );
  }

  if (error && !bike) return <p className="text-red-400">{error}</p>;
  if (!bike) return null;

  return (
    <div className="space-y-8 pb-12">
      {/* Breadcrumb & Title */}
      <div className={`transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
        <Link to="/bikes" className="inline-flex items-center gap-2 text-white/60 hover:text-accent text-sm mb-4 transition group">
          <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
          Back to garage
        </Link>
        <h1 className="font-heading text-4xl font-bold">
          {bike.brand} <span className="text-accent">{bike.model}</span>
        </h1>
      </div>

      {error && (
        <div className="rounded-xl bg-red-400/10 border border-red-400/30 px-5 py-4 flex items-start gap-3">
          <svg className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Main Content Grid */}
      <div className={`grid lg:grid-cols-3 gap-8 transition-all duration-700 delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        {/* Photo Section */}
        <div className="lg:col-span-1">
          <div className="rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 p-6 backdrop-blur-sm sticky top-8">
            <h2 className="font-heading text-lg font-semibold mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Bike photo
            </h2>
            
            <div className="aspect-[4/3] rounded-xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 overflow-hidden flex items-center justify-center mb-4 group relative">
              {bike.photo ? (
                <>
                  <img src={`${API_BASE}${bike.photo}`} alt={`${bike.brand} ${bike.model}`} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <p className="text-white/90 text-sm">Click below to change photo</p>
                  </div>
                </>
              ) : (
                <div className="text-center">
                  <svg className="w-12 h-12 text-white/20 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-white/30 text-sm">No photo</span>
                </div>
              )}
            </div>
            
            <label className="block">
              <span className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 hover:border-accent/30 text-sm font-medium cursor-pointer transition-all hover:scale-105">
                {uploading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Uploading…
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    Upload photo
                  </>
                )}
              </span>
              <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} disabled={uploading} />
            </label>
          </div>
        </div>

        {/* Details Section */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 p-6 md:p-8 backdrop-blur-sm">
            {editing ? (
              <form onSubmit={handleSave} className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                  <h2 className="font-heading text-2xl font-semibold">Edit details</h2>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm text-white/70 mb-2 font-medium">Brand</label>
                    <input
                      value={form.brand}
                      onChange={(e) => setForm((f) => ({ ...f, brand: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-white/70 mb-2 font-medium">Model</label>
                    <input
                      value={form.model}
                      onChange={(e) => setForm((f) => ({ ...f, model: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm text-white/70 mb-2 font-medium">Year</label>
                    <input
                      type="number"
                      value={form.year}
                      onChange={(e) => setForm((f) => ({ ...f, year: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-white/70 mb-2 font-medium">Plate number</label>
                    <input
                      value={form.plate_number}
                      onChange={(e) => setForm((f) => ({ ...f, plate_number: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition"
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
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-white/70 mb-2 font-medium">Current mileage (km)</label>
                    <input
                      type="number"
                      value={form.current_mileage}
                      onChange={(e) => setForm((f) => ({ ...f, current_mileage: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button type="submit" className="px-6 py-3 rounded-xl bg-accent hover:bg-accent-hover text-black font-semibold transition-all shadow-lg shadow-accent/20 hover:shadow-accent/40 hover:scale-105">
                    Save changes
                  </button>
                  <button type="button" onClick={() => setEditing(false)} className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 hover:border-white/20 transition">
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h2 className="font-heading text-2xl font-semibold">Specifications</h2>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => setEditing(true)} 
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 border border-white/10 hover:border-accent/30 text-sm font-medium transition-all hover:scale-105"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </button>
                </div>

                <dl className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <dt className="text-white/50 text-sm font-medium">Year</dt>
                    <dd className="text-white text-lg font-semibold">{bike.year}</dd>
                  </div>
                  
                  {bike.plate_number && (
                    <div className="space-y-1">
                      <dt className="text-white/50 text-sm font-medium">Plate number</dt>
                      <dd className="text-white text-lg font-semibold">{bike.plate_number}</dd>
                    </div>
                  )}
                  
                  {bike.engine_cc && (
                    <div className="space-y-1">
                      <dt className="text-white/50 text-sm font-medium">Engine</dt>
                      <dd className="text-white text-lg font-semibold">{bike.engine_cc} cc</dd>
                    </div>
                  )}
                  
                  <div className="space-y-1">
                    <dt className="text-white/50 text-sm font-medium">Current mileage</dt>
                    <dd className="text-accent text-lg font-semibold flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      {bike.current_mileage?.toLocaleString() ?? 0} km
                    </dd>
                  </div>
                </dl>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className={`transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <h3 className="font-heading text-xl font-semibold mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Quick actions
        </h3>
        <div className="grid sm:grid-cols-3 gap-4">
          <Link 
            to={`/bikes/${bikeId}/services`} 
            className="group flex items-center gap-4 p-6 rounded-2xl bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20 hover:border-accent/40 transition-all hover:transform hover:-translate-y-1"
          >
            <div className="w-12 h-12 rounded-xl bg-accent/20 border border-accent/30 flex items-center justify-center text-accent group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-white">Service history</p>
              <p className="text-sm text-white/60">View & log services</p>
            </div>
          </Link>

          <Link 
            to={`/bikes/${bikeId}/mileage`} 
            className="group flex items-center gap-4 p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 hover:border-accent/30 transition-all hover:transform hover:-translate-y-1"
          >
            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 group-hover:text-accent group-hover:scale-110 transition-all">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-white">Mileage tracker</p>
              <p className="text-sm text-white/60">Log distance</p>
            </div>
          </Link>

          <Link 
            to={`/bikes/${bikeId}/expenses`} 
            className="group flex items-center gap-4 p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 hover:border-accent/30 transition-all hover:transform hover:-translate-y-1"
          >
            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 group-hover:text-accent group-hover:scale-110 transition-all">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-white">Expenses</p>
              <p className="text-sm text-white/60">Track costs</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}