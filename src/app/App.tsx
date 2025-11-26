import './styles/App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "../features/landing-page/pages/LandingPage";
import { UserProvider } from '../shared/hooks/user/user-provider';
import OverviewPage from '../features/home/pages/OverviewPage';
import Navigation from '../shared/components/organisms/Navigation';

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <Navigation />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<OverviewPage />} />
        </Routes>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
