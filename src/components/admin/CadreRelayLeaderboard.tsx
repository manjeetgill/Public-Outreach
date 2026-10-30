import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Radio, 
  Phone, 
  MessageSquare, 
  CheckCircle2, 
  AlertTriangle, 
  Search, 
  TrendingUp, 
  ShieldCheck, 
  RefreshCw, 
  ExternalLink, 
  Share2, 
  Clock, 
  X,
  Sparkles,
  PhoneCall
} from 'lucide-react';
import { 
  BoothRelayTelemetry, 
  fetchRelayLeaderboard,
  fetchCadreBroadcastPacks,
  CadreCivicBroadcastPack,
  FALLBACK_CIVIC_PACK
} from '../../services/offlineBoothStore';
import { Language } from '../../types/campaign';

interface CadreRelayLeaderboardProps {
  lang: Language;
  onClose?: () => void;
}

export const CadreRelayLeaderboard: React.FC<CadreRelayLeaderboardProps> = ({ lang, onClose }) => {
  const [leaderboard, setLeaderboard] = useState<BoothRelayTelemetry[]>([]);
  const [stats, setStats] = useState({
    totalBooths: 118,
    totalHouseholds: 4480,
    totalReads: 3290,
    avgCoveragePct: 73,
    activeCadresCount: 94,
    topActiveCount: 48,
    inProgressCount: 46,
    sluggishCount: 24
  });
  const [filterTab, setFilterTab] = useState<'ALL' | 'TOP_ACTIVE' | 'IN_PROGRESS' | 'SLUGGISH'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activePack, setActivePack] = useState<CadreCivicBroadcastPack>(FALLBACK_CIVIC_PACK);
  const [isPackModalOpen, setIsPackModalOpen] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadData = async () => {
    setIsLoading(true);
    const data = await fetchRelayLeaderboard();
    if (data && data.leaderboard) {
      setLeaderboard(data.leaderboard);
      if (data.stats) setStats(data.stats);
    }
    const packsData = await fetchCadreBroadcastPacks();
    if (packsData?.activePack) {
      setActivePack(packsData.activePack);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 20000);
    return () => clearInterval(interval);
  }, []);

  const filteredBooths = leaderboard.filter(b => {
    if (filterTab === 'TOP_ACTIVE' && b.coveragePercentage < 75) return false;
    if (filterTab === 'IN_PROGRESS' && (b.coveragePercentage < 30 || b.coveragePercentage >= 75)) return false;
    if (filterTab === 'SLUGGISH' && b.coveragePercentage >= 30) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (
        b.boothName.toLowerCase().includes(q) ||
        b.pannaPramukhName.toLowerCase().includes(q) ||
        b.pannaPramukhPhone.includes(q) ||
        `बूथ ${b.boothNo}`.includes(q) ||
        `${b.boothNo}` === q
      );
    }
    return true;
  });

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 text-slate-100 shadow-2xl space-y-5">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-xl flex items-center space-x-2 text-xs font-bold animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-xs font-semibold text-emerald-400 mb-2">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>Decentralized P2P WhatsApp Relay • 118 पन्ना प्रमुख कैडर</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center space-x-2">
            <span>पन्ना प्रमुख कैडर रिले मॉनिटर व रीड-रेट लीडरबोर्ड</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            केंद्रीय बल्क मैसेजिंग ब्लास्ट के बिना, 118 पन्ना प्रमुखों द्वारा अपने 35-40 पड़ोसियों को भेजा गया जन-कल्याण बुलेटिन। 100% स्पैम बैन मुक्त व वास्तविक नागरिक जुड़ाव ट्रैकिंग।
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={() => setIsPackModalOpen(true)}
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-xl text-xs font-bold transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>सक्रिय बुलेटिन देखें</span>
          </button>

          <button
            onClick={loadData}
            disabled={isLoading}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition"
            title="रिफ्रेश करें"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
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

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3.5">
          <div className="text-[11px] text-slate-400 font-medium">कुल 118 बूथ कवरेज (Avg Reads)</div>
          <div className="text-2xl font-black text-white mt-0.5">{stats.avgCoveragePct}%</div>
          <div className="text-[10px] text-emerald-400 mt-0.5 font-bold">
            {stats.totalReads.toLocaleString('en-IN')} / {stats.totalHouseholds.toLocaleString('en-IN')} परिवार पहुंचे
          </div>
        </div>

        <div className="bg-emerald-950/30 border border-emerald-800/40 rounded-xl p-3.5">
          <div className="text-[11px] text-emerald-400 font-semibold flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>
            <span>शीर्ष सक्रिय बूथ (&gt;75%)</span>
          </div>
          <div className="text-2xl font-black text-emerald-300 mt-0.5">{stats.topActiveCount} बूथ</div>
          <div className="text-[10px] text-emerald-400/80 mt-0.5">सफल जनसंवाद रिले</div>
        </div>

        <div className="bg-amber-950/30 border border-amber-800/40 rounded-xl p-3.5">
          <div className="text-[11px] text-amber-400 font-semibold flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-amber-400 inline-block"></span>
            <span>प्रगति पर (30-75%)</span>
          </div>
          <div className="text-2xl font-black text-amber-300 mt-0.5">{stats.inProgressCount} बूथ</div>
          <div className="text-[10px] text-amber-400/80 mt-0.5">प्रसार चालू है</div>
        </div>

        <div className="bg-rose-950/30 border border-rose-800/40 rounded-xl p-3.5">
          <div className="text-[11px] text-rose-400 font-semibold flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-rose-400 inline-block"></span>
            <span>निष्क्रिय / सुस्त बूथ (&lt;30%)</span>
          </div>
          <div className="text-2xl font-black text-rose-300 mt-0.5">{stats.sluggishCount} बूथ</div>
          <div className="text-[10px] text-rose-400/80 mt-0.5">वार रूम फॉलोअप आवश्यक</div>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          <button
            onClick={() => setFilterTab('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              filterTab === 'ALL'
                ? 'bg-slate-200 text-slate-900 font-bold'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            सभी 118 बूथ ({leaderboard.length})
          </button>
          <button
            onClick={() => setFilterTab('TOP_ACTIVE')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center space-x-1 ${
              filterTab === 'TOP_ACTIVE'
                ? 'bg-emerald-600 text-white font-bold'
                : 'bg-slate-800 text-emerald-400 hover:bg-slate-700'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>शीर्ष सक्रिय ({stats.topActiveCount})</span>
          </button>
          <button
            onClick={() => setFilterTab('IN_PROGRESS')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center space-x-1 ${
              filterTab === 'IN_PROGRESS'
                ? 'bg-amber-600 text-white font-bold'
                : 'bg-slate-800 text-amber-400 hover:bg-slate-700'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            <span>प्रगति पर ({stats.inProgressCount})</span>
          </button>
          <button
            onClick={() => setFilterTab('SLUGGISH')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center space-x-1 ${
              filterTab === 'SLUGGISH'
                ? 'bg-rose-600 text-white font-bold'
                : 'bg-slate-800 text-rose-400 hover:bg-slate-700'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse"></span>
            <span>सुस्त / निष्क्रिय ({stats.sluggishCount})</span>
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="बूथ, गांव या पन्ना प्रमुख खोजें..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
          />
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="border border-slate-800 rounded-xl overflow-hidden overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-800/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <th className="py-2.5 px-3">बूथ #</th>
              <th className="py-2.5 px-3">बूथ व गांव</th>
              <th className="py-2.5 px-3">पन्ना प्रमुख (प्रभारी)</th>
              <th className="py-2.5 px-3 text-center">आवंटित परिवार</th>
              <th className="py-2.5 px-3 text-center">सत्यापित रीड्स</th>
              <th className="py-2.5 px-3">रीड-रेट कवरेज</th>
              <th className="py-2.5 px-3">स्थिति</th>
              <th className="py-2.5 px-3 text-right">कार्रवाई (War Room)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {filteredBooths.map(b => {
              const isTop = b.coveragePercentage >= 75;
              const isSluggish = b.coveragePercentage < 30;

              return (
                <tr key={b.boothNo} className="hover:bg-slate-800/40 transition">
                  <td className="py-2.5 px-3 font-mono font-bold text-amber-400">
                    #{b.boothNo}
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="font-bold text-white">{b.boothName}</div>
                    <div className="text-[10px] text-slate-400">वार्ड #{b.wardNo}</div>
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="font-semibold text-slate-200">{b.pannaPramukhName}</div>
                    <div className="text-[10px] text-slate-400 font-mono">+91 {b.pannaPramukhPhone}</div>
                  </td>
                  <td className="py-2.5 px-3 text-center font-bold text-slate-300">
                    {b.assignedHouseholds} परिवार
                  </td>
                  <td className="py-2.5 px-3 text-center font-bold text-white">
                    {b.totalReads}
                  </td>
                  <td className="py-2.5 px-3 min-w-[130px]">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          style={{ width: `${b.coveragePercentage}%` }}
                          className={`h-full ${
                            isTop ? 'bg-emerald-500' : isSluggish ? 'bg-rose-500' : 'bg-amber-400'
                          }`}
                        ></div>
                      </div>
                      <span className={`text-[11px] font-bold font-mono ${
                        isTop ? 'text-emerald-400' : isSluggish ? 'text-rose-400' : 'text-amber-300'
                      }`}>
                        {b.coveragePercentage}%
                      </span>
                    </div>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                      isTop
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : isSluggish
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    }`}>
                      {isTop ? '🟢 सक्रिय' : isSluggish ? '🔴 सुस्त' : '🟡 प्रगति पर'}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <div className="inline-flex items-center space-x-1.5">
                      <a
                        href={`tel:${b.pannaPramukhPhone}`}
                        onClick={() => showToast(`${b.pannaPramukhName} को कॉल मिलाई जा रही है...`)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center space-x-1 ${
                          isSluggish
                            ? 'bg-rose-600 hover:bg-rose-500 text-white animate-pulse'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                        }`}
                        title="पन्ना प्रमुख को तुरंत कॉल करें"
                      >
                        <PhoneCall className="w-3 h-3" />
                        <span>{isSluggish ? 'नज करें' : 'कॉल'}</span>
                      </a>

                      <a
                        href={`https://api.whatsapp.com/send?phone=91${b.pannaPramukhPhone}&text=${encodeURIComponent(
                          `जय श्री राम ${b.pannaPramukhName} जी, विधायक वार रूम नूरपुर से। बूथ #${b.boothNo} पर आज का जन-कल्याण बुलेटिन अभी केवल ${b.coveragePercentage}% परिवारों तक पहुंचा है। कृपया अपने बचे हुए परिवारों को WhatsApp पर शीघ्र अग्रेषित करें।`
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1 bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-400 rounded-lg transition"
                        title="WhatsApp पर स्मरण पत्र भेजें"
                      >
                        <Share2 className="w-3 h-3" />
                      </a>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Active Pack Modal */}
      {isPackModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h3 className="font-extrabold text-white text-base">सक्रिय जन-कल्याण बुलेटिन (Civic Pack)</h3>
              </div>
              <button onClick={() => setIsPackModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
              <div className="font-bold text-white text-sm">
                📌 {activePack.headlineHi}
              </div>
              <ul className="space-y-1 text-slate-300">
                {activePack.bulletPoints.map((pt, i) => (
                  <li key={i}>• {pt}</li>
                ))}
              </ul>
              <div className="text-[11px] text-amber-400 pt-2 border-t border-slate-800">
                ट्रैकिंग लिंक: <span className="font-mono text-slate-400">/api/c/[boothNo]/{activePack.id}</span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setIsPackModalOpen(false)}
                className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition"
              >
                ठीक है (Done)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
