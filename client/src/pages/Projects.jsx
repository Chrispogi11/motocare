import { useEffect, useState } from 'react';

export default function Projects() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="py-8 pb-16">
      <div className={`max-w-3xl mx-auto text-center transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20 flex items-center justify-center mx-auto mb-8">
          <svg className="w-10 h-10 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>

        <h1 className="font-heading text-5xl font-bold mb-6">Projects</h1>
        
        <p className="text-white/70 text-lg leading-relaxed mb-12">
          This section is reserved for future motorcycle project tracking features, custom builds, 
          modifications, and restoration work. Stay tuned for updates!
        </p>

        <div className="rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 p-12 backdrop-blur-sm">
          <h2 className="font-heading text-2xl font-semibold mb-4">Coming Soon</h2>
          <ul className="text-white/60 space-y-3 max-w-md mx-auto text-left">
            <li className="flex items-start gap-3">
              <svg className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Track custom builds and modifications</span>
            </li>
            <li className="flex items-start gap-3">
              <svg className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Document restoration projects</span>
            </li>
            <li className="flex items-start gap-3">
              <svg className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Log upgrade parts and performance gains</span>
            </li>
            <li className="flex items-start gap-3">
              <svg className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Share progress with the community</span>
            </li>
          </ul>
        </div>

        <div className={`mt-12 transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <p className="text-white/50 text-sm mb-4">In the meantime, explore the rest of MotoCare</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a
              href="/bikes"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 hover:border-accent/30 transition-all"
            >
              Go to garage
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
            <a
              href="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent hover:bg-accent-hover text-black font-semibold transition-all shadow-lg shadow-accent/20 hover:shadow-accent/40 hover:scale-105"
            >
              View dashboard
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}