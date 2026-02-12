import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiPost, setAuth, setAuthUser } from '../api';

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { user, token } = await apiPost('/api/auth/register', { name, email, password });
      setAuth(token);
      setAuthUser(user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto py-12">
      <h1 className="font-heading text-3xl font-bold mb-8">Create account</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/30 rounded-lg px-4 py-2">
            {error}
          </p>
        )}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-white/80 mb-2">Name</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            placeholder="Your name"
            required
          />
        </div>
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
            placeholder="Min 8 characters"
            minLength={8}
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-lg bg-accent hover:bg-accent-hover text-black font-semibold transition disabled:opacity-50"
        >
          {loading ? 'Creating…' : 'Sign up'}
        </button>
      </form>
      <p className="mt-6 text-center text-white/60 text-sm">
        Already have an account?{' '}
        <Link to="/login" className="text-accent hover:underline">Log in</Link>
      </p>
    </div>
  );
}
