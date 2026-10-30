import React, { useState, useEffect } from 'react';
import { ShieldCheck, Phone, MapPin, User, CheckCircle2, X, Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import { requestNikkaCivicPass } from '../../services/api';

interface NikkaCivicPassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthorized: (passData: { phone: string; village: string; name: string }) => void;
  serviceTitle: string;
  serviceCode: string;
}

const NURPUR_VILLAGES = [
  'सुलियाली (Suliyali)',
  'कोटला (Kotla)',
  'जसूर (Jassur)',
  'भदवार (Bhadwar)',
  'खन्नी (Khanni)',
  'नूरपुर शहर (Nurpur Town)',
  'रे (Reh)',
  'फतेहपुर सीमा (Fatehpur Border)',
  'बासा (Basa)',
  'सधूं (Sadhoon)',
  'गंदराण (Gandran)',
  'थेहड़ (Thehar)',
  'नागबाड़ी (Nagbari)',
  'लदरोड़ी (Ladrodi)',
  'जाफरपुर (Jafarpur)',
  'मथेहड़ (Mathehar)',
  'बरंडा (Baranda)',
  'खज्जियां (Khajjian)'
];

export const NikkaCivicPassModal: React.FC<NikkaCivicPassModalProps> = ({
  isOpen,
  onClose,
  onAuthorized,
  serviceTitle,
  serviceCode
}) => {
  const [phone, setPhone] = useState('');
  const [village, setVillage] = useState('सुलियाली (Suliyali)');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if citizen already has a saved civic pass on this device
  useEffect(() => {
    if (!isOpen) return;
    try {
      const savedPass = localStorage.getItem('nikka_civic_pass');
      if (savedPass) {
        const parsed = JSON.parse(savedPass);
        if (parsed.phone) {
          // Auto-authorize in background
          requestNikkaCivicPass({
            phone: parsed.phone,
            villageName: parsed.village,
            citizenName: parsed.name,
            serviceCode,
            queryDetails: { autoAuthorized: true }
          }).catch(console.error);

          onAuthorized(parsed);
          onClose();
        }
      }
    } catch {
      // Local storage fallback
    }
  }, [isOpen, serviceCode]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = phone.trim().replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      setError('कृपया मान्य 10-अंकों का मोबाइल नंबर दर्ज करें (उदा: 9816041288)');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await requestNikkaCivicPass({
        phone: cleanPhone,
        villageName: village,
        citizenName: name.trim() || undefined,
        serviceCode,
        queryDetails: { source: 'WEB_CIVIC_PASS_MODAL' }
      });

      const passData = {
        phone: cleanPhone,
        village,
        name: name.trim() || 'आदरणीय नागरिक',
        passToken: result.passToken
      };

      // Save to localStorage for zero-friction future visits
      localStorage.setItem('nikka_civic_pass', JSON.stringify(passData));

      onAuthorized(passData);
      onClose();
    } catch (err: any) {
      setError(err.message || 'सेवा पास जारी करने में त्रुटि। कृपया पुनः प्रयास करें।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-amber-200 relative">
        
        {/* Top Header Card */}
        <div className="bg-gradient-to-r from-[#102a43] via-[#0f243a] to-[#1a365d] p-5 text-white relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-1.5 bg-amber-500 text-slate-950 rounded-lg text-xs font-black">
              <ShieldCheck className="w-4 h-4" />
            </span>
            <span className="text-[11px] font-bold text-amber-300 tracking-wide uppercase">
              नूरपुर जन सेवा पास • 100% मुफ्त नागरिक सेवा
            </span>
          </div>

          <h3 className="text-lg font-black text-white leading-snug">
            {serviceTitle}
          </h3>
          <p className="text-xs text-slate-300 mt-1">
            विधायक रणबीर सिंह निक्का कैंप कार्यालय द्वारा प्रायोजित • 2 सेकंड में त्वरित प्रवेश
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-bold">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-extrabold text-slate-700 mb-1">
              मोबाइल नंबर (WhatsApp / Calling) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute left-3.5 top-3 flex items-center gap-1 text-xs font-bold text-slate-500">
                <span>+91</span>
              </div>
              <input 
                type="tel"
                maxLength={10}
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                placeholder="98160 41288"
                className="w-full pl-14 pr-3 py-2.5 text-sm font-bold bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500 font-mono tracking-wider"
              />
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              जमाबंदी नकल या मंडी भाव का सीधा लिंक व्हाट्सएप पर भेजा जाएगा।
            </p>
          </div>

          <div>
            <label className="block text-xs font-extrabold text-slate-700 mb-1">
              आपका गांव / पंचायत चुनें <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <select 
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-xs font-bold bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500 cursor-pointer"
              >
                {NURPUR_VILLAGES.map((v, i) => (
                  <option key={i} value={v}>{v}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-extrabold text-slate-700 mb-1">
              आपका नाम (वैकल्पिक / Optional)
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input 
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="उदा: अमर सिंह / करतार चन्द"
                className="w-full pl-9 pr-3 py-2.5 text-xs font-medium bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              यह पास आपके फोन पर सुरक्षित रहेगा। अगली बार कोई भी सेवा 1-क्लिक में तुरंत खुलेगी, दोबारा जानकारी नहीं भरनी होगी।
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-black rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg transition active:scale-98 cursor-pointer disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>सेवा पास जारी हो रहा है...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                <span>🟢 निक्का सेवा पास जारी करें एवं सेवा देखें</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
};
