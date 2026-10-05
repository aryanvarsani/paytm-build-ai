import { useNavigate } from 'react-router-dom';
import PaytmHeader from '../components/PaytmHeader';
import { 
  UPILiteBanner,
  UPIPaymentsGrid,
  NetWorthCard, 
  FinancialEventCard, 
  KyunInsightCard,
  ServiceGrid,
  HorizontalServiceList
} from '../components/HomeComponents';
import { 
  Plane, Train, BusFront, Building, 
  BadgeCent, LineChart, TrendingUp, 
  Banknote, Droplets
} from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();

  const travelItems = [
    { icon: <Plane size={22} strokeWidth={1.8} />, label: 'Flight', action: () => {} },
    { icon: <Train size={22} strokeWidth={1.8} />, label: 'Train', action: () => {} },
    { icon: <BusFront size={22} strokeWidth={1.8} />, label: 'Bus', action: () => {} },
    { icon: <Building size={22} strokeWidth={1.8} />, label: 'Hotels', action: () => {} },
  ];

  const growMoneyItems = [
    { icon: <BadgeCent size={22} strokeWidth={1.8} />, label: 'Gold', action: () => {} },
    { icon: <BadgeCent size={22} strokeWidth={1.8} />, label: 'Round-up', action: () => {} },
    { icon: <LineChart size={22} strokeWidth={1.8} />, label: 'Mutual Funds', action: () => navigate('/mutual-funds') },
    { icon: <TrendingUp size={22} strokeWidth={1.8} />, label: 'Stocks', action: () => {} },
  ];

  return (
    <div style={{ width: '100%', minHeight: '100%', background: '#F5F7FA' }}>
      <PaytmHeader />
      
      <div style={{ padding: '12px 16px 24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {/* UPI Lite Banner */}
        <UPILiteBanner />

        {/* UPI & Wallet Payments Grid */}
        <UPIPaymentsGrid />

        {/* Net Worth Summary */}
        <NetWorthCard 
          amount="₹24,50,000" 
          bank="₹12.5L" 
          investments="₹12.0L" 
        />

        {/* Recent Applications & Claims */}
        <div>
          <div style={{ fontSize: '15px', fontWeight: 700, color: '#1a1a2e', marginBottom: '12px' }}>
            Recent Applications & Claims
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <FinancialEventCard
              type="PERSONAL LOAN"
              status="Application reviewed"
              description="Your personal loan application for ₹2,50,000 was reviewed on 21 Sep 2026."
              icon={<Banknote size={18} strokeWidth={2} />}
              isKyun={true}
              onClick={() => navigate('/loan')}
            />
            <FinancialEventCard
              type="HEALTH CLAIM"
              status="Claim partially approved"
              description="₹61,250 of your ₹84,500 claim was approved. Understand what affected it."
              icon={<Droplets size={18} strokeWidth={2} />}
              isKyun={true}
              onClick={() => navigate('/insurance')}
            />
            
            <KyunInsightCard />
          </div>
        </div>

        {/* Travel & Tickets */}
        <ServiceGrid 
          title="Travel & Tickets" 
          items={travelItems}
        />

        {/* Grow Your Money */}
        <HorizontalServiceList 
          title="Grow your money" 
          items={growMoneyItems}
        />
      </div>
    </div>
  );
}
