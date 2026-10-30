import React, { useState } from 'react';
import { 
  Radio, 
  Play, 
  Pause, 
  Volume2, 
  Send, 
  CheckCircle2, 
  PhoneCall, 
  MessageSquare, 
  Clock, 
  Users, 
  X, 
  Sparkles, 
  Mic, 
  AlertCircle,
  Share2
} from 'lucide-react';
import { Language } from '../../types/campaign';

interface VipVoiceBroadcastModalProps {
  lang: Language;
  onClose: () => void;
}

interface InboundVoicemail {
  id: string;
  callerName: string;
  mobile: string;
  village: string;
  boothNo: number;
  durationSeconds: number;
  recordedAt: string;
  sentiment: 'CRITICAL_GRIEVANCE' | 'GRATITUDE' | 'SUGGESTION';
  transcriptionHi: string;
  isListened: boolean;
  callbackStatus: 'PENDING' | 'CALLED';
}

const INITIAL_VOICEMAILS: InboundVoicemail[] = [
  {
    id: 'VM-1081',
    callerName: 'करतार चंद (किसान)',
    mobile: '9816041289',
    village: 'भदवार (वार्ड 7)',
    boothNo: 41,
    durationSeconds: 42,
    recordedAt: 'आज दोपहर 02:15',
    sentiment: 'CRITICAL_GRIEVANCE',
    transcriptionHi: 'प्रणाम निक्का जी, मैं भदवार से करतार चंद बोल रहा हूं। हमारे खेत की सिंचाई वाली कूहल में मलबा आ गया है और पानी रुक गया है। कृपया कनिष्ठ अभियंता (JE) को कहें कि जेसीबी भेजकर तुरंत खुलवाएं।',
    isListened: false,
    callbackStatus: 'PENDING'
  },
  {
    id: 'VM-1082',
    callerName: 'सुनीता देवी',
    mobile: '9418299182',
    village: 'कोटला (वार्ड 14)',
    boothNo: 72,
    durationSeconds: 31,
    recordedAt: 'आज सुबह 11:40',
    sentiment: 'GRATITUDE',
    transcriptionHi: 'विधायक जी, बेटी की शादी में आपके ट्रस्ट से ₹51,000 का कन्यादान चेक मिल गया। आपके इस उपकार के लिए हमारा पूरा परिवार जीवन भर आपका ऋणी रहेगा। बहुत-बहुत धन्यवाद।',
    isListened: true,
    callbackStatus: 'CALLED'
  },
  {
    id: 'VM-1083',
    callerName: 'रोहित कटोच (छात्र)',
    mobile: '9882200192',
    village: 'रेहन (वार्ड 18)',
    boothNo: 89,
    durationSeconds: 28,
    recordedAt: 'कल शाम 06:10',
    sentiment: 'SUGGESTION',
    transcriptionHi: 'निक्का जी नमस्ते, कॉलेज के लिए शाम 5 बजे वाली एचआरटीसी बस अक्सर छूट जाती है। अगर एक अतिरिक्त ट्रिप लगवा दें तो सैकड़ों छात्र-छात्राओं को बहुत सुविधा होगी।',
    isListened: true,
    callbackStatus: 'PENDING'
  }
];

export const VipVoiceBroadcastModal: React.FC<VipVoiceBroadcastModalProps> = ({ lang, onClose }) => {
  const [activeTab, setActiveTab] = useState<'BROADCAST' | 'VOICEMAIL_INBOX'>('BROADCAST');
  
  // Broadcast state
  const [targetAudience, setTargetAudience] = useState<'ALL_35K' | 'SWING_BOOTHS' | 'NIJAAT_FAMILIES' | 'PANNA_PRAMUKHS'>('ALL_35K');
  const [broadcastScript, setBroadcastScript] = useState(
    'नमस्ते नूरपुर! मैं आपका विधायक व सेवक रणबीर सिंह निक्का बोल रहा हूं। आज भदवार व जसूर में जनसंवाद के दौरान पेयजल व सड़कों पर त्वरित आदेश जारी किए गए हैं। किसी भी सुख-दुख या समस्या में मुझे सीधे 01893-220101 पर कॉल करें। घर-घर निक्का, हर-घर निक्का!'
  );
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [broadcastSentCount, setBroadcastSentCount] = useState<number | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Inbound voicemail state
  const [voicemails, setVoicemails] = useState<InboundVoicemail[]>(INITIAL_VOICEMAILS);
  const [playingVmId, setPlayingVmId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSendBroadcast = () => {
    setIsBroadcasting(true);
    let count = 35240;
    if (targetAudience === 'SWING_BOOTHS') count = 12480;
    if (targetAudience === 'NIJAAT_FAMILIES') count = 4820;
    if (targetAudience === 'PANNA_PRAMUKHS') count = 1180;

    setTimeout(() => {
      setIsBroadcasting(false);
      setBroadcastSentCount(count);
      showToast(`सफल! ${count.toLocaleString('en-IN')} नागरिकों के फोन पर विधायक जी का वॉयस नोट प्रसारित हुआ!`);
    }, 1800);
  };

  const handleMarkCalled = (id: string) => {
    setVoicemails(prev => prev.map(vm => vm.id === id ? { ...vm, callbackStatus: 'CALLED' } : vm));
    showToast('कॉल-बैक स्थिति अपडेट की गई');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full p-6 text-slate-100 shadow-2xl space-y-5 my-auto max-h-[92vh] overflow-y-auto">
        {/* Toast */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-xl flex items-center space-x-3 text-sm font-medium animate-bounce">
            <CheckCircle2 className="w-5 h-5" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-rose-500/20 text-rose-400 rounded-xl">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white">निक्का परिवार वीआईपी वॉयस ब्रॉडकास्ट व डायरेक्ट लाइन</h2>
              <p className="text-xs text-slate-400">बिचौलियों को हटाकर 35,000 नागरिकों तक सीधा पर्सनल वॉयस संदेश एवं टोल-फ्री जनवाणी इनबॉक्स</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex space-x-2 border-b border-slate-800 pb-2">
          <button
            onClick={() => setActiveTab('BROADCAST')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
              activeTab === 'BROADCAST'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Radio className="w-4 h-4" />
            <span>आउटबाउंड 30-सेकंड वॉयस नोट ड्रॉप (35,000 नागरिक)</span>
          </button>
          <button
            onClick={() => setActiveTab('VOICEMAIL_INBOX')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
              activeTab === 'VOICEMAIL_INBOX'
                ? 'bg-rose-600 text-white shadow-md'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <PhoneCall className="w-4 h-4" />
            <span>टोल-फ्री वॉयसमेल इनबॉक्स (1800-123-456)</span>
            <span className="px-1.5 py-0.2 bg-rose-400/20 text-rose-300 rounded text-[10px]">
              {voicemails.filter(v => v.callbackStatus === 'PENDING').length} नए
            </span>
          </button>
        </div>

        {/* Tab 1: Outbound Broadcast */}
        {activeTab === 'BROADCAST' && (
          <div className="space-y-4">
            {/* Target Audience Selector */}
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-semibold">लक्षित श्रोता वर्ग (Target Audience):</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => setTargetAudience('ALL_35K')}
                  className={`p-2.5 rounded-xl border text-left text-xs transition ${
                    targetAudience === 'ALL_35K'
                      ? 'bg-amber-500/20 border-amber-500 text-white font-bold'
                      : 'bg-slate-800/60 border-slate-700 text-slate-400'
                  }`}
                >
                  <div className="text-white font-bold">समस्त नूरपुर</div>
                  <div className="text-[10px] text-amber-400 mt-0.5">35,240 नागरिक</div>
                </button>

                <button
                  type="button"
                  onClick={() => setTargetAudience('SWING_BOOTHS')}
                  className={`p-2.5 rounded-xl border text-left text-xs transition ${
                    targetAudience === 'SWING_BOOTHS'
                      ? 'bg-amber-500/20 border-amber-500 text-white font-bold'
                      : 'bg-slate-800/60 border-slate-700 text-slate-400'
                  }`}
                >
                  <div className="text-white font-bold">31 स्विंग बूथ</div>
                  <div className="text-[10px] text-amber-400 mt-0.5">12,480 अनिर्णायक वोटर</div>
                </button>

                <button
                  type="button"
                  onClick={() => setTargetAudience('NIJAAT_FAMILIES')}
                  className={`p-2.5 rounded-xl border text-left text-xs transition ${
                    targetAudience === 'NIJAAT_FAMILIES'
                      ? 'bg-amber-500/20 border-amber-500 text-white font-bold'
                      : 'bg-slate-800/60 border-slate-700 text-slate-400'
                  }`}
                >
                  <div className="text-white font-bold">निजात ट्रस्ट परिवार</div>
                  <div className="text-[10px] text-amber-400 mt-0.5">4,820 लाभार्थी</div>
                </button>

                <button
                  type="button"
                  onClick={() => setTargetAudience('PANNA_PRAMUKHS')}
                  className={`p-2.5 rounded-xl border text-left text-xs transition ${
                    targetAudience === 'PANNA_PRAMUKHS'
                      ? 'bg-amber-500/20 border-amber-500 text-white font-bold'
                      : 'bg-slate-800/60 border-slate-700 text-slate-400'
                  }`}
                >
                  <div className="text-white font-bold">पन्ना प्रमुख नेटवर्क</div>
                  <div className="text-[10px] text-amber-400 mt-0.5">1,180 बूथ कार्यकर्ता</div>
                </button>
              </div>
            </div>

            {/* Script Editor */}
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-semibold flex items-center justify-between">
                <span>वॉयस नोट संदेश पाठ (Voice Note Script):</span>
                <span className="text-amber-400 font-mono text-[11px]">~28 सेकंड्स (अधिकतम 35s)</span>
              </label>
              <textarea
                rows={3}
                value={broadcastScript}
                onChange={e => setBroadcastScript(e.target.value)}
                className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white leading-relaxed focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Audio Preview Waveform Player */}
            <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                  className="p-3 bg-amber-500 text-slate-950 rounded-full font-bold hover:bg-amber-400 transition"
                >
                  {isPlayingAudio ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                </button>
                <div>
                  <div className="text-xs font-bold text-white flex items-center space-x-1.5">
                    <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>रणबीर सिंह निक्का अधिकृत वॉयस सैंपल</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    {isPlayingAudio ? 'ऑडियो बज रहा है... (0:14 / 0:28)' : 'पूर्वावलोकन सुनने हेतु प्ले करें'}
                  </div>
                </div>
              </div>

              {/* Visual simulated equalizer bars */}
              <div className="flex items-center space-x-1">
                {[4, 12, 20, 8, 16, 24, 14, 18, 6, 22, 12, 16, 8, 14].map((h, i) => (
                  <span
                    key={i}
                    style={{ height: isPlayingAudio ? `${Math.max(6, (h * (i % 2 === 0 ? 1.2 : 0.8)))}px` : '6px' }}
                    className={`w-1 rounded-full transition-all duration-150 ${isPlayingAudio ? 'bg-amber-400' : 'bg-slate-600'}`}
                  ></span>
                ))}
              </div>
            </div>

            {/* Broadcast Action Button */}
            <div className="pt-2">
              <button
                onClick={handleSendBroadcast}
                disabled={isBroadcasting}
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 rounded-xl text-xs font-black transition flex items-center justify-center space-x-2 shadow-xl shadow-amber-500/20 disabled:opacity-50"
              >
                {isBroadcasting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                    <span>व्हाट्सएप सर्वर से 35,000 वॉयस नोट्स भेजे जा रहे हैं...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>सभी लक्षित नागरिकों को एक साथ वॉयस नोट ड्रॉप करें</span>
                  </>
                )}
              </button>
            </div>

            {broadcastSentCount && (
              <div className="p-3 bg-emerald-950/40 border border-emerald-600/50 rounded-xl text-xs text-emerald-300 flex items-center justify-between">
                <span className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>सफल प्रेषण: <strong>{broadcastSentCount.toLocaleString('en-IN')}</strong> नागरिकों के फोन में संदेश पहुंच गया।</span>
                </span>
                <span className="font-mono text-[10px] text-emerald-400">99.2% Delivery Rate</span>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Voicemail Inbox */}
        {activeTab === 'VOICEMAIL_INBOX' && (
          <div className="space-y-3">
            <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <PhoneCall className="w-4 h-4 text-emerald-400" />
                <span className="text-white font-medium">टोल-फ्री नागरिक हेल्पलाइन: <strong>1800-123-456</strong> (01893-220101)</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">24x7 ऑटो रिकॉर्डिंग व AI हिंदी ट्रांसक्रिप्शन सक्रिय</span>
            </div>

            <div className="space-y-3">
              {voicemails.map(vm => (
                <div key={vm.id} className="bg-slate-800/70 border border-slate-700 rounded-xl p-4 space-y-3 hover:border-slate-600 transition">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-white text-sm">{vm.callerName}</span>
                        <span className="text-[11px] text-slate-400 font-mono">+91 {vm.mobile}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          vm.sentiment === 'CRITICAL_GRIEVANCE'
                            ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                            : vm.sentiment === 'GRATITUDE'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                        }`}>
                          {vm.sentiment === 'CRITICAL_GRIEVANCE' ? 'अति-आवश्यक समस्या' : vm.sentiment === 'GRATITUDE' ? 'आभार संदेश' : 'सुझाव'}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {vm.village} • बूथ #{vm.boothNo} • {vm.recordedAt}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {vm.callbackStatus === 'CALLED' ? (
                        <span className="px-2.5 py-1 bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 rounded-lg text-[10px] font-bold flex items-center space-x-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>कॉल बैक पूर्ण</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => handleMarkCalled(vm.id)}
                          className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-[10px] font-bold transition flex items-center space-x-1"
                        >
                          <PhoneCall className="w-3 h-3" />
                          <span>कॉल बैक करें</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* AI Transcription Card */}
                  <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-700/60 text-xs text-slate-200 leading-relaxed font-sans">
                    <div className="text-[10px] text-amber-400 font-bold uppercase tracking-wider mb-1 flex items-center space-x-1">
                      <Sparkles className="w-3 h-3" />
                      <span>AI हिंदी वॉयस ट्रांसक्रिप्शन ({vm.durationSeconds}s):</span>
                    </div>
                    "{vm.transcriptionHi}"
                  </div>

                  {/* Audio player & actions */}
                  <div className="flex items-center justify-between text-xs pt-1">
                    <button
                      onClick={() => setPlayingVmId(playingVmId === vm.id ? null : vm.id)}
                      className="flex items-center space-x-2 text-slate-300 hover:text-white transition"
                    >
                      <span className="p-1.5 bg-slate-700 rounded-lg text-amber-400">
                        {playingVmId === vm.id ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
                      </span>
                      <span>{playingVmId === vm.id ? 'ऑडियो बज रहा है...' : 'रिकॉर्डिंग सुनें'}</span>
                    </button>

                    <a
                      href={`https://wa.me/91${vm.mobile}?text=${encodeURIComponent(
                        `सादर प्रणाम ${vm.callerName} जी,\nविधायक कार्यालय नूरपुर (रणबीर सिंह निक्का) से आपका वॉयसमेल प्राप्त हुआ है। आपकी समस्या/सुझाव पर त्वरित संज्ञान लिया जा रहा है।`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center space-x-1 text-emerald-400 hover:text-emerald-300 font-medium"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>व्हाट्सएप पावती भेजें</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
