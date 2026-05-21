import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../components/Layout.jsx';

const Feature = ({ title, desc, icon }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.4 }}
    className="card group hover:border-gold/30 transition"
  >
    <div className="text-2xl mb-3">{icon}</div>
    <h3 className="font-display text-lg font-semibold mb-1.5">{title}</h3>
    <p className="text-sm text-white/60 leading-relaxed">{desc}</p>
  </motion.div>
);

export default function Landing() {
  return (
    <Layout>
      <section className="relative pt-10 pb-20">
        <div className="absolute inset-0 grid-bg pointer-events-none -z-10" />

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-gold text-xs uppercase tracking-[0.2em] text-gold mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
            Daily signals · XAUUSD · FX · Crypto
          </div>
          <h1 className="font-display text-5xl md:text-6xl font-bold leading-[1.05] tracking-tight mb-6">
            Trade <span className="gold-text">smarter</span>.
            <br />
            Copy <span className="gold-text">winning setups</span>.
          </h1>
          <p className="text-lg text-white/60 max-w-2xl mx-auto mb-8">
            Premium trading signals delivered daily. Entry, take profit, stop loss —
            engineered by analysts and refined with AI.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link to="/register" className="btn-primary">
              Start free →
            </Link>
            <Link to="/login" className="btn-ghost">
              I have an account
            </Link>
          </div>
        </motion.div>

        <div className="mt-16 grid md:grid-cols-3 gap-4">
          <Feature
            icon="📈"
            title="Daily edge"
            desc="At least one fully detailed signal every trading day, with rationale and risk management."
          />
          <Feature
            icon="🛡"
            title="Risk first"
            desc="Every trade ships with a stop loss and take profit — no naked positions, ever."
          />
          <Feature
            icon="⚡"
            title="Premium speed"
            desc="Upgrade to unlock unlimited signals, swing setups, and the full performance dashboard."
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-20 card text-center"
        >
          <h2 className="font-display text-3xl font-semibold mb-3">
            Built for traders who value <span className="gold-text">clarity</span>.
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto mb-6">
            Stop second-guessing. Get a clean dashboard of actionable setups, a transparent
            performance log, and a community focused on consistency.
          </p>
          <Link to="/register" className="btn-primary">
            Create your account
          </Link>
        </motion.div>
      </section>
    </Layout>
  );
}
