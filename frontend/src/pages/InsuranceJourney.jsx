import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PaytmHeader from '../components/PaytmHeader';
import FactorCard from '../components/FactorCard';
import WhatIfSimulator from '../components/WhatIfSimulator';
import ActionPlan from '../components/ActionPlan';
import ProgressTracker from '../components/ProgressTracker';
import AiExplainCard, { INSURANCE_EXPLANATION } from '../components/AiExplainCard';
import KyunAIChatbot from '../components/KyunAIChatbot';
import { INSURANCE_DECISION, INSURANCE_FACTORS, INSURANCE_WHATIF_CONFIG, INSURANCE_PLAN, INSURANCE_PROGRESS } from '../data/mockData';
import { formatCurrency } from '../utils/formatting';
import { Sparkles, ArrowRight, AlertCircle } from 'lucide-react';

const TABS = ['Claim', 'Why?', 'What-If', 'Plan', 'Progress'];

export default function InsuranceJourney() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const approvedPct = Math.round(INSURANCE_DECISION.approved_amount / INSURANCE_DECISION.claimed_amount * 100);
  const gapPct = 100 - approvedPct;

  const renderDecision = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <p style={{ fontSize: '12px', fontWeight: 700, color: '#bbb', letterSpacing: '0.08em' }}>
        CLAIM ID {INSURANCE_DECISION.id}
      </p>

      {/* Claim card */}
      <div style={{ background: 'white', borderRadius: '18px', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
        <p style={{ fontSize: '14px', fontWeight: 600, color: '#888', marginBottom: '8px' }}>Claim Status</p>
        <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#1a1a2e', marginBottom: '12px', letterSpacing: '-0.3px' }}>
          {INSURANCE_DECISION.decision.label}
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', paddingTop: '16px', borderTop: '1px solid #f0f0f0' }}>
          <div>
            <p style={{ fontSize: '13px', fontWeight: 500, color: '#888', marginBottom: '6px' }}>Claimed amount</p>
            <p style={{ fontSize: '22px', fontWeight: 700, color: '#1a1a2e' }}>{formatCurrency(INSURANCE_DECISION.claimed_amount)}</p>
          </div>
          <div>
            <p style={{ fontSize: '13px', fontWeight: 500, color: '#888', marginBottom: '6px' }}>Approved amount</p>
            <p style={{ fontSize: '22px', fontWeight: 700, color: '#16A34A' }}>{formatCurrency(INSURANCE_DECISION.approved_amount)}</p>
          </div>
        </div>

        {/* Gap visualization */}
        <div style={{ marginTop: '20px', padding: '18px', borderRadius: '14px', background: 'rgba(220,38,38,0.04)', border: '1px solid rgba(220,38,38,0.08)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#888' }}>Gap amount</span>
            <span style={{ fontSize: '18px', fontWeight: 700, color: '#DC2626' }}>
              {formatCurrency(INSURANCE_DECISION.claimed_amount - INSURANCE_DECISION.approved_amount)}
            </span>
          </div>
          <div style={{ height: '6px', borderRadius: '3px', background: '#DC2626', overflow: 'hidden' }}>
            <div style={{ height: '100%', background: '#16A34A', width: `${approvedPct}%`, transition: 'width 1s ease' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#16A34A', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Approved ({approvedPct}%)</span>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#DC2626', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Gap ({gapPct}%)</span>
          </div>
        </div>
      </div>

      {/* Kyun? CTA */}
      <div style={{
        background: 'linear-gradient(135deg, #F8F5FF, #fff)',
        borderRadius: '18px', padding: '24px',
        border: '1px solid #E8DEFF', position: 'relative',
        boxShadow: '0 1px 4px rgba(108,60,233,0.06)',
      }}>
        <div style={{
          position: 'absolute', top: '-12px', left: '20px',
          background: 'linear-gradient(135deg, #6C3CE9, #00BAF2)',
          color: 'white', padding: '6px 14px', borderRadius: '14px',
          fontSize: '12px', fontWeight: 700,
          display: 'flex', alignItems: 'center', gap: '6px',
          boxShadow: '0 2px 8px rgba(108,60,233,0.3)',
        }}>
          <Sparkles size={14} /> Kyun?
        </div>

        <div style={{ marginTop: '12px', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#1a1a2e', marginBottom: '8px' }}>Why was the claim partially approved?</h3>
          <p style={{ fontSize: '15px', fontWeight: 500, color: '#777', lineHeight: '1.4' }}>See likely factors based on your policy and claim.</p>
        </div>
        
        <button onClick={() => setActiveTab(1)} style={{
          width: '100%', background: 'linear-gradient(135deg, #6C3CE9, #00BAF2)',
          color: 'white', borderRadius: '14px', padding: '16px 0',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: '8px', fontSize: '16px', fontWeight: 700,
          border: 'none', cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(108,60,233,0.25)',
        }}>
          See likely factors <ArrowRight size={18} strokeWidth={2.5} />
        </button>
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', color: '#999', padding: '0 8px' }}>
        <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
        <span style={{ fontSize: '13px', lineHeight: '1.5' }}>{INSURANCE_DECISION.disclaimer}</span>
      </div>
    </div>
  );

  const renderExplanation = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <AiExplainCard title="Insurance AI Summary" explanations={INSURANCE_EXPLANATION} />
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '0 2px' }}>
        <div style={{
          width: '34px', height: '34px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #6C3CE9, #00BAF2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'white', boxShadow: '0 2px 6px rgba(108,60,233,0.2)',
        }}>
          <Sparkles size={16} />
        </div>
        <div>
          <h2 style={{ fontSize: '17px', fontWeight: 700, color: '#1a1a2e', marginBottom: '2px' }}>Claim Analysis</h2>
          <p style={{ fontSize: '12px', fontWeight: 500, color: '#888' }}>Factors that may have affected your claim</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {INSURANCE_FACTORS.map((factor, i) => (
          <FactorCard key={factor.id} factor={factor} index={i} />
        ))}
      </div>

      <div style={{ background: 'white', borderRadius: '16px', padding: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <span style={{ fontSize: '13px', fontWeight: 700, color: '#1a1a2e' }}>Analysis confidence</span>
          <span style={{ fontSize: '15px', fontWeight: 700, color: '#1a1a2e' }}>{Math.round(INSURANCE_DECISION.confidence * 100)}%</span>
        </div>
        <div style={{ height: '6px', background: '#f0f0f0', borderRadius: '3px', overflow: 'hidden', marginBottom: '10px' }}>
          <div style={{ height: '100%', background: 'linear-gradient(90deg, #6C3CE9, #00BAF2)', borderRadius: '3px', width: `${INSURANCE_DECISION.confidence * 100}%` }} />
        </div>
        <p style={{ fontSize: '11px', fontWeight: 500, color: '#999' }}>Based on your policy document and surveyor report.</p>
      </div>

      <button onClick={() => setActiveTab(3)} style={{
        width: '100%', background: '#1C2541', color: 'white',
        borderRadius: '12px', padding: '12px 0',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: '8px', fontSize: '14px', fontWeight: 700,
        border: 'none', cursor: 'pointer',
      }}>
        See your plan <ArrowRight size={16} strokeWidth={2.5} />
      </button>
    </div>
  );

  const renderWhatIf = () => (
    <div>
      <WhatIfSimulator config={INSURANCE_WHATIF_CONFIG} productType="insurance" onCreatePlan={() => setActiveTab(3)} />
    </div>
  );

  const renderPlan = () => (
    <div>
      <ActionPlan plan={INSURANCE_PLAN} />
    </div>
  );

  const renderProgress = () => (
    <div>
      <ProgressTracker progress={INSURANCE_PROGRESS} productType="insurance" />
    </div>
  );

  const content = [renderDecision, renderExplanation, renderWhatIf, renderPlan, renderProgress];

  return (
    <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column', background: '#F5F7FA' }}>
      <PaytmHeader 
        showBack 
        title="Motor Insurance Claim" 
        actionButton={
          <button
            onClick={() => setIsChatOpen(true)}
            style={{
              background: 'linear-gradient(135deg, #002E6E, #00BAF2)',
              border: 'none', borderRadius: '20px', padding: '6px 12px',
              display: 'flex', alignItems: 'center', gap: '6px',
              color: 'white', fontSize: '13px', fontWeight: 700,
              cursor: 'pointer', boxShadow: '0 2px 6px rgba(0,46,110,0.15)'
            }}
          >
            <Sparkles size={14} /> Kyun AI
          </button>
        }
      />

      <div style={{
        position: 'sticky', top: '56px', zIndex: 20,
        background: 'white', borderBottom: '1px solid #eee',
        boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
      }}>
        <div className="hide-scrollbar" style={{ display: 'flex', overflowX: 'auto', padding: '0 16px' }}>
          {TABS.map((tab, i) => (
            <button key={tab} onClick={() => setActiveTab(i)} style={{
              padding: '14px 16px', fontSize: '15px', fontWeight: 600,
              whiteSpace: 'nowrap', background: 'none', border: 'none',
              cursor: 'pointer', outline: 'none',
              color: activeTab === i ? '#6C3CE9' : '#aaa',
              borderBottom: activeTab === i ? '3px solid #6C3CE9' : '3px solid transparent',
              transition: 'color 0.2s, border-color 0.2s',
            }}>
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: '16px', paddingBottom: '120px' }}>
        {content[activeTab]()}
      </div>

      <KyunAIChatbot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
}
