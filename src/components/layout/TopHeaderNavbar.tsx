import React, { useState } from 'react';
import { Search, Globe, User, Shield, Menu, X, ChevronDown, Check } from 'lucide-react';
import { ScreenTab, Language } from '../../types/campaign';

interface TopHeaderNavbarProps {
  currentTab: ScreenTab;
  onSelectTab: (tab: ScreenTab) => void;
  lang: Language;
  onToggleLang: () => void;
  onOpenAuthModal: () => void;
  onSearch?: (query: string) => void;
}

export const TopHeaderNavbar: React.FC<TopHeaderNavbarProps> = ({
  currentTab,
  onSelectTab,
  lang,
  onToggleLang,
  onOpenAuthModal,
  onSearch
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  const navItems: { tab: ScreenTab; labelHi: string; labelEn: string }[] = [
    { tab: 'screen-home', labelHi: 'Home', labelEn: 'Home' },
    { tab: 'screen-about', labelHi: 'परिचय (About)', labelEn: 'About' },
    { tab: 'screen-work', labelHi: 'कार्य (Work & Achievements)', labelEn: 'Work & Achievements' },
    { tab: 'screen-projects', labelHi: 'परियोजनाएं (Projects)', labelEn: 'Projects' },
    { tab: 'screen-services', labelHi: 'नागरिक सेवाएं (Citizen Services)', labelEn: 'Citizen Services' },
    { tab: 'screen-events', labelHi: 'कार्यक्रम (Events)', labelEn: 'Events' },
    { tab: 'screen-constituency', labelHi: 'मानचित्र (Constituency)', labelEn: 'Constituency' },
    { tab: 'screen-ai', labelHi: 'AI सहायक (AI Assistant)', labelEn: 'AI Assistant' },
    { tab: 'screen-media', labelHi: 'मीडिया (Media)', labelEn: 'Media' },
    { tab: 'screen-contact', labelHi: 'संपर्क (Contact)', labelEn: 'Contact' },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      {/* Top Banner on Desktop */}
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-4">
        
        {/* Brand Logo & MLA Title */}
        <div 
          onClick={() => onSelectTab('screen-home')}
          className="flex items-center space-x-3 cursor-pointer select-none shrink-0"
        >
          {/* Congress Hand Emblem / Tiranga Crest */}
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border-2 border-amber-500 overflow-hidden bg-white shadow-xs flex items-center justify-center p-0.5 shrink-0">
            <img 
              src="https://lh3.googleusercontent.com/aida/AEtjO1URrhj--LIGw_m228IiEh76BELOa61ztIlDA2fag_fH_KWgAhkK9fuJDogh37Tgy3oCF03QRSp2lSqTG45zqzRvBcr_heGIEr5P4SExffcxR-kjGEPhVuokSa0R0CR2eFGQHrYDbOo0FSI9ljnUkbNyQEPCJew3xTwlHnCFC7_Rh6taTox6Xujw7xTInNMoo9SDfx31obic5dankLArLtRZPfrUNB7_LhuOeF15faIA"
              alt="Janadesh Emblem"
              className="w-full h-full object-contain"
            />
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl font-black text-[#102a43] tracking-tight leading-none font-sans">
                जनादेश
              </h1>
              <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded border border-amber-200 hidden sm:inline-block">
                वि.स. 142
              </span>
            </div>
            <div className="text-xs sm:text-sm font-bold text-slate-800 leading-tight">
              Ranbir Singh Nikka
            </div>
            <div className="text-[10px] sm:text-[11px] text-slate-500 font-medium leading-none">
              MLA - Nurpur, Himachal Pradesh
            </div>
          </div>
        </div>

        {/* Center Navigation Bar (Desktop Widescreen) */}
        <nav className="hidden xl:flex items-center space-x-1 lg:space-x-1.5 bg-slate-50/80 p-1 rounded-xl border border-slate-200/80">
          {navItems.map((item) => {
            const isActive = currentTab === item.tab || 
              (item.tab === 'screen-work' && currentTab === 'screen-hisaab') ||
              (item.tab === 'screen-services' && currentTab === 'screen-nivaran') ||
              (item.tab === 'screen-constituency' && currentTab === 'screen-wards');

            return (
              <button
                key={item.tab}
                onClick={() => onSelectTab(item.tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all select-none ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 shadow-xs border border-blue-200 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                {lang === 'hi' ? item.labelHi : item.labelEn}
              </button>
            );
          })}
        </nav>

        {/* Right Controls: Language, Search, Login, Admin */}
        <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
          
          {/* Language Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center space-x-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 px-2.5 py-1.5 rounded-lg transition"
            >
              <Globe className="w-3.5 h-3.5 text-slate-500" />
              <span>{lang === 'hi' ? 'हिंदी' : 'English'}</span>
              <ChevronDown className="w-3 h-3 text-slate-500" />
            </button>

            {langDropdownOpen && (
              <div className="absolute right-0 mt-1 w-28 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-50 text-xs">
                <button
                  onClick={() => {
                    if (lang !== 'en') onToggleLang();
                    setLangDropdownOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 flex items-center justify-between hover:bg-slate-100 text-slate-700 font-medium"
                >
                  <span>English</span>
                  {lang === 'en' && <Check className="w-3.5 h-3.5 text-blue-600" />}
                </button>
                <button
                  onClick={() => {
                    if (lang !== 'hi') onToggleLang();
                    setLangDropdownOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 flex items-center justify-between hover:bg-slate-100 text-slate-700 font-medium"
                >
                  <span>हिंदी</span>
                  {lang === 'hi' && <Check className="w-3.5 h-3.5 text-blue-600" />}
                </button>
              </div>
            )}
          </div>

          {/* Search Box */}
          <form onSubmit={handleSearchSubmit} className="relative hidden md:block">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={lang === 'hi' ? 'खोजें... (Search)' : 'Search...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white w-36 lg:w-48 transition"
            />
          </form>

          {/* Login / Register Button (Navy button) */}
          <button
            onClick={onOpenAuthModal}
            className="bg-[#102a43] hover:bg-[#0b1c2e] text-white text-xs font-bold px-3.5 py-1.5 rounded-lg shadow-xs transition active:scale-95 flex items-center space-x-1.5"
          >
            <User className="w-3.5 h-3.5" />
            <span>{lang === 'hi' ? 'Login / Register' : 'Login / Register'}</span>
          </button>

          {/* Admin War Room Trigger */}
          <button
            onClick={() => onSelectTab('screen-admin')}
            title="विधायक वॉर रूम व जन सेवा निर्णय डेस्क"
            className={`text-xs font-bold px-2.5 py-1.5 rounded-lg border transition flex items-center space-x-1 ${
              currentTab === 'screen-admin'
                ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-amber-600" />
            <span className="hidden sm:inline">Admin</span>
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-t border-slate-200 px-4 py-3 space-y-2 shadow-lg">
          {/* Mobile Search */}
          <form onSubmit={handleSearchSubmit} className="relative mb-3">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={lang === 'hi' ? 'खोजें...' : 'Search...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
            />
          </form>

          <div className="grid grid-cols-2 gap-1.5">
            {navItems.map((item) => (
              <button
                key={item.tab}
                onClick={() => {
                  onSelectTab(item.tab);
                  setMobileMenuOpen(false);
                }}
                className={`text-left px-3 py-2 rounded-lg text-xs font-medium ${
                  currentTab === item.tab
                    ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                {lang === 'hi' ? item.labelHi : item.labelEn}
              </button>
            ))}
            <button
              onClick={() => {
                onSelectTab('screen-admin');
                setMobileMenuOpen(false);
              }}
              className="text-left px-3 py-2 rounded-lg text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 col-span-2 flex items-center space-x-1.5"
            >
              <Shield className="w-4 h-4 text-amber-600" />
              <span>🛡️ विधायक वॉर रूम व जन सेवा निर्णय डेस्क (Admin War Room)</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
