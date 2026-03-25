import Footer from '@/app/components/organisms/Footer';
import Navigation from '@/app/components/organisms/Navigation';
import '@/app/styles/App.css';
import { getSeasonBackground } from '@/app/utils/date';
import CalendarPage from '@/features/calendar/pages/CalendarPage';
import OverviewPage from '@/features/home/pages/OverviewPage';
import LandingPage from '@/features/landing-page/pages/LandingPage';
import { useAuthCheck } from '@/shared/auth/use-auth-check';
import { useUser } from '@/shared/hooks/user/use-user';
import ProtectedRoute from '@/shared/routing/protected-route';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

function App() {
	const { user, setUser } = useUser();
	const { authChecked } = useAuthCheck(setUser);

	if (!authChecked) {
		// TODO add skeleton or spinner
		return <div className='h-screen flex items-center justify-center'>Loading...</div>;
	}

	return (
		<div onContextMenu={(e) => e.preventDefault()} className='min-h-screen flex flex-col relative'>
			<div className='fixed inset-0 -z-10'>
				<img src={getSeasonBackground()} alt='background' className='w-full h-full object-cover' />
			</div>

			<BrowserRouter>
				<Navigation />
				<main className='mt-10'>
					<Routes>
						<Route path='/' element={user ? <Navigate to='/home' replace /> : <LandingPage />} />
						<Route
							path='/home'
							element={
								<ProtectedRoute user={user}>
									<OverviewPage />
								</ProtectedRoute>
							}
						/>
						<Route
							path='/calendar'
							element={
								<ProtectedRoute user={user}>
									<CalendarPage />
								</ProtectedRoute>
							}
						/>
					</Routes>
				</main>
				<Footer />
			</BrowserRouter>
		</div>
	);
}

export default App;
