import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  MapPin, 
  Ribbon, 
  Bot, 
  PhoneCall, 
  MessageSquare, 
  AlertTriangle, 
  Route, 
  Map, 
  Users, 
  Clock, 
  Share2, 
  CheckCircle,
  CheckCircle2,
  ExternalLink,
  Radio,
  Hospital,
  Mic,
  MicOff,
  Volume2,
  Loader2,
  FileText,
  Vote,
  Zap,
  Droplets,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { MLA_INFO, INITIAL_PADYATRA } from '../../data/campaignData';
import { ScreenTab, Language } from '../../types/campaign';
import { DailyJanvaniPlayer } from '../audio/DailyJanvaniPlayer';
import { transcribeAudio, fetchMlaProfile, fetchFacebookFeed, fetchPadyatraSchedule } from '../../services/api';

interface HomeScreenProps {
  onSwitchTab: (tab: ScreenTab) => void;
  onOpenComplaintModal: () => void;
  onOpenVoiceDesk: () => void;
  onOpenWhatsAppAgent: () => void;
  onOpenVoterSlip?: () => void;
  onOpenYojanaModal?: () => void;
  onOpenMlaLetter?: () => void;
  lang: Language;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onSwitchTab,
  onOpenComplaintModal,
  onOpenVoiceDesk,
  onOpenWhatsAppAgent,
  onOpenVoterSlip,
  onOpenYojanaModal,
  onOpenMlaLetter,
  lang
}) => {
  const [isSaralMode, setIsSaralMode] = useState(true);
  const [profile, setProfile] = useState<any>(MLA_INFO);
  const [facebookFeed, setFacebookFeed] = useState<any[]>([]);
  const [padyatraStops, setPadyatraStops] = useState<any[]>(INITIAL_PADYATRA);
  const [isRecordingHero, setIsRecordingHero] = useState(false);
  const [isTranscribingHero, setIsTranscribingHero] = useState(false);
  const [heroSpokenText, setHeroSpokenText] = useState('');
  const [heroParsedData, setHeroParsedData] = useState<{ category: string; ward: number; locality: string } | null>(null);
  const [heroSubmitted, setHeroSubmitted] = useState(false);
  const heroAudioChunksRef = useRef<Blob[]>([]);
  const heroMediaRecorderRef = useRef<MediaRecorder | null>(null);

  useEffect(() => {
    fetchMlaProfile().then(p => {
      if (p) setProfile(p);
    }).catch(console.error);

    fetchFacebookFeed().then(feed => {
      if (feed && feed.length > 0) setFacebookFeed(feed);
    }).catch(console.error);

    fetchPadyatraSchedule().then(sched => {
      if (sched?.stops && sched.stops.length > 0) {
        setPadyatraStops(sched.stops);
      }
    }).catch(console.error);
  }, []);

  const parseHeroVoice = (text: string) => {
    let cat = 'विद्युत / ट्रांसफार्मर समस्या';
    let ward = 3;
    let loc = 'सुलियाली';

    if (text.includes('पानी') || text.includes('पाइप') || text.includes('लीक') || text.includes('जल') || text.includes('नल')) {
      cat = 'पेयजल / पाइपलाइन लीकेज';
    } else if (text.includes('सड़क') || text.includes('गड्ढा') || text.includes('रास्ता') || text.includes('भूस्खलन') || text.includes('तारकोल')) {
      cat = 'सड़क एवं गड्ढा मरम्मत';
    } else if (text.includes('राशन') || text.includes('पेंशन') || text.includes('योजना') || text.includes('बीपीएल')) {
      cat = 'राशन एवं सरकारी योजना सहायता';
    } else if (text.includes('नाली') || text.includes('सफाई') || text.includes('कचरा') || text.includes('कूड़ा')) {
      cat = 'नाली एवं स्वच्छता सफाई';
    }

    const wardMatch = text.match(/(?:वार्ड|ward)\s*(\d+)/i);
    if (wardMatch) {
      const num = parseInt(wardMatch[1], 10);
      if (!isNaN(num) && num >= 1 && num <= 24) ward = num;
    }

    const localities = ['सुलियाली', 'कोटला', 'जसूर', 'भदवार', 'खन्नी', 'रे', 'फतेहपुर', 'बासा', 'सधूं'];
    for (const l of localities) {
      if (text.includes(l)) {
        loc = l;
        break;
      }
    }

    setHeroParsedData({ category: cat, ward, locality: loc });
  };

  const handleStartHeroVoice = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      heroAudioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      heroMediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) heroAudioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach(t => t.stop());
        const audioBlob = new Blob(heroAudioChunksRef.current, { type: 'audio/webm' });
        setIsTranscribingHero(true);
        try {
          const text = await transcribeAudio(audioBlob);
          if (text) {
            setHeroSpokenText(text);
            parseHeroVoice(text);
          }
        } catch (err) {
          console.error(err);
        } finally {
          setIsTranscribingHero(false);
          setIsRecordingHero(false);
        }
      };

      mediaRecorder.start();
      setIsRecordingHero(true);
      setHeroSubmitted(false);
    } catch {
      // Instant simulation fallback if mic permissions not granted
      const fallbackText = "निक्का जी, सुलियाली वार्ड 3 में 100kVA बिजली ट्रांसफार्मर खराब हो गया है";
      setHeroSpokenText(fallbackText);
      parseHeroVoice(fallbackText);
      setIsRecordingHero(false);
    }
  };

  const handleStopHeroVoice = () => {
    if (heroMediaRecorderRef.current && isRecordingHero) {
      heroMediaRecorderRef.current.stop();
    }
  };

  const handleSelectHeroQuickSample = (sampleText: string) => {
    setHeroSpokenText(sampleText);
    parseHeroVoice(sampleText);
    setHeroSubmitted(false);
  };

  const handleDirectSubmitFromHero = () => {
    setHeroSubmitted(true);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const shareUpdateToWhatsApp = () => {
    const text = `*नूरपुर विकास समाचार • रणबीर सिंह निक्का*\n\nवार्ड ८ प्राथमिक स्वास्थ्य केंद्र (PHC) का भव्य लोकार्पण!\n• लागत: ₹1.45 करोड़ (MLA-LAD)\n• लाभ: 18,000+ नागरिक\n• 24x7 आपातकालीन सेवा एवं मातृत्व विंग समर्पित।\n\nजनसेवक रणबीर सिंह निक्का - घर-घर निक्का, हर घर निक्का।`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <section className="p-4 space-y-4">
      {/* 0. Community Audio Bulletin: 60-Second Daily Voice Capsule */}
      <DailyJanvaniPlayer lang={lang} />

      {/* TOP HIGH-CONTRAST SARAL MODE TOGGLE */}
      <div className="bg-gradient-to-r from-emerald-700 via-teal-800 to-slate-900 p-3 rounded-2xl shadow-xl border border-emerald-400/40 flex items-center justify-between text-white">
        <div className="flex items-center gap-2.5">
          <span className="w-9 h-9 rounded-xl bg-white text-emerald-700 flex items-center justify-center font-black text-lg shadow-sm shrink-0">
            🟢
          </span>
          <div>
            <div className="text-xs font-black flex items-center gap-1.5 flex-wrap">
              <span>सरल मोड (Zero-Typing Voice Mode)</span>
              <span className="bg-amber-400 text-slate-950 text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase">
                ग्रामीण विशेष
              </span>
            </div>
            <p className="text-[10px] text-emerald-100">
              बिना टाइप किए सिर्फ बोलकर समस्या दर्ज करें व 1-टच जन सेवाएं पाएं
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsSaralMode(prev => !prev)}
          className={`px-3 py-1.5 rounded-xl text-xs font-black transition shadow-md shrink-0 flex items-center gap-1 ${
            isSaralMode
              ? 'bg-amber-400 text-slate-950 ring-2 ring-white active:scale-95'
              : 'bg-slate-800 text-slate-300 border border-slate-600'
          }`}
        >
          <span>{isSaralMode ? '🟢 सरल मोड चालू' : '⚪ विस्तृत मोड'}</span>
        </button>
      </div>

      {/* SARAL MODE ZERO-TYPING HERO & 4 BIG VISUAL TILES */}
      {isSaralMode && (
        <div className="space-y-4 animate-in fade-in duration-300">
          {/* HERO VOICE CARD: GIANT PULSING GREEN MICROPHONE */}
          <div className="bg-gradient-to-b from-emerald-500 via-emerald-600 to-teal-800 text-white rounded-3xl p-5 shadow-2xl border-2 border-emerald-300/60 relative overflow-hidden text-center">
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>

            <div className="inline-flex items-center gap-1.5 bg-black/25 text-emerald-100 px-3 py-1 rounded-full text-[11px] font-bold backdrop-blur-xs mb-3">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
              <span>1-टच वॉयस हेल्पलाइन • विधायक कैंप कार्यालय नूरपुर</span>
            </div>

            <h3 className="text-lg sm:text-xl font-black text-white tracking-wide">
              दबाएं और अपनी समस्या बोलें
            </h3>
            <p className="text-xs text-emerald-100 mt-0.5">
              Tap & Speak in Hindi or Kangri Pahari • AI तुरंत समझेगा
            </p>

            {/* Giant Pulsing Microphone */}
            <div className="relative inline-block my-4">
              {isRecordingHero && (
                <div className="absolute -inset-3 rounded-full bg-white animate-ping opacity-60"></div>
              )}
              <button
                type="button"
                onClick={isRecordingHero ? handleStopHeroVoice : handleStartHeroVoice}
                disabled={isTranscribingHero}
                className={`relative w-28 h-28 rounded-full flex flex-col items-center justify-center text-slate-950 shadow-2xl transition-all transform active:scale-95 border-4 border-white ${
                  isRecordingHero
                    ? 'bg-rose-500 text-white animate-pulse ring-8 ring-rose-300/50'
                    : isTranscribingHero
                      ? 'bg-amber-400 ring-8 ring-amber-300/40'
                      : 'bg-white hover:bg-emerald-50 ring-8 ring-white/30 shadow-black/20'
                }`}
              >
                {isTranscribingHero ? (
                  <>
                    <Loader2 className="w-10 h-10 animate-spin text-slate-950" />
                    <span className="text-[10px] font-black text-slate-950 mt-1">समझ रहे हैं...</span>
                  </>
                ) : isRecordingHero ? (
                  <>
                    <MicOff className="w-10 h-10 text-white" />
                    <span className="text-[10px] font-black text-white mt-1">बोलना बंद करें</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-11 h-11 text-emerald-700" />
                    <span className="text-[11px] font-black text-emerald-900 mt-1">माइक दबाएं</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-xs text-emerald-100 font-medium max-w-sm mx-auto">
              {isRecordingHero 
                ? '🔴 रिकॉर्डिंग जारी है... अपनी समस्या व गांव का नाम बोलें' 
                : isTranscribingHero 
                  ? '⚡ AI आपकी समस्या, श्रेणी और वार्ड का विश्लेषण कर रहा है...' 
                  : 'उदा: "निक्का जी, सुलियाली वार्ड 3 में बिजली ट्रांसफार्मर खराब है।"'}
            </p>

            {/* 3 Quick 1-Touch Speech Simulation Chips */}
            <div className="mt-3 pt-3 border-t border-white/20">
              <div className="text-[10px] font-bold text-emerald-200 mb-1.5 flex items-center justify-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>या 1-टच त्वरित उदाहरण चुनें:</span>
              </div>
              <div className="flex flex-wrap justify-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleSelectHeroQuickSample('निक्का जी, सुलियाली वार्ड 3 में 100kVA बिजली ट्रांसफार्मर जल गया है')}
                  className="bg-black/25 hover:bg-black/40 text-white px-2.5 py-1 rounded-xl text-[10px] font-bold transition border border-white/20 active:scale-95"
                >
                  ⚡ सुलियाली वार्ड 3 ट्रांसफार्मर
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectHeroQuickSample('निक्का जी, जसूर वार्ड 14 में मुख्य पेयजल पाइपलाइन लीकेज है')}
                  className="bg-black/25 hover:bg-black/40 text-white px-2.5 py-1 rounded-xl text-[10px] font-bold transition border border-white/20 active:scale-95"
                >
                  💧 जसूर वार्ड 14 पेयजल लीकेज
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectHeroQuickSample('निक्का जी, भदवार वार्ड 19 में लिंक रोड पर भूस्खलन हो गया है')}
                  className="bg-black/25 hover:bg-black/40 text-white px-2.5 py-1 rounded-xl text-[10px] font-bold transition border border-white/20 active:scale-95"
                >
                  🚜 भदवार वार्ड 19 सड़क भूस्खलन
                </button>
              </div>
            </div>

            {/* Spoken Output & 1-Tap Action Confirmation Card */}
            {heroSpokenText && (
              <div className="mt-4 bg-white text-slate-900 p-4 rounded-2xl shadow-xl text-left space-y-2 border border-slate-200 animate-in fade-in duration-200">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-extrabold text-emerald-800 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>AI द्वारा पहचानी गई समस्या:</span>
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">वॉयस-टू-एक्शन</span>
                </div>

                <div className="text-xs text-slate-800 font-medium italic bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  "{heroSpokenText}"
                </div>

                {heroParsedData && (
                  <div className="flex flex-wrap items-center gap-1.5 text-xs font-bold pt-1">
                    <span className="bg-indigo-50 text-indigo-800 px-2.5 py-1 rounded-lg border border-indigo-200">
                      विभाग: {heroParsedData.category}
                    </span>
                    <span className="bg-amber-50 text-amber-800 px-2.5 py-1 rounded-lg border border-amber-200">
                      वार्ड संख्या: {heroParsedData.ward}
                    </span>
                    <span className="bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-lg border border-emerald-200">
                      स्थान: {heroParsedData.locality}
                    </span>
                  </div>
                )}

                {heroSubmitted ? (
                  <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-center space-y-1">
                    <div className="text-xs font-black text-emerald-800 flex items-center justify-center gap-1.5">
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>शिकायत #NR-{Math.floor(1000 + Math.random() * 9000)} विधायक कैंप कार्यालय में प्रेषित!</span>
                    </div>
                    <p className="text-[10px] text-slate-600">
                      फास्ट-ट्रैक टीम 24 घंटे में निरीक्षण करेगी। लाइव अपडेट व्हाट्सएप पर मिलेगा।
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={handleDirectSubmitFromHero}
                      className="flex-1 py-3 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-black rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-lg active:scale-95 transition"
                    >
                      <Check className="w-4 h-4" />
                      <span>🚀 तुरंत विधायक कैंप कार्यालय में भेजें (1-Tap Send)</span>
                    </button>
                    <button
                      type="button"
                      onClick={onOpenComplaintModal}
                      className="py-3 px-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs flex items-center justify-center gap-1 transition"
                    >
                      <span>फोटो / विवरण जोड़ें</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 4 BIG VISUAL ACTION TILES (NO COMPLEX MENUS) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Tile 1: 🎙️ बोलकर शिकायत करें */}
            <button
              onClick={onOpenComplaintModal}
              className="p-4 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white text-left shadow-lg transition active:scale-98 flex items-center gap-3.5 border border-emerald-400/40 group"
            >
              <div className="w-14 h-14 rounded-2xl bg-white/20 text-white flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition">
                <Mic className="w-7 h-7 text-white animate-pulse" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-base font-black text-white">बोलकर शिकायत करें</span>
                  <span className="bg-white/20 text-white text-[9px] font-bold px-1.5 py-0.2 rounded">वॉयस AI</span>
                </div>
                <p className="text-xs text-emerald-100 font-medium mt-0.5">
                  माइक से सीधे समस्या बताएं, टाइपिंग की आवश्यकता नहीं
                </p>
                <span className="text-[10px] text-amber-300 font-bold mt-1 inline-block">
                  तुरंत दर्ज करें →
                </span>
              </div>
            </button>

            {/* Tile 2: 💬 व्हाट्सएप पर बोलें */}
            <a
              href={`https://wa.me/919816041234?text=${encodeURIComponent('नमस्ते निक्का जी, मैं नूरपुर विधानसभा से अपनी समस्या रिकॉर्ड करके भेज रहा हूँ:')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-2xl bg-gradient-to-br from-green-600 to-emerald-700 hover:from-green-500 hover:to-emerald-600 text-white text-left shadow-lg transition active:scale-98 flex items-center gap-3.5 border border-green-400/40 group"
            >
              <div className="w-14 h-14 rounded-2xl bg-white/20 text-white flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition">
                <MessageSquare className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-base font-black text-white">व्हाट्सएप पर बोलें</span>
                  <span className="bg-white/20 text-white text-[9px] font-bold px-1.5 py-0.2 rounded">1-Tap</span>
                </div>
                <p className="text-xs text-green-100 font-medium mt-0.5">
                  हेल्पलाइन 98160-41234 पर 1-टैप वॉयस नोट भेजें
                </p>
                <span className="text-[10px] text-amber-300 font-bold mt-1 inline-block">
                  व्हाट्सएप खोलें →
                </span>
              </div>
            </a>

            {/* Tile 3: 📜 मेरी योजना / सिफारिश पत्र */}
            <button
              onClick={() => {
                if (onOpenYojanaModal) {
                  onOpenYojanaModal();
                } else if (onOpenMlaLetter) {
                  onOpenMlaLetter();
                }
              }}
              className="p-4 rounded-2xl bg-gradient-to-br from-amber-600 to-orange-700 hover:from-amber-500 hover:to-orange-600 text-white text-left shadow-lg transition active:scale-98 flex items-center gap-3.5 border border-amber-400/40 group"
            >
              <div className="w-14 h-14 rounded-2xl bg-white/20 text-white flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition">
                <FileText className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-base font-black text-white">मेरी योजना / सिफारिश पत्र</span>
                  <span className="bg-white/20 text-white text-[9px] font-bold px-1.5 py-0.2 rounded">सरकारी लाभ</span>
                </div>
                <p className="text-xs text-amber-100 font-medium mt-0.5">
                  राशन, पेंशन व विधायक संस्तुति पत्र 1-क्लिक में प्राप्त करें
                </p>
                <span className="text-[10px] text-amber-200 font-bold mt-1 inline-block">
                  योजनाएं देखें →
                </span>
              </div>
            </button>

            {/* Tile 4: 🗳️ वोटर पर्ची देखें */}
            <button
              onClick={() => {
                if (onOpenVoterSlip) {
                  onOpenVoterSlip();
                } else {
                  onSwitchTab('screen-voter');
                }
              }}
              className="p-4 rounded-2xl bg-gradient-to-br from-blue-700 to-indigo-800 hover:from-blue-600 hover:to-indigo-700 text-white text-left shadow-lg transition active:scale-98 flex items-center gap-3.5 border border-blue-400/40 group"
            >
              <div className="w-14 h-14 rounded-2xl bg-white/20 text-white flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition">
                <Vote className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-base font-black text-white">वोटर पर्ची देखें</span>
                  <span className="bg-white/20 text-white text-[9px] font-bold px-1.5 py-0.2 rounded">डिजिटल पर्ची</span>
                </div>
                <p className="text-xs text-blue-100 font-medium mt-0.5">
                  अपना भाग व क्रम संख्या 5 सेकंड में बिना लाइन के खोजें
                </p>
                <span className="text-[10px] text-amber-300 font-bold mt-1 inline-block">
                  पर्ची डाउनलोड करें →
                </span>
              </div>
            </button>
          </div>
        </div>
      )}

      <div className="bg-gradient-to-br from-[#102a43] via-[#0f243a] to-[#0a1827] text-white rounded-2xl p-4 shadow-lg border border-slate-800 relative overflow-hidden">
        <div className="absolute -right-8 -top-8 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>
        
        {/* Top Badges */}
        <div className="flex items-center justify-between mb-3 text-[11px] font-bold">
          <span className="bg-amber-600 text-white px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
            {lang === 'hi' ? 'जन सेवक, आपके द्वार' : 'Civic Leader at Your Doorstep'}
          </span>
          <span className="text-slate-300 bg-slate-800/80 px-2 py-0.5 rounded-full border border-slate-700 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-amber-400" />
            {lang === 'hi' ? 'नूरपुर विधानसभा क्षेत्र' : 'Nurpur Assembly Constituency'}
          </span>
        </div>

        {/* Candidate Avatar & Bio */}
        <div className="flex items-center gap-3.5 mb-4">
          <div className="relative shrink-0">
            <img 
              src={profile?.photoUrl || MLA_INFO.photoUrl} 
              alt={profile?.name || MLA_INFO.name} 
              className="w-16 h-16 rounded-xl object-cover border-2 border-amber-400 shadow-md" 
            />
            <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-slate-900 flex items-center justify-center text-[9px] text-white font-bold">
              ✓
            </span>
          </div>
          <div>
            <h2 className="text-base font-extrabold text-white">
              {lang === 'hi' ? (profile?.name || MLA_INFO.name) : (profile?.nameEn || MLA_INFO.nameEn)}
            </h2>
            <span className="inline-block bg-amber-500/20 text-amber-300 text-[11px] font-bold px-2 py-0.5 rounded border border-amber-500/40 mt-0.5">
              {lang === 'hi' ? (profile?.slogan || MLA_INFO.slogan) : (profile?.sloganEn || MLA_INFO.sloganEn)}
            </span>
            <p className="text-[11px] text-slate-300 mt-1">
              {lang === 'hi' ? (profile?.title || MLA_INFO.title) : (profile?.titleEn || MLA_INFO.titleEn)} • {lang === 'hi' ? 'नूरपुर' : 'Nurpur'}
            </p>
          </div>
        </div>

        {/* Ribbon */}
        <div className="bg-white/10 rounded-xl p-2.5 mb-3 backdrop-blur-xs border border-white/10 flex items-center gap-2 text-xs">
          <Ribbon className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="text-slate-200">
            {lang === 'hi' ? (profile?.tenure || MLA_INFO.tenure) : (profile?.tenureEn || MLA_INFO.tenureEn)}
          </span>
        </div>

        {/* Quick Stats Bar */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-700/60 text-center">
          <div>
            <div className="text-lg font-black text-amber-400">
              {profile?.stats?.worksCompleted ? `${profile.stats.worksCompleted}+` : '148+'}
            </div>
            <div className="text-[10px] text-slate-300 font-medium">
              {lang === 'hi' ? 'विकास कार्य पूर्ण' : 'Projects Done'}
            </div>
          </div>
          <div className="border-x border-slate-700/60">
            <div className="text-lg font-black text-emerald-400">
              {profile?.stats?.mlaFundSpentCr ? `₹${profile.stats.mlaFundSpentCr} Cr` : '₹42 Cr'}
            </div>
            <div className="text-[10px] text-slate-300 font-medium">
              {lang === 'hi' ? 'विधायक निधि व्यय' : 'MLA Fund Spent'}
            </div>
          </div>
          <div>
            <div className="text-lg font-black text-sky-400">
              {profile?.stats?.resolutionRate ? `${profile.stats.resolutionRate}%` : '94%'}
            </div>
            <div className="text-[10px] text-slate-300 font-medium">
              {lang === 'hi' ? 'समस्या निवारण दर' : 'Resolved Rate'}
            </div>
          </div>
        </div>
      </div>

      {/* 2. 3-in-1 AI Civic Agent Platform Card */}
      <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900">
                {lang === 'hi' ? 'डिजिटल जन संवाद एवं AI सहायक' : 'Digital Civic Connect & AI Assistant'}
              </h3>
              <p className="text-[10px] text-slate-500">
                3-in-1 AI Civic Citizen Connect • निक्का सेवा डेस्क
              </p>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold border border-emerald-300 flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-pulse"></span> 
            24x7 सक्रिय
          </span>
        </div>

        <div className="space-y-3">
          {/* 1. WhatsApp AI Agent */}
          <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-200">
            <div className="flex justify-between items-start mb-1.5">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                <span className="text-xs font-bold text-slate-900">
                  {lang === 'hi' ? 'व्हाट्सएप AI एजेंट (WhatsApp Agent)' : 'WhatsApp AI Agent'}
                </span>
              </div>
              <span className="text-[9px] bg-emerald-200 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                ऑटो टोकन
              </span>
            </div>
            <p className="text-[11px] text-slate-600 mb-2 leading-relaxed">
              {lang === 'hi' 
                ? 'समस्या, सुझाव या राशन/योजना प्रमाण स्थिति सीधे व्हाट्सएप चैटबॉट पर दर्ज करें।'
                : 'Log grievance, suggestions or ration status directly on WhatsApp civic bot.'}
            </p>
            <button 
              onClick={onOpenWhatsAppAgent}
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              {lang === 'hi' ? 'व्हाट्सएप चैट शुरू करें (Start Chat)' : 'Start WhatsApp AI Chat'}
            </button>
          </div>

          {/* 2. Voice AI Calling Desk */}
          <div className="p-3 bg-orange-50/70 rounded-xl border border-orange-200">
            <div className="flex justify-between items-start mb-1.5">
              <div className="flex items-center gap-1.5">
                <PhoneCall className="w-3.5 h-3.5 text-orange-600" />
                <span className="text-xs font-bold text-slate-900">
                  {lang === 'hi' ? 'AI कॉलिंग डेस्क (Voice AI Calling Agent)' : 'Voice AI Calling Agent Desk'}
                </span>
              </div>
              <span className="text-[9px] bg-orange-200 text-orange-800 font-bold px-1.5 py-0.5 rounded">
                लाइव वॉयस
              </span>
            </div>
            <p className="text-[11px] text-slate-600 mb-2 leading-relaxed">
              {lang === 'hi' 
                ? 'अपनी भाषा व पहाड़ी/हिंदी बोली में सीधे बोलकर शिकायत दर्ज कराएं, तुरंत टोकन प्राप्त करें।'
                : 'Speak in Pahari/Hindi dialect directly to register grievance & receive token.'}
            </p>
            <button 
              onClick={onOpenVoiceDesk}
              className="w-full py-2 bg-[#102a43] hover:bg-[#0b1b2b] text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              {lang === 'hi' ? 'कॉल करें (Instant Voice AI Desk)' : 'Connect Voice AI Helpline'}
            </button>
          </div>

          {/* 3. SMS Messaging Assistant */}
          <div className="p-3 bg-sky-50/70 rounded-xl border border-sky-200">
            <div className="flex justify-between items-start mb-1.5">
              <div className="flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-sky-600" />
                <span className="text-xs font-bold text-slate-900">
                  {lang === 'hi' ? 'एसएमएस / मैसेजिंग एजेंट (SMS Assistant)' : 'SMS Messaging Assistant'}
                </span>
              </div>
              <span className="text-[9px] bg-sky-200 text-sky-800 font-bold px-1.5 py-0.5 rounded">
                बिना इंटरनेट
              </span>
            </div>
            <p className="text-[11px] text-slate-600 mb-2 leading-relaxed">
              {lang === 'hi' 
                ? 'साधारण कीपैड फोन से निःशुल्क एसएमएस भेजकर जन कल्याणकारी योजनाओं की जानकारी लें।'
                : 'Send free SMS from feature phones to receive scheme & ward updates.'}
            </p>
            <a 
              href="sms:56161?body=NIKKA%20HELP" 
              className="w-full py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              {lang === 'hi' ? 'मैसेज भेजें (Send SMS: NIKKA HELP)' : 'Send SMS (Offline)'}
            </a>
          </div>
        </div>
      </div>

      {/* 2b. Rural India Political & Civic Outreach Hub (All 6 Rural Capabilities) */}
      <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100/60 rounded-2xl p-4 border border-amber-300/80 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-amber-500 text-slate-950 rounded-lg font-black text-xs">
              ★
            </span>
            <div>
              <h3 className="text-xs font-black text-slate-950 uppercase tracking-wider">
                {lang === 'hi' ? 'ग्रामीण जनसेवा एवं बूथ प्रबंधन केंद्र' : 'Rural Civic & Booth Outreach Hub'}
              </h3>
              <p className="text-[10px] text-amber-900 font-medium">
                विधानसभा 142 नूरपुर • ऑफलाइन बूथ साथी • मतदाता पर्ची • संस्तुति पत्र
              </p>
            </div>
          </div>
          <span className="text-[10px] font-black bg-amber-200/90 text-amber-950 px-2 py-0.5 rounded-full border border-amber-400">
            ग्रामीण 6 विशेष सुविधाएं
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {/* Capability 1: Panna Pramukh Companion */}
          <button
            onClick={() => onSwitchTab('screen-panna-pramukh')}
            className="p-3 bg-white hover:bg-amber-100/50 rounded-xl border border-amber-200 text-left transition shadow-2xs group cursor-pointer"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="w-7 h-7 rounded-lg bg-slate-900 text-amber-400 flex items-center justify-center text-xs font-black">
                📴
              </span>
              <span className="text-[9px] bg-slate-100 text-slate-700 font-bold px-1.5 py-0.5 rounded">
                100% ऑफलाइन
              </span>
            </div>
            <div className="text-xs font-black text-slate-900 group-hover:text-amber-800">
              {lang === 'hi' ? 'पन्ना प्रमुख साथी' : 'Booth Companion'}
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">
              मतदान दर्ज व डोरस्टेप सर्वे
            </p>
          </button>

          {/* Capability 2: Digital Voter Slip */}
          <button
            onClick={onOpenVoterSlip}
            className="p-3 bg-white hover:bg-amber-100/50 rounded-xl border border-amber-200 text-left transition shadow-2xs group cursor-pointer"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="w-7 h-7 rounded-lg bg-sky-600 text-white flex items-center justify-center text-xs font-black">
                🪪
              </span>
              <span className="text-[9px] bg-sky-100 text-sky-800 font-bold px-1.5 py-0.5 rounded">
                व्हाट्सएप शेयर
              </span>
            </div>
            <div className="text-xs font-black text-slate-900 group-hover:text-sky-800">
              {lang === 'hi' ? 'डिजिटल मतदाता पर्ची' : 'Digital Voter Slip'}
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">
              क्रम सं. व बूथ मैप्स लिंक
            </p>
          </button>

          {/* Capability 3: Yojana Eligibility Engine */}
          <button
            onClick={onOpenYojanaModal}
            className="p-3 bg-white hover:bg-amber-100/50 rounded-xl border border-amber-200 text-left transition shadow-2xs group cursor-pointer"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-xs font-black">
                🌾
              </span>
              <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                60-सेकंड
              </span>
            </div>
            <div className="text-xs font-black text-slate-900 group-hover:text-emerald-800">
              {lang === 'hi' ? 'सरकारी योजना चेकर' : 'Sarkari Yojana'}
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">
              8+ हिमाचल योजनाएं व लाभ
            </p>
          </button>

          {/* Capability 4: One-Click MLA Letter */}
          <button
            onClick={onOpenMlaLetter}
            className="p-3 bg-white hover:bg-amber-100/50 rounded-xl border border-amber-200 text-left transition shadow-2xs group cursor-pointer"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="w-7 h-7 rounded-lg bg-amber-600 text-white flex items-center justify-center text-xs font-black">
                🏛️
              </span>
              <span className="text-[9px] bg-amber-100 text-amber-900 font-bold px-1.5 py-0.5 rounded">
                आधिकारिक
              </span>
            </div>
            <div className="text-xs font-black text-slate-900 group-hover:text-amber-800">
              {lang === 'hi' ? 'विधायक संस्तुति पत्र' : 'MLA Letterhead'}
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">
              प्राथमिकता डिस्पैच आदेश
            </p>
          </button>

          {/* Capability 5: Live Padyatra Beacon */}
          <button
            onClick={() => onSwitchTab('screen-padyatra-beacon')}
            className="p-3 bg-white hover:bg-amber-100/50 rounded-xl border border-amber-200 text-left transition shadow-2xs group cursor-pointer"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="w-7 h-7 rounded-lg bg-rose-600 text-white flex items-center justify-center text-xs font-black">
                📍
              </span>
              <span className="text-[9px] bg-rose-100 text-rose-800 font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-rose-600 rounded-full animate-ping"></span>
                लाइव जीपीएस
              </span>
            </div>
            <div className="text-xs font-black text-slate-900 group-hover:text-rose-800">
              {lang === 'hi' ? 'पदयात्रा लाइव बीकन' : 'Convoy GPS Radar'}
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">
              गांव-दर-गांव 2km अलर्ट
            </p>
          </button>

          {/* Quick Grievance Direct */}
          <button
            onClick={onOpenComplaintModal}
            className="p-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-left transition shadow-xs group cursor-pointer"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="w-7 h-7 rounded-lg bg-white/20 text-white flex items-center justify-center text-xs font-black">
                ⚡
              </span>
              <span className="text-[9px] bg-white/20 text-white font-bold px-1.5 py-0.5 rounded">
                24x7
              </span>
            </div>
            <div className="text-xs font-black text-white">
              {lang === 'hi' ? 'जनसमस्या निवारण' : 'Lodge Grievance'}
            </div>
            <p className="text-[10px] text-red-100 mt-0.5">
              कैंप ऑफिस को सीधी शिकायत
            </p>
          </button>
        </div>
      </div>

      {/* 3. Quick 4 Action Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Lodge complaint */}
        <button 
          onClick={onOpenComplaintModal} 
          className="p-3 bg-red-50 hover:bg-red-100 rounded-xl border border-red-200 text-left transition shadow-xs group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="p-1.5 bg-red-600 text-white rounded-lg text-xs">
              <AlertTriangle className="w-3.5 h-3.5" />
            </span>
            <span className="text-[9px] bg-red-200 text-red-800 font-bold px-1.5 py-0.5 rounded">
              फास्ट ट्रैक
            </span>
          </div>
          <div className="text-xs font-extrabold text-slate-900">
            {lang === 'hi' ? 'समस्या दर्ज करें' : 'Lodge Grievance'}
          </div>
          <div className="text-[10px] text-slate-500">
            {lang === 'hi' ? 'विधायक कार्यालय को सीधी शिकायत' : 'Direct to MLA Office'}
          </div>
        </button>

        {/* Padyatra route */}
        <div 
          onClick={() => {
            const el = document.getElementById('padyatra-schedule');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="p-3 bg-amber-50 hover:bg-amber-100 rounded-xl border border-amber-200 text-left transition shadow-xs cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="p-1.5 bg-amber-600 text-white rounded-lg text-xs">
              <Route className="w-3.5 h-3.5" />
            </span>
            <span className="text-[9px] bg-amber-200 text-amber-800 font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-amber-600 rounded-full animate-ping"></span>
              लाइव
            </span>
          </div>
          <div className="text-xs font-extrabold text-slate-900">
            {lang === 'hi' ? 'आज की पदयात्रा' : 'Today\'s Padyatra'}
          </div>
          <div className="text-[10px] text-slate-500">
            {lang === 'hi' ? 'वार्ड 14 • 04:30 PM' : 'Ward 14 • 04:30 PM'}
          </div>
        </div>

        {/* Work Map / Hisaab */}
        <button 
          onClick={() => onSwitchTab('screen-hisaab')} 
          className="p-3 bg-blue-50 hover:bg-blue-100 rounded-xl border border-blue-200 text-left transition shadow-xs"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="p-1.5 bg-blue-600 text-white rounded-lg text-xs">
              <Map className="w-3.5 h-3.5" />
            </span>
            <span className="text-[10px] text-blue-600 font-bold">142+</span>
          </div>
          <div className="text-xs font-extrabold text-slate-900">
            {lang === 'hi' ? 'विकास कार्य नक्शा' : 'Development Works'}
          </div>
          <div className="text-[10px] text-slate-500">
            {lang === 'hi' ? 'वार्ड 1 से 24 रिपोर्ट कार्ड' : 'Ward 1 to 24 Report Card'}
          </div>
        </button>

        {/* WhatsApp Citizen Group */}
        <a 
          href="https://chat.whatsapp.com/" 
          target="_blank" 
          rel="noreferrer"
          className="p-3 bg-emerald-50 hover:bg-emerald-100 rounded-xl border border-emerald-200 text-left transition shadow-xs block"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="p-1.5 bg-emerald-600 text-white rounded-lg text-xs">
              <Users className="w-3.5 h-3.5" />
            </span>
            <span className="text-[9px] bg-emerald-200 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
              2.4k+
            </span>
          </div>
          <div className="text-xs font-extrabold text-slate-900">
            {lang === 'hi' ? 'नागरिक व्हाट्सएप ग्रुप' : 'Civic WhatsApp Group'}
          </div>
          <div className="text-[10px] text-slate-500">
            {lang === 'hi' ? 'नूरपुर परिवार से जुड़ें' : 'Join Nurpur Pariwar'}
          </div>
        </a>
      </div>

      {/* 4. Live Updates Feed Card */}
      <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-1 bg-amber-500 rounded-full"></span>
            <h3 className="text-xs font-extrabold text-slate-900">
              {lang === 'hi' ? 'ताज़ा हलचल • Live Updates' : 'Constituency Live Updates'}
            </h3>
          </div>
          <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span> 
            Just now
          </span>
        </div>

        {facebookFeed.length > 0 ? (
          <div className="border border-slate-200 rounded-xl overflow-hidden mb-3">
            {facebookFeed[0].media_url && (
              <img 
                src={facebookFeed[0].media_url} 
                alt="Ground Work" 
                className="w-full h-44 object-cover object-top" 
              />
            )}
            <div className="p-3 bg-white">
              <div className="flex items-center justify-between text-[11px] mb-1.5">
                <span className="font-bold text-slate-900 flex items-center gap-1">
                  <Hospital className="w-3.5 h-3.5 text-emerald-600" />
                  {lang === 'hi' ? 'आधिकारिक अपडेट • फेसबुक लाइव' : 'Official Update • Facebook Live'}
                </span>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                  {lang === 'hi' ? 'प्रमाणित' : 'Verified'}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed mb-2">
                {lang === 'hi' ? facebookFeed[0].content_hi : (facebookFeed[0].content_en || facebookFeed[0].content_hi)}
              </p>
              <div className="flex items-center justify-between text-[10px] text-slate-500 pt-2 border-t border-slate-100">
                <span>👍 {facebookFeed[0].likes_count || 342} लाइक्स • 🔄 {facebookFeed[0].shares_count || 89} शेयर्स</span>
                <a 
                  href={facebookFeed[0].permalink || 'https://www.facebook.com/ranbirsinghnikka'} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 font-bold hover:underline"
                >
                  फेसबुक पर देखें →
                </a>
              </div>
            </div>
          </div>
        ) : (
          <div className="border border-slate-200 rounded-xl overflow-hidden mb-3">
            <img 
              src={profile?.photoUrl || MLA_INFO.photoUrl} 
              alt="Ground Work" 
              className="w-full h-44 object-cover object-top" 
            />
            <div className="p-3 bg-white">
              <div className="flex items-center justify-between text-[11px] mb-1.5">
                <span className="font-bold text-slate-900 flex items-center gap-1">
                  <Hospital className="w-3.5 h-3.5 text-emerald-600" />
                  {lang === 'hi' ? 'स्वास्थ्य क्रांति • पीएचसी लोकार्पण' : 'Healthcare Revolution • New PHC Dedication'}
                </span>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                  पूर्ण
                </span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed mb-2">
                {lang === 'hi' 
                  ? 'वार्ड ८ वासियों का दशकों पुराना इंतज़ार समाप्त! 24x7 आपातकालीन सेवा, पैथोलॉजी लैब व नव-निर्मित मातृत्व विंग जनता को समर्पित।'
                  : 'Decades of wait ends for Ward 8 residents! 24x7 emergency care, pathology lab and modern maternity wing dedicated.'}
              </p>
              <div className="flex items-center justify-between text-[10px] text-slate-500 pt-2 border-t border-slate-100">
                <span>लागत: ₹1.45 Cr (MLA-LAD)</span>
                <span>लाभ: 18,000+ नागरिक</span>
              </div>
            </div>
          </div>
        )}

        <button 
          onClick={shareUpdateToWhatsApp}
          className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition shadow-xs"
        >
          <Share2 className="w-3.5 h-3.5" />
          {lang === 'hi' ? 'व्हाट्सएप पर शेयर करें (Share to WhatsApp)' : 'Forward on WhatsApp'}
        </button>
      </div>

      {/* 5. Daily Padyatra Itinerary Schedule */}
      <div id="padyatra-schedule" className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            {lang === 'hi' ? 'दैनिक जनसंपर्क एवं पदयात्रा' : 'Daily Padyatra & Public Meetings'}
          </h3>
          <span className="text-[10px] font-bold text-slate-500">
            {lang === 'hi' ? 'आज का कार्यक्रम' : 'Today\'s Schedule'}
          </span>
        </div>

        <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
          {padyatraStops.map((stop, index) => {
            if (stop.status === 'completed') {
              return (
                <div key={index} className="relative">
                  <span className="absolute -left-6 top-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"></span>
                  <div className="text-[11px] font-bold text-slate-900">
                    {stop.time} • {lang === 'hi' ? stop.title : stop.titleEn}
                  </div>
                  <p className="text-[10px] text-slate-500">
                    {lang === 'hi' ? stop.description : stop.descriptionEn} • {lang === 'hi' ? 'सम्पन्न ✓' : 'Completed ✓'}
                  </p>
                </div>
              );
            }

            if (stop.status === 'current') {
              return (
                <div key={index} className="relative bg-amber-50/70 p-2.5 rounded-xl border border-amber-200 -ml-2">
                  <span className="absolute -left-4 top-3.5 w-3 h-3 bg-amber-500 rounded-full border-2 border-white animate-pulse"></span>
                  <div className="flex justify-between items-center text-[11px] font-extrabold text-amber-900">
                    <span>{stop.time} • {lang === 'hi' ? stop.title : stop.titleEn}</span>
                    <span className="text-[9px] bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded font-black flex items-center gap-1">
                      <span className="w-1 h-1 bg-amber-700 rounded-full animate-ping"></span>
                      {lang === 'hi' ? 'वर्तमान' : 'NOW LIVE'}
                    </span>
                  </div>
                  <p className="text-[11px] font-bold text-slate-800 mt-0.5">
                    {lang === 'hi' ? stop.location : stop.locationEn}
                  </p>
                  <p className="text-[10px] text-slate-600">
                    {lang === 'hi' ? stop.description : stop.descriptionEn}
                  </p>
                  <div className="mt-1 text-[9px] text-amber-800 font-bold">
                    👥 {stop.attendeesCount}
                  </div>
                </div>
              );
            }

            return (
              <div key={index} className="relative">
                <span className="absolute -left-6 top-1 w-3 h-3 bg-slate-300 rounded-full border-2 border-white"></span>
                <div className="text-[11px] font-bold text-slate-700">
                  {stop.time} • {lang === 'hi' ? stop.title : stop.titleEn}
                </div>
                <p className="text-[10px] text-slate-500">
                  {lang === 'hi' ? stop.location : stop.locationEn}
                </p>
                <p className="text-[9px] text-slate-400">
                  {lang === 'hi' ? stop.description : stop.descriptionEn}
                </p>
              </div>
            );
          })}
        </div>
      </div>

    </section>
  );
};
