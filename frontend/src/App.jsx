import { Routes, Route, useLocation } from 'react-router-dom';
import PhoneFrame from './components/PhoneFrame';
import BottomNav from './components/BottomNav';
import Home from './pages/Home';
import LoanJourney from './pages/LoanJourney';
import InsuranceJourney from './pages/InsuranceJourney';
import MutualFundsJourney from './pages/MutualFundsJourney';
import AskKyun from './pages/AskKyun';
import LanguagePage from './pages/LanguagePage';

export default function App() {
  const location = useLocation();
  const hideBottomNav = location.pathname.startsWith('/ask-kyun') || location.pathname.startsWith('/language');

  return (
    <PhoneFrame>
      <div className="w-full h-full flex flex-col relative overflow-hidden bg-[#F5F7FA]">
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto hide-scrollbar pb-[100px]">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/loan" element={<LoanJourney />} />
            <Route path="/insurance" element={<InsuranceJourney />} />
            <Route path="/mutual-funds" element={<MutualFundsJourney />} />
            <Route path="/ask-kyun/:product" element={<AskKyun />} />
            <Route path="/language/:product" element={<LanguagePage />} />
          </Routes>
        </div>
        {!hideBottomNav && <BottomNav />}
      </div>
    </PhoneFrame>
  );
}
