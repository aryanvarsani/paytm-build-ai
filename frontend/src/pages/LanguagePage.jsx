import { useState } from 'react';
import { useParams } from 'react-router-dom';
import PaytmHeader from '../components/PaytmHeader';
import { LANGUAGES } from '../data/mockData';

const TRANSLATIONS = {
  loan: {
    en: {
      title: 'Kyun? Explanation',
      summary: 'Your personal loan application for ₹2,50,000 was not approved. The main factors were high credit utilisation at 71%, two late payments in the last six months, and a relatively short credit history of 14 months...',
    },
    hi: {
      title: 'Kyun? व्याख्या',
      summary: 'आपका ₹2,50,000 का व्यक्तिगत ऋण आवेदन स्वीकृत नहीं हुआ। संभावित कारणों में 71% की उच्च क्रेडिट उपयोगिता, पिछले 6 महीनों में 2 देर से भुगतान, और 14 महीने का अपेक्षाकृत छोटा क्रेडिट इतिहास शामिल हैं।',
    },
    mr: {
      title: 'Kyun? स्पष्टीकरण',
      summary: 'तुमचा ₹2,50,000 चा वैयक्तिक कर्ज अर्ज मंजूर झाला नाही. ओळखले गेलेले संभाव्य घटक म्हणजे 71% उच्च क्रेडिट वापर, गेल्या 6 महिन्यांत 2 उशीरा देयके, आणि 14 महिन्यांचा तुलनेने कमी क्रेडिट इतिहास.',
    },
    gu: {
      title: 'Kyun? સમજૂતી',
      summary: 'તમારી ₹2,50,000 ની વ્યક્તિગત લોન અરજી મંજૂર થઈ નથી. ઓળખાયેલા સંભવિત પરિબળોમાં 71% ઊંચો ક્રેડિટ ઉપયોગ, છેલ્લા 6 મહિનામાં 2 મોડા ચુકવણીઓ, અને 14 મહિનાનો પ્રમાણમાં ટૂંકો ક્રેડિટ ઈતિહાસ સામેલ છે.',
    },
  },
  insurance: {
    en: {
      title: 'Kyun? Claim Analysis',
      summary: 'Your motor insurance claim of ₹84,500 was partially approved at ₹61,250. The gap of ₹23,250 is attributed to your policy coverage limit of ₹75,000, standard depreciation of ₹8,250 for a 3-year-old vehicle, a ₹5,000 policy deductible, and 1 pending support document.',
    },
    hi: {
      title: 'Kyun? दावा विश्लेषण',
      summary: 'आपका ₹84,500 का मोटर बीमा दावा ₹61,250 पर आंशिक रूप से स्वीकृत हुआ। ₹23,250 का अंतर आपकी पॉलिसी कवरेज सीमा ₹75,000, 3 साल पुराने वाहन के लिए ₹8,250 का मानक मूल्यह्रास, ₹5,000 की पॉलिसी कटौती, और 1 लंबित दस्तावेज़ के कारण है।',
    },
    mr: {
      title: 'Kyun? दावा विश्लेषण',
      summary: 'तुमचा ₹84,500 चा मोटर विमा दावा ₹61,250 ला अंशतः मंजूर झाला. ₹23,250 चा फरक तुमच्या पॉलिसी कव्हरेज मर्यादा ₹75,000, 3 वर्षांच्या वाहनासाठी ₹8,250 चे मानक घसारा, ₹5,000 ची पॉलिसी कपात, आणि 1 प्रलंबित दस्तऐवज यामुळे आहे.',
    },
    gu: {
      title: 'Kyun? દાવો વિશ્લેષણ',
      summary: 'તમારો ₹84,500 નો મોટર વીમા દાવો ₹61,250 પર આંશિક રીતે મંજૂર થયો. ₹23,250 નો તફાવત તમારી પોલિસી કવરેજ મર્યાદા ₹75,000, 3 વર્ષ જૂના વાહન માટે ₹8,250 નું પ્રમાણભૂત ઘસારો, ₹5,000 ની પોલિસી કપાત, અને 1 બાકી દસ્તાવેજને કારણે છે.',
    },
  },
  'mutual-funds': {
    en: {
      title: 'Kyun? Portfolio Insights',
      summary: 'Your portfolio of ₹4,80,000 needs attention. Key factors include 82% equity concentration (higher than your Moderate risk profile), 72% of your ₹8,000 monthly SIP directed to equity, and 45% sector overlap in technology between your funds.',
    },
    hi: {
      title: 'Kyun? पोर्टफोलियो जानकारी',
      summary: 'आपके ₹4,80,000 के पोर्टफोलियो पर ध्यान देने की आवश्यकता है। प्रमुख कारकों में 82% इक्विटी एकाग्रता, आपके ₹8,000 मासिक SIP का 72% इक्विटी में, फंड्स के बीच 45% सेक्टर ओवरलैप शामिल है।',
    },
    mr: {
      title: 'Kyun? पोर्टफोलिओ माहिती',
      summary: 'तुमच्या ₹4,80,000 च्या पोर्टफोलिओला लक्ष देणे आवश्यक आहे. प्रमुख घटकांमध्ये 82% इक्विटी एकाग्रता, तुमच्या ₹8,000 मासिक SIP पैकी 72% इक्विटीमध्ये, आणि फंडांमध्ये 45% सेक्टर ओव्हरलॅप यांचा समावेश आहे.',
    },
    gu: {
      title: 'Kyun? પોર્ટફોલિયો માહિતી',
      summary: 'તમારા ₹4,80,000 ના પોર્ટફોલિયોને ધ્યાન આપવાની જરૂર છે. મુખ્ય પરિબળોમાં 82% ઇક્વિટી એકાગ્રતા, તમારા ₹8,000 માસિક SIP નો 72% ઇક્વિટીમાં, અને ફંડ વચ્ચે 45% સેક્ટર ઓવરલેપ સામેલ છે.',
    },
  },
};

export default function LanguagePage() {
  const { product } = useParams();
  const [selectedLang, setSelectedLang] = useState('en');
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [transcriptOpen, setTranscriptOpen] = useState(true);

  const productKey = product || 'loan';
  const translations = TRANSLATIONS[productKey] || TRANSLATIONS.loan;

  const handlePlay = () => {
    setPlaying(!playing);
    if (!playing) {
      // Simulate audio playback progress
      let p = progress;
      const interval = setInterval(() => {
        p += 1.2;
        if (p >= 100) {
          clearInterval(interval);
          setPlaying(false);
          setProgress(0);
        } else {
          setProgress(p);
        }
      }, 100);
    }
  };

  const translation = selectedLang ? translations[selectedLang] : null;
  const productLabel = productKey === 'loan' ? 'loan' : productKey === 'insurance' ? 'insurance claim' : 'portfolio';

  return (
    <div className="page-content" style={{ background: '#F9FAFB', minHeight: '100%' }}>
      <PaytmHeader showBack title="Listen in your language" />

      <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <p style={{ fontSize: '15px', color: '#6B7280', lineHeight: 1.5 }}>
          Select a language to hear a summary of your {productLabel} explanation and suggested path forward.
        </p>

        {/* Language buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
          {LANGUAGES.map((lang) => {
            const isSelected = selectedLang === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => { setSelectedLang(lang.code); setPlaying(false); setProgress(0); }}
                style={{
                  textAlign: 'center', padding: '16px', cursor: 'pointer',
                  border: `1px solid ${isSelected ? '#021841' : '#E5E7EB'}`,
                  background: isSelected ? '#F0F5FF' : 'white',
                  borderRadius: '12px',
                  boxShadow: isSelected ? '0 2px 8px rgba(0,0,0,0.05)' : 'none',
                  transition: 'all 0.2s ease',
                  fontSize: '16px', fontWeight: isSelected ? 700 : 600,
                  color: isSelected ? '#021841' : '#111827'
                }}
              >
                {lang.native}
              </button>
            );
          })}
        </div>

        {/* Audio player */}
        {translation && (
          <div className="animate-in" style={{
            background: 'white', borderRadius: '24px', padding: '24px',
            border: '1px solid #E5E7EB', boxShadow: '0 4px 16px rgba(0,0,0,0.02)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '50%',
                background: '#6C3CE9', display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontSize: '18px', fontWeight: 700, flexShrink: 0
              }}>
                ?
              </div>
              <div>
                <p style={{ fontSize: '16px', fontWeight: 700, color: '#111827' }}>{translation.title}</p>
                <p style={{ fontSize: '13px', color: '#6B7280' }}>
                  {productKey === 'loan' ? 'Loan Application' : productKey === 'insurance' ? 'Insurance Claim' : 'Portfolio Analysis'} • {LANGUAGES.find(l => l.code === selectedLang)?.label || 'English'}
                </p>
              </div>
            </div>

            {/* Waveform visual */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', height: '40px', marginBottom: '8px' }}>
              {Array.from({ length: 24 }).map((_, i) => {
                const h = Math.sin(i * 0.8) * 12 + 16;
                const active = (i / 24) * 100 < progress;
                return (
                  <div
                    key={i}
                    style={{
                      flex: 1, borderRadius: '4px',
                      background: active ? '#00BAF2' : '#65D6F5',
                      opacity: active ? 1 : 0.6,
                      height: `${h}px`,
                      transition: 'background-color 0.15s, opacity 0.15s'
                    }}
                  />
                );
              })}
            </div>

            {/* Time */}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#6B7280', marginBottom: '20px' }}>
              <span>{Math.floor(progress * 0.84 / 100)}:{String(Math.floor((progress * 0.84) % 60 * 60 / 100)).padStart(2, '0')}</span>
              <span>1:24</span>
            </div>

            {/* Controls */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '32px' }}>
              <button style={{
                color: '#6B7280', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
                background: 'none', border: 'none', cursor: 'pointer'
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                  <path d="M3 3v5h5"></path>
                  <text x="12" y="16" fontSize="8" strokeWidth="0.5" textAnchor="middle">10</text>
                </svg>
              </button>
              
              <button
                onClick={handlePlay}
                style={{
                  width: '56px', height: '56px', borderRadius: '50%',
                  background: '#021841', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', border: 'none', cursor: 'pointer',
                  transform: playing ? 'scale(0.95)' : 'scale(1)',
                  transition: 'transform 0.15s'
                }}
              >
                {playing ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ marginLeft: '4px' }}><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                )}
              </button>
              
              <button style={{
                color: '#6B7280', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
                background: 'none', border: 'none', cursor: 'pointer'
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12a9 9 0 1 1-9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
                  <path d="M21 3v5h-5"></path>
                  <text x="12" y="16" fontSize="8" strokeWidth="0.5" textAnchor="middle">10</text>
                </svg>
              </button>
            </div>

            {/* Transcript */}
            <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #E5E7EB' }}>
              <button 
                onClick={() => setTranscriptOpen(!transcriptOpen)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%',
                  background: 'none', border: 'none', cursor: 'pointer', padding: 0
                }}
              >
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#111827' }}>Transcript</h3>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: transcriptOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
              
              {transcriptOpen && (
                <p style={{ fontSize: '14px', color: '#4B5563', lineHeight: 1.6, marginTop: '12px' }}>
                  {translation.summary}
                </p>
              )}
            </div>
          </div>
        )}

        <div style={{ textAlign: 'center', fontSize: '11px', color: '#6B7280', lineHeight: 1.5, padding: '0 16px' }}>
          This audio is generated for informational purposes only and does not constitute financial advice.
        </div>
      </div>
    </div>
  );
}
