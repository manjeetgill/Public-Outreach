import React from 'react';
import { 
  ShieldCheck, 
  UserCheck, 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  ExternalLink,
  CheckCircle2,
  Clock,
  ChevronRight,
  Flame,
  ArrowUpRight
} from 'lucide-react';
import { Language, ScreenTab } from '../../types/campaign';

interface AdminDashboardSectionProps {
  lang: Language;
  onOpenFullWarRoom: () => void;
}

export const AdminDashboardSection: React.FC<AdminDashboardSectionProps> = ({
  lang,
  onOpenFullWarRoom
}) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-md p-5 sm:p-7 space-y-6">
      
      {/* Header matching Card 8 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-xl sm:text-2xl font-black text-[#102a43]">
              कार्यालय डैशबोर्ड
            </h3>
            <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-200">
              प्रशासनिक नियंत्रण
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            अनुरोध, कार्य, कार्यक्रम और विश्लेषण
          </p>
        </div>

        {/* Admin Profile indicator */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700">
            <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px]">
              A
            </div>
            <span>Admin</span>
            <span className="text-slate-400">▾</span>
          </div>

          <button
            onClick={onOpenFullWarRoom}
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs px-3.5 py-1.5 rounded-xl shadow-xs transition active:scale-95 flex items-center space-x-1"
          >
            <span>वॉर रूम डेस्क</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 4 Stat Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-blue-50/70 border border-blue-100 rounded-2xl p-3 text-center">
          <div className="text-2xl font-black text-[#0066cc]">1,248</div>
          <div className="text-[11px] text-slate-600 font-semibold mt-0.5">कुल अनुरोध</div>
        </div>
        <div className="bg-emerald-50/70 border border-emerald-100 rounded-2xl p-3 text-center">
          <div className="text-2xl font-black text-emerald-600">742</div>
          <div className="text-[11px] text-slate-600 font-semibold mt-0.5">समाधान</div>
        </div>
        <div className="bg-amber-50/70 border border-amber-100 rounded-2xl p-3 text-center">
          <div className="text-2xl font-black text-amber-600">506</div>
          <div className="text-[11px] text-slate-600 font-semibold mt-0.5">प्रगति पर</div>
        </div>
        <div className="bg-purple-50/70 border border-purple-100 rounded-2xl p-3 text-center">
          <div className="text-2xl font-black text-purple-600">21</div>
          <div className="text-[11px] text-slate-600 font-semibold mt-0.5">आगामी कार्यक्रम</div>
        </div>
      </div>

      {/* 2 Charts Grid matching Card 8 */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
        
        {/* Left: श्रेणी के अनुसार अनुरोध (Horizontal Bar Chart) - 7 cols */}
        <div className="md:col-span-7 bg-slate-50/70 border border-slate-200/90 rounded-2xl p-4 space-y-3">
          <h4 className="text-xs font-bold text-slate-800">
            श्रेणी के अनुसार अनुरोध
          </h4>
          
          <div className="space-y-2.5 text-xs">
            {/* सड़कें */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-semibold text-slate-700">
                <span>सड़कें</span>
                <span className="font-mono text-blue-600 font-bold">320</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>

            {/* जल आपूर्ति */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-semibold text-slate-700">
                <span>जल आपूर्ति</span>
                <span className="font-mono text-cyan-600 font-bold">210</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                <div className="bg-cyan-500 h-2.5 rounded-full" style={{ width: '60%' }}></div>
              </div>
            </div>

            {/* स्वास्थ्य */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-semibold text-slate-700">
                <span>स्वास्थ्य</span>
                <span className="font-mono text-rose-600 font-bold">180</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                <div className="bg-rose-500 h-2.5 rounded-full" style={{ width: '50%' }}></div>
              </div>
            </div>

            {/* शिक्षा */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-semibold text-slate-700">
                <span>शिक्षा</span>
                <span className="font-mono text-amber-600 font-bold">140</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                <div className="bg-amber-500 h-2.5 rounded-full" style={{ width: '40%' }}></div>
              </div>
            </div>

            {/* अन्य */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-semibold text-slate-700">
                <span>अन्य</span>
                <span className="font-mono text-slate-600 font-bold">110</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                <div className="bg-slate-500 h-2.5 rounded-full" style={{ width: '30%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: स्थिति के अनुसार (Donut Chart) - 5 cols */}
        <div className="md:col-span-5 bg-slate-50/70 border border-slate-200/90 rounded-2xl p-4 flex flex-col justify-between">
          <h4 className="text-xs font-bold text-slate-800 mb-2">
            स्थिति के अनुसार
          </h4>

          <div className="flex items-center justify-center space-x-4 py-2">
            {/* SVG Donut */}
            <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-200"
                  strokeWidth="4.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                {/* Resolved segment (Green: 59.4%) */}
                <path
                  className="text-emerald-500"
                  strokeDasharray="59.4, 100"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                {/* In Progress segment (Cyan/Orange: 31.6%) */}
                <path
                  className="text-amber-500"
                  strokeDasharray="31.6, 100"
                  strokeDashoffset="-59.4"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-xs font-black text-slate-900 block leading-tight">1,248</span>
                <span className="text-[9px] text-slate-500 block">Total</span>
              </div>
            </div>

            {/* Donut Legend */}
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center space-x-1.5 text-slate-700">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span>Resolved (742)</span>
              </div>
              <div className="flex items-center space-x-1.5 text-slate-700">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                <span>In Progress (506)</span>
              </div>
              <div className="flex items-center space-x-1.5 text-slate-700">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                <span>Received</span>
              </div>
            </div>
          </div>

          <div className="pt-2 text-center">
            <span className="text-[10px] text-slate-400">94.2% जन-समाधान सफलता दर</span>
          </div>
        </div>

      </div>

    </div>
  );
};
