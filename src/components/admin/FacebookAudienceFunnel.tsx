import React, { useState, useEffect } from 'react';
import { 
  Users, 
  MessageSquare, 
  Send, 
  Sparkles, 
  CheckCircle2, 
  Share2, 
  TrendingUp, 
  Bot, 
  Filter, 
  Search, 
  ExternalLink, 
  ShieldCheck, 
  Layers, 
  RefreshCw,
  X,
  Play,
  Flame,
  Award
} from 'lucide-react';
import { 
  FacebookCommentEvent, 
  FacebookLeadStats, 
  INITIAL_FACEBOOK_STATS, 
  INITIAL_FACEBOOK_COMMENTS, 
  fetchFacebookFunnelStats, 
  simulateFacebookComment 
} from '../../services/facebookLeadService';
import { Language } from '../../types/campaign';

interface FacebookAudienceFunnelProps {
  lang: Language;
  onClose?: () => void;
}

export const FacebookAudienceFunnel: React.FC<FacebookAudienceFunnelProps> = ({ lang, onClose }) => {
  const [stats, setStats] = useState<FacebookLeadStats>(INITIAL_FACEBOOK_STATS);
  const [events, setEvents] = useState<FacebookCommentEvent[]>(INITIAL_FACEBOOK_COMMENTS);
  const [activeTab, setActiveTab] = useState<'ACTIVITY' | 'SIMULATOR' | 'VOTER_MAPPING'>('ACTIVITY');
  
  // Simulator state
  const [simUserName, setSimUserName] = useState('राजीव शर्मा (फेसबुक यूजर)');
  const [simMessage, setSimMessage] = useState('निक्का जी, वार्ड 08 कोटला चौक पर 3 दिन से पानी की पाइपलाइन टूटी पड़ी है, कृपया ध्यान दें।');
  const [simWardNo, setSimWardNo] = useState(8);
  const [simLocation, setSimLocation] = useState('कोटला चौक');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState<any>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadData = async () => {
    const data = await fetchFacebookFunnelStats();
    if (data) {
      setStats(data.stats);
      setEvents(data.recentEvents);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 20000);
    return () => clearInterval(interval);
  }, []);

  const handleRunSimulation = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSimulating(true);
    try {
      const result = await simulateFacebookComment({
        userName: simUserName,
        message: simMessage,
        wardNo: simWardNo,
        location: simLocation
      });

      if (result.success && result.event) {
        setEvents(prev => [result.event, ...prev]);
        setSimulationResult(result);
        showToast('3-सेकंड जीरो-टच ऑटोमेशन निष्पादित! सार्वजनिक व निजी उत्तर भेजा गया।');
        loadData();
      }
    } catch {
      showToast('सिमुलेशन में त्रुटि हुई');
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 text-slate-100 shadow-2xl space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-xl flex items-center space-x-2 text-xs font-bold animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-blue-500/10 border border-blue-500/30 rounded-full text-xs font-semibold text-blue-400 mb-2">
            <Bot className="w-3.5 h-3.5" />
            <span>Meta Graph API v21.0 & Webhooks Engine • 100K फेसबुक फॉलोअर्स</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center space-x-2">
            <span>100k फेसबुक ऑडियंस टू वोटर कन्वर्जन इंजन</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            सोशल मीडिया फॉलोअर्स को बिना किसी मानवीय प्रयास के 3 सेकंड में सत्यापित वोटर आईडी, वार्ड नंबर व पोलिंग बूथ रिकॉर्ड में परिवर्तित करने वाला स्वचालित फनल।
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={() => setActiveTab('SIMULATOR')}
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold transition shadow-md shadow-blue-500/20"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>लाइव ऑटोमेशन टेस्ट करें</span>
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3">
          <div className="text-[10px] text-slate-400 font-medium">फेसबुक पेज फॉलोअर्स</div>
          <div className="text-xl font-black text-white mt-1">104.2k</div>
          <div className="text-[10px] text-blue-400 font-bold mt-0.5">कांगड़ा में #1 रीच</div>
        </div>

        <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3">
          <div className="text-[10px] text-slate-400 font-medium">कमेंट्स AI विश्लेषण</div>
          <div className="text-xl font-black text-amber-400 mt-1">{stats.totalCommentsAnalyzed.toLocaleString('en-IN')}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">3-सेकंड रिस्पॉन्स</div>
        </div>

        <div className="bg-emerald-950/30 border border-emerald-800/40 rounded-xl p-3">
          <div className="text-[10px] text-emerald-400 font-bold">स्वतः दर्ज शिकायत टिकट</div>
          <div className="text-xl font-black text-emerald-300 mt-1">{stats.ticketsAutoCreated.toLocaleString('en-IN')}</div>
          <div className="text-[10px] text-emerald-400/80 mt-0.5">वार रूम में ऑटो-सिंक</div>
        </div>

        <div className="bg-blue-950/30 border border-blue-800/40 rounded-xl p-3">
          <div className="text-[10px] text-blue-400 font-bold">योजना कार्ड DMs प्रेषित</div>
          <div className="text-xl font-black text-blue-300 mt-1">{stats.yojanaDMsDispatched.toLocaleString('en-IN')}</div>
          <div className="text-[10px] text-blue-400/80 mt-0.5">कीवर्ड ऑटोमेशन</div>
        </div>

        <div className="bg-indigo-950/30 border border-indigo-800/40 rounded-xl p-3">
          <div className="text-[10px] text-indigo-400 font-bold">बूथ से लिंक वोटर</div>
          <div className="text-xl font-black text-indigo-300 mt-1">{stats.votersLinkedToBooths.toLocaleString('en-IN')}</div>
          <div className="text-[10px] text-indigo-400/80 mt-0.5">118 बूथों में मैप्ड</div>
        </div>

        <div className="bg-rose-950/30 border border-rose-800/40 rounded-xl p-3">
          <div className="text-[10px] text-rose-400 font-bold">ऑर्गेनिक वायरल रीच</div>
          <div className="text-xl font-black text-rose-300 mt-1">2.48 Lakh</div>
          <div className="text-[10px] text-rose-400/80 mt-0.5">एल्गोरिथम बूस्ट</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('ACTIVITY')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
            activeTab === 'ACTIVITY'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>लाइव कमेंट्स व ऑटो-टिकट स्ट्रीम</span>
        </button>

        <button
          onClick={() => setActiveTab('SIMULATOR')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
            activeTab === 'SIMULATOR'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <Bot className="w-3.5 h-3.5" />
          <span>3-सेकंड ऑटोमेशन सिम्युलेटर</span>
        </button>

        <button
          onClick={() => setActiveTab('VOTER_MAPPING')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
            activeTab === 'VOTER_MAPPING'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>फेसबुक प्रोफाइल → वोटर रोल (EPIC) मैपिंग</span>
        </button>
      </div>

      {/* Tab 1: Live Comment to Ticket Stream */}
      {activeTab === 'ACTIVITY' && (
        <div className="space-y-3">
          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span>हाल ही में फेसबुक से इनबाउंड कमेंट्स एवं स्वतः प्रेषित उत्तर (Dual-Response Pipeline):</span>
            <span className="font-mono text-[10px] text-emerald-400">● Webhook Listening: Active</span>
          </div>

          <div className="space-y-3">
            {events.map(event => (
              <div
                key={event.id}
                className="bg-slate-800/70 border border-slate-700/80 rounded-xl p-4 space-y-3 hover:border-slate-600 transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-700/60 pb-2.5">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                      {event.userName.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-white text-xs flex items-center space-x-1.5">
                        <span>{event.userName}</span>
                        <span className="text-[10px] text-slate-400 font-mono">({event.userId})</span>
                      </div>
                      <div className="text-[10px] text-slate-400">
                        पोस्ट: <span className="text-slate-300 font-medium">{event.postTitle}</span> • {event.timestamp}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      event.intent === 'GRIEVANCE'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        : event.intent === 'YOJANA_INQUIRY'
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    }`}>
                      {event.intent === 'GRIEVANCE' ? 'जन समस्या शिकायत' : event.intent === 'YOJANA_INQUIRY' ? 'योजना पूछताछ' : 'सामान्य समर्थन'}
                    </span>

                    {event.ticketCreatedToken && (
                      <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded text-[10px] font-mono font-bold">
                        टिकट {event.ticketCreatedToken}
                      </span>
                    )}
                  </div>
                </div>

                {/* Citizen Comment */}
                <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800 text-xs text-slate-200">
                  <div className="text-[10px] text-slate-400 font-bold mb-1">नागरिक का फेसबुक कमेंट:</div>
                  "{event.message}"
                </div>

                {/* Dual Response Pipeline */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                  {/* Public Reply */}
                  <div className="bg-blue-950/20 border border-blue-600/30 p-2.5 rounded-lg space-y-1">
                    <div className="text-[10px] text-blue-400 font-bold flex items-center space-x-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>सार्वजनिक कमेंट रिप्लाई (Meta Graph API):</span>
                    </div>
                    <div className="text-[11px] text-slate-300 leading-relaxed italic">
                      "{event.publicReplySent}"
                    </div>
                  </div>

                  {/* Private Messenger DM */}
                  <div className="bg-emerald-950/20 border border-emerald-600/30 p-2.5 rounded-lg space-y-1">
                    <div className="text-[10px] text-emerald-400 font-bold flex items-center space-x-1">
                      <Send className="w-3 h-3" />
                      <span>प्राइवेट मैसेंजर DM (Meta Send API):</span>
                    </div>
                    <div className="text-[11px] text-slate-300 leading-relaxed italic">
                      "{event.privateDmSent}"
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: 3-Second Automation Simulator */}
      {activeTab === 'SIMULATOR' && (
        <div className="space-y-4">
          <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/60 text-xs text-slate-300 leading-relaxed">
            <span className="font-bold text-amber-400">💡 लाइव सिमुलेशन कैसे काम करता है:</span> जब भी कोई फेसबुक यूजर विधायक जी की पोस्ट पर कमेंट करता है, AI उसकी समस्या का संज्ञान लेकर तुरंत वार्ड नंबर पहचानता है, 3 सेकंड में सार्वजनिक धन्यवाद कमेंट करता है, और नागरिक के मैसेंजर पर आधिकारिक टिकट लिंक भेजता है।
          </div>

          <form onSubmit={handleRunSimulation} className="bg-slate-800/80 p-5 rounded-xl border border-slate-700 space-y-3.5 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">फेसबुक नागरिक का नाम</label>
                <input
                  type="text"
                  value={simUserName}
                  onChange={e => setSimUserName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-400"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">अनुमानित वार्ड नंबर व स्थान</label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    min={1}
                    max={24}
                    value={simWardNo}
                    onChange={e => setSimWardNo(Number(e.target.value))}
                    className="w-24 px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-400"
                  />
                  <input
                    type="text"
                    value={simLocation}
                    onChange={e => setSimLocation(e.target.value)}
                    className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-400"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-semibold">फेसबुक कमेंट संदेश (परीक्षण हेतु बदलें):</label>
              <textarea
                rows={2}
                value={simMessage}
                onChange={e => setSimMessage(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-400"
              />
            </div>

            {/* Quick Template Buttons */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[10px] text-slate-400">त्वरित टेम्प्लेट:</span>
              <button
                type="button"
                onClick={() => setSimMessage('निक्का जी, वार्ड 08 कोटला चौक पर 3 दिन से पानी की पाइपलाइन टूटी पड़ी है, कृपया ध्यान दें।')}
                className="px-2.5 py-1 bg-slate-700 hover:bg-slate-600 rounded text-[10px] text-slate-300"
              >
                💧 टूटी पाइपलाइन (Grievance)
              </button>
              <button
                type="button"
                onClick={() => setSimMessage('सुख आश्रय योजना का फॉर्म और पात्रता कैसे मिलेगी? मुझे भी आवेदन करना है।')}
                className="px-2.5 py-1 bg-slate-700 hover:bg-slate-600 rounded text-[10px] text-slate-300"
              >
                📋 सुख आश्रय योजना (Yojana)
              </button>
              <button
                type="button"
                onClick={() => setSimMessage('वार्ड 14 जसूर में 100kVA ट्रांसफार्मर लगवाने के लिए बहुत-बहुत धन्यवाद विधायक जी!')}
                className="px-2.5 py-1 bg-slate-700 hover:bg-slate-600 rounded text-[10px] text-slate-300"
              >
                ⚡ धन्यवाद ट्रांसफार्मर (Support)
              </button>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSimulating}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-2 transition shadow-lg shadow-blue-500/20 disabled:opacity-50"
              >
                {isSimulating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>AI वेबहुक प्रोसेस हो रहा है...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>3-सेकंड में कमेंट-टू-टिकट ऑटोमेशन चलाएं</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {simulationResult && (
            <div className="bg-emerald-950/30 border border-emerald-600/50 p-4 rounded-xl space-y-2 text-xs animate-in fade-in duration-200">
              <div className="flex items-center space-x-2 text-emerald-400 font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>सफल! ऑटोमेशन पूर्ण हो गया:</span>
              </div>
              <div className="text-slate-300">
                • नया शिकायत टिकट निर्मित: <strong className="text-amber-400 font-mono">{simulationResult.event?.ticketCreatedToken || 'N/A'}</strong><br />
                • सार्वजनिक उत्तर: "{simulationResult.event?.publicReplySent}"<br />
                • निजी मैसेंजर DM: "{simulationResult.event?.privateDmSent}"
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Facebook to Voter Roll (EPIC) Auto-Linker */}
      {activeTab === 'VOTER_MAPPING' && (
        <div className="space-y-3">
          <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/60 text-xs text-slate-300 leading-relaxed">
            <span className="font-bold text-amber-400">🗳️ 100k सोशल फॉलोअर्स का मतदाता सूची से स्थायी मिलान:</span> जब कोई फेसबुक यूजर मैसेंजर लिंक पर क्लिक करके अपनी डिजिटल मतदाता पर्ची खोजता है या शिकायत दर्ज करता है, तो उसका स्थायी फेसबुक आईडी सीधे चुनाव आयोग के EPIC वोटर रिकॉर्ड व पोलिंग बूथ (1-118) से जुड़ जाता है।
          </div>

          <div className="border border-slate-800 rounded-xl overflow-hidden overflow-x-auto text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-800/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                  <th className="py-2.5 px-3">मतदाता का नाम</th>
                  <th className="py-2.5 px-3">फेसबुक प्रोफाइल ID</th>
                  <th className="py-2.5 px-3">EPIC वोटर ID</th>
                  <th className="py-2.5 px-3">वार्ड / बूथ #</th>
                  <th className="py-2.5 px-3">मोबाइल</th>
                  <th className="py-2.5 px-3 text-right">सत्यापन स्थिति</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                <tr className="hover:bg-slate-800/40">
                  <td className="py-2.5 px-3 font-bold text-white">रमेश कुमार</td>
                  <td className="py-2.5 px-3 font-mono text-blue-400">fb_user_8912401</td>
                  <td className="py-2.5 px-3 font-mono text-amber-400 font-bold">HP/142/089421</td>
                  <td className="py-2.5 px-3">वार्ड 08 • बूथ #41</td>
                  <td className="py-2.5 px-3 font-mono text-slate-400">9816041288</td>
                  <td className="py-2.5 px-3 text-right">
                    <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded text-[10px] font-bold">
                      ✓ बूथ मैप्ड
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-slate-800/40">
                  <td className="py-2.5 px-3 font-bold text-white">सुनीता शर्मा</td>
                  <td className="py-2.5 px-3 font-mono text-blue-400">fb_user_4491028</td>
                  <td className="py-2.5 px-3 font-mono text-amber-400 font-bold">HP/142/044910</td>
                  <td className="py-2.5 px-3">वार्ड 14 • बूथ #72</td>
                  <td className="py-2.5 px-3 font-mono text-slate-400">9418088912</td>
                  <td className="py-2.5 px-3 text-right">
                    <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded text-[10px] font-bold">
                      ✓ बूथ मैप्ड
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-slate-800/40">
                  <td className="py-2.5 px-3 font-bold text-white">विक्रम ठाकुर</td>
                  <td className="py-2.5 px-3 font-mono text-blue-400">fb_user_7718290</td>
                  <td className="py-2.5 px-3 font-mono text-amber-400 font-bold">HP/142/077182</td>
                  <td className="py-2.5 px-3">वार्ड 14 • बूथ #18</td>
                  <td className="py-2.5 px-3 font-mono text-slate-400">9882199044</td>
                  <td className="py-2.5 px-3 text-right">
                    <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded text-[10px] font-bold">
                      ✓ बूथ मैप्ड
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
