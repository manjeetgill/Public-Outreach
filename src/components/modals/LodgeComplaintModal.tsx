import React, { useState } from 'react';
import { X, Camera, AlertCircle, CheckCircle2, Upload, MapPin, Phone, User } from 'lucide-react';
import confetti from 'canvas-confetti';
import { GrievanceTicket, Language } from '../../types/campaign';

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
  const [submittedToken, setSubmittedToken] = useState<string | null>(null);

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
      timeline: [
        {
          title: lang === 'hi' ? 'शिकायत दर्ज (नागरिक द्वारा)' : 'Grievance Registered by Citizen',
          titleEn: 'Grievance Registered by Citizen',
          timestamp: 'आज, अभी',
          description: lang === 'hi' ? 'डिजिटल नागरिक पोर्टल से सीधे पंजीकृत' : 'Registered directly via Digital Civic Portal',
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

            {/* Description */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                {lang === 'hi' ? 'समस्या का संक्षिप्त विवरण' : 'Description of Issue'}
              </label>
              <textarea 
                rows={3} 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={lang === 'hi' ? 'समस्या को विस्तार से बताएं ताकि टीम तुरंत कार्रवाई कर सके...' : 'Provide details so our rapid response team can take immediate action...'}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>

            {/* Photo Attachment Simulation */}
            <div 
              onClick={() => setPhotoSelected(photoSelected ? null : 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&auto=format&fit=crop&q=80')}
              className={`p-3 border-2 border-dashed rounded-xl text-center cursor-pointer transition ${
                photoSelected ? 'border-emerald-500 bg-emerald-50/50' : 'border-slate-300 bg-slate-50 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center justify-center gap-2 mb-1">
                {photoSelected ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                ) : (
                  <Camera className="w-5 h-5 text-slate-400" />
                )}
                <p className="text-[11px] font-bold text-slate-700">
                  {photoSelected 
                    ? (lang === 'hi' ? 'फोटो संलग्न की गई (Geo-Tagged Photo Ready)' : 'Photo Attached')
                    : (lang === 'hi' ? 'फोटो जोड़ें (Geo-tagged Photo)' : 'Attach Geo-tagged Photo')}
                </p>
              </div>
              <p className="text-[9px] text-slate-500">
                {photoSelected 
                  ? (lang === 'hi' ? 'बदलने या हटाने के लिए क्लिक करें' : 'Click to toggle or remove')
                  : (lang === 'hi' ? 'कैमरा या गैलरी से वास्तविक स्थिति की तस्वीर लगाएं' : 'Camera or gallery upload')}
              </p>
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
