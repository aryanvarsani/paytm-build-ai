import { useState, useEffect, useRef } from 'react';
import { X, Send, Bot, User, Sparkles, Loader2, Volume2, VolumeX } from 'lucide-react';

const SYSTEM_PROMPT = `You are Kyun AI, Paytm's helpful financial explainability assistant. 
The user applied for a Personal Loan of ₹5,00,000 but it was NOT APPROVED.
The primary reasons are:
1. Low credit score (680). Minimum required is 720.
2. High credit card utilization (68%).
3. Recent delayed payments.

Your job is to answer the user's questions about this specific loan decision.
Rules:
- Be empathetic, simple, and polite.
- ONLY answer questions related to this loan, credit scores, or how to improve their financial health. If they ask about other things, politely redirect them.
- Keep answers VERY concise (1-2 short sentences maximum).
- Respond in the language the user speaks to you in.`;

export default function KyunAIChatbot({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi there! I am Kyun AI. I can explain your loan decision in detail. What would you like to know?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const messagesEndRef = useRef(null);
  
  const currentAudio = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  useEffect(() => {
    return () => {
      if (currentAudio.current) {
        currentAudio.current.pause();
      }
    };
  }, []);

  const playSarvamAudio = async (text) => {
    if (!isVoiceEnabled) return;
    
    if (currentAudio.current) {
      currentAudio.current.pause();
    }

    try {
      // Very basic language detection heuristics for the voice
      // In production, Groq could return the language code.
      let targetLang = "en-IN";
      let speaker = "ritu";
      
      const textLower = text.toLowerCase();
      if (/[\u0900-\u097F]/.test(text)) { targetLang = "hi-IN"; speaker = "ritu"; } // Hindi
      else if (/[\u0B80-\u0BFF]/.test(text)) { targetLang = "ta-IN"; speaker = "gokul"; } // Tamil
      else if (/[\u0C00-\u0C7F]/.test(text)) { targetLang = "te-IN"; speaker = "kavitha"; } // Telugu

      const response = await fetch('https://api.sarvam.ai/text-to-speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-subscription-key': import.meta.env.VITE_SARVAM_API_KEY || 'sk_yeid9san_i5fTkNSh5ZKJj1DyFHMOrAGR'
        },
        body: JSON.stringify({
          inputs: [text],
          target_language_code: targetLang,
          speaker: speaker,
          pitch: 0,
          pace: 1.0,
          loudness: 1.5,
          speech_sample_rate: 8000,
          enable_preprocessing: true,
          model: "bulbul:v3"
        })
      });

      const data = await response.json();
      if (data.audios && data.audios.length > 0) {
        const audioSrc = `data:audio/wav;base64,${data.audios[0]}`;
        const audioObj = new Audio(audioSrc);
        currentAudio.current = audioObj;
        audioObj.play();
      }
    } catch (error) {
      console.error('TTS Error:', error);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const groqKey = import.meta.env.VITE_GROQ_API_KEY || 'your_groq_api_key_here'; // Replace with the actual key from env if available
      
      const apiMessages = [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages.map(m => ({ role: m.role, content: m.content })),
        { role: 'user', content: userMsg }
      ];

      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${groqKey}`
        },
        body: JSON.stringify({
          model: 'llama3-8b-8192',
          messages: apiMessages,
          temperature: 0.5,
          max_tokens: 150
        })
      });

      if (!res.ok) throw new Error('Failed to fetch from Groq');
      
      const data = await res.json();
      const botReply = data.choices[0].message.content;
      
      setMessages(prev => [...prev, { role: 'assistant', content: botReply }]);
      playSarvamAudio(botReply);

    } catch (error) {
      console.warn('Groq API Error, using mock response:', error);
      
      // MOCK FALLBACK FOR DEMO
      const lowerInput = userMsg.toLowerCase();
      let mockReply = "I'm sorry, I'm having trouble connecting right now.";
      
      if (lowerInput.includes('hi') || lowerInput.includes('hello')) {
        mockReply = "Hello! I am Kyun AI. Your loan of ₹5,00,000 was not approved. Would you like to know why?";
      } else if (lowerInput.includes('why') || lowerInput.includes('reason')) {
        mockReply = "Your loan was rejected primarily due to a low credit score (680) and high credit card utilization (68%).";
      } else if (lowerInput.includes('improve') || lowerInput.includes('plan')) {
        mockReply = "To improve your chances, pay down your credit card balances and ensure all future EMIs are paid on time for the next 3 months.";
      } else {
        mockReply = "I am a demo loan assistant. Your loan was rejected due to a low credit score. Paying off debts can help improve it!";
      }

      setMessages(prev => [...prev, { role: 'assistant', content: mockReply }]);
      playSarvamAudio(mockReply);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.5)', zIndex: 100,
      display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
      animation: 'fadeIn 0.2s ease-out'
    }}>
      <div style={{
        background: '#F8F9FB', height: '85vh',
        borderTopLeftRadius: '24px', borderTopRightRadius: '24px',
        display: 'flex', flexDirection: 'column',
        boxShadow: '0 -4px 20px rgba(0,0,0,0.15)'
      }}>
        {/* Header */}
        <div style={{
          padding: '16px 20px', background: 'white',
          borderTopLeftRadius: '24px', borderTopRightRadius: '24px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          borderBottom: '1px solid #eee'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              background: 'linear-gradient(135deg, #002E6E, #00BAF2)',
              borderRadius: '12px', width: '36px', height: '36px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', boxShadow: '0 2px 8px rgba(0,46,110,0.2)'
            }}>
              <Sparkles size={18} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#1a1a2e' }}>Kyun AI</h3>
              <p style={{ margin: 0, fontSize: '12px', color: '#00BAF2', fontWeight: 600 }}>Loan Assistant</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}
              style={{
                background: isVoiceEnabled ? '#E8F5E9' : '#FFEBEE',
                color: isVoiceEnabled ? '#2E7D32' : '#C62828',
                border: 'none', borderRadius: '50%', width: '36px', height: '36px',
                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
              }}
            >
              {isVoiceEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
            </button>
            <button 
              onClick={onClose}
              style={{
                background: '#f5f5f5', color: '#666',
                border: 'none', borderRadius: '50%', width: '36px', height: '36px',
                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Chat Area */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {messages.map((m, i) => (
            <div key={i} style={{
              display: 'flex', gap: '8px',
              alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '85%'
            }}>
              {m.role === 'assistant' && (
                <div style={{
                  width: '28px', height: '28px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #002E6E, #00BAF2)', color: 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '4px'
                }}>
                  <Sparkles size={14} />
                </div>
              )}
              <div style={{
                background: m.role === 'user' ? '#002E6E' : 'white',
                color: m.role === 'user' ? 'white' : '#333',
                padding: '12px 16px', borderRadius: '16px',
                borderBottomRightRadius: m.role === 'user' ? '4px' : '16px',
                borderBottomLeftRadius: m.role === 'assistant' ? '4px' : '16px',
                fontSize: '14px', lineHeight: '1.5',
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                border: m.role === 'assistant' ? '1px solid #eee' : 'none'
              }}>
                {m.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div style={{ display: 'flex', gap: '8px', alignSelf: 'flex-start' }}>
              <div style={{
                width: '28px', height: '28px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #002E6E, #00BAF2)', color: 'white',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
              }}>
                <Sparkles size={14} />
              </div>
              <div style={{
                background: 'white', padding: '12px 16px', borderRadius: '16px',
                borderBottomLeftRadius: '4px', border: '1px solid #eee',
                display: 'flex', alignItems: 'center', gap: '4px'
              }}>
                <Loader2 size={16} color="#00BAF2" className="animate-spin" />
                <span style={{ fontSize: '13px', color: '#888' }}>Thinking...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div style={{ padding: '16px', background: 'white', borderTop: '1px solid #eee' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            background: '#F5F7FA', borderRadius: '24px', padding: '8px 12px 8px 16px'
          }}>
            <input 
              type="text" 
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Ask anything about your loan..."
              style={{
                flex: 1, background: 'transparent', border: 'none', outline: 'none',
                fontSize: '15px', color: '#111'
              }}
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              style={{
                background: input.trim() && !isLoading ? '#002E6E' : '#ddd',
                color: 'white', border: 'none', borderRadius: '50%',
                width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: input.trim() && !isLoading ? 'pointer' : 'not-allowed',
                transition: 'all 0.2s'
              }}
            >
              <Send size={16} style={{ marginLeft: '2px' }} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
