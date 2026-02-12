import { Link } from 'react-router-dom';
import { getAuthUser } from '../api';

export default function Home() {
  const user = getAuthUser();

  return (
    <div className="py-16">
      <section className="text-center max-w-2xl mx-auto mb-24">
        <h1 className="font-heading text-5xl md:text-6xl font-bold tracking-tight mb-6">
          MotoCare
        </h1>
        <p className="text-xl text-white/80 leading-relaxed mb-10">
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
      </section>
      <section className="grid md:grid-cols-3 gap-12 text-center">
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
    </div>
  );
}
