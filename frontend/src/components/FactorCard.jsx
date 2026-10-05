import { getImpactLabel } from '../utils/formatting';
import { useState } from 'react';
import ShowDataSheet from './ShowDataSheet';
import { ChevronRight } from 'lucide-react';

export default function FactorCard({ factor, index }) {
  const [showData, setShowData] = useState(false);

  const shapPct = factor.explanation?.contribution
    ? Math.round(factor.explanation.contribution * 100)
    : null;

  const impactColors = {
    high: { bg: '#FEE2E2', color: '#B91C1C' },
    medium: { bg: '#FEF3C7', color: '#B45309' },
    low: { bg: '#D1FAE5', color: '#047857' },
  };
  const impact = impactColors[factor.impact] || impactColors.low;

  return (
    <>
      <div style={{
        background: 'white', borderRadius: '16px', padding: '16px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
        animationDelay: `${index * 100}ms`,
      }} className="animate-in">
        {/* Title + Impact badge */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px', gap: '10px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#1a1a2e', lineHeight: '1.3' }}>{factor.label}</h3>
          <span style={{
            fontSize: '9px', fontWeight: 700,
            padding: '3px 8px', borderRadius: '10px',
            whiteSpace: 'nowrap',
            textTransform: 'uppercase', letterSpacing: '0.06em',
            background: impact.bg, color: impact.color,
            flexShrink: 0,
          }}>
            {getImpactLabel(factor.impact)}
          </span>
        </div>

        {/* Value */}
        {factor.value !== null && (
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '6px' }}>
            <span style={{ fontSize: '22px', fontWeight: 700, color: '#1a1a2e' }}>
              {typeof factor.value === 'number' && factor.unit === '₹' ? `₹${factor.value.toLocaleString('en-IN')}` : factor.value}
            </span>
            {factor.unit && factor.unit !== '₹' && (
              <span style={{ fontSize: '14px', fontWeight: 600, color: '#888' }}>{factor.unit}</span>
            )}
          </div>
        )}

        {/* Description / Data */}
        <p style={{ fontSize: '13px', color: '#1a1a2e', fontWeight: 600, marginBottom: '6px' }}>Your data</p>
        <p style={{ fontSize: '13px', color: '#666', fontWeight: 400, lineHeight: '1.5', marginBottom: '14px' }}>
          {factor.description}
        </p>

        {/* Why it matters */}
        {factor.whyItMatters && (
          <div style={{ marginBottom: '14px' }}>
            <p style={{ fontSize: '13px', color: '#1a1a2e', fontWeight: 600, marginBottom: '4px' }}>Why this matters</p>
            <p style={{ fontSize: '13px', color: '#666', fontWeight: 400, lineHeight: '1.5' }}>
              {factor.whyItMatters}
            </p>
          </div>
        )}

        {/* SHAP contribution bar */}
        {shapPct !== null && (
          <div style={{
            background: factor.isPositive ? '#F0FDF4' : '#F8F5FF', 
            borderRadius: '12px', padding: '12px',
            border: `1px solid ${factor.isPositive ? '#DCFCE7' : '#E8DEFF'}`, 
            marginBottom: '14px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: 600, color: '#666' }}>Estimated contribution</span>
              <span style={{ fontSize: '12px', fontWeight: 700, color: factor.isPositive ? '#16A34A' : '#6C3CE9' }}>{factor.isPositive ? '+' : ''}{shapPct}%</span>
            </div>
            <div style={{ height: '5px', width: '100%', background: 'white', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ height: '100%', background: factor.isPositive ? '#16A34A' : '#6C3CE9', borderRadius: '3px', width: `${shapPct}%` }} />
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          paddingTop: '12px', borderTop: '1px solid #f0f0f0',
        }}>
          <span style={{
            fontSize: '9px', fontWeight: 700, color: '#aaa',
            background: '#f5f5f5', padding: '3px 10px', borderRadius: '10px',
            textTransform: 'uppercase', letterSpacing: '0.08em',
          }}>
            {factor.isPositive ? 'Positive signal' : 'Likely factor'}
          </span>
          <button
            onClick={() => setShowData(true)}
            style={{
              fontSize: '12px', fontWeight: 700, color: '#00BAF2',
              background: 'none', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '2px',
              padding: 0,
            }}
          >
            Show my data <ChevronRight size={14} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {showData && (
        <ShowDataSheet
          factor={factor}
          onClose={() => setShowData(false)}
        />
      )}
    </>
  );
}
