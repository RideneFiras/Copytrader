import { useCallback, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Logo({ size = 36, withText = true, onSecretActivate }) {
  const navigate = useNavigate();
  const clicks = useRef(0);
  const lastClick = useRef(0);
  const [tilt, setTilt] = useState(false);

  const handleClick = useCallback(() => {
    const now = Date.now();
    if (now - lastClick.current > 1500) clicks.current = 0;
    lastClick.current = now;
    clicks.current += 1;
    setTilt(true);
    setTimeout(() => setTilt(false), 200);

    if (clicks.current >= 5) {
      clicks.current = 0;
      if (onSecretActivate) onSecretActivate();
      else navigate('/admin');
    }
  }, [navigate, onSecretActivate]);

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-2.5 select-none focus:outline-none"
      aria-label="Copytrader"
    >
      <span
        className="relative inline-flex items-center justify-center rounded-xl"
        style={{
          width: size,
          height: size,
          background: 'linear-gradient(135deg, #0a0c14 0%, #161a25 100%)',
          border: '1px solid rgba(212,175,55,0.35)',
          boxShadow: '0 6px 20px -8px rgba(212,175,55,0.5)',
          transform: tilt ? 'rotate(-6deg) scale(0.95)' : 'rotate(0) scale(1)',
          transition: 'transform 150ms ease',
        }}
      >
        <svg viewBox="0 0 64 64" width={size * 0.6} height={size * 0.6} fill="none">
          <defs>
            <linearGradient id="lg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#f3e8b8" />
              <stop offset="50%" stopColor="#d4af37" />
              <stop offset="100%" stopColor="#7c621a" />
            </linearGradient>
          </defs>
          <path
            d="M10 44 L24 30 L34 36 L52 16"
            stroke="url(#lg)"
            strokeWidth="5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="52" cy="16" r="4" fill="#d4af37" />
        </svg>
      </span>
      {withText && (
        <span className="font-display text-lg font-semibold tracking-tight">
          Copy<span className="gold-text">trader</span>
        </span>
      )}
    </button>
  );
}
