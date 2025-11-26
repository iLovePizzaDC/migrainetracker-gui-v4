import './styles/App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "../features/landing-page/pages/LandingPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
