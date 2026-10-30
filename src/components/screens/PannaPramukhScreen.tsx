import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  CheckCircle, 
  Search, 
  Download, 
  PlusCircle, 
  Phone, 
  Send, 
  AlertCircle,
  FileText,
  UserCheck,
  Building,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';
import { BoothVoterRecord, Language, OfflineDoorstepGrievance } from '../../types/campaign';
import { 
  getBoothVotersFromLocal, 
  saveBoothPackToLocal, 
  updateVoterInLocal, 
  queueDoorstepGrievanceLocal, 
  getQueuedDoorstepLocal, 
  syncBoothWithServer 
} from '../../services/offlineBoothStore';

interface PannaPramukhScreenProps {
  lang: Language;
}

export const PannaPramukhScreen: React.FC<PannaPramukhScreenProps> = ({ lang }) => {
  const [selectedBooth, setSelectedBooth] = useState<number>(41);
  const [voters, setVoters] = useState<BoothVoterRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sentimentFilter, setSentimentFilter] = useState<'ALL' | 'SUPPORTER' | 'SWING' | 'OPPOSITION'>('ALL');
  const [turnoutFilter, setTurnoutFilter] = useState<'ALL' | 'VOTED' | 'NOT_VOTED'>('ALL');
  const [isOnline, setIsOnline] = useState<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncStatusMsg, setSyncStatusMsg] = useState<string | null>(null);
  const [queuedDoorstep, setQueuedDoorstep] = useState<OfflineDoorstepGrievance[]>([]);
  
  // Doorstep grievance modal/drawer state
  const [isDoorstepModalOpen, setIsDoorstepModalOpen] = useState(false);
  const [citizenName, setCitizenName] = useState('');
  const [citizenMobile, setCitizenMobile] = useState('');
  const [grievanceCategory, setGrievanceCategory] = useState('पेयजल / पाइपलाइन लीकेज');
  const [issueDescription, setIssueDescription] = useState('');
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  // Monitor online / offline network state
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Load booth data from local IndexedDB first, then fetch pack if online
  const loadBoothData = async (boothNo: number) => {
    // 1. Load local cache
    const local = await getBoothVotersFromLocal(boothNo);
    if (local && local.length > 0) {
      setVoters(local);
    }

    // Load queued doorstep items
    const queued = await getQueuedDoorstepLocal();
    setQueuedDoorstep(queued);

    // 2. Fetch fresh pack from server if online
    if (navigator.onLine) {
      try {
        const res = await fetch(`/api/booth/${boothNo}/pack`);
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.voters) {
            setVoters(data.voters);
            await saveBoothPackToLocal(boothNo, data.voters);
          }
        }
      } catch (err) {
        console.warn('Could not fetch server pack, using local store:', err);
      }
    }
  };

  useEffect(() => {
    loadBoothData(selectedBooth);
  }, [selectedBooth]);

  // Handle Mark Turnout with Haptic Vibration
  const handleToggleTurnout = async (voter: BoothVoterRecord) => {
    const nextVoted = !voter.isTurnoutMarked;

    // Haptic feedback (50ms pulse for mobile grassroots workers)
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(50);
    }

    // Update local state immediately (Optimistic UI)
    setVoters((prev) => 
      prev.map(v => v.id === voter.id ? { 
        ...v, 
        isTurnoutMarked: nextVoted,
        turnoutTimestamp: nextVoted ? new Date().toISOString() : undefined 
      } : v)
    );

    // Persist into IndexedDB
    await updateVoterInLocal(voter.id, nextVoted, voter.sentimentTag);

    setFeedbackToast(
      nextVoted 
        ? `${voter.name} का मतदान दर्ज! (क्रम: ${voter.serialNo})` 
        : `${voter.name} का मतदान अन-मार्क किया गया`
    );
    setTimeout(() => setFeedbackToast(null), 2500);
  };

  // Change voter sentiment tag
  const handleChangeSentiment = async (voter: BoothVoterRecord, tag: 'SUPPORTER' | 'SWING' | 'OPPOSITION') => {
    setVoters((prev) => 
      prev.map(v => v.id === voter.id ? { ...v, sentimentTag: tag } : v)
    );
    await updateVoterInLocal(voter.id, voter.isTurnoutMarked, tag);
  };

  // Log Doorstep Grievance (Works 100% offline)
  const handleSubmitDoorstep = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!citizenName.trim() || !issueDescription.trim()) return;

    const newDoorstep = await queueDoorstepGrievanceLocal({
      clientTempId: `doorstep-${Date.now()}`,
      boothNo: selectedBooth,
      wardNo: voters[0]?.wardNo || 8,
      citizenName: citizenName.trim(),
      mobile: citizenMobile.trim() || '98160*****',
      category: grievanceCategory,
      issueDescription: issueDescription.trim(),
      createdAt: new Date().toISOString()
    });

    setQueuedDoorstep(prev => [newDoorstep, ...prev]);
    setCitizenName('');
    setCitizenMobile('');
    setIssueDescription('');
    setIsDoorstepModalOpen(false);

    setFeedbackToast('डोरस्टेप शिकायत ऑफलाइन दर्ज हुई! नेटवर्क आने पर स्वतः सिंक होगी।');
    setTimeout(() => setFeedbackToast(null), 3000);
  };

  // Manual trigger: Sync with server
  const handleSyncNow = async () => {
    setIsSyncing(true);
    setSyncStatusMsg(null);
    try {
      const result = await syncBoothWithServer(selectedBooth);
      if (result.success) {
        setSyncStatusMsg(`सफलतापूर्वक सिंक हुआ! ${result.updatedCount} मतदाता व ${result.syncedDoorstepCount} डोरस्टेप शिकायतें सर्वर पर अपडेट हुईं।`);
        const queued = await getQueuedDoorstepLocal();
        setQueuedDoorstep(queued);
        await loadBoothData(selectedBooth);
      } else {
        setSyncStatusMsg('सिंक असफल रहा। नेटवर्क जांचें और पुनः प्रयास करें।');
      }
    } catch {
      setSyncStatusMsg('सिंक त्रुटि। कृपया बाद में प्रयास करें।');
    } finally {
      setIsSyncing(false);
      setTimeout(() => setSyncStatusMsg(null), 5000);
    }
  };

  // Computed statistics
  const totalCount = voters.length;
  const votedCount = voters.filter(v => v.isTurnoutMarked).length;
  const turnoutPercent = totalCount > 0 ? Math.round((votedCount / totalCount) * 100) : 0;
  const supporterCount = voters.filter(v => v.sentimentTag === 'SUPPORTER').length;

  // Filtered voters list
  const filteredVoters = useMemo(() => {
    return voters.filter(v => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        v.name.toLowerCase().includes(q) ||
        v.guardianName.toLowerCase().includes(q) ||
        v.id.toLowerCase().includes(q) ||
        v.houseNo.toLowerCase().includes(q) ||
        v.serialNo.toString().includes(q) ||
        (v.mobile && v.mobile.includes(q));

      const matchesSentiment = sentimentFilter === 'ALL' || v.sentimentTag === sentimentFilter;
      const matchesTurnout = turnoutFilter === 'ALL' || 
        (turnoutFilter === 'VOTED' && v.isTurnoutMarked) ||
        (turnoutFilter === 'NOT_VOTED' && !v.isTurnoutMarked);

      return matchesSearch && matchesSentiment && matchesTurnout;
    });
  }, [voters, searchQuery, sentimentFilter, turnoutFilter]);

  return (
    <div className="space-y-4 pb-12">
      {/* Toast Feedback */}
      {feedbackToast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-full shadow-2xl text-xs font-bold border border-amber-500/50 flex items-center gap-2 animate-bounce">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{feedbackToast}</span>
        </div>
      )}

      {/* Screen Header Banner */}
      <div className="bg-gradient-to-br from-[#102a43] to-[#1c3d5a] text-white p-4 rounded-2xl shadow-md border border-slate-700">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
              <Users className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base font-extrabold text-white">
                {lang === 'hi' ? 'पन्ना प्रमुख साथी (बूथ डिजिटल कम्पैनियन)' : 'Panna Pramukh Booth Companion'}
              </h2>
              <p className="text-[11px] text-slate-300">
                100% ऑफलाइन कार्यक्षम • ज़ीरो नेटवर्क सपोर्ट • तुरंत मतदान ट्रैकिंग
              </p>
            </div>
          </div>

          {/* Network Status Badge */}
          <div className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold flex items-center gap-1.5 border shadow-xs ${
            isOnline 
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
              : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
          }`}>
            {isOnline ? <Wifi className="w-3 h-3 text-emerald-400" /> : <WifiOff className="w-3 h-3 text-rose-400" />}
            <span>{isOnline ? 'ऑनलाइन' : 'ऑफलाइन मोड'}</span>
          </div>
        </div>

        {/* Booth Selector & Sync Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 mt-3 pt-3 border-t border-slate-700/60">
          <div className="sm:col-span-7 flex items-center gap-2">
            <label className="text-xs text-slate-300 font-bold shrink-0">
              {lang === 'hi' ? 'बूथ चुनें:' : 'Select Booth:'}
            </label>
            <div className="relative flex-1">
              <select
                value={selectedBooth}
                onChange={(e) => setSelectedBooth(Number(e.target.value))}
                aria-label={lang === 'hi' ? 'बूथ चुनें' : 'Select Polling Booth'}
                className="w-full bg-slate-900/90 text-white text-xs font-semibold px-3 py-2 rounded-xl border border-slate-600 focus:outline-hidden focus:border-amber-400 appearance-none pr-8 cursor-pointer"
              >
                <option value={41}>बूथ 41: राजकीय व.मा.वि. भदवार (वार्ड 08)</option>
                <option value={42}>बूथ 42: राजकीय प्रा.पा. जसूर (वार्ड 01)</option>
                <option value={88}>बूथ 88: राजकीय उच्च विद्यालय, रेहन (वार्ड 12)</option>
                <option value={15}>बूथ 15: राजकीय मॉडल स्कूल, कोटला (वार्ड 15)</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
            </div>
          </div>

          <div className="sm:col-span-5 flex items-center gap-2">
            <button
              onClick={handleSyncNow}
              disabled={isSyncing}
              className="flex-1 py-2 px-3 bg-amber-500 hover:bg-amber-600 disabled:bg-slate-700 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-1.5 transition shadow-sm cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'सिंक हो रहा है...' : 'डेटा सिंक करें'}</span>
            </button>

            <button
              onClick={() => setIsDoorstepModalOpen(true)}
              className="py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1 transition shadow-sm cursor-pointer"
              title="डोरस्टेप मांग दर्ज करें"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">डोरस्टेप मांग</span>
            </button>
          </div>
        </div>

        {/* Sync Status Banner */}
        {syncStatusMsg && (
          <div className="mt-2 text-xs bg-slate-900/90 text-amber-300 p-2 rounded-lg border border-amber-500/30 flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
            <span>{syncStatusMsg}</span>
          </div>
        )}
      </div>

      {/* Turnout Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] text-slate-500 font-bold block">बूथ के कुल मतदाता</span>
          <div className="text-xl font-black text-slate-900 mt-0.5">{totalCount}</div>
          <span className="text-[10px] text-slate-400">ऑफलाइन कैश्ड सूची</span>
        </div>

        <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 shadow-2xs">
          <span className="text-[11px] text-emerald-700 font-bold block">मतदान दर्ज (Turnout)</span>
          <div className="text-xl font-black text-emerald-900 mt-0.5">{votedCount}</div>
          <span className="text-[10px] text-emerald-700 font-bold">{turnoutPercent}% कुल मतदान</span>
        </div>

        <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 shadow-2xs">
          <span className="text-[11px] text-amber-800 font-bold block">समर्थक मतदाता</span>
          <div className="text-xl font-black text-amber-950 mt-0.5">{supporterCount}</div>
          <span className="text-[10px] text-amber-700">सत्यापित समर्थक</span>
        </div>

        <div className="bg-sky-50 p-3 rounded-xl border border-sky-200 shadow-2xs">
          <span className="text-[11px] text-sky-800 font-bold block">लंबित डोरस्टेप मांगें</span>
          <div className="text-xl font-black text-sky-950 mt-0.5">{queuedDoorstep.length}</div>
          <span className="text-[10px] text-sky-700 font-bold">कतारबद्ध (सिंक हेतु तैयार)</span>
        </div>
      </div>

      {/* Search & Quick Filters */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs space-y-2.5">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={lang === 'hi' ? 'नाम, क्रम संख्या, मकान सं. या EPIC से खोजें...' : 'Search by name, serial, house no or EPIC...'}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-300 focus:outline-hidden focus:border-amber-500 font-medium text-slate-900"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          {/* Turnout Toggle Filter */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setTurnoutFilter('ALL')}
              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition ${
                turnoutFilter === 'ALL' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              सभी ({totalCount})
            </button>
            <button
              onClick={() => setTurnoutFilter('NOT_VOTED')}
              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition ${
                turnoutFilter === 'NOT_VOTED' ? 'bg-amber-500 text-slate-950 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              शेष ({totalCount - votedCount})
            </button>
            <button
              onClick={() => setTurnoutFilter('VOTED')}
              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition ${
                turnoutFilter === 'VOTED' ? 'bg-emerald-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              मतदान पूर्ण ({votedCount})
            </button>
          </div>

          {/* Sentiment Filter */}
          <div className="flex items-center gap-1 text-[11px]">
            <span className="text-slate-400 font-bold hidden sm:inline">रुझान:</span>
            <select
              value={sentimentFilter}
              onChange={(e) => setSentimentFilter(e.target.value as any)}
              aria-label={lang === 'hi' ? 'मतदाता रुझान फ़िल्टर' : 'Filter by voter sentiment'}
              className="text-xs bg-slate-50 border border-slate-300 rounded-lg px-2 py-1 font-bold text-slate-700"
            >
              <option value="ALL">सभी रुझान</option>
              <option value="SUPPORTER">🟢 समर्थक</option>
              <option value="SWING">🟡 अनिर्णीत</option>
              <option value="OPPOSITION">⚪ विरोधी</option>
            </select>
          </div>
        </div>
      </div>

      {/* Voters List */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1 text-xs text-slate-500 font-bold">
          <span>दिखाए जा रहे मतदाता ({filteredVoters.length})</span>
          <span>एक-टैप में मतदान मार्क करें</span>
        </div>

        {filteredVoters.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 text-slate-500 text-xs">
            कोई मतदाता नहीं मिला। खोज शब्द बदलें या बूथ डेटा सिंक करें।
          </div>
        ) : (
          filteredVoters.map((voter) => (
            <div
              key={voter.id}
              className={`p-3 rounded-2xl border transition shadow-2xs ${
                voter.isTurnoutMarked 
                  ? 'bg-emerald-50/70 border-emerald-300' 
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-slate-900 text-amber-400 text-xs font-black flex items-center justify-center shrink-0 shadow-2xs">
                      #{voter.serialNo}
                    </span>
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-900 leading-tight">
                        {voter.name}
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        पिता/पति: {voter.guardianName} • आयु: {voter.age} • लिंग: {voter.gender}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 mt-2 text-[10px] text-slate-600">
                    <span className="bg-slate-100 px-2 py-0.5 rounded-md font-bold">
                      मकान: {voter.houseNo}
                    </span>
                    <span className="bg-slate-100 px-2 py-0.5 rounded-md font-mono">
                      {voter.id}
                    </span>
                    {voter.mobile && (
                      <a href={`tel:${voter.mobile}`} className="text-sky-700 font-bold flex items-center gap-0.5 hover:underline">
                        <Phone className="w-2.5 h-2.5" />
                        {voter.mobile}
                      </a>
                    )}
                  </div>
                </div>

                {/* Right: One-tap Turnout Button & Sentiment Selector */}
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <button
                    onClick={() => handleToggleTurnout(voter)}
                    className={`px-3 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95 ${
                      voter.isTurnoutMarked
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        : 'bg-slate-900 hover:bg-slate-800 text-amber-400 border border-slate-700'
                    }`}
                  >
                    <CheckCircle className={`w-4 h-4 ${voter.isTurnoutMarked ? 'text-white' : 'text-amber-400'}`} />
                    <span>{voter.isTurnoutMarked ? 'मतदान दर्ज ✓' : 'मतदान दर्ज करें'}</span>
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleChangeSentiment(voter, 'SUPPORTER')}
                      className={`text-[10px] px-1.5 py-0.5 rounded font-bold cursor-pointer transition ${
                        voter.sentimentTag === 'SUPPORTER' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
                      }`}
                      title="समर्थक"
                    >
                      🟢
                    </button>
                    <button
                      onClick={() => handleChangeSentiment(voter, 'SWING')}
                      className={`text-[10px] px-1.5 py-0.5 rounded font-bold cursor-pointer transition ${
                        voter.sentimentTag === 'SWING' ? 'bg-amber-500 text-slate-950' : 'bg-slate-100 text-slate-600'
                      }`}
                      title="अनिर्णीत"
                    >
                      🟡
                    </button>
                    <button
                      onClick={() => handleChangeSentiment(voter, 'OPPOSITION')}
                      className={`text-[10px] px-1.5 py-0.5 rounded font-bold cursor-pointer transition ${
                        voter.sentimentTag === 'OPPOSITION' ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-600'
                      }`}
                      title="विरोधी"
                    >
                      ⚪
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Doorstep Grievance Modal */}
      {isDoorstepModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-5 shadow-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-emerald-100 text-emerald-700 rounded-lg">
                  <PlusCircle className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">
                    डोरस्टेप नागरिक मांग / समस्या दर्ज करें
                  </h3>
                  <p className="text-[10px] text-slate-500">
                    बूथ {selectedBooth} • 100% ऑफलाइन कार्यक्षम
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsDoorstepModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitDoorstep} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  नागरिक का नाम *
                </label>
                <input
                  type="text"
                  required
                  value={citizenName}
                  onChange={(e) => setCitizenName(e.target.value)}
                  placeholder="उदा. रमेश कुमार"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:border-amber-500 font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  मोबाइल नंबर (व्हाट्सएप अपडेट हेतु)
                </label>
                <input
                  type="tel"
                  value={citizenMobile}
                  onChange={(e) => setCitizenMobile(e.target.value)}
                  placeholder="98160*****"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:border-amber-500 font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  समस्या श्रेणी
                </label>
                <select
                  value={grievanceCategory}
                  onChange={(e) => setGrievanceCategory(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white font-medium"
                >
                  <option value="पेयजल / पाइपलाइन लीकेज">पेयजल / पाइपलाइन लीकेज (जल शक्ति विभाग)</option>
                  <option value="विद्युत / ट्रांसफार्मर समस्या">विद्युत / ट्रांसफार्मर समस्या (HPSEBL)</option>
                  <option value="सड़क एवं गड्ढा मरम्मत">सड़क एवं गड्ढा मरम्मत (PWD)</option>
                  <option value="बाढ़ सुरक्षा एवं दंगा निर्माण">बाढ़ सुरक्षा एवं दंगा निर्माण</option>
                  <option value="पेंशन एवं सरकारी योजना">पेंशन एवं सरकारी योजना सहायता</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  मांग का विवरण *
                </label>
                <textarea
                  required
                  rows={3}
                  value={issueDescription}
                  onChange={(e) => setIssueDescription(e.target.value)}
                  placeholder="नागरिक द्वारा बताई गई समस्या का संक्षिप्त विवरण..."
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:border-amber-500 font-medium"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsDoorstepModalOpen(false)}
                  className="flex-1 py-2.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 text-xs font-black text-slate-950 bg-amber-500 hover:bg-amber-600 rounded-xl transition shadow-md cursor-pointer"
                >
                  ऑफलाइन सेव करें
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
