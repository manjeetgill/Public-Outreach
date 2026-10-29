import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Quote, 
  Share2, 
  Filter, 
  Search, 
  FileCheck, 
  Sparkles,
  MapPin,
  TrendingUp,
  Building,
  Droplet,
  HeartPulse,
  Zap,
  GraduationCap
} from 'lucide-react';
import { INITIAL_PROJECTS, MLA_INFO } from '../../data/campaignData';
import { ProjectItem, Language } from '../../types/campaign';

interface HisaabScreenProps {
  lang: Language;
}

export const HisaabScreen: React.FC<HisaabScreenProps> = ({ lang }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedWard, setSelectedWard] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProjects = INITIAL_PROJECTS.filter((proj) => {
    const matchesCat = selectedCategory === 'all' || proj.category === selectedCategory;
    const matchesWard = selectedWard === 'all' || proj.wardNo === selectedWard;
    const matchesSearch = 
      proj.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proj.ward.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proj.sanctionNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proj.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesWard && matchesSearch;
  });

  const handleShareProject = (p: ProjectItem) => {
    const shareText = `*नूरपुर विकास रिपोर्ट • रणबीर सिंह निक्का*\n\nकार्य: ${p.title}\nस्वीकृत राशि: ${p.cost}\nवार्ड: ${p.ward}\nस्वीकृति पत्र क्रमांक: ${p.sanctionNo}\n\n"घर-घर निक्का, हर घर निक्का" • पारदर्शी शासन।`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  return (
    <section className="p-4 space-y-4">
      
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-[#102a43] to-[#1c3d5a] text-white p-4 rounded-2xl shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-amber-400">
            {lang === 'hi' ? 'कार्यकाल 2022–वर्तमान' : 'Term 2022–Present'}
          </span>
          <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full text-slate-200">
            {lang === 'hi' ? 'CAG एवं विधानसभा रिकॉर्ड' : 'CAG & Assembly Verified'}
          </span>
        </div>
        <h2 className="text-base font-extrabold">
          {lang === 'hi' ? 'काम का हिसाब • 5 साल का रिपोर्ट कार्ड' : 'Accountability & 5-Year Report Card'}
        </h2>
        <p className="text-xs text-slate-300 mt-1">
          {lang === 'hi' 
            ? 'पारदर्शिता ही हमारी ताकत है। प्रत्येक स्वीकृत व पूर्ण कार्य का ब्योरा।'
            : 'Constitutional transparency in action: verified sanctions & ward allocations.'}
        </p>
      </div>

      {/* 2. Aggregate Stats */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-base font-extrabold text-[#102a43]">{MLA_INFO.stats.totalSchemes}</div>
          <div className="text-[10px] text-slate-500 font-semibold">
            {lang === 'hi' ? 'कुल योजनाएं' : 'Total Schemes'}
          </div>
          <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded mt-1 inline-block">
            100% स्वीकृत
          </span>
        </div>
        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-base font-extrabold text-amber-600">₹{MLA_INFO.stats.totalGrantSanctionedCr} Cr</div>
          <div className="text-[10px] text-slate-500 font-semibold">
            {lang === 'hi' ? 'निधि व ग्रांट' : 'Fund & Grants'}
          </div>
          <span className="text-[9px] bg-sky-100 text-sky-800 font-bold px-1.5 py-0.5 rounded mt-1 inline-block">
            ऑडिट पूर्ण
          </span>
        </div>
        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-base font-extrabold text-emerald-600">{MLA_INFO.stats.resolutionRate}</div>
          <div className="text-[10px] text-slate-500 font-semibold">
            {lang === 'hi' ? 'समय पर पूर्ण' : 'On-Time'}
          </div>
          <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded mt-1 inline-block">
            सत्यापित
          </span>
        </div>
      </div>

      {/* Search & Ward Selector */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs space-y-2.5">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={lang === 'hi' ? 'योजना, सड़क या स्वीकृति संख्या खोजें...' : 'Search by project, ward, or sanction no...'}
            className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:ring-1 focus:ring-orange-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-slate-600 shrink-0 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-amber-600" />
            {lang === 'hi' ? 'वार्ड फिल्टर:' : 'Ward:'}
          </span>
          <select
            value={selectedWard}
            onChange={(e) => setSelectedWard(e.target.value === 'all' ? 'all' : Number(e.target.value))}
            className="text-xs p-1.5 bg-slate-100 border border-slate-300 rounded-lg font-bold text-slate-800 focus:outline-none flex-1"
          >
            <option value="all">{lang === 'hi' ? 'सभी 24 वार्ड (All Wards)' : 'All 24 Wards'}</option>
            {Array.from({ length: 24 }, (_, i) => i + 1).map((w) => (
              <option key={w} value={w}>
                {lang === 'hi' ? `वार्ड सं. ${w}` : `Ward ${w}`}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar text-xs">
        <button 
          onClick={() => setSelectedCategory('all')}
          className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition ${
            selectedCategory === 'all'
              ? 'bg-[#102a43] text-white' 
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          {lang === 'hi' ? 'सभी कार्य (All)' : 'All Sectors'}
        </button>
        <button 
          onClick={() => setSelectedCategory('roads')}
          className={`px-3 py-1.5 rounded-full font-semibold whitespace-nowrap transition ${
            selectedCategory === 'roads'
              ? 'bg-[#102a43] text-white' 
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          {lang === 'hi' ? 'सड़क एवं पुल' : 'Roads & Bridges'}
        </button>
        <button 
          onClick={() => setSelectedCategory('water')}
          className={`px-3 py-1.5 rounded-full font-semibold whitespace-nowrap transition ${
            selectedCategory === 'water'
              ? 'bg-[#102a43] text-white' 
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          {lang === 'hi' ? 'पेयजल व नल' : 'Drinking Water'}
        </button>
        <button 
          onClick={() => setSelectedCategory('health')}
          className={`px-3 py-1.5 rounded-full font-semibold whitespace-nowrap transition ${
            selectedCategory === 'health'
              ? 'bg-[#102a43] text-white' 
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          {lang === 'hi' ? 'स्वास्थ्य केंद्र' : 'Healthcare'}
        </button>
        <button 
          onClick={() => setSelectedCategory('education')}
          className={`px-3 py-1.5 rounded-full font-semibold whitespace-nowrap transition ${
            selectedCategory === 'education'
              ? 'bg-[#102a43] text-white' 
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          {lang === 'hi' ? 'शिक्षा व स्मार्ट स्कूल' : 'Education'}
        </button>
        <button 
          onClick={() => setSelectedCategory('solar')}
          className={`px-3 py-1.5 rounded-full font-semibold whitespace-nowrap transition ${
            selectedCategory === 'solar'
              ? 'bg-[#102a43] text-white' 
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          {lang === 'hi' ? 'विद्युत व ऊर्जा' : 'Power Grid'}
        </button>
      </div>

      {/* Projects List */}
      <div className="space-y-3.5">
        {filteredProjects.length === 0 ? (
          <div className="bg-white rounded-2xl p-6 text-center text-slate-500 border border-slate-200">
            <p className="text-xs font-semibold">
              {lang === 'hi' ? 'इस श्रेणी या वार्ड में कोई योजना नहीं मिली।' : 'No projects found for selected filters.'}
            </p>
            <button 
              onClick={() => { setSelectedCategory('all'); setSelectedWard('all'); setSearchQuery(''); }}
              className="mt-2 text-xs text-amber-600 font-bold underline"
            >
              {lang === 'hi' ? 'सभी फिल्टर हटाएं' : 'Reset Filters'}
            </button>
          </div>
        ) : (
          filteredProjects.map((p) => (
            <div 
              key={p.id} 
              className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200 space-y-3 relative overflow-hidden"
            >
              {/* Top Category Accent Line */}
              <div className={`absolute top-0 left-0 right-0 h-1 ${
                p.status === 'completed' ? 'bg-emerald-600' : 'bg-amber-500'
              }`} />

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-500" />
                  {p.ward}
                </span>
                <span className="text-amber-700 font-black">
                  {p.cost}
                </span>
              </div>

              <h3 className="text-sm font-extrabold text-slate-900 leading-tight">
                {lang === 'hi' ? p.title : p.titleEn}
              </h3>

              <p className="text-xs text-slate-600 leading-relaxed">
                {lang === 'hi' ? p.description : p.descriptionEn}
              </p>

              {/* Impact Callout */}
              <div className="flex items-center gap-1.5 text-[11px] text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="font-semibold">{p.impact}</span>
              </div>

              {/* Resident Feedback */}
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs">
                <div className="font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <Quote className="w-3.5 h-3.5 text-amber-500" />
                  <span>{lang === 'hi' ? 'स्थानीय निवासी फीडबैक' : 'Constituent Testimonial'}</span>
                </div>
                <p className="italic text-slate-600 text-[11px]">
                  "{p.feedbackText}" — <span className="font-bold not-italic text-slate-800">{p.feedbackAuthor}</span> ({p.feedbackRole})
                </p>
              </div>

              {/* Sanction Order & WhatsApp share */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                <span className="text-[11px] text-slate-500 font-mono font-bold flex items-center gap-1">
                  <FileCheck className="w-3.5 h-3.5 text-slate-400" />
                  {p.sanctionNo}
                </span>
                <button 
                  onClick={() => handleShareProject(p)}
                  className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg font-bold flex items-center gap-1.5 hover:bg-emerald-700 transition shadow-xs text-xs"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{lang === 'hi' ? 'शेयर करें' : 'Share'}</span>
                </button>
              </div>

            </div>
          ))
        )}
      </div>

    </section>
  );
};
