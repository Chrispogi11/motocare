import { Link } from 'react-router-dom';
import { getAuthUser } from '../api';

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

  return (
    <div className="relative min-h-screen py-16">
      {/* Hero */}
      <section className="relative text-center max-w-2xl mx-auto mb-24 min-h-[280px] flex flex-col justify-center">
        <div className="px-4">
          <h1 className="font-heading text-5xl md:text-6xl font-bold tracking-tight mb-6">
            MotoCare
          </h1>
          <p className="text-xl text-white/90 leading-relaxed mb-10">
            Track maintenance, mileage, and costs for your motorcycles. One place for everything.
          </p>
          {user ? (
            <Link
              to="/dashboard"
              className="inline-block px-8 py-4 rounded-lg bg-accent hover:bg-accent-hover text-black font-heading font-semibold text-lg transition"
            >
              Go to Dashboard
            </Link>
          ) : (
            <div className="flex gap-4 justify-center flex-wrap">
              <Link
                to="/register"
                className="inline-block px-8 py-4 rounded-lg bg-accent hover:bg-accent-hover text-black font-heading font-semibold text-lg transition"
              >
                Get started
              </Link>
              <Link
                to="/login"
                className="inline-block px-8 py-4 rounded-lg border border-white/30 hover:border-white text-white font-medium transition"
              >
                Log in
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* How it works */}
      <section className="grid md:grid-cols-3 gap-12 text-center mb-16">
        <div>
          <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4 text-accent font-heading text-xl">1</div>
          <h2 className="font-heading text-xl font-semibold mb-2">Add your bikes</h2>
          <p className="text-white/70">Register each motorcycle with brand, model, year, and mileage.</p>
        </div>
        <div>
          <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4 text-accent font-heading text-xl">2</div>
          <h2 className="font-heading text-xl font-semibold mb-2">Log services & costs</h2>
          <p className="text-white/70">Record oil changes, repairs, and expenses in one place.</p>
        </div>
        <div>
          <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4 text-accent font-heading text-xl">3</div>
          <h2 className="font-heading text-xl font-semibold mb-2">Stay on top</h2>
          <p className="text-white/70">Dashboards and trends help you maintain properly and control costs.</p>
        </div>
      </section>

      {/* Suggested maintenance parts */}
      <section className="mb-20">
        <h2 className="font-heading text-2xl md:text-3xl font-bold text-center mb-10">
          Suggested parts for maintenance
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {MAINTENANCE_PARTS.map((part) => (
            <div
              key={part.name}
              className="rounded-xl overflow-hidden bg-white/5 border border-white/10 hover:border-white/20 transition"
            >
              <div className="aspect-square relative bg-white/5">
                <img
                  src={part.img}
                  alt={part.name}
                  className="w-full h-full object-contain p-2"
                />
              </div>
              <p className="text-center text-sm text-white/80 py-2 font-medium">{part.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Shop platforms */}
      <section className="mb-16">
        <p className="text-center text-white/70 mb-6">Get parts from these online platforms</p>
        <div className="flex flex-wrap justify-center gap-8">
          {SHOP_LINKS.map((shop) => (
            <a
              key={shop.name}
              href={shop.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-32 h-32 md:w-40 md:h-40 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 hover:border-white/20 transition p-4"
              title={`Open ${shop.name}`}
            >
              <img
                src={shop.logo}
                alt={shop.name}
                className="max-w-full max-h-full object-contain"
              />
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
