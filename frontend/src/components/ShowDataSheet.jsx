import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { BarChart3 } from 'lucide-react';

export default function ShowDataSheet({ factor, onClose }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const content = (
    <>
      {/* Overlay */}
      <div onClick={onClose} style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(0,0,0,0.4)', zIndex: 100,
      }} />

      {/* Sheet */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        background: 'white', borderRadius: '18px 18px 0 0',
        padding: '20px', zIndex: 101,
        maxHeight: '80vh', overflowY: 'auto',
      }}>
        {/* Handle */}
        <div style={{ width: '40px', height: '4px', background: '#e0e0e0', borderRadius: '2px', margin: '0 auto 18px' }} />

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '18px' }}>
          <div style={{
            width: '44px', height: '44px', borderRadius: '12px',
            background: 'linear-gradient(135deg, #6C3CE9, #00BAF2)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: '10px',
            boxShadow: '0 2px 8px rgba(108,60,233,0.25)',
          }}>
            <BarChart3 size={22} color="white" />
          </div>
          <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#1a1a2e' }}>
            {factor.label}
          </h3>
        </div>

        {/* Data rows */}
        <div style={{ borderTop: '1px solid #f0f0f0' }}>
          {factor.evidence?.fields?.map((field, i) => (
            <div key={i} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '12px 0',
              borderBottom: i < factor.evidence.fields.length - 1 ? '1px solid #f0f0f0' : 'none',
            }}>
              <span style={{ fontSize: '13px', color: '#888' }}>{field.label}</span>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#1a1a2e' }}>{field.value}</span>
            </div>
          ))}
        </div>

        {/* SHAP info */}
        {factor.explanation?.contribution && (
          <div style={{
            marginTop: '14px', padding: '14px', borderRadius: '14px',
            background: 'rgba(108,60,233,0.04)', border: '1px solid rgba(108,60,233,0.08)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '10px', fontWeight: 700, color: '#6C3CE9', letterSpacing: '0.08em' }}>SHAP ATTRIBUTION</span>
              <span style={{ fontSize: '14px', fontWeight: 700, color: '#6C3CE9' }}>
                {Math.round(factor.explanation.contribution * 100)}%
              </span>
            </div>
            <div style={{ height: '5px', background: 'rgba(108,60,233,0.15)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: '3px',
                background: 'linear-gradient(90deg, #6C3CE9, #00BAF2)',
                width: `${factor.explanation.contribution * 100}%`,
              }} />
            </div>
            <p style={{ fontSize: '10px', fontWeight: 500, color: '#999', marginTop: '6px' }}>
              Relative contribution to the overall decision explanation
            </p>
          </div>
        )}

        {/* Disclaimer */}
        <div style={{
          marginTop: '14px', padding: '10px', background: '#F5F7FA',
          borderRadius: '10px', textAlign: 'center',
        }}>
          <p style={{ fontSize: '10px', fontWeight: 500, color: '#bbb', lineHeight: '1.5' }}>
            Data based on available account and application information
          </p>
        </div>

        {/* Done button */}
        <button
          onClick={onClose}
          style={{
            width: '100%', marginTop: '16px',
            background: '#1C2541', color: 'white',
            borderRadius: '12px', padding: '13px 0',
            fontSize: '14px', fontWeight: 700,
            border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          Done
        </button>
      </div>
    </>
  );

  if (!mounted) return null;

  const target = document.getElementById('phone-frame-viewport') || document.body;
  return createPortal(content, target);
}
