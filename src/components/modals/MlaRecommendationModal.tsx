import React, { useState } from 'react';
import { 
  X, 
  FileText, 
  Printer, 
  Share2, 
  CheckCircle, 
  ShieldCheck, 
  Building, 
  QrCode, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { MlaLetterRecord, Language } from '../../types/campaign';

interface MlaRecommendationModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const MlaRecommendationModal: React.FC<MlaRecommendationModalProps> = ({
  isOpen,
  onClose,
  lang
}) => {
  const [citizenName, setCitizenName] = useState('');
  const [guardianName, setGuardianName] = useState('');
  const [villageOrWard, setVillageOrWard] = useState('वार्ड 08 भदवार, नूरपुर');
  const [mobile, setMobile] = useState('');
  const [category, setCategory] = useState('विद्युत ट्रांसफार्मर अपग्रेड / तार मरम्मत');
  const [details, setDetails] = useState('');

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedLetter, setGeneratedLetter] = useState<MlaLetterRecord | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!citizenName.trim() || !villageOrWard.trim()) return;

    setIsGenerating(true);
    try {
      const response = await fetch('/api/letters/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          citizenName: citizenName.trim(),
          guardianName: guardianName.trim(),
          villageOrWard: villageOrWard.trim(),
          mobile: mobile.trim() || '98160*****',
          category,
          details: details.trim()
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.letter) {
          setGeneratedLetter(data.letter);
        }
      }
    } catch (err) {
      console.error('Error generating letter:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleShareWhatsApp = () => {
    if (!generatedLetter) return;
    const text = `🏛️ *विधायक संस्तुति पत्र (Official MLA Recommendation)*
विधानसभा: 142 नूरपुर (कांगड़ा)
विधायक: रणबीर सिंह निक्का
────────────────────
📄 *क्रमांक:* ${generatedLetter.dispatchNo}
👤 *प्रार्थी:* ${generatedLetter.citizenName} (${generatedLetter.villageOrWard})
🏢 *प्रेषित विभाग:* ${generatedLetter.targetDepartment}
📌 *विषय:* ${generatedLetter.subject}
────────────────────
कैंप कार्यालय नूरपुर द्वारा आधिकारिक संस्तुति पत्र निर्गत किया गया है।`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#102a43] to-[#1c3d5a] text-white p-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500 text-slate-950 rounded-xl">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white">
                {lang === 'hi' ? 'एक-क्लिक विधायक संस्तुति पत्र जनरेटर' : 'One-Click Official MLA Recommendation Letter'}
              </h3>
              <p className="text-[11px] text-slate-300">
                प्राथमिकता आदेश • आधिकारिक डिस्पैच रजिस्टर पंजीयन • डिजिटल हस्ताक्षर
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="बंद करें (Close Modal)"
            className="text-slate-300 hover:text-white p-1 rounded-lg hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {!generatedLetter ? (
            <form onSubmit={handleGenerate} className="space-y-3.5">
              <div className="bg-amber-50 p-3 rounded-2xl border border-amber-200 text-xs text-amber-900">
                जब किसी नागरिक के सार्वजनिक कार्य (ट्रांसफार्मर, पेयजल लाइन, सोलिंग, मुख्यमंत्री राहत) में विभागीय विलंब हो रहा हो, तो कैंप कार्यालय के डिस्पैच रजिस्टर से तुरंत आधिकारिक संस्तुति पत्र जारी करें।
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    नागरिक का नाम *
                  </label>
                  <input
                    type="text"
                    required
                    value={citizenName}
                    onChange={(e) => setCitizenName(e.target.value)}
                    placeholder="उदा. कुलदीप सिंह"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 font-semibold"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    पिता / पति का नाम
                  </label>
                  <input
                    type="text"
                    value={guardianName}
                    onChange={(e) => setGuardianName(e.target.value)}
                    placeholder="उदा. श्री करनैल सिंह"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    गांव / वार्ड का नाम *
                  </label>
                  <input
                    type="text"
                    required
                    value={villageOrWard}
                    onChange={(e) => setVillageOrWard(e.target.value)}
                    placeholder="उदा. वार्ड 08 भदवार, नूरपुर"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 font-semibold"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    मोबाइल नंबर (व्हाट्सएप हेतु)
                  </label>
                  <input
                    type="tel"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="98160*****"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  कार्य / संस्तुति श्रेणी *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white font-bold"
                >
                  <option value="विद्युत ट्रांसफार्मर अपग्रेड / तार मरम्मत">विद्युत ट्रांसफार्मर अपग्रेड / तार मरम्मत (HPSEBL)</option>
                  <option value="पेयजल हैंडपंप / पाइपलाइन बिछाना">पेयजल हैंडपंप / पाइपलाइन बिछाना (जल शक्ति विभाग)</option>
                  <option value="सड़क सोलिंग / डंगा निर्माण">रास्ता सोलिंग / बाढ़ सुरक्षा डंगा निर्माण (PWD/BDO)</option>
                  <option value="मुख्यमंत्री राहत कोष / गंभीर बीमारी सहायता">मुख्यमंत्री राहत कोष (CMRF) गंभीर बीमारी सहायता</option>
                  <option value="राशन कार्ड बीपीएल संशोधन / अन्य">राशन कार्ड बीपीएल संशोधन / अन्य प्रशासनिक संस्तुति</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  विशेष विवरण / नागरिक की मांग
                </label>
                <textarea
                  rows={3}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="नागरिक की समस्या या विशिष्ट स्थल का विवरण (जैसे: 63kVA को 100kVA में बदलना)..."
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 font-medium"
                />
              </div>

              <button
                type="submit"
                disabled={isGenerating}
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black rounded-xl text-xs transition shadow-md flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <span>{isGenerating ? 'पत्र तैयार हो रहा है...' : 'आधिकारिक संस्तुति पत्र जारी करें'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            /* Letterhead Preview */
            <div className="space-y-4">
              {/* Actual Letterhead to Print */}
              <div 
                id="printable-mla-letter"
                className="bg-white border-2 border-slate-800 rounded-2xl p-6 shadow-md text-slate-900 relative font-serif"
              >
                {/* Official Letterhead Header */}
                <div className="border-b-2 border-amber-600 pb-3 mb-4 text-center relative">
                  <div className="flex items-center justify-between mb-1 text-[11px] font-sans font-bold text-slate-600">
                    <span>विधानसभा क्षेत्र 142 नूरपुर</span>
                    <span>कैंप कार्यालय: नूरपुर (कांगड़ा)</span>
                  </div>

                  <h2 className="text-xl font-black text-slate-950 font-serif">
                    रणबीर सिंह निक्का
                  </h2>
                  <p className="text-xs font-bold text-amber-700 font-sans">
                    विधायक, 142-नूरपुर विधानसभा क्षेत्र • पूर्व उपाध्यक्ष राज्य नागरिक आपूर्ति निगम
                  </p>
                  <p className="text-[10px] text-slate-500 font-sans mt-0.5">
                    निवास / कार्यालय: निकट सिविल कोर्ट, नूरपुर, जिला कांगड़ा (हि.प्र.) • फोन: 01893-XXXXXX
                  </p>

                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-200 text-xs font-sans font-bold">
                    <span className="text-amber-900 bg-amber-50 px-2.5 py-0.5 rounded border border-amber-300">
                      क्रमांक: {generatedLetter.dispatchNo}
                    </span>
                    <span className="text-slate-600">
                      दिनांक: {new Date(generatedLetter.issuedAt).toLocaleDateString('hi-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                </div>

                {/* Salutation & To */}
                <div className="space-y-2 text-xs leading-relaxed">
                  <div>
                    <span className="font-bold block">सेवा में,</span>
                    <span className="font-bold block text-slate-950">{generatedLetter.targetOfficer}</span>
                    <span className="text-slate-700 block">{generatedLetter.targetDepartment}</span>
                  </div>

                  <div className="pt-2">
                    <span className="font-bold">विषय: </span>
                    <span className="font-bold underline text-slate-950">{generatedLetter.subject}</span>
                  </div>

                  {/* Body Text */}
                  <div className="pt-2 whitespace-pre-line text-slate-800 leading-relaxed text-justify">
                    {generatedLetter.letterBodyHindi}
                  </div>

                  {/* Sign & Stamp */}
                  <div className="pt-6 flex items-end justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-12 bg-slate-100 border border-slate-300 rounded flex flex-col items-center justify-center p-1">
                        <QrCode className="w-7 h-7 text-slate-800" />
                        <span className="text-[7px] font-mono font-bold">सत्यापित</span>
                      </div>
                      <div className="text-[10px] text-slate-500 font-sans">
                        <span>डिजिटल सत्यापन टोकन:</span>
                        <div className="font-mono font-bold text-slate-800">{generatedLetter.qrCodeToken}</div>
                      </div>
                    </div>

                    <div className="text-center font-sans">
                      <div className="text-xs font-bold text-slate-400 italic mb-1">
                        [हस्ताक्षरित • विधायक कैंप कार्यालय]
                      </div>
                      <div className="font-serif font-black text-sm text-slate-950">
                        (रणबीर सिंह निक्का)
                      </div>
                      <div className="text-[10px] text-slate-600 font-bold">
                        विधायक, 142 नूरपुर
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setGeneratedLetter(null)}
                  className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition cursor-pointer"
                >
                  नया पत्र बनाएं
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleShareWhatsApp}
                    className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-xs transition shadow-md flex items-center gap-1.5 cursor-pointer"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>व्हाट्सएप पर भेजें</span>
                  </button>

                  <button
                    type="button"
                    onClick={handlePrint}
                    className="py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-amber-400 font-extrabold rounded-xl text-xs transition shadow-md flex items-center gap-1.5 cursor-pointer border border-slate-700"
                  >
                    <Printer className="w-4 h-4 text-amber-400" />
                    <span>पत्र प्रिंट करें</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
