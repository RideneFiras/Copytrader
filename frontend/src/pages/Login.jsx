import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import Layout from '../components/Layout.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { apiErr } from '../lib/api.js';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back');
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(apiErr(err, 'Login failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto pt-10">
        <motion.form
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          onSubmit={submit}
          className="card"
        >
          <h1 className="font-display text-2xl font-semibold mb-1">Welcome back</h1>
          <p className="text-sm text-white/50 mb-6">Sign in to access your dashboard.</p>

          <label className="label">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input mb-4"
            placeholder="you@example.com"
          />

          <label className="label">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input mb-6"
            placeholder="••••••••"
          />

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Signing in…' : 'Sign in'}
          </button>

          <p className="mt-5 text-sm text-white/50 text-center">
            No account?{' '}
            <Link to="/register" className="text-gold hover:underline">
              Create one
            </Link>
          </p>
        </motion.form>
      </div>
    </Layout>
  );
}
