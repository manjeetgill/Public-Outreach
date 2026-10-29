import React from 'react';
import { Phone, Smartphone, Monitor } from 'lucide-react';
import { MLA_INFO } from '../data/campaignData';
import { Language } from '../types/campaign';

interface HeaderProps {
  lang: Language;
  onToggleLang: () => void;
  isFrameMode: boolean;
  onToggleFrameMode: () => void;
  onOpenVoiceDesk: () => void;
  onOpenAdmin?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  lang,
  onToggleLang,
  isFrameMode,
  onToggleFrameMode,
  onOpenVoiceDesk,
  onOpenAdmin
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 py-2.5 flex items-center justify-between shadow-xs">
      {/* Brand & Constituency */}
      <div className="flex items-center gap-2.5">
        <div className="relative">
          <img 
            src={MLA_INFO.logoUrl} 
            alt="Logo" 
            className="w-10 h-10 rounded-full border border-amber-500 shadow-xs object-cover bg-[#102a43]" 
          />
          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"></span>
        </div>
        <div>
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block leading-tight">
            {lang === 'hi' ? MLA_INFO.constituency : MLA_INFO.constituencyEn}
          </span>
          <h1 className="text-sm font-extrabold text-[#102a43] leading-snug">
            {lang === 'hi' ? MLA_INFO.name : MLA_INFO.nameEn}
          </h1>
        </div>
      </div>

      {/* Action Utilities */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Toggle Device View (Desktop only indicator) */}
        <button
          onClick={onToggleFrameMode}
          className="hidden md:flex items-center gap-1 p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
          title={isFrameMode ? 'Switch to Full Width View' : 'Switch to Mobile Frame'}
        >
          {isFrameMode ? <Monitor className="w-3.5 h-3.5 text-slate-600" /> : <Smartphone className="w-3.5 h-3.5 text-slate-600" />}
          <span className="text-[10px] hidden lg:inline">{isFrameMode ? 'Wide' : 'Mobile'}</span>
        </button>

        {/* Admin War Room Button */}
        {onOpenAdmin && (
          <button
            onClick={onOpenAdmin}
            className="p-1.5 px-2 rounded-full bg-rose-100 text-rose-800 hover:bg-rose-200 transition border border-rose-300 shadow-xs flex items-center gap-1 text-[11px] font-bold"
            title="विधायक वॉर रूम / Admin Desk"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse"></span>
            <span>Admin</span>
          </button>
        )}

        {/* Direct Helpline Trigger */}
        <button
          onClick={onOpenVoiceDesk}
          className="p-2 rounded-full bg-orange-50 text-orange-600 hover:bg-orange-100 transition border border-orange-200 shadow-xs" 
          title={lang === 'hi' ? 'हेल्पलाइन कॉल / AI डेस्क' : 'Helpline Call / AI Desk'}
        >
          <Phone className="w-3.5 h-3.5" />
        </button>

        {/* Language Switcher */}
        <button
          onClick={onToggleLang}
          className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 text-[11px] font-extrabold text-slate-700 transition"
        >
          {lang === 'hi' ? 'EN | हिंदी' : 'हिंदी | EN'}
        </button>

        {/* Candidate Profile Avatar */}
        <div className="relative cursor-pointer" onClick={onOpenVoiceDesk} title="रणबीर सिंह निक्का">
          <img 
            src={MLA_INFO.photoUrl} 
            alt="Ranbir Singh Nikka" 
            className="w-8 h-8 rounded-full object-cover border border-amber-500 shadow-xs hover:scale-105 transition" 
          />
          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white"></span>
        </div>
      </div>
    </header>
  );
};
