import { Sparkles, ArrowRight, QrCode, Smartphone, AppWindow, Building2, BookOpen, HandCoins, Wallet, CreditCard, LineChart, CarFront } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
/* ═══════ UPI Lite Banner ═══════ */
export function UPILiteBanner() {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #003D80 0%, #0077CC 50%, #00BAF2 100%)',
      borderRadius: '14px',
      padding: '14px 18px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}>
      <div>
        <div style={{ color: 'white', fontSize: '15px', fontWeight: 700, letterSpacing: '-0.2px' }}>UPI Lite</div>
        <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px', fontWeight: 400, marginTop: '2px' }}>Lightning fast payments. PIN-less.</div>
      </div>
      <button style={{
        background: 'white', color: '#003D80',
        fontSize: '12px', fontWeight: 700,
        padding: '7px 16px', borderRadius: '20px',
        border: 'none', cursor: 'pointer',
        whiteSpace: 'nowrap', flexShrink: 0,
      }}>
        Activate
      </button>
    </div>
  );
}

/* ═══════ UPI & Wallet Payments Grid ═══════ */
export function UPIPaymentsGrid() {
  const navigate = useNavigate();
  const items = [
    { icon: <QrCode size={22} strokeWidth={1.5} />, label: 'Scan & Pay', color: '#1a237e', bg: '#E8EAF6' },
    { icon: <Smartphone size={22} strokeWidth={1.5} />, label: 'To Mobile', color: '#0d47a1', bg: '#E3F2FD' },
    { icon: <AppWindow size={22} strokeWidth={1.5} />, label: 'To UPI Apps', color: '#006064', bg: '#E0F7FA' },
    { icon: <Building2 size={22} strokeWidth={1.5} />, label: 'To Bank A/c', color: '#795548', bg: '#FFF8E1' },
    { icon: <BookOpen size={22} strokeWidth={1.5} />, label: 'Balance & History', color: '#4e342e', bg: '#FFF3E0' },
    { icon: <HandCoins size={22} strokeWidth={1.5} />, label: 'Personal Loan', color: '#00695c', bg: '#E0F2F1', action: () => navigate('/loan') },
    { icon: <LineChart size={22} strokeWidth={1.5} />, label: 'Mutual Funds', color: '#c62828', bg: '#FCE4EC', action: () => navigate('/mutual-funds') },
    { icon: <CarFront size={22} strokeWidth={1.5} />, label: 'Garage', color: '#1565c0', bg: '#E3F2FD', action: () => navigate('/insurance') },
  ];

  return (
    <div style={{
      background: 'white',
      borderRadius: '16px',
      padding: '16px 12px 14px',
      boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
    }}>
      <div style={{ fontSize: '14px', fontWeight: 700, color: '#1a1a2e', marginBottom: '14px', paddingLeft: '4px' }}>
        UPI & Wallet Payments
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        rowGap: '16px',
        columnGap: '4px',
      }}>
        {items.map((item, i) => (
          <div key={i} onClick={item.action} style={{
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', cursor: 'pointer',
          }}>
            <div style={{
              width: '46px', height: '46px',
              borderRadius: '14px',
              backgroundColor: item.bg, color: item.color,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: '6px',
            }}>
              {item.icon}
            </div>
            <span style={{
              fontSize: '10px', fontWeight: 500,
              color: '#555', textAlign: 'center',
              lineHeight: '1.3',
              maxWidth: '70px',
              display: 'block',
              height: '26px',
              overflow: 'hidden',
            }}>
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════ Net Worth Card ═══════ */
export function NetWorthCard({ amount, bank, investments }) {
  return (
    <div style={{
      background: 'white',
      borderRadius: '16px',
      padding: '16px',
      boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
    }}>
      {/* Title row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <span style={{ fontSize: '14px', fontWeight: 700, color: '#1a1a2e' }}>Net Worth Summary</span>
        <span style={{
          fontSize: '10px', fontWeight: 700, color: '#00BAF2',
          background: '#E0F7FA', padding: '3px 10px',
          borderRadius: '12px',
        }}>Synced</span>
      </div>

      {/* Big number */}
      <div style={{ fontSize: '28px', fontWeight: 800, color: '#1a1a2e', letterSpacing: '-0.5px', marginBottom: '14px' }}>
        {amount}
      </div>

      {/* Bank / Investments split */}
      <div style={{ display: 'flex', borderTop: '1px solid #f0f0f0', paddingTop: '12px' }}>
        <div style={{ flex: 1, borderRight: '1px solid #f0f0f0', paddingRight: '16px' }}>
          <div style={{ fontSize: '10px', fontWeight: 600, color: '#aaa', letterSpacing: '0.08em', marginBottom: '4px' }}>BANK</div>
          <div style={{ fontSize: '16px', fontWeight: 700, color: '#00BAF2' }}>{bank}</div>
        </div>
        <div style={{ flex: 1, paddingLeft: '16px' }}>
          <div style={{ fontSize: '10px', fontWeight: 600, color: '#aaa', letterSpacing: '0.08em', marginBottom: '4px' }}>INVESTMENTS</div>
          <div style={{ fontSize: '16px', fontWeight: 700, color: '#00897B' }}>{investments}</div>
        </div>
      </div>
    </div>
  );
}

/* ═══════ Financial Event Card ═══════ */
export function FinancialEventCard({ type, status, description, onClick, icon, isKyun }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: 'white',
        borderRadius: '16px',
        padding: '14px 16px 16px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
        cursor: 'pointer',
      }}
    >
      {/* Kyun badge */}
      {isKyun && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '8px' }}>
          <span style={{
            fontSize: '9px', fontWeight: 700, color: 'white',
            background: 'linear-gradient(135deg, #002E6E, #0066CC)',
            padding: '3px 10px', borderRadius: '10px',
            letterSpacing: '0.03em',
          }}>
            Kyun ? Engine
          </span>
        </div>
      )}

      {/* Icon + Text row */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
        <div style={{
          width: '40px', height: '40px', borderRadius: '50%',
          background: '#E3F2FD',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#0277BD', flexShrink: 0, marginTop: '2px',
        }}>
          {icon}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '10px', fontWeight: 700, color: '#0277BD', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '2px' }}>{type}</div>
          <div style={{ fontSize: '15px', fontWeight: 700, color: '#1a1a2e', marginBottom: '4px', letterSpacing: '-0.2px' }}>{status}</div>
          <div style={{ fontSize: '12px', color: '#777', lineHeight: '1.5' }}>{description}</div>
        </div>
      </div>

      {/* See why button */}
      {isKyun && (
        <button style={{
          width: '100%', marginTop: '14px',
          background: 'linear-gradient(135deg, #002E6E, #0066CC)',
          color: 'white', fontSize: '14px', fontWeight: 700,
          padding: '11px 0', borderRadius: '12px',
          border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: '4px', letterSpacing: '0.01em',
        }}>
          See why <span style={{ fontSize: '16px' }}>›</span>
        </button>
      )}
    </div>
  );
}

/* ═══════ Kyun Insight Card ═══════ */
export function KyunInsightCard() {
  return (
    <div style={{
      background: '#F8F5FF',
      borderRadius: '16px',
      padding: '16px',
      border: '1px solid #E8DEFF',
      cursor: 'pointer',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', color: '#6C3CE9', fontWeight: 600, fontSize: '14px' }}>
        <Sparkles size={15} /> Kyun?
      </div>
      <p style={{ fontSize: '13px', color: '#1a1a2e', fontWeight: 500, lineHeight: '1.5', marginBottom: '8px' }}>
        Your loan decision has <strong>3</strong> likely contributing factors.
      </p>
      <ul style={{ fontSize: '12px', color: '#666', paddingLeft: '18px', marginBottom: '12px', lineHeight: '1.8' }}>
        <li>High credit utilisation</li>
        <li>Recent payment pattern</li>
      </ul>
      <div style={{ display: 'flex', alignItems: 'center', color: '#6C3CE9', fontSize: '13px', fontWeight: 600 }}>
        Understand why <ArrowRight size={13} style={{ marginLeft: '4px' }} />
      </div>
    </div>
  );
}

/* ═══════ Service Grid ═══════ */
export function ServiceGrid({ title, items }) {
  return (
    <div>
      {title && <div style={{ fontSize: '15px', fontWeight: 700, color: '#1a1a2e', marginBottom: '10px' }}>{title}</div>}
      <div style={{
        background: 'white', borderRadius: '16px', padding: '14px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
          {items.map((opt, i) => (
            <div key={i} onClick={opt.action} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer',
            }}>
              <div style={{
                width: '42px', height: '42px', borderRadius: '12px',
                background: '#F5F7FA',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#233266', marginBottom: '6px',
              }}>
                {opt.icon}
              </div>
              <span style={{ fontSize: '11px', fontWeight: 500, color: '#555', textAlign: 'center' }}>
                {opt.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════ Horizontal Service List ═══════ */
export function HorizontalServiceList({ title, items }) {
  return (
    <div>
      {title && <div style={{ fontSize: '15px', fontWeight: 700, color: '#1a1a2e', marginBottom: '10px' }}>{title}</div>}
      <div className="hide-scrollbar" style={{
        display: 'flex', gap: '10px',
        overflowX: 'auto', paddingBottom: '4px',
      }}>
        {items.map((opt, i) => (
          <div key={i} onClick={opt.action} style={{
            background: 'white', borderRadius: '14px', padding: '12px',
            minWidth: '90px', flexShrink: 0,
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            cursor: 'pointer',
            boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
          }}>
            <div style={{
              width: '42px', height: '42px', borderRadius: '12px',
              background: '#F5F7FA',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#00BAF2', marginBottom: '6px',
            }}>
              {opt.icon}
            </div>
            <span style={{ fontSize: '11px', fontWeight: 500, color: '#555', textAlign: 'center' }}>
              {opt.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
