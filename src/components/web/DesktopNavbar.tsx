import React from 'react';
import { 
  Phone, 
  Smartphone, 
  Monitor, 
  Sparkles, 
  AlertTriangle, 
  Bot, 
  MapPin, 
  ExternalLink,
  PlusCircle,
  Home,
  PieChart,
  HeartHandshake,
  Users,
  Building2,
  Compass
} from 'lucide-react';
import { MLA_INFO, WEB_ANNOUNCEMENTS } from '../../data/campaignData';
import { ScreenTab, Language } from '../../types/campaign';

interface DesktopNavbarProps {
  currentTab: ScreenTab;
  onSelectTab: (tab: ScreenTab) => void;
  lang: Language;
  onToggleLang: () => void;
  isFrameMode: boolean;
  onToggleFrameMode: () => void;
  onOpenVoiceDesk: () => void;
  onOpenComplaintModal: () => void;
}

export const DesktopNavbar: React.FC<DesktopNavbarProps> = ({
  currentTab,
  onSelectTab,
  lang,
  onToggleLang,
  isFrameMode,
  onToggleFrameMode,
  onOpenVoiceDesk,
  onOpenComplaintModal
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      
      {/* Top Notification Announcement Bar */}
      <div className="bg-[#102a43] text-white text-[11px] py-1.5 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="bg-amber-500 text-slate-950 font-black text-[9px] px-1.5 py-0.2 rounded uppercase shrink-0">
              Live
            </span>
            <p className="truncate text-slate-200">
              {WEB_ANNOUNCEMENTS[0]}
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0 text-slate-300">
            <span className="flex items-center gap-1">
              <Phone className="w-3 h-3 text-amber-400" />
              हेल्पलाइन: <b className="text-white">1800-123-456</b>
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-amber-300 font-bold">विधानसभा क्षेत्र 142</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
        
        {/* Candidate & Constituency Brand */}
        <div 
          onClick={() => onSelectTab('screen-home')}
          className="flex items-center gap-3 cursor-pointer select-none"
        >
          <div className="relative">
            <img 
              src={MLA_INFO.logoUrl} 
              alt="Logo" 
              className="w-10 h-10 rounded-full border-2 border-amber-500 object-cover bg-[#102a43] shadow-xs" 
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"></span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                {lang === 'hi' ? MLA_INFO.constituency : MLA_INFO.constituencyEn}
              </span>
              <span className="hidden lg:inline-block bg-amber-100 text-amber-900 text-[10px] font-black px-2 py-0.2 rounded-full">
                विधायक पोर्टल
              </span>
            </div>
            <h1 className="text-base font-black text-[#102a43] leading-tight flex items-center gap-1.5">
              <span>{lang === 'hi' ? MLA_INFO.name : MLA_INFO.nameEn}</span>
            </h1>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 text-xs font-bold text-slate-700">
          <button
            onClick={() => onSelectTab('screen-home')}
            className={`px-3 py-2 rounded-lg transition flex items-center gap-1.5 ${
              currentTab === 'screen-home' 
                ? 'bg-[#102a43] text-white shadow-xs' 
                : 'hover:bg-slate-100 text-slate-700'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>{lang === 'hi' ? 'मुख्य पृष्ठ' : 'Home'}</span>
          </button>

          <button
            onClick={() => onSelectTab('screen-hisaab')}
            className={`px-3 py-2 rounded-lg transition flex items-center gap-1.5 ${
              currentTab === 'screen-hisaab' 
                ? 'bg-[#102a43] text-white shadow-xs' 
                : 'hover:bg-slate-100 text-slate-700'
            }`}
          >
            <PieChart className="w-3.5 h-3.5" />
            <span>{lang === 'hi' ? 'काम का हिसाब' : 'Report Card'}</span>
          </button>

          <button
            onClick={() => onSelectTab('screen-nivaran')}
            className={`px-3 py-2 rounded-lg transition flex items-center gap-1.5 ${
              currentTab === 'screen-nivaran' 
                ? 'bg-[#102a43] text-white shadow-xs' 
                : 'hover:bg-slate-100 text-slate-700'
            }`}
          >
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>{lang === 'hi' ? 'समस्या निवारण' : 'Grievance Tracker'}</span>
          </button>

          <button
            onClick={() => onSelectTab('screen-wards')}
            className={`px-3 py-2 rounded-lg transition flex items-center gap-1.5 ${
              currentTab === 'screen-wards' 
                ? 'bg-[#102a43] text-white shadow-xs' 
                : 'hover:bg-slate-100 text-slate-700'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>{lang === 'hi' ? '24 वार्ड दर्शन' : '24 Wards'}</span>
          </button>

          <button
            onClick={() => onSelectTab('screen-vision')}
            className={`px-3 py-2 rounded-lg transition flex items-center gap-1.5 ${
              currentTab === 'screen-vision' 
                ? 'bg-[#102a43] text-white shadow-xs' 
                : 'hover:bg-slate-100 text-slate-700'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>{lang === 'hi' ? 'विज़न 2029' : 'Vision 2029'}</span>
          </button>

          <button
            onClick={() => onSelectTab('screen-karyakarta')}
            className={`px-3 py-2 rounded-lg transition flex items-center gap-1.5 ${
              currentTab === 'screen-karyakarta' 
                ? 'bg-[#102a43] text-white shadow-xs' 
                : 'hover:bg-slate-100 text-slate-700'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>{lang === 'hi' ? 'कार्यकर्ता हब' : 'Volunteers'}</span>
          </button>

          {/* Admin War Room Decision Desk */}
          <button
            onClick={() => onSelectTab('screen-admin')}
            className={`px-3 py-2 rounded-lg transition flex items-center gap-1.5 border ${
              currentTab === 'screen-admin' 
                ? 'bg-rose-900/90 text-rose-200 border-rose-500 shadow-xs' 
                : 'bg-rose-50 hover:bg-rose-100 text-rose-800 border-rose-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
            <span>{lang === 'hi' ? '🛡️ वॉर रूम (Admin)' : '🛡️ War Room'}</span>
            <span className="bg-rose-600 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full">
              18
            </span>
          </button>
        </nav>

        {/* Actions & Utilities */}
        <div className="flex items-center gap-2">
          
          {/* Switcher: Mobile Frame Mockup vs Full Web Portal */}
          <div className="bg-slate-100 p-0.5 rounded-xl border border-slate-200 hidden sm:flex items-center text-xs font-bold">
            <button
              onClick={() => { if (isFrameMode) onToggleFrameMode(); }}
              className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition ${
                !isFrameMode ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Full Web App Mode"
            >
              <Monitor className="w-3.5 h-3.5 text-indigo-600" />
              <span>{lang === 'hi' ? 'वेब पोर्टल' : 'Web Portal'}</span>
            </button>
            <button
              onClick={() => { if (!isFrameMode) onToggleFrameMode(); }}
              className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition ${
                isFrameMode ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Mobile App View"
            >
              <Smartphone className="w-3.5 h-3.5 text-amber-600" />
              <span>{lang === 'hi' ? 'मोबाइल व्यू' : 'Mobile View'}</span>
            </button>
          </div>

          {/* Voice AI Desk Button */}
          <button
            onClick={onOpenVoiceDesk}
            className="p-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition flex items-center gap-1 text-xs font-bold"
            title="Voice AI Desk"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span className="hidden xl:inline">{lang === 'hi' ? 'वॉयस AI' : 'Voice AI'}</span>
          </button>

          {/* Language Toggle */}
          <button
            onClick={onToggleLang}
            className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-black text-slate-700 transition"
          >
            {lang === 'hi' ? 'EN | हिंदी' : 'हिंदी | EN'}
          </button>

          {/* Primary Action Button: Lodge Grievance */}
          <button
            onClick={onOpenComplaintModal}
            className="px-3.5 py-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-xs transition transform active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{lang === 'hi' ? 'समस्या दर्ज करें' : 'Lodge Grievance'}</span>
          </button>
        </div>

      </div>

      {/* Mobile Sub-Nav for screens under tablet */}
      <div className="lg:hidden border-t border-slate-200 bg-slate-50 px-3 py-1.5 flex gap-1.5 overflow-x-auto hide-scrollbar text-xs font-bold">
        <button
          onClick={() => onSelectTab('screen-home')}
          className={`px-3 py-1 rounded-lg whitespace-nowrap ${
            currentTab === 'screen-home' ? 'bg-[#102a43] text-white' : 'text-slate-600 hover:bg-slate-200'
          }`}
        >
          {lang === 'hi' ? 'मुख्य पृष्ठ' : 'Home'}
        </button>
        <button
          onClick={() => onSelectTab('screen-hisaab')}
          className={`px-3 py-1 rounded-lg whitespace-nowrap ${
            currentTab === 'screen-hisaab' ? 'bg-[#102a43] text-white' : 'text-slate-600 hover:bg-slate-200'
          }`}
        >
          {lang === 'hi' ? 'काम का हिसाब' : 'Report Card'}
        </button>
        <button
          onClick={() => onSelectTab('screen-nivaran')}
          className={`px-3 py-1 rounded-lg whitespace-nowrap ${
            currentTab === 'screen-nivaran' ? 'bg-[#102a43] text-white' : 'text-slate-600 hover:bg-slate-200'
          }`}
        >
          {lang === 'hi' ? 'समस्या निवारण' : 'Grievance'}
        </button>
        <button
          onClick={() => onSelectTab('screen-wards')}
          className={`px-3 py-1 rounded-lg whitespace-nowrap ${
            currentTab === 'screen-wards' ? 'bg-[#102a43] text-white' : 'text-slate-600 hover:bg-slate-200'
          }`}
        >
          {lang === 'hi' ? '24 वार्ड' : '24 Wards'}
        </button>
        <button
          onClick={() => onSelectTab('screen-vision')}
          className={`px-3 py-1 rounded-lg whitespace-nowrap ${
            currentTab === 'screen-vision' ? 'bg-[#102a43] text-white' : 'text-slate-600 hover:bg-slate-200'
          }`}
        >
          {lang === 'hi' ? 'विज़न 2029' : 'Vision 2029'}
        </button>
        <button
          onClick={() => onSelectTab('screen-karyakarta')}
          className={`px-3 py-1 rounded-lg whitespace-nowrap ${
            currentTab === 'screen-karyakarta' ? 'bg-[#102a43] text-white' : 'text-slate-600 hover:bg-slate-200'
          }`}
        >
          {lang === 'hi' ? 'कार्यकर्ता' : 'Volunteers'}
        </button>
        <button
          onClick={() => onSelectTab('screen-admin')}
          className={`px-3 py-1 rounded-lg whitespace-nowrap border ${
            currentTab === 'screen-admin' ? 'bg-rose-900 text-rose-200 border-rose-500' : 'bg-rose-100 text-rose-800 border-rose-300'
          }`}
        >
          {lang === 'hi' ? '🛡️ वॉर रूम' : '🛡️ War Room'}
        </button>
      </div>

    </header>
  );
};
