import React, { useState } from 'react';
import { 
  HeartHandshake, 
  Plus, 
  Search, 
  Download, 
  Users, 
  Phone, 
  Calendar, 
  CheckCircle2, 
  Award, 
  Share2, 
  X, 
  CreditCard,
  Building,
  GraduationCap,
  Sparkles,
  Gift,
  AlertCircle
} from 'lucide-react';
import { 
  INITIAL_NIJAAT_GRANTS, 
  TRUST_FUND_TOTAL_METRICS, 
  NijaatGrantRecord, 
  GrantType, 
  formatIndianRupees, 
  getGrantTypeBadge,
  generateAnniversaryGreetingMessage 
} from '../../services/trustFundService';
import { Language } from '../../types/campaign';

interface NijaatTrustFundLedgerProps {
  lang: Language;
  onClose?: () => void;
}

export const NijaatTrustFundLedger: React.FC<NijaatTrustFundLedgerProps> = ({ lang, onClose }) => {
  const [grants, setGrants] = useState<NijaatGrantRecord[]>(INITIAL_NIJAAT_GRANTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<GrantType | 'ALL'>('ALL');
  
  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [greetingModalGrant, setGreetingModalGrant] = useState<NijaatGrantRecord | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New grant form state
  const [formData, setFormData] = useState({
    recipientName: '',
    guardianName: '',
    boothNo: 41,
    wardNo: 7,
    village: '',
    mobile: '',
    grantType: 'DAUGHTER_MARRIAGE' as GrantType,
    amountRupees: 51000,
    chequeOrTxnRef: '',
    paymentMode: 'CHEQUE_HANDOVER' as NijaatGrantRecord['paymentMode'],
    extendedFamilyVotersCount: 12,
    notes: '',
    karyakartaWitnessName: ''
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const filteredGrants = grants.filter(g => {
    const matchesType = selectedType === 'ALL' || g.grantType === selectedType;
    const matchesSearch = 
      g.recipientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.guardianName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.village.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.mobile.includes(searchQuery) ||
      g.chequeOrTxnRef.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `बूथ ${g.boothNo}`.includes(searchQuery);
    return matchesType && matchesSearch;
  });

  const handleCreateGrant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.recipientName || !formData.mobile) {
      showToast('कृपया लाभार्थी का नाम और मोबाइल नंबर भरें');
      return;
    }

    const newGrant: NijaatGrantRecord = {
      id: `NJT-2026-${String(Math.floor(850 + Math.random() * 100))}`,
      recipientName: formData.recipientName,
      recipientNameEn: formData.recipientName,
      guardianName: formData.guardianName || 'स्व. अभिभावक',
      boothNo: Number(formData.boothNo),
      wardNo: Number(formData.wardNo),
      village: formData.village || 'नूरपुर',
      mobile: formData.mobile,
      grantType: formData.grantType,
      amountRupees: Number(formData.amountRupees),
      chequeOrTxnRef: formData.chequeOrTxnRef || `PVI-HDFC-${Math.floor(10000 + Math.random() * 90000)}`,
      paymentMode: formData.paymentMode,
      dateGranted: new Date().toISOString().split('T')[0],
      extendedFamilyVotersCount: Number(formData.extendedFamilyVotersCount) || 10,
      followupCallScheduledDate: new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0],
      anniversaryGreetingDate: formData.grantType === 'DAUGHTER_MARRIAGE' 
        ? new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0]
        : undefined,
      notes: formData.notes || 'विधायक कार्यालय नूरपुर द्वारा निजी सहायता स्वीकृत।',
      karyakartaWitnessName: formData.karyakartaWitnessName || 'स्थानीय बूथ कार्यकर्ता',
      status: 'DISBURSED'
    };

    setGrants([newGrant, ...grants]);
    setIsAddModalOpen(false);
    showToast(`सफल! ₹${newGrant.amountRupees.toLocaleString('en-IN')} का निजी अनुदान दर्ज हुआ (आईडी: ${newGrant.id})`);
  };

  const handleExportCSV = () => {
    const headers = [
      'Grant ID',
      'Recipient Name',
      'Guardian Name',
      'Grant Type',
      'Amount (INR)',
      'Booth No',
      'Ward No',
      'Village',
      'Mobile',
      'Payment Mode',
      'Cheque / Txn Ref',
      'Date Granted',
      'Extended Family Voters',
      'Status'
    ];

    const rows = grants.map(g => [
      g.id,
      `"${g.recipientName}"`,
      `"${g.guardianName}"`,
      g.grantType,
      g.amountRupees,
      g.boothNo,
      g.wardNo,
      `"${g.village}"`,
      g.mobile,
      g.paymentMode,
      g.chequeOrTxnRef,
      g.dateGranted,
      g.extendedFamilyVotersCount,
      g.status
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Nijaat_Trust_Fund_Ledger_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('CSV लेजर सफलतापूर्वक डाउनलोड हुआ');
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
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-xs font-semibold text-amber-400 mb-2">
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>MLA Private Philanthropy & CSR ERP | विधायक निजी सहायता कोष</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center space-x-2">
            <span>निजात (Nijaat) चैरिटेबल ट्रस्ट लेजर</span>
            <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2.5 py-0.5 rounded-full border border-emerald-500/40">
              रणबीर सिंह निक्का निजी कोष
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            शासकीय बजट (MLA-LAD) से अलग, विधायक जी की निजी संपत्ति व ट्रस्ट द्वारा 4,820 जरूरतमंद परिवारों को ₹3.82+ करोड़ की सीधी सहायता, जिससे 19,000+ स्थायी पारिवारिक मतदाता जुड़े हैं।
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center space-x-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-medium border border-slate-700 transition"
          >
            <Download className="w-4 h-4 text-slate-400" />
            <span>CSV एक्सपोर्ट</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold transition shadow-lg shadow-amber-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>+ नया अनुदान दर्ज करें</span>
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

      {/* KPI Highlight Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4">
          <div className="text-xs text-slate-400 font-medium">कुल निजी सहायता वितरित</div>
          <div className="text-2xl font-black text-amber-400 mt-1">₹3.82 Cr</div>
          <div className="text-[11px] text-emerald-400 mt-1 flex items-center space-x-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>100% व्यक्तिगत/ट्रस्ट अंशदान</span>
          </div>
        </div>

        <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4">
          <div className="text-xs text-slate-400 font-medium">कुल लाभार्थी परिवार</div>
          <div className="text-2xl font-black text-white mt-1">4,820</div>
          <div className="text-[11px] text-slate-400 mt-1">
            नूरपुर के 114/118 बूथों में उपस्थिति
          </div>
        </div>

        <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4">
          <div className="text-xs text-slate-400 font-medium">सुरक्षित विस्तारित मतदाता ब्लॉक</div>
          <div className="text-2xl font-black text-emerald-400 mt-1">19,280+</div>
          <div className="text-[11px] text-emerald-400/80 mt-1 flex items-center space-x-1">
            <Users className="w-3 h-3" />
            <span>औसत 4.1 मत प्रति परिवार (98.4% वफादारी)</span>
          </div>
        </div>

        <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4">
          <div className="text-xs text-slate-400 font-medium">कन्यादान विवाह अनुदान (₹51,000)</div>
          <div className="text-2xl font-black text-rose-400 mt-1">1,420 बेटियां</div>
          <div className="text-[11px] text-slate-400 mt-1">
            वार्षिकी बधाई संदेश स्वतः सक्रिय
          </div>
        </div>
      </div>

      {/* Category Pills Breakdown */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
        {TRUST_FUND_TOTAL_METRICS.byCategory.map(cat => {
          const badge = getGrantTypeBadge(cat.type);
          return (
            <div key={cat.type} className="bg-slate-800/40 border border-slate-700/40 rounded-lg p-2.5 text-center">
              <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold border ${badge.color}`}>
                {badge.labelHi}
              </span>
              <div className="text-sm font-bold text-white mt-1.5">{cat.count} परिवार</div>
              <div className="text-[11px] text-slate-400 font-mono">{formatIndianRupees(cat.amountRupees)}</div>
            </div>
          );
        })}
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between pt-2">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="नाम, मोबाइल, गांव या बूथ नंबर खोजें..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
          />
        </div>

        {/* Filter buttons */}
        <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
          <button
            onClick={() => setSelectedType('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              selectedType === 'ALL'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            सभी ({grants.length})
          </button>
          <button
            onClick={() => setSelectedType('DAUGHTER_MARRIAGE')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              selectedType === 'DAUGHTER_MARRIAGE'
                ? 'bg-rose-500 text-white font-bold'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            कन्यादान
          </button>
          <button
            onClick={() => setSelectedType('MEDICAL_EMERGENCY')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              selectedType === 'MEDICAL_EMERGENCY'
                ? 'bg-red-500 text-white font-bold'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            चिकित्सा
          </button>
          <button
            onClick={() => setSelectedType('TEMPLE_COMMUNITY')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              selectedType === 'TEMPLE_COMMUNITY'
                ? 'bg-amber-600 text-white font-bold'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            मंदिर/सामुदायिक
          </button>
          <button
            onClick={() => setSelectedType('EDUCATION_FEE')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              selectedType === 'EDUCATION_FEE'
                ? 'bg-emerald-600 text-white font-bold'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            छात्रवृत्ति
          </button>
        </div>
      </div>

      {/* Grants Table */}
      <div className="border border-slate-800 rounded-xl overflow-hidden overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-800/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <th className="py-3 px-4">अनुदान संदर्भ</th>
              <th className="py-3 px-4">लाभार्थी एवं अभिभावक</th>
              <th className="py-3 px-4">बूथ / वार्ड / गांव</th>
              <th className="py-3 px-4">सहायता प्रकार</th>
              <th className="py-3 px-4 text-right">राशि (₹)</th>
              <th className="py-3 px-4 text-center">वोटर ब्लॉक</th>
              <th className="py-3 px-4">भुगतान मोड व चेक सं.</th>
              <th className="py-3 px-4 text-right">कार्रवाई</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {filteredGrants.map(grant => {
              const badge = getGrantTypeBadge(grant.grantType);
              return (
                <tr key={grant.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 px-4 font-mono text-amber-400 font-semibold">
                    {grant.id}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-white">{grant.recipientName}</div>
                    <div className="text-[11px] text-slate-400">पुत्र/पुत्री/पत्नी: {grant.guardianName}</div>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">{grant.mobile}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-slate-200 font-medium">{grant.village}</div>
                    <div className="text-[11px] text-slate-400">बूथ #{grant.boothNo} • वार्ड #{grant.wardNo}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold border ${badge.color}`}>
                      {badge.labelHi}
                    </span>
                    <div className="text-[10px] text-slate-500 mt-1">{grant.dateGranted}</div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="font-black text-amber-400 text-sm">
                      ₹{grant.amountRupees.toLocaleString('en-IN')}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-flex items-center space-x-1 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 rounded text-emerald-400 font-semibold text-[11px]">
                      <Users className="w-3 h-3" />
                      <span>{grant.extendedFamilyVotersCount} वोटर्स</span>
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px]">
                    <div className="text-slate-300">{grant.chequeOrTxnRef}</div>
                    <div className="text-[10px] text-slate-500">{grant.paymentMode}</div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setGreetingModalGrant(grant)}
                      className="inline-flex items-center space-x-1 px-2.5 py-1 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-600/40 rounded-lg text-[11px] font-medium transition"
                      title="वार्षिकी / फॉलोअप व्हाट्सएप संदेश भेजें"
                    >
                      <Share2 className="w-3 h-3" />
                      <span>संदेश</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Greeting Preview Modal */}
      {greetingModalGrant && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Gift className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-white text-base">विधायक जी का व्यक्तिगत व्हाट्सएप संदेश</h3>
              </div>
              <button
                onClick={() => setGreetingModalGrant(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-700/60 font-sans text-xs text-slate-200 whitespace-pre-wrap leading-relaxed">
              {generateAnniversaryGreetingMessage(greetingModalGrant)}
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>प्राप्तकर्ता: <strong>{greetingModalGrant.recipientName}</strong></span>
              <span className="font-mono">मो: +91 {greetingModalGrant.mobile}</span>
            </div>

            <div className="flex justify-end space-x-3 pt-2">
              <button
                onClick={() => setGreetingModalGrant(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
              >
                रद्द करें
              </button>
              <a
                href={`https://wa.me/91${greetingModalGrant.mobile}?text=${encodeURIComponent(
                  generateAnniversaryGreetingMessage(greetingModalGrant)
                )}`}
                target="_blank"
                rel="noreferrer"
                onClick={() => {
                  showToast('व्हाट्सएप संदेश अग्रेषित किया गया');
                  setGreetingModalGrant(null);
                }}
                className="flex items-center space-x-2 px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-emerald-600/20"
              >
                <Share2 className="w-4 h-4" />
                <span>सीधे व्हाट्सएप पर भेजें</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Add Grant Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <HeartHandshake className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-white text-base">नया निजी अनुदान दर्ज करें (निजात ट्रस्ट)</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateGrant} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">लाभार्थी का नाम *</label>
                  <input
                    type="text"
                    required
                    placeholder="उदा. सुनीता देवी (पुत्री विवाह)"
                    value={formData.recipientName}
                    onChange={e => setFormData({ ...formData, recipientName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">पिता/पति/अभिभावक का नाम</label>
                  <input
                    type="text"
                    placeholder="उदा. कर्म चंद"
                    value={formData.guardianName}
                    onChange={e => setFormData({ ...formData, guardianName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">बूथ संख्या (1-118)</label>
                  <input
                    type="number"
                    min={1}
                    max={118}
                    value={formData.boothNo}
                    onChange={e => setFormData({ ...formData, boothNo: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">वार्ड संख्या (1-24)</label>
                  <input
                    type="number"
                    min={1}
                    max={24}
                    value={formData.wardNo}
                    onChange={e => setFormData({ ...formData, wardNo: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">गांव / पंचायत</label>
                  <input
                    type="text"
                    placeholder="उदा. भदवार"
                    value={formData.village}
                    onChange={e => setFormData({ ...formData, village: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">मोबाइल नंबर (10 अंक) *</label>
                  <input
                    type="tel"
                    required
                    placeholder="98160XXXXX"
                    value={formData.mobile}
                    onChange={e => setFormData({ ...formData, mobile: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">अनुदान श्रेणी (Grant Type)</label>
                  <select
                    value={formData.grantType}
                    onChange={e => {
                      const type = e.target.value as GrantType;
                      let defaultAmount = 51000;
                      if (type === 'MEDICAL_EMERGENCY') defaultAmount = 75000;
                      if (type === 'SPORTS_KIT') defaultAmount = 35000;
                      if (type === 'TEMPLE_COMMUNITY') defaultAmount = 100000;
                      if (type === 'EDUCATION_FEE') defaultAmount = 60000;
                      if (type === 'DISASTER_RELIEF') defaultAmount = 50000;
                      setFormData({ ...formData, grantType: type, amountRupees: defaultAmount });
                    }}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="DAUGHTER_MARRIAGE">कन्यादान (पुत्री विवाह) - ₹51,000</option>
                    <option value="MEDICAL_EMERGENCY">आपातकालीन चिकित्सा / सर्जरी - ₹75,000</option>
                    <option value="SPORTS_KIT">युवा खेल किट एवं जिम - ₹35,000</option>
                    <option value="TEMPLE_COMMUNITY">मंदिर / सामुदायिक निर्माण - ₹1,00,000</option>
                    <option value="EDUCATION_FEE">मेधावी उच्च शिक्षा छात्रवृत्ति - ₹60,000</option>
                    <option value="DISASTER_RELIEF">प्राकृतिक आपदा / अग्नि राहत - ₹50,000</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">अनुदान राशि (₹)</label>
                  <input
                    type="number"
                    value={formData.amountRupees}
                    onChange={e => setFormData({ ...formData, amountRupees: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white font-bold text-amber-400 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">विस्तारित मतदाता ब्लॉक (संख्या)</label>
                  <input
                    type="number"
                    min={1}
                    value={formData.extendedFamilyVotersCount}
                    onChange={e => setFormData({ ...formData, extendedFamilyVotersCount: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">चेक / ट्रांजैक्शन संदर्भ</label>
                  <input
                    type="text"
                    placeholder="उदा. PVI-HDFC-99214"
                    value={formData.chequeOrTxnRef}
                    onChange={e => setFormData({ ...formData, chequeOrTxnRef: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">बूथ कार्यकर्ता गवाह का नाम</label>
                <input
                  type="text"
                  placeholder="उदा. राकेश शर्मा (बूथ प्रमुख)"
                  value={formData.karyakartaWitnessName}
                  onChange={e => setFormData({ ...formData, karyakartaWitnessName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">विशेष टिप्पणी</label>
                <textarea
                  rows={2}
                  placeholder="समारोह विवरण, परिवार की आर्थिक स्थिति या राजनीतिक टिप्पणी..."
                  value={formData.notes}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl font-bold transition shadow-lg shadow-amber-500/20"
                >
                  सुरक्षित करें एवं लेजर में जोड़ें
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
