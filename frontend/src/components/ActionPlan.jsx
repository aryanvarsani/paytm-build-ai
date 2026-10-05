import { useState } from 'react';
import { Target, Info, ChevronDown, ChevronUp, ArrowRight, CheckCircle2, Circle, AlertCircle, Sparkles, Volume2 } from 'lucide-react';

export default function ActionPlan({ plan, onNavigate }) {
  // Checkbox State
  const allTaskIds = plan.timeline?.flatMap(w => w.tasks.map(t => t.id)) || [];
  const initialDone = plan.timeline?.flatMap(w => w.tasks.filter(t => t.done).map(t => t.id)) || [];
  
  const [completedTasks, setCompletedTasks] = useState(new Set(initialDone));
  const [showPriorityReason, setShowPriorityReason] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(3000);

  // Fallback for non-loan plans (like insurance) that haven't been updated yet
  if (!plan.timeline) {
    return (
      <div style={{ padding: '20px', background: 'white', borderRadius: '16px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Legacy Plan</h3>
        <p style={{ fontSize: '13px', color: '#666' }}>This plan format is no longer supported.</p>
      </div>
    );
  }

  const toggleTask = (taskId) => {
    setCompletedTasks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(taskId)) newSet.delete(taskId);
      else newSet.add(taskId);
      return newSet;
    });
  };

  const progressPercent = Math.round((completedTasks.size / allTaskIds.length) * 100) || 0;

  // Payment Calculation
  const currentBal = 31950;
  const targetBal = 20000;
  const diffToPay = currentBal - targetBal;
  const estimatedMonths = paymentAmount > 0 ? Math.ceil(diffToPay / paymentAmount) : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '30px' }}>
      
      {/* 1. Header */}
      <div>
        <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#1a1a2e', marginBottom: '8px', lineHeight: '1.2', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
          Your improvement plan
        </h2>
        <p style={{ fontSize: '14px', color: '#555', fontWeight: 500, lineHeight: '1.5', marginBottom: '12px' }}>
          Based on the financial signals highlighted in your explanation, here are practical steps you can take over the next {plan.duration} days.
        </p>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          background: '#F8F5FF', border: '1px solid #E8DEFF',
          padding: '6px 12px', borderRadius: '12px',
          fontSize: '11px', fontWeight: 700, color: '#6C3CE9'
        }}>
          <Sparkles size={14} /> Personalized from your Kyun? analysis
        </div>
      </div>

      {/* 2. Progress Summary at the top */}
      <div style={{ background: '#1C2541', borderRadius: '16px', padding: '20px', color: 'white', boxShadow: '0 4px 12px rgba(28,37,65,0.15)' }}>
        <h3 style={{ fontSize: '13px', fontWeight: 800, color: '#A0AEC0', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>Your Plan Progress</h3>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '12px' }}>
          <div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: 'white', lineHeight: 1 }}>
              {completedTasks.size} <span style={{ fontSize: '16px', color: '#A0AEC0', fontWeight: 600 }}>/ {allTaskIds.length}</span>
            </div>
            <div style={{ fontSize: '12px', color: '#A0AEC0', fontWeight: 600, marginTop: '4px' }}>Actions completed</div>
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#00BAF2' }}>
            {progressPercent}%
          </div>
        </div>
        
        <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{ height: '100%', background: 'linear-gradient(90deg, #6C3CE9, #00BAF2)', width: `${progressPercent}%`, transition: 'width 0.5s ease-out' }} />
        </div>
      </div>

      {/* 3. Current Profile */}
      <div style={{ background: 'white', borderRadius: '16px', padding: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)', border: '1px solid #f0f0f0' }}>
        <h3 style={{ fontSize: '12px', fontWeight: 800, color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>Your Current Profile</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <div style={{ fontSize: '11px', color: '#888', marginBottom: '2px' }}>Credit utilisation</div>
            <div style={{ fontSize: '16px', fontWeight: 800, color: '#1a1a2e' }}>{plan.profileSnapshot.credit_utilisation}</div>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: '#888', marginBottom: '2px' }}>Recent late payments</div>
            <div style={{ fontSize: '16px', fontWeight: 800, color: '#1a1a2e' }}>{plan.profileSnapshot.late_payments}</div>
          </div>
          <div style={{ gridColumn: 'span 2' }}>
            <div style={{ fontSize: '11px', color: '#888', marginBottom: '2px' }}>Outstanding balance</div>
            <div style={{ fontSize: '16px', fontWeight: 800, color: '#1a1a2e' }}>{plan.profileSnapshot.outstanding_balance}</div>
          </div>
        </div>
      </div>

      {/* 4. Top Priority */}
      <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
        <div style={{ background: '#F8FAFC', padding: '12px 16px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '12px', fontWeight: 800, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Your Top Priority</h3>
          <span style={{ fontSize: '10px', fontWeight: 800, color: '#B45309', background: '#FEF3C7', padding: '4px 8px', borderRadius: '8px' }}>{plan.topPriority.priority} PRIORITY</span>
        </div>
        
        <div style={{ padding: '16px' }}>
          <h4 style={{ fontSize: '18px', fontWeight: 800, color: '#1a1a2e', marginBottom: '16px' }}>{plan.topPriority.title}</h4>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ flex: 1, background: '#F1F5F9', padding: '12px', borderRadius: '12px' }}>
              <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600, marginBottom: '2px' }}>Current</div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#1a1a2e' }}>{plan.topPriority.currentValue}{plan.topPriority.unit}</div>
            </div>
            <ArrowRight size={16} color="#94A3B8" />
            <div style={{ flex: 1, background: '#F0FDF4', padding: '12px', borderRadius: '12px', border: '1px solid #DCFCE7' }}>
              <div style={{ fontSize: '11px', color: '#166534', fontWeight: 600, marginBottom: '2px' }}>Illustrative target</div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#15803D' }}>≤ {plan.topPriority.targetValue}{plan.topPriority.unit}</div>
            </div>
          </div>
          
          <div style={{ background: '#F8F9FB', borderRadius: '12px', padding: '12px', marginBottom: '16px' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#1a1a2e', marginBottom: '4px' }}>Action:</div>
            <p style={{ fontSize: '13px', color: '#555', lineHeight: '1.5' }}>{plan.topPriority.action}</p>
          </div>

          <button 
            onClick={() => setShowPriorityReason(!showPriorityReason)}
            style={{ 
              width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
              background: 'white', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '12px',
              fontSize: '13px', fontWeight: 700, color: '#1a1a2e', cursor: 'pointer'
            }}
          >
            Why this action?
            {showPriorityReason ? <ChevronUp size={16} color="#666" /> : <ChevronDown size={16} color="#666" />}
          </button>
          
          {showPriorityReason && (
            <div style={{ marginTop: '8px', padding: '12px', background: '#FFF8F8', borderRadius: '12px', border: '1px solid #FFE4E4' }}>
              <p style={{ fontSize: '13px', color: '#B91C1C', lineHeight: '1.5', marginBottom: '12px' }}>
                Your {plan.topPriority.factorId.replace('_', ' ')} is currently around {plan.topPriority.currentValue}{plan.topPriority.unit}.<br/><br/>
                Kyun? identified this as a high-impact signal in the available decision data. Reducing this may make this particular signal more favourable.<br/><br/>
                <strong>However, this does not guarantee a different lender decision.</strong>
              </p>
              {onNavigate && (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => onNavigate(1)} style={{ flex: 1, background: 'white', border: '1px solid #FEE2E2', padding: '8px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, color: '#B91C1C', cursor: 'pointer' }}>
                    See why →
                  </button>
                  <button onClick={() => onNavigate(2)} style={{ flex: 1, background: 'white', border: '1px solid #FEE2E2', padding: '8px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, color: '#B91C1C', cursor: 'pointer' }}>
                    What-if →
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 5. If you can only do 3 things */}
      <div>
        <h3 style={{ fontSize: '13px', fontWeight: 800, color: '#1a1a2e', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px', padding: '0 4px' }}>If you can only do 3 things</h3>
        <div style={{ background: 'white', borderRadius: '16px', padding: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {plan.topThree.map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{ width: '24px', height: '24px', background: '#F8F5FF', color: '#6C3CE9', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 800, flexShrink: 0 }}>
                  {i + 1}
                </div>
                <p style={{ fontSize: '14px', fontWeight: 600, color: '#1a1a2e', lineHeight: '1.4', marginTop: '2px' }}>{item}</p>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #f0f0f0', fontSize: '12px', color: '#666', fontStyle: 'italic' }}>
            These are the highest-priority actions. They do not guarantee approval.
          </div>
        </div>
      </div>

      {/* 6. Timeline Checklist */}
      <div>
        <h3 style={{ fontSize: '13px', fontWeight: 800, color: '#1a1a2e', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px', padding: '0 4px' }}>Your {plan.duration}-Day Plan</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative' }}>
          <div style={{ position: 'absolute', left: '15px', top: '24px', bottom: '24px', width: '2px', background: '#E2E8F0', zIndex: 0 }} />
          
          {plan.timeline.map((week, idx) => (
            <div key={idx} style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '16px', background: 'white', border: '3px solid #6C3CE9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 2px 4px rgba(108,60,233,0.2)' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '4px', background: '#6C3CE9' }} />
                </div>
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 800, color: '#6C3CE9', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{week.week}</div>
                  <div style={{ fontSize: '15px', fontWeight: 800, color: '#1a1a2e' }}>{week.label}</div>
                </div>
              </div>
              
              <div style={{ paddingLeft: '44px' }}>
                <div style={{ background: 'white', borderRadius: '12px', padding: '4px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #F1F5F9' }}>
                  {week.tasks.map((task, tIdx) => {
                    const isDone = completedTasks.has(task.id);
                    return (
                      <div 
                        key={task.id} 
                        onClick={() => toggleTask(task.id)}
                        style={{ 
                          display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '12px', 
                          cursor: 'pointer',
                          borderBottom: tIdx < week.tasks.length - 1 ? '1px solid #F1F5F9' : 'none'
                        }}
                      >
                        <div style={{ marginTop: '2px' }}>
                          {isDone ? <CheckCircle2 size={20} color="#10B981" /> : <Circle size={20} color="#CBD5E1" />}
                        </div>
                        <span style={{ fontSize: '14px', fontWeight: 500, color: isDone ? '#94A3B8' : '#1a1a2e', textDecoration: isDone ? 'line-through' : 'none', lineHeight: '1.4' }}>
                          {task.text}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
          
          <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '16px', background: '#1C2541', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Target size={16} color="white" />
            </div>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 800, color: '#1C2541', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Day 60</div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: '#1a1a2e' }}>Check again</div>
            </div>
          </div>
        </div>
      </div>

      {/* 7. What you can control */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
        <div style={{ background: 'white', borderRadius: '16px', padding: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
          <h3 style={{ fontSize: '12px', fontWeight: 800, color: '#10B981', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>What you can control</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {plan.controlledFactors.map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={16} color="#10B981" />
                <span style={{ fontSize: '13px', fontWeight: 500, color: '#1a1a2e' }}>{f}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div style={{ background: '#F8F9FB', borderRadius: '16px', padding: '16px', border: '1px solid #E2E8F0' }}>
          <h3 style={{ fontSize: '12px', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>What changes slowly</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
            {plan.slowFactors.map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Circle size={16} color="#94A3B8" />
                <span style={{ fontSize: '13px', fontWeight: 500, color: '#64748B' }}>{f}</span>
              </div>
            ))}
          </div>
          <p style={{ fontSize: '11px', color: '#666', lineHeight: '1.4' }}>
            Some financial signals change gradually. Your past history cannot be changed immediately, but future behaviour can affect how your profile develops.
          </p>
        </div>
      </div>

      {/* 8. Payment Calculator */}
      <div style={{ background: 'white', borderRadius: '16px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid #E2E8F0' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#1a1a2e', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px', textAlign: 'center' }}>How much can you comfortably pay?</h3>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', padding: '0 10px' }}>
          <div>
            <div style={{ fontSize: '11px', color: '#666', fontWeight: 600 }}>Outstanding</div>
            <div style={{ fontSize: '16px', fontWeight: 800, color: '#1a1a2e' }}>₹{currentBal.toLocaleString()}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '11px', color: '#10B981', fontWeight: 600 }}>Target</div>
            <div style={{ fontSize: '16px', fontWeight: 800, color: '#10B981' }}>₹{targetBal.toLocaleString()}</div>
          </div>
        </div>

        <p style={{ fontSize: '12px', fontWeight: 700, color: '#1a1a2e', marginBottom: '10px' }}>Choose your monthly amount:</p>
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px', scrollbarWidth: 'none', margin: '0 -20px', paddingLeft: '20px', paddingRight: '20px' }}>
          {[2000, 3000, 5000].map(amt => (
            <button 
              key={amt}
              onClick={() => setPaymentAmount(amt)}
              style={{
                flexShrink: 0, padding: '10px 16px', borderRadius: '12px', fontSize: '14px', fontWeight: 700,
                background: paymentAmount === amt ? '#1a1a2e' : '#F1F5F9',
                color: paymentAmount === amt ? 'white' : '#1a1a2e',
                border: 'none', cursor: 'pointer'
              }}
            >
              ₹{amt / 1000}K
            </button>
          ))}
          <button 
            onClick={() => {
              const val = parseInt(window.prompt("Enter custom monthly amount (₹):", "4000"), 10);
              if (!isNaN(val) && val > 0) setPaymentAmount(val);
            }}
            style={{
              flexShrink: 0, padding: '10px 16px', borderRadius: '12px', fontSize: '14px', fontWeight: 700,
              background: (![2000, 3000, 5000].includes(paymentAmount)) ? '#1a1a2e' : 'white',
              color: (![2000, 3000, 5000].includes(paymentAmount)) ? 'white' : '#1a1a2e',
              border: '1px solid #E2E8F0', cursor: 'pointer'
            }}
          >
            Custom
          </button>
        </div>

        <div style={{ background: '#F8F5FF', borderRadius: '12px', padding: '16px', marginTop: '16px', border: '1px solid #E8DEFF' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#1a1a2e' }}>Estimated timeline</span>
            <span style={{ fontSize: '18px', fontWeight: 800, color: '#6C3CE9' }}>≈ {estimatedMonths} months</span>
          </div>
          <p style={{ fontSize: '11px', color: '#666', lineHeight: '1.4' }}>
            This is a simple illustrative calculation to reach the target of ₹{targetBal.toLocaleString()}. Actual repayment time may vary based on interest, fees, and new charges.
          </p>
        </div>
      </div>

      {/* 9. AI Summary */}
      <div style={{
        background: 'linear-gradient(135deg, #F8F5FF, #fff)', borderRadius: '16px', padding: '20px',
        border: '1px solid #E8DEFF', boxShadow: '0 2px 8px rgba(108,60,233,0.06)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={18} color="#6C3CE9" />
            <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#6C3CE9', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Kyun? AI Plan Summary</h3>
          </div>
        </div>
        
        <p style={{ fontSize: '13px', color: '#1a1a2e', lineHeight: '1.6', fontWeight: 500, marginBottom: '12px' }}>
          Your plan focuses on three areas highlighted in your explanation: credit utilisation, repayment consistency, and outstanding debt.
        </p>
        
        <p style={{ fontSize: '13px', color: '#555', lineHeight: '1.6', marginBottom: '12px' }}>
          First, work toward reducing your current credit utilisation from approximately 71% to a more manageable level, where financially practical. Second, make all upcoming payments on time and avoid new late payments. Third, gradually reduce outstanding balances without taking on additional unnecessary debt.
        </p>
        
        <p style={{ fontSize: '13px', color: '#555', lineHeight: '1.6', marginBottom: '20px' }}>
          These actions may improve specific financial signals over time. They do not guarantee approval because the lender may consider additional information that is not available to Kyun?.
        </p>
        
        <button 
          onClick={() => alert("Simulating Sarvam AI Voice TTS:\n\n'Your plan focuses on three areas highlighted in your explanation...'")}
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

      {/* 10. Before you apply again */}
      <div>
        <h3 style={{ fontSize: '13px', fontWeight: 800, color: '#1a1a2e', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px', padding: '0 4px' }}>Before you apply again</h3>
        <div style={{ background: 'white', borderRadius: '16px', padding: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {plan.preApplication.map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <div style={{ width: '16px', height: '16px', borderRadius: '4px', border: '2px solid #CBD5E1', flexShrink: 0, marginTop: '2px' }} />
                <span style={{ fontSize: '13px', fontWeight: 500, color: '#334155', lineHeight: '1.4' }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 11. Disclaimer */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', padding: '10px', background: '#F8F9FB', borderRadius: '12px', color: '#64748B' }}>
        <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
        <span style={{ fontSize: '11px', lineHeight: '1.5' }}>
          This plan is based on available information and is intended to help you improve specific financial signals. It does not guarantee approval or predict a lender's final decision.
        </span>
      </div>

      {/* 12. Final CTA */}
      <div style={{ marginTop: '10px', textAlign: 'center' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#1a1a2e', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Ready to reassess?</h3>
        <p style={{ fontSize: '13px', color: '#666', marginBottom: '20px' }}>
          Once enough new financial information has been reported, review your profile again.
        </p>
        
        <button 
          onClick={() => onNavigate && onNavigate(4)} // Navigate to Progress
          style={{
            width: '100%', background: '#1C2541', color: 'white',
            borderRadius: '12px', padding: '16px 0', marginBottom: '12px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: '8px', fontSize: '15px', fontWeight: 700,
            border: 'none', cursor: 'pointer', boxShadow: '0 4px 12px rgba(28, 37, 65, 0.2)'
          }}
        >
          Recheck my profile <ArrowRight size={18} strokeWidth={2.5} />
        </button>
        
        <button 
          style={{
            width: '100%', background: 'transparent', color: '#1C2541',
            borderRadius: '12px', padding: '14px 0',
            fontSize: '14px', fontWeight: 700,
            border: '1px solid #CBD5E1', cursor: 'pointer'
          }}
        >
          Continue plan
        </button>
      </div>

    </div>
  );
}
