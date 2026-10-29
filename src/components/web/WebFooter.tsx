import React from 'react';
import { 
  Building, 
  MapPin, 
  Phone, 
  Mail, 
  ShieldCheck, 
  ExternalLink,
  Heart,
  FileText
} from 'lucide-react';
import { MLA_INFO } from '../../data/campaignData';
import { ScreenTab, Language } from '../../types/campaign';

interface WebFooterProps {
  onSelectTab: (tab: ScreenTab) => void;
  lang: Language;
}

export const WebFooter: React.FC<WebFooterProps> = ({ onSelectTab, lang }) => {
  return (
    <footer className="bg-[#0b1b2b] text-slate-300 border-t border-[#102a43] mt-12 text-xs shadow-2xl">
      
      {/* Top Banner inside Footer */}
      <div className="bg-[#071320] py-6 border-b border-[#102a43] px-4 sm:px-6">
        <div className="max-w-[1720px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img 
              src={MLA_INFO.photoUrl} 
              alt={MLA_INFO.name} 
              className="w-12 h-12 rounded-xl object-cover border-2 border-amber-400 shadow-md"
            />
            <div>
              <h3 className="text-sm font-extrabold text-white">
                {lang === 'hi' ? MLA_INFO.name : MLA_INFO.nameEn}
              </h3>
              <p className="text-xs text-amber-400 font-bold">
                {lang === 'hi' ? MLA_INFO.slogan : MLA_INFO.sloganEn}
              </p>
              <p className="text-[11px] text-slate-400 font-medium">
                {lang === 'hi' ? 'सक्रिय विधायक एवं समर्पित जनसेवक • नूरपुर (142)' : 'MLA Nurpur Assembly Constituency 142'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a 
              href="tel:1800123456" 
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl flex items-center gap-1.5 transition shadow-sm"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{lang === 'hi' ? 'टोल फ्री: 1800-123-456' : 'Toll Free: 1800-123-456'}</span>
            </a>
            <a 
              href="https://wa.me/919816000000" 
              target="_blank" 
              rel="noreferrer" 
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center gap-1.5 transition shadow-sm"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>{lang === 'hi' ? 'व्हाट्सएप सहायता' : 'WhatsApp Desk'}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer Grid */}
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 py-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        
        {/* Col 1: About Office */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <span className="font-extrabold text-white text-sm">
              जनादेश • नागरिक सेवा सचिवालय
            </span>
          </div>
          <p className="text-slate-400 leading-relaxed text-[11px]">
            {lang === 'hi' 
              ? 'रणबीर सिंह निक्का, विधायक नूरपुर का आधिकारिक जन सेवा एवं शिकायत निवारण पोर्टल। पारदर्शिता, त्वरित निर्णय और जवाबदेही हमारी प्रतिबद्धता है।'
              : 'Official civic interface and governance transparency desk of Ranbir Singh Nikka, MLA Nurpur Assembly Constituency.'}
          </p>
          <div className="text-[11px] text-slate-300 space-y-1">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>कैंप रोड, निकट कोर्ट परिसर, नूरपुर (कांगड़ा) - 176202</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span>mla.nurpur142@hp.gov.in</span>
            </div>
          </div>
        </div>

        {/* Col 2: Fast Navigation */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">
            {lang === 'hi' ? 'महत्वपूर्ण अनुभाग' : 'Key Sections'}
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <button 
                onClick={() => onSelectTab('screen-home')} 
                className="hover:text-amber-400 transition flex items-center gap-1 text-slate-300"
              >
                <span>› मुख्य जनसंवाद पृष्ठ (Home Page)</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => onSelectTab('screen-services')} 
                className="hover:text-amber-400 transition flex items-center gap-1 text-slate-300"
              >
                <span>› समस्या दर्ज करें (Report an Issue)</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => onSelectTab('screen-work')} 
                className="hover:text-amber-400 transition flex items-center gap-1 text-slate-300"
              >
                <span>› हमारे कार्य एवं उपलब्धियां (Work & Achievements)</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => onSelectTab('screen-constituency')} 
                className="hover:text-amber-400 transition flex items-center gap-1 text-slate-300"
              >
                <span>› क्षेत्रीय मानचित्र व 24 वार्ड (Constituency Map)</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => onSelectTab('screen-voter')} 
                className="hover:text-amber-400 transition flex items-center gap-1 text-slate-300"
              >
                <span>› मतदाता जानकारी (Voter Information)</span>
              </button>
            </li>
          </ul>
        </div>

        {/* Col 3: Direct Civic Services */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">
            {lang === 'hi' ? 'नागरिक सेवाएं एवं अधिकार' : 'Citizen Services'}
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <button 
                onClick={() => onSelectTab('screen-citizen-dashboard')} 
                className="hover:text-amber-400 transition flex items-center gap-1 text-slate-300"
              >
                <span>› मेरी डैशबोर्ड व शिकायत स्थिति</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => onSelectTab('screen-events')} 
                className="hover:text-amber-400 transition flex items-center gap-1 text-slate-300"
              >
                <span>› आगामी कार्यक्रम व पदयात्रा चौपाल</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => onSelectTab('screen-admin')} 
                className="hover:text-amber-400 transition flex items-center gap-1 font-bold text-amber-400"
              >
                <span>› विधायक वॉर रूम व निर्णय डेस्क (Admin)</span>
              </button>
            </li>
            <li>
              <a 
                href="https://voters.eci.gov.in" 
                target="_blank" 
                rel="noreferrer" 
                className="hover:text-amber-400 transition flex items-center gap-1 text-slate-300"
              >
                <span>› भारत निर्वाचन आयोग (ECI Portal) ↗</span>
              </a>
            </li>
          </ul>
        </div>

        {/* Col 4: Public Transparency Notice */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">
            {lang === 'hi' ? 'पारदर्शिता एवं प्रामाणिकता' : 'Transparency Notice'}
          </h4>
          <div className="bg-[#0e2238] p-3.5 rounded-2xl border border-[#1c3856] space-y-2 text-[11px]">
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>सत्यापित सार्वजनिक अभिलेख</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              पोर्टल पर दर्शाए गए समस्त बजट आंकड़े, वित्तीय स्वीकृतियां और कार्य प्रगति हिमाचल प्रदेश सरकार के विभागों द्वारा प्रमाणित हैं।
            </p>
          </div>
        </div>

      </div>

      {/* Bottom Copyright */}
      <div className="border-t border-[#102a43] py-4 px-4 sm:px-6 bg-[#071320] text-center text-[11px] text-slate-400">
        <div className="max-w-[1720px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} जनादेश • विधायक रणबीर सिंह निक्का, नूरपुर विधानसभा क्षेत्र 142। सर्वाधिकार सुरक्षित।</p>
          <div className="flex items-center space-x-4">
            <span className="text-slate-500">जन सेवा सर्वोपरि</span>
            <span className="text-slate-600">|</span>
            <span className="text-emerald-400 font-semibold">HP Vidhan Sabha 142</span>
          </div>
        </div>
      </div>

    </footer>
  );
};
