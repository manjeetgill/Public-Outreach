import React, { useState } from 'react';
import { 
  Trophy, 
  CheckSquare, 
  Download, 
  UserPlus, 
  Sparkles, 
  Music, 
  FileText, 
  Image as ImageIcon,
  Share2,
  Award,
  Flame,
  CheckCircle2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { INITIAL_TASKS, MEDIA_KIT_ITEMS } from '../../data/campaignData';
import { KaryakartaTask, MediaKitItem, Language } from '../../types/campaign';

interface KaryakartaScreenProps {
  onOpenRegisterModal: () => void;
  onOpenMediaModal: (item: MediaKitItem) => void;
  lang: Language;
}

export const KaryakartaScreen: React.FC<KaryakartaScreenProps> = ({
  onOpenRegisterModal,
  onOpenMediaModal,
  lang
}) => {
  const [tasks, setTasks] = useState<KaryakartaTask[]>(INITIAL_TASKS);
  const [earnedPoints, setEarnedPoints] = useState<number>(650);

  const toggleTask = (taskId: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const nextState = !t.completed;
        if (nextState) {
          setEarnedPoints(p => p + t.points);
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.7 }
          });
        } else {
          setEarnedPoints(p => Math.max(0, p - t.points));
        }
        return { ...t, completed: nextState };
      }
      return t;
    }));
  };

  const completedCount = tasks.filter(t => t.completed).length;

  return (
    <section className="p-4 space-y-4">
      
      {/* 1. Karyakarta Profile & Points */}
      <div className="bg-[#102a43] text-white rounded-2xl p-4 shadow-md border border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-300 font-black shadow-inner">
              VS
            </div>
            <div>
              <h3 className="text-xs font-black">
                {lang === 'hi' ? 'विक्रम शर्मा (वरिष्ठ बूथ प्रचारक)' : 'Vikram Sharma (Senior Campaigner)'}
              </h3>
              <p className="text-[10px] text-slate-300">
                {lang === 'hi' ? 'बूथ #214 • नूरपुर मुख्य मंडल' : 'Booth #214 • Nurpur Mandal'}
              </p>
            </div>
          </div>
          <span className="bg-amber-500 text-slate-950 font-black text-[10px] px-2.5 py-0.5 rounded-full shadow-xs">
            बूथ #214
          </span>
        </div>

        {/* Weekly Leaderboard Recognition */}
        <div className="bg-white/10 rounded-xl p-2.5 flex items-center justify-between text-xs backdrop-blur-xs border border-white/10">
          <div className="flex items-center gap-1.5 text-amber-300">
            <Trophy className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="font-bold">
              {lang === 'hi' ? 'सप्ताह के शीर्ष कार्यकर्ता' : 'Top Volunteer of the Week'}
            </span>
          </div>
          <div className="flex items-center gap-1 font-mono font-bold text-emerald-400">
            <Flame className="w-3.5 h-3.5 text-orange-400" />
            <span>{earnedPoints} {lang === 'hi' ? 'अंक कुल' : 'Points'}</span>
          </div>
        </div>
      </div>

      {/* 2. Daily Tasks Checklist */}
      <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <CheckSquare className="w-4 h-4 text-amber-500" />
            <h4 className="text-xs font-extrabold text-slate-900">
              {lang === 'hi' ? 'दैनिक बूथ कार्य (Daily Action Tasks)' : 'Daily Action Tasks'}
            </h4>
          </div>
          <span className="text-[10px] bg-orange-100 text-orange-800 font-bold px-2 py-0.5 rounded-full">
            {completedCount} of {tasks.length} {lang === 'hi' ? 'पूर्ण' : 'Done'}
          </span>
        </div>

        <div className="space-y-2.5 text-xs">
          {tasks.map((task) => (
            <label 
              key={task.id}
              onClick={() => toggleTask(task.id)}
              className={`flex items-start gap-2.5 p-2.5 rounded-xl border cursor-pointer transition select-none ${
                task.completed 
                  ? 'bg-emerald-50/60 border-emerald-200' 
                  : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <input 
                type="checkbox" 
                checked={task.completed} 
                onChange={() => {}} 
                className="mt-0.5 accent-emerald-600 rounded cursor-pointer w-4 h-4" 
              />
              <div className="flex-1">
                <div className="font-bold text-slate-800 flex justify-between items-center">
                  <span className={task.completed ? 'line-through text-slate-600' : ''}>
                    {lang === 'hi' ? task.title : task.titleEn}
                  </span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ml-1 shrink-0 ${
                    task.completed 
                      ? 'text-emerald-700 bg-emerald-100' 
                      : 'text-amber-700 bg-amber-100'
                  }`}>
                    {task.completed ? 'पूर्ण ✓' : `+${task.points} अंक`}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  {lang === 'hi' ? task.description : task.descriptionEn}
                </p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* 3. Campaign Media Kit Downloads */}
      <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
            <Download className="w-3.5 h-3.5 text-amber-500" />
            {lang === 'hi' ? 'प्रचार सामग्री किट (Campaign Media Kit)' : 'Campaign Media Kit & Downloads'}
          </h4>
          <span className="text-[10px] text-slate-500 font-semibold">HD फॉर्मेट</span>
        </div>

        <div className="space-y-2 text-xs">
          {MEDIA_KIT_ITEMS.map((item) => (
            <div 
              key={item.id} 
              className="p-2.5 rounded-xl border border-slate-200 flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition"
            >
              <div className="flex items-center gap-2.5 overflow-hidden">
                <span className="p-2 rounded-lg bg-white border border-slate-200 shrink-0">
                  {item.type === 'image' && <ImageIcon className="w-4 h-4 text-indigo-600" />}
                  {item.type === 'audio' && <Music className="w-4 h-4 text-amber-600" />}
                  {item.type === 'pdf' && <FileText className="w-4 h-4 text-red-600" />}
                </span>
                <div className="truncate">
                  <div className="font-bold text-slate-800 truncate">
                    {lang === 'hi' ? item.title : item.titleEn}
                  </div>
                  <div className="text-[10px] text-slate-500 truncate">
                    {item.dimensionsOrFormat} • {item.size}
                  </div>
                </div>
              </div>
              <button 
                onClick={() => onOpenMediaModal(item)}
                className="px-2.5 py-1 bg-[#102a43] hover:bg-[#0b1b2b] text-white rounded text-[11px] font-bold shrink-0 ml-2 transition shadow-xs"
              >
                {item.type === 'audio' ? (lang === 'hi' ? 'चलाएं / डाउनलोड' : 'Play') : (lang === 'hi' ? 'डाउनलोड' : 'Download')}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Join Volunteer Force Banner */}
      <div className="bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-2xl p-4 shadow-md text-center space-y-2">
        <h4 className="text-sm font-black">
          {lang === 'hi' ? 'क्या आप नूरपुर के विकास में योगदान देना चाहते हैं?' : 'Want to volunteer for Nurpur Constituency?'}
        </h4>
        <p className="text-xs text-orange-100 max-w-xs mx-auto">
          {lang === 'hi' 
            ? 'पन्ना प्रमुख या सोशल मीडिया कार्यकर्ता बनकर निक्का जी के मिशन से जुड़ें।'
            : 'Register as booth volunteer or social campaigner to join team Nikka.'}
        </p>
        <button 
          onClick={onOpenRegisterModal}
          className="mt-2 px-5 py-2.5 bg-white text-slate-900 font-extrabold rounded-xl text-xs shadow-md hover:bg-slate-100 transition inline-flex items-center gap-2"
        >
          <UserPlus className="w-4 h-4 text-orange-600" />
          <span>{lang === 'hi' ? 'नया कार्यकर्ता पंजीकरण (Register Now)' : 'Register as Volunteer'}</span>
        </button>
      </div>

    </section>
  );
};
