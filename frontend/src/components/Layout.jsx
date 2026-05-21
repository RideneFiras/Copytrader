import Navbar from './Navbar.jsx';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-5 py-8">{children}</main>
      <footer className="border-t border-white/5 text-xs text-white/40 py-6 text-center">
        © {new Date().getFullYear()} Copytrader. Trading involves risk. Past performance is not indicative of future results.
      </footer>
    </div>
  );
}
