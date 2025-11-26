import './styles/App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "../features/landing-page/pages/LandingPage";
import { UserProvider } from '../shared/hooks/user/user-provider';
import OverviewPage from '../features/overview/pages/OverviewPage';

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<OverviewPage />} />
        </Routes>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
