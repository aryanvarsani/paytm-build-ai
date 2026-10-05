import { useNavigate, useLocation } from 'react-router-dom';
import { House, TrendingUp, CarFront, Sparkles, QrCode } from 'lucide-react';

const tabs = [
  { id: 'home', label: 'Home', path: '/' },
  { id: 'wealth', label: 'Wealth', path: '/mutual-funds' },
  { id: 'scan', label: 'Scan QR', path: null },
  { id: 'garage', label: 'Garage', path: '/insurance' },
  { id: 'kyun', label: 'Kyun AI', path: '/ask-kyun/loan' },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => {
    if (!path) return false;
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav style={{
      position: 'absolute',
      bottom: 0, left: 0, right: 0,
      height: '70px',
      background: 'white',
      borderTop: '1px solid #eee',
      boxShadow: '0 -2px 10px rgba(0,0,0,0.04)',
      zIndex: 50,
      paddingBottom: '8px',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'flex-end',
        height: '100%',
        paddingTop: '4px',
      }}>
        {tabs.map((tab) => {
          const active = isActive(tab.path);

          if (tab.id === 'scan') {
            return (
              <button
                key={tab.id}
                onClick={() => {}}
                style={{
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'flex-end',
                  background: 'none', border: 'none', cursor: 'pointer',
                  outline: 'none', padding: 0,
                }}
              >
                <div style={{
                  width: '52px', height: '52px',
                  borderRadius: '50%',
                  background: '#1C2541',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white',
                  boxShadow: '0 4px 14px rgba(28,37,65,0.35)',
                  marginTop: '-22px',
                  marginBottom: '3px',
                }}>
                  <QrCode size={22} strokeWidth={1.8} />
                </div>
                <span style={{ fontSize: '9px', fontWeight: 600, color: '#1C2541', lineHeight: 1 }}>
                  {tab.label}
                </span>
              </button>
            );
          }

          const activeColor = tab.id === 'kyun' ? '#6C3CE9' : '#00BAF2';
          const color = active ? activeColor : '#B0B0B0';

          return (
            <button
              key={tab.id}
              onClick={() => tab.path && navigate(tab.path)}
              style={{
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'flex-end',
                background: 'none', border: 'none', cursor: 'pointer',
                outline: 'none', padding: 0, minWidth: '50px',
              }}
            >
              <div style={{ color, marginBottom: '3px' }}>
                {tab.id === 'home' && <House size={21} strokeWidth={active ? 2.4 : 1.7} fill={active ? activeColor : 'none'} />}
                {tab.id === 'wealth' && <TrendingUp size={21} strokeWidth={active ? 2.4 : 1.7} />}
                {tab.id === 'garage' && <CarFront size={21} strokeWidth={active ? 2.4 : 1.7} />}
                {tab.id === 'kyun' && <Sparkles size={21} strokeWidth={active ? 2.4 : 1.7} />}
              </div>
              <span style={{
                fontSize: '9px',
                fontWeight: active ? 700 : 500,
                color: color,
                lineHeight: 1,
              }}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
