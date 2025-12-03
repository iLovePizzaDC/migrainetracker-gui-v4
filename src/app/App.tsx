import './styles/App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "../features/landing-page/pages/LandingPage";
import { UserProvider } from '../shared/hooks/user/user-provider';
import OverviewPage from '../features/home/pages/OverviewPage';
import Navigation from './components/organisms/Navigation';
import { getSeasonBackground } from './utils/date';
import Footer from './components/organisms/Footer';
import CalendarPage from '../features/calendar/pages/CalendarPage';

function App() {
  return (
    <div
      onContextMenu={(e) => e.preventDefault()}
      className="min-h-screen flex flex-col relative"
    >
      <div className="fixed inset-0 -z-10">
        <img
          src={getSeasonBackground()}
          alt="background"
          className="w-full h-full object-cover"
        />
      </div>

      <BrowserRouter>
        <UserProvider>

          <Navigation />
          <main className='flex-1 mt-10'>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/home" element={<OverviewPage />} />
              <Route path="/calendar" element={<CalendarPage />} />
            </Routes>
          </main>
          <Footer />

        </UserProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
