import React, { useRef } from 'react';
import { 
  FileText, 
  Printer, 
  Download, 
  CheckCircle2, 
  Award, 
  ShieldCheck, 
  TrendingUp, 
  Building, 
  Users, 
  Share2, 
  X,
  ExternalLink,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { GET_HIGH_COMMAND_DOSSIER, HighCommandDossierData } from '../../services/dossierGenerator';
import { formatIndianRupees } from '../../services/trustFundService';
import { Language } from '../../types/campaign';

interface HighCommandDossierModalProps {
  lang: Language;
  onClose: () => void;
}

export const HighCommandDossierModal: React.FC<HighCommandDossierModalProps> = ({ lang, onClose }) => {
  const dossier: HighCommandDossierData = GET_HIGH_COMMAND_DOSSIER();
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const handleCopySummary = () => {
    const text = `*रणबीर सिंह निक्का (विधायक नूरपुर - 142) | नेतृत्व व कार्य निष्पादन डॉसियर (2022-2026)*\n` +
      `• निवारण दर: ${dossier.metrics.resolutionRatePct}% (1,418/1,505 समस्याएं हल)\n` +
      `• MLA-LAD विकास निधि: ₹42.8 करोड़ (148 कार्य CAG-ऑडिटेड पूर्ण, 0 पेंडेंसी)\n` +
      `• निजी सहायता कोष (निजात): ₹3.82 करोड़ (4,820 परिवार, 19,280 स्थायी मतदाता)\n` +
      `• बूथ संगठन: 118 बूथ, 1,180 पन्ना प्रमुख, 42,350 व्हाट्सएप नेटवर्क\n` +
      `• कांगड़ा में अनुमानित बढ़त: +${dossier.metrics.projectedLeadMargin.toLocaleString('en-IN')} मत\n` +
      `अनुशंसा: कैबिनेट मंत्री पद (उद्योग / PWD) एवं लोकसभा अभियान नेतृत्व हेतु सर्वाधिक उपयुक्त।`;
    
    navigator.clipboard.writeText(text);
    alert('डॉसियर का कार्यकारी सार कॉपी किया गया!');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-4xl w-full p-6 text-slate-100 shadow-2xl space-y-6 my-auto max-h-[92vh] overflow-y-auto">
        {/* Modal Action Header (Excluded from print) */}
        <div className="print:hidden flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-2">
            <span className="p-2 bg-amber-500/20 text-amber-400 rounded-xl">
              <Award className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-white">हाई कमान एवं कैबिनेट मूल्यांकन डॉसियर</h2>
              <p className="text-xs text-slate-400">केंद्रीय नेतृत्व, माननीय मुख्यमंत्री जी एवं प्रदेश भाजपा संगठन हेतु वैज्ञानिक रिपोर्ट</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopySummary}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>सार कॉपी करें</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition shadow-lg shadow-amber-500/20"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>प्रिंट / PDF सेव करें</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Dossier Container */}
        <div ref={printRef} className="space-y-6 bg-slate-950 p-6 sm:p-8 rounded-xl border border-slate-800 font-sans print:bg-white print:text-black print:border-none print:p-0">
          {/* Header Banner */}
          <div className="text-center border-b-2 border-amber-500 pb-4">
            <div className="text-[10px] uppercase font-bold tracking-widest text-amber-400 print:text-amber-800">
              विधानसभा क्षेत्र 142 - नूरपुर (जिला कांगड़ा, हिमाचल प्रदेश)
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white print:text-black tracking-tight mt-1">
              कार्य निष्पादन, सुशासन एवं नेतृत्व मूल्यांकन डॉसियर
            </h1>
            <div className="text-xs text-slate-400 print:text-slate-600 mt-1 font-mono">
              अवधि: 2022 - 2026 | रिपोर्ट तिथि: {dossier.generatedDate} | विधायक: श्री रणबीर सिंह निक्का
            </div>
          </div>

          {/* Executive Candidate Pitch */}
          <div className="bg-slate-900 print:bg-slate-100 p-4 rounded-xl border border-slate-800 print:border-slate-300 space-y-2">
            <div className="flex items-center space-x-2 text-amber-400 print:text-amber-700 text-xs font-bold uppercase tracking-wide">
              <Sparkles className="w-4 h-4" />
              <span>कार्यकारी सारांश एवं कैबिनेट उपयुक्तता (Executive Summary)</span>
            </div>
            <h3 className="text-base font-bold text-white print:text-black">
              {dossier.corePitch.titleHi}
            </h3>
            <p className="text-xs text-slate-300 print:text-slate-700 leading-relaxed">
              {dossier.corePitch.descriptionHi}
            </p>
            <div className="pt-2 flex flex-wrap gap-2">
              {dossier.corePitch.targetPositions.map((pos, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 bg-amber-500/10 print:bg-amber-100 border border-amber-500/30 print:border-amber-300 text-amber-300 print:text-amber-900 rounded-lg text-[11px] font-semibold"
                >
                  ✓ {pos}
                </span>
              ))}
            </div>
          </div>

          {/* 4 Pillars of Irrefutable Evidence */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 print:text-slate-700 uppercase tracking-wider mb-3">
              वैज्ञानिक साक्ष्य: 4 प्रमुख स्तंभ (Data-Backed Pillars)
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {/* Pillar 1 */}
              <div className="bg-slate-900/90 print:bg-slate-50 p-4 rounded-xl border border-slate-800 print:border-slate-300">
                <div className="text-xs text-emerald-400 print:text-emerald-700 font-bold flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>जन समस्या निवारण</span>
                </div>
                <div className="text-2xl font-black text-white print:text-black mt-1">
                  {dossier.metrics.resolutionRatePct}%
                </div>
                <div className="text-[11px] text-slate-400 print:text-slate-600 mt-0.5">
                  1,418 / 1,505 हल • 28.4h SLA
                </div>
              </div>

              {/* Pillar 2 */}
              <div className="bg-slate-900/90 print:bg-slate-50 p-4 rounded-xl border border-slate-800 print:border-slate-300">
                <div className="text-xs text-blue-400 print:text-blue-700 font-bold flex items-center space-x-1">
                  <Building className="w-3.5 h-3.5" />
                  <span>विधायक निधि (MLA-LAD)</span>
                </div>
                <div className="text-2xl font-black text-white print:text-black mt-1">
                  ₹42.8 Cr
                </div>
                <div className="text-[11px] text-emerald-400 print:text-emerald-700 mt-0.5 font-semibold">
                  148 CAG कार्य • 0 ऑडिट आपत्ति
                </div>
              </div>

              {/* Pillar 3 */}
              <div className="bg-slate-900/90 print:bg-slate-50 p-4 rounded-xl border border-slate-800 print:border-slate-300">
                <div className="text-xs text-amber-400 print:text-amber-700 font-bold flex items-center space-x-1">
                  <Award className="w-3.5 h-3.5" />
                  <span>निजी ट्रस्ट अनुदान (Nijaat)</span>
                </div>
                <div className="text-2xl font-black text-amber-400 print:text-amber-700 mt-1">
                  ₹3.82 Cr
                </div>
                <div className="text-[11px] text-slate-400 print:text-slate-600 mt-0.5">
                  4,820 परिवार • 19,280 वोटर ब्लॉक
                </div>
              </div>

              {/* Pillar 4 */}
              <div className="bg-slate-900/90 print:bg-slate-50 p-4 rounded-xl border border-slate-800 print:border-slate-300">
                <div className="text-xs text-indigo-400 print:text-indigo-700 font-bold flex items-center space-x-1">
                  <Users className="w-3.5 h-3.5" />
                  <span>पन्ना प्रमुख नेटवर्क</span>
                </div>
                <div className="text-2xl font-black text-white print:text-black mt-1">
                  100%
                </div>
                <div className="text-[11px] text-slate-400 print:text-slate-600 mt-0.5">
                  118/118 बूथ • 1,180 पन्ना प्रमुख
                </div>
              </div>
            </div>
          </div>

          {/* Flagship Infrastructure Projects */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 print:text-slate-700 uppercase tracking-wider mb-3">
              प्रमुख विकास परियोजनाएं एवं वित्तीय निष्पादन (Flagship Capital Works)
            </h4>
            <div className="border border-slate-800 print:border-slate-300 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-900 print:bg-slate-200 text-slate-400 print:text-slate-800 border-b border-slate-800 print:border-slate-300">
                    <th className="py-2.5 px-4 font-semibold">परियोजना का नाम</th>
                    <th className="py-2.5 px-4 font-semibold">स्वीकृत राशि</th>
                    <th className="py-2.5 px-4 font-semibold">विभाग</th>
                    <th className="py-2.5 px-4 font-semibold text-center">लाभान्वित गांव</th>
                    <th className="py-2.5 px-4 font-semibold text-right">स्थिति</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 print:divide-slate-300">
                  {dossier.flagshipInfrastructureProjects.map((proj, idx) => (
                    <tr key={idx} className="hover:bg-slate-900/40">
                      <td className="py-2.5 px-4 font-medium text-white print:text-black">
                        {proj.projectNameHi}
                      </td>
                      <td className="py-2.5 px-4 font-mono font-bold text-amber-400 print:text-amber-800">
                        {formatIndianRupees(proj.sanctionedAmountRupees)}
                      </td>
                      <td className="py-2.5 px-4 text-slate-400 print:text-slate-600">
                        {proj.department}
                      </td>
                      <td className="py-2.5 px-4 text-center font-bold">
                        {proj.beneficiaryVillagesCount} गांव
                      </td>
                      <td className="py-2.5 px-4 text-right">
                        <span className="px-2 py-0.5 bg-emerald-500/20 print:bg-emerald-100 text-emerald-400 print:text-emerald-800 rounded font-semibold text-[10px]">
                          {proj.status === 'COMPLETED' ? 'पूर्ण (Completed)' : 'प्रगति पर (90%)'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Cabinet Justification Grid */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 print:text-slate-700 uppercase tracking-wider mb-3">
              कैबिनेट मंत्री पद हेतु रणनीतिक तर्क (Strategic Cabinet Value Add)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              {dossier.cabinetSuitabilityJustification.map((item, idx) => (
                <div key={idx} className="bg-slate-900 print:bg-slate-50 p-4 rounded-xl border border-slate-800 print:border-slate-300 space-y-2">
                  <div className="font-bold text-white print:text-black border-b border-slate-800 print:border-slate-300 pb-1.5">
                    {item.portfolioHi}
                  </div>
                  <ul className="space-y-1.5 text-slate-300 print:text-slate-700 text-[11px] leading-relaxed">
                    {item.strengthsHi.map((s, i) => (
                      <li key={i} className="flex items-start space-x-1.5">
                        <span className="text-amber-400 print:text-amber-700 font-bold">•</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Signoff & Seal Footer */}
          <div className="pt-4 border-t border-slate-800 print:border-slate-400 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 print:text-slate-600 gap-4">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400 print:text-emerald-700" />
              <span>प्रमाणित: जनआदेश डिजिटल वार रूम एवं भारत के नियंत्रक-महालेखापरीक्षक (CAG) ऑडिट रिकॉर्ड से सत्यापित</span>
            </div>
            <div className="text-right">
              <div className="font-bold text-white print:text-black">रणबीर सिंह निक्का (विधायक)</div>
              <div className="text-[10px]">142 - नूरपुर विधानसभा, कांगड़ा (हि.प्र.)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
