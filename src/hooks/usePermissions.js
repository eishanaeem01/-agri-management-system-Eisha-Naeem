import { useSelector } from 'react-redux';

// Admin: add + edit + delete. Manager: view + add only.
export default function usePermissions() {
  const { role, name, user } = useSelector((s) => s.auth);
  const isAdmin = role === 'Admin';
  return { role, name, user, isAdmin, canAdd: Boolean(role), canEdit: isAdmin, canDelete: isAdmin };
}
