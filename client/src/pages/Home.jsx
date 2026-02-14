import { Link } from 'react-router-dom';
import { getAuthUser } from '../api';
import { useEffect, useState } from 'react';

const PARTS_BASE = '/images/Homepage/Maintinance%20parts';
const MAINTENANCE_PARTS = [
  { img: `${PARTS_BASE}/120ml-Petron-Scooter-Gear-Oil.jpg`, name: 'Gear oil' },
  { img: `${PARTS_BASE}/scooter-LE-4T.jpg`, name: 'Engine oil' },
  { img: `${PARTS_BASE}/Standard-A_500x.webp`, name: 'Brake fluid' },
  { img: `${PARTS_BASE}/images.jpg`, name: 'Maintenance parts' },
];

const SHOP_LINKS = [
  { name: 'Shopee', logo: '/images/Homepage/shopee-logo.jpeg', url: 'https://shopee.ph/' },
  { name: 'Lazada', logo: '/images/Homepage/lazada-logo.png', url: 'https://www.lazada.com.ph/' },
];

export default function Home() {
  const user = getAuthUser();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="relative min-h-screen">
      {/* Animated background elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-30">
        <div className="absolute top-20 right-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse-slower" />
      </div>

      <div className="relative py-16">
        {/* Hero */}
        <section className={`relative text-center max-w-3xl mx-auto mb-32 min-h-[320px] flex flex-col justify-center transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="px-4">
            {/* Decorative top element */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-accent/50" />
              <svg className="w-8 h-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-accent/50" />
            </div>

            <h1 className="font-heading text-6xl md:text-7xl font-bold tracking-tight mb-6 relative">
              <span className="bg-gradient-to-b from-white to-white/70 bg-clip-text text-transparent">
                MotoCare
              </span>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-accent to-transparent" />
            </h1>
            
            <p className="text-xl md:text-2xl text-white/80 leading-relaxed mb-4 font-light">
              Precision maintenance tracking for the <span className="text-accent font-medium">serious rider</span>
            </p>
            <p className="text-base text-white/60 mb-12 max-w-2xl mx-auto">
              Track every service, monitor costs, log mileage—all in one refined workspace built for motorcycle enthusiasts who demand excellence.
            </p>
            
            {user ? (
              <Link
                to="/dashboard"
                className="group inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-accent hover:bg-accent-hover text-black font-heading font-semibold text-lg transition-all shadow-lg shadow-accent/20 hover:shadow-accent/40 hover:scale-105"
              >
                Go to Dashboard
                <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            ) : (
              <div className="flex gap-4 justify-center flex-wrap">
                <Link
                  to="/register"
                  className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-accent hover:bg-accent-hover text-black font-heading font-semibold text-lg transition-all shadow-lg shadow-accent/20 hover:shadow-accent/40 hover:scale-105"
                >
                  Get started
                  <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border-2 border-white/20 hover:border-accent/50 text-white font-medium transition-all hover:bg-white/5 backdrop-blur-sm"
                >
                  Log in
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* How it works */}
        <section className={`max-w-5xl mx-auto mb-32 px-4 transition-all duration-1000 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">How it works</h2>
            <div className="w-16 h-1 bg-accent mx-auto rounded-full" />
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                number: '01',
                title: 'Register your fleet',
                desc: 'Add each motorcycle with detailed specifications—brand, model, year, engine size, and current mileage.',
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                )
              },
              {
                number: '02',
                title: 'Log maintenance',
                desc: 'Record every service event, from routine oil changes to major overhauls, with costs and shop details.',
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                )
              },
              {
                number: '03',
                title: 'Monitor & optimize',
                desc: 'Visualize spending patterns, track mileage trends, and make data-driven decisions about your bikes.',
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                )
              }
            ].map((step, i) => (
              <div 
                key={i} 
                className="relative group"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative rounded-2xl bg-white/5 border border-white/10 p-8 backdrop-blur-sm hover:border-accent/30 transition-all duration-300 hover:transform hover:-translate-y-1">
                  {/* Step number */}
                  <div className="absolute -top-4 -left-4 w-12 h-12 rounded-xl bg-gradient-to-br from-accent to-accent/80 text-black font-heading font-bold text-xl flex items-center justify-center shadow-lg shadow-accent/20">
                    {step.number}
                  </div>
                  
                  {/* Icon */}
                  <div className="w-16 h-16 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 text-accent group-hover:scale-110 transition-transform">
                    {step.icon}
                  </div>
                  
                  <h3 className="font-heading text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-white/70 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Suggested maintenance parts */}
        <section className={`max-w-6xl mx-auto mb-32 px-4 transition-all duration-1000 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">Essential maintenance supplies</h2>
            <p className="text-white/60 text-lg">Quality parts for quality care</p>
            <div className="w-16 h-1 bg-accent mx-auto rounded-full mt-4" />
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {MAINTENANCE_PARTS.map((part, i) => (
              <div
                key={part.name}
                className="group relative rounded-2xl overflow-hidden bg-white/5 border border-white/10 hover:border-accent/30 transition-all duration-300 hover:transform hover:-translate-y-2"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="aspect-square relative bg-white/5 overflow-hidden">
                  <img
                    src={part.img}
                    alt={part.name}
                    className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="relative p-4 bg-gradient-to-t from-black/40 to-transparent">
                  <p className="text-center text-sm font-medium text-white">{part.name}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Shop platforms */}
        <section className={`max-w-4xl mx-auto mb-16 px-4 transition-all duration-1000 delay-400 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="rounded-3xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 p-12 backdrop-blur-sm">
            <h3 className="text-center text-2xl font-heading font-semibold mb-3">Order parts online</h3>
            <p className="text-center text-white/60 mb-10">Trusted platforms for motorcycle parts and accessories</p>
            
            <div className="flex flex-wrap justify-center gap-8">
              {SHOP_LINKS.map((shop, i) => (
                <a
                  key={shop.name}
                  href={shop.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-center w-40 h-32 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 hover:border-accent/30 transition-all p-6 hover:transform hover:scale-105"
                  title={`Shop at ${shop.name}`}
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <img
                    src={shop.logo}
                    alt={shop.name}
                    className="max-w-full max-h-full object-contain opacity-90 group-hover:opacity-100 transition-opacity"
                  />
                </a>
              ))}
            </div>
          </div>
        </section>
      </div>

      <style>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.05); }
        }
        @keyframes pulse-slower {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.08); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 8s ease-in-out infinite;
        }
        .animate-pulse-slower {
          animation: pulse-slower 12s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}