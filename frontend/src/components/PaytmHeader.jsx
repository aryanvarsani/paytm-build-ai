import { useNavigate } from 'react-router-dom';
import { Search, Bell, ChevronLeft } from 'lucide-react';

export default function PaytmHeader({ showBack, title, onBack, actionButton }) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) onBack();
    else navigate(-1);
  };

  return (
    <header
      className="sticky top-0 z-30 shrink-0 select-none"
      style={{
        background: 'rgba(255,255,255,0.96)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid #eee',
        padding: '8px 16px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '40px' }}>
        {/* Left: Avatar + Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {showBack ? (
            <button
              onClick={handleBack}
              style={{
                width: 32, height: 32,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'none', border: 'none', cursor: 'pointer',
                borderRadius: '50%', color: '#333',
              }}
            >
              <ChevronLeft size={22} strokeWidth={2.5} />
            </button>
          ) : (
            <div
              onClick={() => navigate('/')}
              style={{
                width: 34, height: 34,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #0055BB, #00AAE6)',
                color: 'white',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '12px', fontWeight: 900,
                cursor: 'pointer',
                boxShadow: '0 1px 4px rgba(0,85,187,0.3)',
                letterSpacing: '0.5px',
              }}
            >
              SS
            </div>
          )}

          {title ? (
            <h1 style={{ fontSize: '16px', fontWeight: 800, color: '#111', margin: 0, letterSpacing: '-0.3px' }}>
              {title}
            </h1>
          ) : (
            <span
              onClick={() => navigate('/')}
              style={{
                fontSize: '21px', fontWeight: 900, color: '#002E6E',
                letterSpacing: '-0.5px', cursor: 'pointer',
                fontFamily: 'Inter, system-ui, sans-serif',
              }}
            >
              paytm
            </span>
          )}
        </div>

        {/* Right: Action Button or Search + Bell */}
        {actionButton ? (
          actionButton
        ) : !showBack && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button style={{
              width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'none', border: 'none', cursor: 'pointer', borderRadius: '50%', color: '#444',
            }}>
              <Search size={20} strokeWidth={2} />
            </button>
            <button style={{
              width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'none', border: 'none', cursor: 'pointer', borderRadius: '50%', color: '#444',
              position: 'relative',
            }}>
              <Bell size={20} strokeWidth={2} />
              <div style={{
                position: 'absolute', top: 6, right: 7,
                width: 7, height: 7, borderRadius: '50%',
                background: '#EF4444', border: '1.5px solid white',
              }} />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
