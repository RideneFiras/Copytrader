import { Link } from 'react-router-dom';
import Layout from '../components/Layout.jsx';

export default function NotFound() {
  return (
    <Layout>
      <div className="text-center py-24">
        <div className="text-7xl font-display font-bold gold-text mb-4">404</div>
        <p className="text-white/60 mb-6">This page doesn't exist.</p>
        <Link to="/" className="btn-primary">
          Back home
        </Link>
      </div>
    </Layout>
  );
}
