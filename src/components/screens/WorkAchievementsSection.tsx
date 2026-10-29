import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  FileCheck, 
  Calendar, 
  MapPin, 
  ExternalLink, 
  Building2, 
  X,
  Sparkles
} from 'lucide-react';
import { Language, ProjectItem } from '../../types/campaign';
import { INITIAL_PROJECTS as PROJECTS_DATA } from '../../data/campaignData';


interface WorkAchievementsSectionProps {
  lang: Language;
}

export const WorkAchievementsSection: React.FC<WorkAchievementsSectionProps> = ({ lang }) => {
  const [activeTab, setActiveTab] = useState<'completed' | 'in_progress' | 'sanctioned' | 'proposed'>('completed');
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  // Filtered projects
  const filteredProjects = PROJECTS_DATA.filter((p) => {
    if (activeTab === 'completed') return p.status === 'completed';
    if (activeTab === 'in_progress') return p.status === 'in-progress';
    if (activeTab === 'sanctioned') return p.cost.includes('लाख') || p.cost.includes('Cr');
    return true;
  });

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-md p-5 sm:p-7 space-y-6">
      
      {/* Header matching Card 3 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
        <div>
          <h3 className="text-xl sm:text-2xl font-black text-[#102a43]">
            हमारे कार्य एवं उपलब्धियां
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            नूरपुर विधानसभा में पारदर्शी विकास, स्वीकृत बजट व पूर्ण योजनाओं का प्रामाणिक लेखा-जोखा
          </p>
        </div>

        {/* 4 Tabs matching mockup */}
        <div className="flex items-center space-x-1.5 bg-slate-100/90 p-1 rounded-xl text-xs font-bold overflow-x-auto">
          <button
            onClick={() => setActiveTab('completed')}
            className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
              activeTab === 'completed'
                ? 'bg-[#0066cc] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            संपन्न कार्य
          </button>
          <button
            onClick={() => setActiveTab('in_progress')}
            className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
              activeTab === 'in_progress'
                ? 'bg-[#0066cc] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            प्रगति पर कार्य
          </button>
          <button
            onClick={() => setActiveTab('sanctioned')}
            className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
              activeTab === 'sanctioned'
                ? 'bg-[#0066cc] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            स्वीकृत कार्य
          </button>
          <button
            onClick={() => setActiveTab('proposed')}
            className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
              activeTab === 'proposed'
                ? 'bg-[#0066cc] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            प्रस्तावित कार्य
          </button>
        </div>
      </div>

      {/* 3 Grid Cards matching the exact layout & pictures in Card 3 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Card 1: नूरपुर बढ़ोही सड़क मरम्मत */}
        <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between group">
          <div>
            <div className="h-44 overflow-hidden relative bg-slate-100">
              <img
                src="https://images.unsplash.com/photo-1545459720-aac8509eb02c?w=600&auto=format&fit=crop&q=80"
                alt="नूरपुर बढ़ोही सड़क"
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
              />
              <span className="absolute top-3 left-3 bg-blue-600/90 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                सड़क
              </span>
            </div>
            <div className="p-4 space-y-2">
              <h4 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-blue-600 transition">
                नूरपुर बढ़ोही सड़क मरम्मत
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                4.8 किमी लंबे संपर्क मार्ग का चौड़ीकरण, बिटुमिनस डामरीकरण और दोनों ओर पक्की जल निकासी नालियों का निर्माण।
              </p>
              <div className="flex items-center justify-between text-[11px] pt-1">
                <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold px-2 py-0.5 rounded">
                  Completed
                </span>
                <span className="text-slate-400 font-mono">Jan 2026</span>
              </div>
            </div>
          </div>
          <div className="p-4 pt-0">
            <button
              onClick={() => setSelectedProject(PROJECTS_DATA[0])}
              className="w-full py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 font-bold rounded-xl text-xs transition shadow-2xs"
            >
              देखें विवरण
            </button>
          </div>
        </div>

        {/* Card 2: समुदाय स्वास्थ्य शिविर */}
        <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between group">
          <div>
            <div className="h-44 overflow-hidden relative bg-slate-100">
              <img
                src="https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=600&auto=format&fit=crop&q=80"
                alt="समुदाय स्वास्थ्य शिविर"
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
              />
              <span className="absolute top-3 left-3 bg-rose-600/90 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                स्वास्थ्य
              </span>
            </div>
            <div className="p-4 space-y-2">
              <h4 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-rose-600 transition">
                समुदाय स्वास्थ्य शिविर
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                विशेषज्ञ चिकित्सकों द्वारा 1,200+ नागरिकों की मुफ्त जांच, दवाइयों का वितरण और डिजिटल स्वास्थ्य कार्ड निर्माण।
              </p>
              <div className="flex items-center justify-between text-[11px] pt-1">
                <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold px-2 py-0.5 rounded">
                  Completed
                </span>
                <span className="text-slate-400 font-mono">Sep 2025</span>
              </div>
            </div>
          </div>
          <div className="p-4 pt-0">
            <button
              onClick={() => setSelectedProject(PROJECTS_DATA[1])}
              className="w-full py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 font-bold rounded-xl text-xs transition shadow-2xs"
            >
              देखें विवरण
            </button>
          </div>
        </div>

        {/* Card 3: सरकारी स्कूल सुधार कार्य */}
        <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between group">
          <div>
            <div className="h-44 overflow-hidden relative bg-slate-100">
              <img
                src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&auto=format&fit=crop&q=80"
                alt="सरकारी स्कूल सुधार कार्य"
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
              />
              <span className="absolute top-3 left-3 bg-purple-600/90 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                शिक्षा
              </span>
            </div>
            <div className="p-4 space-y-2">
              <h4 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-purple-600 transition">
                सरकारी स्कूल सुधार कार्य
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                कक्षाओं का नवीनीकरण, आधुनिक कंप्यूटर लैब स्थापना, एवं बालिकाओं हेतु स्वच्छ पेयजल व वॉशरूम ब्लॉक निर्माण।
              </p>
              <div className="flex items-center justify-between text-[11px] pt-1">
                <span className="bg-amber-50 text-amber-700 border border-amber-200 font-bold px-2 py-0.5 rounded">
                  In Progress
                </span>
                <span className="text-slate-400 font-mono">Dec 2025</span>
              </div>
            </div>
          </div>
          <div className="p-4 pt-0">
            <button
              onClick={() => setSelectedProject(PROJECTS_DATA[2])}
              className="w-full py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 font-bold rounded-xl text-xs transition shadow-2xs"
            >
              देखें विवरण
            </button>
          </div>
        </div>

      </div>

      {/* Details Inspection Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
                  {selectedProject.categoryLabel}
                </span>
                <h4 className="font-black text-slate-900 text-base">
                  {selectedProject.title}
                </h4>
              </div>
              <button 
                onClick={() => setSelectedProject(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600">
              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl">
                <div><b>स्वीकृत बजट:</b> {selectedProject.cost}</div>
                <div><b>वार्ड:</b> {selectedProject.ward}</div>
                <div><b>स्वीकृति संख्या:</b> {selectedProject.sanctionNo}</div>
                <div><b>स्थिति:</b> <span className="text-emerald-600 font-bold">{selectedProject.status}</span></div>
              </div>

              <div>
                <b className="text-slate-900 block mb-1">विस्तृत विवरण:</b>
                <p className="leading-relaxed">{selectedProject.description}</p>
              </div>

              <div>
                <b className="text-slate-900 block mb-1">जन-प्रभाव (Impact):</b>
                <p className="leading-relaxed text-slate-700">{selectedProject.impact}</p>
              </div>

              <div className="bg-blue-50/70 border border-blue-100 p-3 rounded-xl">
                <b className="text-blue-900 block text-[11px] mb-1">नागरिक फीडबैक:</b>
                <p className="italic text-slate-700">"{selectedProject.feedbackText}"</p>
                <span className="text-[10px] text-slate-500 block mt-1">— {selectedProject.feedbackAuthor} ({selectedProject.feedbackRole})</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedProject(null)}
                className="bg-[#102a43] hover:bg-[#0b1c2e] text-white font-bold text-xs px-5 py-2 rounded-xl transition"
              >
                बंद करें
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
