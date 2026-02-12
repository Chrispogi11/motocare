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

  useEffect(() => {
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

  if (loading) return <p className="text-white/60">Loading…</p>;
  if (error && !bike) return <p className="text-red-400">{error}</p>;
  if (!bike) return null;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center gap-4">
        <Link to="/bikes" className="text-white/60 hover:text-white text-sm">← Bikes</Link>
        <h1 className="font-heading text-3xl font-bold">{bike.brand} {bike.model}</h1>
      </div>

      {error && (
        <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/30 rounded-lg px-4 py-2">{error}</p>
      )}

      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-shrink-0">
          <div className="w-64 h-48 rounded-xl bg-white/5 border border-white/10 overflow-hidden flex items-center justify-center">
            {bike.photo ? (
              <img src={`${API_BASE}${bike.photo}`} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="text-white/30 font-heading text-2xl">No photo</span>
            )}
          </div>
          <label className="mt-3 inline-block">
            <span className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-sm cursor-pointer transition">
              {uploading ? 'Uploading…' : 'Upload photo'}
            </span>
            <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} disabled={uploading} />
          </label>
        </div>

        <div className="flex-1 min-w-0">
          {editing ? (
            <form onSubmit={handleSave} className="space-y-4 max-w-md">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-white/70 mb-1">Brand</label>
                  <input
                    value={form.brand}
                    onChange={(e) => setForm((f) => ({ ...f, brand: e.target.value }))}
                    className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/20 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/70 mb-1">Model</label>
                  <input
                    value={form.model}
                    onChange={(e) => setForm((f) => ({ ...f, model: e.target.value }))}
                    className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/20 text-white"
                  />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-white/70 mb-1">Year</label>
                  <input
                    type="number"
                    value={form.year}
                    onChange={(e) => setForm((f) => ({ ...f, year: e.target.value }))}
                    className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/20 text-white"
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
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button type="submit" className="px-4 py-2 rounded-lg bg-accent hover:bg-accent-hover text-black font-semibold">Save</button>
                <button type="button" onClick={() => setEditing(false)} className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20">Cancel</button>
              </div>
            </form>
          ) : (
            <>
              <dl className="space-y-2 text-white/80">
                <div><dt className="text-white/50 text-sm">Year</dt><dd>{bike.year}</dd></div>
                {bike.plate_number && <div><dt className="text-white/50 text-sm">Plate</dt><dd>{bike.plate_number}</dd></div>}
                {bike.engine_cc && <div><dt className="text-white/50 text-sm">Engine</dt><dd>{bike.engine_cc} cc</dd></div>}
                <div><dt className="text-white/50 text-sm">Current mileage</dt><dd className="text-accent font-medium">{bike.current_mileage?.toLocaleString() ?? 0}</dd></div>
              </dl>
              <button type="button" onClick={() => setEditing(true)} className="mt-4 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-sm">Edit bike</button>
            </>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-4 pt-4 border-t border-white/10">
        <Link to={`/bikes/${bikeId}/services`} className="px-5 py-2 rounded-lg bg-accent/20 text-accent hover:bg-accent/30 font-medium transition">Service history</Link>
        <Link to={`/bikes/${bikeId}/mileage`} className="px-5 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition">Mileage</Link>
        <Link to={`/bikes/${bikeId}/expenses`} className="px-5 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition">Expenses</Link>
      </div>
    </div>
  );
}
