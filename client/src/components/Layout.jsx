import { useEffect, useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { getAuthUser, setAuth, setAuthUser } from '../api';
import homeBg from '../assets/homebg.jpg';

const BODY_BG_DEFAULT = 'linear-gradient(180deg, #0a0a0a 0%, #000000 100%)';

export default function Layout() {
  const user = getAuthUser();
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.background = isHome ? 'transparent' : BODY_BG_DEFAULT;
    return () => {
      document.body.style.background = BODY_BG_DEFAULT;
    };
  }, [isHome]);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  function handleLogout() {
    setAuth(null);
    setAuthUser(null);
    setMobileMenuOpen(false);
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
            aria-hidden="true"
          />
          <div className="fixed inset-0 bg-black/50 z-0" aria-hidden="true" />
        </>
      )}

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 backdrop-blur-md bg-black/60">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link 
              to="/" 
              className="font-heading text-2xl font-bold tracking-tight hover:text-accent transition flex items-center gap-2"
            >
              <svg className="w-7 h-7 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              MotoCare
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6">
              <Link to="/" className="text-white/80 hover:text-accent transition font-medium">Home</Link>
              <Link to="/about" className="text-white/80 hover:text-accent transition font-medium">About</Link>
              <Link to="/projects" className="text-white/80 hover:text-accent transition font-medium">Projects</Link>
              
              {user ? (
                <>
                  <Link to="/dashboard" className="text-white/80 hover:text-accent transition font-medium">Dashboard</Link>
                  <Link to="/bikes" className="text-white/80 hover:text-accent transition font-medium">Bikes</Link>
                  <Link to="/photos" className="text-white/80 hover:text-accent transition font-medium">Photos</Link>
                  
                  <div className="h-6 w-px bg-white/20 mx-2" />
                  
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
                      <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span className="text-white/80 text-sm font-medium">{user.name}</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 hover:border-white/20 transition text-sm font-medium"
                    >
                      Log out
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-white/80 hover:text-accent transition font-medium">Log in</Link>
                  <Link
                    to="/register"
                    className="px-5 py-2.5 rounded-lg bg-accent hover:bg-accent-hover text-black font-semibold transition shadow-lg shadow-accent/20 hover:shadow-accent/40 hover:scale-105"
                  >
                    Sign up
                  </Link>
                </>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          
          {/* Menu Panel */}
          <div className="absolute top-0 right-0 h-full w-80 max-w-[85vw] bg-gradient-to-br from-[#0a0a0a] to-black border-l border-white/10 shadow-2xl animate-slide-in">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <span className="font-heading text-xl font-bold">Menu</span>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-lg hover:bg-white/10 transition"
                  aria-label="Close menu"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="flex-1 overflow-y-auto p-6">
                <div className="space-y-2">
                  <Link
                    to="/"
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 transition group"
                  >
                    <svg className="w-5 h-5 text-white/60 group-hover:text-accent transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    <span className="font-medium">Home</span>
                  </Link>

                  <Link
                    to="/about"
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 transition group"
                  >
                    <svg className="w-5 h-5 text-white/60 group-hover:text-accent transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-medium">About</span>
                  </Link>

                  <Link
                    to="/projects"
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 transition group"
                  >
                    <svg className="w-5 h-5 text-white/60 group-hover:text-accent transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <span className="font-medium">Projects</span>
                  </Link>

                  {user && (
                    <>
                      <div className="h-px bg-white/10 my-4" />

                      <Link
                        to="/dashboard"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 transition group"
                      >
                        <svg className="w-5 h-5 text-white/60 group-hover:text-accent transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        <span className="font-medium">Dashboard</span>
                      </Link>

                      <Link
                        to="/bikes"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 transition group"
                      >
                        <svg className="w-5 h-5 text-white/60 group-hover:text-accent transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                        </svg>
                        <span className="font-medium">Bikes</span>
                      </Link>

                      <Link
                        to="/photos"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 transition group"
                      >
                        <svg className="w-5 h-5 text-white/60 group-hover:text-accent transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="font-medium">Photos</span>
                      </Link>
                    </>
                  )}
                </div>
              </nav>

              {/* Footer */}
              <div className="p-6 border-t border-white/10">
                {user ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/5 border border-white/10">
                      <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span className="font-medium text-sm">{user.name}</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full px-4 py-3 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/30 text-red-400 font-medium transition flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Log out
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Link
                      to="/login"
                      className="block w-full px-4 py-3 rounded-lg bg-white/10 hover:bg-white/15 border border-white/10 hover:border-white/20 text-center font-medium transition"
                    >
                      Log in
                    </Link>
                    <Link
                      to="/register"
                      className="block w-full px-4 py-3 rounded-lg bg-accent hover:bg-accent-hover text-black text-center font-semibold transition shadow-lg shadow-accent/20"
                    >
                      Sign up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 mt-24 py-8">
        <div className="max-w-6xl mx-auto px-6 text-center text-white/50 text-sm">
          MotoCare - Keep your ride maintained.
        </div>
      </footer>

      <style>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}