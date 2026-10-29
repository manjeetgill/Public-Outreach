import React, { useState } from 'react';
import { 
  CheckCircle, 
  MapPin, 
  UploadCloud, 
  ArrowRight, 
  ArrowLeft, 
  FileCheck, 
  AlertTriangle,
  Clock,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Language, GrievanceTicket } from '../../types/campaign';

interface ReportIssueSectionProps {
  lang: Language;
  onSubmitSuccess?: (newTicket: GrievanceTicket) => void;
}

export const ReportIssueSection: React.FC<ReportIssueSectionProps> = ({
  lang,
  onSubmitSuccess
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [category, setCategory] = useState('सड़क (Roads)');
  const [description, setDescription] = useState('');
  const [wardNo, setWardNo] = useState(5);
  const [citizenName, setCitizenName] = useState('');
  const [phone, setPhone] = useState('');
  const [locationText, setLocationText] = useState('वार्ड 5, राजकीय वरिष्ठ माध्यमिक विद्यालय के पास');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [submittedTicket, setSubmittedTicket] = useState<GrievanceTicket | null>(null);

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      if (!description.trim()) return;
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else {
      // Final submission
      const newTicketId = 'C-' + Math.floor(1043 + Math.random() * 50);
      const ticket: GrievanceTicket = {
        token: newTicketId,
        category,
        title: description.slice(0, 40) + '...',
        titleEn: description.slice(0, 40) + '...',
        location: locationText,
        wardNo,
        citizenName: citizenName || 'स्थानीय नागरिक',
        phone: phone || '+91 94180-XXXXX',
        submittedDate: new Date().toLocaleDateString('hi-IN'),
        status: 'in-progress',
        whatsappSubscribed: true,
        timeline: [
          {
            title: 'समस्या प्राप्त हुई',
            titleEn: 'Grievance Registered',
            timestamp: 'Just Now',
            description: 'पोर्टल पर समस्या सफलतापूर्वक दर्ज हुई।',
            descriptionEn: 'Grievance recorded on Janadesh Portal',
            status: 'done'
          },
          {
            title: 'विभागीय समीक्षा',
            titleEn: 'Department Review',
            timestamp: 'आगामी 24 घंटे',
            description: 'अधिशासी अभियंता को आवश्यक कार्यवाही हेतु प्रेषित।',
            descriptionEn: 'Forwarded to Executive Engineer',
            status: 'current'
          }
        ]
      };

      setSubmittedTicket(ticket);
      if (onSubmitSuccess) onSubmitSuccess(ticket);

      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-md p-5 sm:p-7">
      
      {/* Header matching Card 2 */}
      <div className="mb-6 pb-4 border-b border-slate-100">
        <h3 className="text-xl sm:text-2xl font-black text-[#102a43]">
          समस्या दर्ज करें
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          अपने क्षेत्र की समस्या हमें बताएं। हम इसे संबंधित विभाग तक पहुँचाएंगे
        </p>
      </div>

      {submittedTicket ? (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-3">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h4 className="text-lg font-bold text-emerald-950">
            आपकी समस्या सफलतापूर्वक दर्ज कर ली गई है!
          </h4>
          <p className="text-xs text-emerald-800 max-w-md mx-auto">
            ट्रैकिंग टोकन संख्या: <strong className="font-mono text-sm bg-white px-2 py-0.5 rounded border border-emerald-300">{submittedTicket.token}</strong>
            <br />
            आपके दिए गए मोबाइल नंबर पर एसएमएस द्वारा अद्यतन भेजा जाएगा।
          </p>
          <div className="pt-2">
            <button
              onClick={() => {
                setSubmittedTicket(null);
                setStep(1);
                setDescription('');
              }}
              className="bg-[#0066cc] hover:bg-blue-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs transition"
            >
              + अन्य समस्या दर्ज करें
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Form: Stepper + Inputs (8 Cols) */}
          <div className="lg:col-span-7 space-y-5">
            
            {/* Stepper matching mockup */}
            <div className="flex items-center space-x-3 text-xs font-semibold">
              <div className={`flex items-center space-x-1.5 ${step === 1 ? 'text-blue-600 font-bold' : 'text-slate-400'}`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                  step === 1 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'
                }`}>1</span>
                <span>विवरण भरें</span>
              </div>
              <span className="text-slate-300">──</span>
              <div className={`flex items-center space-x-1.5 ${step === 2 ? 'text-blue-600 font-bold' : 'text-slate-400'}`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                  step === 2 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'
                }`}>2</span>
                <span>स्थान चुनें</span>
              </div>
              <span className="text-slate-300">──</span>
              <div className={`flex items-center space-x-1.5 ${step === 3 ? 'text-blue-600 font-bold' : 'text-slate-400'}`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                  step === 3 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'
                }`}>3</span>
                <span>पुष्टि करें</span>
              </div>
            </div>

            <form onSubmit={handleNext} className="space-y-4 text-xs sm:text-sm">
              
              {step === 1 && (
                <div className="space-y-3.5">
                  <div>
                    <label className="block font-bold text-slate-800 mb-1 text-xs">
                      समस्या का प्रकार <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-medium focus:ring-1 focus:ring-blue-500 focus:bg-white"
                    >
                      <option>सड़क (Roads)</option>
                      <option>पेयजल (Water Supply)</option>
                      <option>स्वास्थ्य सेवाएं (Healthcare)</option>
                      <option>बिजली व ट्रांसफार्मर (Electricity)</option>
                      <option>शिक्षा व स्कूल (Education)</option>
                      <option>अन्य नागरिक समस्या (Other)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 mb-1 text-xs">
                      विवरण <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      rows={4}
                      required
                      placeholder="समस्या का विवरण लिखें..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-800 placeholder-slate-400 focus:ring-1 focus:ring-blue-500 focus:bg-white leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 mb-1 text-xs">
                      फोटो / वीडियो (वैकल्पिक)
                    </label>
                    <div className="flex items-center space-x-2 border border-slate-300 rounded-xl p-2 bg-slate-50 text-xs text-slate-500">
                      <input
                        type="file"
                        onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                        className="text-xs file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-3.5">
                  <div>
                    <label className="block font-bold text-slate-800 mb-1 text-xs">
                      वार्ड संख्या चुनें <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={wardNo}
                      onChange={(e) => setWardNo(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-medium"
                    >
                      {Array.from({ length: 24 }, (_, i) => i + 1).map((w) => (
                        <option key={w} value={w}>
                          वार्ड {w} {w === 5 ? '(नूरपुर - मुख्य शहर)' : w === 8 ? '(कोटला)' : w === 14 ? '(जसूर - खन्नी)' : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 mb-1 text-xs">
                      सटीक स्थल / मोहल्ला / लैंडमार्क <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={locationText}
                      onChange={(e) => setLocationText(e.target.value)}
                      placeholder="उदा. स्कूल के समीप, मुख्य बाजार, चौक"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-800"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-800 mb-1 text-xs">
                        आपका नाम <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={citizenName}
                        onChange={(e) => setCitizenName(e.target.value)}
                        placeholder="नाम दर्ज करें"
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-800 mb-1 text-xs">
                        मोबाइल नंबर (SMS हेतु) <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="10 अंकों का मोबाइल"
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-3 bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs">
                  <h5 className="font-bold text-slate-900 border-b border-slate-200 pb-2">
                    प्रविष्टि पूर्वावलोकन (Verification Summary)
                  </h5>
                  <div className="space-y-1.5 text-slate-700">
                    <div><b>श्रेणी:</b> {category}</div>
                    <div><b>वार्ड व स्थान:</b> वार्ड {wardNo} • {locationText}</div>
                    <div><b>नागरिक:</b> {citizenName || 'स्थानीय नागरिक'} ({phone || '94180-XXXXX'})</div>
                    <div><b>समस्या:</b> "{description}"</div>
                    {selectedFile && <div className="text-emerald-700">✓ 1 फाइल संलग्न: {selectedFile.name}</div>}
                  </div>
                </div>
              )}

              {/* Navigation buttons */}
              <div className="pt-2 flex items-center space-x-3">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={() => setStep((prev) => (prev - 1) as any)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
                  >
                    ← पीछे
                  </button>
                )}
                <button
                  type="submit"
                  className="bg-[#0066cc] hover:bg-blue-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-xs transition active:scale-95 flex items-center space-x-1.5"
                >
                  <span>{step === 3 ? 'समस्या जमा करें (Submit)' : 'आगे बढ़ें'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </form>
          </div>

          {/* Right Info Box: "आपकी समस्या का क्या होगा?" (5 Cols) */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#ebf5ff] to-[#f4f9ff] border border-blue-200/90 rounded-2xl p-5 shadow-xs">
            <h4 className="text-sm font-black text-[#0066cc] mb-3.5 flex items-center space-x-1.5">
              <span>आपकी समस्या का क्या होगा?</span>
            </h4>

            <div className="space-y-3.5 text-xs">
              
              <div className="flex items-start space-x-3">
                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 font-black flex items-center justify-center shrink-0 border border-blue-300 text-xs">
                  1
                </span>
                <div>
                  <p className="font-bold text-slate-800">हमारी टीम आपकी जानकारी की समीक्षा करेगी</p>
                  <p className="text-slate-500 text-[11px] mt-0.5">प्राथमिकता व तकनीकी सत्यापन 2 घंटे में पूर्ण।</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 font-black flex items-center justify-center shrink-0 border border-blue-300 text-xs">
                  2
                </span>
                <div>
                  <p className="font-bold text-slate-800">संबंधित विभाग को भेजा जाएगा</p>
                  <p className="text-slate-500 text-[11px] mt-0.5">पीडब्ल्यूडी, जल शक्ति अथवा विद्युत बोर्ड को आधिकारिक आदेश।</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 font-black flex items-center justify-center shrink-0 border border-blue-300 text-xs">
                  3
                </span>
                <div>
                  <p className="font-bold text-slate-800">आप अपनी स्थिति ऑनलाइन देख सकते हैं</p>
                  <p className="text-slate-500 text-[11px] mt-0.5">टोकन नंबर से 24x7 लाइव स्थिति ट्रैक करें।</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 font-black flex items-center justify-center shrink-0 border border-blue-300 text-xs">
                  4
                </span>
                <div>
                  <p className="font-bold text-slate-800">समाधान की सूचना आपको दी जाएगी</p>
                  <p className="text-slate-500 text-[11px] mt-0.5">कार्य पूर्ण होने पर फोटो प्रमाण सहित एसएमएस प्राप्त होगा।</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      )}

    </div>
  );
};
