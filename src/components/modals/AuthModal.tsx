import React, { useState } from 'react';
import { X, User, Phone, KeyRound, Shield, CheckCircle2, ArrowRight } from 'lucide-react';
import { Language } from '../../types/campaign';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onLoginSuccess: (name: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  lang,
  onLoginSuccess
}) => {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [voterId, setVoterId] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpSent) {
      setOtpSent(true);
    } else {
      onLoginSuccess(name || 'नागरिक सदस्य');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl border border-slate-200 max-w-md w-full p-6 shadow-2xl space-y-5 animate-in fade-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-base">
                {authMode === 'login' ? 'नागरिक लॉगिन (Citizen Login)' : 'नया पंजीकरण (Register)'}
              </h3>
              <p className="text-[11px] text-slate-500">
                जनादेश • रणबीर सिंह निक्का नागरिक सेवा पोर्टल
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          
          {authMode === 'register' && (
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                पूरा नाम (Full Name)
              </label>
              <input
                type="text"
                required
                placeholder="उदा. राहुल शर्मा"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-800"
              />
            </div>
          )}

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              मोबाइल नंबर (Mobile Number)
            </label>
            <div className="flex items-center space-x-2">
              <span className="bg-slate-100 border border-slate-300 px-3 py-2.5 rounded-xl font-bold text-slate-600">
                +91
              </span>
              <input
                type="tel"
                required
                placeholder="10 अंकों का मोबाइल नंबर"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="flex-1 bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-800"
              />
            </div>
          </div>

          {authMode === 'register' && (
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                वोटर आईडी (EPIC No. - वैकल्पिक)
              </label>
              <input
                type="text"
                placeholder="उदा. HP/142/XXXXXX"
                value={voterId}
                onChange={(e) => setVoterId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-800 uppercase"
              />
            </div>
          )}

          {otpSent && (
            <div className="space-y-1">
              <label className="block font-bold text-slate-700">
                OTP दर्ज करें (सत्यापन कोड)
              </label>
              <input
                type="text"
                required
                placeholder="4 अंकों का OTP (उदा. 1234)"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full bg-blue-50/50 border border-blue-300 rounded-xl p-2.5 text-xs font-mono text-center tracking-widest text-slate-900 font-bold"
              />
              <span className="text-[10px] text-emerald-600 font-medium block text-right">✓ डेमो कोड: 1234</span>
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2.5 bg-[#0066cc] hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition shadow-xs flex items-center justify-center space-x-1.5"
            >
              <span>{otpSent ? 'सत्यापन करें एवं आगे बढ़ें' : 'ओटीपी प्राप्त करें (Get OTP)'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="text-center pt-1 text-[11px] text-slate-500">
            {authMode === 'login' ? (
              <span>
                नया खाता बनाना चाहते हैं?{' '}
                <button
                  type="button"
                  onClick={() => setAuthMode('register')}
                  className="text-blue-600 font-bold hover:underline"
                >
                  पंजीकरण करें (Register)
                </button>
              </span>
            ) : (
              <span>
                पहले से पंजीकृत हैं?{' '}
                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className="text-blue-600 font-bold hover:underline"
                >
                  लॉगिन करें (Login)
                </button>
              </span>
            )}
          </div>

        </form>

      </div>
    </div>
  );
};
