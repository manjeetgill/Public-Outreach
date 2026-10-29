import React from 'react';
import { X, Award, MapPin, Phone, Mail, Building, CheckCircle2 } from 'lucide-react';
import { Language } from '../../types/campaign';
import { MLA_INFO } from '../../data/campaignData';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose, lang }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl border border-slate-200 max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto animate-in fade-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <h3 className="font-black text-slate-900 text-base">
              परिचय • विधायक रणबीर सिंह निक्का
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Card */}
        <div className="flex items-center space-x-4 bg-blue-50/60 p-4 rounded-2xl border border-blue-100">
          <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-white shadow-md bg-slate-200 shrink-0">
            <img
              src={MLA_INFO.photoUrl}
              alt="Ranbir Singh Nikka"
              className="w-full h-full object-cover object-top"
            />
          </div>
          <div>
            <h4 className="text-base font-black text-[#102a43]">
              {MLA_INFO.name}
            </h4>
            <p className="text-xs font-semibold text-slate-700">
              {MLA_INFO.title}
            </p>
            <p className="text-[11px] text-blue-700 font-bold mt-0.5">
              {MLA_INFO.constituency}
            </p>
            <div className="text-[10px] text-amber-800 font-bold bg-amber-100 px-2 py-0.5 rounded-full inline-block mt-1">
              {MLA_INFO.slogan}
            </div>
          </div>
        </div>

        {/* Bio Narrative */}
        <div className="space-y-2.5 text-xs text-slate-700 leading-relaxed">
          <p>
            श्री रणबीर सिंह निक्का नूरपुर विधानसभा क्षेत्र (कांगड़ा, हिमाचल प्रदेश) के लोकप्रिय जनप्रतिनिधि हैं। जनसेवा को अपना प्राथमिक धर्म मानते हुए उन्होंने नूरपुर के बुनियादी ढांचे, सड़क संपर्क, स्वास्थ्य सेवाओं, पेयजल परियोजनाओं और महिला सशक्तिकरण के क्षेत्र में ऐतिहासिक उपलब्धियां हासिल की हैं।
          </p>
          <p>
            "घर-घर निक्का, हर घर निक्का" संकल्प के तहत वे बिना किसी भेदभाव के प्रत्येक नागरिक की समस्या का मौके पर समाधान करने के लिए निरंतर पदयात्राओं और चौपालों का आयोजन करते हैं।
          </p>
        </div>

        {/* Key Achievements Points */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
          <h5 className="font-bold text-slate-900">प्रमुख जन-उपलब्धियां:</h5>
          <ul className="space-y-1.5 text-slate-600">
            <li className="flex items-center space-x-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>₹42+ करोड़ की विधायक निधि से 148 विकास योजनाएं पूर्ण</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>नूरपुर 4-लेन बाईपास रिंग रोड एवं सोलर प्रकाश व्यवस्था</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>100-बेड सुपर स्पेशियलिटी अस्पताल का शिलान्यास व प्रगति</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>94.2% नागरिक शिकायतों का 48 घंटे के भीतर त्वरित निवारण</span>
            </li>
          </ul>
        </div>

        {/* Secretariat Office Contact Details */}
        <div className="text-xs text-slate-600 space-y-1 pt-1">
          <div><b>मुख्य कार्यालय:</b> {MLA_INFO.campOfficeAddress}</div>
          <div><b>टोल फ्री हेल्पलाइन:</b> {MLA_INFO.helpline} • <b>व्हाट्सएप:</b> {MLA_INFO.whatsappNumber}</div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="bg-[#0066cc] hover:bg-blue-700 text-white font-bold text-xs px-5 py-2 rounded-xl transition"
          >
            समझ गया (Close)
          </button>
        </div>

      </div>
    </div>
  );
};
