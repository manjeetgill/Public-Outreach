import React, { useState, useEffect, useRef } from 'react';
import { 
  Sprout, 
  TrendingUp, 
  TrendingDown, 
  FileText, 
  Camera, 
  MapPin, 
  Volume2, 
  CheckCircle, 
  AlertTriangle, 
  ExternalLink, 
  Search, 
  Download, 
  X, 
  Check, 
  Sparkles, 
  HelpCircle, 
  Building2, 
  ShieldCheck, 
  PhoneCall, 
  Share2, 
  CloudSun, 
  Snowflake, 
  Thermometer, 
  Loader2,
  RefreshCw,
  Award,
  Vote
} from 'lucide-react';
import { 
  fetchMandiRates, 
  fetchAgriWeather, 
  analyzeCropDoctor, 
  MandiCommodity, 
  AgriWeather, 
  CropDoctorResult 
} from '../../services/api';
import { Language } from '../../types/campaign';

interface KisanLokMitraModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  initialTab?: 'mandi' | 'crop_doctor' | 'jamabandi' | 'schemes';
  onOpenMlaLetter?: () => void;
}

export const KisanLokMitraModal: React.FC<KisanLokMitraModalProps> = ({
  isOpen,
  onClose,
  lang,
  initialTab = 'mandi',
  onOpenMlaLetter
}) => {
  const [activeTab, setActiveTab] = useState<'mandi' | 'crop_doctor' | 'jamabandi' | 'schemes'>(initialTab);
  
  // Mandi & Weather States
  const [mandiData, setMandiData] = useState<{ marketYard: string; source: string; commodities: MandiCommodity[] }>({
    marketYard: 'उप मंडी प्रांगण जसूर (APMC कांगड़ा • नूरपुर)',
    source: 'Agmarknet • OGD Platform India',
    commodities: []
  });
  const [mandiLoading, setMandiLoading] = useState(false);
  const [mandiSearch, setMandiSearch] = useState('');
  const [weatherData, setWeatherData] = useState<AgriWeather | null>(null);
  const [isSpeakingMandi, setIsSpeakingMandi] = useState(false);

  // Crop Doctor States
  const [selectedCrop, setSelectedCrop] = useState('गेंहू (Wheat)');
  const [cropImageBase64, setCropImageBase64] = useState<string | null>(null);
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [diagnosisResult, setDiagnosisResult] = useState<CropDoctorResult | null>(null);
  const [doctorVillage, setDoctorVillage] = useState('सुलियाली');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Jamabandi States
  const [jamabandiVillage, setJamabandiVillage] = useState('सुलियाली (Suliyali)');
  const [khasraNo, setKhasraNo] = useState('');
  const [jamabandiCopied, setJamabandiCopied] = useState(false);

  // Sync initial tab when changed from props
  useEffect(() => {
    if (initialTab) setActiveTab(initialTab);
  }, [initialTab]);

  // Load Mandi and Weather on Open
  useEffect(() => {
    if (!isOpen) return;

    setMandiLoading(true);
    fetchMandiRates().then(data => {
      setMandiData(data);
      setMandiLoading(false);
    }).catch(() => setMandiLoading(false));

    fetchAgriWeather().then(w => {
      if (w) setWeatherData(w);
    }).catch(console.error);
  }, [isOpen]);

  if (!isOpen) return null;

  // Audio readout of Mandi rates in natural Hindi
  const handleSpeakMandiRates = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    
    if (isSpeakingMandi) {
      window.speechSynthesis.cancel();
      setIsSpeakingMandi(false);
      return;
    }

    const ratesSummary = mandiData.commodities.slice(0, 4).map(c => 
      `${c.commodity} का भाव ₹${c.modalPrice} प्रति क्विंटल है।`
    ).join(' ');

    const textToSpeak = `नमस्ते किसान भाईयों! आज जसूर मंडी का ताजा भाव: ${ratesSummary} नूरपुर कैंप कार्यालय की सेवा।`;

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = 'hi-IN';
    utterance.rate = 0.95;
    utterance.onend = () => setIsSpeakingMandi(false);
    utterance.onerror = () => setIsSpeakingMandi(false);

    setIsSpeakingMandi(true);
    window.speechSynthesis.speak(utterance);
  };

  // Image upload handler for crop doctor
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setCropImageBase64(base64);
      runCropDiagnosis(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleSelectSamplePlant = (sampleType: 'yellow_rust' | 'citrus_canker' | 'blight') => {
    let mockSample = 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=600&q=80';
    let crop = 'गेंहू (Wheat)';
    if (sampleType === 'citrus_canker') {
      mockSample = 'https://images.unsplash.com/photo-1582284540020-8acbe03f4924?auto=format&fit=crop&w=600&q=80';
      crop = 'किन्नू व संतरा (Citrus)';
    } else if (sampleType === 'blight') {
      mockSample = 'https://images.unsplash.com/photo-1592417817098-8f3d69102656?auto=format&fit=crop&w=600&q=80';
      crop = 'टमाटर (Tomato)';
    }
    setSelectedCrop(crop);
    setCropImageBase64(mockSample);
    runCropDiagnosis(mockSample);
  };

  const runCropDiagnosis = async (base64Image: string) => {
    setIsDiagnosing(true);
    setDiagnosisResult(null);

    const result = await analyzeCropDoctor(base64Image, selectedCrop, doctorVillage);
    setDiagnosisResult(result);
    setIsDiagnosing(false);
  };

  const filteredCommodities = mandiData.commodities.filter(c => 
    c.commodity.toLowerCase().includes(mandiSearch.toLowerCase()) ||
    c.commodityEn.toLowerCase().includes(mandiSearch.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl max-h-[92vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-emerald-300">
        
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-[#102a43] p-4 sm:p-5 text-white relative shrink-0">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-1.5 bg-amber-400 text-emerald-950 rounded-xl font-black text-xs flex items-center gap-1 shadow-xs">
              <Sprout className="w-4 h-4" />
              <span>100% मुफ्त सेवा</span>
            </span>
            <span className="text-xs font-bold text-emerald-200 uppercase tracking-wider">
              नूरपुर विधानसभा 142 • किसान व लोक मित्र सेवा केंद्र
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                निक्का किसान मित्र व लोक मित्र केंद्र
              </h2>
              <p className="text-xs text-emerald-100 mt-0.5">
                जसूर मंडी भाव, जमीन की जमाबंदी नकल, AI फसल डॉक्टर और 15+ सरकारी प्रमाण पत्र बिना किसी शुल्क के
              </p>
            </div>

            {/* Quick Listen Button for Farmers */}
            <button
              onClick={handleSpeakMandiRates}
              className={`px-3 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 shadow-md shrink-0 cursor-pointer ${
                isSpeakingMandi 
                  ? 'bg-rose-500 text-white animate-pulse' 
                  : 'bg-amber-400 hover:bg-amber-300 text-slate-950'
              }`}
            >
              <Volume2 className="w-4 h-4" />
              <span>{isSpeakingMandi ? 'बोलना बंद करें' : '🔊 भाव बोलकर सुनें (Listen)'}</span>
            </button>
          </div>

          {/* 4 Navigation Sub-Tabs */}
          <div className="flex items-center gap-1.5 mt-4 pt-3 border-t border-white/20 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab('mandi')}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 shrink-0 ${
                activeTab === 'mandi' 
                  ? 'bg-white text-emerald-900 shadow-md' 
                  : 'bg-black/25 text-emerald-100 hover:bg-black/40'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>📈 जसूर मंडी भाव</span>
            </button>

            <button
              onClick={() => setActiveTab('crop_doctor')}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 shrink-0 ${
                activeTab === 'crop_doctor' 
                  ? 'bg-white text-emerald-900 shadow-md' 
                  : 'bg-black/25 text-emerald-100 hover:bg-black/40'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>🩺 AI फसल डॉक्टर</span>
            </button>

            <button
              onClick={() => setActiveTab('jamabandi')}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 shrink-0 ${
                activeTab === 'jamabandi' 
                  ? 'bg-white text-emerald-900 shadow-md' 
                  : 'bg-black/25 text-emerald-100 hover:bg-black/40'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>📜 जमीन की जमाबंदी/फर्द</span>
            </button>

            <button
              onClick={() => setActiveTab('schemes')}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 shrink-0 ${
                activeTab === 'schemes' 
                  ? 'bg-white text-emerald-900 shadow-md' 
                  : 'bg-black/25 text-emerald-100 hover:bg-black/40'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>💰 PM-किसान व लोक मित्र सेवाएं</span>
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50 space-y-5">
          
          {/* ========================================================================= */}
          {/* TAB 1: JASUR MANDI RATES & OPEN-METEO WEATHER                             */}
          {/* ========================================================================= */}
          {activeTab === 'mandi' && (
            <div className="space-y-4">
              
              {/* Weather & Frost Warning Bar */}
              {weatherData && (
                <div className={`p-4 rounded-2xl border transition shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  weatherData.current.isFrostWarning 
                    ? 'bg-rose-50 border-rose-300 text-rose-950' 
                    : 'bg-gradient-to-r from-sky-50 to-blue-50 border-sky-200 text-sky-950'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-white rounded-xl shadow-xs text-sky-700">
                      {weatherData.current.isFrostWarning ? (
                        <Snowflake className="w-6 h-6 text-rose-600 animate-spin" />
                      ) : (
                        <CloudSun className="w-6 h-6 text-amber-500" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-extrabold text-slate-900">
                          नूरपुर कृषि मौसम: {weatherData.current.tempC}°C
                        </span>
                        <span className="text-xs text-slate-500 font-medium">
                          (महसूस: {weatherData.current.feelsLikeC}°C)
                        </span>
                        {weatherData.current.isFrostWarning && (
                          <span className="bg-rose-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full animate-bounce">
                            ⚠️ पाला चेतावनी (Frost Alert)
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-semibold text-slate-700 mt-0.5">
                        {weatherData.current.advisoryHi}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs font-bold text-slate-600 bg-white/80 px-3 py-2 rounded-xl border border-slate-200 shrink-0">
                    <div>
                      <span className="text-slate-400 block text-[10px]">बारिश संभावना</span>
                      <span className="text-blue-700 font-black">{weatherData.current.rainProbabilityPercent}%</span>
                    </div>
                    <div className="border-l border-slate-200 pl-3">
                      <span className="text-slate-400 block text-[10px]">हवा की गति</span>
                      <span>{weatherData.current.windSpeedKmh} किमी/घंटा</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Mandi Search & Info Bar */}
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="p-2 bg-emerald-100 text-emerald-800 rounded-xl font-bold">
                    <TrendingUp className="w-4 h-4" />
                  </span>
                  <div>
                    <h3 className="text-xs font-extrabold text-slate-900">
                      {mandiData.marketYard}
                    </h3>
                    <p className="text-[10px] text-slate-500">
                      स्रोतः {mandiData.source} • दैनिक न्यूनतम, अधिकतम व मॉडल भाव
                    </p>
                  </div>
                </div>

                <div className="relative w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input 
                    type="text"
                    value={mandiSearch}
                    onChange={(e) => setMandiSearch(e.target.value)}
                    placeholder="फसल खोजें (गेंहू, मक्का, संतरा...)"
                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Mandi Rates Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredCommodities.map((item) => (
                  <div 
                    key={item.id}
                    className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs hover:border-emerald-300 transition space-y-2.5 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 block">
                            {item.grade}
                          </span>
                          <h4 className="text-sm font-black text-slate-900 leading-tight">
                            {item.commodity}
                          </h4>
                          <span className="text-[10px] text-slate-500">
                            {item.commodityEn}
                          </span>
                        </div>
                        <div className={`px-2 py-0.5 rounded-lg text-[10px] font-black flex items-center gap-0.5 ${
                          item.trend === 'UP' 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                            : item.trend === 'DOWN'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-slate-100 text-slate-700'
                        }`}>
                          {item.trend === 'UP' && <TrendingUp className="w-3 h-3 text-emerald-600" />}
                          {item.trend === 'DOWN' && <TrendingDown className="w-3 h-3 text-rose-600" />}
                          <span>₹{item.change}</span>
                        </div>
                      </div>

                      {/* Big Price Tag */}
                      <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-100 mt-2 text-center">
                        <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                          मॉडल भाव (Modal Rate)
                        </span>
                        <div className="text-2xl font-black text-emerald-900 leading-none my-1">
                          ₹{item.modalPrice.toLocaleString()}
                        </div>
                        <span className="text-[10px] text-emerald-700 font-semibold">
                          {item.unit}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs pt-2 text-slate-600 border-t border-slate-100 mt-2">
                        <div>
                          <span className="text-[10px] text-slate-400 block">न्यूनतम भाव</span>
                          <span className="font-bold text-slate-800">₹{item.minPrice}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 block">अधिकतम भाव</span>
                          <span className="font-bold text-slate-800">₹{item.maxPrice}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                      <span>आवक: {item.arrivalsQuintals} क्विंटल</span>
                      <span className="font-semibold text-emerald-700">✓ जसूर APMC</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* APMC Contact & Farmer Assistance Banner */}
              <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-amber-950">
                <div className="flex items-center gap-2.5">
                  <span className="p-2 bg-amber-500 text-slate-950 rounded-xl font-bold">
                    <Building2 className="w-4 h-4" />
                  </span>
                  <div>
                    <span className="font-black text-slate-900 block">
                      उप मंडी प्रांगण जसूर (Nurpur) किसान सहायता डेस्क
                    </span>
                    <span className="text-[11px] text-slate-600">
                      तुलाई, लोडिंग या व्यापारी भुगतान में किसी भी समस्या के लिए विधायक कार्यालय हेल्पलाइन उपलब्ध है।
                    </span>
                  </div>
                </div>
                <a 
                  href="tel:01893222111" 
                  className="px-3.5 py-2 bg-[#102a43] hover:bg-[#0b1b2b] text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shrink-0 transition"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>कैंप ऑफिस सहायता: 01893-222111</span>
                </a>
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: AI CROP DOCTOR (फसल डॉक्टर - GEMINI VISION)                        */}
          {/* ========================================================================= */}
          {activeTab === 'crop_doctor' && (
            <div className="space-y-4">
              
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                      <Camera className="w-5 h-5 text-emerald-600" />
                      <span>फसल डॉक्टर: रोग व कीट तुरंत जांच</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      पत्ती या फल की फोटो अपलोड करें। CSK कृषि विश्वविद्यालय पालमपुर के मॉडल द्वारा तुरंत 3-कदम उपचार प्राप्त करें।
                    </p>
                  </div>
                  <span className="bg-emerald-100 text-emerald-800 text-xs font-extrabold px-3 py-1 rounded-full border border-emerald-200 shrink-0">
                    ⚡ 3 सेकंड में AI रिपोर्ट
                  </span>
                </div>

                {/* Crop & Village Picker */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      फसल का नाम चुनें:
                    </label>
                    <select
                      value={selectedCrop}
                      onChange={(e) => setSelectedCrop(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="गेंहू (Wheat)">गेंहू (Wheat - कल्यानसोना / शरबती)</option>
                      <option value="मक्का (Maize)">मक्का (Maize - लोकल / संकर)</option>
                      <option value="किन्नू व संतरा (Citrus)">किन्नू व संतरा (Citrus Orchards)</option>
                      <option value="टमाटर (Tomato)">टमाटर (Him Sona / हाइब्रिड)</option>
                      <option value="आलू (Potato)">आलू (Kufri Jyoti)</option>
                      <option value="सरसों (Mustard)">सरसों (Mustard)</option>
                      <option value="धान (Paddy)">धान (Paddy)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      आपका गांव / पंचायत:
                    </label>
                    <input 
                      type="text"
                      value={doctorVillage}
                      onChange={(e) => setDoctorVillage(e.target.value)}
                      placeholder="उदा: सुलियाली / भदवार / कोटला"
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                {/* Upload or Camera Clicker */}
                <div className="border-2 border-dashed border-emerald-300 rounded-2xl p-6 text-center bg-emerald-50/40 hover:bg-emerald-50/70 transition">
                  <input 
                    type="file"
                    accept="image/*"
                    capture="environment"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    className="hidden"
                  />

                  {cropImageBase64 ? (
                    <div className="space-y-3">
                      <img 
                        src={cropImageBase64} 
                        alt="Uploaded leaf" 
                        className="w-48 h-48 object-cover rounded-2xl mx-auto border-2 border-emerald-500 shadow-md"
                      />
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="px-3 py-1.5 bg-slate-800 text-white text-xs font-bold rounded-xl"
                        >
                          दूसरी फोटो लें
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="w-16 h-16 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
                        <Camera className="w-8 h-8" />
                      </div>
                      <div className="text-sm font-black text-slate-900">
                        रोगग्रस्त पत्ती या पौधे की फोटो खींचें
                      </div>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto">
                        कैमरा से सीधे पत्ती का नजदीकी फोटो लें या गैलरी से अपलोड करें।
                      </p>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="mt-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl text-xs shadow-md transition cursor-pointer"
                      >
                        📸 कैमरा खोलें या फोटो चुनें
                      </button>
                    </div>
                  )}

                  {/* 3 Quick Sample Tests for Farmers without photos */}
                  <div className="mt-4 pt-3 border-t border-emerald-200 text-xs">
                    <span className="text-[11px] font-bold text-slate-500 block mb-1.5">
                      या त्वरित डेमो जांच चुनें:
                    </span>
                    <div className="flex flex-wrap justify-center gap-2">
                      <button
                        onClick={() => handleSelectSamplePlant('yellow_rust')}
                        className="px-2.5 py-1 bg-white hover:bg-emerald-100 text-emerald-900 rounded-lg border border-emerald-300 text-[11px] font-bold transition cursor-pointer"
                      >
                        🌾 गेंहू पीला रतुआ नमूना
                      </button>
                      <button
                        onClick={() => handleSelectSamplePlant('citrus_canker')}
                        className="px-2.5 py-1 bg-white hover:bg-emerald-100 text-emerald-900 rounded-lg border border-emerald-300 text-[11px] font-bold transition cursor-pointer"
                      >
                        🍊 किन्नू सिट्रस कैंकर नमूना
                      </button>
                      <button
                        onClick={() => handleSelectSamplePlant('blight')}
                        className="px-2.5 py-1 bg-white hover:bg-emerald-100 text-emerald-900 rounded-lg border border-emerald-300 text-[11px] font-bold transition cursor-pointer"
                      >
                        🍅 टमाटर झुलसा रोग नमूना
                      </button>
                    </div>
                  </div>
                </div>

                {/* Loading Spinner */}
                {isDiagnosing && (
                  <div className="p-6 bg-white rounded-2xl border border-emerald-200 text-center space-y-2">
                    <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mx-auto" />
                    <div className="text-sm font-black text-slate-900">
                      Gemini Vision फसल का विश्लेषण कर रहा है...
                    </div>
                    <p className="text-xs text-slate-500">
                      कांगड़ा कृषि विज्ञान केंद्र (KVK) के मानकों अनुसार रोग व उपचार की जांच हो रही है।
                    </p>
                  </div>
                )}

                {/* Diagnosis Result Card */}
                {diagnosisResult && (
                  <div className="bg-white rounded-2xl p-5 border-2 border-emerald-400 shadow-lg space-y-4 animate-in fade-in">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                          रोग पहचान परिणाम • {selectedCrop}
                        </span>
                        <h4 className="text-lg font-black text-rose-700">
                          {diagnosisResult.diseaseNameHi}
                        </h4>
                        <span className="text-xs text-slate-500">
                          {diagnosisResult.diseaseNameEn} • प्रभावित भाग: {diagnosisResult.affectedPlantPart}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-black border ${
                          diagnosisResult.severity === 'CRITICAL' || diagnosisResult.severity === 'HIGH'
                            ? 'bg-rose-100 text-rose-800 border-rose-300'
                            : 'bg-amber-100 text-amber-800 border-amber-300'
                        }`}>
                          तीव्रता: {diagnosisResult.severity}
                        </span>
                        {diagnosisResult.pmFasalBimaEligible && (
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-1 rounded-full border border-emerald-300">
                            ✓ PM फसल बीमा कवर
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Symptoms & Cause */}
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                      <div className="font-extrabold text-slate-800">लक्षण (Symptoms):</div>
                      <p className="text-slate-600 leading-relaxed">{diagnosisResult.symptomsHi}</p>
                      <div className="text-[11px] text-slate-500 pt-1">
                        <strong>मुख्य कारण:</strong> {diagnosisResult.causeHi}
                      </div>
                    </div>

                    {/* 3 Step Practical Treatment */}
                    <div className="space-y-2">
                      <div className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-emerald-600" />
                        <span>3-कदम तुरंत उपचार (Three-Step Action Plan):</span>
                      </div>
                      <div className="space-y-2">
                        {diagnosisResult.threeStepTreatmentHi.map((step, idx) => (
                          <div key={idx} className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-xs font-semibold text-emerald-950 flex items-start gap-2">
                            <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-black shrink-0">
                              {idx + 1}
                            </span>
                            <span className="leading-snug">{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Chemicals vs Organic Alternatives */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
                        <span className="text-[10px] font-bold text-blue-800 uppercase block mb-1">
                          अनुशंसित दवा (Chemical Remedy)
                        </span>
                        <div className="font-bold text-slate-900">{diagnosisResult.recommendedChemicalsHi}</div>
                      </div>

                      <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                        <span className="text-[10px] font-bold text-emerald-800 uppercase block mb-1">
                          देसी / जैविक उपाय (Organic Alternative)
                        </span>
                        <div className="font-bold text-slate-900">{diagnosisResult.organicAlternativeHi}</div>
                      </div>
                    </div>

                    {/* Nearest Agri Depot in Nurpur */}
                    <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-center justify-between text-xs text-amber-950">
                      <div>
                        <span className="font-bold block">निकटतम कृषि विक्रय केंद्र (Nurpur Depot):</span>
                        <span className="text-[11px] text-slate-600">{diagnosisResult.nearestAgriDepot}</span>
                      </div>
                      <a 
                        href="tel:01893222111"
                        className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-xs"
                      >
                        कॉल करें
                      </a>
                    </div>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: NAKAL JAMABANDI (जमीन की नकल / फर्द)                                 */}
          {/* ========================================================================= */}
          {activeTab === 'jamabandi' && (
            <div className="space-y-4">
              
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-amber-600" />
                      <span>डिजिटल जमाबंदी व फर्द नकल (HimBhoomi Portal)</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      हिमाचल प्रदेश राजस्व विभाग के आधिकारिक पोर्टल से सीधे खसरा या खेवट नंबर से ऑनलाइन नकल देखें।
                    </p>
                  </div>
                  <span className="bg-emerald-100 text-emerald-800 text-xs font-black px-3 py-1 rounded-full border border-emerald-300 shrink-0">
                    ₹0 मुफ्त (LMK चार्ज नहीं)
                  </span>
                </div>

                {/* Pre-filled guidance card */}
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-4 rounded-2xl border border-amber-200 space-y-3">
                  <div className="text-xs font-bold text-amber-900">
                    तहसील नूरपुर (कांगड़ा) के लिए सीधा पोर्टल लिंक:
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        जिला व उप-तहसील:
                      </label>
                      <input 
                        type="text" 
                        readOnly 
                        value="जिला: कांगड़ा • तहसील: नूरपुर (AC 142)"
                        className="w-full p-2.5 bg-white border border-amber-300 rounded-xl font-bold text-slate-800"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        गांव / मौजा चुनें:
                      </label>
                      <select
                        value={jamabandiVillage}
                        onChange={(e) => setJamabandiVillage(e.target.value)}
                        className="w-full p-2.5 bg-white border border-amber-300 rounded-xl font-bold text-slate-800"
                      >
                        <option value="सुलियाली (Suliyali)">सुलियाली (Suliyali)</option>
                        <option value="कोटला (Kotla)">कोटला (Kotla)</option>
                        <option value="जसूर (Jassur)">जसूर (Jassur)</option>
                        <option value="भदवार (Bhadwar)">भदवार (Bhadwar)</option>
                        <option value="खन्नी (Khanni)">खन्नी (Khanni)</option>
                        <option value="नूरपुर (Nurpur)">नूरपुर शहर (Nurpur)</option>
                        <option value="रे (Reh)">रे (Reh)</option>
                        <option value="बासा (Basa)">बासा (Basa)</option>
                        <option value="सधूं (Sadhoon)">सधूं (Sadhoon)</option>
                        <option value="फतेहपुर (Fatehpur)">फतेहपुर (Fatehpur)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      खसरा नंबर (Khasra No.) या खेवट नंबर दर्ज करें:
                    </label>
                    <div className="flex gap-2">
                      <input 
                        type="text"
                        value={khasraNo}
                        onChange={(e) => setKhasraNo(e.target.value)}
                        placeholder="उदा: 412/1 या 589"
                        className="flex-1 p-2.5 bg-white border border-amber-300 rounded-xl font-bold text-slate-800 text-xs focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                      />
                      <button
                        onClick={() => {
                          setJamabandiCopied(true);
                          setTimeout(() => setJamabandiCopied(false), 3000);
                        }}
                        className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs transition"
                      >
                        {jamabandiCopied ? 'सहेजा गया ✓' : 'कॉपी करें'}
                      </button>
                    </div>
                  </div>

                  {/* Direct Button to Official HimBhoomi Revenue Portal */}
                  <div className="pt-2">
                    <a
                      href="http://lrc.hp.nic.in/lrc/Revenue/viewlandrecords.aspx"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3.5 bg-gradient-to-r from-amber-600 to-orange-700 hover:from-amber-700 hover:to-orange-800 text-white font-black rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition active:scale-98"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>🌐 हिमाचल हिमभूमि पोर्टल पर जमाबंदी खोलें (1-Click HimBhoomi)</span>
                    </a>
                    <p className="text-[10px] text-amber-800 text-center mt-1.5 font-medium">
                      लिंक खुलने पर <strong>District: Kangra</strong> और <strong>Tehsil: Nurpur</strong> चुनकर अपना गांव सेलेक्ट करें।
                    </p>
                  </div>
                </div>

                {/* Shajra Nasab & Mutation Tracking */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                    <div className="font-extrabold text-slate-900 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>शजरा नसब (वंशावली रिकॉर्ड)</span>
                    </div>
                    <p className="text-[11px] text-slate-600">
                      अपने पूर्वजों की भूमि हिस्सेदारी व पैतृक वंशावली की प्रति प्राप्त करने की संपूर्ण प्रक्रिया।
                    </p>
                    <a 
                      href="http://lrc.hp.nic.in/lrc/Revenue/viewlandrecords.aspx"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-700 font-bold hover:underline inline-flex items-center gap-1 text-[11px]"
                    >
                      शजरा पोर्टल लिंक खोलें →
                    </a>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                    <div className="font-extrabold text-slate-900 flex items-center gap-1.5">
                      <RefreshCw className="w-4 h-4 text-blue-600" />
                      <span>दाखिल खारिज (इंतकाल / Mutation)</span>
                    </div>
                    <p className="text-[11px] text-slate-600">
                      रजिस्ट्री या वसीयत के बाद जमीन आपके नाम चढ़ी या नहीं, इसका ऑनलाइन इंतकाल स्टेटस जांचें।
                    </p>
                    <a 
                      href="http://lrc.hp.nic.in/lrc/Revenue/viewlandrecords.aspx"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-700 font-bold hover:underline inline-flex items-center gap-1 text-[11px]"
                    >
                      इंतकाल स्टेटस देखें →
                    </a>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: PM-KISAN & COMPLETE LOK MITRA KENDRA SERVICES                     */}
          {/* ========================================================================= */}
          {activeTab === 'schemes' && (
            <div className="space-y-4">
              
              {/* PM Kisan Direct Status Card */}
              <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-[#102a43] text-white p-5 rounded-2xl shadow-md border border-emerald-500/40 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                      प्रधानमंत्री किसान सम्मान निधि
                    </span>
                    <h3 className="text-lg font-black text-white mt-1">
                      PM-किसान ₹2,000 किस्त व e-KYC स्टेटस
                    </h3>
                    <p className="text-xs text-emerald-100">
                      आधार नंबर या मोबाइल नंबर से अपनी 17वीं / 18वीं किस्त का बैंक क्रेडिट स्टेटस सीधे भारत सरकार पोर्टल पर देखें।
                    </p>
                  </div>
                  <a
                    href="https://pmkisan.gov.in/FarmerStatus.aspx"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs flex items-center gap-1.5 shrink-0 shadow-md transition"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>किस्त स्टेटस जांचें (PM-Kisan)</span>
                  </a>
                </div>
              </div>

              {/* Complete Free Lok Mitra Kendra Catalog */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <h3 className="text-sm font-black text-slate-900">
                    नूरपुर लोक मित्र सेवा कैटलॉग (100% नि:शुल्क)
                  </h3>
                  <span className="text-[11px] text-slate-500 font-bold">
                    कियोस्क फीस: ₹0 (नि:शुल्क)
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  
                  {/* Service 1: Bonafide Himachali */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-slate-900">📜 हिमाचली बोनाफाइड</span>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">फ्री</span>
                      </div>
                      <p className="text-[11px] text-slate-600">
                        निवासी प्रमाण पत्र। आवेदन लिंक व विधायक अनुशंसा पत्र संलग्न।
                      </p>
                    </div>
                    <div className="flex items-center justify-between pt-1 text-[11px]">
                      <a 
                        href="https://services.hp.gov.in" 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-blue-600 font-bold hover:underline"
                      >
                        आवेदन करें →
                      </a>
                      <button 
                        onClick={() => onOpenMlaLetter && onOpenMlaLetter()}
                        className="text-amber-700 font-bold hover:underline cursor-pointer"
                      >
                        सिफारिश पत्र लें
                      </button>
                    </div>
                  </div>

                  {/* Service 2: Pariwar Register */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-slate-900">📋 परिवार रजिस्टर नकल</span>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">फ्री</span>
                      </div>
                      <p className="text-[11px] text-slate-600">
                        पंचायत डिजिटल रिकॉर्ड। राशन कार्ड व छात्रवृत्ति हेतु आवश्यक।
                      </p>
                    </div>
                    <div className="pt-1 text-[11px]">
                      <a 
                        href="https://services.hp.gov.in" 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-blue-600 font-bold hover:underline"
                      >
                        ePanchayat नकल देखें →
                      </a>
                    </div>
                  </div>

                  {/* Service 3: HIMCARE Card */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-slate-900">🏥 हिमकेयर कार्ड ₹5 लाख</span>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">स्वास्थ्य</span>
                      </div>
                      <p className="text-[11px] text-slate-600">
                        सरकारी व निजी अस्पतालों में ₹5 लाख तक का कैशलेस इलाज।
                      </p>
                    </div>
                    <div className="pt-1 text-[11px]">
                      <a 
                        href="https://hpsbys.in" 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-emerald-700 font-bold hover:underline"
                      >
                        कार्ड नवीनीकरण व स्टेटस →
                      </a>
                    </div>
                  </div>

                  {/* Service 4: Unemployment Cert */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-slate-900">🎓 बेरोजगारी प्रमाण पत्र</span>
                        <span className="text-[10px] bg-indigo-100 text-indigo-800 font-bold px-1.5 py-0.2 rounded">रोजगार</span>
                      </div>
                      <p className="text-[11px] text-slate-600">
                        सरकारी भर्ती व परीक्षा हेतु रोजगार कार्यालय पंजीकरण।
                      </p>
                    </div>
                    <div className="pt-1 text-[11px]">
                      <a 
                        href="https://services.hp.gov.in" 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-blue-600 font-bold hover:underline"
                      >
                        HP Employment Portal →
                      </a>
                    </div>
                  </div>

                  {/* Service 5: Income Certificate */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-slate-900">📄 आय प्रमाण पत्र (Income)</span>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">तहसील</span>
                      </div>
                      <p className="text-[11px] text-slate-600">
                        छात्रवृत्ति व राशन कार्ड हेतु पटवारी रिपोर्ट व स्वघोषणा।
                      </p>
                    </div>
                    <div className="pt-1 text-[11px]">
                      <a 
                        href="https://services.hp.gov.in" 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-blue-600 font-bold hover:underline"
                      >
                        e-District पोर्टल खोलें →
                      </a>
                    </div>
                  </div>

                  {/* Service 6: Electricity & Water Outage / Bill */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-slate-900">⚡ HPSEBL बिजली व जल बिल</span>
                        <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.2 rounded">यूटिलिटी</span>
                      </div>
                      <p className="text-[11px] text-slate-600">
                        बिना लाइन लगे बिजली बिल भुगतान व ट्रांसफार्मर फॉल्ट अलर्ट।
                      </p>
                    </div>
                    <div className="pt-1 text-[11px]">
                      <a 
                        href="https://www.hpseb.in" 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-amber-700 font-bold hover:underline"
                      >
                        HPSEBL पोर्टल खोलें →
                      </a>
                    </div>
                  </div>

                </div>
              </div>

              {/* MLA Recommendation Letter Callout */}
              <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-amber-950">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-600 shrink-0" />
                  <div>
                    <span className="font-black text-slate-900 block">
                      क्या किसी प्रमाण पत्र में तहसील में अड़चन आ रही है?
                    </span>
                    <span className="text-[11px] text-slate-600">
                      विधायक रणबीर सिंह निक्का द्वारा हस्ताक्षरित आधिकारिक प्राथमिकता संस्तुति पत्र तुरंत प्राप्त करें।
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => onOpenMlaLetter && onOpenMlaLetter()}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs shrink-0 transition"
                >
                  संस्तुति पत्र बनाएं →
                </button>
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-white border-t border-slate-200 px-5 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-bold text-slate-700">नूरपुर किसान सहायता:</span>
            <span>1800-123-456 (टोल-फ्री) • कैंप ऑफिस: 01893-222111</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl transition"
          >
            बंद करें (Close)
          </button>
        </div>

      </div>
    </div>
  );
};
