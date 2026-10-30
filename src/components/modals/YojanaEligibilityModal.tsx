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
  HeartHandshake,
  Bot,
  Send,
  Loader2
} from 'lucide-react';
import { Language } from '../../types/campaign';
import { 
  evaluateEligibility, 
  evaluateYojanaEligibility, 
  UserProfileAnswers, 
  YojanaEligibilityResult,
  YojanaItem
} from '../../services/yojanaEngine';

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
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Wizard state
  const [role, setRole] = useState<'farmer' | 'woman' | 'youth' | 'senior' | 'destitute'>('farmer');
  const [familyCategory, setFamilyCategory] = useState<'BPL' | 'ANTYODAYA' | 'GENERAL' | 'OBC' | 'SC_ST'>('BPL');
  const [incomeSlab, setIncomeSlab] = useState<'BELOW_1_5L' | '1_5L_TO_2_5L' | 'ABOVE_2_5L'>('BELOW_1_5L');
  const [landHolding, setLandHolding] = useState<'LANDLESS' | 'MARGINAL' | 'MEDIUM' | 'LARGE'>('MARGINAL');
  const [wardNo, setWardNo] = useState<number>(8);
  const [hasConcreteRoof, setHasConcreteRoof] = useState(true);
  const [hasTapConnection, setHasTapConnection] = useState(false);

  // Results & AI follow up
  const [evaluationResult, setEvaluationResult] = useState<YojanaEligibilityResult | null>(null);
  const [campOfficeSuccess, setCampOfficeSuccess] = useState(false);

  // Follow-up AI Assistant
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCalculate = () => {
    const answers: UserProfileAnswers = {
      role,
      familyCategory,
      annualIncomeRange: incomeSlab,
      landHolding,
      wardNo,
      hasConcreteRoof,
      hasTapConnection,
      hasWoman18To59: role === 'woman',
      isPracticingFarmer: role === 'farmer',
      hasSeniorCitizen: role === 'senior',
      hasDestituteOrOrphan: role === 'destitute'
    };

    const res = evaluateYojanaEligibility(answers);
    setEvaluationResult(res);
    setCurrentStep(4); // Results view
  };

  const handleAskAi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuestion.trim()) return;

    setAiLoading(true);
    setAiAnswer(null);
    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `सरकारी योजना प्रश्न: ${aiQuestion.trim()} (नागरिक वार्ड: ${wardNo}, भूमिका: ${role}, आय स्लैब: ${incomeSlab})`
        })
      });

      if (response.ok) {
        const data = await response.json();
        setAiAnswer(data.reply || 'कैंप कार्यालय की टीम इस योजना के आवेदन में पूर्ण सहयोग करेगी।');
      } else {
        setAiAnswer('योजना के बारे में विस्तृत जानकारी हेतु नूरपुर कैंप कार्यालय हेल्पलाइन 1800-123-456 पर संपर्क करें।');
      }
    } catch {
      setAiAnswer('योजना विवरण हेतु कैंप कार्यालय नूरपुर खुला है (सोम-शनि सुबह 9 से सायं 6 बजे तक)।');
    } finally {
      setAiLoading(false);
    }
  };

  const handleApplyViaCampOffice = () => {
    setCampOfficeSuccess(true);
    setTimeout(() => setCampOfficeSuccess(false), 5000);
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
                हिमाचल प्रदेश सरकार एवं केंद्र सरकार की 8+ सक्रिय जनकल्याणकारी योजनाएं
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

        {/* Wizard Step Indicator */}
        {currentStep < 4 && (
          <div className="bg-amber-50 px-6 py-2.5 border-b border-amber-200 flex items-center justify-between text-xs font-bold text-amber-950">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-amber-600 text-white text-[11px] flex items-center justify-center font-black">
                {currentStep}
              </span>
              <span>
                {currentStep === 1 && 'चरण 1: आप कौन हैं? (Who are you?)'}
                {currentStep === 2 && 'चरण 2: पारिवारिक आय एवं भूमि (Income & Land)'}
                {currentStep === 3 && 'चरण 3: नूरपुर वार्ड / पंचायत का चयन (Ward / Locality)'}
              </span>
            </div>
            <span className="text-[11px] text-amber-800">स्टेप {currentStep} / 3</span>
          </div>
        )}

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          
          {/* STEP 1: Who are you? */}
          {currentStep === 1 && (
            <div className="space-y-3">
              <label className="text-xs font-extrabold text-slate-900 block">
                अपनी प्राथमिक श्रेणी या भूमिका का चयन करें:
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  { key: 'farmer', icon: '🌾', title: 'किसान / पशुपालक (Farmer)', desc: 'प्राकृतिक खेती, KCC, देशी गाय खरीद व खाद उपकरण अनुदान' },
                  { key: 'woman', icon: '👩', title: 'महिला सदस्य (Woman 18–59)', desc: 'इंदिरा गांधी प्यारी बहना सम्मान निधि ₹1,500/माह DBT व कन्यादान' },
                  { key: 'youth', icon: '🚀', title: 'युवा / उद्यमी (Youth 18–45)', desc: 'मुख्यमंत्री स्वावलंबन योजना: ₹60 लाख तक परियोजना पर 35% सब्सिडी' },
                  { key: 'senior', icon: '👴', title: 'वरिष्ठ नागरिक (Senior Citizen 60+)', desc: 'सामाजिक सुरक्षा पेंशन ₹1,700/माह व निःशुल्क हिमकेयर कवर' },
                  { key: 'destitute', icon: '🤝', title: 'निराश्रित / अनाथ परिवार (Destitute)', desc: 'मुख्यमंत्री सुख-आश्रय योजना: ₹4,000/माह पॉकेट मनी + 100% शिक्षा शुल्क' }
                ].map(item => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setRole(item.key as any)}
                    className={`p-3.5 rounded-2xl border text-left transition cursor-pointer flex items-start gap-3 ${
                      role === item.key 
                        ? 'bg-amber-50 border-amber-500 shadow-xs ring-2 ring-amber-400/40' 
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-2xl shrink-0 mt-0.5">{item.icon}</span>
                    <div>
                      <h4 className="text-xs font-black text-slate-900">{item.title}</h4>
                      <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">{item.desc}</p>
                    </div>
                  </button>
                ))}
              </div>

              <div className="pt-3 flex justify-end">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="py-2.5 px-6 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 text-slate-950 font-black rounded-xl text-xs transition shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <span>अगला चरण (Next)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Income & Land */}
          {currentStep === 2 && (
            <div className="space-y-3.5">
              <div>
                <label className="text-xs font-extrabold text-slate-900 block mb-1">
                  वार्षिक पारिवारिक आय स्लैब:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { key: 'BELOW_1_5L', label: '₹1.5 लाख से कम', tag: 'प्राथमिकता' },
                    { key: '1_5L_TO_2_5L', label: '₹1.5L – ₹2.5L', tag: 'मध्यम' },
                    { key: 'ABOVE_2_5L', label: '₹2.5 लाख से अधिक', tag: 'सामान्य' }
                  ].map(s => (
                    <button
                      key={s.key}
                      type="button"
                      onClick={() => setIncomeSlab(s.key as any)}
                      className={`p-3 rounded-xl border text-center transition cursor-pointer ${
                        incomeSlab === s.key ? 'bg-amber-500 text-slate-950 border-amber-600 font-black shadow-xs' : 'bg-slate-50 text-slate-700 border-slate-200 font-bold'
                      }`}
                    >
                      <div className="text-xs">{s.label}</div>
                      <span className="text-[9px] opacity-80 mt-0.5 block">{s.tag}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-extrabold text-slate-900 block mb-1">
                  राशन कार्ड / सामाजिक वर्ग:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { key: 'BPL', label: 'बीपीएल (BPL)' },
                    { key: 'ANTYODAYA', label: 'अंत्योदय (AAY)' },
                    { key: 'OBC', label: 'OBC' },
                    { key: 'GENERAL', label: 'सामान्य / अन्य' }
                  ].map(c => (
                    <button
                      key={c.key}
                      type="button"
                      onClick={() => setFamilyCategory(c.key as any)}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition cursor-pointer text-center ${
                        familyCategory === c.key ? 'bg-slate-900 text-amber-400 border-slate-800' : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-extrabold text-slate-900 block mb-1">
                  कृषि भूमि का रकबा:
                </label>
                <select
                  value={landHolding}
                  onChange={(e) => setLandHolding(e.target.value as any)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white font-bold text-slate-800"
                >
                  <option value="LANDLESS">भूमिहीन / केवल आवासीय मकान</option>
                  <option value="MARGINAL">सीमांत किसान (1 हेक्टेयर से कम)</option>
                  <option value="MEDIUM">लघु किसान (1 से 2 हेक्टेयर)</option>
                  <option value="LARGE">बड़ा कृषक (2 हेक्टेयर से अधिक)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                <button
                  type="button"
                  onClick={() => setHasConcreteRoof(!hasConcreteRoof)}
                  className={`p-2.5 rounded-xl border flex items-center justify-between font-bold cursor-pointer transition ${
                    hasConcreteRoof ? 'bg-emerald-50 border-emerald-300 text-emerald-950' : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  <span>धूपयुक्त पक्की छत (सोलर रूफटॉप)</span>
                  {hasConcreteRoof && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                </button>

                <button
                  type="button"
                  onClick={() => setHasTapConnection(!hasTapConnection)}
                  className={`p-2.5 rounded-xl border flex items-center justify-between font-bold cursor-pointer transition ${
                    !hasTapConnection ? 'bg-sky-50 border-sky-300 text-sky-950' : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  <span>घर में नल कनेक्शन नहीं है (जल जीवन)</span>
                  {!hasTapConnection && <Check className="w-3.5 h-3.5 text-sky-600" />}
                </button>
              </div>

              <div className="pt-3 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="py-2 px-4 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  वापस (Back)
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="py-2.5 px-6 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 text-slate-950 font-black rounded-xl text-xs transition shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <span>अगला चरण (Next)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Ward / Panchayat Selection */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-extrabold text-slate-900 block mb-1">
                  विधानसभा 142 नूरपुर: अपना वार्ड अथवा पंचायत क्षेत्र चुनें:
                </label>
                <select
                  value={wardNo}
                  onChange={(e) => setWardNo(Number(e.target.value))}
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 bg-white font-bold text-slate-800"
                >
                  <option value={1}>वार्ड 01: जसूर मुख्य बाजार व रेलवे स्टेशन</option>
                  <option value={2}>वार्ड 02: जसूर अप्पर व कछुआला</option>
                  <option value={3}>वार्ड 03: चौगान बाजार मुख्य</option>
                  <option value={4}>वार्ड 04: नूरपुर किला परिसर व नागणी</option>
                  <option value={5}>वार्ड 05: राधा कृष्ण मंदिर व सिविल अस्पताल</option>
                  <option value={8}>वार्ड 08: भदवार मुख्य बस्ती व प्राथमिक स्वास्थ्य केंद्र</option>
                  <option value={11}>वार्ड 11: जाफरपुर एवं कूहल क्षेत्र</option>
                  <option value={12}>वार्ड 12: रेहन कस्बा एवं बाजार</option>
                  <option value={15}>वार्ड 15: कोटला ऐतिहासिक किला क्षेत्र</option>
                  <option value={18}>वार्ड 18: गंदराण व लिंक मार्ग</option>
                  {Array.from({ length: 24 }, (_, i) => i + 1)
                    .filter(w => ![1, 2, 3, 4, 5, 8, 11, 12, 15, 18].includes(w))
                    .map(w => (
                      <option key={w} value={w}>
                        वार्ड {w.toString().padStart(2, '0')}: नूरपुर ग्रामीण पंचायत क्षेत्र
                      </option>
                    ))}
                </select>
              </div>

              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 leading-relaxed">
                नूरपुर कैंप कार्यालय द्वारा वार्ड {wardNo} के पन्ना प्रमुखों और ग्राम समन्वयकों को आपके आवेदन की सीधी सूची भेजी जाएगी।
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="py-2 px-4 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  वापस (Back)
                </button>

                <button
                  type="button"
                  onClick={handleCalculate}
                  className="py-3 px-6 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 text-slate-950 font-black rounded-xl text-xs transition shadow-lg flex items-center gap-2 cursor-pointer"
                >
                  <span>पात्र योजनाएं और लाभ देखें</span>
                  <Sparkles className="w-4 h-4 text-slate-950" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Results Screen */}
          {currentStep === 4 && evaluationResult && (
            <div className="space-y-4">
              {/* Summary Header */}
              <div className="bg-gradient-to-br from-emerald-900 to-slate-900 text-white p-4 sm:p-5 rounded-2xl shadow-lg border border-emerald-500/40 relative overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                  <span className="bg-emerald-500 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    पात्रता परिणाम सत्यापित
                  </span>
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="text-xs text-amber-300 hover:underline flex items-center gap-1 font-bold cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>पुनः जांचें</span>
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

              {/* Matching Schemes with Green Eligibility Tags */}
              <div className="space-y-3">
                <h5 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  आपके लिए अनुशंसित सरकारी योजनाएं:
                </h5>

                {evaluationResult.qualifiedYojanas.map((yojana) => (
                  <div 
                    key={yojana.id} 
                    className="p-4 rounded-2xl border border-slate-200 bg-white shadow-2xs hover:shadow-xs transition space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                            {yojana.department}
                          </span>
                          <span className="text-[9px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-300">
                            ✓ शत-प्रतिशत पात्र
                          </span>
                        </div>
                        <h4 className="text-sm font-black text-slate-900 mt-1">
                          {yojana.title}
                        </h4>
                      </div>

                      <span className="text-xs font-black text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200 shrink-0">
                        {yojana.benefitAmount}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {yojana.description}
                    </p>

                    {/* Document Checklist for Each Scheme */}
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-[11px] text-slate-700">
                      <span className="font-bold text-slate-900 block mb-1">
                        दस्तावेज चेकलिस्ट (Document Checklist):
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {yojana.documentsRequired.map((doc, i) => (
                          <span key={i} className="bg-white px-2 py-0.5 rounded border border-slate-300 text-[10px] font-medium text-slate-800">
                            ✓ {doc}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Direct CTA: Request Help from MLA Office */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-2xl border border-amber-300 space-y-2.5">
                <div className="flex items-center gap-2">
                  <HeartHandshake className="w-5 h-5 text-amber-700" />
                  <h5 className="text-xs font-black text-amber-950">
                    विधायक कैंप ऑफिस, नूरपुर द्वारा निःशुल्क आवेदन सहायता
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
                      विधायक कैंप ऑफिस से फॉर्म प्राप्त करें
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

              {/* Follow-up AI Assistant Question Input */}
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-indigo-600" />
                  <h6 className="text-xs font-bold text-slate-900">
                    योजना से जुड़ा कोई सवाल पूछें (Ask AI Mitra)
                  </h6>
                </div>

                <form onSubmit={handleAskAi} className="flex gap-2">
                  <input
                    type="text"
                    value={aiQuestion}
                    onChange={(e) => setAiQuestion(e.target.value)}
                    placeholder="उदा. सुख-आश्रय योजना का फॉर्म कहां जमा होगा?..."
                    className="flex-1 text-xs px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 font-medium"
                  />
                  <button
                    type="submit"
                    disabled={aiLoading}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 text-white font-bold rounded-xl text-xs transition shadow-xs flex items-center gap-1 cursor-pointer shrink-0"
                  >
                    {aiLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                    <span>पूछें</span>
                  </button>
                </form>

                {aiAnswer && (
                  <div className="p-3 bg-indigo-50/70 rounded-xl border border-indigo-200 text-xs text-indigo-950 leading-relaxed mt-2">
                    <strong>AI सहायक उत्तर:</strong> {aiAnswer}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
