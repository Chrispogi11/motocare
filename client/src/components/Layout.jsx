import { useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { getAuthUser, setAuth, setAuthUser } from '../api';
import homeBg from '../assets/homebg.jpg';

const BODY_BG_DEFAULT = 'linear-gradient(180deg, #0a0a0a 0%, #000000 100%)';

export default function Layout() {
  const user = getAuthUser();
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    document.body.style.background = isHome ? 'transparent' : BODY_BG_DEFAULT;
    return () => {
      document.body.style.background = BODY_BG_DEFAULT;
    };
  }, [isHome]);

  function handleLogout() {
    setAuth(null);
    setAuthUser(null);
    navigate('/');
  }

  return (
    <div className={`min-h-screen text-white font-body relative ${isHome ? 'bg-transparent' : 'bg-gradient-to-b from-[#0a0a0a] to-black'}`}>
      {/* Full-page home background (only on home route) */}
      {isHome && (
        <>
          <div
            className="fixed inset-0 bg-cover bg-center bg-no-repeat z-0"
            style={{ backgroundImage: `url(${homeBg})` }}
            aria-hidden
          />
          <div className="fixed inset-0 bg-black/50 z-0" aria-hidden />
        </>
      )}
      <header className="relative z-10 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
          <Link to="/" className="font-heading text-2xl font-bold tracking-tight">
            MotoCare
          </Link>
          <nav className="flex flex-wrap items-center gap-4 sm:gap-8">
            <Link to="/" className="text-white/80 hover:text-white transition">Home</Link>
            <Link to="/about" className="text-white/80 hover:text-white transition">About</Link>
            <Link to="/projects" className="text-white/80 hover:text-white transition">Projects</Link>
            {user ? (
              <>
                <Link to="/dashboard" className="text-white/80 hover:text-white transition">Dashboard</Link>
                <Link to="/bikes" className="text-white/80 hover:text-white transition">Bikes</Link>
                <Link to="/photos" className="text-white/80 hover:text-white transition">Photos</Link>
                <span className="text-white/60 text-sm">{user.name}</span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition text-sm"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-white/80 hover:text-white transition">Log in</Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-lg bg-accent hover:bg-accent-hover text-black font-medium transition"
                >
                  Sign up
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>
      <main className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        <Outlet />
      </main>
      <footer className="relative z-10 border-t border-white/10 mt-24 py-8">
        <div className="max-w-6xl mx-auto px-6 text-center text-white/50 text-sm">
          MotoCare — Keep your ride maintained.
        </div>
      </footer>
    </div>
  );
}
