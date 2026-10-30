import React, { useState } from 'react';
import { 
  BarChart3, 
  MapPin, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Users, 
  Phone, 
  ArrowRight, 
  Sparkles, 
  Search, 
  X, 
  HeartHandshake, 
  Layers,
  Flame,
  ShieldCheck,
  Send
} from 'lucide-react';
import { 
  ALL_118_BOOTHS, 
  BoothSentimentRecord, 
  BoothStatus, 
  getConstituencySentimentSummary 
} from '../../services/sentimentAnalytics';
import { Language } from '../../types/campaign';

interface BoothSentimentHeatmapProps {
  lang: Language;
  onClose?: () => void;
  onOpenTrustFund?: () => void;
}

export const BoothSentimentHeatmap: React.FC<BoothSentimentHeatmapProps> = ({ 
  lang, 
  onClose,
  onOpenTrustFund 
}) => {
  const [booths, setBooths] = useState<BoothSentimentRecord[]>(ALL_118_BOOTHS);
  const [selectedBooth, setSelectedBooth] = useState<BoothSentimentRecord | null>(booths[0]);
  const [filterStatus, setFilterStatus] = useState<BoothStatus | 'ALL'>('ALL');
  const [selectedWard, setSelectedWard] = useState<number | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [sanctionedDirectives, setSanctionedDirectives] = useState<Record<number, boolean>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const summary = getConstituencySentimentSummary(booths);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const filteredBooths = booths.filter(b => {
    const matchesStatus = filterStatus === 'ALL' || b.status === filterStatus;
    const matchesWard = selectedWard === 'ALL' || b.wardNo === selectedWard;
    const matchesSearch = 
      b.boothName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.boothNameHi.includes(searchQuery) ||
      `बूथ ${b.boothNo}`.includes(searchQuery) ||
      `${b.boothNo}` === searchQuery.trim();
    return matchesStatus && matchesWard && matchesSearch;
  });

  const handleSanctionDirective = (boothNo: number) => {
    setSanctionedDirectives(prev => ({ ...prev, [boothNo]: true }));
    showToast(`बूथ #${boothNo} के लिए सर्जिकल फंड निर्देश स्वीकृत व वार रूम डिस्पैच किया गया!`);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-slate-100 shadow-2xl space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-xl flex items-center space-x-3 text-sm font-medium animate-bounce">
          <CheckCircle2 className="w-5 h-5" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-red-500/10 border border-red-500/30 rounded-full text-xs font-semibold text-red-400 mb-2">
            <Flame className="w-3.5 h-3.5" />
            <span>Nurpur AC 142 Intelligence | 118-बूथ सेंटिमेंट हीटमैप</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center space-x-2">
            <span>बूथवार मतदाता रुझान व स्विंग वोटर सर्जिकल टारगेटिंग</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            118 पोलिंग बूथों का लाइव माइक्रो-डेटा। ग्रीन (गढ़ &gt;60%), येलो (स्विंग 30-50%), रेड (संवेदनशील &gt;30 दिन पेंडेंसी)। प्रत्येक बूथ पर जीत की गारंटी हेतु AI फंड आवंटन।
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {onOpenTrustFund && (
            <button
              onClick={onOpenTrustFund}
              className="flex items-center space-x-2 px-3.5 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-xl text-xs font-semibold transition"
            >
              <HeartHandshake className="w-4 h-4 text-amber-400" />
              <span>निजात ट्रस्ट लेजर</span>
            </button>
          )}

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

      {/* Constituency Summary Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3.5">
          <div className="text-[11px] text-slate-400">कुल पोलिंग बूथ</div>
          <div className="text-2xl font-black text-white mt-1">118</div>
          <div className="text-[10px] text-slate-500 mt-0.5">{summary.totalVoters.toLocaleString('en-IN')} कुल मतदाता</div>
        </div>

        <div className="bg-emerald-950/30 border border-emerald-800/40 rounded-xl p-3.5">
          <div className="text-[11px] text-emerald-400 font-semibold flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>
            <span>मजबूत गढ़ (Stronghold)</span>
          </div>
          <div className="text-2xl font-black text-emerald-300 mt-1">{summary.strongholdBooths} बूथ</div>
          <div className="text-[10px] text-emerald-400/80 mt-0.5">&gt;60% एकतरफा समर्थन</div>
        </div>

        <div className="bg-amber-950/30 border border-amber-800/40 rounded-xl p-3.5">
          <div className="text-[11px] text-amber-400 font-semibold flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-amber-400 inline-block"></span>
            <span>स्विंग बूथ (Toss-Up)</span>
          </div>
          <div className="text-2xl font-black text-amber-300 mt-1">{summary.swingBooths} बूथ</div>
          <div className="text-[10px] text-amber-400/80 mt-0.5">30-50% अनिर्णायक मतदाता</div>
        </div>

        <div className="bg-rose-950/30 border border-rose-800/40 rounded-xl p-3.5">
          <div className="text-[11px] text-rose-400 font-semibold flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-rose-400 inline-block"></span>
            <span>संवेदनशील (Vulnerable)</span>
          </div>
          <div className="text-2xl font-black text-rose-300 mt-1">{summary.vulnerableBooths} बूथ</div>
          <div className="text-[10px] text-rose-400/80 mt-0.5">जनसमस्याओं से रोष</div>
        </div>

        <div className="bg-blue-950/30 border border-blue-800/40 rounded-xl p-3.5">
          <div className="text-[11px] text-blue-400 font-semibold">अनुमानित विजय बढ़त</div>
          <div className="text-2xl font-black text-blue-300 mt-1">+{summary.estimatedLeadVotes.toLocaleString('en-IN')}</div>
          <div className="text-[10px] text-blue-400/80 mt-0.5">कांगड़ा में सर्वाधिक मार्जिन</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
        {/* Status filters */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setFilterStatus('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              filterStatus === 'ALL'
                ? 'bg-slate-200 text-slate-900 font-bold'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            सभी 118 बूथ
          </button>
          <button
            onClick={() => setFilterStatus('STRONGHOLD')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center space-x-1.5 ${
              filterStatus === 'STRONGHOLD'
                ? 'bg-emerald-600 text-white font-bold'
                : 'bg-slate-800 text-emerald-400 hover:bg-slate-700'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>मजबूत गढ़ ({summary.strongholdBooths})</span>
          </button>
          <button
            onClick={() => setFilterStatus('SWING')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center space-x-1.5 ${
              filterStatus === 'SWING'
                ? 'bg-amber-600 text-white font-bold'
                : 'bg-slate-800 text-amber-400 hover:bg-slate-700'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            <span>स्विंग ({summary.swingBooths})</span>
          </button>
          <button
            onClick={() => setFilterStatus('VULNERABLE')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center space-x-1.5 ${
              filterStatus === 'VULNERABLE'
                ? 'bg-rose-600 text-white font-bold'
                : 'bg-slate-800 text-rose-400 hover:bg-slate-700'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-400"></span>
            <span>संवेदनशील ({summary.vulnerableBooths})</span>
          </button>
        </div>

        {/* Ward & Search Filter */}
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <select
            value={selectedWard}
            onChange={e => setSelectedWard(e.target.value === 'ALL' ? 'ALL' : Number(e.target.value))}
            className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
          >
            <option value="ALL">सभी वार्ड (1-24)</option>
            {Array.from({ length: 24 }, (_, i) => (
              <option key={i + 1} value={i + 1}>वार्ड {i + 1}</option>
            ))}
          </select>

          <div className="relative w-48">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="बूथ या गांव खोजें..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>
      </div>

      {/* Main Grid & Detail Panel Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 118 Booths Grid (2 columns on lg) */}
        <div className="lg:col-span-2 space-y-3">
          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span>बूथ ग्रिड (कुल {filteredBooths.length} प्रदर्शित) — किसी भी बूथ पर क्लिक कर रणनीति देखें:</span>
            <div className="flex items-center space-x-3 text-[11px]">
              <span className="flex items-center space-x-1"><span className="w-2.5 h-2.5 rounded bg-emerald-500"></span><span>&gt;60%</span></span>
              <span className="flex items-center space-x-1"><span className="w-2.5 h-2.5 rounded bg-amber-500"></span><span>30-50% स्विंग</span></span>
              <span className="flex items-center space-x-1"><span className="w-2.5 h-2.5 rounded bg-rose-500"></span><span>संवेदनशील</span></span>
            </div>
          </div>

          <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-1.5 max-h-[460px] overflow-y-auto p-2 bg-slate-950/60 rounded-xl border border-slate-800">
            {filteredBooths.map(booth => {
              const isSelected = selectedBooth?.boothNo === booth.boothNo;
              let bgClass = 'bg-emerald-600/30 border-emerald-500/50 text-emerald-300 hover:bg-emerald-600/50';
              if (booth.status === 'SWING') {
                bgClass = 'bg-amber-600/30 border-amber-500/50 text-amber-300 hover:bg-amber-600/50';
              } else if (booth.status === 'VULNERABLE') {
                bgClass = 'bg-rose-600/30 border-rose-500/50 text-rose-300 hover:bg-rose-600/50 animate-pulse';
              }

              return (
                <button
                  key={booth.boothNo}
                  onClick={() => setSelectedBooth(booth)}
                  className={`p-2 rounded-lg border text-center font-mono text-xs font-bold transition flex flex-col items-center justify-center relative ${bgClass} ${
                    isSelected ? 'ring-2 ring-white scale-105 z-10' : ''
                  }`}
                  title={`बूथ #${booth.boothNo} - ${booth.boothNameHi} (${booth.favorablePct}% समर्थक)`}
                >
                  <span className="text-[11px] leading-none">#{booth.boothNo}</span>
                  <span className="text-[9px] opacity-80 mt-1 font-sans">{booth.favorablePct}%</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Booth Deep Dive Panel */}
        {selectedBooth && (
          <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-5 space-y-4">
            <div className="flex items-start justify-between border-b border-slate-700 pb-3">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-700 text-white">
                    बूथ #{selectedBooth.boothNo}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    selectedBooth.status === 'STRONGHOLD' 
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : selectedBooth.status === 'SWING'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                      : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                  }`}>
                    {selectedBooth.status === 'STRONGHOLD' ? 'मजबूत गढ़' : selectedBooth.status === 'SWING' ? 'स्विंग क्षेत्र' : 'संवेदनशील'}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mt-1">
                  {selectedBooth.boothNameHi}
                </h3>
                <div className="text-xs text-slate-400">
                  वार्ड #{selectedBooth.wardNo} • कुल मतदाता: {selectedBooth.totalVoters}
                </div>
              </div>
            </div>

            {/* Voter Sentiment Split Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-emerald-400 font-semibold">{selectedBooth.favorablePct}% निक्का समर्थक</span>
                <span className="text-amber-400 font-semibold">{selectedBooth.swingPct}% अनिर्णायक</span>
                <span className="text-rose-400">{selectedBooth.oppositionPct}% विपक्ष</span>
              </div>
              <div className="h-3 w-full bg-slate-700 rounded-full overflow-hidden flex">
                <div style={{ width: `${selectedBooth.favorablePct}%` }} className="bg-emerald-500 h-full"></div>
                <div style={{ width: `${selectedBooth.swingPct}%` }} className="bg-amber-400 h-full"></div>
                <div style={{ width: `${selectedBooth.oppositionPct}%` }} className="bg-rose-500 h-full"></div>
              </div>
            </div>

            {/* Local Context Stats */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-700/60">
                <div className="text-slate-400 text-[10px]">लंबित नागरिक शिकायतें</div>
                <div className="text-base font-bold text-white mt-0.5 flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>{selectedBooth.pendingGrievancesCount} शिकायतें</span>
                </div>
                <div className="text-[10px] text-slate-500">औसत SLA: {selectedBooth.avgSlaDays} दिन</div>
              </div>

              <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-700/60">
                <div className="text-slate-400 text-[10px]">निजात निजी अनुदान (परिवार)</div>
                <div className="text-base font-bold text-amber-400 mt-0.5 flex items-center space-x-1">
                  <HeartHandshake className="w-3.5 h-3.5 text-amber-400" />
                  <span>{selectedBooth.nijaatGrantsCount} परिवार</span>
                </div>
                <div className="text-[10px] text-emerald-400 font-medium">~{selectedBooth.nijaatGrantsCount * 4} वोट सुरक्षित</div>
              </div>
            </div>

            {/* Panna Pramukh Contact */}
            <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-700/60 flex items-center justify-between text-xs">
              <div>
                <div className="text-[10px] text-slate-400">तैनात पन्ना प्रमुख (बूथ प्रभारी)</div>
                <div className="font-bold text-white">{selectedBooth.pannaPramukhName}</div>
                <div className="text-[11px] text-slate-400 font-mono">+91 {selectedBooth.pannaPramukhPhone}</div>
              </div>
              <a
                href={`tel:${selectedBooth.pannaPramukhPhone}`}
                className="p-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition"
                title="सीधे कॉल करें"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>

            {/* AI Surgical Action Box */}
            <div className="bg-amber-950/20 border border-amber-600/40 rounded-xl p-3.5 space-y-2">
              <div className="flex items-center space-x-1.5 text-amber-400 font-bold text-xs">
                <Sparkles className="w-4 h-4" />
                <span>AI सर्जिकल निर्देश (स्विंग वोटर विजय)</span>
              </div>
              <div className="text-xs font-semibold text-white">
                {selectedBooth.aiSurgicalAction.titleHi}
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                {selectedBooth.aiSurgicalAction.descriptionHi}
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-amber-600/20 text-[11px]">
                <span className="text-emerald-400 font-bold">
                  +{selectedBooth.aiSurgicalAction.expectedSwingGainVoters} स्विंग मतों की बढ़त
                </span>
                {selectedBooth.aiSurgicalAction.fundAmountRupees && (
                  <span className="font-mono text-amber-300 font-bold">
                    ₹{(selectedBooth.aiSurgicalAction.fundAmountRupees / 100000).toFixed(1)}L
                  </span>
                )}
              </div>

              {sanctionedDirectives[selectedBooth.boothNo] ? (
                <div className="w-full py-2 bg-emerald-600/20 border border-emerald-500 text-emerald-300 rounded-lg text-center text-xs font-bold flex items-center justify-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>निर्देश स्वीकृत व वार रूम डिस्पैच</span>
                </div>
              ) : (
                <button
                  onClick={() => handleSanctionDirective(selectedBooth.boothNo)}
                  className="w-full mt-1 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-bold transition flex items-center justify-center space-x-1.5 shadow-md shadow-amber-500/20"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>यह सर्जिकल फंड तुरंत स्वीकृत करें</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
