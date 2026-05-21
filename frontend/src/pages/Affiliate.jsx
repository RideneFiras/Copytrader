import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Layout from '../components/Layout.jsx';
import { api } from '../lib/api.js';

const Bullet = ({ children }) => (
  <li className="flex items-start gap-2.5 text-sm text-white/80">
    <span className="mt-1 w-1.5 h-1.5 rounded-full bg-gold flex-none" />
    {children}
  </li>
);

export default function Affiliate() {
  const [url, setUrl] = useState('https://goai.example.com/?ref=copytrader');

  useEffect(() => {
    api
      .get('/affiliate')
      .then(({ data }) => setUrl(data.url))
      .catch(() => {});
  }, []);

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden card glass-gold p-10 md:p-14 text-center mb-8"
      >
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-gold/20 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-gold/10 blur-3xl" />

        <div className="relative">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-bg-1/80 text-xs uppercase tracking-[0.2em] text-gold mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
            Recommended by Copytrader
          </div>

          <h1 className="font-display text-4xl md:text-5xl font-bold leading-tight mb-4">
            Boost your profits with <span className="gold-text">AI</span>.
          </h1>
          <p className="text-white/70 max-w-2xl mx-auto text-lg mb-8">
            Combine our signals with GoAI's automation and analytics. Get a
            measurable edge — institutional-grade tooling, retail-friendly UX.
          </p>

          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="btn-primary text-base px-6 py-3"
          >
            Try GoAI free →
          </a>
          <p className="text-xs text-white/40 mt-4">
            Affiliate disclosure: we earn a commission if you sign up — at no extra cost to you.
          </p>
        </div>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="card"
        >
          <h3 className="font-display text-xl font-semibold mb-3">Why pair GoAI with us?</h3>
          <ul className="space-y-2">
            <Bullet>AI-curated entries refine the timing of our human signals.</Bullet>
            <Bullet>Automated risk management — never blow an account by mistake.</Bullet>
            <Bullet>Backtests every setup against years of tick data in seconds.</Bullet>
            <Bullet>Beautiful analytics that show what's actually working.</Bullet>
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.08 }}
          className="card"
        >
          <h3 className="font-display text-xl font-semibold mb-3">The Copytrader stack</h3>
          <ol className="space-y-3 text-sm text-white/80">
            <li>
              <div className="text-gold font-medium">1. Our signals</div>
              <div className="text-white/60">Daily setups with entry, TP, and SL.</div>
            </li>
            <li>
              <div className="text-gold font-medium">2. GoAI execution</div>
              <div className="text-white/60">Automated entries, intelligent SL/TP management.</div>
            </li>
            <li>
              <div className="text-gold font-medium">3. Compound</div>
              <div className="text-white/60">Reinvest gains, track everything on one dashboard.</div>
            </li>
          </ol>

          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="btn-ghost w-full mt-5"
          >
            Open GoAI →
          </a>
        </motion.div>
      </div>
    </Layout>
  );
}
