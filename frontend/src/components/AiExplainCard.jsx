import { useState, useEffect, useRef } from 'react';
import { Sparkles, Play, Pause, Globe, Volume2, Loader2, ChevronDown } from 'lucide-react';

export const LOAN_REJECTION_EXPLANATION = {
  en: {
    label: "English",
    text: "Your application was not approved based on the available decision data. The strongest contributing signals were your credit score, high credit utilisation, and recent late payments. Together, these signals indicate higher recent credit risk in this example decision model.",
    structured: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div>
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#6C3CE9', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Decision Explanation</span>
          <p style={{ marginTop: '4px', fontSize: '14px', lineHeight: '1.5', color: '#333' }}>Your application was not approved based on the available decision data.</p>
        </div>
        <div>
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#6C3CE9', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Strongest signals</span>
          <ul style={{ paddingLeft: '18px', marginTop: '6px', marginBottom: 0, display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '14px' }}>
            <li><strong>Credit score</strong> — 680 <span style={{ color: '#B91C1C', fontSize: '10px', fontWeight: 700, background: '#FEE2E2', padding: '2px 6px', borderRadius: '8px', marginLeft: '4px' }}>High impact</span></li>
            <li><strong>Credit utilisation</strong> — 71% <span style={{ color: '#B91C1C', fontSize: '10px', fontWeight: 700, background: '#FEE2E2', padding: '2px 6px', borderRadius: '8px', marginLeft: '4px' }}>High impact</span></li>
            <li><strong>Recent payments</strong> — 2 late <span style={{ color: '#B91C1C', fontSize: '10px', fontWeight: 700, background: '#FEE2E2', padding: '2px 6px', borderRadius: '8px', marginLeft: '4px' }}>High impact</span></li>
          </ul>
        </div>
        <div>
          <p style={{ fontSize: '13px', lineHeight: '1.5', color: '#555' }}>
            Other factors may also have contributed, including your 14-month credit history, recent credit enquiries, existing outstanding debt, and debt-to-income ratio.
          </p>
          <div style={{ background: 'rgba(108,60,233,0.05)', padding: '10px', borderRadius: '8px', marginTop: '12px', borderLeft: '3px solid #6C3CE9' }}>
            <p style={{ fontSize: '11px', color: '#555', lineHeight: '1.4' }}>
              This explanation describes likely contributing factors from the available decision data. It is not a guaranteed reconstruction of the lender's internal decision logic.
            </p>
          </div>
        </div>
      </div>
    ),
    voiceLang: "en-IN",
    speaker: "ritu"
  },
  hi: {
    label: "हिंदी (Hindi)",
    text: "आपके व्यक्तिगत ऋण आवेदन को मुख्य रूप से 680 के कम क्रेडिट स्कोर के कारण स्वीकृत नहीं किया गया था, जो हमारी न्यूनतम आवश्यकता से कम है। इसके अतिरिक्त, आपके उच्च क्रेडिट उपयोग और हाल के विलंबित भुगतानों ने आपके जोखिम को बढ़ा दिया है। भविष्य में अपनी संभावनाओं को बेहतर बनाने के लिए, हम मौजूदा ऋण का भुगतान करने और एक अच्छा भुगतान इतिहास बनाए रखने की सलाह देते हैं।",
    voiceLang: "hi-IN",
    speaker: "ritu"
  },
  ta: {
    label: "தமிழ் (Tamil)",
    text: "உங்கள் தனிநபர் கடன் விண்ணப்பம் முக்கியமாக 680 என்ற குறைந்த கடன் மதிப்பெண் காரணமாக அங்கீகரிக்கப்படவில்லை, இது எங்கள் குறைந்தபட்ச தேவைக்குக் குறைவாக உள்ளது. கூடுதலாக, உங்கள் அதிக கடன் பயன்பாடு மற்றும் சமீபத்திய தாமதமான கொடுப்பனவுகள் உங்கள் ஆபத்தை அதிகரித்தன. எதிர்காலத்தில் உங்கள் வாய்ப்புகளை மேம்படுத்த, ஏற்கனவே உள்ள கடனை அடைக்க பரிந்துரைக்கிறோம்.",
    voiceLang: "ta-IN",
    speaker: "gokul"
  },
  te: {
    label: "తెలుగు (Telugu)",
    text: "మీ వ్యక్తిగత రుణ దరఖాస్తు ప్రధానంగా 680 తక్కువ క్రెడిట్ స్కోర్ కారణంగా ఆమోదించబడలేదు. అదనంగా, మీ అధిక క్రెడిట్ వినియోగం మరియు ఇటీవలి ఆలస్యమైన చెల్లింపులు మీ ప్రమాదాన్ని పెంచాయి. భవిష్యత్తులో మీ అవకాశాలను మెరుగుపరచడానికి, ప్రస్తుత అప్పులను చెల్లించాలని మేము సిఫార్సు చేస్తున్నాము.",
    voiceLang: "te-IN",
    speaker: "kavitha"
  }
};

export const LOAN_PLAN_EXPLANATION = {
  en: {
    label: "English",
    text: "To get your loan approved next time, follow this plan: First, pay off your outstanding credit card balance to lower your utilization. Second, ensure all EMIs are paid on time for the next 3 months to build a consistent history. We will automatically re-evaluate your profile once these steps are completed.",
    voiceLang: "en-IN",
    speaker: "ritu"
  },
  hi: {
    label: "हिंदी (Hindi)",
    text: "अगली बार अपना ऋण स्वीकृत कराने के लिए, इस योजना का पालन करें: सबसे पहले, अपने क्रेडिट उपयोग को कम करने के लिए अपने बकाया क्रेडिट कार्ड शेष का भुगतान करें। दूसरा, सुनिश्चित करें कि लगातार इतिहास बनाने के लिए अगले 3 महीनों के लिए सभी ईएमआई का समय पर भुगतान किया जाए। इन चरणों के पूरा होने के बाद हम स्वचालित रूप से आपके प्रोफ़ाइल का पुनर्मूल्यांकन करेंगे।",
    voiceLang: "hi-IN",
    speaker: "ritu"
  },
  ta: {
    label: "தமிழ் (Tamil)",
    text: "அடுத்த முறை உங்கள் கடனை அங்கீகரிக்க, இந்தத் திட்டத்தைப் பின்பற்றவும்: முதலில், உங்கள் பயன்பாட்டைக் குறைக்க, நிலுவையில் உள்ள கிரெடிட் கார்டு நிலுவைத் தொகையைச் செலுத்தவும். இரண்டாவதாக, ஒரு நிலையான வரலாற்றை உருவாக்க அடுத்த 3 மாதங்களுக்கு அனைத்து EMIகளும் சரியான நேரத்தில் செலுத்தப்படுவதை உறுதிசெய்யவும். இந்தப் படிகள் முடிந்ததும் உங்கள் சுயவிவரத்தை தானாகவே மறுமதிப்பீடு செய்வோம்.",
    voiceLang: "ta-IN",
    speaker: "gokul"
  },
  te: {
    label: "తెలుగు (Telugu)",
    text: "తదుపరిసారి మీ రుణాన్ని ఆమోదించడానికి, ఈ ప్లాన్‌ని అనుసరించండి: ముందుగా, మీ వినియోగాన్ని తగ్గించడానికి మీ బాకీ ఉన్న క్రెడిట్ కార్డ్ బ్యాలెన్స్‌ని చెల్లించండి. రెండవది, స్థిరమైన చరిత్రను రూపొందించడానికి తదుపరి 3 నెలల పాటు అన్ని EMIలు సకాలంలో చెల్లించబడుతున్నాయని నిర్ధారించుకోండి. ఈ దశలు పూర్తయిన తర్వాత మేము మీ ప్రొఫైల్‌ను స్వయంచాలకంగా తిరిగి మూల్యాంకనం చేస్తాము.",
    voiceLang: "te-IN",
    speaker: "kavitha"
  }
};

export const INSURANCE_EXPLANATION = {
  en: {
    label: "English",
    text: "Your motor insurance claim was partially approved. The repair cost was ₹83,250, but your policy coverage limit is only ₹75,000. Additionally, a standard depreciation of ₹8,250 was applied based on your vehicle's age.",
    voiceLang: "en-IN",
    speaker: "ritu"
  },
  hi: {
    label: "हिंदी (Hindi)",
    text: "आपके मोटर बीमा दावे को आंशिक रूप से स्वीकृत किया गया था। मरम्मत की लागत ₹83,250 थी, लेकिन आपकी पॉलिसी कवरेज सीमा केवल ₹75,000 है। इसके अतिरिक्त, आपके वाहन की उम्र के आधार पर ₹8,250 का मानक मूल्यह्रास लागू किया गया था।",
    voiceLang: "hi-IN",
    speaker: "ritu"
  },
  ta: {
    label: "தமிழ் (Tamil)",
    text: "உங்கள் மோட்டார் காப்பீட்டு கோரிக்கை ஓரளவு அங்கீகரிக்கப்பட்டது. பழுதுபார்க்கும் செலவு ₹83,250, ஆனால் உங்கள் பாலிசி கவரேஜ் வரம்பு ₹75,000 மட்டுமே. கூடுதலாக, உங்கள் வாகனத்தின் வயதின் அடிப்படையில் ₹8,250 நிலையான தேய்மானம் பயன்படுத்தப்பட்டது.",
    voiceLang: "ta-IN",
    speaker: "gokul"
  },
  te: {
    label: "తెలుగు (Telugu)",
    text: "మీ మోటారు బీమా క్లెయిమ్ పాక్షికంగా ఆమోదించబడింది. మరమ్మత్తు ఖర్చు ₹83,250, అయితే మీ పాలసీ కవరేజ్ పరిమితి ₹75,000 మాత్రమే. అదనంగా, మీ వాహనం వయస్సు ఆధారంగా ₹8,250 ప్రామాణిక తరుగుదల వర్తించబడింది.",
    voiceLang: "te-IN",
    speaker: "kavitha"
  }
};

export const MUTUAL_FUNDS_EXPLANATION = {
  en: {
    label: "English",
    text: "Your mutual fund portfolio is highly exposed to risk. It has an 82% allocation to equity, which is much higher than typical for a moderate risk profile. Additionally, there is a 45% sector overlap in technology, meaning your investments are not well diversified.",
    voiceLang: "en-IN",
    speaker: "ritu"
  },
  hi: {
    label: "हिंदी (Hindi)",
    text: "आपके म्यूचुअल फंड पोर्टफोलियो में जोखिम बहुत अधिक है। इसमें इक्विटी में 82% आवंटन है, जो मध्यम जोखिम प्रोफ़ाइल के लिए विशिष्ट से बहुत अधिक है। इसके अतिरिक्त, प्रौद्योगिकी में 45% सेक्टर ओवरलैप है, जिसका अर्थ है कि आपके निवेश अच्छी तरह से विविध नहीं हैं।",
    voiceLang: "hi-IN",
    speaker: "ritu"
  },
  ta: {
    label: "தமிழ் (Tamil)",
    text: "உங்கள் மியூச்சுவல் ஃபண்ட் போர்ட்ஃபோலியோ அபாயத்திற்கு அதிகம் ஆளாகிறது. இது ஈக்விட்டிக்கு 82% ஒதுக்கீட்டைக் கொண்டுள்ளது, இது மிதமான ஆபத்து சுயவிவரத்திற்கான வழக்கமானதை விட அதிகமாகும். கூடுதலாக, தொழில்நுட்பத்தில் 45% செக்டார் ஓவர்லேப் உள்ளது, அதாவது உங்கள் முதலீடுகள் பன்முகப்படுத்தப்படவில்லை.",
    voiceLang: "ta-IN",
    speaker: "gokul"
  },
  te: {
    label: "తెలుగు (Telugu)",
    text: "మీ మ్యూచువల్ ఫండ్ పోర్ట్‌ఫోలియో రిస్క్‌కు బాగా గురవుతుంది. ఇది ఈక్విటీకి 82% కేటాయింపును కలిగి ఉంది, ఇది మితమైన ప్రమాద ప్రొఫైల్ కోసం సాధారణ కంటే చాలా ఎక్కువ. అదనంగా, సాంకేతికతలో 45% సెక్టార్ ఓవర్‌ల్యాప్ ఉంది, అంటే మీ పెట్టుబడులు బాగా వైవిధ్యభరితంగా లేవని అర్థం.",
    voiceLang: "te-IN",
    speaker: "kavitha"
  }
};

export default function AiExplainCard({ explanations = LOAN_REJECTION_EXPLANATION, title = "Kyun? AI Summary" }) {
  const [lang, setLang] = useState('en');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Cache fetched audio elements so we don't recall the API unnecessarily
  const audioCache = useRef({});
  const currentAudio = useRef(null);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (currentAudio.current) {
        currentAudio.current.pause();
      }
    };
  }, []);

  const stopCurrentAudio = () => {
    if (currentAudio.current) {
      currentAudio.current.pause();
      currentAudio.current.currentTime = 0;
    }
    setIsPlaying(false);
  };

  const generateAndPlayAudio = async () => {
    // If already playing, pause it
    if (isPlaying) {
      stopCurrentAudio();
      return;
    }

    // If we already have the audio for this language cached, play it immediately
    if (audioCache.current[lang]) {
      currentAudio.current = audioCache.current[lang];
      currentAudio.current.play();
      setIsPlaying(true);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('https://api.sarvam.ai/text-to-speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-subscription-key': import.meta.env.VITE_SARVAM_API_KEY || 'sk_yeid9san_i5fTkNSh5ZKJj1DyFHMOrAGR'
        },
        body: JSON.stringify({
          inputs: [explanations[lang].text],
          target_language_code: explanations[lang].voiceLang,
          speaker: explanations[lang].speaker,
          pitch: 0,
          pace: 1.0,
          loudness: 1.5,
          speech_sample_rate: 8000,
          enable_preprocessing: true,
          model: "bulbul:v3"
        })
      });

      if (!response.ok) {
        throw new Error('TTS API request failed');
      }

      const data = await response.json();
      if (data.audios && data.audios.length > 0) {
        // Create audio from base64
        const audioSrc = `data:audio/wav;base64,${data.audios[0]}`;
        const audioObj = new Audio(audioSrc);
        
        // Handle audio events
        audioObj.onended = () => setIsPlaying(false);
        audioObj.onerror = () => setIsPlaying(false);
        
        // Save to cache and play
        audioCache.current[lang] = audioObj;
        currentAudio.current = audioObj;
        audioObj.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error fetching TTS audio:', error);
      alert('Failed to generate audio. Please check API key or network.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLangChange = (e) => {
    setLang(e.target.value);
    stopCurrentAudio();
  };

  return (
    <div style={{
      background: 'white',
      borderRadius: '18px',
      padding: '20px',
      boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
      border: '1px solid #f0f0f0',
      marginBottom: '16px'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #002E6E, #00BAF2)',
            borderRadius: '10px', width: '28px', height: '28px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white'
          }}>
            <Sparkles size={14} />
          </div>
          <span style={{ fontSize: '15px', fontWeight: 800, color: '#1a1a2e', letterSpacing: '-0.2px' }}>{title}</span>
        </div>
        
        {/* Language Selector */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '4px',
          background: '#F8F5FF', padding: '6px 10px 6px 12px', borderRadius: '20px',
          border: '1px solid #E8DEFF', cursor: 'pointer', position: 'relative',
          boxShadow: '0 1px 2px rgba(108,60,233,0.05)'
        }}>
          <Globe size={14} color="#6C3CE9" />
          <select 
            value={lang} 
            onChange={handleLangChange}
            style={{
              background: 'transparent', border: 'none',
              fontSize: '13px', fontWeight: 700, color: '#6C3CE9',
              outline: 'none', cursor: 'pointer', appearance: 'none',
              paddingRight: '16px'
            }}
          >
            {Object.entries(explanations).map(([key, data]) => (
              <option key={key} value={key}>{data.label}</option>
            ))}
          </select>
          <ChevronDown size={14} color="#6C3CE9" style={{ position: 'absolute', right: '10px', pointerEvents: 'none' }} />
        </div>
      </div>

      {/* Explanation Text */}
      <div style={{ 
        background: '#F8F9FB', padding: '16px', borderRadius: '12px',
        fontSize: '14px', lineHeight: '1.6', color: '#333',
        fontWeight: 500, marginBottom: '16px', borderLeft: '4px solid #00BAF2'
      }}>
        {explanations[lang].structured || explanations[lang].text}
      </div>

      {/* Text to Speech Button */}
      <button 
        onClick={generateAndPlayAudio}
        disabled={isLoading}
        style={{
          width: '100%',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          background: isLoading ? '#f5f5f5' : isPlaying ? '#FFF0F0' : '#F0F8FF',
          color: isLoading ? '#999' : isPlaying ? '#E53935' : '#0066CC',
          border: isLoading ? '1px solid #eee' : isPlaying ? '1px solid #FFCDD2' : '1px solid #BBDEFB',
          padding: '12px', borderRadius: '12px',
          fontSize: '14px', fontWeight: 700, cursor: isLoading ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s'
        }}
      >
        {isLoading ? (
          <Loader2 size={18} className="animate-spin" />
        ) : isPlaying ? (
          <Pause size={18} />
        ) : (
          <Volume2 size={18} />
        )}
        {isLoading ? 'Generating Audio...' : isPlaying ? 'Pause Audio' : 'Listen with Sarvam AI'}
      </button>
    </div>
  );
}
