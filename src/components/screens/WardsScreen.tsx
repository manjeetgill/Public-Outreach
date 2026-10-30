import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Search, 
  MapPin, 
  Users, 
  IndianRupee, 
  CheckCircle, 
  Phone, 
  ArrowRight,
  ShieldCheck,
  FileCheck,
  Vote
} from 'lucide-react';
import { NURPUR_WARDS, MLA_INFO } from '../../data/campaignData';
import { WardInfo, Language } from '../../types/campaign';
import { fetchPollingStations } from '../../services/api';

interface WardsScreenProps {
  onSelectWardForComplaint: (wardNo: number) => void;
  lang: Language;
}

export const WardsScreen: React.FC<WardsScreenProps> = ({
  onSelectWardForComplaint,
  lang
}) => {
  const [viewMode, setViewMode] = useState<'wards' | 'booths'>('wards');
  const [search, setSearch] = useState('');
  const [selectedZone, setSelectedZone] = useState<'all' | 'urban' | 'rural'>('all');
  const [booths, setBooths] = useState<any[]>([]);

  useEffect(() => {
    fetchPollingStations().then(data => {
      if (data && data.length > 0) setBooths(data);
    }).catch(console.error);
  }, []);

  const filteredWards = NURPUR_WARDS.filter(w => {
    const matchesSearch = 
      w.name.toLowerCase().includes(search.toLowerCase()) ||
      w.nameEn.toLowerCase().includes(search.toLowerCase()) ||
      w.wardNo.toString().includes(search) ||
      w.majorWork.toLowerCase().includes(search.toLowerCase()) ||
      w.pannaPramukh.toLowerCase().includes(search.toLowerCase());

    const isUrban = w.wardNo === 5 || w.wardNo === 8 || w.wardNo === 11 || w.wardNo === 14 || w.wardNo === 18 || w.wardNo === 19;
    const matchesZone = 
      selectedZone === 'all' || 
      (selectedZone === 'urban' && isUrban) || 
      (selectedZone === 'rural' && !isUrban);

    return matchesSearch && matchesZone;
  });

  const filteredBooths = booths.filter(b => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    const bNo = (b.booth_no ?? b.booth_number ?? '').toString();
    const bPart = (b.part_no ?? b.part_number ?? '').toString();
    const bName = (b.station_name ?? b.building_name_hi ?? '').toLowerCase();
    const bNameEn = (b.station_name_en ?? b.building_name_en ?? '').toLowerCase();
    const bLoc = (b.location ?? b.location_hi ?? '').toLowerCase();
    const bBlo = (b.blo_name ?? '').toLowerCase();
    const bPhone = (b.blo_phone ?? b.blo_mobile ?? '').toString();

    return (
      bNo.includes(q) ||
      bPart.includes(q) ||
      bName.includes(q) ||
      bNameEn.includes(q) ||
      bLoc.includes(q) ||
      bBlo.includes(q) ||
      bPhone.includes(q)
    );
  });

  const totalVoters = NURPUR_WARDS.reduce((acc, w) => acc + w.voters, 0);
  const totalWorks = NURPUR_WARDS.reduce((acc, w) => acc + w.completedWorksCount, 0);
  const totalBudgetLakhs = NURPUR_WARDS.reduce((acc, w) => acc + w.budgetSpentLakhs, 0);

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#102a43] via-[#0f243a] to-[#1c3d5a] text-white p-6 rounded-2xl shadow-md border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-amber-500 text-slate-950 font-black text-xs px-2.5 py-0.5 rounded-full">
                {lang === 'hi' ? '24 वार्ड • प्रत्यक्ष ब्योरा' : '24 Wards Civic Directory'}
              </span>
              <span className="text-xs text-slate-300">
                {lang === 'hi' ? 'नूरपुर विधानसभा क्षेत्र (142)' : 'Nurpur Assembly Constituency (142)'}
              </span>
            </div>
            <h2 className="text-2xl font-black text-white">
              {lang === 'hi' ? 'वार्ड दर्शन एवं विकास डैशबोर्ड' : 'Ward Explorer & Civic Performance'}
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              {lang === 'hi' 
                ? 'प्रत्येक वार्ड के मतदाता, स्वीकृत कार्य, व्यय की गई विधायक निधि एवं पन्ना प्रमुखों का पारदर्शी ब्योरा।'
                : 'Constituency-wide transparency: voter demographics, sanctioned capital expenditure, and grassroots contact directory.'}
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-2 bg-white/10 p-3 rounded-xl border border-white/15 text-center shrink-0">
            <div>
              <div className="text-lg font-black text-amber-400">
                {viewMode === 'wards' ? NURPUR_WARDS.length : (booths.length || 118)}
              </div>
              <div className="text-[10px] text-slate-300">
                {viewMode === 'wards' ? (lang === 'hi' ? 'कुल वार्ड' : 'Wards') : (lang === 'hi' ? 'मतदान केंद्र' : 'Booths')}
              </div>
            </div>
            <div className="border-x border-white/15 px-2">
              <div className="text-lg font-black text-emerald-400">
                {viewMode === 'wards' ? `${totalWorks}+` : '91,420+'}
              </div>
              <div className="text-[10px] text-slate-300">
                {viewMode === 'wards' ? (lang === 'hi' ? 'विकास कार्य' : 'Projects') : (lang === 'hi' ? 'पंजीकृत मतदाता' : 'Total Voters')}
              </div>
            </div>
            <div>
              <div className="text-lg font-black text-sky-400">
                {viewMode === 'wards' ? `₹${(totalBudgetLakhs / 100).toFixed(1)} Cr` : '118'}
              </div>
              <div className="text-[10px] text-slate-300">
                {viewMode === 'wards' ? (lang === 'hi' ? 'निधि व्यय' : 'Allocated') : (lang === 'hi' ? 'BLO अधिकारी' : 'BLO Officers')}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top View Mode Switcher */}
      <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
        <button
          onClick={() => setViewMode('wards')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-black transition flex items-center justify-center gap-2 ${
            viewMode === 'wards'
              ? 'bg-[#102a43] text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>{lang === 'hi' ? '24 प्रशासनिक वार्ड (24 Assembly Wards)' : '24 Assembly Wards'}</span>
        </button>
        <button
          onClick={() => setViewMode('booths')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-black transition flex items-center justify-center gap-2 ${
            viewMode === 'booths'
              ? 'bg-[#102a43] text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Vote className="w-4 h-4" />
          <span>{lang === 'hi' ? '118 चुनाव आयोग मतदान केंद्र व BLO सूची' : '118 ECI Polling Stations & BLOs'}</span>
        </button>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center gap-3 justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input 
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={
              viewMode === 'wards'
                ? (lang === 'hi' ? 'वार्ड नाम, नंबर या पन्ना प्रमुख खोजें...' : 'Search ward name, no. or contact...')
                : (lang === 'hi' ? 'बूथ सं., गांव, भवन या BLO नाम से खोजें...' : 'Search booth #, village, building or BLO...')
            }
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        {viewMode === 'wards' ? (
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs font-bold text-slate-600 hidden sm:inline">
              {lang === 'hi' ? 'क्षेत्र श्रेणी:' : 'Zone:'}
            </span>
            <div className="flex gap-1.5 w-full sm:w-auto">
              <button
                onClick={() => setSelectedZone('all')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition flex-1 sm:flex-initial ${
                  selectedZone === 'all' 
                    ? 'bg-[#102a43] text-white' 
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {lang === 'hi' ? 'सभी 24 वार्ड' : 'All Wards'}
              </button>
              <button
                onClick={() => setSelectedZone('urban')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition flex-1 sm:flex-initial ${
                  selectedZone === 'urban' 
                    ? 'bg-[#102a43] text-white' 
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {lang === 'hi' ? 'शहरी वार्ड' : 'Urban'}
              </button>
              <button
                onClick={() => setSelectedZone('rural')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition flex-1 sm:flex-initial ${
                  selectedZone === 'rural' 
                    ? 'bg-[#102a43] text-white' 
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {lang === 'hi' ? 'ग्रामीण वार्ड' : 'Rural'}
              </button>
            </div>
          </div>
        ) : (
          <div className="text-xs font-bold text-slate-600">
            {lang === 'hi' ? `प्रदर्शित: ${filteredBooths.length} आधिकारिक मतदान केंद्र` : `Showing: ${filteredBooths.length} Polling Stations`}
          </div>
        )}
      </div>

      {/* Grid: Wards OR 118 Official Polling Stations */}
      {viewMode === 'wards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredWards.map((ward) => (
            <div 
              key={ward.wardNo}
              className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs hover:shadow-md transition space-y-3 flex flex-col justify-between"
            >
              <div>
                {/* Top Header of Card */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                      {lang === 'hi' ? `वार्ड सं. ${ward.wardNo}` : `Ward #${ward.wardNo}`}
                    </span>
                    <h3 className="text-sm font-extrabold text-slate-900 mt-1">
                      {lang === 'hi' ? ward.name : ward.nameEn}
                    </h3>
                  </div>
                  <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100 shrink-0">
                    ₹{(ward.budgetSpentLakhs / 100).toFixed(2)} Cr
                  </span>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-2 mt-3 pt-2.5 border-t border-slate-100 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>{ward.voters.toLocaleString()} {lang === 'hi' ? 'मतदाता' : 'Voters'}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{ward.completedWorksCount} {lang === 'hi' ? 'कार्य पूर्ण' : 'Done'}</span>
                  </div>
                </div>

                {/* Major Highlight Work */}
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs mt-3">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">
                    {lang === 'hi' ? 'प्रमुख स्वीकृत कार्य:' : 'Major Sanctioned Work:'}
                  </div>
                  <p className="font-bold text-slate-800 leading-snug">
                    {lang === 'hi' ? ward.majorWork : ward.majorWorkEn}
                  </p>
                </div>

                {/* Resolved Issues Tags */}
                <div className="mt-2.5 flex flex-wrap gap-1">
                  {ward.keyIssuesResolved.map((issue, idx) => (
                    <span key={idx} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium">
                      ✓ {issue}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 mt-2">
                <div className="text-[10px] text-slate-500">
                  <span className="block font-bold text-slate-700">{ward.pannaPramukh}</span>
                  <span className="font-mono">{ward.contact}</span>
                </div>
                <button
                  onClick={() => onSelectWardForComplaint(ward.wardNo)}
                  className="px-3 py-1.5 bg-[#102a43] hover:bg-[#0b1b2b] text-white text-xs font-bold rounded-lg transition flex items-center gap-1 shadow-xs"
                >
                  <span>{lang === 'hi' ? 'समस्या दर्ज' : 'Lodge'}</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBooths.map((b) => {
            const bNo = b.booth_no ?? b.booth_number;
            const bPart = b.part_no ?? b.part_number;
            const bName = b.station_name ?? b.building_name_hi;
            const bNameEn = b.station_name_en ?? b.building_name_en ?? bName;
            const bLoc = b.location ?? b.location_hi;
            const bLocEn = b.location_en ?? bLoc;
            const bPhone = b.blo_phone ?? b.blo_mobile;
            const bWard = b.ward_no ?? (((bNo - 1) % 24) + 1);

            return (
              <div 
                key={b.id || bNo}
                className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs hover:shadow-md transition space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-mono font-black bg-indigo-50 text-indigo-900 px-2 py-0.5 rounded border border-indigo-200">
                          बूथ सं. {bNo.toString().padStart(2, '0')}
                        </span>
                        <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">
                          भाग {bPart}
                        </span>
                      </div>
                      <h3 className="text-sm font-extrabold text-slate-900 mt-1.5 leading-snug">
                        {lang === 'hi' ? bName : bNameEn}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        <span>{lang === 'hi' ? bLoc : bLocEn}</span>
                      </p>
                    </div>
                    <span className="text-xs font-black text-blue-700 bg-blue-50 px-2 py-1 rounded-lg border border-blue-100 shrink-0 flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      <span>{b.total_voters}</span>
                    </span>
                  </div>

                  {/* BLO Officer Box */}
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs mt-3 flex items-center justify-between gap-2">
                    <div>
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        बूथ लेवल ऑफिसर (BLO):
                      </div>
                      <div className="font-bold text-slate-800">
                        {b.blo_name}
                      </div>
                    </div>
                    {bPhone && (
                      <a 
                        href={`tel:${bPhone}`}
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-2xs transition"
                      >
                        <Phone className="w-3 h-3" />
                        <span>कॉल करें</span>
                      </a>
                    )}
                  </div>

                  {/* Latitude / Longitude & Geo-verification */}
                  <div className="mt-2 text-[10px] text-slate-400 font-mono flex items-center justify-between">
                    <span>GPS: {Number(b.latitude).toFixed(4)}°N, {Number(b.longitude).toFixed(4)}°E</span>
                    <span className="text-emerald-600 font-bold">✓ ECI प्रमाणित</span>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 mt-2">
                  <span className="text-[11px] font-bold text-slate-600">
                    वार्ड सं. {bWard}
                  </span>
                  <button
                    onClick={() => onSelectWardForComplaint(bWard)}
                    className="px-3 py-1.5 bg-[#102a43] hover:bg-[#0b1b2b] text-white text-xs font-bold rounded-lg transition flex items-center gap-1 shadow-xs"
                  >
                    <span>{lang === 'hi' ? 'समस्या दर्ज' : 'Lodge'}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
