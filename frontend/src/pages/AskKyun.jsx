import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PaytmHeader from '../components/PaytmHeader';
import { ASK_KYUN_SUGGESTIONS, LOAN_FACTORS, INSURANCE_FACTORS } from '../data/mockData';
import { Sparkles, Send, Dot } from 'lucide-react';

const FALLBACK_RESPONSES = {
  'Why is credit utilisation important?': 'Credit utilisation measures how much of your available credit you are currently using. A high utilisation (above 50-60%) can indicate higher credit risk to lenders.\n\nBased on your current profile, your utilisation is around 71%, which was identified as a **high-impact factor**. Reducing your outstanding balance could help improve this metric over time.',
  'What should I change first?': 'Based on the factors identified, **reducing your credit utilisation** would likely have the biggest positive impact.\n\nYour current utilisation is 71%. Paying down ₹7,000–₹10,000 of your outstanding balance (currently ₹31,950) could bring it closer to the recommended range.\n\n⚠️ This is a likely factor — not a guaranteed outcome.',
  'Can I apply again?': 'After making improvements to the factors identified — such as reducing credit utilisation and maintaining timely payments — you may consider checking your updated profile.\n\nThe **Kyun? progress tracker** can help you monitor changes over time. This is guidance only and does not guarantee a different decision.',
  'What happens if I reduce my balance?': 'Reducing your outstanding balance from ₹31,950 toward ₹18,000 could lower your credit utilisation from ~71% to ~40%.\n\nThe **What-If simulator** shows this as an improved factor scenario. Remember, this is an illustrative analysis and not a guarantee.',
  'Explain this in Gujarati': 'તમારી ₹2,50,000 ની વ્યક્તિગત લોન અરજી મંજૂર થઈ નથી.\n\nઓળખાયેલા સંભવિત પરિબળોમાં 71% ઊંચો ક્રેડિટ ઉપયોગ, છેલ્લા 6 મહિનામાં 2 મોડા ચુકવણીઓ, અને 14 મહિનાનો પ્રમાકોણ ટૂંકો ક્રેડિટ ઈતિહાસ સામેલ છે.\n\n🗣️ Translation powered by Sarvam AI',
};

const DEFAULT_RESPONSE = "Based on the available information, I can help explain the factors identified by Kyun?. The analysis shows the key areas that may have contributed to the decision.\n\nWould you like me to:\n• Explain any specific factor in more detail?\n• Help you explore what changes could potentially improve your profile?\n• Translate the explanation into another language?";

const INSURANCE_SUGGESTIONS = [
  'Why was my claim partially approved?',
  'What is depreciation?',
  'How can I improve my coverage?',
  'What documents are pending?',
];

const MF_SUGGESTIONS = [
  'Why is my portfolio high-risk?',
  'What is fund overlap?',
  'How should I rebalance?',
  'Is my SIP allocation right?',
];

const INSURANCE_RESPONSES = {
  'Why was my claim partially approved?': 'Your claim of ₹84,500 was partially approved at ₹61,250 due to several policy factors:\n\n1. **Coverage limit**: Your policy covers up to ₹75,000\n2. **Depreciation**: ₹8,250 was deducted based on vehicle age (3 years)\n3. **Deductible**: A ₹5,000 deductible was applied\n\nThese are standard policy terms, not a dispute of your claim.',
  'What is depreciation?': 'Depreciation is the reduction in the value of your vehicle parts over time due to wear and tear.\n\nFor your 3-year-old vehicle, a **standard depreciation of ₹8,250** was applied to the claim amount. This is a common insurance practice based on the vehicle\'s age.',
  'How can I improve my coverage?': 'To improve your coverage for future claims, you could consider:\n\n1. **Increase coverage limit** — your current limit is ₹75,000\n2. **Add zero-depreciation cover** — eliminates depreciation deductions\n3. **Review your deductible** — currently ₹5,000\n\nReview these options before your next policy renewal.',
  'What documents are pending?': 'You have **1 document pending** submission:\n\n📄 **Repair estimate** — This document can help support your claim for the full repair cost.\n\n4 of 5 required documents have been submitted and verified.',
};

const MF_RESPONSES = {
  'Why is my portfolio high-risk?': 'Your portfolio is classified as **High Risk** because:\n\n1. **82% equity allocation** — significantly higher than typical for a Moderate risk profile\n2. **45% sector overlap** in technology between your funds\n3. **Only 12% in debt** — providing limited downside protection\n\nYour selected risk profile is Moderate, but your actual portfolio risk is High.',
  'What is fund overlap?': 'Fund overlap means your mutual funds are investing in the same sectors or stocks, reducing diversification.\n\nYour two equity funds have a **45% technology sector overlap** — Fund A has 24% and Fund B has 21% tech exposure.\n\nThis concentration means you\'re not getting the diversification benefit of holding multiple funds.',
  'How should I rebalance?': 'Based on your Moderate risk profile, consider:\n\n1. **Reduce equity** from 82% to 60-65%\n2. **Increase debt** from 12% to 25-30%\n3. **Diversify sectors** to reduce the 45% tech overlap\n\nThe What-If simulator can help you visualize different allocation scenarios.',
  'Is my SIP allocation right?': 'Your current SIP of ₹8,000/month has **72% directed to equity** funds.\n\nFor a Moderate risk profile, consider:\n• Equity SIP: 55-60% (₹4,400-₹4,800)\n• Debt SIP: 30-35% (₹2,400-₹2,800)\n• Other: 10% (₹800)\n\nThis would gradually rebalance your portfolio over time.',
};

export default function AskKyun() {
  const { product } = useParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const productLabel = product === 'insurance' ? 'Insurance Claim' : product === 'mutual-funds' ? 'Mutual Funds' : 'Personal Loan';
  const factors = product === 'insurance' ? INSURANCE_FACTORS : product === 'mutual-funds' ? MF_FACTORS : LOAN_FACTORS;
  const suggestions = product === 'insurance' ? INSURANCE_SUGGESTIONS : product === 'mutual-funds' ? MF_SUGGESTIONS : ASK_KYUN_SUGGESTIONS;
  const productResponses = product === 'insurance' ? INSURANCE_RESPONSES : product === 'mutual-funds' ? MF_RESPONSES : FALLBACK_RESPONSES;

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (text) => {
    const question = text || input.trim();
    if (!question) return;

    setMessages(prev => [...prev, { role: 'user', text: question }]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ask-kyun', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          product: product || 'loan',
          context: { factors: factors.map(f => ({ label: f.label, impact: f.impact, value: f.value })) },
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(prev => [...prev, { role: 'ai', text: data.answer, source: data.source }]);
        setLoading(false);
        return;
      }
    } catch {
      // Backend not available, use fallback
    }

    await new Promise(r => setTimeout(r, 800 + Math.random() * 600));
    const response = productResponses[question] || DEFAULT_RESPONSE;
    setMessages(prev => [...prev, { role: 'ai', text: response, source: 'fallback' }]);
    setLoading(false);
  };

  return (
    <div className="page-content flex flex-col pb-0 bg-bg">
      <PaytmHeader showBack title="Ask Kyun?" />

      <div className="flex-1 overflow-y-auto p-4 pb-24">
        {/* Welcome */}
        {messages.length === 0 && (
          <div className="animate-fade">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-[20px] bg-kyun-gradient-bg flex items-center justify-center text-white mx-auto mb-3 shadow-md shadow-kyun-purple/30">
                <Sparkles size={32} />
              </div>
              <h2 className="text-[22px] font-bold text-text-primary mb-1">
                Hi! I'm Kyun.
              </h2>
              <p className="text-[13px] text-text-secondary leading-snug max-w-[280px] mx-auto">
                I can explain the factors we found and help you explore what you can change.
              </p>
              
              <div className="inline-flex items-center gap-1.5 bg-kyun-purple/10 text-kyun-purple px-3 py-1.5 rounded-full mt-3 text-[11px] font-bold tracking-wide border border-kyun-purple/20">
                <Dot size={16} strokeWidth={4} className="animate-pulse text-kyun-purple" />
                {productLabel} context loaded
              </div>
            </div>

            <p className="text-[11px] font-bold text-text-muted uppercase tracking-wider mb-2 ml-1">
              Try asking
            </p>
            <div className="flex flex-col gap-2">
              {suggestions.map((q) => (
                <button
                  key={q}
                  onClick={() => handleSend(q)}
                  className="w-full text-left text-[14px] font-semibold text-paytm-navy bg-white border border-border rounded-2xl p-4 cursor-pointer hover:bg-gray-50 active:scale-[0.98] transition-all shadow-sm"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Context info */}
            <div className="card mt-4 border-border bg-white shadow-sm">
              <p className="text-[11px] font-bold text-text-muted tracking-wider uppercase mb-2">
                Context loaded
              </p>
              <div className="flex flex-col gap-1.5">
                {factors.slice(0, 3).map((f) => (
                  <p key={f.id} className="text-[12px] font-medium text-text-secondary flex items-start gap-1.5">
                    <span className="text-kyun-purple mt-0.5">•</span> 
                    <span>{f.label} <span className="opacity-70">({f.impact} impact)</span></span>
                  </p>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Chat messages */}
        <div className="flex flex-col gap-4">
          {messages.map((msg, i) => (
            <div key={i} className={`animate-in flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'ai' && (
                <div className="w-8 h-8 rounded-xl bg-kyun-gradient-bg flex items-center justify-center text-white mr-2 mt-1 shrink-0 shadow-sm shadow-kyun-purple/20">
                  <Sparkles size={16} />
                </div>
              )}
              <div className={msg.role === 'user' ? 'chat-bubble-user shadow-md' : 'chat-bubble-ai border border-border shadow-sm'}>
                <p className="text-[14px] leading-relaxed whitespace-pre-wrap font-medium">{msg.text}</p>
                {msg.source && msg.role === 'ai' && (
                  <p className="text-[10px] font-medium text-text-muted mt-2 pt-2 border-t border-black/5 flex items-center gap-1">
                    {msg.source === 'groq' ? '⚡ Powered by Groq + Llama' : '📋 Based on structured context'}
                  </p>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="animate-fade flex items-start">
              <div className="w-8 h-8 rounded-xl bg-kyun-gradient-bg flex items-center justify-center text-white mr-2 mt-1 shrink-0 shadow-sm">
                <Sparkles size={16} />
              </div>
              <div className="chat-bubble-ai border border-border">
                <div className="flex gap-1.5 px-1 py-1">
                  <div className="w-2 h-2 bg-text-muted rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-text-muted rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
                  <div className="w-2 h-2 bg-text-muted rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="sticky bottom-0 left-0 right-0 w-full bg-white/90 backdrop-blur-md border-t border-gray-100 p-3 z-40">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask Kyun? anything..."
            className="flex-1 bg-gray-50 border border-gray-200 rounded-[16px] px-4 py-2.5 text-[13px] outline-none focus:border-[#6C3CE9] focus:ring-2 focus:ring-[#6C3CE9]/20 transition-all font-medium"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || loading}
            className={`w-[44px] h-[44px] rounded-[16px] flex items-center justify-center text-white transition-all shrink-0 ${(!input.trim() || loading) ? 'bg-gray-200 text-gray-400' : 'bg-gradient-to-r from-[#6C3CE9] to-[#00BAF2] shadow-md shadow-[#6C3CE9]/30 active:scale-95'}`}
          >
            <Send size={18} className={input.trim() && !loading ? 'ml-0.5' : ''} />
          </button>
        </div>
        <p className="text-[10px] font-medium text-gray-400 text-center mt-1.5 px-2 leading-tight">
          Kyun? explains available information; it does not make or change the financial decision.
        </p>
      </div>
    </div>
  );
}

