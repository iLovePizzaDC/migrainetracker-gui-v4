import Footer from '@/app/components/organisms/Footer';
import LoadingBox from '@/app/components/molecules/LoadingBox';
import Navigation from '@/app/components/organisms/Navigation';
import '@/app/styles/App.css';
import { getSeasonBackground } from '@/app/utils/season-background';
import CalendarPage from '@/pages/CalendarPage';
import OverviewPage from '@/pages/OverviewPage';
import LandingPage from '@/pages/LandingPage';
import { useAuthCheck } from '@/app/hooks/use-auth-check';
import { useUser } from '@/shared/hooks/use-user';
import ProtectedRoute from '@/shared/routing/protected-route';
import { Navigate, Route, Routes } from 'react-router';

function App() {
	const { user, setUser } = useUser();
	const { authChecked } = useAuthCheck(setUser);

	return (
		<div className='relative flex min-h-screen flex-col'>
			<div className='fixed inset-0 -z-10'>
				<img
					src={getSeasonBackground()}
					alt=''
					aria-hidden='true'
					className='h-full w-full scale-105 object-cover'
				/>
				<div className='absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/55' />
				<div className='absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.04),transparent_60%)]' />
			</div>
			<Navigation />
			<main className='flex-1'>
				{authChecked ? (
					<div className='mx-auto mt-16 min-w-0 max-w-6xl pb-10'>
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
					</div>
				) : (
					<LoadingBox />
				)}
			</main>
			<Footer />
		</div>
	);
}

export default App;
