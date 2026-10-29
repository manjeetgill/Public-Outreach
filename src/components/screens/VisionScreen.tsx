import React, { useState } from 'react';
import { 
  Compass, 
  HeartPulse, 
  GraduationCap, 
  Apple, 
  Zap, 
  CheckCircle2, 
  Download, 
  Send, 
  Sparkles,
  Calendar,
  Building
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { VISION_2029, MLA_INFO } from '../../data/campaignData';
import { Language } from '../../types/campaign';

interface VisionScreenProps {
  lang: Language;
}

export const VisionScreen: React.FC<VisionScreenProps> = ({ lang }) => {
  const [suggestion, setSuggestion] = useState('');
  const [citizenName, setCitizenName] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSuggestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!suggestion.trim()) return;

    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 }
    });
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setSuggestion('');
      setCitizenName('');
    }, 4000);
  };

  const getIcon = (name: string) => {
    switch (name) {
      case 'HeartPulse': return <HeartPulse className="w-6 h-6 text-red-500" />;
      case 'GraduationCap': return <GraduationCap className="w-6 h-6 text-indigo-500" />;
      case 'Apple': return <Apple className="w-6 h-6 text-emerald-500" />;
      case 'Zap': return <Zap className="w-6 h-6 text-amber-500" />;
      default: return <Sparkles className="w-6 h-6 text-amber-500" />;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Hero Vision Banner */}
      <div className="bg-gradient-to-r from-[#102a43] via-[#0b1b2b] to-[#ea580c] text-white p-6 rounded-2xl shadow-lg border border-slate-800 relative overflow-hidden">
        <div className="max-w-2xl relative z-10 space-y-2">
          <div className="flex items-center gap-2">
            <span className="bg-amber-400 text-slate-950 font-black text-xs px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              {lang === 'hi' ? 'जन संकल्प पत्र 2024–2029' : 'Vision Manifesto 2024–2029'}
            </span>
            <span className="text-xs text-amber-200">
              {lang === 'hi' ? 'रणबीर सिंह निक्का का विज़न' : 'Ranbir Singh Nikka Vision'}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black">
            {lang === 'hi' ? 'समृद्ध, स्वस्थ व विकसित नूरपुर' : 'Prosperous, Healthy & Progressive Nurpur'}
          </h2>

          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
            {lang === 'hi' 
              ? 'आगामी 5 वर्षों में नूरपुर को आधुनिक स्वास्थ्य, स्थानीय रोजगार, उन्नत कृषि-बागवानी और पर्यावरण-अनुकूल ऊर्जा का आदर्श विधानसभा क्षेत्र बनाना।'
              : 'Our five-year roadmap to transform Nurpur into a benchmark constituency with world-class healthcare, youth jobs, and agro-storage infrastructure.'}
          </p>
        </div>
      </div>

      {/* 4 Pillars Grid (1 col mobile, 2 col wide) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {VISION_2029.map((item) => (
          <div 
            key={item.id}
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition space-y-3.5 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 inline-block">
                  {getIcon(item.iconName)}
                </div>
                <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                  <Calendar className="w-3.5 h-3.5 text-amber-600" />
                  <span>{lang === 'hi' ? `लक्ष्य वर्ष: ${item.targetYear}` : `Target: ${item.targetYear}`}</span>
                </div>
              </div>

              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  {lang === 'hi' ? item.pillar : item.pillarEn}
                </span>
                <h3 className="text-base font-extrabold text-slate-900 mt-0.5">
                  {lang === 'hi' ? item.title : item.titleEn}
                </h3>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {lang === 'hi' ? item.description : item.descriptionEn}
              </p>

              <div className="space-y-1.5 pt-2">
                {item.points.map((pt, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{pt}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold">{lang === 'hi' ? 'विधानसभा संकल्प' : 'Legislative Priority'}</span>
              <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                DPR तैयार
              </span>
            </div>

          </div>
        ))}
      </div>

      {/* Citizen Suggestion Box */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200 shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-600" />
          <h3 className="text-sm font-extrabold text-slate-900">
            {lang === 'hi' ? 'आप भी दें अपना विचार • जन सहभागिता' : 'Citizen Vision Feedback • Public Participation'}
          </h3>
        </div>
        <p className="text-xs text-slate-600">
          {lang === 'hi' 
            ? 'आपके वार्ड या मोहल्ले के लिए क्या विकास कार्य सबसे महत्वपूर्ण है? आपका सुझाव सीधे विधायक जी के विज़न ड्राफ्ट में शामिल होगा।'
            : 'What priority project does your locality need next? Share your idea directly with MLA Ranbir Singh Nikka.'}
        </p>

        {submitted ? (
          <div className="p-3 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold text-center">
            {lang === 'hi' ? '✓ आपका सुझाव प्राप्त हुआ! धन्यवाद।' : '✓ Suggestion submitted successfully! Thank you.'}
          </div>
        ) : (
          <form onSubmit={handleSuggestionSubmit} className="space-y-2.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input 
                type="text"
                value={citizenName}
                onChange={(e) => setCitizenName(e.target.value)}
                placeholder={lang === 'hi' ? 'आपका नाम व वार्ड...' : 'Your Name & Ward...'}
                className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              />
              <input 
                type="text"
                value={suggestion}
                onChange={(e) => setSuggestion(e.target.value)}
                placeholder={lang === 'hi' ? 'अपना बहुमूल्य सुझाव लिखें...' : 'Enter your key recommendation...'}
                className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2 bg-[#102a43] hover:bg-[#0b1b2b] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-xs transition"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{lang === 'hi' ? 'सुझाव सबमिट करें (Submit Idea)' : 'Submit Idea'}</span>
            </button>
          </form>
        )}
      </div>

    </div>
  );
};
