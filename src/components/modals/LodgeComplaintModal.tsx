import React, { useState, useRef } from 'react';
import { X, Camera, AlertCircle, CheckCircle2, Upload, MapPin, Phone, User, Mic, MicOff, Loader2, Sparkles, ShieldCheck, AlertTriangle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { GrievanceTicket, Language } from '../../types/campaign';
import { transcribeAudio, verifyGrievancePhoto, PhotoVerificationResult } from '../../services/api';

interface LodgeComplaintModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddComplaint: (complaint: GrievanceTicket) => void;
  lang: Language;
}

export const LodgeComplaintModal: React.FC<LodgeComplaintModalProps> = ({
  isOpen,
  onClose,
  onAddComplaint,
  lang
}) => {
  const [category, setCategory] = useState('सड़क एवं गड्ढा मरम्मत');
  const [wardNo, setWardNo] = useState(14);
  const [locationName, setLocationName] = useState('');
  const [citizenName, setCitizenName] = useState('');
  const [phone, setPhone] = useState('');
  const [description, setDescription] = useState('');
  const [photoSelected, setPhotoSelected] = useState<string | null>(null);
  const [isAnalyzingPhoto, setIsAnalyzingPhoto] = useState(false);
  const [visionResult, setVisionResult] = useState<PhotoVerificationResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [submittedToken, setSubmittedToken] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const base64Url = reader.result as string;
      setPhotoSelected(base64Url);
      setIsAnalyzingPhoto(true);

      try {
        const base64Data = base64Url.split(',')[1];
        const result = await verifyGrievancePhoto(base64Data, file.type || 'image/jpeg');
        setVisionResult(result);
        if (result.suggestedCategory) {
          setCategory(result.suggestedCategory);
        }
        if (result.technicalSummary && !description) {
          setDescription(result.technicalSummary);
        }
      } catch (err) {
        console.warn('Vision inspection error:', err);
      } finally {
        setIsAnalyzingPhoto(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach(t => t.stop());
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setIsTranscribing(true);
        try {
          const text = await transcribeAudio(audioBlob);
          if (text) {
            setDescription(prev => prev ? `${prev} ${text}` : text);
          }
        } catch (err) {
          console.error('Transcription error:', err);
        } finally {
          setIsTranscribing(false);
          setIsRecording(false);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch {
      alert(lang === 'hi' ? 'माइक्रोफोन की अनुमति दें।' : 'Please allow microphone access.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !locationName.trim() || !citizenName.trim()) {
      alert(lang === 'hi' ? 'कृपया सभी आवश्यक फ़ील्ड भरें' : 'Please fill all required fields');
      return;
    }

    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const token = `#NR-${randomNum}`;

    const newTicket: GrievanceTicket = {
      token,
      category,
      title: `${category} - ${locationName}`,
      titleEn: `${category} issue at ${locationName}`,
      location: `स्थान: ${locationName}, वार्ड ${wardNo}`,
      wardNo,
      citizenName,
      phone: phone || '98160*****',
      status: 'in-progress',
      submittedDate: 'अभी-अभी (Just now)',
      whatsappSubscribed: true,
      photoUrl: photoSelected || undefined,
      timeline: [
        {
          title: lang === 'hi' ? 'शिकायत दर्ज (नागरिक द्वारा)' : 'Grievance Registered by Citizen',
          titleEn: 'Grievance Registered by Citizen',
          timestamp: 'आज, अभी',
          description: visionResult 
            ? (lang === 'hi' ? `AI विज़न ऑडिट पूर्ण: प्राथमिकता ${visionResult.severityRating} • विभाग: ${visionResult.department}` : `AI Vision Audit: Priority ${visionResult.severityRating} • Department: ${visionResult.department}`)
            : (lang === 'hi' ? 'डिजिटल नागरिक पोर्टल से सीधे पंजीकृत' : 'Registered directly via Digital Civic Portal'),
          descriptionEn: 'Registered directly via Digital Civic Portal',
          status: 'done'
        },
        {
          title: lang === 'hi' ? 'विधायक कैंप कार्यालय को प्रेषित' : 'Dispatched to MLA Camp Office',
          titleEn: 'Dispatched to MLA Camp Office',
          timestamp: 'प्रक्रियाधीन',
          description: lang === 'hi' ? 'फास्ट-ट्रैक समीक्षा टीम को ऑटो-असाइन' : 'Auto-assigned to Fast-Track Review Team',
          descriptionEn: 'Auto-assigned to Fast-Track Review Team',
          status: 'current'
        },
        {
          title: lang === 'hi' ? 'विभागीय आदेश व फील्ड निस्तारण' : 'Departmental Action & Field Resolution',
          titleEn: 'Departmental Action & Field Resolution',
          timestamp: 'लंबित',
          description: lang === 'hi' ? 'संबंधित जूनियर इंजीनियर/अधिकारी को त्वरित निर्देश' : 'Instructions sent to JE/Department',
          descriptionEn: 'Instructions sent to JE/Department',
          status: 'pending'
        }
      ]
    };

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });

    onAddComplaint(newTicket);
    setSubmittedToken(token);
  };

  const handleResetAndClose = () => {
    setSubmittedToken(null);
    setDescription('');
    setLocationName('');
    setCitizenName('');
    setPhone('');
    setPhotoSelected(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-3 transition-opacity">
      <div className="bg-white w-full max-w-md rounded-2xl p-5 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200 border border-slate-200 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
              <AlertCircle className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-sm font-extrabold text-[#102a43]">
                {lang === 'hi' ? 'जन समस्या दर्ज करें • फास्ट-ट्रैक' : 'Lodge Citizen Grievance • Fast-Track'}
              </h3>
              <p className="text-[10px] text-slate-500">
                {lang === 'hi' ? 'सीधे विधायक रणबीर सिंह निक्का कैंप कार्यालय में दर्ज' : 'Direct to MLA Camp Office Desk'}
              </p>
            </div>
          </div>
          <button 
            onClick={handleResetAndClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submittedToken ? (
          <div className="py-6 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                {lang === 'hi' ? 'शिकायत सफलतापूर्वक दर्ज हुई' : 'Grievance Registered Successfully'}
              </span>
              <h4 className="text-xl font-extrabold text-[#102a43] mt-2 font-mono">
                {submittedToken}
              </h4>
              <p className="text-xs text-slate-600 mt-2 max-w-xs mx-auto">
                {lang === 'hi' 
                  ? 'यह टोकन नंबर आपके व्हाट्सएप व एसएमएस पर भेज दिया गया है। विधायक कार्यालय की फास्ट-ट्रैक टीम 24 घंटे के अंदर निरीक्षण करेगी।' 
                  : 'Token number sent to your WhatsApp and SMS. MLA fast-track desk will inspect within 24 hours.'}
              </p>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-left text-slate-700 space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500">{lang === 'hi' ? 'नागरिक:' : 'Citizen:'}</span>
                <span className="font-bold">{citizenName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{lang === 'hi' ? 'वार्ड संख्या:' : 'Ward:'}</span>
                <span className="font-bold">Ward {wardNo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{lang === 'hi' ? 'श्रेणी:' : 'Category:'}</span>
                <span className="font-bold">{category}</span>
              </div>
            </div>

            <button
              onClick={handleResetAndClose}
              className="w-full py-2.5 bg-[#102a43] hover:bg-[#0b1b2b] text-white font-extrabold rounded-xl text-xs transition shadow-md"
            >
              {lang === 'hi' ? 'स्थिति ट्रैक करें (View Status)' : 'Done & Track Status'}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Category */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                {lang === 'hi' ? 'समस्या का प्रकार (Category)' : 'Grievance Type'}
              </label>
              <select 
                value={category} 
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="सड़क एवं गड्ढा मरम्मत">{lang === 'hi' ? 'सड़क एवं गड्ढा मरम्मत (Road & Potholes)' : 'Roads & Potholes'}</option>
                <option value="पेयजल / पाइपलाइन लीकेज">{lang === 'hi' ? 'पेयजल / पाइपलाइन लीकेज (Water & Leakage)' : 'Drinking Water & Leaks'}</option>
                <option value="विद्युत / ट्रांसफार्मर समस्या">{lang === 'hi' ? 'विद्युत / ट्रांसफार्मर समस्या (Power & Transformer)' : 'Electricity & Transformer'}</option>
                <option value="राशन एवं सरकारी योजना सहायता">{lang === 'hi' ? 'राशन एवं सरकारी योजना सहायता (Ration & Welfare Schemes)' : 'Ration & Govt Schemes'}</option>
                <option value="नाली एवं स्वच्छता सफाई">{lang === 'hi' ? 'नाली एवं स्वच्छता सफाई (Drainage & Sanitation)' : 'Drainage & Sanitation'}</option>
                <option value="अन्य नागरिक समस्या">{lang === 'hi' ? 'अन्य नागरिक समस्या (Other Civic Issue)' : 'Other Civic Issue'}</option>
              </select>
            </div>

            {/* Ward & Location */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  {lang === 'hi' ? 'वार्ड संख्या' : 'Ward No.'}
                </label>
                <select 
                  value={wardNo}
                  onChange={(e) => setWardNo(Number(e.target.value))}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white"
                >
                  {Array.from({ length: 24 }, (_, i) => i + 1).map((w) => (
                    <option key={w} value={w}>
                      {lang === 'hi' ? `वार्ड ${w}` : `Ward ${w}`}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-orange-500" />
                  {lang === 'hi' ? 'स्थान / मोहल्ला' : 'Locality'}
                </label>
                <input 
                  type="text" 
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  placeholder={lang === 'hi' ? 'उदा: शिव मंदिर के पास' : 'e.g. Near Shiv Mandir'}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>
            </div>

            {/* Citizen Details */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <User className="w-3 h-3 text-slate-400" />
                  {lang === 'hi' ? 'आपका नाम' : 'Your Name'}
                </label>
                <input 
                  type="text" 
                  value={citizenName}
                  onChange={(e) => setCitizenName(e.target.value)}
                  placeholder={lang === 'hi' ? 'नाम लिखें' : 'Full Name'}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <Phone className="w-3 h-3 text-slate-400" />
                  {lang === 'hi' ? 'मोबाइल नंबर' : 'Phone'}
                </label>
                <input 
                  type="tel" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="98160xxxxx"
                  maxLength={10}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            {/* Description with Voice Transcription */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-bold text-slate-700">
                  {lang === 'hi' ? 'समस्या का संक्षिप्त विवरण' : 'Description of Issue'}
                </label>
                
                {/* Voice-to-Text Button using Gemini 3.5 Transcribe */}
                <button
                  type="button"
                  onClick={isRecording ? stopRecording : startRecording}
                  disabled={isTranscribing}
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-lg flex items-center gap-1 transition ${
                    isRecording 
                      ? 'bg-rose-600 text-white animate-pulse shadow-xs' 
                      : isTranscribing
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200'
                  }`}
                  title="Speak your complaint in Hindi or English (Gemini 3.5 Transcribe)"
                >
                  {isTranscribing ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin text-amber-600" />
                      <span>{lang === 'hi' ? 'टेक्स्ट में बदल रहा है...' : 'Transcribing...'}</span>
                    </>
                  ) : isRecording ? (
                    <>
                      <MicOff className="w-3 h-3 text-white" />
                      <span>{lang === 'hi' ? 'बोलना बंद करें' : 'Stop'}</span>
                    </>
                  ) : (
                    <>
                      <Mic className="w-3 h-3 text-amber-600" />
                      <span>{lang === 'hi' ? '🎙️ बोलकर दर्ज करें' : '🎙️ Speak to Type'}</span>
                    </>
                  )}
                </button>
              </div>

              <textarea 
                rows={3} 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={
                  isRecording 
                    ? (lang === 'hi' ? '🎤 अपनी समस्या बोलें... रिकॉर्डिंग चालू है' : '🎤 Speak your issue now... recording')
                    : isTranscribing
                      ? (lang === 'hi' ? 'ऑडियो टेक्स्ट में बदला जा रहा है...' : 'Transcribing audio via Gemini 3.5...')
                      : (lang === 'hi' ? 'समस्या को विस्तार से बताएं ताकि टीम तुरंत कार्रवाई कर सके...' : 'Provide details so our rapid response team can take immediate action...')
                }
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>

            {/* Real Photo Attachment & Multimodal Vision Audit (vision.py) */}
            <div>
              <input 
                type="file" 
                ref={fileInputRef} 
                accept="image/*" 
                onChange={handlePhotoUpload} 
                className="hidden" 
              />
              
              {!photoSelected ? (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="p-3 border-2 border-dashed border-slate-300 hover:border-orange-500 rounded-xl text-center cursor-pointer transition bg-slate-50 hover:bg-orange-50/40 group"
                >
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Camera className="w-5 h-5 text-slate-400 group-hover:text-orange-500 transition" />
                    <p className="text-[11px] font-bold text-slate-700 group-hover:text-orange-700">
                      {lang === 'hi' ? 'क्षतिग्रस्त स्थल की फोटो लगाएं (AI विज़न ऑडिट)' : 'Upload Grievance Photo (AI Vision Audit)'}
                    </p>
                  </div>
                  <p className="text-[9px] text-slate-500">
                    {lang === 'hi' ? 'कैमरा या गैलरी से वास्तविक तस्वीर चुनें • AI स्वतः श्रेणी व गंभीरता जांचेगा' : 'Select from camera or file • AI will automatically audit damage & verify'}
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-start gap-2.5 p-2 bg-slate-50 rounded-xl border border-slate-200">
                    <img 
                      src={photoSelected} 
                      alt="Uploaded preview" 
                      className="w-16 h-16 object-cover rounded-lg border border-slate-300 shadow-xs" 
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-700 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          {lang === 'hi' ? 'फोटो संलग्न' : 'Photo Attached'}
                        </span>
                        <button 
                          type="button" 
                          onClick={() => {
                            setPhotoSelected(null);
                            setVisionResult(null);
                          }}
                          className="text-[10px] text-rose-600 hover:underline font-semibold"
                        >
                          {lang === 'hi' ? 'हटाएं' : 'Remove'}
                        </button>
                      </div>
                      <p className="text-[9px] text-slate-500 truncate mt-0.5">
                        {lang === 'hi' ? 'नागरिक प्रमाण • Geo-Verified' : 'Citizen Proof • Geo-Verified'}
                      </p>
                      
                      {isAnalyzingPhoto && (
                        <div className="mt-1 flex items-center gap-1.5 text-[10px] text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                          <Loader2 className="w-3 h-3 animate-spin text-amber-600" />
                          <span>{lang === 'hi' ? 'AI विज़न ऑडिट प्रगति पर है...' : 'AI Vision inspecting damage...'}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* AI Vision Verification Results Card */}
                  {visionResult && !isAnalyzingPhoto && (
                    <div className="p-2.5 bg-gradient-to-r from-slate-50 to-emerald-50/30 rounded-xl border border-emerald-200 space-y-1.5 animate-in fade-in duration-200">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="font-extrabold text-emerald-800 flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          {visionResult.isAuthenticCivilDamage 
                            ? (lang === 'hi' ? `✓ वास्तविक क्षति सत्यापित (${visionResult.confidence}% Confidence)` : `✓ Authentic Civil Defect (${visionResult.confidence}%)`)
                            : (lang === 'hi' ? '⚠️ अप्रमाणित / सामान्य छवि' : '⚠️ Non-civil infrastructure image')}
                        </span>
                        
                        {/* Severity Badge */}
                        <span className={`px-2 py-0.5 rounded-full font-black text-[9px] uppercase tracking-wider ${
                          visionResult.severityRating === 'CRITICAL' 
                            ? 'bg-rose-100 text-rose-800 border border-rose-300 animate-pulse'
                            : visionResult.severityRating === 'HIGH'
                              ? 'bg-amber-100 text-amber-900 border border-amber-300'
                              : 'bg-blue-100 text-blue-900 border border-blue-200'
                        }`}>
                          {visionResult.severityRating === 'CRITICAL' ? 'अति-गंभीर (CRITICAL)' : visionResult.severityRating === 'HIGH' ? 'उच्च (HIGH)' : 'सामान्य (NORMAL)'}
                        </span>
                      </div>

                      <div className="text-[10px] text-slate-700 flex flex-wrap items-center gap-1.5">
                        <span className="bg-white px-2 py-0.5 rounded-md border border-slate-200 font-bold text-slate-800">
                          {visionResult.department}
                        </span>
                        <span className="text-slate-500">
                          {lang === 'hi' ? 'स्वतः श्रेणी आवंटित:' : 'Category Auto-assigned:'} <b>{visionResult.suggestedCategory}</b>
                        </span>
                      </div>

                      {visionResult.technicalSummary && (
                        <div className="bg-white/80 p-2 rounded-lg border border-slate-200 text-[10px] text-slate-600 italic">
                          <p className="font-sans">"<b>{lang === 'hi' ? 'फील्ड इंजीनियर नोट' : 'Field Engineer Note'}:</b> {visionResult.technicalSummary}"</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Priority & WhatsApp alert badge */}
            <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 flex items-center justify-between text-[11px]">
              <span className="text-amber-900 font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                {lang === 'hi' ? 'व्हाट्सएप पर लाइव स्टेटस अपडेट प्राप्त करें' : 'Get Live WhatsApp Status Alerts'}
              </span>
              <span className="bg-amber-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded">
                FREE
              </span>
            </div>

            {/* Submit */}
            <button 
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-extrabold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition active:scale-98"
            >
              <Upload className="w-4 h-4" />
              {lang === 'hi' ? 'शिकायत सबमिट करें (Submit Grievance)' : 'Submit Grievance Now'}
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
