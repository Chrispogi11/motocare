import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiGet } from '../api';

const API_BASE = import.meta.env.VITE_API_URL || '';

export default function Photos() {
  const [bikes, setBikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    apiGet('/api/bikes')
      .then(setBikes)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-accent/30 border-t-accent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/60">Loading photos…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-12">
      <div className={`transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
        <h1 className="font-heading text-4xl font-bold mb-3">Photo Gallery</h1>
        <p className="text-white/70 max-w-2xl text-lg">
          Your motorcycle collection in one place. Upload or change photos from each bike's detail page.
        </p>
      </div>

      {bikes.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {bikes.map((bike, i) => (
            <Link
              key={bike.bike_id}
              to={`/bikes/${bike.bike_id}`}
              className={`group block rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 overflow-hidden hover:border-accent/30 transition-all duration-300 hover:transform hover:-translate-y-2 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              style={{ transitionDelay: `${i * 50 + 100}ms` }}
            >
              <div className="aspect-video bg-gradient-to-br from-white/5 to-transparent flex items-center justify-center relative overflow-hidden">
                {bike.photo ? (
                  <>
                    <img
                      src={`${API_BASE}${bike.photo}`}
                      alt={`${bike.brand} ${bike.model}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </>
                ) : (
                  <div className="text-center">
                    <svg className="w-16 h-16 text-white/20 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-white/30 text-sm">No photo</span>
                  </div>
                )}
              </div>

              <div className="p-6 relative">
                <h2 className="font-heading font-semibold text-xl mb-2 group-hover:text-accent transition-colors">
                  {bike.brand} {bike.model}
                </h2>
                <div className="flex items-center gap-3 text-sm text-white/60">
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

                {bike.current_mileage != null && (
                  <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-accent/10 border border-accent/20">
                    <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span className="text-accent font-semibold text-sm">
                      {bike.current_mileage.toLocaleString()} km
                    </span>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className={`text-center py-20 transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-white/60 text-lg mb-2">No bikes in your garage yet</p>
          <p className="text-white/40 text-sm mb-6">Add a bike and upload photos from its detail page</p>
          <Link
            to="/bikes"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent hover:bg-accent-hover text-black font-semibold transition-all shadow-lg shadow-accent/20 hover:shadow-accent/40 hover:scale-105"
          >
            Go to garage
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      )}
    </div>
  );
}