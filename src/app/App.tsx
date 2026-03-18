import Footer from '@/app/components/organisms/Footer';
import Navigation from '@/app/components/organisms/Navigation';
import '@/app/styles/App.css';
import { getSeasonBackground } from '@/app/utils/date';
import CalendarPage from '@/features/calendar/pages/CalendarPage';
import OverviewPage from '@/features/home/pages/OverviewPage';
import LandingPage from '@/features/landing-page/pages/LandingPage';
import { UserProvider } from '@/shared/hooks/user/user-provider';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {
	return (
		<div onContextMenu={(e) => e.preventDefault()} className='min-h-screen flex flex-col relative'>
			<div className='fixed inset-0 -z-10'>
				<img src={getSeasonBackground()} alt='background' className='w-full h-full object-cover' />
			</div>

			<BrowserRouter>
				<UserProvider>
					<Navigation />
					<main className='mt-10'>
						<Routes>
							<Route path='/' element={<LandingPage />} />
							<Route path='/home' element={<OverviewPage />} />
							<Route path='/calendar' element={<CalendarPage />} />
						</Routes>
					</main>
					<Footer />
				</UserProvider>
			</BrowserRouter>
		</div>
	);
}

export default App;
