import React from 'react';
import { ScreenTab } from '../../types/campaign';
import { ArrowRight, Sparkles } from 'lucide-react';

interface ScreenNavigatorGridProps {
  onSelectTab: (tab: ScreenTab) => void;
  activeScreen?: string;
}

export const ScreenNavigatorGrid: React.FC<ScreenNavigatorGridProps> = ({
  onSelectTab,
  activeScreen
}) => {
  const screens = [
    {
      id: 'screen-home',
      num: '1',
      title: 'Home Page',
      desc: 'मुख्य जनसंवाद पोर्टल, विधायक संदेश व शीर्ष आंकड़े'
    },
    {
      id: 'screen-services',
      num: '2',
      title: 'Report an Issue',
      desc: 'समस्या दर्ज करें • 3-चरणीय नागरिक शिकायत निवारण'
    },
    {
      id: 'screen-work',
      num: '3',
      title: 'Work & Achievements',
      desc: 'हमारे कार्य एवं उपलब्धियां • विकास योजनाओं का ब्योरा'
    },
    {
      id: 'screen-constituency',
      num: '4',
      title: 'Constituency Map',
      desc: 'क्षेत्रीय मानचित्र • 24 वार्डों की समस्याएं व कार्य'
    },
    {
      id: 'screen-events',
      num: '5',
      title: 'Events & Updates',
      desc: 'कार्यक्रम एवं अपडेट • चौपाल, स्वास्थ्य शिविर व सभाएं'
    },
    {
      id: 'screen-voter',
      num: '6',
      title: 'Voter Information',
      desc: 'मतदाता जानकारी • वोटर कार्ड पंजीकरण व ई-नामावली'
    },
    {
      id: 'screen-citizen-dashboard',
      num: '7',
      title: 'Citizen Dashboard (Login)',
      desc: 'मेरी डैशबोर्ड • दर्ज समस्याओं की ऑनलाइन स्थिति'
    },
    {
      id: 'screen-admin',
      num: '8',
      title: 'Admin Dashboard',
      desc: 'कार्यालय डैशबोर्ड • प्रशासनिक विश्लेषण व वॉर रूम'
    }
  ];

  return (
    <div className="space-y-3 pt-4">
      <div className="flex items-center justify-between px-1">
        <h4 className="text-xs sm:text-sm font-extrabold text-[#102a43] flex items-center space-x-1.5 uppercase tracking-wider">
          <span className="w-2 h-2 rounded-full bg-blue-600"></span>
          <span>समस्त 8 मुख्य अनुभाग (Application Overview & Direct Access)</span>
        </h4>
        <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
          किसी भी अनुभाग को पूर्ण स्क्रीन में खोलने हेतु क्लिक करें
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
        {screens.map((s) => {
          const isSelected = activeScreen === s.id;
          return (
            <button
              key={s.id}
              onClick={() => onSelectTab(s.id as ScreenTab)}
              className={`text-left rounded-2xl p-3 border transition-all flex flex-col justify-between group shadow-2xs ${
                isSelected
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-300'
                  : 'bg-white hover:bg-blue-50/60 text-slate-800 border-slate-200/90 hover:border-blue-300'
              }`}
            >
              <div>
                <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mb-1.5 ${
                  isSelected 
                    ? 'bg-white text-blue-700 font-black' 
                    : 'bg-blue-100 text-blue-800 font-black'
                }`}>
                  {s.num}. {s.title}
                </span>
                <p className={`text-[10px] leading-tight line-clamp-2 ${
                  isSelected ? 'text-blue-100' : 'text-slate-500'
                }`}>
                  {s.desc}
                </p>
              </div>

              <div className="pt-2 flex items-center justify-end">
                <span className={`text-[10px] font-bold flex items-center space-x-0.5 group-hover:translate-x-0.5 transition ${
                  isSelected ? 'text-white' : 'text-blue-600'
                }`}>
                  <span>खोलें</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
