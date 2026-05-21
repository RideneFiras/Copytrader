import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext.jsx';
import { apiErr } from '../lib/api.js';

export default function AdminPasswordModal({ open, onClose }) {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { adminAuth } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await adminAuth(password);
      toast.success('Admin access granted');
      onClose();
      setPassword('');
      navigate('/admin');
    } catch (err) {
      toast.error(apiErr(err, 'Invalid password'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <motion.form
            initial={{ y: 20, opacity: 0, scale: 0.97 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            onSubmit={submit}
            className="w-full max-w-sm glass rounded-2xl p-6 shadow-glow"
          >
            <div className="mb-1 text-xs uppercase tracking-[0.2em] text-gold/80">
              Restricted area
            </div>
            <h3 className="font-display text-xl font-semibold mb-4">Admin Panel</h3>
            <label className="label">Password</label>
            <input
              autoFocus
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              placeholder="••••••••"
            />
            <div className="mt-5 flex gap-2 justify-end">
              <button type="button" onClick={onClose} className="btn-ghost">
                Cancel
              </button>
              <button type="submit" disabled={loading || !password} className="btn-primary">
                {loading ? 'Verifying…' : 'Unlock'}
              </button>
            </div>
          </motion.form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
