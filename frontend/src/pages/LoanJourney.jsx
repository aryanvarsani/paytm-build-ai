import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PaytmHeader from '../components/PaytmHeader';
import FactorCard from '../components/FactorCard';
import WhatIfSimulator from '../components/WhatIfSimulator';
import ActionPlan from '../components/ActionPlan';
import ProgressTracker from '../components/ProgressTracker';
import AiExplainCard, { LOAN_PLAN_EXPLANATION } from '../components/AiExplainCard';
import KyunAIChatbot from '../components/KyunAIChatbot';
import { LOAN_DECISION, LOAN_FACTORS, LOAN_WHATIF_CONFIG, LOAN_PLAN, LOAN_PROGRESS } from '../data/mockData';
import { formatCurrency } from '../utils/formatting';
import { ArrowRight, Sparkles, AlertCircle } from 'lucide-react';

const TABS = ['Decision', 'Why?', 'What-If', 'Plan', 'Progress'];

export default function LoanJourney() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const renderDecision = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Decision Card */}
      <div style={{
        background: 'white', borderRadius: '18px', padding: '24px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
      }}>
        <p style={{ fontSize: '14px', fontWeight: 500, color: '#888', marginBottom: '8px' }}>Personal Loan Application</p>
        <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#1a1a2e', marginBottom: '8px', letterSpacing: '-0.3px' }}>
          {LOAN_DECISION.decision.label}
        </h2>
        <p style={{ fontSize: '24px', fontWeight: 700, color: '#1a1a2e', marginBottom: '16px' }}>
          {formatCurrency(LOAN_DECISION.requested_amount)}
        </p>
        <div style={{
          display: 'inline-flex', alignItems: 'center',
          background: '#F5F7FA', color: '#777',
          padding: '8px 16px', borderRadius: '24px',
          fontSize: '13px', fontWeight: 600,
          border: '1px solid #eee',
        }}>
          Reviewed on {LOAN_DECISION.date.split('-').reverse().join(' ')}
        </div>
      </div>

      {/* Kyun? CTA Card */}
      <div style={{
        background: 'linear-gradient(135deg, #F8F5FF, #fff)',
        borderRadius: '18px', padding: '24px',
        border: '1px solid #E8DEFF',
        position: 'relative',
        boxShadow: '0 1px 4px rgba(108,60,233,0.06)',
      }}>
        {/* Floating badge */}
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
          <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#1a1a2e', marginBottom: '8px' }}>
            Want to understand why?
          </h3>
          <p style={{ fontSize: '15px', fontWeight: 500, color: '#777', lineHeight: '1.4' }}>
            See the likely factors behind this decision.
          </p>
        </div>
        
        <button 
          onClick={() => setActiveTab(1)} 
          style={{
            width: '100%',
            background: 'linear-gradient(135deg, #6C3CE9, #00BAF2)',
            color: 'white', borderRadius: '14px',
            padding: '16px 0',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: '8px', fontSize: '16px', fontWeight: 700,
            border: 'none', cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(108,60,233,0.25)',
          }}
        >
          See likely factors <ArrowRight size={18} strokeWidth={2.5} />
        </button>
      </div>

      {/* Disclaimer */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', padding: '0 8px', color: '#999' }}>
        <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
        <span style={{ fontSize: '13px', lineHeight: '1.5' }}>
          Likely factors based on available information; not the official decision rationale.
        </span>
      </div>
    </div>
  );

  const renderExplanation = () => {
    const strongestFactors = LOAN_FACTORS.slice(0, 3);
    const otherFactors = LOAN_FACTORS.filter(f => !f.isPositive && !strongestFactors.includes(f));
    const positiveFactors = LOAN_FACTORS.filter(f => f.isPositive);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* AI Explainability Summarization */}
        <AiExplainCard />

        {/* Strongest Factors */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '0 2px', marginBottom: '14px' }}>
            <div style={{
              width: '38px', height: '38px', borderRadius: '12px',
              background: '#F8F5FF', border: '1px solid #E8DEFF',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#6C3CE9', boxShadow: '0 2px 6px rgba(108,60,233,0.12)',
            }}>
              <Sparkles size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: '17px', fontWeight: 700, color: '#1a1a2e', marginBottom: '2px' }}>Here's what we found</h2>
              <p style={{ fontSize: '12px', fontWeight: 500, color: '#888' }}>Strongest contributing factors</p>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {strongestFactors.map((factor, i) => (
              <FactorCard key={factor.id} factor={factor} index={i} />
            ))}
          </div>
        </div>

        {/* Other Factors */}
        {otherFactors.length > 0 && (
          <div>
            <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#1a1a2e', padding: '0 2px', marginBottom: '12px' }}>
              Other contributing signals
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {otherFactors.map((factor, i) => (
                <FactorCard key={factor.id} factor={factor} index={strongestFactors.length + i} />
              ))}
            </div>
          </div>
        )}

        {/* Positive Factors */}
        {positiveFactors.length > 0 && (
          <div>
            <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#1a1a2e', padding: '0 2px', marginBottom: '12px' }}>
              What worked in your favour
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {positiveFactors.map((factor, i) => (
                <FactorCard key={factor.id} factor={factor} index={strongestFactors.length + otherFactors.length + i} />
              ))}
            </div>
          </div>
        )}

        {/* How Kyun? knows this */}
        <div style={{
          background: 'white', borderRadius: '16px', padding: '16px',
          boxShadow: '0 1px 4px rgba(0,0,0,0.05)', marginTop: '8px'
        }}>
          <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#1a1a2e', marginBottom: '12px' }}>How Kyun? knows this</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#0277BD', background: '#E3F2FD', padding: '6px 12px', borderRadius: '14px' }}>✓ Application data</span>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#0277BD', background: '#E3F2FD', padding: '6px 12px', borderRadius: '14px' }}>✓ Credit profile</span>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#0277BD', background: '#E3F2FD', padding: '6px 12px', borderRadius: '14px' }}>✓ Repayment history</span>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#0277BD', background: '#E3F2FD', padding: '6px 12px', borderRadius: '14px' }}>✓ Derived financial signals</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #f0f0f0' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '16px', fontWeight: 800, color: '#1a1a2e' }}>7</div>
              <div style={{ fontSize: '11px', color: '#888' }}>Available signals</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '16px', fontWeight: 800, color: '#1a1a2e' }}>3</div>
              <div style={{ fontSize: '11px', color: '#888' }}>Derived signals</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '16px', fontWeight: 800, color: '#B91C1C' }}>2</div>
              <div style={{ fontSize: '11px', color: '#888' }}>Missing info</div>
            </div>
          </div>
        </div>

        {/* Confidence */}
        <div style={{
          background: 'white', borderRadius: '16px', padding: '16px',
          boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '14px', fontWeight: 700, color: '#1a1a2e' }}>Explanation confidence</span>
            <span style={{ fontSize: '16px', fontWeight: 800, color: '#1a1a2e' }}>{Math.round(LOAN_DECISION.confidence * 100)}%</span>
          </div>
          <div style={{ height: '6px', width: '100%', background: '#f0f0f0', borderRadius: '3px', overflow: 'hidden', marginBottom: '10px' }}>
            <div style={{ height: '100%', background: 'linear-gradient(90deg, #6C3CE9, #00BAF2)', borderRadius: '3px', width: `${LOAN_DECISION.confidence * 100}%` }} />
          </div>
          <p style={{ fontSize: '12px', fontWeight: 500, color: '#666', marginBottom: '12px', lineHeight: '1.4' }}>
            Based on completeness of available data, consistency of financial signals, and number of supporting data points.
          </p>
          <button 
            onClick={() => alert("What does 78% mean?\n\nKyun? has enough available data to identify several likely contributing factors, but it does not have complete access to the lender's internal decision model.\n\nConfidence represents confidence in this explanation, not the probability that the application would be approved.")}
            style={{
              background: '#F5F7FA', color: '#555', border: 'none', borderRadius: '8px',
              padding: '8px 12px', fontSize: '12px', fontWeight: 600, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '6px', width: '100%', justifyContent: 'center'
            }}
          >
            <AlertCircle size={14} /> What does this mean?
          </button>
        </div>

        {/* What's Missing */}
        <div style={{
          background: '#FFF8F8', borderRadius: '16px', padding: '16px',
          border: '1px solid #FFE4E4',
        }}>
          <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#B91C1C', marginBottom: '8px' }}>What's missing?</h3>
          <p style={{ fontSize: '13px', color: '#666', lineHeight: '1.5', marginBottom: '12px' }}>
            Kyun? can explain several contributing signals, but some decision information may not be available.
          </p>
          <ul style={{ paddingLeft: '20px', margin: 0, fontSize: '13px', color: '#555', lineHeight: '1.6', marginBottom: '12px' }}>
            <li>Internal lender policy threshold</li>
            <li>Internal risk model score</li>
            <li>Certain verification signals</li>
          </ul>
          <div style={{ background: '#FEE2E2', padding: '10px', borderRadius: '8px' }}>
            <p style={{ fontSize: '11px', color: '#B91C1C', fontWeight: 500, lineHeight: '1.4' }}>
              This means Kyun? can explain likely contributing factors, but cannot guarantee the exact internal reason used by the lender.
            </p>
          </div>
        </div>

        {/* AI Insight */}
        <div style={{
          background: 'linear-gradient(135deg, #F8F5FF, #fff)', borderRadius: '16px', padding: '16px',
          border: '1px solid #E8DEFF', boxShadow: '0 2px 8px rgba(108,60,233,0.06)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <Sparkles size={16} color="#6C3CE9" />
            <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#6C3CE9', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Kyun? AI Insight</h3>
          </div>
          <p style={{ fontSize: '13px', color: '#1a1a2e', lineHeight: '1.6', fontWeight: 500, marginBottom: '12px' }}>
            The strongest pattern in your available data is high current credit usage combined with recent late payments.
          </p>
          <p style={{ fontSize: '13px', color: '#555', lineHeight: '1.6', marginBottom: '16px' }}>
            Reducing revolving credit utilisation and maintaining on-time payments may improve these specific financial signals over time. However, these actions do not guarantee approval because the lender may consider additional information that is not available to Kyun?.
          </p>
          <button 
            onClick={() => setIsChatOpen(true)}
            style={{
              width: '100%', background: 'white', color: '#6C3CE9',
              border: '1px solid #E8DEFF', borderRadius: '10px', padding: '12px',
              fontSize: '13px', fontWeight: 700, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
            }}
          >
            Ask Kyun? about this <ArrowRight size={14} />
          </button>
        </div>

        {/* CTA */}
        <button 
          onClick={() => setActiveTab(3)} 
          style={{
            width: '100%', background: '#1C2541', color: 'white',
            borderRadius: '12px', padding: '14px 0',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: '8px', fontSize: '15px', fontWeight: 700,
            border: 'none', cursor: 'pointer', marginTop: '10px'
          }}
        >
          See your plan <ArrowRight size={18} strokeWidth={2.5} />
        </button>
      </div>
    );
  };

  const renderWhatIf = () => (
    <div>
      <WhatIfSimulator
        config={LOAN_WHATIF_CONFIG}
        productType="loan"
        onCreatePlan={() => setActiveTab(3)}
        onNavigateToWhy={() => setActiveTab(1)}
      />
    </div>
  );

  const renderPlan = () => (
    <div>
      <ActionPlan plan={LOAN_PLAN} onNavigate={setActiveTab} />
    </div>
  );

  const renderProgress = () => (
    <div>
      <ProgressTracker progress={LOAN_PROGRESS} productType="loan" onNavigate={setActiveTab} />
    </div>
  );

  const content = [renderDecision, renderExplanation, renderWhatIf, renderPlan, renderProgress];

  return (
    <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column', background: '#F5F7FA' }}>
      <PaytmHeader 
        showBack 
        title="Personal Loan Application" 
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

      {/* Tabs */}
      <div style={{
        position: 'sticky', top: '56px', zIndex: 20,
        background: 'white',
        borderBottom: '1px solid #eee',
        boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
      }}>
        <div className="hide-scrollbar" style={{
          display: 'flex', overflowX: 'auto',
          gap: '0', padding: '0 16px',
        }}>
          {TABS.map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActiveTab(i)}
              style={{
                padding: '14px 16px',
                fontSize: '15px', fontWeight: 600,
                whiteSpace: 'nowrap',
                background: 'none', border: 'none',
                cursor: 'pointer', outline: 'none',
                color: activeTab === i ? '#6C3CE9' : '#aaa',
                borderBottom: activeTab === i ? '3px solid #6C3CE9' : '3px solid transparent',
                transition: 'color 0.2s, border-color 0.2s',
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '16px', paddingBottom: '120px' }}>
        {content[activeTab]()}
      </div>

      <KyunAIChatbot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
}
