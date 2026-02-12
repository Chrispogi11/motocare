import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiGet } from '../api';

const API_BASE = import.meta.env.VITE_API_URL || '';

export default function Photos() {
  const [bikes, setBikes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet('/api/bikes')
      .then(setBikes)
      .finally(() => setLoading(false));
  }, []);

  const withPhoto = bikes.filter((b) => b.photo);

  if (loading) return <p className="text-white/60">Loading…</p>;

  return (
    <div className="space-y-8">
      <h1 className="font-heading text-4xl font-bold">Photos</h1>
      <p className="text-white/70 max-w-xl">
        Bike photos from your garage. Upload or change a photo from each bike’s detail page.
      </p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {bikes.map((bike) => (
          <Link key={bike.bike_id} to={`/bikes/${bike.bike_id}`} className="block rounded-xl bg-white/5 border border-white/10 overflow-hidden hover:border-white/20 transition">
            <div className="aspect-video bg-white/5 flex items-center justify-center">
              {bike.photo ? (
                <img src={`${API_BASE}${bike.photo}`} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="text-white/30 font-heading text-2xl">No photo</span>
              )}
            </div>
            <div className="p-4">
              <h2 className="font-heading font-semibold">{bike.brand} {bike.model}</h2>
              <p className="text-white/50 text-sm">{bike.year}</p>
            </div>
          </Link>
        ))}
      </div>
      {bikes.length === 0 && (
        <p className="text-white/50">
          No bikes yet. <Link to="/bikes" className="text-accent hover:underline">Add a bike</Link> and upload a photo from its detail page.
        </p>
      )}
    </div>
  );
}
