import { useState } from 'react';
import { Info, ChevronDown, ChevronUp, ArrowRight, TrendingUp, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';

export default function WhatIfSimulator({ config, productType, onCreatePlan, onNavigateToWhy }) {
  const isRichMode = config.groups !== undefined;
  const variablesList = isRichMode ? Object.values(config.variables) : config.variables;

  const initialValues = Object.fromEntries(variablesList.map(v => [v.id, v.current]));
  const [values, setValues] = useState(initialValues);
  
  const [showInfo, setShowInfo] = useState(false);
  const [showAssumptions, setShowAssumptions] = useState(false);
  
  // Handlers
  const handleChange = (id, val) => {
    setValues(prev => ({ ...prev, [id]: Number(val) }));
  };
  
  const handleReset = () => {
    if (window.confirm("Reset simulation? Return all values to your current profile.")) {
      setValues(initialValues);
    }
  };

  const applyPreset = (presetType) => {
    const newValues = { ...values };
    if (presetType === 'lower_util') {
      if (newValues.credit_utilisation) newValues.credit_utilisation = 30;
    } else if (presetType === 'clear_late') {
      if (newValues.late_payments) newValues.late_payments = 0;
    } else if (presetType === 'reduce_debt') {
      if (newValues.outstanding_balance) newValues.outstanding_balance = Math.max(0, initialValues.outstanding_balance - 15000);
    } else if (presetType === 'balanced') {
      if (newValues.credit_utilisation) newValues.credit_utilisation = 40;
      if (newValues.late_payments) newValues.late_payments = 0;
      if (newValues.outstanding_balance) newValues.outstanding_balance = Math.max(0, initialValues.outstanding_balance - 10000);
      if (newValues.monthly_income) newValues.monthly_income = initialValues.monthly_income + 10000;
    }
    setValues(newValues);
  };

  // Calculations
  const getDiff = (id) => {
    const variable = isRichMode ? config.variables[id] : variablesList.find(v => v.id === id);
    const diff = values[id] - variable.current;
    if (diff === 0) return { changed: false, isBetter: false, diff: 0 };
    
    // Default direction for old configs: assume lower is better for everything except income
    let direction = variable.direction;
    if (!direction) {
      direction = id.includes('income') ? 'higher_is_better' : 'lower_is_better';
    }
    
    const isBetter = direction === 'higher_is_better' ? diff > 0 : diff < 0;
    return { changed: true, isBetter, diff };
  };

  const changedVariables = variablesList.filter(v => getDiff(v.id).changed);
  const improvedCount = changedVariables.filter(v => getDiff(v.id).isBetter).length;
  const worsenedCount = changedVariables.filter(v => !getDiff(v.id).isBetter).length;
  const totalSignals = variablesList.length;
  const unchangedCount = totalSignals - changedVariables.length;

  const formatValue = (val, unit) => {
    if (unit === '₹') return `₹${Number(val).toLocaleString('en-IN')}`;
    return `${val}${unit}`;
  };

  // Reusable Control
  const renderControl = (variable) => {
    const { changed, isBetter, diff } = getDiff(variable.id);
    const diffFormatted = variable.unit === '₹' ? `₹${Math.abs(diff).toLocaleString('en-IN')}` : `${Math.abs(diff)}${variable.unit}`;
    
    return (
      <div key={variable.id} style={{
        background: 'white', borderRadius: '16px', padding: '16px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.05)', marginBottom: '12px',
        border: changed ? `1px solid ${isBetter ? '#10B981' : '#F59E0B'}` : '1px solid transparent'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div>
            <span style={{ fontSize: '14px', fontWeight: 700, color: '#1a1a2e', display: 'block' }}>{variable.label}</span>
            <span style={{ fontSize: '12px', fontWeight: 500, color: '#888' }}>
              Current: {formatValue(variable.current, variable.unit)}
            </span>
          </div>
        </div>

        {variable.type === 'stepper' ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#F8F9FB', padding: '4px', borderRadius: '12px' }}>
            <button 
              onClick={() => handleChange(variable.id, Math.max(variable.min, values[variable.id] - variable.step))}
              style={{ width: '40px', height: '40px', borderRadius: '10px', border: 'none', background: 'white', fontSize: '20px', color: '#1a1a2e', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
            >-</button>
            <span style={{ fontSize: '18px', fontWeight: 700, color: '#1a1a2e' }}>{formatValue(values[variable.id], '')}</span>
            <button 
              onClick={() => handleChange(variable.id, Math.min(variable.max, values[variable.id] + variable.step))}
              style={{ width: '40px', height: '40px', borderRadius: '10px', border: 'none', background: 'white', fontSize: '20px', color: '#1a1a2e', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
            >+</button>
          </div>
        ) : (
          <div>
            {variable.type === 'slider_numeric' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <span style={{ fontSize: '16px', fontWeight: 700, color: '#1a1a2e' }}>{variable.unit === '₹' ? '₹' : ''}</span>
                <input 
                  type="number" 
                  value={values[variable.id]}
                  onChange={(e) => handleChange(variable.id, e.target.value)}
                  style={{ flex: 1, padding: '8px 12px', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '15px', fontWeight: 600, outline: 'none' }}
                />
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#666' }}>{variable.unit !== '₹' ? variable.unit : ''}</span>
              </div>
            )}
            <input
              type="range"
              min={variable.min}
              max={variable.max}
              step={variable.step}
              value={values[variable.id]}
              onChange={(e) => handleChange(variable.id, e.target.value)}
              className="kyun-slider"
              style={{ width: '100%', marginBottom: '8px' }}
            />
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: changed ? (isBetter ? '#10B981' : '#F59E0B') : '#1a1a2e' }}>
            Simulated: <span style={{ fontSize: '16px', fontWeight: 800 }}>{formatValue(values[variable.id], variable.unit)}</span>
          </span>
          {changed && (
            <span style={{ fontSize: '12px', fontWeight: 700, color: isBetter ? '#10B981' : '#F59E0B', background: isBetter ? '#D1FAE5' : '#FEF3C7', padding: '4px 8px', borderRadius: '8px' }}>
              {diff > 0 ? '↑' : '↓'} {diffFormatted} {variable.unit === '%' ? 'pts' : ''}
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '30px' }}>
      
      {/* 1. Header */}
      <div>
        <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#1a1a2e', marginBottom: '8px', lineHeight: '1.2' }}>
          What could change your outcome?
        </h2>
        <p style={{ fontSize: '14px', color: '#555', fontWeight: 500, lineHeight: '1.5', marginBottom: '12px' }}>
          Adjust the factors below to explore how your financial profile could change.
        </p>
        <button 
          onClick={() => setShowInfo(!showInfo)}
          style={{ 
            background: '#F8F5FF', border: '1px solid #E8DEFF', padding: '6px 12px', 
            borderRadius: '12px', display: 'inline-flex', alignItems: 'center', gap: '6px',
            fontSize: '11px', fontWeight: 700, color: '#6C3CE9', cursor: 'pointer'
          }}
        >
          <Info size={14} /> Simulation based on available data
        </button>
        {showInfo && (
          <div style={{ background: '#FFF8F8', border: '1px solid #FFE4E4', padding: '12px', borderRadius: '12px', marginTop: '8px' }}>
            <p style={{ fontSize: '12px', color: '#B91C1C', lineHeight: '1.5' }}>
              Kyun? uses the information available to it to simulate how changing selected financial signals could affect this explanation. This is an illustrative simulation, not a guarantee of approval or the lender's actual decision.
            </p>
          </div>
        )}
      </div>

      {/* 2. Current Profile Summary */}
      <div style={{ background: 'white', borderRadius: '16px', padding: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)', border: '1px solid #f0f0f0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '13px', fontWeight: 800, color: '#1a1a2e', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Current Profile</h3>
          <span style={{ fontSize: '10px', fontWeight: 700, background: '#f0f0f0', color: '#666', padding: '3px 8px', borderRadius: '8px' }}>BASELINE</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          {variablesList.slice(0, 4).map(v => (
            <div key={v.id}>
              <div style={{ fontSize: '11px', color: '#888', marginBottom: '2px' }}>{v.label}</div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: '#1a1a2e' }}>{formatValue(v.current, v.unit)}</div>
            </div>
          ))}
        </div>
        <p style={{ fontSize: '11px', color: '#aaa', marginTop: '16px', fontStyle: 'italic' }}>These values are your current baseline.</p>
      </div>

      {/* 3. Try a Scenario */}
      {isRichMode && (
        <div>
          <h3 style={{ fontSize: '13px', fontWeight: 800, color: '#1a1a2e', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px', padding: '0 4px' }}>Try a scenario</h3>
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px', margin: '0 -16px', paddingLeft: '16px', paddingRight: '16px', scrollbarWidth: 'none' }}>
            <button onClick={() => applyPreset('lower_util')} style={{ flexShrink: 0, background: '#F8F9FB', border: '1px solid #E2E8F0', padding: '10px 14px', borderRadius: '12px', fontSize: '13px', fontWeight: 600, color: '#1a1a2e' }}>Lower utilisation</button>
            <button onClick={() => applyPreset('clear_late')} style={{ flexShrink: 0, background: '#F8F9FB', border: '1px solid #E2E8F0', padding: '10px 14px', borderRadius: '12px', fontSize: '13px', fontWeight: 600, color: '#1a1a2e' }}>Clear late payments</button>
            <button onClick={() => applyPreset('reduce_debt')} style={{ flexShrink: 0, background: '#F8F9FB', border: '1px solid #E2E8F0', padding: '10px 14px', borderRadius: '12px', fontSize: '13px', fontWeight: 600, color: '#1a1a2e' }}>Reduce debt</button>
            <button onClick={() => applyPreset('balanced')} style={{ flexShrink: 0, background: 'linear-gradient(135deg, #F8F5FF, #fff)', border: '1px solid #E8DEFF', padding: '10px 14px', borderRadius: '12px', fontSize: '13px', fontWeight: 700, color: '#6C3CE9' }}>Balanced improvement</button>
          </div>
        </div>
      )}

      {/* 4. Simulators */}
      <div>
        <h3 style={{ fontSize: '13px', fontWeight: 800, color: '#1a1a2e', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px', padding: '0 4px' }}>Simulate a change</h3>
        
        {isRichMode ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {config.groups.map(group => (
              <div key={group.id}>
                <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#1a1a2e', marginBottom: '12px', padding: '0 4px' }}>{group.label}</h4>
                {group.variables.map(vid => {
                  const v = config.variables[vid];
                  if (!v) return null;
                  return renderControl(v);
                })}
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {variablesList.map(renderControl)}
          </div>
        )}
      </div>

      {/* Reset Button (only if changed) */}
      {changedVariables.length > 0 && (
        <button 
          onClick={handleReset}
          style={{ background: 'transparent', border: 'none', color: '#666', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '8px' }}
        >
          <RefreshCw size={14} /> Reset scenario
        </button>
      )}

      {/* 5. Simulated Profile Summary */}
      {changedVariables.length > 0 && (
        <div style={{ background: '#1C2541', borderRadius: '16px', padding: '20px', color: 'white', marginTop: '8px' }}>
          <h3 style={{ fontSize: '13px', fontWeight: 800, color: '#A0AEC0', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>Simulated Profile</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 800, color: 'white' }}>{changedVariables.length}</div>
              <div style={{ fontSize: '11px', color: '#A0AEC0', fontWeight: 600 }}>Signals affected</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#34D399' }}>{improvedCount}</div>
              <div style={{ fontSize: '11px', color: '#A0AEC0', fontWeight: 600 }}>Signals improved</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#9CA3AF' }}>{unchangedCount}</div>
              <div style={{ fontSize: '11px', color: '#A0AEC0', fontWeight: 600 }}>Signals unchanged</div>
            </div>
          </div>
          
          <div>
            <div style={{ fontSize: '11px', color: '#A0AEC0', fontWeight: 600, marginBottom: '8px' }}>Illustrative signal profile</div>
            <div style={{ display: 'flex', gap: '4px', marginBottom: '8px' }}>
              {Array.from({length: totalSignals}).map((_, i) => (
                <div key={`cur-${i}`} style={{ height: '6px', flex: 1, borderRadius: '3px', background: i < (improvedCount > 0 ? Math.max(1, improvedCount-1) : 0) ? '#4B5563' : '#374151' }} />
              ))}
            </div>
            <div style={{ display: 'flex', gap: '4px' }}>
              {Array.from({length: totalSignals}).map((_, i) => (
                <div key={`sim-${i}`} style={{ height: '6px', flex: 1, borderRadius: '3px', background: i < improvedCount ? '#34D399' : (i < improvedCount + worsenedCount ? '#F87171' : '#4B5563') }} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 6. What Changed Cards */}
      {changedVariables.length > 0 && (
        <div>
          <h3 style={{ fontSize: '13px', fontWeight: 800, color: '#1a1a2e', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px', padding: '0 4px' }}>What changed?</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {changedVariables.map(v => {
              const { isBetter } = getDiff(v.id);
              return (
                <div key={v.id} style={{ background: 'white', borderRadius: '12px', padding: '14px', borderLeft: `4px solid ${isBetter ? '#10B981' : '#F59E0B'}`, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: '#1a1a2e' }}>{v.label}</span>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: isBetter ? '#10B981' : '#F59E0B' }}>
                      {formatValue(v.current, v.unit)} → {formatValue(values[v.id], v.unit)}
                    </span>
                  </div>
                  <p style={{ fontSize: '12px', color: '#666', lineHeight: '1.4' }}>
                    {isBetter ? `A more favourable ${v.label.toLowerCase()} can improve this particular signal in the simulation.` : `A less favourable ${v.label.toLowerCase()} may worsen this particular signal.`}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 7. Biggest Opportunities (Only if no changes made yet or we want to show it always. Let's show it if no changes or small changes) */}
      {changedVariables.length === 0 && isRichMode && (
        <div>
          <h3 style={{ fontSize: '13px', fontWeight: 800, color: '#1a1a2e', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px', padding: '0 4px' }}>Where could a change matter most?</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ background: '#F0FDF4', borderRadius: '16px', padding: '16px', border: '1px solid #DCFCE7' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <div style={{ width: '20px', height: '20px', background: '#16A34A', color: 'white', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700 }}>1</div>
                <span style={{ fontSize: '14px', fontWeight: 700, color: '#166534' }}>Credit utilisation</span>
              </div>
              <p style={{ fontSize: '12px', color: '#15803D', marginBottom: '12px' }}>Current: 71%  •  Illustrative target: ≤ 40%</p>
              <div style={{ background: 'white', padding: '10px', borderRadius: '8px', fontSize: '12px', color: '#166534', fontWeight: 500 }}>Reducing utilisation can improve this particular signal. (High potential effect)</div>
            </div>

            <div style={{ background: '#F8F9FB', borderRadius: '16px', padding: '16px', border: '1px solid #E2E8F0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <div style={{ width: '20px', height: '20px', background: '#64748B', color: 'white', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700 }}>2</div>
                <span style={{ fontSize: '14px', fontWeight: 700, color: '#1a1a2e' }}>Recent payments</span>
              </div>
              <p style={{ fontSize: '12px', color: '#666', marginBottom: '12px' }}>Current: 2 late  •  Scenario: 0 late</p>
              <div style={{ background: 'white', padding: '10px', borderRadius: '8px', fontSize: '12px', color: '#555', fontWeight: 500 }}>Consistent on-time payments can improve the repayment-history signal over time. (High potential effect)</div>
            </div>
          </div>
        </div>
      )}

      {/* 8. AI Explains Scenario */}
      {changedVariables.length > 0 && (
        <div style={{
          background: 'linear-gradient(135deg, #F8F5FF, #fff)', borderRadius: '16px', padding: '20px',
          border: '1px solid #E8DEFF', boxShadow: '0 2px 8px rgba(108,60,233,0.06)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Sparkles size={18} color="#6C3CE9" />
            <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#6C3CE9', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Kyun? AI explains this scenario</h3>
          </div>
          
          <p style={{ fontSize: '14px', color: '#1a1a2e', lineHeight: '1.6', fontWeight: 500, marginBottom: '12px' }}>
            You changed {changedVariables.length} financial {changedVariables.length === 1 ? 'factor' : 'factors'}.
          </p>
          
          <ul style={{ paddingLeft: '20px', margin: '0 0 16px 0', color: '#555', fontSize: '13px', lineHeight: '1.6' }}>
            {changedVariables.slice(0, 3).map(v => (
              <li key={v.id}>{v.label}: {formatValue(v.current, v.unit)} → {formatValue(values[v.id], v.unit)}</li>
            ))}
            {changedVariables.length > 3 && <li>...and {changedVariables.length - 3} more.</li>}
          </ul>
          
          <p style={{ fontSize: '13px', color: '#555', lineHeight: '1.6', marginBottom: '16px' }}>
            Based on the available data, these changes {improvedCount > 0 ? 'reduce several of the risk signals' : 'affect the signals'} identified on your Why? page.
            <br/><br/>
            This is an illustrative simulation. It does not mean the application would definitely be approved, as a lender may use additional information and an internal decision model that Kyun? cannot access.
          </p>
          
          {onNavigateToWhy && (
            <button 
              onClick={onNavigateToWhy}
              style={{
                background: 'white', color: '#6C3CE9',
                border: '1px solid #E8DEFF', borderRadius: '10px', padding: '10px 16px',
                fontSize: '13px', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px'
              }}
            >
              See why these factors matter <ArrowRight size={14} />
            </button>
          )}
        </div>
      )}

      {/* 9. What won't change immediately */}
      <div style={{ background: '#FFF8F8', borderRadius: '16px', padding: '16px', border: '1px solid #FFE4E4' }}>
        <h3 style={{ fontSize: '13px', fontWeight: 800, color: '#B91C1C', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>What won't change immediately?</h3>
        <p style={{ fontSize: '12px', color: '#666', lineHeight: '1.5', marginBottom: '16px' }}>
          Some financial signals change gradually. Changing a slider in this simulation does not mean the real-world value will change immediately.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div style={{ background: 'white', padding: '12px', borderRadius: '8px', border: '1px solid #FEE2E2' }}>
            <div style={{ fontSize: '11px', color: '#888', marginBottom: '4px' }}>Credit history</div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#1a1a2e' }}>Grows over time</div>
          </div>
          <div style={{ background: 'white', padding: '12px', borderRadius: '8px', border: '1px solid #FEE2E2' }}>
            <div style={{ fontSize: '11px', color: '#888', marginBottom: '4px' }}>Repayment history</div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#1a1a2e' }}>Requires new data</div>
          </div>
        </div>
      </div>

      {/* 10. Confidence */}
      <div style={{ background: 'white', borderRadius: '16px', padding: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <span style={{ fontSize: '14px', fontWeight: 700, color: '#1a1a2e' }}>Simulation confidence</span>
          <span style={{ fontSize: '16px', fontWeight: 800, color: '#1a1a2e' }}>76%</span>
        </div>
        <div style={{ height: '6px', width: '100%', background: '#f0f0f0', borderRadius: '3px', overflow: 'hidden', marginBottom: '10px' }}>
          <div style={{ height: '100%', background: 'linear-gradient(90deg, #6C3CE9, #00BAF2)', borderRadius: '3px', width: '76%' }} />
        </div>
        <p style={{ fontSize: '12px', fontWeight: 500, color: '#666', lineHeight: '1.4' }}>
          Based on the completeness of available data and the factors included in this scenario.
        </p>
      </div>

      {/* 11. Assumptions */}
      <div style={{ background: 'white', borderRadius: '16px', padding: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
        <button 
          onClick={() => setShowAssumptions(!showAssumptions)}
          style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
        >
          <span style={{ fontSize: '13px', fontWeight: 800, color: '#1a1a2e', textTransform: 'uppercase', letterSpacing: '0.05em' }}>How this simulation works</span>
          {showAssumptions ? <ChevronUp size={16} color="#666" /> : <ChevronDown size={16} color="#666" />}
        </button>
        
        {showAssumptions && (
          <div style={{ marginTop: '16px', borderTop: '1px solid #f0f0f0', paddingTop: '16px' }}>
            <p style={{ fontSize: '12px', color: '#666', lineHeight: '1.5', marginBottom: '12px' }}>
              Kyun? uses available application and financial signals to estimate how changing selected inputs may affect the explanation.
            </p>
            <div style={{ fontSize: '12px', color: '#555', lineHeight: '1.6', marginBottom: '12px' }}>
              <strong>The simulation:</strong><br/>
              <span style={{ color: '#047857' }}>✓</span> Uses available data<br/>
              <span style={{ color: '#047857' }}>✓</span> Calculates derived financial signals<br/>
              <span style={{ color: '#047857' }}>✓</span> Compares current vs simulated values
            </div>
            <div style={{ fontSize: '12px', color: '#555', lineHeight: '1.6' }}>
              <strong>The simulation does NOT:</strong><br/>
              <span style={{ color: '#B91C1C' }}>✕</span> Access the lender's private decision model<br/>
              <span style={{ color: '#B91C1C' }}>✕</span> Guarantee loan approval or eligibility<br/>
            </div>
          </div>
        )}
      </div>

      {/* 12. Final CTA */}
      <div style={{ marginTop: '10px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#1a1a2e', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', textAlign: 'center' }}>Ready to improve your profile?</h3>
        {changedVariables.length > 0 && improvedCount > 0 && (
          <p style={{ fontSize: '13px', color: '#666', textAlign: 'center', marginBottom: '16px' }}>
            Your simulation suggests that some changes may improve specific financial signals over time.
          </p>
        )}
        <button 
          onClick={onCreatePlan} 
          style={{
            width: '100%', background: '#1C2541', color: 'white',
            borderRadius: '12px', padding: '16px 0',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: '8px', fontSize: '15px', fontWeight: 700,
            border: 'none', cursor: 'pointer', boxShadow: '0 4px 12px rgba(28, 37, 65, 0.2)'
          }}
        >
          Build my improvement plan <ArrowRight size={18} strokeWidth={2.5} />
        </button>
      </div>

    </div>
  );
}
