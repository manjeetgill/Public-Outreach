import React, { useState } from 'react';
import { 
  AlertCircle, 
  Bot, 
  Calendar, 
  FileText, 
  Users, 
  Play, 
  ArrowRight, 
  ChevronRight,
  Droplet,
  HeartPulse,
  GraduationCap,
  Briefcase,
  Layers,
  MapPin,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { ScreenTab, Language } from '../../types/campaign';
import { LATEST_UPDATES_MOCK } from '../../data/campaignData';
import { AIJanSahayakWidget } from '../ai/AIJanSahayakWidget';

interface HeroDashboardProps {
  onSelectTab: (tab: ScreenTab) => void;
  lang: Language;
  onOpenReportModal: () => void;
  onOpenVideoModal: () => void;
  onOpenAboutModal: () => void;
}

export const HeroDashboard: React.FC<HeroDashboardProps> = ({
  onSelectTab,
  lang,
  onOpenReportModal,
  onOpenVideoModal,
  onOpenAboutModal
}) => {
  const [selectedFocus, setSelectedFocus] = useState<string>('roads');

  const focusAreas = [
    { id: 'roads', name: 'Roads', nameHi: 'सड़कें', icon: '🛣️', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    { id: 'water', name: 'Water Supply', nameHi: 'जल आपूर्ति', icon: '💧', color: 'bg-sky-50 text-sky-700 border-sky-200' },
    { id: 'health', name: 'Healthcare', nameHi: 'स्वास्थ्य सेवाएं', icon: '➕', color: 'bg-rose-50 text-rose-700 border-rose-200' },
    { id: 'education', name: 'Education', nameHi: 'शिक्षा', icon: '📄', color: 'bg-blue-50 text-blue-700 border-blue-200' },
    { id: 'employment', name: 'Employment', nameHi: 'रोजगार', icon: '💼', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
    { id: 'women_youth', name: 'Women & Youth', nameHi: 'महिला एवं युवा', icon: '👥', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Main Grid: Left Hero Card + Right Controls & Stat Cards + Right Chat Widget */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        
        {/* ============================================================== */}
        {/* 1. HERO BANNER CARD (Col 1 to Col 5) */}
        {/* ============================================================== */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#cde2ff] via-[#dcedff] to-[#f0f6ff] rounded-3xl border border-blue-200/80 shadow-md p-6 sm:p-7 flex flex-col justify-between relative overflow-hidden">
          
          {/* Decorative mountain landscape watermark in background */}
          <div className="absolute -right-10 -bottom-10 opacity-20 pointer-events-none w-72 h-72">
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <path fill="#0066cc" d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-45.8C87.4,-32.6,90,-16.3,88.5,-0.9C87,14.6,81.4,29.1,73.4,42.2C65.4,55.3,55.1,66.9,42.2,74.7C29.3,82.5,14.6,86.5,-0.6,87.5C-15.8,88.5,-31.6,86.5,-45.2,79.2C-58.8,71.9,-70.2,59.3,-78.3,45.2C-86.4,31.1,-91.2,15.6,-90.6,0.3C-90,-14.9,-84,-29.8,-75.2,-42.6C-66.4,-55.4,-54.8,-66.1,-41.4,-73.7C-28,-81.3,-14,-85.8,0.7,-87C15.4,-88.2,30.7,-83.6,44.7,-76.4Z" transform="translate(100 100)" />
            </svg>
          </div>

          <div>
            {/* Quote in Hindi matching mockup */}
            <div className="relative mb-3">
              <span className="text-3xl text-blue-400 font-serif absolute -left-4 -top-2">“</span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#102a43] leading-tight tracking-tight pl-2">
                आपकी आवाज़,
                <br />
                हमारी जिम्मेदारी
              </h2>
              <span className="text-2xl text-blue-400 font-serif">”</span>
            </div>

            <p className="text-xs sm:text-sm font-medium text-slate-700 leading-relaxed mb-6">
              एक मजबूत, विकसित और समावेशी नूरपुर के लिए साथ मिलकर आगे बढ़ें।
            </p>

            {/* Photo + Details + Signature Row */}
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shadow-lg border-2 border-white bg-slate-200 shrink-0">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDgnPad_M4eB_fy1Ehj3vnwKyrhb20mnByuc8sRcNz8GMcF0SsnonhWyrBYpIjiAvbekdpshkQyg84ieICet6mc5gZraFsrvege6p4Hud8HFcOIFBLhwiN-F0QGuDIwvpmObjsjWWCGBZtCfTfJx-XY9mV_j8J-DrSPrVyX6iJb5g5g09zw0uI3EOtrHdBo0rqA_lFzlqQem_wQL1_RIMmvS8WpDUo4w5OL9Zit1SKponYTJW4iP1Oa"
                  alt="Ranbir Singh Nikka"
                  className="w-full h-full object-cover object-top"
                />
              </div>

              <div>
                <h3 className="text-lg font-black text-[#102a43] leading-tight">
                  Ranbir Singh Nikka
                </h3>
                <p className="text-xs font-semibold text-slate-600">
                  MLA, Nurpur (Himachal Pradesh)
                </p>
                {/* Styled Signature flourish */}
                <div className="mt-1.5 italic font-serif text-slate-800 text-lg opacity-85 select-none tracking-widest">
                  RanbirS.Nikka
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons: Know More & Watch Video */}
          <div className="flex items-center space-x-3 pt-2">
            <button
              onClick={onOpenAboutModal}
              className="bg-[#0066cc] hover:bg-blue-700 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-md transition active:scale-95"
            >
              Know More
            </button>
            <button
              onClick={onOpenVideoModal}
              className="bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-xs transition active:scale-95 flex items-center space-x-2"
            >
              <Play className="w-4 h-4 fill-slate-800 text-slate-800" />
              <span>Watch Video</span>
            </button>
          </div>
        </div>

        {/* ============================================================== */}
        {/* 2. CENTER SECTION: ACTION CARDS + STATS + FOCUS AREAS (Col 6 to 9) */}
        {/* ============================================================== */}
        <div className="lg:col-span-4 space-y-4 flex flex-col justify-between">
          
          {/* Top 5 Quick Action Cards with Round Icons */}
          <div className="grid grid-cols-5 gap-2">
            
            {/* Card 1: Report an Issue */}
            <div 
              onClick={onOpenReportModal}
              className="bg-white border border-slate-200/80 rounded-2xl p-2.5 text-center shadow-xs hover:border-red-400 hover:shadow-md transition cursor-pointer flex flex-col items-center justify-between"
            >
              <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center mb-1">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div className="text-[11px] font-bold text-slate-800 leading-tight">
                Report an Issue
              </div>
              <div className="text-[9px] text-slate-400 mt-0.5">सहायता अनुरोध</div>
            </div>

            {/* Card 2: AI Assistant */}
            <div 
              onClick={() => onSelectTab('screen-ai')}
              className="bg-white border border-slate-200/80 rounded-2xl p-2.5 text-center shadow-xs hover:border-blue-400 hover:shadow-md transition cursor-pointer flex flex-col items-center justify-between"
            >
              <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center mb-1">
                <Bot className="w-5 h-5" />
              </div>
              <div className="text-[11px] font-bold text-slate-800 leading-tight">
                AI Assistant
              </div>
              <div className="text-[9px] text-slate-400 mt-0.5">पूछिए कुछ भी</div>
            </div>

            {/* Card 3: Upcoming Events */}
            <div 
              onClick={() => onSelectTab('screen-events')}
              className="bg-white border border-slate-200/80 rounded-2xl p-2.5 text-center shadow-xs hover:border-emerald-400 hover:shadow-md transition cursor-pointer flex flex-col items-center justify-between"
            >
              <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mb-1">
                <Calendar className="w-5 h-5" />
              </div>
              <div className="text-[11px] font-bold text-slate-800 leading-tight">
                Upcoming Events
              </div>
              <div className="text-[9px] text-slate-400 mt-0.5">आगामी कार्यक्रम</div>
            </div>

            {/* Card 4: Track Your Request */}
            <div 
              onClick={() => onSelectTab('screen-citizen-dashboard')}
              className="bg-white border border-slate-200/80 rounded-2xl p-2.5 text-center shadow-xs hover:border-amber-400 hover:shadow-md transition cursor-pointer flex flex-col items-center justify-between"
            >
              <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mb-1">
                <FileText className="w-5 h-5" />
              </div>
              <div className="text-[11px] font-bold text-slate-800 leading-tight">
                Track Request
              </div>
              <div className="text-[9px] text-slate-400 mt-0.5">स्थिति देखें</div>
            </div>

            {/* Card 5: Voter Information */}
            <div 
              onClick={() => onSelectTab('screen-voter')}
              className="bg-white border border-slate-200/80 rounded-2xl p-2.5 text-center shadow-xs hover:border-purple-400 hover:shadow-md transition cursor-pointer flex flex-col items-center justify-between"
            >
              <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 border border-purple-200 flex items-center justify-center mb-1">
                <Users className="w-5 h-5" />
              </div>
              <div className="text-[11px] font-bold text-slate-800 leading-tight">
                Voter Info
              </div>
              <div className="text-[9px] text-slate-400 mt-0.5">मतदाता जानकारी</div>
            </div>

          </div>

          {/* 4 Stat Counter Boxes matching mockup */}
          <div className="grid grid-cols-4 gap-2">
            <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-2.5 text-center shadow-2xs">
              <div className="text-xl font-extrabold text-[#0066cc]">1,248</div>
              <div className="text-[10px] text-slate-600 font-medium">Citizen Requests</div>
            </div>
            <div className="bg-emerald-50/70 border border-emerald-100 rounded-xl p-2.5 text-center shadow-2xs">
              <div className="text-xl font-extrabold text-emerald-600">742</div>
              <div className="text-[10px] text-slate-600 font-medium">Resolved</div>
            </div>
            <div className="bg-amber-50/70 border border-amber-100 rounded-xl p-2.5 text-center shadow-2xs">
              <div className="text-xl font-extrabold text-amber-600">506</div>
              <div className="text-[10px] text-slate-600 font-medium">In Progress</div>
            </div>
            <div className="bg-purple-50/70 border border-purple-100 rounded-xl p-2.5 text-center shadow-2xs">
              <div className="text-xl font-extrabold text-purple-600">21</div>
              <div className="text-[10px] text-slate-600 font-medium">Upcoming Events</div>
            </div>
          </div>

          {/* Key Focus Areas (6 round icon buttons) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
            <div className="text-xs font-bold text-slate-800 mb-2.5">
              Key Focus Areas
            </div>
            <div className="grid grid-cols-6 gap-2 text-center">
              {focusAreas.map((fa) => (
                <button
                  key={fa.id}
                  onClick={() => setSelectedFocus(fa.id)}
                  className={`flex flex-col items-center justify-between p-1.5 rounded-xl transition ${
                    selectedFocus === fa.id
                      ? 'bg-blue-50/80 ring-2 ring-blue-500 scale-105'
                      : 'hover:bg-slate-50'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm border shadow-2xs ${fa.color}`}>
                    {fa.icon}
                  </div>
                  <span className="text-[10px] font-bold text-slate-800 mt-1 leading-tight">{fa.name}</span>
                  <span className="text-[8px] text-slate-400">{fa.nameHi}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Latest Updates preview list */}
          <div className="bg-white rounded-2xl border border-slate-200 p-3.5 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold text-slate-800">Latest Updates</h4>
              <button 
                onClick={() => onSelectTab('screen-events')}
                className="text-[11px] font-semibold text-blue-600 hover:underline flex items-center space-x-1"
              >
                <span>View All</span>
                <span>→</span>
              </button>
            </div>
            <div className="space-y-2">
              {LATEST_UPDATES_MOCK.map((item) => (
                <div 
                  key={item.id}
                  onClick={() => onSelectTab('screen-events')}
                  className="flex items-center space-x-2.5 p-1.5 rounded-xl hover:bg-slate-50 transition cursor-pointer"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-12 h-10 rounded-lg object-cover border border-slate-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h5 className="text-[11px] font-bold text-slate-800 truncate">
                      {item.title}
                    </h5>
                    <div className="text-[10px] text-slate-400 flex items-center space-x-2">
                      <span>{item.date}</span>
                      <span>•</span>
                      <span className="text-blue-600 font-medium">{item.category}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ============================================================== */}
        {/* 3. RIGHT SECTION: AI JAN SAHAYAK WIDGET (Col 10 to 12) */}
        {/* ============================================================== */}
        <div className="lg:col-span-3">
          <AIJanSahayakWidget 
            lang={lang} 
            onOpenReportModal={onOpenReportModal}
            onNavigateToTab={onSelectTab}
          />
        </div>

      </div>

    </div>
  );
};
