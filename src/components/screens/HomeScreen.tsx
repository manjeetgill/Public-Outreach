import React from 'react';
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
  ExternalLink,
  Radio,
  Hospital
} from 'lucide-react';
import { MLA_INFO, INITIAL_PADYATRA } from '../../data/campaignData';
import { ScreenTab, Language } from '../../types/campaign';
import { DailyJanvaniPlayer } from '../audio/DailyJanvaniPlayer';

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
  const shareUpdateToWhatsApp = () => {
    const text = `*नूरपुर विकास समाचार • रणबीर सिंह निक्का*\n\nवार्ड ८ प्राथमिक स्वास्थ्य केंद्र (PHC) का भव्य लोकार्पण!\n• लागत: ₹1.45 करोड़ (MLA-LAD)\n• लाभ: 18,000+ नागरिक\n• 24x7 आपातकालीन सेवा एवं मातृत्व विंग समर्पित।\n\nजनसेवक रणबीर सिंह निक्का - घर-घर निक्का, हर घर निक्का।`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <section className="p-4 space-y-4">
      {/* 0. Community Audio Bulletin: 60-Second Daily Voice Capsule */}
      <DailyJanvaniPlayer lang={lang} />

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
              src={MLA_INFO.photoUrl} 
              alt={MLA_INFO.name} 
              className="w-16 h-16 rounded-xl object-cover border-2 border-amber-400 shadow-md" 
            />
            <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-slate-900 flex items-center justify-center text-[9px] text-white font-bold">
              ✓
            </span>
          </div>
          <div>
            <h2 className="text-base font-extrabold text-white">
              {lang === 'hi' ? MLA_INFO.name : MLA_INFO.nameEn}
            </h2>
            <span className="inline-block bg-amber-500/20 text-amber-300 text-[11px] font-bold px-2 py-0.5 rounded border border-amber-500/40 mt-0.5">
              {lang === 'hi' ? MLA_INFO.slogan : MLA_INFO.sloganEn}
            </span>
            <p className="text-[11px] text-slate-300 mt-1">
              {lang === 'hi' ? MLA_INFO.title : MLA_INFO.titleEn} • {lang === 'hi' ? 'नूरपुर' : 'Nurpur'}
            </p>
          </div>
        </div>

        {/* Ribbon */}
        <div className="bg-white/10 rounded-xl p-2.5 mb-3 backdrop-blur-xs border border-white/10 flex items-center gap-2 text-xs">
          <Ribbon className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="text-slate-200">
            {lang === 'hi' ? MLA_INFO.tenure : MLA_INFO.tenureEn}
          </span>
        </div>

        {/* Quick Stats Bar */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-700/60 text-center">
          <div>
            <div className="text-lg font-black text-amber-400">148+</div>
            <div className="text-[10px] text-slate-300 font-medium">
              {lang === 'hi' ? 'विकास कार्य पूर्ण' : 'Projects Done'}
            </div>
          </div>
          <div className="border-x border-slate-700/60">
            <div className="text-lg font-black text-emerald-400">₹42 Cr</div>
            <div className="text-[10px] text-slate-300 font-medium">
              {lang === 'hi' ? 'विधायक निधि व्यय' : 'MLA Fund Spent'}
            </div>
          </div>
          <div>
            <div className="text-lg font-black text-sky-400">94%</div>
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

        <div className="border border-slate-200 rounded-xl overflow-hidden mb-3">
          <img 
            src={MLA_INFO.photoUrl} 
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
          {INITIAL_PADYATRA.map((stop, index) => {
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
