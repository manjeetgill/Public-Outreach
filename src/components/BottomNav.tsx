import React from 'react';
import { Home, PieChart, HeartHandshake, Users, Megaphone } from 'lucide-react';
import { ScreenTab, Language } from '../types/campaign';

interface BottomNavProps {
  currentTab: ScreenTab;
  onSelectTab: (tab: ScreenTab) => void;
  lang: Language;
  onOpenComplaintModal: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onSelectTab,
  lang,
  onOpenComplaintModal
}) => {
  return (
    <>
      {/* Floating Quick Grievance Action Button */}
      <div className="fixed bottom-20 z-40 max-w-[440px] w-full px-4 flex justify-end pointer-events-none">
        <button 
          onClick={onOpenComplaintModal}
          className="pointer-events-auto shadow-2xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-full flex items-center gap-2 border-2 border-white transition transform active:scale-95 shadow-orange-500/20"
        >
          <Megaphone className="w-4 h-4" />
          <span>{lang === 'hi' ? 'जन सुनवाई • File' : 'Public Hearing • File'}</span>
        </button>
      </div>

      {/* Bottom Persistent Navigation Bar */}
      <nav className="fixed bottom-0 z-40 max-w-[440px] w-full bg-white/95 backdrop-blur-md border-t border-slate-200 py-2 px-3 flex items-center justify-around shadow-lg">
        
        {/* Home */}
        <button 
          onClick={() => onSelectTab('screen-home')}
          className={`flex flex-col items-center gap-1 text-[11px] transition ${
            currentTab === 'screen-home' 
              ? 'text-amber-600 font-extrabold' 
              : 'text-slate-500 hover:text-slate-800 font-medium'
          }`}
        >
          <Home className={`w-5 h-5 ${currentTab === 'screen-home' ? 'text-amber-600' : 'text-slate-500'}`} />
          <span>{lang === 'hi' ? 'Home' : 'Home'}</span>
        </button>

        {/* Hisaab */}
        <button 
          onClick={() => onSelectTab('screen-hisaab')}
          className={`flex flex-col items-center gap-1 text-[11px] transition ${
            currentTab === 'screen-hisaab' 
              ? 'text-amber-600 font-extrabold' 
              : 'text-slate-500 hover:text-slate-800 font-medium'
          }`}
        >
          <PieChart className={`w-5 h-5 ${currentTab === 'screen-hisaab' ? 'text-amber-600' : 'text-slate-500'}`} />
          <span>{lang === 'hi' ? 'Hisaab' : 'Report Card'}</span>
        </button>

        {/* Nivaran */}
        <button 
          onClick={() => onSelectTab('screen-nivaran')}
          className={`flex flex-col items-center gap-1 text-[11px] transition ${
            currentTab === 'screen-nivaran' 
              ? 'text-amber-600 font-extrabold' 
              : 'text-slate-500 hover:text-slate-800 font-medium'
          }`}
        >
          <HeartHandshake className={`w-5 h-5 ${currentTab === 'screen-nivaran' ? 'text-amber-600' : 'text-slate-500'}`} />
          <span>{lang === 'hi' ? 'Nivaran' : 'Grievance'}</span>
        </button>

        {/* Karyakarta */}
        <button 
          onClick={() => onSelectTab('screen-karyakarta')}
          className={`flex flex-col items-center gap-1 text-[11px] transition ${
            currentTab === 'screen-karyakarta' 
              ? 'text-amber-600 font-extrabold' 
              : 'text-slate-500 hover:text-slate-800 font-medium'
          }`}
        >
          <Users className={`w-5 h-5 ${currentTab === 'screen-karyakarta' ? 'text-amber-600' : 'text-slate-500'}`} />
          <span>{lang === 'hi' ? 'कार्यकर्ता' : 'Volunteers'}</span>
        </button>

        {/* Booth Companion (Offline Panna Pramukh) */}
        <button 
          onClick={() => onSelectTab('screen-panna-pramukh')}
          className={`flex flex-col items-center gap-1 text-[11px] transition ${
            currentTab === 'screen-panna-pramukh' 
              ? 'text-amber-600 font-extrabold' 
              : 'text-slate-500 hover:text-slate-800 font-medium'
          }`}
        >
          <span className="text-base leading-none">📴</span>
          <span>{lang === 'hi' ? 'बूथ साथी' : 'Booth'}</span>
        </button>
      </nav>
    </>
  );
};
