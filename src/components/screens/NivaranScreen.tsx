import React, { useState } from 'react';
import { 
  PlusCircle, 
  Copy, 
  Check, 
  Search, 
  PhoneCall, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Radio, 
  MapPin, 
  BellRing,
  HelpCircle
} from 'lucide-react';
import { INITIAL_GRIEVANCES } from '../../data/campaignData';
import { GrievanceTicket, Language } from '../../types/campaign';

interface NivaranScreenProps {
  onOpenComplaintModal: () => void;
  grievances: GrievanceTicket[];
  lang: Language;
}

export const NivaranScreen: React.FC<NivaranScreenProps> = ({
  onOpenComplaintModal,
  grievances,
  lang
}) => {
  const [searchToken, setSearchToken] = useState('');
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [subscribedTickets, setSubscribedTickets] = useState<Record<string, boolean>>({
    '#NR-8831': true,
    '#NR-8712': true
  });

  const allTickets = grievances.length > 0 ? grievances : INITIAL_GRIEVANCES;

  const currentDisplayTicket = searchToken.trim() 
    ? allTickets.find(t => t.token.toLowerCase().includes(searchToken.toLowerCase().trim())) || allTickets[0]
    : allTickets[0];

  const handleCopy = (token: string) => {
    navigator.clipboard?.writeText(token);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 2500);
  };

  const toggleWhatsAppSub = (token: string) => {
    setSubscribedTickets(prev => ({
      ...prev,
      [token]: !prev[token]
    }));
  };

  return (
    <section className="p-4 space-y-4">
      
      {/* 1. Live Janta Darbar Metrics */}
      <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            {lang === 'hi' ? 'लाइव जनता दरबार मैट्रिक्स' : 'Live Grievance Redressal Matrix'}
          </span>
          <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
            {lang === 'hi' ? 'अपडेट: 10 मिनट पूर्व' : 'Updated 10m ago'}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-100">
            <div className="text-base font-extrabold text-emerald-700">1,840</div>
            <div className="text-[10px] text-emerald-800 font-semibold">
              {lang === 'hi' ? 'निस्तारित' : 'Resolved'}
            </div>
          </div>
          <div className="bg-amber-50 p-2.5 rounded-xl border border-amber-100">
            <div className="text-base font-extrabold text-amber-700">112</div>
            <div className="text-[10px] text-amber-800 font-semibold">
              {lang === 'hi' ? 'प्रक्रिया में' : 'In Progress'}
            </div>
          </div>
          <div className="bg-sky-50 p-2.5 rounded-xl border border-sky-100">
            <div className="text-base font-extrabold text-sky-700">48 घंटे</div>
            <div className="text-[10px] text-sky-800 font-semibold">
              {lang === 'hi' ? 'औसत समय' : 'Avg Turnaround'}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Lodge New Complaint Banner */}
      <div className="bg-gradient-to-br from-[#102a43] to-[#1c3d5a] text-white rounded-2xl p-4 shadow-md">
        <div className="flex items-center gap-2 text-xs font-bold text-amber-400 mb-1">
          <span className="w-2 h-2 bg-amber-400 rounded-full animate-ping"></span>
          {lang === 'hi' ? 'जन समस्या निवारण • प्रत्यक्ष पंजीकरण' : 'Civic Grievance Desk • Instant Registration'}
        </div>
        <h3 className="text-sm font-extrabold mb-1">
          {lang === 'hi' ? 'नई शिकायत सीधे दर्ज करें' : 'Lodge New Civic Complaint Directly'}
        </h3>
        <p className="text-xs text-slate-300 mb-3 leading-relaxed">
          {lang === 'hi' 
            ? 'सड़क, बिजली, पानी या स्वास्थ्य की समस्या फोटो सहित विधायक कैंप ऑफिस भेजें।'
            : 'Submit photo, location and details directly to MLA camp office desk.'}
        </p>
        
        <button 
          onClick={onOpenComplaintModal}
          className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md transition active:scale-98"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{lang === 'hi' ? 'समस्या दर्ज करें • फोटो व विवरण अपलोड करें' : 'File Complaint • Attach Photo & Details'}</span>
        </button>
      </div>

      {/* 3. Search / Track Ticket */}
      <div className="bg-white rounded-2xl p-3 border border-slate-200 shadow-xs flex items-center gap-2">
        <Search className="w-4 h-4 text-slate-400 shrink-0" />
        <input 
          type="text"
          value={searchToken}
          onChange={(e) => setSearchToken(e.target.value)}
          placeholder={lang === 'hi' ? 'टोकन सं. से स्थिति खोजें (उदा: #NR-8831)...' : 'Search by token (e.g. #NR-8831)...'}
          className="w-full text-xs bg-transparent focus:outline-none text-slate-800 placeholder-slate-400 font-mono"
        />
        {searchToken && (
          <button onClick={() => setSearchToken('')} className="text-slate-400 hover:text-slate-600 text-xs px-1">
            ✕
          </button>
        )}
      </div>

      {/* 4. Active Ticket Details & Timeline */}
      {currentDisplayTicket && (
        <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-mono bg-slate-100 text-slate-800 px-2.5 py-0.5 rounded font-extrabold border border-slate-200">
                {currentDisplayTicket.token}
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                currentDisplayTicket.status === 'resolved' 
                  ? 'bg-emerald-100 text-emerald-800' 
                  : 'bg-amber-100 text-amber-800'
              }`}>
                {currentDisplayTicket.status === 'resolved' 
                  ? (lang === 'hi' ? 'निस्तारित ✓' : 'Resolved') 
                  : (lang === 'hi' ? 'प्रक्रिया में' : 'In Progress')}
              </span>
            </div>

            <button 
              onClick={() => handleCopy(currentDisplayTicket.token)}
              className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 px-2 py-1 rounded-lg border border-slate-200 transition"
              title="Copy Token"
            >
              {copiedToken === currentDisplayTicket.token ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-bold">{lang === 'hi' ? 'कॉपी हुआ' : 'Copied'}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>{lang === 'hi' ? 'कॉपी' : 'Copy'}</span>
                </>
              )}
            </button>
          </div>

          <h4 className="text-xs font-extrabold text-slate-900 leading-snug">
            {currentDisplayTicket.title}
          </h4>
          <p className="text-[11px] text-slate-500 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-slate-400" />
            {currentDisplayTicket.location}
          </p>

          {/* Stepped Timeline */}
          <div className="relative pl-6 space-y-3.5 text-xs before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-emerald-500">
            {currentDisplayTicket.timeline.map((step, idx) => {
              if (step.status === 'done') {
                return (
                  <div key={idx} className="relative">
                    <span className="absolute -left-6 top-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"></span>
                    <div className="font-bold text-slate-800 text-[11px]">{step.title}</div>
                    <p className="text-[10px] text-slate-500">
                      {step.timestamp} • {step.description}
                    </p>
                  </div>
                );
              }

              if (step.status === 'current') {
                return (
                  <div key={idx} className="relative bg-amber-50/70 p-2.5 rounded-xl border border-amber-200 -ml-2">
                    <span className="absolute -left-4 top-3.5 w-3 h-3 bg-amber-500 rounded-full border-2 border-white animate-pulse"></span>
                    <div className="font-bold text-amber-900 text-[11px] flex justify-between">
                      <span>{step.title}</span>
                      <span className="text-[9px] bg-amber-200 text-amber-900 px-1 rounded font-black">सक्रिय</span>
                    </div>
                    <p className="text-[10px] text-slate-600 mt-0.5">
                      {step.timestamp} • {step.description}
                    </p>
                  </div>
                );
              }

              return (
                <div key={idx} className="relative">
                  <span className="absolute -left-6 top-1 w-3 h-3 bg-slate-300 rounded-full border-2 border-white"></span>
                  <div className="font-bold text-slate-500 text-[11px]">{step.title}</div>
                  <p className="text-[10px] text-slate-400">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* WhatsApp Alert Subscription Box */}
          <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between text-xs">
            <span className="text-emerald-800 font-bold text-[11px] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              {lang === 'hi' ? 'व्हाट्सएप लाइव अपडेट्स सक्रिय' : 'WhatsApp Live Alerts Active'}
            </span>
            <button
              onClick={() => toggleWhatsAppSub(currentDisplayTicket.token)}
              className={`text-[10px] px-2.5 py-1 rounded font-bold transition ${
                subscribedTickets[currentDisplayTicket.token]
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
            >
              {subscribedTickets[currentDisplayTicket.token] ? 'Subscribed ✓' : 'Subscribe'}
            </button>
          </div>
        </div>
      )}

      {/* 5. Emergency Helplines */}
      <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200">
        <h4 className="text-xs font-extrabold text-slate-900 mb-3 flex items-center gap-1.5">
          <PhoneCall className="w-3.5 h-3.5 text-amber-500" />
          {lang === 'hi' ? 'हेल्पलाइन व कैंप कार्यालय संपर्क' : 'Camp Office Helplines & Emergency'}
        </h4>
        <div className="space-y-2 text-xs">
          <a 
            href="tel:01893222111" 
            className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition"
          >
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-700">
                <PhoneCall className="w-3.5 h-3.5" />
              </span>
              <span className="font-bold text-slate-800">
                {lang === 'hi' ? 'विधायक कैंप ऑफिस हेल्पलाइन' : 'MLA Camp Office Helpline'}
              </span>
            </div>
            <span className="text-[11px] text-indigo-700 font-bold font-mono">01893-222111</span>
          </a>

          <a 
            href="tel:1077" 
            className="flex items-center justify-between p-2.5 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 transition"
          >
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-red-100 text-red-700">
                <AlertCircle className="w-3.5 h-3.5" />
              </span>
              <span className="font-bold text-red-900">
                {lang === 'hi' ? 'आपदा एवं बाढ़ नियंत्रण कक्ष (24x7)' : 'Disaster & Emergency Control'}
              </span>
            </div>
            <span className="text-[11px] text-red-700 font-bold font-mono">टोल फ्री 1077</span>
          </a>

          <a 
            href="tel:1912" 
            className="flex items-center justify-between p-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 transition"
          >
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-amber-100 text-amber-700">
                <Radio className="w-3.5 h-3.5" />
              </span>
              <span className="font-bold text-amber-900">
                {lang === 'hi' ? 'विद्युत आपातकालीन शिकायत बोर्ड' : 'HPSEB Power Breakdown'}
              </span>
            </div>
            <span className="text-[11px] text-amber-700 font-bold font-mono">1912</span>
          </a>
        </div>
      </div>

    </section>
  );
};
