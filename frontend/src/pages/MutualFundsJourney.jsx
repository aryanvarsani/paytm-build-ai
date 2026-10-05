import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PaytmHeader from '../components/PaytmHeader';
import ActionPlan from '../components/ActionPlan';
import ProgressTracker from '../components/ProgressTracker';
import KyunAIChatbot from '../components/KyunAIChatbot';
import { MF_PORTFOLIO_STATE, MF_PLAN, MF_PROGRESS } from '../data/mockData';
import { formatCurrency } from '../utils/formatting';
import { Sparkles, ArrowRight, AlertCircle, CheckCircle2, Circle, Info, Volume2, ChevronRight, PieChart, ShieldAlert, Check } from 'lucide-react';

const TABS = ['Portfolio', 'Insights', 'What-If', 'Plan', 'Progress'];

const ALLOCATION_COLORS = {
  Equity: '#6C3CE9',
  Debt: '#00BAF2',
  Other: '#F59E0B',
};

function DonutChart({ segments, totalValue }) {
  const total = segments.reduce((a, s) => a + s.pct, 0);
  let cumulative = 0;
  const size = 180;
  const strokeWidth = 18;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {segments.map((seg) => {
        const dashLength = (seg.pct / total) * circumference;
        const dashOffset = -(cumulative / total) * circumference;
        cumulative += seg.pct;
        return (
          <circle
            key={seg.label}
            cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke={seg.color}
            strokeWidth={strokeWidth}
            strokeDasharray={`${dashLength} ${circumference - dashLength}`}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            style={{ transition: 'stroke-dasharray 0.8s ease' }}
          />
        );
      })}
      <text x={size / 2} y={size / 2 - 4} textAnchor="middle" fontSize="20" fontWeight="800" fill="#1a1a2e">
        {formatCurrency(totalValue)}
      </text>
      <text x={size / 2} y={size / 2 + 16} textAnchor="middle" fontSize="12" fontWeight="600" fill="#94A3B8">
        Total Value
      </text>
    </svg>
  );
}

export default function MutualFundsJourney() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedFactor, setSelectedFactor] = useState(null);

  const allocationSegments = [
    { label: 'Equity', pct: MF_PORTFOLIO_STATE.allocation.equity, color: ALLOCATION_COLORS.Equity },
    { label: 'Debt', pct: MF_PORTFOLIO_STATE.allocation.debt, color: ALLOCATION_COLORS.Debt },
    { label: 'Other', pct: MF_PORTFOLIO_STATE.allocation.other, color: ALLOCATION_COLORS.Other },
  ];

  const renderPortfolio = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* 1. YOUR PORTFOLIO CARD */}
      <div style={{ background: 'white', borderRadius: '20px', padding: '24px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', border: '1px solid #F1F5F9' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
          <div>
            <h2 style={{ fontSize: '13px', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Your Portfolio</h2>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#1a1a2e' }}>{formatCurrency(MF_PORTFOLIO_STATE.totalValue)}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', marginBottom: '4px' }}>Portfolio Status</div>
            <div style={{ background: '#FFFBEB', color: '#B45309', padding: '4px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: 800, border: '1px solid #FEF3C7' }}>
              {MF_PORTFOLIO_STATE.status.toUpperCase()}
            </div>
          </div>
        </div>

        <div style={{ background: '#F8F9FB', padding: '12px', borderRadius: '12px', marginBottom: '24px', borderLeft: '4px solid #B45309' }}>
          <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', marginBottom: '2px' }}>Primary Signal</div>
          <div style={{ fontSize: '14px', fontWeight: 700, color: '#1a1a2e' }}>{MF_PORTFOLIO_STATE.primarySignal}</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '24px' }}>
          <DonutChart segments={allocationSegments} totalValue={MF_PORTFOLIO_STATE.totalValue} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', borderTop: '1px solid #F1F5F9', paddingTop: '20px' }}>
          {allocationSegments.map((seg) => (
            <div key={seg.label} style={{ textAlign: 'center' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: seg.color, margin: '0 auto 6px' }} />
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#1a1a2e', marginBottom: '2px' }}>{seg.pct}%</div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase' }}>{seg.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. KYUN? AI SUMMARY */}
      <div style={{
        background: 'linear-gradient(135deg, #F8F5FF, #fff)', borderRadius: '20px', padding: '24px',
        border: '1px solid #E8DEFF', boxShadow: '0 4px 12px rgba(108,60,233,0.08)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={18} color="#6C3CE9" />
            <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#6C3CE9', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Kyun? AI Summary</h3>
          </div>
          <select style={{ background: 'white', border: '1px solid #E8DEFF', borderRadius: '8px', padding: '4px 8px', fontSize: '11px', fontWeight: 700, color: '#6C3CE9', outline: 'none' }}>
            <option>English</option>
            <option>Hindi</option>
          </select>
        </div>

        <p style={{ fontSize: '14px', color: '#1a1a2e', lineHeight: '1.6', fontWeight: 600, marginBottom: '12px' }}>
          Your portfolio currently has approximately 82% exposure to equity-oriented investments.
        </p>
        <p style={{ fontSize: '13px', color: '#475569', lineHeight: '1.6', marginBottom: '12px' }}>
          This means a large portion of your portfolio may experience market fluctuations associated with equity investments. Kyun? is highlighting this because the current allocation may be worth reviewing against your investment goal, time horizon, and comfort with market volatility.
        </p>
        <p style={{ fontSize: '13px', color: '#475569', lineHeight: '1.6', marginBottom: '20px' }}>
          This explanation is based only on the portfolio information available to Kyun? and does not represent a prediction of future returns.
        </p>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            onClick={() => setActiveTab(1)} // Go to Insights
            style={{ flex: 1, background: '#6C3CE9', color: 'white', borderRadius: '12px', padding: '12px', fontSize: '14px', fontWeight: 700, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
          >
            Understand why <ArrowRight size={16} />
          </button>
          <button 
            onClick={() => alert("Simulating Sarvam AI Voice TTS")}
            style={{ width: '48px', background: 'white', color: '#6C3CE9', border: '1px solid #E8DEFF', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
          >
            <Volume2 size={20} />
          </button>
        </div>
      </div>

      {/* 3. WHY THIS NEEDS ATTENTION */}
      <div>
        <h3 style={{ fontSize: '13px', fontWeight: 800, color: '#1a1a2e', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', padding: '0 4px' }}>Why this needs attention</h3>
        <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '16px', padding: '0 4px' }}>Based on the portfolio information available to Kyun?, the main areas worth reviewing are:</p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {MF_PORTFOLIO_STATE.factors.map(factor => (
            <div key={factor.id} style={{ background: 'white', borderRadius: '16px', padding: '16px', border: '1px solid #F1F5F9', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#1a1a2e', textTransform: 'uppercase' }}>{factor.name}</h4>
                <div style={{ background: factor.importance === 'HIGH' ? '#FEF2F2' : '#FFFBEB', color: factor.importance === 'HIGH' ? '#DC2626' : '#B45309', padding: '4px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: 800, letterSpacing: '0.05em' }}>
                  {factor.importance} ATTENTION
                </div>
              </div>
              
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#1a1a2e', marginBottom: '12px' }}>{factor.value}{factor.unit}</div>
              
              <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Why it matters</div>
              <p style={{ fontSize: '13px', color: '#334155', lineHeight: '1.5', marginBottom: '16px' }}>{factor.explanation}</p>
              
              <button 
                onClick={() => setSelectedFactor(factor)}
                style={{ width: '100%', background: '#F8F9FB', border: '1px solid #E2E8F0', padding: '10px', borderRadius: '10px', fontSize: '13px', fontWeight: 700, color: '#1a1a2e', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px' }}
              >
                Show my data <ChevronRight size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 4. WHAT LOOKS GOOD */}
      <div style={{ background: 'white', borderRadius: '16px', padding: '20px', border: '1px solid #F1F5F9', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
        <h3 style={{ fontSize: '13px', fontWeight: 800, color: '#10B981', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>What looks good</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
            <CheckCircle2 size={18} color="#10B981" style={{ flexShrink: 0, marginTop: '1px' }} />
            <span style={{ fontSize: '13px', color: '#1a1a2e', fontWeight: 500, lineHeight: '1.4' }}>Diversified across multiple asset categories (Equity, Debt, Other)</span>
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
            <CheckCircle2 size={18} color="#10B981" style={{ flexShrink: 0, marginTop: '1px' }} />
            <span style={{ fontSize: '13px', color: '#1a1a2e', fontWeight: 500, lineHeight: '1.4' }}>Stable SIP investment pattern</span>
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
            <CheckCircle2 size={18} color="#10B981" style={{ flexShrink: 0, marginTop: '1px' }} />
            <span style={{ fontSize: '13px', color: '#1a1a2e', fontWeight: 500, lineHeight: '1.4' }}>Good overall portfolio liquidity</span>
          </div>
        </div>
        <p style={{ fontSize: '11px', color: '#94A3B8', fontStyle: 'italic' }}>These observations are based on the available portfolio data.</p>
      </div>

      {/* 5. HOW KYUN? KNOWS THIS */}
      <div style={{ background: '#1a1a2e', borderRadius: '20px', padding: '24px', color: 'white' }}>
        <h3 style={{ fontSize: '13px', fontWeight: 800, color: 'white', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '20px' }}>How Kyun? knows this</h3>
        
        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', marginBottom: '12px' }}>Available Data</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}><Check size={16} color="#10B981" /><span style={{ fontSize: '13px', fontWeight: 500 }}>Portfolio holdings & allocation</span></div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}><Check size={16} color="#10B981" /><span style={{ fontSize: '13px', fontWeight: 500 }}>Fund categories</span></div>
          </div>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', marginBottom: '12px' }}>What Kyun? doesn't know</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}><Circle size={16} color="#64748B" /><span style={{ fontSize: '13px', fontWeight: 500, color: '#CBD5E1' }}>Your exact risk tolerance</span></div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}><Circle size={16} color="#64748B" /><span style={{ fontSize: '13px', fontWeight: 500, color: '#CBD5E1' }}>External financial assets</span></div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}><Circle size={16} color="#64748B" /><span style={{ fontSize: '13px', fontWeight: 500, color: '#CBD5E1' }}>Tax considerations</span></div>
          </div>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.1)', padding: '16px', borderRadius: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: 'white' }}>Explanation Confidence</span>
            <span style={{ fontSize: '18px', fontWeight: 800, color: '#00BAF2' }}>{Math.round(MF_PORTFOLIO_STATE.confidence * 100)}%</span>
          </div>
          <p style={{ fontSize: '11px', color: '#94A3B8', lineHeight: '1.4' }}>
            Because some information may be unavailable, Kyun? cannot determine whether this allocation is appropriate for your personal circumstances with certainty.
          </p>
        </div>
      </div>

      {/* 6. NEXT STEPS & EXPLORE */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
        <button 
          onClick={() => setActiveTab(2)} // What-If
          style={{ width: '100%', background: 'white', color: '#1a1a2e', border: '1px solid #CBD5E1', borderRadius: '12px', padding: '16px', fontSize: '15px', fontWeight: 700, display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
        >
          <span>Explore What-If scenario</span> <ArrowRight size={18} color="#64748B" />
        </button>
        
        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <h3 style={{ fontSize: '13px', fontWeight: 800, color: '#1a1a2e', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Next Step</h3>
          <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '16px', padding: '0 16px' }}>Review your portfolio against your goal, risk tolerance, and investment horizon.</p>
          <button 
            onClick={() => setActiveTab(3)} // Plan
            style={{ width: '100%', background: '#1C2541', color: 'white', border: 'none', borderRadius: '12px', padding: '16px', fontSize: '15px', fontWeight: 700, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(28,37,65,0.15)' }}
          >
            View my plan <ArrowRight size={18} strokeWidth={2.5} />
          </button>
        </div>
      </div>
      
    </div>
  );

  const renderInsights = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ marginBottom: '8px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#1a1a2e', textTransform: 'uppercase', letterSpacing: '0.02em', marginBottom: '8px' }}>Portfolio Insights</h2>
        <p style={{ fontSize: '14px', color: '#64748B', fontWeight: 500, lineHeight: '1.5' }}>Here are the specific factors behind Kyun?'s assessment.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {MF_PORTFOLIO_STATE.factors.map((factor, i) => (
          <div key={factor.id} style={{ background: 'white', borderRadius: '16px', padding: '16px', border: '1px solid #F1F5F9', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '16px', background: '#F8F5FF', color: '#6C3CE9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '13px', fontWeight: 800 }}>
                {i + 1}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', marginBottom: '2px' }}>{factor.name}</div>
                <div style={{ fontSize: '15px', fontWeight: 700, color: '#1a1a2e', marginBottom: '8px' }}>{factor.evidence}</div>
                <button 
                  onClick={() => setSelectedFactor(factor)}
                  style={{ background: 'none', border: 'none', color: '#6C3CE9', fontSize: '13px', fontWeight: 700, padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <Sparkles size={14} /> Kyun? Explain
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ background: '#F8F9FB', borderRadius: '16px', padding: '20px', border: '1px solid #E2E8F0', marginTop: '8px' }}>
        <h3 style={{ fontSize: '12px', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>Other Observations</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 600, marginBottom: '2px' }}>Expense Ratio</div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#1a1a2e' }}>{MF_PORTFOLIO_STATE.expenseRatio}% avg</div>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 600, marginBottom: '2px' }}>Liquidity</div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#1a1a2e' }}>{MF_PORTFOLIO_STATE.liquidity}</div>
          </div>
          <div style={{ gridColumn: 'span 2' }}>
            <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 600, marginBottom: '2px' }}>SIP Consistency</div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#1a1a2e' }}>{MF_PORTFOLIO_STATE.sipConsistency}</div>
          </div>
        </div>
      </div>
    </div>
  );

  const [scenario, setScenario] = useState({ equity: 82, debt: 12, other: 6 });

  const handleSliderChange = (type, val) => {
    let newVal = Number(val);
    const prev = scenario[type];
    const diff = newVal - prev;

    const others = ['equity', 'debt', 'other'].filter(k => k !== type);
    const sumOthers = scenario[others[0]] + scenario[others[1]];
    
    if (sumOthers === 0 && diff > 0) return; // cannot increase if no room
    if (sumOthers - diff < 0) {
      newVal = prev + sumOthers; // max possible
    }

    const actualDiff = newVal - prev;
    
    const newScenario = { ...scenario, [type]: newVal };
    
    // distribute the inverse diff proportionally
    if (sumOthers > 0) {
      const ratio0 = scenario[others[0]] / sumOthers;
      newScenario[others[0]] = Math.max(0, Math.round(scenario[others[0]] - (actualDiff * ratio0)));
      newScenario[others[1]] = 100 - newScenario[type] - newScenario[others[0]];
    } else {
      // if others were 0, just give all to the first other (shouldn't happen on decrease unless it was 100)
      newScenario[others[0]] = 100 - newScenario[type];
      newScenario[others[1]] = 0;
    }
    setScenario(newScenario);
  };

  const renderWhatIf = () => {
    const isChanged = scenario.equity !== 82 || scenario.debt !== 12 || scenario.other !== 6;
    
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#1a1a2e', textTransform: 'uppercase', letterSpacing: '0.02em', marginBottom: '8px', lineHeight: '1.2' }}>What if you changed your allocation?</h2>
          <p style={{ fontSize: '14px', color: '#64748B', fontWeight: 500, lineHeight: '1.5' }}>Explore how different allocations could change portfolio characteristics.</p>
        </div>

        <div style={{ background: 'white', borderRadius: '16px', padding: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)', border: '1px solid #F1F5F9' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
            <span style={{ fontSize: '14px', fontWeight: 700, color: '#1a1a2e' }}>Total Allocation</span>
            <span style={{ fontSize: '14px', fontWeight: 800, color: '#6C3CE9' }}>{scenario.equity + scenario.debt + scenario.other}%</span>
          </div>

          {[
            { id: 'equity', label: 'Equity', color: '#6C3CE9' },
            { id: 'debt', label: 'Debt', color: '#00BAF2' },
            { id: 'other', label: 'Other', color: '#F59E0B' }
          ].map(v => (
            <div key={v.id} style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '14px', fontWeight: 700, color: '#1a1a2e' }}>{v.label}</span>
                <span style={{ fontSize: '14px', fontWeight: 700, color: v.color }}>{scenario[v.id]}%</span>
              </div>
              <input
                type="range"
                min="0" max="100" step="1"
                value={scenario[v.id]}
                onChange={(e) => handleSliderChange(v.id, e.target.value)}
                style={{ width: '100%', accentColor: v.color }}
              />
            </div>
          ))}
        </div>

        {isChanged && (
          <div style={{ background: '#1C2541', borderRadius: '16px', padding: '20px', color: 'white' }}>
            <h3 style={{ fontSize: '12px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>Simulated Portfolio</h3>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Current</div>
                <div style={{ fontSize: '16px', fontWeight: 800 }}>82 / 12 / 6</div>
              </div>
              <ArrowRight size={20} color="#6C3CE9" />
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '11px', color: '#34D399', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>Scenario</div>
                <div style={{ fontSize: '16px', fontWeight: 800, color: '#34D399' }}>{scenario.equity} / {scenario.debt} / {scenario.other}</div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '16px' }}>
              <h4 style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', marginBottom: '12px' }}>Simulated Characteristics</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <div style={{ fontSize: '11px', color: '#94A3B8', marginBottom: '2px' }}>Equity exposure</div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: scenario.equity < 82 ? '#34D399' : (scenario.equity > 82 ? '#F87171' : 'white') }}>
                    {scenario.equity < 82 ? 'Lower' : (scenario.equity > 82 ? 'Higher' : 'Unchanged')}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#94A3B8', marginBottom: '2px' }}>Diversification</div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: 'white' }}>
                    {scenario.equity < 82 ? 'Potentially higher' : 'May differ'}
                  </div>
                </div>
              </div>
              <p style={{ fontSize: '12px', color: '#94A3B8', marginTop: '16px', lineHeight: '1.4' }}>
                This scenario {scenario.equity < 82 ? 'reduces' : 'changes'} equity exposure. The resulting portfolio may have different volatility and return characteristics.
              </p>
            </div>
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <button 
            onClick={() => setActiveTab(3)}
            style={{ width: '100%', background: '#1a1a2e', color: 'white', border: 'none', borderRadius: '12px', padding: '16px', fontSize: '15px', fontWeight: 700, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(28,37,65,0.15)' }}
          >
            Review my plan <ArrowRight size={18} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    );
  };

  const renderPlan = () => (
    <div><ActionPlan plan={MF_PLAN} onNavigate={setActiveTab} /></div>
  );

  const renderProgress = () => (
    <div><ProgressTracker progress={MF_PROGRESS} productType="mutual_funds" onNavigate={setActiveTab} /></div>
  );

  const content = [renderPortfolio, renderInsights, renderWhatIf, renderPlan, renderProgress];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#F8FAFC' }}>
      <PaytmHeader 
        showBack 
        title="Mutual Funds" 
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
        background: 'white', borderBottom: '1px solid #F1F5F9',
        boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
      }}>
        <div className="hide-scrollbar" style={{ display: 'flex', overflowX: 'auto', padding: '0 16px' }}>
          {TABS.map((tab, i) => (
            <button key={tab} onClick={() => { setActiveTab(i); window.scrollTo(0,0); }} style={{
              padding: '16px 16px', fontSize: '14px', fontWeight: 700,
              whiteSpace: 'nowrap', background: 'none', border: 'none',
              cursor: 'pointer', outline: 'none',
              color: activeTab === i ? '#6C3CE9' : '#94A3B8',
              borderBottom: activeTab === i ? '3px solid #6C3CE9' : '3px solid transparent',
              transition: 'color 0.2s, border-color 0.2s',
            }}>
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: '20px 16px', paddingBottom: '120px' }}>
        {content[activeTab]()}
      </div>

      {/* Factor Detail Bottom Sheet (Simulated) */}
      {selectedFactor && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(15, 23, 42, 0.6)', zIndex: 100,
          display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
          animation: 'fadeIn 0.2s ease-out'
        }}>
          <div style={{
            background: 'white', borderTopLeftRadius: '24px', borderTopRightRadius: '24px',
            padding: '24px', maxHeight: '85vh', overflowY: 'auto',
            animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div>
                <div style={{ fontSize: '11px', color: '#6C3CE9', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Sparkles size={12} /> Kyun? Explain
                </div>
                <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#1a1a2e', textTransform: 'uppercase' }}>{selectedFactor.name}</h2>
              </div>
              <button onClick={() => setSelectedFactor(null)} style={{ background: '#F1F5F9', border: 'none', width: '32px', height: '32px', borderRadius: '16px', fontSize: '16px', fontWeight: 700, color: '#64748B', cursor: 'pointer' }}>×</button>
            </div>

            <div style={{ fontSize: '32px', fontWeight: 800, color: '#1a1a2e', marginBottom: '4px' }}>{selectedFactor.value}{selectedFactor.unit}</div>
            <div style={{ background: selectedFactor.importance === 'HIGH' ? '#FEF2F2' : '#FFFBEB', color: selectedFactor.importance === 'HIGH' ? '#DC2626' : '#B45309', padding: '4px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: 800, letterSpacing: '0.05em', display: 'inline-block', marginBottom: '24px' }}>
              {selectedFactor.importance} ATTENTION
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <h4 style={{ fontSize: '12px', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>What I found</h4>
                <div style={{ background: '#F8F9FB', padding: '16px', borderRadius: '12px', fontSize: '14px', color: '#1a1a2e', fontWeight: 600, borderLeft: '3px solid #6C3CE9' }}>
                  {selectedFactor.evidence}
                </div>
              </div>

              <div>
                <h4 style={{ fontSize: '12px', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Why it matters</h4>
                <p style={{ fontSize: '14px', color: '#334155', lineHeight: '1.6' }}>{selectedFactor.explanation}</p>
              </div>

              <div>
                <h4 style={{ fontSize: '12px', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>What I don't know</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}><Circle size={14} color="#94A3B8" /><span style={{ fontSize: '13px', color: '#475569' }}>Your exact investment horizon</span></div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}><Circle size={14} color="#94A3B8" /><span style={{ fontSize: '13px', color: '#475569' }}>Your risk tolerance</span></div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}><Circle size={14} color="#94A3B8" /><span style={{ fontSize: '13px', color: '#475569' }}>Your other investments</span></div>
                </div>
              </div>

              <div style={{ background: '#F0FDF4', border: '1px solid #DCFCE7', padding: '16px', borderRadius: '12px' }}>
                <h4 style={{ fontSize: '12px', fontWeight: 800, color: '#166534', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>What this means for you</h4>
                <p style={{ fontSize: '13px', color: '#15803D', lineHeight: '1.5', fontWeight: 500 }}>
                  This may be worth reviewing against your personal goals. This does not mean the portfolio will perform poorly or that you should immediately sell your investments.
                </p>
              </div>

              <button 
                onClick={() => { setSelectedFactor(null); setActiveTab(2); }}
                style={{ width: '100%', background: '#1a1a2e', color: 'white', borderRadius: '12px', padding: '16px', fontSize: '15px', fontWeight: 700, border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '8px' }}
              >
                Explore What-If <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      <KyunAIChatbot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
}
