import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  CheckCircle2, 
  HelpCircle, 
  ArrowRight, 
  ArrowLeft, 
  FileText, 
  IndianRupee, 
  ShieldCheck, 
  Share2, 
  ExternalLink,
  Check,
  Building2,
  HeartHandshake
} from 'lucide-react';
import { Language, YojanaUserAnswers } from '../../types/campaign';
import { evaluateYojanaEligibility, YojanaEligibilityResult } from '../../services/yojanaEngine';

interface YojanaEligibilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const YojanaEligibilityModal: React.FC<YojanaEligibilityModalProps> = ({
  isOpen,
  onClose,
  lang
}) => {
  const [step, setStep] = useState<'form' | 'results'>('form');

  // Form State
  const [answers, setAnswers] = useState<YojanaUserAnswers>({
    familyCategory: 'BPL',
    landHolding: 'MARGINAL',
    annualIncomeRange: 'BELOW_1_5L',
    hasGirlChild: true,
    hasDestituteOrOrphan: false,
    hasSeniorCitizen: true,
    hasWoman18To59: true,
    isPracticingFarmer: true,
    hasConcreteRoof: true,
    hasTapConnection: false
  });

  const [evaluationResult, setEvaluationResult] = useState<YojanaEligibilityResult | null>(null);
  const [campOfficeSuccess, setCampOfficeSuccess] = useState(false);

  if (!isOpen) return null;

  const handleEvaluate = (e: React.FormEvent) => {
    e.preventDefault();
    const result = evaluateYojanaEligibility(answers);
    setEvaluationResult(result);
    setStep('results');
  };

  const handleApplyViaCampOffice = () => {
    setCampOfficeSuccess(true);
    setTimeout(() => {
      setCampOfficeSuccess(false);
    }, 4000);
  };

  const handleShareOnWhatsApp = () => {
    if (!evaluationResult) return;
    const schemesList = evaluationResult.qualifiedYojanas
      .map((y, idx) => `${idx + 1}. *${y.title}* (${y.benefitAmount})`)
      .join('\n');

    const text = `🇮🇳 *सरकारी योजना पात्रता रिपोर्ट - नूरपुर विधानसभा (142)*\nजनसेवक: रणबीर सिंह निक्का\n\nबधाई! आपके परिवार के लिए निम्नलिखित योजनाएं अनुशंसित हैं:\n${schemesList}\n\nकुल संभावित लाभ: *₹${evaluationResult.totalAnnualBenefitRupees.toLocaleString('en-IN')}/वर्ष*\n\nनूरपुर विधायक कैंप कार्यालय द्वारा निशुल्क आवेदन सहायता उपलब्ध है।`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white p-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/20 rounded-xl">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white">
                {lang === 'hi' ? 'सरकारी योजना पात्रता चेकर (60-सेकंड विज़ार्ड)' : 'Sarkari Welfare Scheme Eligibility Engine'}
              </h3>
              <p className="text-[11px] text-amber-100">
                हिमाचल प्रदेश सरकार एवं केंद्र सरकार की 8+ कल्याणकारी योजनाएं
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="बंद करें (Close Modal)"
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {step === 'form' ? (
            <form onSubmit={handleEvaluate} className="space-y-4">
              <div className="bg-amber-50 p-3 rounded-2xl border border-amber-200 text-xs text-amber-900 leading-relaxed">
                {lang === 'hi' 
                  ? 'नीचे दिए गए 5 सरल प्रश्नों के उत्तर दें। हमारा इंटेलिजेंट इंजन आपके परिवार हेतु पात्र योजनाओं और कुल आर्थिक लाभ की गणना करेगा।' 
                  : 'Answer 5 simple questions to calculate eligible welfare schemes and annual monetary benefits for your family.'}
              </div>

              {/* 1. Family Category */}
              <div>
                <label className="text-xs font-bold text-slate-900 block mb-1.5">
                  1. परिवार की राशन कार्ड / सामाजिक श्रेणी:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  {[
                    { key: 'BPL', label: 'BPL (बीपीएल)' },
                    { key: 'ANTYODAYA', label: 'अंत्योदय (AAY)' },
                    { key: 'OBC', label: 'OBC (अन्य पिछड़ा वर्ग)' },
                    { key: 'GENERAL', label: 'सामान्य (General)' }
                  ].map(cat => (
                    <button
                      key={cat.key}
                      type="button"
                      onClick={() => setAnswers(prev => ({ ...prev, familyCategory: cat.key as any }))}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition text-left cursor-pointer ${
                        answers.familyCategory === cat.key 
                          ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-xs' 
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Land Holding & Income */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-900 block mb-1.5">
                    2. कृषि भूमि का रकबा (Land Holding):
                  </label>
                  <select
                    value={answers.landHolding}
                    onChange={(e) => setAnswers(prev => ({ ...prev, landHolding: e.target.value as any }))}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-slate-50 font-bold text-slate-800"
                  >
                    <option value="LANDLESS">भूमिहीन / केवल आवासीय मकान</option>
                    <option value="MARGINAL">सीमांत किसान (1 हेक्टेयर से कम)</option>
                    <option value="MEDIUM">लघु किसान (1 से 2 हेक्टेयर)</option>
                    <option value="LARGE">बड़ा कृषक (2 हेक्टेयर से अधिक)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-900 block mb-1.5">
                    3. वार्षिक पारिवारिक आय:
                  </label>
                  <select
                    value={answers.annualIncomeRange}
                    onChange={(e) => setAnswers(prev => ({ ...prev, annualIncomeRange: e.target.value as any }))}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-slate-50 font-bold text-slate-800"
                  >
                    <option value="BELOW_1_5L">₹1.5 लाख से कम</option>
                    <option value="1_5L_TO_2_5L">₹1.5 लाख से ₹2.5 लाख तक</option>
                    <option value="ABOVE_2_5L">₹2.5 लाख से अधिक</option>
                  </select>
                </div>
              </div>

              {/* 4. Household Profile Checkboxes */}
              <div>
                <label className="text-xs font-bold text-slate-900 block mb-1.5">
                  4. परिवार के सदस्यों की स्थिति (लागू विकल्पों पर टिक करें):
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {[
                    { key: 'hasWoman18To59', label: '18 से 59 वर्ष की महिला सदस्य' },
                    { key: 'hasSeniorCitizen', label: '60 वर्ष से अधिक वरिष्ठ नागरिक' },
                    { key: 'hasGirlChild', label: 'अविवाहित कन्या / सुपुत्री' },
                    { key: 'isPracticingFarmer', label: 'सक्रिय खेती / पशुपालन करते हैं' },
                    { key: 'hasDestituteOrOrphan', label: 'अनाथ / निराश्रित बच्चे' },
                    { key: 'hasConcreteRoof', label: 'धूपयुक्त पक्की छत (सोलर रूफटॉप हेतु)' },
                    { key: 'hasTapConnection', label: 'घर में सरकारी नल कनेक्शन है' }
                  ].map(item => {
                    const isChecked = !!(answers as any)[item.key];
                    return (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => setAnswers(prev => ({ ...prev, [item.key]: !isChecked }))}
                        className={`p-2.5 rounded-xl border text-left flex items-center justify-between text-xs font-bold transition cursor-pointer ${
                          isChecked 
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-950' 
                            : 'bg-slate-50 border-slate-200 text-slate-600'
                        }`}
                      >
                        <span>{item.label}</span>
                        <div className={`w-4 h-4 rounded flex items-center justify-center ${
                          isChecked ? 'bg-emerald-600 text-white' : 'border border-slate-400'
                        }`}>
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black rounded-xl text-sm transition shadow-lg flex items-center justify-center gap-2 cursor-pointer mt-4"
              >
                <span>पात्र सरकारी योजनाएं निकालें</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            /* Results View */
            <div className="space-y-4">
              {evaluationResult && (
                <>
                  {/* Summary Banner */}
                  <div className="bg-gradient-to-br from-emerald-900 to-slate-900 text-white p-4 sm:p-5 rounded-2xl shadow-lg border border-emerald-500/40 relative overflow-hidden">
                    <div className="flex items-center justify-between mb-2">
                      <span className="bg-emerald-500 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        पात्रता परिणाम सत्यापित
                      </span>
                      <button
                        onClick={() => setStep('form')}
                        className="text-xs text-amber-300 hover:underline flex items-center gap-1 font-bold cursor-pointer"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>उत्तर बदलें</span>
                      </button>
                    </div>

                    <h4 className="text-base sm:text-lg font-black text-white">
                      {evaluationResult.highlightedRecommendation}
                    </h4>

                    <div className="mt-3 pt-3 border-t border-emerald-700/60 flex items-center justify-between">
                      <div>
                        <span className="text-[11px] text-emerald-300 block">अनुमानित कुल वार्षिक आर्थिक लाभ:</span>
                        <div className="text-2xl font-black text-amber-400 flex items-center">
                          ₹{evaluationResult.totalAnnualBenefitRupees.toLocaleString('en-IN')}
                          <span className="text-xs text-white/80 font-normal ml-1">/ वर्ष</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-xs text-emerald-300 font-bold block">पात्र योजनाएं:</span>
                        <span className="text-xl font-black text-white">{evaluationResult.qualifiedYojanas.length} योजनाएं</span>
                      </div>
                    </div>
                  </div>

                  {/* Qualified Schemes Cards */}
                  <div className="space-y-3">
                    <h5 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                      अनुशंसित योजनाओं की सूची:
                    </h5>

                    {evaluationResult.qualifiedYojanas.map((yojana) => (
                      <div 
                        key={yojana.id} 
                        className="p-4 rounded-2xl border border-slate-200 bg-white shadow-2xs hover:shadow-sm transition space-y-2"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                              {yojana.department}
                            </span>
                            <h4 className="text-sm font-black text-slate-900 mt-1">
                              {yojana.title}
                            </h4>
                          </div>
                          <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200 shrink-0">
                            {yojana.benefitAmount}
                          </span>
                        </div>

                        <p className="text-xs text-slate-600 leading-relaxed">
                          {yojana.description}
                        </p>

                        {/* Required Documents */}
                        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-[11px] text-slate-700">
                          <span className="font-bold text-slate-900 block mb-1">आवश्यक दस्तावेज:</span>
                          <div className="flex flex-wrap gap-1.5">
                            {yojana.documentsRequired.map((doc, i) => (
                              <span key={i} className="bg-white px-2 py-0.5 rounded border border-slate-300 text-[10px] font-medium">
                                ✓ {doc}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Camp Office Assistance Card */}
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-2xl border border-amber-300 space-y-2">
                    <div className="flex items-center gap-2">
                      <HeartHandshake className="w-5 h-5 text-amber-700" />
                      <h5 className="text-xs font-black text-amber-950">
                        विधायक कैंप कार्यालय, नूरपुर द्वारा निःशुल्क आवेदन सहायता
                      </h5>
                    </div>
                    <p className="text-xs text-amber-800">
                      कागजी औपचारिकता या फॉर्म भरने में कोई परेशानी? कैंप कार्यालय की टीम आपके घर आकर आवेदन पूर्ण करवाएगी।
                    </p>

                    {campOfficeSuccess ? (
                      <div className="p-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold text-center flex items-center justify-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>सहायता आग्रह दर्ज हुआ! कैंप ऑफिस टीम 24 घंटे में संपर्क करेगी।</span>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <button
                          onClick={handleApplyViaCampOffice}
                          className="py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-amber-400 font-extrabold rounded-xl text-xs transition shadow-sm cursor-pointer"
                        >
                          कैंप ऑफिस से सहायता मांगें
                        </button>
                        <button
                          onClick={handleShareOnWhatsApp}
                          className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-xs transition shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                          <span>व्हाट्सएप पर शेयर करें</span>
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
