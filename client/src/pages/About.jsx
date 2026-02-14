import { useEffect, useState } from 'react';

const ABOUT_SECTIONS = [
  {
    image: '/images/about%20page/about-1.jpg',
    title: 'Stay Ahead of Maintenance, Not Behind Repairs',
    description: 'Routine maintenance is the foundation of a reliable motorcycle. MotoCare lets you log every service - from oil changes to major repairs - so you always know what\'s been done, when it was done, and what\'s coming next. No more guessing. No more missed service intervals. Just clear records that keep your bike running at its best.',
    imageLeft: false,
  },
  {
    image: '/images/about%20page/about-2.jpg',
    title: 'Build Consistent Care Into Every Ride',
    description: 'Great bikes aren\'t maintained once - they\'re maintained consistently. With MotoCare, you can track mileage, schedule service reminders, and create a complete care history for each motorcycle you own. Whether it\'s routine cleaning, chain adjustments, or brake checks, everything is stored in one simple digital workspace built for riders.',
    imageLeft: true,
  },
  {
    image: '/images/about%20page/about-3.jpg',
    title: 'Understand the True Cost of Motorcycle Ownership',
    description: 'Maintenance isn\'t just about performance - it\'s about smart ownership. MotoCare helps you record fuel, parts, labor, and service costs, then turns them into clean visual summaries. See monthly spending, long-term costs, and maintenance patterns so you can plan better, save money, and ride with confidence.',
    imageLeft: false,
  },
];

export default function About() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="py-8 pb-16">
      <div className={`transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
        <h1 className="font-heading text-5xl font-bold mb-6">About MotoCare</h1>
        <div className="max-w-2xl space-y-4 text-white/80 text-lg leading-relaxed mb-20">
          <p>
            MotoCare helps motorcycle owners maintain their bikes and understand ownership costs.
          </p>
          <p>
            Add your bikes, log services and mileage, track expenses, and upload photos—all in a clean, minimal app built for riders.
          </p>
          <p className="text-accent font-medium">
            No clutter. No overengineering. Just what you need to keep your ride in shape.
          </p>
        </div>
      </div>

      <div className="space-y-24">
        {ABOUT_SECTIONS.map((section, i) => (
          <section
            key={i}
            className={`grid md:grid-cols-2 gap-12 items-center transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            style={{ transitionDelay: `${(i + 1) * 200}ms` }}
          >
            <div className={`${section.imageLeft ? 'md:order-2' : ''}`}>
              <div className="rounded-2xl overflow-hidden border border-white/10 bg-white/5 group">
                <img
                  src={section.image}
                  alt={section.title}
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>

            <div className={`${section.imageLeft ? 'md:order-1' : ''}`}>
              <div className="max-w-lg">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                    <span className="font-heading text-xl font-bold">{i + 1}</span>
                  </div>
                  <h3 className="font-heading text-2xl md:text-3xl font-semibold">{section.title}</h3>
                </div>
                <p className="text-white/80 leading-relaxed text-lg">
                  {section.description}
                </p>
              </div>
            </div>
          </section>
        ))}
      </div>

      <div className={`mt-24 text-center transition-all duration-700 delay-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div className="inline-block px-8 py-4 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 backdrop-blur-sm">
          <p className="text-white/70 mb-2">Ready to get started?</p>
          <a
            href="/register"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent hover:bg-accent-hover text-black font-semibold transition-all shadow-lg shadow-accent/20 hover:shadow-accent/40 hover:scale-105"
          >
            Create your account
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}