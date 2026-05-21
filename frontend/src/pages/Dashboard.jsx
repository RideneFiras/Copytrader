import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import Layout from '../components/Layout.jsx';
import SignalCard from '../components/SignalCard.jsx';
import { SignalSkeleton } from '../components/Skeleton.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { api, apiErr } from '../lib/api.js';

export default function Dashboard() {
  const { user } = useAuth();
  const [signals, setSignals] = useState([]);
  const [premium, setPremium] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api
      .get('/signals')
      .then(({ data }) => {
        if (cancelled) return;
        setSignals(data.signals);
        setPremium(data.premium);
      })
      .catch((err) => {
        if (cancelled) return;
        const msg = apiErr(err, 'Failed to load signals');
        setError(msg);
        toast.error(msg);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8 flex flex-wrap items-end justify-between gap-4"
      >
        <div>
          <h1 className="font-display text-3xl font-semibold">
            Hi, {user?.name?.split(' ')[0] || 'Trader'} 👋
          </h1>
          <p className="text-white/50 mt-1">Today's trading signals — at a glance.</p>
        </div>
        {!premium && (
          <Link to="/affiliate" className="btn-primary">
            Unlock Premium ✨
          </Link>
        )}
      </motion.div>

      {!premium && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="card glass-gold mb-6 flex items-center justify-between gap-4"
        >
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-gold/80 mb-1">
              Free plan
            </div>
            <p className="text-sm text-white/80">
              You're seeing only today's free signal. Upgrade to view every setup.
            </p>
          </div>
          <Link to="/affiliate" className="btn-primary">
            Upgrade
          </Link>
        </motion.div>
      )}

      {loading ? (
        <div className="grid md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SignalSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <div className="card border-red-400/30">
          <h3 className="font-semibold text-red-300 mb-1">Couldn't load signals</h3>
          <p className="text-sm text-white/60">{error}</p>
        </div>
      ) : signals.length === 0 ? (
        <div className="card text-center py-12">
          <div className="text-3xl mb-2">📭</div>
          <h3 className="font-display text-lg font-semibold mb-1">No signals yet</h3>
          <p className="text-sm text-white/50">New setups will appear here as soon as they're published.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {signals.map((s, i) => (
            <SignalCard key={s._id} signal={s} index={i} />
          ))}
        </div>
      )}
    </Layout>
  );
}
