const ABOUT_SECTIONS = [
  {
    image: '/images/about%20page/about-1.jpg',
    description: (
      <>
        <h3 className="font-heading text-xl font-semibold mb-3">Stay Ahead of Maintenance, Not Behind Repairs</h3>
        <p className="text-white/80 leading-relaxed mb-3">
          Routine maintenance is the foundation of a reliable motorcycle.
          MotoCare lets you log every service — from oil changes to major repairs — so you always know what's been done, when it was done, and what's coming next.
        </p>
        <p className="text-white/80 leading-relaxed">
          No more guessing. No more missed service intervals. Just clear records that keep your bike running at its best.
        </p>
      </>
    ),
    imageLeft: false,
  },
  {
    image: '/images/about%20page/about-2.jpg',
    description: (
      <>
        <h3 className="font-heading text-xl font-semibold mb-3">Build Consistent Care Into Every Ride</h3>
        <p className="text-white/80 leading-relaxed mb-3">
          Great bikes aren't maintained once — they're maintained consistently.
          With MotoCare, you can track mileage, schedule service reminders, and create a complete care history for each motorcycle you own.
        </p>
        <p className="text-white/80 leading-relaxed">
          Whether it's routine cleaning, chain adjustments, or brake checks, everything is stored in one simple digital workspace built for riders.
        </p>
      </>
    ),
    imageLeft: true,
  },
  {
    image: '/images/about%20page/about-3.jpg',
    description: (
      <>
        <h3 className="font-heading text-xl font-semibold mb-3">Understand the True Cost of Motorcycle Ownership</h3>
        <p className="text-white/80 leading-relaxed mb-3">
          Maintenance isn't just about performance — it's about smart ownership.
          MotoCare helps you record fuel, parts, labor, and service costs, then turns them into clean visual summaries.
        </p>
        <p className="text-white/80 leading-relaxed">
          See monthly spending, long-term costs, and maintenance patterns so you can plan better, save money, and ride with confidence.
        </p>
      </>
    ),
    imageLeft: false,
  },
];

export default function About() {
  return (
    <div className="py-8">
      <h1 className="font-heading text-4xl font-bold mb-8">About MotoCare</h1>
      <div className="max-w-xl space-y-6 text-white/80 leading-relaxed mb-16">
        <p>
          MotoCare helps motorcycle owners maintain their bikes and understand ownership costs.
        </p>
        <p>
          Add your bikes, log services and mileage, track expenses, and upload photos—all in a clean, minimal app built for riders.
        </p>
        <p>
          No clutter. No overengineering. Just what you need to keep your ride in shape.
        </p>
      </div>

      {/* Three image + description sections */}
      <div className="space-y-20">
        {ABOUT_SECTIONS.map((section, i) => (
          <section
            key={i}
            className={`grid md:grid-cols-2 gap-8 md:gap-12 items-center ${section.imageLeft ? '' : ''}`}
          >
            <div className={section.imageLeft ? 'md:order-1' : ''}>
              <div className="rounded-xl overflow-hidden border border-white/10 bg-white/5">
                <img
                  src={section.image}
                  alt=""
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
            <div className={section.imageLeft ? 'md:order-2' : ''}>
              <div className="max-w-lg">
                {section.description}
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
