import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import type { User } from '../types/user/user';

function ProtectedRoute({ user, children }: { user: User | null; children: ReactNode }) {
	if (!user) {
		return <Navigate to='/' replace />;
	}
	return children;
}

export default ProtectedRoute;
