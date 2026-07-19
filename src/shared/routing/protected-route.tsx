import type { User } from '@/shared/types/user/user';
import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ user, children }: { user: User | null; children: ReactNode }) {
  if (!user) {
    return <Navigate to='/' replace />;
  }
  return children;
}

export default ProtectedRoute;
