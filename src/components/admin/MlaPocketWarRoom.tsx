import React, { useState } from 'react';
import { 
  PhoneCall, 
  Radio, 
  Users, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Zap, 
  Droplets, 
  Truck, 
  FileText, 
  Send, 
  Clock, 
  Share2, 
  Check, 
  Award,
  Flame,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Language } from '../../types/campaign';
import { MLA_INFO } from '../../data/campaignData';

interface MlaPocketWarRoomProps {
  lang: Language;
  onOpenVoiceBroadcast: () => void;
  onOpenMlaLetter?: () => void;
}

export const MlaPocketWarRoom: React.FC<MlaPocketWarRoomProps> = ({
  lang,
  onOpenVoiceBroadcast,
  onOpenMlaLetter
}) => {
  const [resolvedIssues, setResolvedIssues] = useState<Record<string, string>>({});
  const [broadcastingCadre, setBroadcastingCadre] = useState(false);
  const [cadreBroadcastDone, setCadreBroadcastDone] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleAction = (id: string, actionLabel: string) => {
    setResolvedIssues(prev => ({ ...prev, [id]: actionLabel }));
    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.6 }
    });
    showToast(`विधायक आदेश निष्पादित: ${actionLabel}`);
  };

  const handleQuickCadreBroadcast = () => {
    setBroadcastingCadre(true);
    setTimeout(() => {
      setBroadcastingCadre(false);
      setCadreBroadcastDone(true);
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.5 }
      });
      showToast("30-सेकंड दैनिक ऑडियो संदेश सभी 118 पन्ना प्रमुखों के व्हाट्सएप पर प्रसारित!");
    }, 1200);
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-600 text-white px-4 py-2.5 rounded-xl shadow-2xl flex items-center space-x-2 text-xs font-bold animate-in slide-in-from-top duration-200">
          <CheckCircle2 className="w-4 h-4 text-white" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-orange-600 text-slate-950 p-4 sm:p-5 rounded-2xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="bg-slate-950 text-amber-400 text-[10px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider">
              1-Touch Pocket War Room
            </span>
            <span className="text-slate-900 font-bold text-xs">
              रणबीर सिंह निक्का • नूरपुर वि.स. 142
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-950 mt-1">
            आज की त्वरित कार्रवाई डेस्क (1-Touch Actions)
          </h2>
          <p className="text-xs text-slate-900/90 font-medium">
            अधिकारियों को सीधे 1-टच फोन कॉल, आपातकालीन फंड स्वीकृति एवं 118 बूथों पर तुरंत वॉयस संदेश रिले
          </p>
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <button
            onClick={onOpenVoiceBroadcast}
            className="flex-1 sm:flex-initial bg-slate-950 hover:bg-slate-900 text-amber-300 px-3.5 py-2.5 rounded-xl text-xs font-bold shadow-md transition flex items-center justify-center space-x-1.5"
          >
            <Radio className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
            <span>लाइव ऑडियो रिकॉर्ड करें</span>
          </button>
          {onOpenMlaLetter && (
            <button
              onClick={onOpenMlaLetter}
              className="bg-white/90 hover:bg-white text-slate-950 px-3.5 py-2.5 rounded-xl text-xs font-bold shadow-md transition flex items-center justify-center space-x-1.5"
            >
              <FileText className="w-3.5 h-3.5 text-blue-600" />
              <span>संस्तुति पत्र</span>
            </button>
          )}
        </div>
      </div>

      {/* Daily Reach Counter (आज का जन प्रभाव) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg">
        <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
          <div className="flex items-center space-x-2">
            <Award className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              आज का जन प्रभाव (Daily Constituency Reach Counter)
            </span>
          </div>
          <span className="text-[11px] text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            लाइव अपडेट
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
          <div className="bg-slate-800/60 border border-slate-700/60 p-3 rounded-xl">
            <div className="text-xl sm:text-2xl font-black text-amber-400">1,420</div>
            <div className="text-[11px] text-slate-300 font-bold mt-0.5">वोटर पर्चियां वितरित</div>
            <div className="text-[10px] text-slate-400">118 बूथों में घर-घर वितरण</div>
          </div>
          <div className="bg-slate-800/60 border border-slate-700/60 p-3 rounded-xl">
            <div className="text-xl sm:text-2xl font-black text-blue-400">84</div>
            <div className="text-[11px] text-slate-300 font-bold mt-0.5">संस्तुति पत्र जारी</div>
            <div className="text-[10px] text-slate-400">RSN कार्यालय द्वारा हस्ताक्षरित</div>
          </div>
          <div className="bg-slate-800/60 border border-slate-700/60 p-3 rounded-xl">
            <div className="text-xl sm:text-2xl font-black text-emerald-400">94.2%</div>
            <div className="text-[11px] text-slate-300 font-bold mt-0.5">समस्या निवारण दर</div>
            <div className="text-[10px] text-slate-400">48h SLA में निस्तारण</div>
          </div>
          <div className="bg-slate-800/60 border border-slate-700/60 p-3 rounded-xl">
            <div className="text-xl sm:text-2xl font-black text-rose-400">35,000+</div>
            <div className="text-[11px] text-slate-300 font-bold mt-0.5">व्हाट्सएप जन संवाद</div>
            <div className="text-[10px] text-slate-400">P2P कैडर रिले रीच</div>
          </div>
        </div>
      </div>

      {/* Top 3 Urgent Issues (आज की 3 बड़ी समस्याएं) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Flame className="w-4 h-4 text-red-500 animate-pulse" />
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">
              आज की 3 सबसे बड़ी समस्याएं (Top 3 Urgent Issues for MLA Action)
            </h3>
          </div>
          <span className="text-[10px] text-slate-400">
            सीधे विभागीय XEN/SDO को कॉल करें
          </span>
        </div>

        {/* Issue 1: Ward 8 Kotla Transformer */}
        <div className="bg-[#0f1f33] border-2 border-amber-500/50 rounded-2xl p-4 shadow-xl space-y-3 transition hover:border-amber-400">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-700/60 pb-3">
            <div className="flex items-center space-x-2.5">
              <span className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center font-black text-sm shrink-0">
                1
              </span>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-black text-white">
                    वार्ड 8 कोटला: 100kVA ट्रांसफार्मर जला
                  </span>
                  <span className="bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    34 नागरिक कॉल
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  प्रभाव: 1,200 घरों में 18 घंटे से बिजली ठप • कोटला बाजार व पेयजल पंपिंग स्टेशन प्रभावित
                </p>
              </div>
            </div>

            {resolvedIssues['issue-1'] ? (
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>{resolvedIssues['issue-1']}</span>
              </span>
            ) : (
              <span className="text-[11px] text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/30 font-bold shrink-0">
                तत्काल हस्तक्षेप आवश्यक
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1">
            <div className="text-xs text-slate-300 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>विद्युत बोर्ड (HPSEBL): <b>Er. राजीव शर्मा (XEN नूरपुर)</b></span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <a
                href="tel:+919418012345"
                onClick={() => showToast("XEN विद्युत बोर्ड (94180-12345) को कॉल कनेक्ट की जा रही है...")}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-md active:scale-95 transition"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>📞 XEN विद्युत बोर्ड को कॉल लगाएं</span>
              </a>

              <button
                onClick={() => handleAction('issue-1', '₹1.8 लाख ट्रांसफार्मर प्रतिस्थापन स्वीकृत')}
                disabled={Boolean(resolvedIssues['issue-1'])}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-md active:scale-95 transition disabled:opacity-50"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>⚡ ₹1.8 लाख नया ट्रांसफार्मर तुरंत स्वीकृत करें</span>
              </button>
            </div>
          </div>
        </div>

        {/* Issue 2: Ward 14 Jasur Water Leakage */}
        <div className="bg-[#0f1f33] border-2 border-sky-500/50 rounded-2xl p-4 shadow-xl space-y-3 transition hover:border-sky-400">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-700/60 pb-3">
            <div className="flex items-center space-x-2.5">
              <span className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/40 flex items-center justify-center font-black text-sm shrink-0">
                2
              </span>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-black text-white">
                    वार्ड 14 जसूर: मुख्य पेयजल पाइपलाइन लीकेज
                  </span>
                  <span className="bg-sky-500/20 text-sky-300 border border-sky-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    28 शिकायतें
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  प्रभाव: जसूर चौक व निचला मोहल्ला जलापूर्ति बाधित • लाखों लीटर स्वच्छ जल सड़क पर बह रहा है
                </p>
              </div>
            </div>

            {resolvedIssues['issue-2'] ? (
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>{resolvedIssues['issue-2']}</span>
              </span>
            ) : (
              <span className="text-[11px] text-sky-400 bg-sky-500/10 px-2.5 py-1 rounded-lg border border-sky-500/30 font-bold shrink-0">
                पेयजल आपातकाल
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1">
            <div className="text-xs text-slate-300 flex items-center gap-1.5">
              <Droplets className="w-4 h-4 text-sky-400" />
              <span>जल शक्ति विभाग: <b>Er. संजीव सूद (XEN नूरपुर)</b></span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <a
                href="tel:+919418023456"
                onClick={() => showToast("XEN जल शक्ति विभाग (94180-23456) को कॉल कनेक्ट की जा रही है...")}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-md active:scale-95 transition"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>📞 XEN जल शक्ति विभाग को कॉल लगाएं</span>
              </a>

              <button
                onClick={() => handleAction('issue-2', '3 आपातकालीन पानी टैंकर जसूर रवाना')}
                disabled={Boolean(resolvedIssues['issue-2'])}
                className="bg-sky-600 hover:bg-sky-500 text-white px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-md active:scale-95 transition disabled:opacity-50"
              >
                <Truck className="w-3.5 h-3.5" />
                <span>💧 3 आपातकालीन पानी टैंकर तुरंत रवाना करें</span>
              </button>
            </div>
          </div>
        </div>

        {/* Issue 3: Ward 19 Bhadwar Landslide */}
        <div className="bg-[#0f1f33] border-2 border-emerald-500/50 rounded-2xl p-4 shadow-xl space-y-3 transition hover:border-emerald-400">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-700/60 pb-3">
            <div className="flex items-center space-x-2.5">
              <span className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center font-black text-sm shrink-0">
                3
              </span>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-black text-white">
                    वार्ड 19 भदवार: लिंक रोड पर भूस्खलन व दंगा क्षतिग्रस्त
                  </span>
                  <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    19 शिकायतें
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  प्रभाव: भदवार-खन्नी संपर्क मार्ग अवरुद्ध • स्कूली बच्चों व दूध/सब्जी वाहनों की आवाजाही ठप
                </p>
              </div>
            </div>

            {resolvedIssues['issue-3'] ? (
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>{resolvedIssues['issue-3']}</span>
              </span>
            ) : (
              <span className="text-[11px] text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/30 font-bold shrink-0">
                मार्ग बहाली प्राथमिकता
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1">
            <div className="text-xs text-slate-300 flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-emerald-400" />
              <span>लोक निर्माण विभाग (HPPWD): <b>Er. अमित राणा (SDO नूरपुर)</b></span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <a
                href="tel:+919418034567"
                onClick={() => showToast("SDO लोक निर्माण (94180-34567) को कॉल कनेक्ट की जा रही है...")}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-md active:scale-95 transition"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>📞 SDO PWD लोक निर्माण को कॉल लगाएं</span>
              </a>

              <button
                onClick={() => handleAction('issue-3', 'जेसीबी व मलबा निस्तारण टीम रवाना')}
                disabled={Boolean(resolvedIssues['issue-3'])}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-md active:scale-95 transition disabled:opacity-50"
              >
                <Truck className="w-3.5 h-3.5" />
                <span>🚜 जेसीबी व मलबा हटाने का आदेश जारी करें</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 1-Tap Voice Broadcast to All 118 Panna Pramukhs */}
      <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-900 border border-indigo-500/40 rounded-2xl p-4 sm:p-5 shadow-xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/40 flex items-center justify-center shrink-0">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h4 className="text-sm font-black text-white">
                1-टैप कैडर वॉयस ब्रॉडकास्ट (30-Sec Daily MLA Audio Bulletin)
              </h4>
              <p className="text-[11px] text-slate-300">
                आपका 30 सेकंड का ऑडियो संदेश नूरपुर के सभी 118 पन्ना प्रमुखों को व्हाट्सएप रिले पैकेट के रूप में तुरंत पहुंचेगा
              </p>
            </div>
          </div>

          <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0">
            लक्ष्य: 118 बूथ प्रमुख • 35,000+ परिवार
          </span>
        </div>

        <div className="bg-slate-950/70 border border-slate-800 p-3 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="text-xs text-slate-300 space-y-1">
            <div className="font-bold text-amber-300 flex items-center gap-1.5">
              <span>आज का पूर्वनिर्धारित संदेश:</span>
              <span className="bg-amber-500/20 text-amber-300 text-[9px] px-1.5 py-0.5 rounded">ऑटो-ड्राफ्टेड</span>
            </div>
            <p className="italic text-slate-400">
              "राम-राम सारे निक्का परवार जो! अज्ज नूरपुर दे सारे 118 बुत्थां च वोटर पर्चियां ते योजनएं दे संस्तुति पत्र बंडने दा कम तेज़ी कन्ने चलदा पया ऐ..."
            </p>
          </div>

          <button
            onClick={handleQuickCadreBroadcast}
            disabled={broadcastingCadre || cadreBroadcastDone}
            className={`px-4 py-2.5 rounded-xl text-xs font-black flex items-center justify-center space-x-2 transition shadow-lg active:scale-95 shrink-0 ${
              cadreBroadcastDone
                ? 'bg-emerald-600 text-white cursor-default'
                : broadcastingCadre
                  ? 'bg-amber-600 text-white'
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white'
            }`}
          >
            {cadreBroadcastDone ? (
              <>
                <Check className="w-4 h-4 text-white" />
                <span>सभी 118 बूथों पर रिले प्रेषित ✓</span>
              </>
            ) : broadcastingCadre ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>118 पन्ना प्रमुखों को जा रहा है...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>1-टैप: सभी 118 पन्ना प्रमुखों को भेजें</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Quick Constituency Hotline & Emergency Directory */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-3">
        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
          <span>नूरपुर विधानसभा मुख्य प्रशासनिक आपातकालीन डायरेक्टरी</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 text-xs">
          <a 
            href="tel:+911893220023" 
            className="p-2.5 bg-slate-800/80 hover:bg-slate-750 border border-slate-700/80 rounded-xl flex items-center justify-between transition group"
          >
            <div>
              <div className="font-bold text-white group-hover:text-amber-400 transition">SDM नूरपुर कार्यालय</div>
              <div className="text-[10px] text-slate-400">01893-220023</div>
            </div>
            <PhoneCall className="w-4 h-4 text-emerald-400" />
          </a>

          <a 
            href="tel:+911893220045" 
            className="p-2.5 bg-slate-800/80 hover:bg-slate-750 border border-slate-700/80 rounded-xl flex items-center justify-between transition group"
          >
            <div>
              <div className="font-bold text-white group-hover:text-amber-400 transition">DSP पुलिस नूरपुर</div>
              <div className="text-[10px] text-slate-400">01893-220045</div>
            </div>
            <PhoneCall className="w-4 h-4 text-emerald-400" />
          </a>

          <a 
            href="tel:+911892222122" 
            className="p-2.5 bg-slate-800/80 hover:bg-slate-750 border border-slate-700/80 rounded-xl flex items-center justify-between transition group"
          >
            <div>
              <div className="font-bold text-white group-hover:text-amber-400 transition">CMO कांगड़ा (स्वास्थ्य)</div>
              <div className="text-[10px] text-slate-400">01892-222122</div>
            </div>
            <PhoneCall className="w-4 h-4 text-emerald-400" />
          </a>

          <a 
            href="tel:+919816041234" 
            className="p-2.5 bg-slate-800/80 hover:bg-slate-750 border border-slate-700/80 rounded-xl flex items-center justify-between transition group"
          >
            <div>
              <div className="font-bold text-white group-hover:text-amber-400 transition">निक्का कैंप कार्यालय कंट्रोल</div>
              <div className="text-[10px] text-slate-400">98160-41234</div>
            </div>
            <PhoneCall className="w-4 h-4 text-amber-400" />
          </a>
        </div>
      </div>
    </div>
  );
};
