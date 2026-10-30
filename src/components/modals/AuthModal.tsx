import React, { useState, useEffect } from 'react';
import { X, User, Phone, KeyRound, Shield, CheckCircle2, ArrowRight, Loader2, RotateCw } from 'lucide-react';
import { Language } from '../../types/campaign';
import { sendCitizenOtp, verifyCitizenOtp } from '../../services/api';

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
  const [maskedPhone, setMaskedPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(30);
  const [debugOtp, setDebugOtp] = useState<string | null>(null);

  // Timer countdown for resend
  useEffect(() => {
    let interval: any = null;
    if (otpSent && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpSent, resendTimer]);

  if (!isOpen) return null;

  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) {
      setErrorMsg(lang === 'hi' ? 'कृपया 10-अंकों का वैध मोबाइल नंबर दर्ज करें' : 'Please enter a valid 10-digit phone number');
      return;
    }

    setLoading(true);
    try {
      const res = await sendCitizenOtp(cleanPhone, name);
      if (res.success) {
        setOtpSent(true);
        setMaskedPhone(res.maskedPhone || `+91 ******${cleanPhone.slice(-4)}`);
        setSuccessMsg(res.message);
        if (res.debugOtp) setDebugOtp(res.debugOtp);
        setResendTimer(30);
      } else {
        setErrorMsg(res.message || 'OTP भेजने में त्रुटि हुई');
      }
    } catch {
      setErrorMsg(lang === 'hi' ? 'सर्वर से संपर्क नहीं हो सका। कृपया पुनः प्रयास करें।' : 'Could not connect to server.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!otp.trim()) {
      setErrorMsg(lang === 'hi' ? 'कृपया OTP कोड दर्ज करें' : 'Please enter the OTP code');
      return;
    }

    setLoading(true);
    try {
      const cleanPhone = phone.replace(/[^0-9]/g, '');
      const res = await verifyCitizenOtp(cleanPhone, otp, name);
      if (res.success && res.user) {
        setSuccessMsg(lang === 'hi' ? '✓ प्रमाणीकरण सफल! स्वागत है।' : '✓ Verified successfully!');
        setTimeout(() => {
          onLoginSuccess(res.user?.name || name || 'नागरिक सदस्य');
          onClose();
        }, 600);
      } else {
        setErrorMsg(res.message || (lang === 'hi' ? 'अमान्य OTP कोड' : 'Invalid OTP code'));
      }
    } catch {
      setErrorMsg(lang === 'hi' ? 'सत्यापन विफल हुआ' : 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setOtpSent(false);
    setOtp('');
    setErrorMsg(null);
    setSuccessMsg(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl border border-slate-200 max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <Shield className="w-4 h-4 text-blue-700" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-base">
                {otpSent 
                  ? (lang === 'hi' ? 'SMS OTP सत्यापन' : 'SMS OTP Verification') 
                  : authMode === 'login' 
                    ? (lang === 'hi' ? 'नागरिक लॉगिन (Citizen Login)' : 'Citizen Login')
                    : (lang === 'hi' ? 'नया पंजीकरण (Register)' : 'New Registration')}
              </h3>
              <p className="text-[11px] text-slate-500">
                {lang === 'hi' ? 'सुरक्षित OTP गेटवे • रणबीर सिंह निक्का नागरिक सेवा' : 'Secure SMS OTP Gateway • Ranbir Singh Nikka Desk'}
              </p>
            </div>
          </div>
          <button 
            onClick={handleClose}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error / Success Alerts */}
        {errorMsg && (
          <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-semibold">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold">
            {successMsg}
          </div>
        )}

        {/* Step 1: Phone / Name Input */}
        {!otpSent ? (
          <form onSubmit={handleSendOtp} className="space-y-3.5 text-xs">
            {authMode === 'register' && (
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {lang === 'hi' ? 'पूरा नाम (Full Name)' : 'Full Name'}
                </label>
                <input
                  type="text"
                  required
                  placeholder="उदा. राहुल शर्मा"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {lang === 'hi' ? 'मोबाइल नंबर (Mobile Number)' : 'Mobile Number'}
              </label>
              <div className="flex items-center space-x-2">
                <span className="bg-slate-100 border border-slate-300 px-3 py-2.5 rounded-xl font-bold text-slate-600">
                  +91
                </span>
                <input
                  type="tel"
                  required
                  placeholder="10 अंकों का मोबाइल नंबर"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="flex-1 bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                />
              </div>
            </div>

            {authMode === 'register' && (
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {lang === 'hi' ? 'वोटर आईडी (EPIC No. - वैकल्पिक)' : 'Voter ID (EPIC - Optional)'}
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

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-[#0066cc] hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition shadow-xs flex items-center justify-center space-x-1.5 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>{lang === 'hi' ? 'OTP भेजा जा रहा है...' : 'Sending OTP...'}</span>
                  </>
                ) : (
                  <>
                    <span>{lang === 'hi' ? 'OTP प्राप्त करें (Get Real SMS OTP)' : 'Get SMS OTP'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>

            <div className="text-center pt-1 text-[11px] text-slate-500">
              {authMode === 'login' ? (
                <span>
                  {lang === 'hi' ? 'नया खाता बनाना चाहते हैं?' : 'New user?'}{' '}
                  <button
                    type="button"
                    onClick={() => setAuthMode('register')}
                    className="text-blue-600 font-bold hover:underline"
                  >
                    {lang === 'hi' ? 'पंजीकरण करें (Register)' : 'Register here'}
                  </button>
                </span>
              ) : (
                <span>
                  {lang === 'hi' ? 'पहले से पंजीकृत हैं?' : 'Already registered?'}{' '}
                  <button
                    type="button"
                    onClick={() => setAuthMode('login')}
                    className="text-blue-600 font-bold hover:underline"
                  >
                    {lang === 'hi' ? 'लॉगिन करें (Login)' : 'Login here'}
                  </button>
                </span>
              )}
            </div>
          </form>
        ) : (
          /* Step 2: OTP Verification */
          <form onSubmit={handleVerifyOtp} className="space-y-4 text-xs">
            <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-center space-y-1">
              <p className="text-[11px] text-slate-600">
                {lang === 'hi' ? '6-अंकों का सत्यापन कोड भेजा गया:' : '6-digit verification code sent to:'}
              </p>
              <p className="text-sm font-black font-mono text-blue-900">{maskedPhone}</p>
              {debugOtp && (
                <span className="inline-block bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded mt-1">
                  ✓ लाइव जनरेटेड OTP: <b className="font-mono">{debugOtp}</b>
                </span>
              )}
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1 text-center">
                {lang === 'hi' ? 'OTP कोड दर्ज करें' : 'Enter 6-Digit OTP'}
              </label>
              <input
                type="text"
                required
                maxLength={6}
                placeholder="• • • • • •"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                className="w-full bg-slate-50 border-2 border-blue-400 focus:border-blue-600 rounded-xl p-3 text-lg font-mono text-center tracking-[0.5em] text-slate-900 font-bold focus:outline-none"
                autoFocus
              />
            </div>

            <div className="flex items-center justify-between text-[11px]">
              <button
                type="button"
                onClick={() => setOtpSent(false)}
                className="text-slate-500 hover:text-slate-800 underline font-medium"
              >
                ← {lang === 'hi' ? 'नंबर बदलें' : 'Change Phone'}
              </button>

              {resendTimer > 0 ? (
                <span className="text-slate-400">
                  {lang === 'hi' ? `पुनः भेजें (${resendTimer}s)` : `Resend in (${resendTimer}s)`}
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => handleSendOtp()}
                  className="text-blue-600 font-bold hover:underline flex items-center gap-1"
                >
                  <RotateCw className="w-3 h-3" />
                  <span>{lang === 'hi' ? 'OTP दोबारा भेजें' : 'Resend OTP'}</span>
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || otp.length < 4}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition shadow-xs flex items-center justify-center space-x-1.5 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>{lang === 'hi' ? 'सत्यापित किया जा रहा है...' : 'Verifying...'}</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{lang === 'hi' ? 'सत्यापन करें एवं लॉगिन करें' : 'Verify & Login'}</span>
                </>
              )}
            </button>
          </form>
        )}

      </div>
    </div>
  );
};

