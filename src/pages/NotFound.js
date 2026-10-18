import { Link } from 'react-router-dom';
import EmptyState from '../components/common/EmptyState';

export default function NotFound() {
  return (
    <div className="card shadow-sm">
      <div className="card-body py-5">
        <EmptyState icon="bi-compass" title="Page not found" message="The page you are looking for does not exist.">
          <Link to="/" className="btn btn-success">Back to dashboard</Link>
        </EmptyState>
      </div>
    </div>
  );
}
