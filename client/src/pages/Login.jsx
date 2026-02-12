import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiPost, setAuth, setAuthUser } from '../api';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { user, token } = await apiPost('/api/auth/login', { email, password });
      setAuth(token);
      setAuthUser(user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto py-12">
      <h1 className="font-heading text-3xl font-bold mb-8">Log in</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/30 rounded-lg px-4 py-2">
            {error}
          </p>
        )}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-2">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            placeholder="you@example.com"
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-white/80 mb-2">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-lg bg-accent hover:bg-accent-hover text-black font-semibold transition disabled:opacity-50"
        >
          {loading ? 'Signing in…' : 'Log in'}
        </button>
      </form>
      <p className="mt-6 text-center text-white/60 text-sm">
        No account? <Link to="/register" className="text-accent hover:underline">Sign up</Link>
      </p>
    </div>
  );
}
