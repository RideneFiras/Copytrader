import { motion } from 'framer-motion';
import clsx from 'clsx';

const fmt = (n) => (typeof n === 'number' ? n.toLocaleString(undefined, { maximumFractionDigits: 4 }) : '—');

const ResultPill = ({ result, status }) => {
  if (status === 'open') {
    return (
      <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider bg-blue-400/10 text-blue-300 border border-blue-400/20">
        Live
      </span>
    );
  }
  const map = {
    win: 'bg-emerald-400/10 text-emerald-300 border-emerald-400/20',
    loss: 'bg-red-400/10 text-red-300 border-red-400/20',
    breakeven: 'bg-white/5 text-white/70 border-white/10',
    pending: 'bg-white/5 text-white/60 border-white/10',
  };
  return (
    <span
      className={clsx(
        'px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider border',
        map[result] || map.pending
      )}
    >
      {result}
    </span>
  );
};

export default function SignalCard({ signal, index = 0 }) {
  const locked = signal.locked;
  const isBuy = signal.direction === 'BUY';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.35 }}
      className="card relative overflow-hidden group"
    >
      <div
        className={clsx(
          'absolute -top-12 -right-12 w-40 h-40 rounded-full blur-3xl opacity-40 transition',
          isBuy ? 'bg-emerald-400/30' : 'bg-red-400/30'
        )}
      />

      <div className="relative flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-display text-lg font-semibold tracking-tight">
              {signal.asset}
            </span>
            <ResultPill result={signal.result} status={signal.status} />
            {signal.isPremiumOnly && (
              <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider glass-gold text-gold">
                Premium
              </span>
            )}
          </div>
          <div className="text-xs text-white/40">
            {new Date(signal.publishedAt).toLocaleString()}
          </div>
        </div>

        <div
          className={clsx(
            'px-3 py-1.5 rounded-xl text-sm font-semibold tracking-wide',
            isBuy
              ? 'bg-emerald-400/10 text-emerald-300 border border-emerald-400/30'
              : 'bg-red-400/10 text-red-300 border border-red-400/30'
          )}
        >
          {isBuy ? '↗ BUY' : '↘ SELL'}
        </div>
      </div>

      <div className={clsx('grid grid-cols-3 gap-3 relative', locked && 'blur-sm pointer-events-none select-none')}>
        <Stat label="Entry" value={fmt(signal.entry)} />
        <Stat label="Take Profit" value={fmt(signal.takeProfit)} accent="emerald" />
        <Stat label="Stop Loss" value={fmt(signal.stopLoss)} accent="red" />
      </div>

      {signal.note && !locked && (
        <p className="mt-4 text-sm text-white/60 leading-relaxed">{signal.note}</p>
      )}

      {locked && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-bg-1/60 backdrop-blur-[2px] rounded-2xl border border-white/5">
          <div className="text-2xl mb-2">🔒</div>
          <div className="text-sm font-semibold gold-text">Upgrade to Premium</div>
          <div className="text-xs text-white/50 mt-1">to unlock all daily signals</div>
        </div>
      )}
    </motion.div>
  );
}

function Stat({ label, value, accent }) {
  const color =
    accent === 'emerald'
      ? 'text-emerald-300'
      : accent === 'red'
      ? 'text-red-300'
      : 'text-white';
  return (
    <div className="rounded-xl bg-white/[0.03] border border-white/5 p-3">
      <div className="text-[10px] uppercase tracking-wider text-white/40 mb-1">{label}</div>
      <div className={`text-base font-semibold ${color}`}>{value}</div>
    </div>
  );
}
