import React, { useState, useEffect } from 'react';
import { 
  Radio, 
  MapPin, 
  Navigation, 
  Clock, 
  Users, 
  Send, 
  Share2, 
  Bell, 
  RefreshCw, 
  ShieldAlert, 
  Sparkles,
  Car,
  Mic,
  Volume2,
  MessageSquare,
  Bot,
  CheckCircle2
} from 'lucide-react';
import { Language, PadyatraBeaconState } from '../../types/campaign';
import { 
  fetchLiveChaupalQuestions, 
  LiveChaupalComment, 
  INITIAL_LIVE_CHAUPAL_QUESTIONS 
} from '../../services/facebookLeadService';

interface PadyatraBeaconScreenProps {
  lang: Language;
}

export const PadyatraBeaconScreen: React.FC<PadyatraBeaconScreenProps> = ({ lang }) => {
  const [beacon, setBeacon] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSimulating, setIsSimulating] = useState(false);
  const [customAnnouncement, setCustomAnnouncement] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Flow 3: Live Chaupal Facebook Teleprompter State
  const [chaupalQuestions, setChaupalQuestions] = useState<LiveChaupalComment[]>(INITIAL_LIVE_CHAUPAL_QUESTIONS);
  const [activeSpeechPoint, setActiveSpeechPoint] = useState<string | null>(null);

  useEffect(() => {
    fetchLiveChaupalQuestions().then(q => {
      if (q && q.length > 0) setChaupalQuestions(q);
    });
  }, []);

  const handleStageAnnouncement = (item: LiveChaupalComment) => {
    const text = `मुझे अभी फेसबुक लाइव पर ${item.location} से हमारे युवा साथियों के कमेंट मिल रहे हैं: "${item.questionText}"... मैं आप सबको आश्वस्त करता हूँ कि इस पर तुरंत कार्रवाई का आदेश जारी हो रहा है!`;
    setActiveSpeechPoint(text);
    setChaupalQuestions(prev => prev.map(q => q.id === item.id ? { ...q, isAddressed: true } : q));
    setToastMsg(`माइक उद्घोषणा तैयार: ${item.location}`);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Poll live beacon status every 8 seconds
  const fetchBeacon = async () => {
    try {
      const res = await fetch('/api/padyatra/live');
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.beacon) {
          setBeacon(data.beacon);
        }
      }
    } catch (err) {
      console.warn('Failed to fetch live beacon:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBeacon();
    const interval = setInterval(fetchBeacon, 8000);
    return () => clearInterval(interval);
  }, []);

  // Simulate Convoy Movement (advances lat/lng closer to next ward)
  const handleSimulateMovement = async () => {
    setIsSimulating(true);
    try {
      const targetWardNo = beacon?.currentWardNo === 8 ? 5 : 8;
      const targetLocation = targetWardNo === 5 
        ? 'राधा कृष्ण मंदिर चौक, वार्ड 05' 
        : 'भदवार मुख्य बाजार, वार्ड 08';

      const nextLat = targetWardNo === 5 ? 32.3040 : 32.3140;
      const nextLng = targetWardNo === 5 ? 75.8950 : 75.9100;

      const res = await fetch('/api/padyatra/beacon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lat: nextLat,
          lng: nextLng,
          speedKmH: 5.2,
          currentLocationName: targetLocation,
          currentWardNo: targetWardNo,
          nextWardNo: targetWardNo === 5 ? 1 : 5,
          nextStopName: targetWardNo === 5 ? 'वार्ड 01 - जसूर रेलवे स्टेशन जनसंवाद' : 'वार्ड 05 - जनसंवाद चौपाल',
          announcement: `रणबीर सिंह निक्का जी का काफिला अब ${targetLocation} में प्रवेश कर चुका है। जनसंवाद प्रारंभ!`
        })
      });

      if (res.ok) {
        await fetchBeacon();
        setToastMsg(`काफिला मूवमेंट अपडेट हुआ! वार्ड ${targetWardNo} में लाइव बीकन पहुंचा।`);
        setTimeout(() => setToastMsg(null), 3500);
      }
    } catch (err) {
      console.error('Movement simulation error:', err);
    } finally {
      setIsSimulating(false);
    }
  };

  // Broadcast custom announcement
  const handleBroadcastAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customAnnouncement.trim()) return;

    try {
      await fetch('/api/padyatra/beacon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          announcement: customAnnouncement.trim()
        })
      });
      setToastMsg('घोषणा प्रसारित हुई! पदयात्रा बीकन एवं व्हाट्सएप अलर्ट में सम्मिलित।');
      setCustomAnnouncement('');
      await fetchBeacon();
      setTimeout(() => setToastMsg(null), 3000);
    } catch (err) {
      console.error('Broadcast error:', err);
    }
  };

  const handleShareWhatsAppAlert = () => {
    if (!beacon) return;
    const text = `🚨 *लाइव पदयात्रा बीकन • रणबीर सिंह निक्का (विधायक नूरपुर)*\n\n📍 *वर्तमान स्थल:* ${beacon.currentLocationName}\n🎯 *अगला पड़ाव:* ${beacon.nextStopName}\n⏱️ *पहुंचने का अनुमानित समय:* ~${beacon.estimatedArrivalMin} मिनट\n📢 *घोषणा:* ${beacon.announcement}\n\nलाईव लोकेशन ट्रैक करें: Janadesh Civic Portal (वि.स. 142 नूरपुर)`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="space-y-4 pb-12">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-amber-400 px-4 py-2.5 rounded-full shadow-2xl text-xs font-bold border border-amber-500/50 flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Hero Live Convoy Card */}
      <div className="bg-gradient-to-br from-[#102a43] via-[#0b1c2d] to-[#06111b] text-white p-4 sm:p-5 rounded-2xl shadow-xl border border-slate-700 relative overflow-hidden">
        {/* Radar Ping Animation */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/30">
            लाइव जीपीएस बीकन सक्रिय
          </span>
        </div>

        <div className="flex items-center gap-2 mb-2">
          <Car className="w-5 h-5 text-amber-400" />
          <h2 className="text-base font-extrabold text-white">
            {lang === 'hi' ? 'विधायक पदयात्रा लाइव बीकन एवं जियो-फेंस अलर्ट' : 'Village Padyatra Live Beacon'}
          </h2>
        </div>
        <p className="text-xs text-slate-300 max-w-xl">
          काफिला ट्रैकिंग, गांव-दर-गांव निकटता सूचना तथा 2 किमी के दायरे में स्वतः व्हाट्सएप अलर्ट।
        </p>

        {beacon && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-4 border-t border-slate-700/60">
            {/* Current Position */}
            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-700">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">वर्तमान लोकेशन</span>
              <div className="text-xs font-extrabold text-amber-400 mt-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>{beacon.currentLocationName}</span>
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">
                वार्ड {beacon.currentWardNo} • गति: {beacon.speedKmH} किमी/घंटा
              </span>
            </div>

            {/* Next Stop */}
            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-700">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">अगला पड़ाव (Next Destination)</span>
              <div className="text-xs font-extrabold text-emerald-300 mt-1 flex items-center gap-1.5">
                <Navigation className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{beacon.nextStopName}</span>
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">
                अनुमानित समय: ~{beacon.estimatedArrivalMin} मिनट में आगमन
              </span>
            </div>

            {/* WhatsApp Alerts Triggered */}
            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-700">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">जियो-फेंस स्वचालित अलर्ट</span>
              <div className="text-sm font-black text-white mt-1 flex items-center gap-1.5">
                <Bell className="w-3.5 h-3.5 text-amber-400" />
                <span>{beacon.alertsSent?.toLocaleString('en-IN') || '1,420'} संदेश प्रेषित</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-bold mt-1 block">
                2 किमी दायरे में स्वचालित संदेश
              </span>
            </div>
          </div>
        )}

        {/* Live Announcement Marquee / Alert */}
        {beacon?.announcement && (
          <div className="mt-3 bg-amber-500/10 border border-amber-500/30 rounded-xl p-2.5 flex items-center gap-2 text-xs">
            <span className="p-1 bg-amber-500 text-slate-950 rounded-md font-black text-[9px] uppercase shrink-0">
              लाइव उद्घोषणा
            </span>
            <span className="text-amber-200 font-medium truncate">
              {beacon.announcement}
            </span>
          </div>
        )}
      </div>

      {/* FLOW 3: LIVE PADYATRA CHAUPAL DYNAMIC TELEPROMPTER FEED */}
      <div className="bg-gradient-to-br from-slate-900 via-[#0f243a] to-slate-900 rounded-2xl p-4 sm:p-5 border-2 border-blue-500/40 shadow-xl space-y-3.5 text-slate-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-700/60 pb-3">
          <div className="flex items-center space-x-2">
            <span className="p-2 bg-blue-500/20 text-blue-400 rounded-xl border border-blue-500/30">
              <Bot className="w-4 h-4 animate-pulse" />
            </span>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-xs sm:text-sm font-extrabold text-white">
                  लाइव चौपाल फेसबुक टेलीप्रॉम्प्टर (Live Chaupal Dynamic Teleprompter)
                </h3>
                <span className="px-2 py-0.5 bg-rose-500/20 text-rose-300 border border-rose-500/40 rounded-full text-[10px] font-bold animate-pulse">
                  ● FB Live स्ट्रीम सक्रिय
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                फेसबुक लाइव देख रहे 10,000+ नागरिकों के स्थानीय प्रश्न सीधे स्टेज स्क्रीन पर
              </p>
            </div>
          </div>

          <span className="text-[11px] font-mono text-amber-400 font-bold">
            {chaupalQuestions.filter(q => !q.isAddressed).length} नए प्रश्न माइक हेतु तैयार
          </span>
        </div>

        {/* Active Prompter Speech Card */}
        {activeSpeechPoint && (
          <div className="bg-amber-950/40 border border-amber-500/60 p-3.5 rounded-xl space-y-1.5 animate-in slide-in-from-top duration-200">
            <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold">
              <Mic className="w-4 h-4" />
              <span>स्टेज माइक उद्घोषणा (Teleprompter Prompt):</span>
            </div>
            <p className="text-xs text-white leading-relaxed font-medium italic">
              "{activeSpeechPoint}"
            </p>
          </div>
        )}

        {/* Live Aggregated Audience Questions */}
        <div className="space-y-2.5">
          {chaupalQuestions.map(item => (
            <div
              key={item.id}
              className={`p-3 rounded-xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 ${
                item.isAddressed
                  ? 'bg-slate-900/40 border-slate-800 opacity-60'
                  : 'bg-slate-950/80 border-slate-700/80 hover:border-slate-600'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-2 text-xs">
                  <span className="font-bold text-white">{item.location} (वार्ड {item.wardNo})</span>
                  <span className="text-[10px] text-slate-400">• {item.userName}</span>
                  <span className="px-2 py-0.2 bg-blue-500/20 text-blue-300 rounded text-[10px] font-bold">
                    {item.countOfSimilarQuestions} लोग यही पूछ रहे हैं
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-medium">
                  "{item.questionText}"
                </p>
              </div>

              <div className="shrink-0">
                {item.isAddressed ? (
                  <span className="px-3 py-1.5 bg-emerald-950/60 text-emerald-300 border border-emerald-700/60 rounded-xl text-xs font-bold flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>माइक पर संबोधित</span>
                  </span>
                ) : (
                  <button
                    onClick={() => handleStageAnnouncement(item)}
                    className="px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shadow-md shadow-amber-500/20 cursor-pointer"
                  >
                    <Mic className="w-3.5 h-3.5" />
                    <span>माइक पर उद्घोष करें</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ward Proximity Radar Table */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-rose-600 animate-pulse" />
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
              नूरपुर वार्ड निकटता रडार (Proximity Radar)
            </h3>
          </div>
          <span className="text-[11px] text-slate-500 font-bold">
            दूरी 2 किमी से कम होने पर व्हाट्सएप अलर्ट ट्रिगर
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {beacon?.proximityAlerts?.map((wardAlert: any) => (
            <div key={wardAlert.wardNo} className="py-2.5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <span className={`w-6 h-6 rounded-lg text-[10px] font-black flex items-center justify-center shrink-0 ${
                  wardAlert.isApproaching ? 'bg-rose-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700'
                }`}>
                  W{wardAlert.wardNo}
                </span>
                <div>
                  <h4 className="font-extrabold text-slate-900 leading-tight">
                    वार्ड {wardAlert.wardNo}: {wardAlert.name}
                  </h4>
                  <p className="text-[10px] text-slate-500">
                    काफिले से दूरी: <span className="font-bold text-slate-800">{wardAlert.distanceKm} किमी</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {wardAlert.isApproaching ? (
                  <span className="px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-300 text-[10px] font-black flex items-center gap-1 animate-pulse">
                    <ShieldAlert className="w-3 h-3 text-rose-600" />
                    <span>🚨 2 किमी के दायरे में</span>
                  </span>
                ) : (
                  <span className="text-[11px] text-slate-500 font-medium">
                    दूरी पर ({wardAlert.distanceKm} km)
                  </span>
                )}

                {wardAlert.smsSentCount > 0 && (
                  <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded border border-emerald-200">
                    {wardAlert.smsSentCount} अलर्ट भेजे गए
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Karyakarta / Admin Convoy Control Station */}
      <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Navigation className="w-4 h-4 text-indigo-700" />
            <h4 className="text-xs font-black text-slate-900">
              काफिला नियंत्रण व जनघोषणा केंद्र (Karyakarta Convoy Desk)
            </h4>
          </div>
          <span className="text-[10px] text-indigo-700 font-bold bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
            कमांड सेंटर
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <button
            onClick={handleSimulateMovement}
            disabled={isSimulating}
            className="py-2.5 px-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 text-white font-extrabold rounded-xl text-xs transition shadow-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
            <span>{isSimulating ? 'मूवमेंट दर्ज हो रही है...' : 'सिम्युलेट काफिला मूवमेंट (Next Ward)'}</span>
          </button>

          <button
            onClick={handleShareWhatsAppAlert}
            className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-xs transition shadow-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>व्हाट्सएप लाइव रूट अलर्ट साझा करें</span>
          </button>
        </div>

        {/* Quick Announcement Form */}
        <form onSubmit={handleBroadcastAnnouncement} className="flex gap-2 pt-1">
          <input
            type="text"
            value={customAnnouncement}
            onChange={(e) => setCustomAnnouncement(e.target.value)}
            placeholder="मार्ग में नई घोषणा लिखें (उदा. 10 मिनट में जसूर चौक आगमन)..."
            className="flex-1 text-xs px-3 py-2 rounded-xl border border-slate-300 bg-white font-medium"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-amber-400 font-black rounded-xl text-xs transition shadow-sm cursor-pointer shrink-0"
          >
            प्रसारित करें
          </button>
        </form>
      </div>
    </div>
  );
};
