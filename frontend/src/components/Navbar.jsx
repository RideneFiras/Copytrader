import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState } from 'react';
import Logo from './Logo.jsx';
import AdminPasswordModal from './AdminPasswordModal.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const linkBase =
  'px-3 py-1.5 rounded-lg text-sm font-medium transition text-white/70 hover:text-white hover:bg-white/5';
const linkActive = 'text-white bg-white/5';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [adminOpen, setAdminOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="sticky top-0 z-40 backdrop-blur-xl bg-bg-0/60 border-b border-white/5"
      >
        <div className="max-w-7xl mx-auto px-5 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Logo onSecretActivate={() => setAdminOpen(true)} />
            {user && (
              <nav className="hidden md:flex items-center gap-1">
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) => `${linkBase} ${isActive ? linkActive : ''}`}
                >
                  Dashboard
                </NavLink>
                <NavLink
                  to="/performance"
                  className={({ isActive }) => `${linkBase} ${isActive ? linkActive : ''}`}
                >
                  Performance
                </NavLink>
                <NavLink
                  to="/affiliate"
                  className={({ isActive }) => `${linkBase} ${isActive ? linkActive : ''}`}
                >
                  Affiliate
                </NavLink>
              </nav>
            )}
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <>
                <div className="hidden sm:flex items-center gap-3">
                  <span className="text-xs text-white/50">{user.email}</span>
                  {user.isPremium ? (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider glass-gold text-gold">
                      Premium
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider bg-white/5 text-white/60">
                      Free
                    </span>
                  )}
                </div>
                <button
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  className="btn-ghost"
                >
                  Logout
                </button>
                <button
                  className="md:hidden btn-ghost px-2"
                  onClick={() => setMobileOpen((s) => !s)}
                  aria-label="menu"
                >
                  ☰
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-ghost">
                  Login
                </Link>
                <Link to="/register" className="btn-primary">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>

        {user && mobileOpen && (
          <div className="md:hidden border-t border-white/5 px-5 py-3 flex flex-col gap-1">
            {['dashboard', 'performance', 'affiliate'].map((p) => (
              <NavLink
                key={p}
                to={`/${p}`}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `${linkBase} ${isActive ? linkActive : ''} capitalize`
                }
              >
                {p}
              </NavLink>
            ))}
          </div>
        )}
      </motion.header>

      <AdminPasswordModal open={adminOpen} onClose={() => setAdminOpen(false)} />
    </>
  );
}
