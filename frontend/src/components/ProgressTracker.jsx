import { useState, useEffect } from 'react';
import { CheckCircle2, Circle, ArrowRight, Target, AlertCircle, Sparkles, Volume2, Info } from 'lucide-react';

export default function ProgressTracker({ progress, productType, onNavigate }) {
  // Graceful fallback for non-loan products without the new rich progress structure
  if (!progress.signals) {
    return (
      <div style={{ padding: '20px', background: 'white', borderRadius: '16px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Legacy Progress</h3>
        <p style={{ fontSize: '13px', color: '#666' }}>This progress format is no longer supported.</p>
      </div>
    );
  }

  // Calculate days elapsed
  const startDate = new Date(progress.startDate);
  const today = new Date('2026-10-03'); // Hardcoded for this prototype/demo
  const daysElapsed = Math.max(1, Math.floor((today - startDate) / (1000 * 60 * 60 * 24)));
  
  const progressPct = Math.round((progress.planProgress.completedActions / progress.planProgress.totalActions) * 100);

  // Status computation logic
  const getSignalStatus = (signal) => {
    if (signal.statusOverride) return signal.statusOverride;
    
    if (signal.direction === 'lower_is_better') {
      if (signal.current <= signal.target) return 'TARGET REACHED';
      if (signal.current < signal.start) {
        // If it's close (within 10%)
        if ((signal.current - signal.target) / (signal.start - signal.target) < 0.2) return 'NEAR TARGET';
        return 'IMPROVING';
      }
      if (signal.current > signal.start) return 'NEEDS ATTENTION';
      return 'STABLE';
    } else {
      if (signal.current >= signal.target) return 'TARGET REACHED';
      if (signal.current > signal.start) {
        if ((signal.target - signal.current) / (signal.target - signal.start) < 0.2) return 'NEAR TARGET';
        return 'IMPROVING';
      }
      if (signal.current < signal.start) return 'NEEDS ATTENTION';
      return 'STABLE';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'IMPROVING': return { bg: '#D1FAE5', text: '#047857' };
      case 'NEAR TARGET': return { bg: '#DBEAFE', text: '#1D4ED8' };
      case 'TARGET REACHED': return { bg: '#D1FAE5', text: '#047857' };
      case 'NEEDS ATTENTION': return { bg: '#FEF3C7', text: '#B45309' };
      case 'GRADUAL CHANGE': return { bg: '#F1F5F9', text: '#475569' };
      case 'STABLE': return { bg: '#F1F5F9', text: '#64748B' };
      default: return { bg: '#F1F5F9', text: '#64748B' };
    }
  };

  const calculatePctTowardTarget = (signal) => {
    if (!signal.target) return 0;
    if (signal.direction === 'lower_is_better') {
      const totalDiff = signal.start - signal.target;
      const currentDiff = signal.start - signal.current;
      return Math.min(100, Math.max(0, (currentDiff / totalDiff) * 100));
    } else {
      const totalDiff = signal.target - signal.start;
      const currentDiff = signal.current - signal.start;
      return Math.min(100, Math.max(0, (currentDiff / totalDiff) * 100));
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '30px' }}>
      
      {/* 1. Header */}
      <div>
        <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#1a1a2e', marginBottom: '8px', lineHeight: '1.2', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
          Your progress
        </h2>
        <p style={{ fontSize: '14px', color: '#555', fontWeight: 500, lineHeight: '1.5', marginBottom: '12px' }}>
          Track the actions you've completed and the financial signals that may change over time.
        </p>
        <div style={{ display: 'flex', gap: '16px', fontSize: '12px', fontWeight: 600, color: '#666' }}>
          <div>Started: <span style={{ color: '#1a1a2e' }}>{progress.startDate.split('-').reverse().join(' ')}</span></div>
          <div>Day <span style={{ color: '#1a1a2e' }}>{daysElapsed}</span> of {progress.duration}</div>
        </div>
      </div>

      {/* 2. Plan Progress Card */}
      <div style={{ background: 'white', borderRadius: '16px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid #E2E8F0' }}>
        <h3 style={{ fontSize: '12px', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>Your Plan Progress</h3>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '12px' }}>
          <div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#1a1a2e', lineHeight: 1 }}>
              {progress.planProgress.completedActions} <span style={{ fontSize: '16px', color: '#94A3B8', fontWeight: 600 }}>/ {progress.planProgress.totalActions}</span>
            </div>
            <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 600, marginTop: '4px' }}>actions completed</div>
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#6C3CE9' }}>
            {progressPct}%
          </div>
        </div>
        
        <div style={{ height: '8px', background: '#F1F5F9', borderRadius: '4px', overflow: 'hidden', marginBottom: '20px' }}>
          <div style={{ height: '100%', background: 'linear-gradient(90deg, #6C3CE9, #00BAF2)', width: `${progressPct}%` }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', borderTop: '1px solid #F1F5F9', paddingTop: '16px' }}>
          <div>
            <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>High-priority</div>
            <div style={{ fontSize: '14px', fontWeight: 800, color: '#1a1a2e' }}>{progress.planProgress.highPriorityCompleted} / {progress.planProgress.highPriorityTotal} completed</div>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>Next milestone</div>
            <div style={{ fontSize: '14px', fontWeight: 800, color: '#1a1a2e' }}>{progress.planProgress.nextMilestone}</div>
          </div>
        </div>
      </div>

      {/* 3. What You've Completed */}
      <div>
        <h3 style={{ fontSize: '13px', fontWeight: 800, color: '#1a1a2e', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px', padding: '0 4px' }}>What you've completed</h3>
        <div style={{ background: 'white', borderRadius: '16px', padding: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {progress.completedTasks.map((task, i) => (
              <div key={task.id} style={{ display: 'flex', gap: '12px', borderBottom: i < progress.completedTasks.length - 1 ? '1px solid #F1F5F9' : 'none', paddingBottom: i < progress.completedTasks.length - 1 ? '16px' : '0' }}>
                <CheckCircle2 size={20} color="#10B981" style={{ flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#1a1a2e', marginBottom: '2px' }}>{task.title}</div>
                  <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ color: '#10B981', fontWeight: 600 }}>{task.date}</span>
                    <span>•</span>
                    <span>{task.factor}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Next Actions */}
      <div>
        <h3 style={{ fontSize: '13px', fontWeight: 800, color: '#1a1a2e', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px', padding: '0 4px' }}>Next Actions</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {progress.nextActions.map(action => (
            <div key={action.id} style={{ background: 'white', borderRadius: '12px', padding: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', borderLeft: action.priority === 'HIGH' ? '4px solid #F59E0B' : '4px solid #CBD5E1' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <Circle size={20} color="#CBD5E1" style={{ flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#1a1a2e', marginBottom: '4px' }}>{action.title}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 500 }}>
                      Due {action.due}
                    </div>
                    {onNavigate && (
                      <button onClick={() => onNavigate(3)} style={{ background: 'none', border: 'none', color: '#6C3CE9', fontSize: '12px', fontWeight: 700, cursor: 'pointer', padding: 0 }}>
                        View plan →
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Financial Signals Header */}
      <div style={{ marginTop: '16px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#1a1a2e', textTransform: 'uppercase', letterSpacing: '0.02em', marginBottom: '8px' }}>Financial Signals</h2>
        <p style={{ fontSize: '13px', color: '#666', lineHeight: '1.5', padding: '0 4px' }}>
          Changes in the signals highlighted by your Kyun? explanation. <span style={{ fontWeight: 700 }}>Demo progress data.</span>
        </p>
      </div>

      {/* 6. Financial Signal Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {progress.signals.map(sig => {
          const status = getSignalStatus(sig);
          const statusColors = getStatusColor(status);
          
          let changeVal = 0;
          let changeStr = '';
          if (sig.current !== undefined && sig.start !== undefined) {
            changeVal = sig.current - sig.start;
            const diffFormatted = sig.unit === '₹' ? `₹${Math.abs(changeVal).toLocaleString('en-IN')}` : `${Math.abs(changeVal)}`;
            changeStr = changeVal > 0 ? `↑ ${diffFormatted}` : changeVal < 0 ? `↓ ${diffFormatted}` : 'No change';
          }
          
          const pct = calculatePctTowardTarget(sig);

          return (
            <div key={sig.id} style={{ background: 'white', borderRadius: '16px', padding: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', border: '1px solid #F1F5F9' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#1a1a2e', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{sig.label}</h3>
                <div style={{ background: statusColors.bg, color: statusColors.text, padding: '4px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {status}
                </div>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div>
                  <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 600, marginBottom: '2px' }}>Starting point</div>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: '#64748B', textDecoration: 'line-through' }}>
                    {sig.startStr || (sig.unit === '₹' ? `₹${sig.start.toLocaleString()}` : `${sig.start}${sig.unit}`)}
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 600, marginBottom: '2px' }}>Change</div>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: changeVal < 0 && sig.direction === 'lower_is_better' ? '#10B981' : (changeVal > 0 && sig.direction === 'higher_is_better' ? '#10B981' : '#64748B') }}>
                    {changeStr || '-'} {sig.unit === '%' ? 'pts' : ''}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 600, marginBottom: '2px' }}>Current</div>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: '#1a1a2e' }}>
                    {sig.currentStr || (sig.unit === '₹' ? `₹${sig.current.toLocaleString()}` : `${sig.current}${sig.unit}`)}
                  </div>
                </div>
              </div>

              {sig.target !== null && sig.targetStr === undefined && (
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 600, color: '#64748B', marginBottom: '6px' }}>
                    <span>Progress toward target</span>
                    <span>Target: {sig.unit === '₹' ? `₹${sig.target.toLocaleString()}` : `<${sig.target}${sig.unit}`}</span>
                  </div>
                  <div style={{ height: '6px', background: '#F1F5F9', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', background: statusColors.text, width: `${pct}%` }} />
                  </div>
                </div>
              )}

              {sig.customAction && (
                <div style={{ background: '#F8F9FB', padding: '12px', borderRadius: '8px', fontSize: '12px', color: '#334155', fontWeight: 500, marginBottom: '16px', lineHeight: '1.4' }}>
                  {sig.customAction}
                </div>
              )}

              {sig.history && (
                <div style={{ marginBottom: '16px', height: '60px', display: 'flex', alignItems: 'flex-end', gap: '4px' }}>
                  {sig.history.map((val, i) => {
                    const max = Math.max(...sig.history) * 1.1;
                    const h = (val / max) * 100;
                    return (
                      <div key={i} style={{ flex: 1, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center' }}>
                        <div style={{ fontSize: '9px', color: '#94A3B8', marginBottom: '2px' }}>{val}</div>
                        <div style={{ width: '100%', height: `${h}%`, background: i === sig.history.length - 1 ? statusColors.text : '#E2E8F0', borderRadius: '4px 4px 0 0' }} />
                      </div>
                    );
                  })}
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #F1F5F9', paddingTop: '12px' }}>
                <div style={{ fontSize: '10px', color: '#94A3B8', fontWeight: 500 }}>
                  Last updated: {sig.updated}
                </div>
                {onNavigate && (
                  <button onClick={() => onNavigate(1)} style={{ background: 'none', border: 'none', color: '#6C3CE9', fontSize: '12px', fontWeight: 700, cursor: 'pointer', padding: 0 }}>
                    View why →
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 7. Needs Attention */}
      <div>
        <h3 style={{ fontSize: '13px', fontWeight: 800, color: '#1a1a2e', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px', padding: '0 4px' }}>Needs Attention</h3>
        {progress.signals.filter(s => getSignalStatus(s) === 'NEEDS ATTENTION').map(sig => (
          <div key={sig.id} style={{ background: '#FFFBEB', borderRadius: '16px', padding: '16px', border: '1px solid #FEF3C7' }}>
            <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#92400E', marginBottom: '8px' }}>{sig.label}</h4>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#B45309', marginBottom: '8px' }}>
              {sig.currentStr || `${sig.current}${sig.unit}`}
            </div>
            <p style={{ fontSize: '13px', color: '#92400E', lineHeight: '1.4', marginBottom: '12px' }}>
              {sig.customAction || 'This signal has not improved or has worsened. Review your plan and ensure you are taking the recommended actions.'}
            </p>
            {onNavigate && (
              <button onClick={() => onNavigate(3)} style={{ background: 'white', border: '1px solid #FDE68A', color: '#92400E', padding: '8px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>
                View plan →
              </button>
            )}
          </div>
        ))}
        {progress.signals.filter(s => getSignalStatus(s) === 'NEEDS ATTENTION').length === 0 && (
          <div style={{ background: '#F0FDF4', borderRadius: '16px', padding: '16px', border: '1px solid #DCFCE7' }}>
            <p style={{ fontSize: '13px', color: '#166534', fontWeight: 600 }}>You're currently on track. Keep following your plan.</p>
          </div>
        )}
      </div>

      {/* 8. Your Journey (Timeline) */}
      <div>
        <h3 style={{ fontSize: '13px', fontWeight: 800, color: '#1a1a2e', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px', padding: '0 4px' }}>Your Journey</h3>
        <div style={{ background: 'white', borderRadius: '16px', padding: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative' }}>
            <div style={{ position: 'absolute', left: '6px', top: '8px', bottom: '8px', width: '2px', background: '#F1F5F9' }} />
            
            {progress.journey.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '16px', position: 'relative', zIndex: 1 }}>
                <div style={{ marginTop: '2px' }}>
                  {item.status === 'completed' && <CheckCircle2 size={14} color="#10B981" style={{ background: 'white' }} />}
                  {item.status === 'current' && <div style={{ width: '14px', height: '14px', borderRadius: '7px', background: '#6C3CE9', border: '3px solid white', boxShadow: '0 0 0 1px #6C3CE9' }} />}
                  {item.status === 'pending' && <Circle size={14} color="#CBD5E1" style={{ background: 'white' }} />}
                </div>
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: item.status === 'current' ? '#6C3CE9' : '#94A3B8' }}>{item.date}</div>
                  <div style={{ fontSize: '14px', fontWeight: item.status === 'pending' ? 500 : 700, color: item.status === 'pending' ? '#64748B' : '#1a1a2e' }}>{item.text}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 9. Upcoming Milestones */}
      <div>
        <h3 style={{ fontSize: '13px', fontWeight: 800, color: '#1a1a2e', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px', padding: '0 4px' }}>Upcoming Milestones</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {progress.milestones.map((ms, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'white', padding: '12px 16px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '16px', background: '#F8F5FF', color: '#6C3CE9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Target size={16} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#1a1a2e' }}>{ms.label}</div>
                <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 500 }}>Current: {ms.current}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 10. Kyun? AI Progress Summary */}
      <div style={{
        background: 'linear-gradient(135deg, #F8F5FF, #fff)', borderRadius: '16px', padding: '20px',
        border: '1px solid #E8DEFF', boxShadow: '0 2px 8px rgba(108,60,233,0.06)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <Sparkles size={18} color="#6C3CE9" />
          <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#6C3CE9', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Kyun? AI Progress Summary</h3>
        </div>
        
        <p style={{ fontSize: '13px', color: '#1a1a2e', lineHeight: '1.6', fontWeight: 500, marginBottom: '12px' }}>
          You're making progress on the actions in your plan.
        </p>
        
        <p style={{ fontSize: '13px', color: '#555', lineHeight: '1.6', marginBottom: '12px' }}>
          Your outstanding balance has decreased to ₹21,500, and your credit utilisation has moved to approximately 42%. Your repayment consistency still has room to improve, with 5 of the last 6 payments recorded as on time.
        </p>
        
        <p style={{ fontSize: '13px', color: '#555', lineHeight: '1.6', marginBottom: '20px' }}>
          These changes may improve specific financial signals over time. They do not guarantee a different lender decision.
        </p>
        
        <button 
          onClick={() => alert("Simulating Sarvam AI Voice TTS:\n\n'You're making progress on the actions in your plan...'")}
          style={{
            width: '100%', background: 'white', color: '#6C3CE9',
            border: '1px solid #E8DEFF', borderRadius: '10px', padding: '12px',
            fontSize: '13px', fontWeight: 700, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
          }}
        >
          <Volume2 size={16} /> Listen with Sarvam AI
        </button>
      </div>

      {/* 11. Data Status */}
      <div style={{ background: 'white', borderRadius: '16px', padding: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
        <h3 style={{ fontSize: '12px', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>Data Status</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={16} color="#10B981" />
            <span style={{ fontSize: '13px', fontWeight: 500, color: '#334155' }}>User-entered actions recorded</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={16} color="#10B981" />
            <span style={{ fontSize: '13px', fontWeight: 500, color: '#334155' }}>Available profile info updated</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginTop: '4px' }}>
            <Circle size={16} color="#94A3B8" style={{ marginTop: '2px', flexShrink: 0 }} />
            <span style={{ fontSize: '13px', fontWeight: 500, color: '#64748B', lineHeight: '1.4' }}>Some external financial data (like bureau updates) may still be pending reporting</span>
          </div>
        </div>

        <div style={{ background: '#F8F9FB', padding: '12px', borderRadius: '8px', fontSize: '11px', color: '#64748B', display: 'flex', gap: '8px' }}>
          <Info size={14} style={{ flexShrink: 0, marginTop: '2px' }} />
          <span>Financial information updates on its own schedule based on when lenders report data.</span>
        </div>
      </div>

      {/* 12. What to do next */}
      <div style={{ marginTop: '10px', textAlign: 'center' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#1a1a2e', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>What to do next</h3>
        <p style={{ fontSize: '13px', color: '#666', marginBottom: '20px', padding: '0 10px' }}>
          Keep upcoming payments on time and continue working toward your selected targets.
        </p>
        
        <button 
          onClick={() => onNavigate && onNavigate(3)} // Navigate to Plan
          style={{
            width: '100%', background: '#1C2541', color: 'white',
            borderRadius: '12px', padding: '16px 0', marginBottom: '16px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: '8px', fontSize: '15px', fontWeight: 700,
            border: 'none', cursor: 'pointer', boxShadow: '0 4px 12px rgba(28, 37, 65, 0.2)'
          }}
        >
          Continue my plan <ArrowRight size={18} strokeWidth={2.5} />
        </button>

        <p style={{ fontSize: '11px', color: '#94A3B8', lineHeight: '1.5', padding: '0 10px' }}>
          Progress reflects actions and available financial data. It does not represent a lender's internal decision or guarantee approval.
        </p>
      </div>

    </div>
  );
}
