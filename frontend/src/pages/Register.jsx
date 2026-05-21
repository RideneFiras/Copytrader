import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import Layout from '../components/Layout.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { apiErr } from '../lib/api.js';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    if (password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    setLoading(true);
    try {
      await register(name, email, password);
      toast.success('Account created');
      navigate('/dashboard');
    } catch (err) {
      toast.error(apiErr(err, 'Registration failed'));
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
          <h1 className="font-display text-2xl font-semibold mb-1">Create your account</h1>
          <p className="text-sm text-white/50 mb-6">Free to start. Upgrade anytime.</p>

          <label className="label">Name</label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input mb-4"
            placeholder="Your name"
          />

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
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input mb-6"
            placeholder="At least 8 characters"
          />

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Creating…' : 'Create account'}
          </button>

          <p className="mt-5 text-sm text-white/50 text-center">
            Already a member?{' '}
            <Link to="/login" className="text-gold hover:underline">
              Sign in
            </Link>
          </p>
        </motion.form>
      </div>
    </Layout>
  );
}
