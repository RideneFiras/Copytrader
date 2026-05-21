import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import toast from 'react-hot-toast';
import Layout from '../components/Layout.jsx';
import { StatSkeleton } from '../components/Skeleton.jsx';
import { api, apiErr } from '../lib/api.js';

const Stat = ({ label, value, sub, accent }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="card"
  >
    <div className="text-xs uppercase tracking-wider text-white/40 mb-2">{label}</div>
    <div className={`font-display text-3xl font-semibold ${accent || ''}`}>{value}</div>
    {sub && <div className="text-xs text-white/40 mt-1">{sub}</div>}
  </motion.div>
);

export default function Performance() {
  const [stats, setStats] = useState(null);
  const [signals, setSignals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get('/signals/stats'), api.get('/signals?limit=50')])
      .then(([a, b]) => {
        setStats(a.data.stats);
        setSignals(b.data.signals);
      })
      .catch((err) => toast.error(apiErr(err, 'Failed to load performance')))
      .finally(() => setLoading(false));
  }, []);

  const pie = stats
    ? [
        { name: 'Wins', value: stats.wins, color: '#34d399' },
        { name: 'Losses', value: stats.losses, color: '#f87171' },
        { name: 'BE', value: stats.breakeven, color: '#9ca3af' },
      ].filter((s) => s.value > 0)
    : [];

  const closed = signals.filter((s) => s.status === 'closed' && !s.locked).slice(0, 12).reverse();
  const bar = closed.map((s) => ({
    name: s.asset,
    pips: s.pips || 0,
  }));

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="font-display text-3xl font-semibold">Performance</h1>
        <p className="text-white/50 mt-1">Track record, win rate, and recent trades.</p>
      </motion.div>

      {loading ? (
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <StatSkeleton key={i} />
          ))}
        </div>
      ) : stats ? (
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <Stat
            label="Win rate"
            value={`${stats.winRate}%`}
            sub={`${stats.wins}W / ${stats.losses}L`}
            accent="gold-text"
          />
          <Stat label="Total signals" value={stats.totalSignals} />
          <Stat label="Open" value={stats.openCount} sub="Live setups" />
          <Stat
            label="Net pips"
            value={stats.totalPips > 0 ? `+${stats.totalPips}` : stats.totalPips}
            accent={stats.totalPips >= 0 ? 'text-emerald-300' : 'text-red-300'}
          />
        </div>
      ) : null}

      {!loading && stats && (
        <div className="grid lg:grid-cols-2 gap-4 mb-6">
          <div className="card">
            <h3 className="font-display text-lg font-semibold mb-4">Outcome distribution</h3>
            {pie.length === 0 ? (
              <p className="text-sm text-white/50">No closed trades yet.</p>
            ) : (
              <div className="h-64">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={pie}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={55}
                      outerRadius={90}
                      paddingAngle={3}
                    >
                      {pie.map((entry, i) => (
                        <Cell key={i} fill={entry.color} stroke="none" />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: '#10131c',
                        border: '1px solid rgba(212,175,55,0.25)',
                        borderRadius: 12,
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          <div className="card">
            <h3 className="font-display text-lg font-semibold mb-4">Pips per recent trade</h3>
            {bar.length === 0 ? (
              <p className="text-sm text-white/50">No closed trades yet.</p>
            ) : (
              <div className="h-64">
                <ResponsiveContainer>
                  <BarChart data={bar}>
                    <CartesianGrid stroke="rgba(255,255,255,0.06)" />
                    <XAxis dataKey="name" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                    <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        background: '#10131c',
                        border: '1px solid rgba(212,175,55,0.25)',
                        borderRadius: 12,
                      }}
                    />
                    <Bar dataKey="pips" radius={[6, 6, 0, 0]}>
                      {bar.map((entry, i) => (
                        <Cell key={i} fill={entry.pips >= 0 ? '#34d399' : '#f87171'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="card">
        <h3 className="font-display text-lg font-semibold mb-4">Recent trade history</h3>
        <div className="overflow-x-auto -mx-2">
          <table className="w-full text-sm">
            <thead className="text-left text-white/40 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-2 py-2">Asset</th>
                <th className="px-2 py-2">Direction</th>
                <th className="px-2 py-2">Entry</th>
                <th className="px-2 py-2">TP / SL</th>
                <th className="px-2 py-2">Result</th>
                <th className="px-2 py-2">Pips</th>
                <th className="px-2 py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {signals
                .filter((s) => !s.locked)
                .slice(0, 20)
                .map((s) => (
                  <tr key={s._id} className="border-t border-white/5">
                    <td className="px-2 py-2 font-medium">{s.asset}</td>
                    <td className="px-2 py-2">
                      <span
                        className={
                          s.direction === 'BUY'
                            ? 'text-emerald-300'
                            : 'text-red-300'
                        }
                      >
                        {s.direction}
                      </span>
                    </td>
                    <td className="px-2 py-2">{s.entry}</td>
                    <td className="px-2 py-2 text-white/60">
                      {s.takeProfit} / {s.stopLoss}
                    </td>
                    <td className="px-2 py-2 capitalize">
                      {s.status === 'open' ? (
                        <span className="text-blue-300">live</span>
                      ) : s.result === 'win' ? (
                        <span className="text-emerald-300">win</span>
                      ) : s.result === 'loss' ? (
                        <span className="text-red-300">loss</span>
                      ) : (
                        <span className="text-white/50">{s.result}</span>
                      )}
                    </td>
                    <td
                      className={`px-2 py-2 ${
                        (s.pips || 0) > 0
                          ? 'text-emerald-300'
                          : (s.pips || 0) < 0
                          ? 'text-red-300'
                          : 'text-white/40'
                      }`}
                    >
                      {s.pips ? (s.pips > 0 ? `+${s.pips}` : s.pips) : '—'}
                    </td>
                    <td className="px-2 py-2 text-white/40">
                      {new Date(s.publishedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
