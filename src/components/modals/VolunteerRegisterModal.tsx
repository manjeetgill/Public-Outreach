import React, { useState } from 'react';
import { X, UserPlus, CheckCircle2, ShieldCheck, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Language } from '../../types/campaign';

interface VolunteerRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const VolunteerRegisterModal: React.FC<VolunteerRegisterModalProps> = ({ isOpen, onClose, lang }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [ward, setWard] = useState(14);
  const [role, setRole] = useState('बूथ कार्यकर्ता (Booth Volunteer)');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 }
    });
    setSubmitted(true);
  };

  const handleClose = () => {
    setSubmitted(false);
    setName('');
    setPhone('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-3">
      <div className="bg-white w-full max-w-sm rounded-2xl p-5 shadow-2xl space-y-4 border border-slate-200 animate-in fade-in zoom-in-95">
        
        <div className="flex items-center justify-between border-b pb-2">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-amber-500 text-white rounded-lg">
              <UserPlus className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-sm font-extrabold text-[#102a43]">
                {lang === 'hi' ? 'कार्यकर्ता दल से जुड़ें' : 'Join Campaign Volunteer Team'}
              </h3>
              <p className="text-[10px] text-slate-500">
                {lang === 'hi' ? 'नूरपुर के विकास में अपनी भागीदारी सुनिश्चित करें' : 'Be part of Nurpur development movement'}
              </p>
            </div>
          </div>
          <button onClick={handleClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="text-center py-6 space-y-3">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-base font-extrabold text-slate-900">
              {lang === 'hi' ? 'हार्दिक बधाई एवं स्वागत!' : 'Welcome to Team Nikka!'}
            </h4>
            <p className="text-xs text-slate-600">
              {lang === 'hi' 
                ? `${name} जी, आपका पंजीकरण सफलतापूर्वक हो गया है। आपके मंडल अध्यक्ष शीघ्र ही संपर्क करेंगे। आपको +250 वेलकम पॉइंट्स मिले हैं!` 
                : `Thank you ${name}! You are registered. Your mandal head will connect shortly. +250 welcome points credited!`}
            </p>
            <button
              onClick={handleClose}
              className="w-full py-2.5 bg-[#102a43] text-white text-xs font-bold rounded-xl"
            >
              {lang === 'hi' ? 'धन्यवाद (Continue)' : 'Done'}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                {lang === 'hi' ? 'पूरा नाम' : 'Full Name'}
              </label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                placeholder="उदा: विक्रम शर्मा" 
                className="w-full p-2.5 rounded-xl border border-slate-300" 
                required 
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                {lang === 'hi' ? 'मोबाइल नंबर (व्हाट्सएप)' : 'WhatsApp Phone Number'}
              </label>
              <input 
                type="tel" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)}
                placeholder="98160xxxxx" 
                className="w-full p-2.5 rounded-xl border border-slate-300" 
                required 
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  {lang === 'hi' ? 'वार्ड संख्या' : 'Ward'}
                </label>
                <select 
                  value={ward} 
                  onChange={(e) => setWard(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50"
                >
                  {Array.from({ length: 24 }, (_, i) => i + 1).map((w) => (
                    <option key={w} value={w}>वार्ड {w}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  {lang === 'hi' ? 'इच्छुक दायित्व' : 'Preferred Role'}
                </label>
                <select 
                  value={role} 
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50"
                >
                  <option value="बूथ कार्यकर्ता (Booth Volunteer)">बूथ कार्यकर्ता</option>
                  <option value="पन्ना प्रमुख (Panna Pramukh)">पन्ना प्रमुख</option>
                  <option value="सोशल मीडिया प्रचारक (IT Cell)">सोशल मीडिया प्रचारक</option>
                  <option value="मातृशक्ति / महिला मंडल">महिला विंग</option>
                </select>
              </div>
            </div>

            <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
              <span>प्रचार सामग्री किट, टी-शर्ट व आईडी कार्ड कैंप ऑफिस द्वारा प्रदान किया जाएगा।</span>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-gradient-to-r from-orange-600 to-amber-600 text-white font-extrabold rounded-xl text-xs shadow-md transition"
            >
              {lang === 'hi' ? 'कार्यकर्ता दल में शामिल हों (Join Team)' : 'Register as Volunteer'}
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
