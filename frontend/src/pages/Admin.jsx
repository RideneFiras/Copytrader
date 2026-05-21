import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import Layout from '../components/Layout.jsx';
import { api, apiErr } from '../lib/api.js';

const emptySignal = {
  asset: 'XAUUSD',
  direction: 'BUY',
  entry: '',
  takeProfit: '',
  stopLoss: '',
  note: '',
  isPremiumOnly: false,
};

export default function Admin() {
  const [tab, setTab] = useState('signals');
  const [stats, setStats] = useState(null);
  const [signals, setSignals] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(emptySignal);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const loadStats = useCallback(async () => {
    try {
      const { data } = await api.get('/admin/stats');
      setStats(data.stats);
    } catch (err) {
      toast.error(apiErr(err));
    }
  }, []);

  const loadSignals = useCallback(async () => {
    try {
      const { data } = await api.get('/signals?limit=100');
      setSignals(data.signals);
    } catch (err) {
      toast.error(apiErr(err));
    }
  }, []);

  const loadUsers = useCallback(async () => {
    try {
      const { data } = await api.get(`/admin/users${search ? `?q=${encodeURIComponent(search)}` : ''}`);
      setUsers(data.users);
    } catch (err) {
      toast.error(apiErr(err));
    }
  }, [search]);

  useEffect(() => {
    loadStats();
    loadSignals();
    loadUsers();
  }, [loadStats, loadSignals, loadUsers]);

  const submitSignal = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        entry: Number(form.entry),
        takeProfit: Number(form.takeProfit),
        stopLoss: Number(form.stopLoss),
      };
      if (editingId) {
        await api.patch(`/admin/signals/${editingId}`, payload);
        toast.success('Signal updated');
      } else {
        await api.post('/admin/signals', payload);
        toast.success('Signal created');
      }
      setForm(emptySignal);
      setEditingId(null);
      loadSignals();
      loadStats();
    } catch (err) {
      toast.error(apiErr(err));
    } finally {
      setLoading(false);
    }
  };

  const editSignal = (s) => {
    setEditingId(s._id);
    setForm({
      asset: s.asset,
      direction: s.direction,
      entry: s.entry,
      takeProfit: s.takeProfit,
      stopLoss: s.stopLoss,
      note: s.note || '',
      isPremiumOnly: !!s.isPremiumOnly,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closeSignal = async (id, result) => {
    try {
      await api.patch(`/admin/signals/${id}`, { status: 'closed', result });
      toast.success(`Marked as ${result}`);
      loadSignals();
      loadStats();
    } catch (err) {
      toast.error(apiErr(err));
    }
  };

  const deleteSignal = async (id) => {
    if (!confirm('Delete this signal?')) return;
    try {
      await api.delete(`/admin/signals/${id}`);
      toast.success('Deleted');
      loadSignals();
      loadStats();
    } catch (err) {
      toast.error(apiErr(err));
    }
  };

  const togglePremium = async (id, isPremium) => {
    try {
      await api.patch(`/admin/users/${id}/premium`, {
        isPremium: !isPremium,
        days: !isPremium ? 30 : 0,
      });
      toast.success(!isPremium ? 'Premium granted (30d)' : 'Premium revoked');
      loadUsers();
      loadStats();
    } catch (err) {
      toast.error(apiErr(err));
    }
  };

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex flex-wrap items-center justify-between gap-3"
      >
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-gold/80 mb-1">
            Restricted area
          </div>
          <h1 className="font-display text-3xl font-semibold">Admin panel</h1>
        </div>
        <div className="flex gap-2">
          {['signals', 'users', 'stats'].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`btn-ghost capitalize ${tab === t ? 'border-gold/40 text-white' : ''}`}
            >
              {t}
            </button>
          ))}
        </div>
      </motion.div>

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <MiniStat label="Users" value={stats.totalUsers} />
          <MiniStat label="Premium" value={stats.premiumUsers} accent="gold-text" />
          <MiniStat label="Signals" value={stats.totalSignals} />
          <MiniStat label="Win rate" value={`${stats.winRate}%`} />
        </div>
      )}

      {tab === 'signals' && (
        <>
          <form onSubmit={submitSignal} className="card mb-6">
            <h3 className="font-display text-lg font-semibold mb-4">
              {editingId ? 'Edit signal' : 'New signal'}
            </h3>
            <div className="grid md:grid-cols-3 gap-3">
              <div>
                <label className="label">Asset</label>
                <input
                  className="input"
                  value={form.asset}
                  onChange={(e) => setForm({ ...form, asset: e.target.value.toUpperCase() })}
                  required
                />
              </div>
              <div>
                <label className="label">Direction</label>
                <select
                  className="input"
                  value={form.direction}
                  onChange={(e) => setForm({ ...form, direction: e.target.value })}
                >
                  <option>BUY</option>
                  <option>SELL</option>
                </select>
              </div>
              <div>
                <label className="label">Entry</label>
                <input
                  type="number"
                  step="any"
                  className="input"
                  value={form.entry}
                  onChange={(e) => setForm({ ...form, entry: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="label">Take Profit</label>
                <input
                  type="number"
                  step="any"
                  className="input"
                  value={form.takeProfit}
                  onChange={(e) => setForm({ ...form, takeProfit: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="label">Stop Loss</label>
                <input
                  type="number"
                  step="any"
                  className="input"
                  value={form.stopLoss}
                  onChange={(e) => setForm({ ...form, stopLoss: e.target.value })}
                  required
                />
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.isPremiumOnly}
                    onChange={(e) => setForm({ ...form, isPremiumOnly: e.target.checked })}
                    className="w-4 h-4 accent-gold"
                  />
                  Premium only
                </label>
              </div>
              <div className="md:col-span-3">
                <label className="label">Note (optional)</label>
                <input
                  className="input"
                  value={form.note}
                  onChange={(e) => setForm({ ...form, note: e.target.value })}
                  placeholder="Reasoning, context, key levels…"
                />
              </div>
            </div>
            <div className="mt-4 flex gap-2 justify-end">
              {editingId && (
                <button
                  type="button"
                  className="btn-ghost"
                  onClick={() => {
                    setForm(emptySignal);
                    setEditingId(null);
                  }}
                >
                  Cancel
                </button>
              )}
              <button type="submit" disabled={loading} className="btn-primary">
                {loading ? 'Saving…' : editingId ? 'Update signal' : 'Publish signal'}
              </button>
            </div>
          </form>

          <div className="card">
            <h3 className="font-display text-lg font-semibold mb-4">All signals</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-white/40 text-xs uppercase tracking-wider text-left">
                  <tr>
                    <th className="py-2 px-2">Asset</th>
                    <th className="py-2 px-2">Dir.</th>
                    <th className="py-2 px-2">Entry / TP / SL</th>
                    <th className="py-2 px-2">Status</th>
                    <th className="py-2 px-2">Result</th>
                    <th className="py-2 px-2">Pips</th>
                    <th className="py-2 px-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {signals.map((s) => (
                    <tr key={s._id} className="border-t border-white/5">
                      <td className="px-2 py-2 font-medium">{s.asset}</td>
                      <td className="px-2 py-2">{s.direction}</td>
                      <td className="px-2 py-2 text-white/70">
                        {s.entry} / {s.takeProfit} / {s.stopLoss}
                      </td>
                      <td className="px-2 py-2 capitalize">{s.status}</td>
                      <td className="px-2 py-2 capitalize">{s.result}</td>
                      <td className="px-2 py-2">{s.pips || '—'}</td>
                      <td className="px-2 py-2">
                        <div className="flex gap-1.5 justify-end">
                          {s.status === 'open' && (
                            <>
                              <button
                                onClick={() => closeSignal(s._id, 'win')}
                                className="text-emerald-300 hover:text-emerald-200 text-xs px-2 py-1 rounded-md border border-emerald-400/20"
                              >
                                Win
                              </button>
                              <button
                                onClick={() => closeSignal(s._id, 'loss')}
                                className="text-red-300 hover:text-red-200 text-xs px-2 py-1 rounded-md border border-red-400/20"
                              >
                                Loss
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => editSignal(s)}
                            className="text-white/70 hover:text-white text-xs px-2 py-1 rounded-md border border-white/10"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteSignal(s._id)}
                            className="text-red-300 hover:text-red-200 text-xs px-2 py-1 rounded-md border border-red-400/20"
                          >
                            ×
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {tab === 'users' && (
        <div className="card">
          <div className="flex items-center justify-between mb-4 gap-3">
            <h3 className="font-display text-lg font-semibold">Users</h3>
            <input
              className="input max-w-xs"
              placeholder="Search by email or name…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-white/40 text-xs uppercase tracking-wider text-left">
                <tr>
                  <th className="py-2 px-2">Name</th>
                  <th className="py-2 px-2">Email</th>
                  <th className="py-2 px-2">Role</th>
                  <th className="py-2 px-2">Premium</th>
                  <th className="py-2 px-2">Since</th>
                  <th className="py-2 px-2"></th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-t border-white/5">
                    <td className="px-2 py-2">{u.name}</td>
                    <td className="px-2 py-2 text-white/70">{u.email}</td>
                    <td className="px-2 py-2 capitalize">{u.role}</td>
                    <td className="px-2 py-2">
                      {u.isPremium ? (
                        <span className="text-gold">✓ {u.premiumUntil ? `until ${new Date(u.premiumUntil).toLocaleDateString()}` : 'lifetime'}</span>
                      ) : (
                        <span className="text-white/50">No</span>
                      )}
                    </td>
                    <td className="px-2 py-2 text-white/50">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-2 py-2 text-right">
                      {u.role !== 'admin' && (
                        <button
                          onClick={() => togglePremium(u.id, u.isPremium)}
                          className="btn-ghost text-xs py-1 px-2"
                        >
                          {u.isPremium ? 'Revoke' : 'Grant 30d'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'stats' && stats && (
        <div className="grid md:grid-cols-2 gap-4">
          <MiniStat label="Total users" value={stats.totalUsers} large />
          <MiniStat label="Premium users" value={stats.premiumUsers} large accent="gold-text" />
          <MiniStat label="Total signals" value={stats.totalSignals} large />
          <MiniStat label="Open signals" value={stats.openSignals} large />
          <MiniStat label="Wins" value={stats.wins} large accent="text-emerald-300" />
          <MiniStat label="Losses" value={stats.losses} large accent="text-red-300" />
          <MiniStat label="Net pips" value={stats.totalPips} large />
          <MiniStat label="Win rate" value={`${stats.winRate}%`} large accent="gold-text" />
        </div>
      )}
    </Layout>
  );
}

function MiniStat({ label, value, accent, large }) {
  return (
    <div className="card">
      <div className="text-xs uppercase tracking-wider text-white/40 mb-2">{label}</div>
      <div className={`font-display ${large ? 'text-4xl' : 'text-2xl'} font-semibold ${accent || ''}`}>
        {value}
      </div>
    </div>
  );
}
