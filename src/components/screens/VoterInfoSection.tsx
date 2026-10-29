import React, { useState } from 'react';
import { 
  Vote, 
  Search, 
  ExternalLink, 
  UserCheck, 
  FileText, 
  ShieldCheck, 
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { Language } from '../../types/campaign';

interface VoterInfoSectionProps {
  lang: Language;
}

export const VoterInfoSection: React.FC<VoterInfoSectionProps> = ({ lang }) => {
  const [activeTab, setActiveTab] = useState<'register' | 'search_name' | 'ero_list' | 'awareness'>('register');
  const [searchEpic, setSearchEpic] = useState('');
  const [searchResult, setSearchResult] = useState<any | null>(null);

  const handleEpicSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchEpic.trim()) return;

    setSearchResult({
      epic: searchEpic.toUpperCase(),
      name: 'रमेश कुमार शर्मा',
      fatherName: 'श्री ज्ञान चंद',
      constituency: '142 - नूरपुर (कांगड़ा)',
      pollingStation: 'राजकीय वरिष्ठ माध्यमिक विद्यालय जसूर (कक्ष #2)',
      partNo: '48',
      serialNo: '214'
    });
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-md p-5 sm:p-7 space-y-6">
      
      {/* Header matching Card 6 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-3">
        <div>
          <h3 className="text-xl sm:text-2xl font-black text-[#102a43]">
            मतदाता जानकारी
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            मतदाता पंजीकरण, सूची और अन्य सेवाओं के लिए आधिकारिक जानकारी
          </p>
        </div>

        {/* 4 Tabs: मतदाता पंजीकरण, अपना नाम खोजें, मतदाता सूची (ERO), जागरूकता */}
        <div className="flex items-center space-x-1.5 bg-slate-100/90 p-1 rounded-xl text-xs font-bold overflow-x-auto">
          <button
            onClick={() => setActiveTab('register')}
            className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
              activeTab === 'register'
                ? 'bg-[#0066cc] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            मतदाता पंजीकरण
          </button>
          <button
            onClick={() => setActiveTab('search_name')}
            className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
              activeTab === 'search_name'
                ? 'bg-[#0066cc] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            अपना नाम खोजें
          </button>
          <button
            onClick={() => setActiveTab('ero_list')}
            className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
              activeTab === 'ero_list'
                ? 'bg-[#0066cc] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            मतदाता सूची (ERO)
          </button>
          <button
            onClick={() => setActiveTab('awareness')}
            className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
              activeTab === 'awareness'
                ? 'bg-[#0066cc] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            जागरूकता
          </button>
        </div>
      </div>

      {/* 2 Main Action Cards matching mockup */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Card 1: मतदाता पंजीकरण */}
        <div className="bg-slate-50/70 border border-slate-200/90 rounded-2xl p-6 shadow-xs hover:border-blue-400 hover:shadow-md transition flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <Vote className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900">
                मतदाता पंजीकरण
              </h4>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                नए मतदाता पंजीकरण, संशोधन या स्थानांतरण के लिए भारत निर्वाचन आयोग की आधिकारिक वेबसाइट पर जाएं।
              </p>
            </div>
            <ul className="text-[11px] text-slate-600 space-y-1">
              <li className="flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                <span>फॉर्म 6: नया मतदाता पहचान पत्र (18 वर्ष पूर्ण)</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                <span>फॉर्म 8: पता, नाम व फोटो संशोधन</span>
              </li>
            </ul>
          </div>

          <div>
            <a
              href="https://voters.eci.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 bg-[#0066cc] hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition shadow-2xs flex items-center justify-center space-x-2"
            >
              <span>आधिकारिक पोर्टल खोलें</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Card 2: अपना नाम सूची में देखें */}
        <div className="bg-slate-50/70 border border-slate-200/90 rounded-2xl p-6 shadow-xs hover:border-purple-400 hover:shadow-md transition flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <Search className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900">
                अपना नाम सूची में देखें
              </h4>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                मतदाता सूची में अपना नाम, पोलिंग स्टेशन, क्रम संख्या और अन्य विवरण देखें।
              </p>
            </div>

            {/* Quick in-app EPIC Search */}
            <form onSubmit={handleEpicSearch} className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="उदा. XYZ1234567 या नाम"
                  value={searchEpic}
                  onChange={(e) => setSearchEpic(e.target.value)}
                  className="flex-1 bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs uppercase"
                />
                <button
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs px-3 py-2 rounded-xl transition"
                >
                  खोजें
                </button>
              </div>
            </form>

            {searchResult && (
              <div className="bg-white border border-purple-200 rounded-xl p-3 text-xs space-y-1 shadow-2xs">
                <div className="font-bold text-purple-900 flex items-center justify-between">
                  <span>{searchResult.name}</span>
                  <span className="font-mono text-[10px] bg-purple-50 px-1.5 py-0.5 rounded">{searchResult.epic}</span>
                </div>
                <div className="text-[11px] text-slate-600">पिता: {searchResult.fatherName}</div>
                <div className="text-[11px] text-slate-600">मतदान केंद्र: {searchResult.pollingStation}</div>
                <div className="text-[10px] text-slate-400">भाग संख्या: {searchResult.partNo} • क्रम: {searchResult.serialNo}</div>
              </div>
            )}
          </div>

          <div>
            <a
              href="https://electoralsearch.eci.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 bg-white hover:bg-purple-50 text-purple-700 border border-purple-300 font-bold rounded-xl text-xs transition shadow-2xs flex items-center justify-center space-x-2"
            >
              <span>मतदाता सूची खोजें</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

      </div>

    </div>
  );
};
