import React, { useState, useMemo } from 'react';
import { 
  PlusCircle, 
  Copy, 
  Check, 
  Search, 
  PhoneCall, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Radio, 
  MapPin, 
  BellRing,
  HelpCircle,
  Filter,
  SlidersHorizontal,
  Building2,
  X,
  ChevronRight,
  ShieldCheck,
  RotateCcw,
  PieChart as PieChartIcon,
  TrendingUp,
  BarChart3,
  CheckCircle,
  Layers,
  FileText
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip as RechartsTooltip 
} from 'recharts';
import { INITIAL_GRIEVANCES, NURPUR_WARDS } from '../../data/campaignData';
import { GrievanceTicket, Language } from '../../types/campaign';

interface NivaranScreenProps {
  onOpenComplaintModal: () => void;
  onOpenMlaLetter?: () => void;
  grievances: GrievanceTicket[];
  lang: Language;
}

export const NivaranScreen: React.FC<NivaranScreenProps> = ({
  onOpenComplaintModal,
  onOpenMlaLetter,
  grievances,
  lang
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'in-progress' | 'resolved' | 'verified'>('all');
  const [wardFilter, setWardFilter] = useState<number | 'all'>('all');
  const [selectedToken, setSelectedToken] = useState<string | null>(null);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [activeChartIndex, setActiveChartIndex] = useState<number | null>(null);
  const [subscribedTickets, setSubscribedTickets] = useState<Record<string, boolean>>({
    '#NR-8831': true,
    '#NR-8712': true,
    '#NR-8945': true
  });

  const allTickets = useMemo(() => {
    return grievances && grievances.length > 0 ? grievances : INITIAL_GRIEVANCES;
  }, [grievances]);

  // Counts for status metrics
  const statusCounts = useMemo(() => {
    const total = allTickets.length;
    const pending = allTickets.filter(t => t.status === 'pending').length;
    const inProgress = allTickets.filter(t => t.status === 'in-progress').length;
    const resolved = allTickets.filter(t => t.status === 'resolved').length;
    const verified = allTickets.filter(t => t.status === 'verified').length;
    return { total, pending, inProgress, resolved, verified };
  }, [allTickets]);

  // Resolution Success Rate
  const resolutionRate = useMemo(() => {
    if (statusCounts.total === 0) return 0;
    return Math.round(((statusCounts.resolved + statusCounts.verified) / statusCounts.total) * 100);
  }, [statusCounts]);

  // Chart data for Recharts Pie Chart
  const chartData = useMemo(() => {
    const items = [
      {
        id: 'resolved' as const,
        name: lang === 'hi' ? 'निस्तारित' : 'Resolved',
        nameEn: 'Resolved',
        value: statusCounts.resolved,
        color: '#10b981', // emerald-500
        activeColor: '#059669',
        badgeBg: 'bg-emerald-50',
        badgeText: 'text-emerald-700',
        badgeBorder: 'border-emerald-200'
      },
      {
        id: 'in-progress' as const,
        name: lang === 'hi' ? 'प्रक्रिया में' : 'In Progress',
        nameEn: 'In Progress',
        value: statusCounts.inProgress,
        color: '#f59e0b', // amber-500
        activeColor: '#d97706',
        badgeBg: 'bg-amber-50',
        badgeText: 'text-amber-700',
        badgeBorder: 'border-amber-200'
      },
      {
        id: 'verified' as const,
        name: lang === 'hi' ? 'सत्यापित' : 'Verified',
        nameEn: 'Verified',
        value: statusCounts.verified,
        color: '#0ea5e9', // sky-500
        activeColor: '#0284c7',
        badgeBg: 'bg-sky-50',
        badgeText: 'text-sky-700',
        badgeBorder: 'border-sky-200'
      },
      {
        id: 'pending' as const,
        name: lang === 'hi' ? 'लंबित' : 'Pending',
        nameEn: 'Pending',
        value: statusCounts.pending,
        color: '#f43f5e', // rose-500
        activeColor: '#e11d48',
        badgeBg: 'bg-rose-50',
        badgeText: 'text-rose-700',
        badgeBorder: 'border-rose-200'
      }
    ];

    return items.filter(d => d.value > 0);
  }, [statusCounts, lang]);

  // Real-time filtering by status, ward number, and free text search
  const filteredTickets = useMemo(() => {
    return allTickets.filter((ticket) => {
      // 1. Status Filter
      if (statusFilter !== 'all' && ticket.status !== statusFilter) {
        return false;
      }

      // 2. Ward Filter
      if (wardFilter !== 'all' && ticket.wardNo !== wardFilter) {
        return false;
      }

      // 3. Real-time Search Query matching Ward, Status, Token, Title, Location, Citizen
      if (!searchQuery.trim()) {
        return true;
      }

      const query = searchQuery.toLowerCase().trim();

      // Check if query is searching for a specific ward number directly or via text
      // e.g. "12", "ward 12", "वार्ड 12", "w12", "ward-12", "वार्ड-12"
      const wardCleanNum = query.replace(/[^\d]/g, '');
      const wardNumberMatches = 
        wardCleanNum !== '' && 
        (Number(wardCleanNum) === ticket.wardNo) &&
        (query.includes('ward') || query.includes('वार्ड') || query.includes('w') || query === wardCleanNum);

      // Check if query is searching for status keywords
      const matchesResolved = 
        (query.includes('resolved') || query.includes('निस्तारित') || query.includes('हल') || query === 'done') && 
        ticket.status === 'resolved';

      const matchesInProgress = 
        (query.includes('progress') || query.includes('प्रक्रिया') || query.includes('in-progress') || query.includes('चालू')) && 
        ticket.status === 'in-progress';

      const matchesVerified = 
        (query.includes('verified') || query.includes('सत्यापित') || query.includes('प्रमाणित')) && 
        ticket.status === 'verified';

      const matchesPending = 
        (query.includes('pending') || query.includes('लंबित') || query.includes('नया') || query.includes('new')) && 
        ticket.status === 'pending';

      const statusQueryMatches = matchesResolved || matchesInProgress || matchesVerified || matchesPending;

      // Textual matches (token, title, location, category, citizen)
      const textMatches = 
        ticket.token.toLowerCase().includes(query) ||
        ticket.title.toLowerCase().includes(query) ||
        (ticket.titleEn && ticket.titleEn.toLowerCase().includes(query)) ||
        ticket.location.toLowerCase().includes(query) ||
        ticket.citizenName.toLowerCase().includes(query) ||
        ticket.category.toLowerCase().includes(query);

      return wardNumberMatches || statusQueryMatches || textMatches;
    });
  }, [allTickets, statusFilter, wardFilter, searchQuery]);

  // Selected Ticket for detailed timeline view
  const activeTicket = useMemo(() => {
    if (filteredTickets.length === 0) return null;
    if (selectedToken) {
      const found = filteredTickets.find(t => t.token === selectedToken);
      if (found) return found;
    }
    return filteredTickets[0];
  }, [filteredTickets, selectedToken]);

  // List of distinct wards present in tickets for quick filter pills
  const availableWards = useMemo(() => {
    const wardSet = new Set<number>();
    allTickets.forEach(t => {
      if (t.wardNo) wardSet.add(t.wardNo);
    });
    return Array.from(wardSet).sort((a, b) => a - b);
  }, [allTickets]);

  const handleCopy = (token: string) => {
    navigator.clipboard?.writeText(token);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 2500);
  };

  const toggleWhatsAppSub = (token: string) => {
    setSubscribedTickets(prev => ({
      ...prev,
      [token]: !prev[token]
    }));
  };

  const resetAllFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setWardFilter('all');
    setSelectedToken(null);
  };

  const handleSliceClick = (id: 'all' | 'pending' | 'in-progress' | 'resolved' | 'verified') => {
    if (statusFilter === id) {
      setStatusFilter('all');
    } else {
      setStatusFilter(id);
    }
  };

  // Custom styled Tooltip for Recharts Pie Chart
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderCustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const count = Number(data.value);
      const percent = statusCounts.total > 0 ? Math.round((count / statusCounts.total) * 100) : 0;
      return (
        <div className="bg-slate-900/95 text-white px-3 py-2 rounded-xl shadow-xl border border-slate-700 text-xs backdrop-blur-xs pointer-events-none">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: data.payload.color }}
            />
            <span className="font-bold text-slate-100">{data.name}</span>
          </div>
          <div className="flex items-center justify-between gap-4 text-slate-300 font-mono text-[11px]">
            <span>{lang === 'hi' ? 'शिकायत संख्या:' : 'Count:'} <strong className="text-white font-bold">{count}</strong></span>
            <span className="text-emerald-400 font-bold">{percent}%</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1 border-t border-slate-800 pt-1">
            {lang === 'hi' ? 'क्लिक करके फ़िल्टर करें' : 'Click to filter list'}
          </div>
        </div>
      );
    }
    return null;
  };

  const hasActiveFilters = searchQuery.trim() !== '' || statusFilter !== 'all' || wardFilter !== 'all';

  return (
    <section className="p-4 space-y-4 max-w-7xl mx-auto">
      
      {/* 1. Live Grievance Redressal Matrix & Recharts Pie Chart Distribution */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-slate-200 space-y-4">
        {/* Header with Live Badge and Redressal Rate */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <PieChartIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <span>{lang === 'hi' ? 'लाइव शिकायत स्थिति विश्लेषण एवं निवारण' : 'Live Grievance Redressal & Status Distribution'}</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </h3>
              <p className="text-[11px] text-slate-500">
                {lang === 'hi' ? 'रीयल-टाइम निवारण ट्रैकिंग एवं पाई चार्ट विश्लेषण' : 'Real-time grievance redressal breakdown & Recharts analytics'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-2xs">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
              <span>{lang === 'hi' ? `निवारण दर: ${resolutionRate}%` : `Redressal Rate: ${resolutionRate}%`}</span>
            </span>
            <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-1 rounded-lg font-medium">
              {lang === 'hi' ? 'अपडेट: लाइव' : 'Live'}
            </span>
          </div>
        </div>

        {/* Status Metrics Counters (5 boxes: Total, Resolved, In Progress, Verified, Pending) */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center">
          <button 
            onClick={() => setStatusFilter('all')}
            className={`p-2.5 rounded-xl border transition text-center cursor-pointer ${
              statusFilter === 'all' 
                ? 'bg-slate-900 text-white border-slate-900 shadow-sm ring-2 ring-slate-800' 
                : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
            }`}
            title="Click to view all tickets"
          >
            <div className="text-lg font-black">{allTickets.length}</div>
            <div className={`text-[10px] font-semibold ${statusFilter === 'all' ? 'text-slate-300' : 'text-slate-600'}`}>
              {lang === 'hi' ? 'कुल शिकायतें' : 'Total Registered'}
            </div>
          </button>

          <button 
            onClick={() => handleSliceClick('resolved')}
            className={`p-2.5 rounded-xl border transition text-center cursor-pointer ${
              statusFilter === 'resolved' 
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm ring-2 ring-emerald-500' 
                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-200'
            }`}
            title="Click to filter by Resolved"
          >
            <div className="text-lg font-black">{statusCounts.resolved}</div>
            <div className={`text-[10px] font-semibold ${statusFilter === 'resolved' ? 'text-emerald-100' : 'text-emerald-700'}`}>
              {lang === 'hi' ? 'निस्तारित' : 'Resolved'}
            </div>
          </button>

          <button 
            onClick={() => handleSliceClick('in-progress')}
            className={`p-2.5 rounded-xl border transition text-center cursor-pointer ${
              statusFilter === 'in-progress' 
                ? 'bg-amber-600 text-white border-amber-600 shadow-sm ring-2 ring-amber-500' 
                : 'bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-200'
            }`}
            title="Click to filter by In Progress"
          >
            <div className="text-lg font-black">{statusCounts.inProgress}</div>
            <div className={`text-[10px] font-semibold ${statusFilter === 'in-progress' ? 'text-amber-100' : 'text-amber-700'}`}>
              {lang === 'hi' ? 'प्रक्रिया में' : 'In Progress'}
            </div>
          </button>

          <button 
            onClick={() => handleSliceClick('verified')}
            className={`p-2.5 rounded-xl border transition text-center cursor-pointer ${
              statusFilter === 'verified' 
                ? 'bg-sky-600 text-white border-sky-600 shadow-sm ring-2 ring-sky-500' 
                : 'bg-sky-50 hover:bg-sky-100 text-sky-800 border-sky-200'
            }`}
            title="Click to filter by Verified"
          >
            <div className="text-lg font-black">{statusCounts.verified}</div>
            <div className={`text-[10px] font-semibold ${statusFilter === 'verified' ? 'text-sky-100' : 'text-sky-700'}`}>
              {lang === 'hi' ? 'सत्यापित' : 'Verified'}
            </div>
          </button>

          <button 
            onClick={() => handleSliceClick('pending')}
            className={`col-span-2 sm:col-span-1 p-2.5 rounded-xl border transition text-center cursor-pointer ${
              statusFilter === 'pending' 
                ? 'bg-rose-600 text-white border-rose-600 shadow-sm ring-2 ring-rose-500' 
                : 'bg-rose-50 hover:bg-rose-100 text-rose-800 border-rose-200'
            }`}
            title="Click to filter by Pending"
          >
            <div className="text-lg font-black">{statusCounts.pending}</div>
            <div className={`text-[10px] font-semibold ${statusFilter === 'pending' ? 'text-rose-100' : 'text-rose-700'}`}>
              {lang === 'hi' ? 'लंबित' : 'Pending'}
            </div>
          </button>
        </div>

        {/* Interactive Pie Chart & Breakdown Grid */}
        <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-3 sm:p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <BarChart3 className="w-3.5 h-3.5 text-blue-600" />
              {lang === 'hi' ? 'शिकायत स्थिति पाई चार्ट वितरण' : 'Grievance Status Distribution (Pie Chart)'}
            </span>
            <span className="text-[10px] text-slate-500 italic">
              {lang === 'hi' ? 'चार्ट स्लाइस पर क्लिक करके फ़िल्टर करें' : 'Click slice to filter in real-time'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            {/* Recharts Pie Chart Container */}
            <div className="md:col-span-5 h-[210px] w-full relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <RechartsTooltip content={renderCustomTooltip} />
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    cursor="pointer"
                    onClick={(entry: any) => {
                      const targetId = entry?.id || entry?.payload?.id;
                      if (targetId) handleSliceClick(targetId);
                    }}
                  >
                    {chartData.map((entry) => {
                      const isSelected = statusFilter === entry.id;
                      return (
                        <Cell 
                          key={`cell-${entry.id}`} 
                          fill={entry.color}
                          stroke={isSelected ? '#0f172a' : '#ffffff'}
                          strokeWidth={isSelected ? 3 : 1.5}
                          style={{
                            outline: 'none',
                            transformOrigin: 'center center',
                            transition: 'all 0.2s ease'
                          }}
                        />
                      );
                    })}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              {/* Center Donut Label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-lg font-black text-slate-900 tracking-tight leading-none">
                  {statusFilter === 'all' 
                    ? `${resolutionRate}%` 
                    : (chartData.find(d => d.id === statusFilter)?.value ?? allTickets.length)}
                </span>
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider text-center max-w-[70px] mt-0.5 leading-tight">
                  {statusFilter === 'all' 
                    ? (lang === 'hi' ? 'निस्तारण दर' : 'Resolved') 
                    : (lang === 'hi' ? 'चयनित' : 'Filtered')}
                </span>
              </div>
            </div>

            {/* Interactive Status Breakdown & Efficiency Bar */}
            <div className="md:col-span-7 space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {chartData.map((item) => {
                  const percent = statusCounts.total > 0 ? Math.round((item.value / statusCounts.total) * 100) : 0;
                  const isSelected = statusFilter === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSliceClick(item.id)}
                      className={`flex items-center justify-between p-2 rounded-xl border text-left transition cursor-pointer ${
                        isSelected 
                          ? 'bg-white border-blue-500 shadow-xs ring-2 ring-blue-400' 
                          : 'bg-white/90 hover:bg-white border-slate-200/90 hover:border-slate-300'
                      }`}
                      title={`Click to filter by ${item.nameEn}`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span 
                          className="w-3 h-3 rounded-full shrink-0 shadow-2xs" 
                          style={{ backgroundColor: item.color }} 
                        />
                        <div className="truncate">
                          <div className="text-xs font-bold text-slate-800 truncate">
                            {item.name}
                          </div>
                          <div className="text-[10px] text-slate-500 font-medium">
                            {item.nameEn}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0 pl-2">
                        <span className="text-xs font-mono font-black text-slate-800">
                          {item.value}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded font-bold">
                          {percent}%
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Redressal Progress Bar */}
              <div className="bg-white p-2.5 rounded-xl border border-slate-200/80">
                <div className="flex items-center justify-between text-[11px] mb-1.5">
                  <span className="font-bold text-slate-700 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{lang === 'hi' ? 'कुल निवारण दक्षता' : 'Redressal Efficiency'}</span>
                  </span>
                  <span className="font-mono font-extrabold text-emerald-700">
                    {statusCounts.resolved + statusCounts.verified} / {statusCounts.total} ({resolutionRate}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden flex">
                  <div 
                    className="bg-emerald-500 h-full transition-all duration-500" 
                    style={{ width: `${statusCounts.total > 0 ? (statusCounts.resolved / statusCounts.total) * 100 : 0}%` }}
                    title={`Resolved: ${statusCounts.resolved}`}
                  />
                  <div 
                    className="bg-sky-500 h-full transition-all duration-500" 
                    style={{ width: `${statusCounts.total > 0 ? (statusCounts.verified / statusCounts.total) * 100 : 0}%` }}
                    title={`Verified: ${statusCounts.verified}`}
                  />
                  <div 
                    className="bg-amber-500 h-full transition-all duration-500" 
                    style={{ width: `${statusCounts.total > 0 ? (statusCounts.inProgress / statusCounts.total) * 100 : 0}%` }}
                    title={`In Progress: ${statusCounts.inProgress}`}
                  />
                  <div 
                    className="bg-rose-500 h-full transition-all duration-500" 
                    style={{ width: `${statusCounts.total > 0 ? (statusCounts.pending / statusCounts.total) * 100 : 0}%` }}
                    title={`Pending: ${statusCounts.pending}`}
                  />
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>

      {/* 2. Direct Citizen Actions: Lodge Grievance & MLA Recommendation Letter */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Lodge New Complaint Banner */}
        <div className="bg-gradient-to-br from-[#102a43] to-[#1c3d5a] text-white rounded-2xl p-4 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 mb-1">
              <span className="w-2 h-2 bg-amber-400 rounded-full animate-ping"></span>
              {lang === 'hi' ? 'जन समस्या निवारण • प्रत्यक्ष पंजीकरण' : 'Civic Grievance Desk • Instant Registration'}
            </div>
            <h3 className="text-sm font-extrabold mb-1">
              {lang === 'hi' ? 'नई शिकायत सीधे दर्ज करें' : 'Lodge New Civic Complaint Directly'}
            </h3>
            <p className="text-xs text-slate-300 mb-3 leading-relaxed">
              {lang === 'hi' 
                ? 'सड़क, बिजली, पानी या स्वास्थ्य की समस्या फोटो सहित विधायक कैंप ऑफिस भेजें।'
                : 'Submit photo, location and details directly to MLA camp office desk.'}
            </p>
          </div>
          
          <button 
            onClick={onOpenComplaintModal}
            className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md transition active:scale-98"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{lang === 'hi' ? 'समस्या दर्ज करें • फोटो व विवरण अपलोड करें' : 'File Complaint • Attach Photo & Details'}</span>
          </button>
        </div>

        {/* MLA Official Recommendation Letter Banner */}
        <div className="bg-gradient-to-br from-slate-900 to-[#0e2439] text-white rounded-2xl p-4 shadow-md border border-slate-700/60 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-1">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                <FileText className="w-4 h-4 text-emerald-400" />
                <span>{lang === 'hi' ? 'राजकीय संस्तुति पत्र सेवा' : 'Official Recommendation Letter'}</span>
              </div>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                RSN/MLA-NURPUR/2026
              </span>
            </div>
            <h3 className="text-sm font-extrabold mb-1">
              {lang === 'hi' ? 'विधायक संस्तुति पत्र जारी करें' : 'Generate MLA Recommendation Letter'}
            </h3>
            <p className="text-xs text-slate-300 mb-3 leading-relaxed">
              {lang === 'hi'
                ? 'अस्पताल इलाज (PGI/टांडा), छात्रवृत्ति, बिजली/पानी कनेक्शन व ट्रांसफार्मर हेतु 1-क्लिक में आधिकारिक पत्र पाएं।'
                : 'Generate official Vidhan Sabha recommendation letters with QR verification for medical, schooling & utilities.'}
            </p>
          </div>

          <button
            onClick={onOpenMlaLetter}
            className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md transition active:scale-98"
          >
            <FileText className="w-4 h-4 text-amber-300" />
            <span>{lang === 'hi' ? 'संस्तुति पत्र तैयार करें (A4 प्रिंट व WhatsApp)' : 'Generate MLA Letter (A4 & WhatsApp)'}</span>
          </button>
        </div>
      </div>

      {/* 3. INTERACTIVE STATUS TOGGLE BUTTON BAR (QUICK STATUS FILTERS) */}
      <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <span>{lang === 'hi' ? 'त्वरित स्थिति टॉगल बटन' : 'Interactive Status Toggle Buttons'}</span>
                <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.5 rounded-md">
                  {lang === 'hi' ? 'क्विक टॉगल' : 'Quick Toggle'}
                </span>
              </h4>
              <p className="text-[11px] text-slate-500">
                {lang === 'hi' 
                  ? 'लंबित (Pending), प्रक्रिया में (In Progress), एवं निस्तारित (Resolved) के अनुसार तुरंत टॉगल करें' 
                  : 'Toggle between Pending, In Progress, and Resolved complaints with a single tap'}
              </p>
            </div>
          </div>

          {statusFilter !== 'all' && (
            <button
              onClick={() => setStatusFilter('all')}
              className="self-start sm:self-auto text-[11px] font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg border border-slate-200 transition flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3 text-slate-500" />
              <span>{lang === 'hi' ? 'टॉगल रीसेट करें (सभी देखें)' : 'Show All Tickets'}</span>
            </button>
          )}
        </div>

        {/* The Toggle Buttons Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-2">
          {/* 1. All Tickets Toggle */}
          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            className={`p-2.5 rounded-xl border font-bold text-xs transition flex flex-col justify-between text-left cursor-pointer active:scale-97 ${
              statusFilter === 'all'
                ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-slate-800'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between w-full mb-1">
              <span className="text-[10px] uppercase tracking-wide opacity-80 flex items-center gap-1">
                <Layers className="w-3 h-3" />
                {lang === 'hi' ? 'सभी' : 'All'}
              </span>
              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full font-black ${
                statusFilter === 'all' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
              }`}>
                {statusCounts.total}
              </span>
            </div>
            <div className="text-sm font-black truncate">
              {lang === 'hi' ? 'समस्त शिकायतें' : 'All Grievances'}
            </div>
            <div className="text-[10px] opacity-75 mt-0.5">
              {statusFilter === 'all' 
                ? (lang === 'hi' ? '✓ सक्रिय चयन' : '✓ Active') 
                : (lang === 'hi' ? 'टॉगल करें' : 'Tap to filter')}
            </div>
          </button>

          {/* 2. Pending Toggle */}
          <button
            type="button"
            onClick={() => handleSliceClick('pending')}
            className={`p-2.5 rounded-xl border font-bold text-xs transition flex flex-col justify-between text-left cursor-pointer active:scale-97 ${
              statusFilter === 'pending'
                ? 'bg-gradient-to-br from-rose-600 to-rose-700 text-white border-rose-600 shadow-md ring-2 ring-rose-400'
                : 'bg-rose-50/70 hover:bg-rose-100/80 text-rose-800 border-rose-200'
            }`}
          >
            <div className="flex items-center justify-between w-full mb-1">
              <span className="text-[10px] uppercase tracking-wide opacity-90 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                Pending
              </span>
              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full font-black ${
                statusFilter === 'pending' ? 'bg-white/20 text-white' : 'bg-rose-200/80 text-rose-900'
              }`}>
                {statusCounts.pending}
              </span>
            </div>
            <div className="text-sm font-black truncate flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${statusFilter === 'pending' ? 'bg-white animate-ping' : 'bg-rose-500 animate-pulse'}`} />
              <span>{lang === 'hi' ? 'लंबित' : 'Pending'}</span>
            </div>
            <div className="text-[10px] opacity-75 mt-0.5">
              {statusFilter === 'pending' 
                ? (lang === 'hi' ? '✓ सक्रिय टॉगल' : '✓ Active Filter') 
                : (lang === 'hi' ? 'कार्रवाई हेतु प्रतीक्षित' : 'Awaiting Review')}
            </div>
          </button>

          {/* 3. In Progress Toggle */}
          <button
            type="button"
            onClick={() => handleSliceClick('in-progress')}
            className={`p-2.5 rounded-xl border font-bold text-xs transition flex flex-col justify-between text-left cursor-pointer active:scale-97 ${
              statusFilter === 'in-progress'
                ? 'bg-gradient-to-br from-amber-500 to-amber-600 text-white border-amber-600 shadow-md ring-2 ring-amber-400'
                : 'bg-amber-50/70 hover:bg-amber-100/80 text-amber-800 border-amber-200'
            }`}
          >
            <div className="flex items-center justify-between w-full mb-1">
              <span className="text-[10px] uppercase tracking-wide opacity-90 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                In Progress
              </span>
              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full font-black ${
                statusFilter === 'in-progress' ? 'bg-white/20 text-white' : 'bg-amber-200/80 text-amber-900'
              }`}>
                {statusCounts.inProgress}
              </span>
            </div>
            <div className="text-sm font-black truncate flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${statusFilter === 'in-progress' ? 'bg-white animate-spin' : 'bg-amber-500'}`} />
              <span>{lang === 'hi' ? 'प्रक्रिया में' : 'In Progress'}</span>
            </div>
            <div className="text-[10px] opacity-75 mt-0.5">
              {statusFilter === 'in-progress' 
                ? (lang === 'hi' ? '✓ सक्रिय टॉगल' : '✓ Active Filter') 
                : (lang === 'hi' ? 'फील्ड कार्य चालू' : 'Under Action')}
            </div>
          </button>

          {/* 4. Resolved Toggle */}
          <button
            type="button"
            onClick={() => handleSliceClick('resolved')}
            className={`p-2.5 rounded-xl border font-bold text-xs transition flex flex-col justify-between text-left cursor-pointer active:scale-97 ${
              statusFilter === 'resolved'
                ? 'bg-gradient-to-br from-emerald-600 to-emerald-700 text-white border-emerald-600 shadow-md ring-2 ring-emerald-400'
                : 'bg-emerald-50/70 hover:bg-emerald-100/80 text-emerald-800 border-emerald-200'
            }`}
          >
            <div className="flex items-center justify-between w-full mb-1">
              <span className="text-[10px] uppercase tracking-wide opacity-90 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Resolved
              </span>
              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full font-black ${
                statusFilter === 'resolved' ? 'bg-white/20 text-white' : 'bg-emerald-200/80 text-emerald-900'
              }`}>
                {statusCounts.resolved}
              </span>
            </div>
            <div className="text-sm font-black truncate flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${statusFilter === 'resolved' ? 'bg-white' : 'bg-emerald-500'}`} />
              <span>{lang === 'hi' ? 'निस्तारित' : 'Resolved'}</span>
            </div>
            <div className="text-[10px] opacity-75 mt-0.5">
              {statusFilter === 'resolved' 
                ? (lang === 'hi' ? '✓ सक्रिय टॉगल' : '✓ Active Filter') 
                : (lang === 'hi' ? 'समस्या समाधान पूर्ण' : 'Fully Solved')}
            </div>
          </button>

          {/* 5. Verified Toggle */}
          <button
            type="button"
            onClick={() => handleSliceClick('verified')}
            className={`col-span-2 sm:col-span-4 lg:col-span-1 p-2.5 rounded-xl border font-bold text-xs transition flex flex-col justify-between text-left cursor-pointer active:scale-97 ${
              statusFilter === 'verified'
                ? 'bg-gradient-to-br from-sky-600 to-sky-700 text-white border-sky-600 shadow-md ring-2 ring-sky-400'
                : 'bg-sky-50/70 hover:bg-sky-100/80 text-sky-800 border-sky-200'
            }`}
          >
            <div className="flex items-center justify-between w-full mb-1">
              <span className="text-[10px] uppercase tracking-wide opacity-90 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                Verified
              </span>
              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full font-black ${
                statusFilter === 'verified' ? 'bg-white/20 text-white' : 'bg-sky-200/80 text-sky-900'
              }`}>
                {statusCounts.verified}
              </span>
            </div>
            <div className="text-sm font-black truncate flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${statusFilter === 'verified' ? 'bg-white' : 'bg-sky-500'}`} />
              <span>{lang === 'hi' ? 'सत्यापित' : 'Verified'}</span>
            </div>
            <div className="text-[10px] opacity-75 mt-0.5">
              {statusFilter === 'verified' 
                ? (lang === 'hi' ? '✓ सक्रिय टॉगल' : '✓ Active Filter') 
                : (lang === 'hi' ? 'नागरिक द्वारा प्रमाणित' : 'Citizen Verified')}
            </div>
          </button>
        </div>

        {/* Active Toggle Banner with quick one-click action */}
        {statusFilter !== 'all' && (
          <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              <span className="text-slate-600">
                {lang === 'hi' ? 'सक्रिय टॉगल स्थिति:' : 'Active Status Filter:'}{' '}
                <strong className="text-slate-900 capitalize">
                  {statusFilter === 'pending' 
                    ? (lang === 'hi' ? 'लंबित (Pending)' : 'Pending')
                    : statusFilter === 'in-progress'
                      ? (lang === 'hi' ? 'प्रक्रिया में (In Progress)' : 'In Progress')
                      : statusFilter === 'resolved'
                        ? (lang === 'hi' ? 'निस्तारित (Resolved)' : 'Resolved')
                        : (lang === 'hi' ? 'सत्यापित (Verified)' : 'Verified')}
                </strong>
                {' • '}
                <span className="font-semibold text-blue-700">
                  {filteredTickets.length} {lang === 'hi' ? 'शिकायतें प्रदर्शित' : 'ticket(s) showing'}
                </span>
              </span>
            </div>

            <button
              onClick={() => setStatusFilter('all')}
              className="text-[11px] font-bold text-blue-600 hover:text-blue-800 underline cursor-pointer"
            >
              {lang === 'hi' ? 'सभी दिखाएं' : 'Show All'}
            </button>
          </div>
        )}
      </div>

      {/* 4. REAL-TIME SEARCH & FILTER BAR (BY STATUS OR WARD NUMBER) */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
        
        {/* Header Label */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-blue-600" />
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
              {lang === 'hi' ? 'रियल-टाइम शिकायत खोज व फिल्टर' : 'Real-Time Grievance Search & Filters'}
            </h4>
          </div>
          {hasActiveFilters && (
            <button
              onClick={resetAllFilters}
              className="text-[11px] text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1 bg-rose-50 px-2 py-0.5 rounded-lg border border-rose-200 transition"
            >
              <RotateCcw className="w-3 h-3" />
              <span>{lang === 'hi' ? 'फ़िल्टर हटाएं' : 'Reset'}</span>
            </button>
          )}
        </div>

        {/* Real-Time Search Bar Input */}
        <div className="relative flex items-center">
          <div className="absolute left-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>

          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              lang === 'hi' 
                ? 'स्थिति (Resolved/In-Progress) या वार्ड नंबर (उदा: Ward 12, 5, 8, #NR-8831) से खोजें...'
                : 'Filter by Status (Resolved/In-Progress) or Ward (e.g. Ward 12, 5, 8, #NR-8831)...'
            }
            className="w-full text-xs pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-800 placeholder-slate-400 transition"
          />

          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-200/60 transition"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Quick Filter Controls: Status Pills & Ward Dropdown */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-1 border-t border-slate-100 text-xs">
          
          {/* Status Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-500 mr-1 flex items-center gap-1">
              <SlidersHorizontal className="w-3 h-3" />
              {lang === 'hi' ? 'स्थिति:' : 'Status:'}
            </span>

            <button
              onClick={() => setStatusFilter('all')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1 ${
                statusFilter === 'all'
                  ? 'bg-[#102a43] text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              <span>{lang === 'hi' ? 'सभी' : 'All'}</span>
              <span className="text-[10px] opacity-80">({statusCounts.total})</span>
            </button>

            <button
              onClick={() => setStatusFilter('in-progress')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1 ${
                statusFilter === 'in-progress'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
              <span>{lang === 'hi' ? 'प्रक्रिया में' : 'In Progress'}</span>
              <span className="text-[10px]">({statusCounts.inProgress})</span>
            </button>

            <button
              onClick={() => setStatusFilter('resolved')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1 ${
                statusFilter === 'resolved'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200'
              }`}
            >
              <Check className="w-3 h-3 text-emerald-600" />
              <span>{lang === 'hi' ? 'निस्तारित' : 'Resolved'}</span>
              <span className="text-[10px]">({statusCounts.resolved})</span>
            </button>

            <button
              onClick={() => setStatusFilter('verified')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1 ${
                statusFilter === 'verified'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200'
              }`}
            >
              <ShieldCheck className="w-3 h-3 text-sky-600" />
              <span>{lang === 'hi' ? 'सत्यापित' : 'Verified'}</span>
              <span className="text-[10px]">({statusCounts.verified})</span>
            </button>

            {statusCounts.pending > 0 && (
              <button
                onClick={() => setStatusFilter(statusFilter === 'pending' ? 'all' : 'pending')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1 ${
                  statusFilter === 'pending'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200'
                }`}
              >
                <AlertCircle className="w-3 h-3 text-rose-500" />
                <span>{lang === 'hi' ? 'लंबित' : 'Pending'}</span>
                <span className="text-[10px]">({statusCounts.pending})</span>
              </button>
            )}
          </div>

          {/* Ward Number Quick Selector */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
              <Building2 className="w-3 h-3" />
              {lang === 'hi' ? 'वार्ड सं.:' : 'Ward:'}
            </span>

            <select
              value={wardFilter === 'all' ? 'all' : wardFilter}
              onChange={(e) => {
                const val = e.target.value;
                setWardFilter(val === 'all' ? 'all' : Number(val));
              }}
              className="bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold rounded-lg px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">{lang === 'hi' ? 'सभी 24 वार्ड' : 'All Wards'}</option>
              {availableWards.map(w => (
                <option key={w} value={w}>
                  {lang === 'hi' ? `वार्ड सं. ${w}` : `Ward ${w}`}
                </option>
              ))}
            </select>
          </div>

        </div>

        {/* Real-time Result Summary & Quick Tag Suggestions */}
        <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 pt-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
              {filteredTickets.length} {lang === 'hi' ? 'शिकायत टिकट मिले' : 'Tickets Found'}
            </span>
            {hasActiveFilters && (
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                {lang === 'hi' ? 'रियल-टाइम परिणाम सक्रिय' : 'Filtered in Real-Time'}
              </span>
            )}
          </div>

          {/* Quick-Click Search Hints */}
          <div className="flex items-center gap-1 text-[10px] mt-1 sm:mt-0">
            <span className="text-slate-400">{lang === 'hi' ? 'सुझाव:' : 'Try:'}</span>
            <button
              onClick={() => setSearchQuery('वार्ड 12')}
              className="px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium"
            >
              वार्ड 12
            </button>
            <button
              onClick={() => setSearchQuery('वार्ड 8')}
              className="px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium"
            >
              वार्ड 8
            </button>
            <button
              onClick={() => setSearchQuery('Resolved')}
              className="px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-emerald-700 font-medium"
            >
              Resolved
            </button>
            <button
              onClick={() => setSearchQuery('In-Progress')}
              className="px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-amber-700 font-medium"
            >
              In-Progress
            </button>
          </div>
        </div>

      </div>

      {/* 4. REAL-TIME FILTERED TICKETS LIST & TIMELINE SPLIT / DETAIL */}
      {filteredTickets.length > 0 ? (
        <div className="space-y-4">
          
          {/* Scrollable Horizontal or Grid Ticket Selector */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span>{lang === 'hi' ? 'प्राप्त शिकायतें (क्लिक कर विवरण देखें):' : 'Matching Tickets (Click to inspect):'}</span>
              <span className="text-[11px] text-slate-400 font-normal">
                {lang === 'hi' ? 'चयनित: ' : 'Active: '}
                <strong className="text-slate-700 font-mono">{activeTicket?.token}</strong>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {filteredTickets.map((t) => {
                const isSelected = activeTicket?.token === t.token;
                return (
                  <div
                    key={t.token}
                    onClick={() => setSelectedToken(t.token)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer relative text-left ${
                      isSelected
                        ? 'bg-blue-50/70 border-blue-400 shadow-xs ring-1 ring-blue-400'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/80 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1.5 mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-[11px] font-black bg-slate-100 text-slate-800 px-2 py-0.5 rounded border border-slate-200">
                          {t.token}
                        </span>
                        <span className="text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200 px-1.5 py-0.5 rounded">
                          वार्ड {t.wardNo}
                        </span>
                      </div>

                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        t.status === 'resolved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : t.status === 'verified'
                            ? 'bg-sky-100 text-sky-800'
                            : t.status === 'pending'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                      }`}>
                        {t.status === 'resolved' 
                          ? (lang === 'hi' ? 'निस्तारित ✓' : 'Resolved') 
                          : t.status === 'verified'
                            ? (lang === 'hi' ? 'सत्यापित ✓' : 'Verified')
                            : t.status === 'pending'
                              ? (lang === 'hi' ? 'लंबित' : 'Pending')
                              : (lang === 'hi' ? 'प्रक्रिया में' : 'In Progress')}
                      </span>
                    </div>

                    <h5 className="text-xs font-bold text-slate-900 line-clamp-1 leading-snug">
                      {t.title}
                    </h5>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 pt-1.5 border-t border-slate-100">
                      <span className="truncate max-w-[170px]">{t.citizenName}</span>
                      <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                        {t.submittedDate.split(',')[0]}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Ticket Detailed Inspection Card with Stepped Timeline */}
          {activeTicket && (
            <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-slate-200 space-y-4 animate-in fade-in duration-150">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-mono bg-slate-900 text-white px-2.5 py-1 rounded-lg font-black tracking-wide">
                    {activeTicket.token}
                  </span>
                  <span className="text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200 px-2 py-0.5 rounded-lg flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-amber-700" />
                    <span>वार्ड सं. {activeTicket.wardNo}</span>
                  </span>
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-lg flex items-center gap-1 ${
                    activeTicket.status === 'resolved' 
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                      : activeTicket.status === 'verified'
                        ? 'bg-sky-100 text-sky-800 border border-sky-200'
                        : activeTicket.status === 'pending'
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                  }`}>
                    {activeTicket.status === 'resolved' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                    {activeTicket.status === 'in-progress' && <Clock className="w-3.5 h-3.5 text-amber-600 animate-spin" />}
                    {activeTicket.status === 'verified' && <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />}
                    {activeTicket.status === 'pending' && <AlertCircle className="w-3.5 h-3.5 text-rose-600" />}
                    <span>
                      {activeTicket.status === 'resolved' 
                        ? (lang === 'hi' ? 'निस्तारित (Resolved)' : 'Resolved') 
                        : activeTicket.status === 'verified'
                          ? (lang === 'hi' ? 'कार्य सत्यापित (Verified)' : 'Verified')
                          : activeTicket.status === 'pending'
                            ? (lang === 'hi' ? 'लंबित संज्ञान (Pending)' : 'Pending')
                            : (lang === 'hi' ? 'कार्य प्रक्रियाधीन (In Progress)' : 'In Progress')}
                    </span>
                  </span>
                </div>

                <button 
                  onClick={() => handleCopy(activeTicket.token)}
                  className="self-start sm:self-auto flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 transition font-semibold"
                  title="Copy Token to clipboard"
                >
                  {copiedToken === activeTicket.token ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700 font-bold">{lang === 'hi' ? 'टोकन कॉपी हुआ!' : 'Copied!'}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-500" />
                      <span>{lang === 'hi' ? 'टोकन कॉपी करें' : 'Copy Token'}</span>
                    </>
                  )}
                </button>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  {activeTicket.category}
                </span>
                <h4 className="text-sm sm:text-base font-extrabold text-slate-900 leading-snug mt-1.5">
                  {activeTicket.title}
                </h4>
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-2">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{activeTicket.location}</span>
                  </span>
                  <span>•</span>
                  <span>आवेदक: <strong className="text-slate-700">{activeTicket.citizenName}</strong></span>
                  <span>•</span>
                  <span>पंजीकरण: <strong className="text-slate-700">{activeTicket.submittedDate}</strong></span>
                </div>
              </div>

              {/* Stepped Live Timeline */}
              <div className="pt-2">
                <h5 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-blue-600" />
                  <span>{lang === 'hi' ? 'कार्रवाई प्रगति टाइमलाइन' : 'Action Timeline & Progress'}</span>
                </h5>

                <div className="relative pl-6 space-y-4 text-xs before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-emerald-500">
                  {activeTicket.timeline.map((step, idx) => {
                    if (step.status === 'done') {
                      return (
                        <div key={idx} className="relative">
                          <span className="absolute -left-6 top-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white shadow-xs"></span>
                          <div className="font-bold text-slate-800 text-xs">{step.title}</div>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            {step.timestamp} • {step.description}
                          </p>
                        </div>
                      );
                    }

                    if (step.status === 'current') {
                      return (
                        <div key={idx} className="relative bg-amber-50/80 p-3 rounded-xl border border-amber-200 -ml-2 shadow-xs">
                          <span className="absolute -left-4 top-3.5 w-3 h-3 bg-amber-500 rounded-full border-2 border-white animate-pulse"></span>
                          <div className="font-bold text-amber-900 text-xs flex justify-between items-center">
                            <span>{step.title}</span>
                            <span className="text-[10px] bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded font-black">
                              वर्तमान चरण
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-700 mt-1">
                            {step.timestamp} • {step.description}
                          </p>
                        </div>
                      );
                    }

                    return (
                      <div key={idx} className="relative">
                        <span className="absolute -left-6 top-1 w-3 h-3 bg-slate-300 rounded-full border-2 border-white"></span>
                        <div className="font-bold text-slate-400 text-xs">{step.title}</div>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {step.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* WhatsApp Alert Subscription Box */}
              <div className="p-3 bg-emerald-50/90 rounded-xl border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
                <div>
                  <span className="text-emerald-900 font-bold text-xs flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                    {lang === 'hi' ? 'व्हाट्सएप लाइव निवारण अपडेट्स' : 'WhatsApp Live Redressal Alerts'}
                  </span>
                  <p className="text-[11px] text-emerald-800 mt-0.5">
                    {lang === 'hi' 
                      ? 'प्रत्येक नए कदम पर आपके नंबर पर तत्काल संदेश प्राप्त होगा।' 
                      : 'Instant SMS and WhatsApp updates at each milestone.'}
                  </p>
                </div>
                <button
                  onClick={() => toggleWhatsAppSub(activeTicket.token)}
                  className={`text-xs px-3 py-1.5 rounded-lg font-bold transition shrink-0 ${
                    subscribedTickets[activeTicket.token]
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-white text-emerald-800 border border-emerald-300 hover:bg-emerald-100'
                  }`}
                >
                  {subscribedTickets[activeTicket.token] 
                    ? (lang === 'hi' ? 'सब्सक्राइब है ✓' : 'Subscribed ✓') 
                    : (lang === 'hi' ? 'अलर्ट्स चालू करें' : 'Subscribe')}
                </button>
              </div>

            </div>
          )}

        </div>
      ) : (
        /* Empty State when no tickets match */
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-xs text-center space-y-4">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto border border-amber-200">
            <Search className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-extrabold text-slate-900">
              {lang === 'hi' ? 'कोई शिकायत टिकट नहीं मिला' : 'No Matching Grievance Tickets Found'}
            </h4>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              {lang === 'hi'
                ? `आपके द्वारा दिए गए खोज शब्द "${searchQuery}" या चयनित फिल्टर (स्थिति/वार्ड) के अनुसार कोई रिकॉर्ड नहीं मिला।`
                : `No tickets match "${searchQuery}" or the active status/ward filter.`}
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 pt-1">
            <button
              onClick={resetAllFilters}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
            >
              {lang === 'hi' ? 'सभी फिल्टर हटाएं' : 'Clear All Filters'}
            </button>
            <button
              onClick={onOpenComplaintModal}
              className="px-4 py-2 bg-[#102a43] hover:bg-[#0b1b2b] text-white text-xs font-bold rounded-xl transition"
            >
              {lang === 'hi' ? 'नई शिकायत दर्ज करें' : 'Lodge New Complaint'}
            </button>
          </div>
        </div>
      )}

      {/* 5. Emergency Helplines & Camp Office Desk */}
      <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200">
        <h4 className="text-xs font-extrabold text-slate-900 mb-3 flex items-center gap-1.5">
          <PhoneCall className="w-3.5 h-3.5 text-amber-500" />
          {lang === 'hi' ? 'हेल्पलाइन व कैंप कार्यालय संपर्क' : 'Camp Office Helplines & Emergency'}
        </h4>
        <div className="space-y-2 text-xs">
          <a 
            href="tel:01893222111" 
            className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition"
          >
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-700">
                <PhoneCall className="w-3.5 h-3.5" />
              </span>
              <span className="font-bold text-slate-800">
                {lang === 'hi' ? 'विधायक कैंप ऑफिस हेल्पलाइन' : 'MLA Camp Office Helpline'}
              </span>
            </div>
            <span className="text-[11px] text-indigo-700 font-bold font-mono">01893-222111</span>
          </a>

          <a 
            href="tel:1077" 
            className="flex items-center justify-between p-2.5 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 transition"
          >
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-red-100 text-red-700">
                <AlertCircle className="w-3.5 h-3.5" />
              </span>
              <span className="font-bold text-red-900">
                {lang === 'hi' ? 'आपदा एवं बाढ़ नियंत्रण कक्ष (24x7)' : 'Disaster & Emergency Control'}
              </span>
            </div>
            <span className="text-[11px] text-red-700 font-bold font-mono">टोल फ्री 1077</span>
          </a>

          <a 
            href="tel:1912" 
            className="flex items-center justify-between p-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 transition"
          >
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-amber-100 text-amber-700">
                <Radio className="w-3.5 h-3.5" />
              </span>
              <span className="font-bold text-amber-900">
                {lang === 'hi' ? 'विद्युत आपातकालीन शिकायत बोर्ड' : 'HPSEB Power Breakdown'}
              </span>
            </div>
            <span className="text-[11px] text-amber-700 font-bold font-mono">1912</span>
          </a>
        </div>
      </div>

    </section>
  );
};
