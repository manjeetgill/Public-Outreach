import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Download, 
  FileText, 
  Printer, 
  MessageSquare, 
  PhoneCall, 
  Radio, 
  AlertOctagon, 
  CheckCircle2, 
  Truck, 
  Building2, 
  FileSpreadsheet, 
  Send, 
  Clock, 
  UserCheck, 
  Sparkles,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Zap,
  Droplets,
  Milestone,
  X,
  Play,
  Volume2,
  MapPin,
  HelpCircle,
  BarChart3,
  Flame,
  Check,
  AlertTriangle,
  ArrowLeft
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { MLA_INFO } from '../../data/campaignData';
import { WarRoomAuditEntry, CitizenInboundMessage, Language } from '../../types/campaign';

interface AdminScreenProps {
  lang: Language;
  onBackToOverview?: () => void;
}

export const AdminScreen: React.FC<AdminScreenProps> = ({ lang, onBackToOverview }) => {
  // Decision Card states
  const [sanctionedCards, setSanctionedCards] = useState<Record<string, { status: string; color: string }>>({});
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'WHATSAPP' | 'VOICE' | 'SMS'>('ALL');
  const [padyatraInput, setPadyatraInput] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Active Modals state
  const [activeMetricModal, setActiveMetricModal] = useState<string | null>(null);
  const [activeDecisionModal, setActiveDecisionModal] = useState<string | null>(null);
  const [activeCitizenModal, setActiveCitizenModal] = useState<string | null>(null);
  const [activeWardModal, setActiveWardModal] = useState<string | null>(null);
  const [isPadyatraModalOpen, setIsPadyatraModalOpen] = useState(false);

  // Audio simulation state for voice recordings
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  const [replyDraft, setReplyDraft] = useState('');

  // Live session audit log
  const [auditLog, setAuditLog] = useState<WarRoomAuditEntry[]>([
    { id: "ACT-001", time: "09:15 AM", ward: "वार्ड 14 जसूर", action: "100 KVA ट्रांसफार्मर निरीक्षण आदेश", officer: "SDO HPSEBL", amount: "₹3,80,000", status: "प्रक्रियाधीन" },
    { id: "ACT-002", time: "10:30 AM", ward: "वार्ड 8 कोटला चौक", action: "2 आपातकालीन पेयजल टैंकर प्रेषण", officer: "XEN जल शक्ति", amount: "-", status: "स्थल पर पहुंचे" },
    { id: "ACT-003", time: "11:45 AM", ward: "वार्ड 19 भदवार", action: "60 मीटर सुरक्षा दंगा स्वीकृति", officer: "BDO नूरपुर", amount: "₹5,20,000", status: "विधायक निधि स्वीकृत" },
    { id: "ACT-004", time: "01:10 PM", ward: "वार्ड 2 नूरपुर", action: "इंटरलॉकिंग टाइल गुणवत्ता प्रमाणन", officer: "JE PWD", amount: "₹8,40,000", status: "कार्य संपन्न" }
  ]);

  // Citizen Feed items
  const [feedItems, setFeedItems] = useState<CitizenInboundMessage[]>([
    {
      id: 'karnail',
      name: 'करनैल सिंह मनकोटिया',
      channel: 'WHATSAPP',
      boothOrWard: 'बूथ #41, नूरपुर शहरी',
      timeAgo: 'Just Now',
      sentiment: '98% अत्यंत सकारात्मक (कृतज्ञता)',
      category: 'सड़क व विकास कार्य',
      text: '"विधायक जी नमस्कार! हमारी गंदराण वाली लिंक रोड पर इंटरलॉकिंग टाइल्स का कार्य कल शुरू हो गया है। पूरे मोहल्ले की तरफ से आपका धन्यवाद। पिछले 10 वर्षों से यह रास्ता कच्चा था।"'
    },
    {
      id: 'saroj',
      name: 'श्रीमती सरोज देवी',
      channel: 'VOICE',
      boothOrWard: 'बूथ #88, भदवार',
      timeAgo: '6 मिनट पूर्व',
      sentiment: 'गंभीर / त्वरित मानवीय सहायता',
      category: 'सामाजिक सुरक्षा व सुख आश्रय पेंशन',
      text: '"विधवा व सुख आश्रय पेंशन की पिछली किस्त खाते में नहीं पहुंची है। ब्लॉक कार्यालय जाने में असमर्थ हूँ, कृपया सहायता करें।"'
    },
    {
      id: 'ratan',
      name: 'रतन चंद डोगरा (+91 94180-XXXXX)',
      channel: 'SMS',
      boothOrWard: 'पंचायत खन्नी',
      timeAgo: '19 मिनट पूर्व',
      sentiment: 'स्ट्रीट लाइट समस्या',
      category: 'साधारण कीपैड फोन एसएमएस',
      text: '"कोटला चौक बस स्टॉप के पास सोलर स्ट्रीट लाइट की बैटरी खराब है। शाम को अंधेरा रहता है और सवारियों को परेशानी होती है।"'
    },
    {
      id: 'sanjeev',
      name: 'संजीव कुमार (बूथ अध्यक्ष #102)',
      channel: 'WHATSAPP',
      boothOrWard: 'रैहन बाज़ार',
      timeAgo: '35 मिनट पूर्व',
      sentiment: 'युवा सहभागिता / निमंत्रण',
      category: 'युवा मोर्चा निमंत्रण',
      text: '"रैहन ग्राउंड पर आगामी रविवार को 16 टीमों का युवा वॉलीबॉल टूर्नामेंट है। विधायक जी के मुख्य आतिथ्य हेतु अनुरोध। सभी युवाओं की हार्दिक इच्छा है कि आप युवाओं को प्रेरित करें।"'
    }
  ]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // 1. APPROVE FUND SANCTION
  const handleApproveFund = (ward: string, amountNum: number, project: string, cardKey: string) => {
    const formattedAmount = "₹" + (amountNum / 100000).toFixed(2) + " लाख";
    const newEntry: WarRoomAuditEntry = {
      id: "ACT-" + Math.floor(100 + Math.random() * 900),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      ward,
      action: `विधायक निधि स्वीकृति: ${project}`,
      officer: "विधायक कार्यालय नूरपुर",
      amount: formattedAmount,
      status: "स्वीकृत (SANCTIONED)"
    };

    setAuditLog(prev => [newEntry, ...prev]);
    setSanctionedCards(prev => ({
      ...prev,
      [cardKey]: { status: `स्वीकृत: ${formattedAmount}`, color: 'emerald' }
    }));

    confetti({
      particleCount: 75,
      spread: 70,
      origin: { y: 0.6 }
    });

    showToast(`सफलतापूर्वक आदेश प्रेषित! ${ward} हेतु ${formattedAmount} MLA-LAD फंड स्वीकृत किया गया।`);
  };

  // 2. DISPATCH WATER TANKERS
  const handleDispatchTankers = (ward: string, count: number, cardKey: string) => {
    const newEntry: WarRoomAuditEntry = {
      id: "ACT-" + Math.floor(100 + Math.random() * 900),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      ward,
      action: `${count} आपातकालीन पानी टैंकर वाहन रवाना (HP-68-A)`,
      officer: "सहायक अभियंता जल शक्ति",
      amount: "निःशुल्क सेवा",
      status: "गाड़ियां रवाना"
    };

    setAuditLog(prev => [newEntry, ...prev]);
    setSanctionedCards(prev => ({
      ...prev,
      [cardKey]: { status: `रवाना: ${count} टैंकर डिस्पेच्ड`, color: 'sky' }
    }));

    showToast(`जल संकट अलर्ट! ${ward} हेतु ${count} वाटर टैंकर डिपो से रवाना कर दिए गए हैं।`);
  };

  // 3. ISSUE OFFICER ULTIMATUM
  const handleIssueOfficerOrder = (officer: string, note: string) => {
    const newEntry: WarRoomAuditEntry = {
      id: "ACT-" + Math.floor(100 + Math.random() * 900),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      ward: "नूरपुर प्रशासनिक खंड",
      action: `विधायक कड़ा आदेश पत्र: ${note}`,
      officer,
      amount: "-",
      status: "24h नोटिस जारी"
    };

    setAuditLog(prev => [newEntry, ...prev]);
    showToast(`सख्त प्रशासनिक निर्देश! ${officer} को 24 घंटे में अनुपालन रिपोर्ट प्रस्तुत करने का नोटिस जारी।`);
  };

  // 4. ADD PADYATRA EVENT
  const handleAddPadyatra = (e: React.FormEvent) => {
    e.preventDefault();
    if (!padyatraInput.trim()) return;

    const newEntry: WarRoomAuditEntry = {
      id: "ACT-" + Math.floor(100 + Math.random() * 900),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      ward: "पदयात्रा जनसंवाद",
      action: `दौरा पड़ाव जोड़ा गया: ${padyatraInput}`,
      officer: "कैंप कार्यालय नूरपुर",
      amount: "-",
      status: "शेड्यूल अपडेट"
    };

    setAuditLog(prev => [newEntry, ...prev]);
    setPadyatraInput('');
    showToast(`आज की पदयात्रा डायरी में नया पड़ाव सफलतापूर्वक दर्ज किया गया!`);
  };

  // 5. CITIZEN FEED QUICK ACTION
  const handleFeedAction = (citizenName: string, actionText: string) => {
    setFeedItems(prev => prev.map(item => {
      if (item.name === citizenName) {
        return { ...item, replied: true };
      }
      return item;
    }));
    showToast(`${citizenName} को आधिकारिक संदेश सफलतापूर्वक प्रेषित: "${actionText}"`);
  };

  // 6. DOWNLOAD ADMIN DASHBOARD HTML
  const handleDownloadAdminHTML = () => {
    const htmlContent = `<!DOCTYPE html>
<html lang="hi">
<head>
  <meta charset="UTF-8">
  <title>रणबीर सिंह निक्का • विधायक वॉर रूम डैशबोर्ड (ऑफ़लाइन रिकॉर्ड)</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #08101d; color: #f1f5f9; padding: 24px; margin: 0; }
    h1 { color: #f59e0b; margin-bottom: 4px; }
    .badge { background: #1e3a5f; color: #38bdf8; padding: 4px 10px; border-radius: 999px; font-size: 12px; }
    .card { background: #0f1f33; border: 1px solid #1e3a5f; border-radius: 12px; padding: 18px; margin-bottom: 16px; }
    .kpi { display: inline-block; width: 30%; background: #0f1f33; padding: 16px; border-radius: 10px; border: 1px solid #1e3a5f; margin: 1%; box-sizing: border-box; }
    table { width: 100%; border-collapse: collapse; margin-top: 16px; }
    th, td { text-align: left; padding: 10px; border-bottom: 1px solid #1e3a5f; font-size: 13px; }
    th { background: #08101d; color: #94a3b8; }
  </style>
</head>
<body>
  <h1>विधायक वॉर रूम एवं जन सेवा निर्णय डेस्क</h1>
  <p>विधानसभा क्षेत्र: 142 नूरपुर (कांगड़ा) • विधायक: रणबीर सिंह निक्का • दिनांक: ${new Date().toLocaleDateString('hi-IN')}</p>
  <span class="badge">लाइव प्रशासनिक रिकॉर्ड • डिजिटल अभिलेख</span>
  
  <div style="margin: 20px 0;">
    <div class="kpi">
      <div style="color: #94a3b8; font-size: 13px;">कुल नागरिक संवाद</div>
      <div style="font-size: 28px; font-weight: bold; color: #38bdf8;">48,250</div>
    </div>
    <div class="kpi">
      <div style="color: #94a3b8; font-size: 13px;">स्वीकृत विधायक निधि (MLA-LAD)</div>
      <div style="font-size: 28px; font-weight: bold; color: #f59e0b;">₹42.35 Crore</div>
    </div>
    <div class="kpi">
      <div style="color: #94a3b8; font-size: 13px;">समस्या निवारण दर</div>
      <div style="font-size: 28px; font-weight: bold; color: #10b981;">94.2%</div>
    </div>
  </div>

  <div class="card">
    <h2 style="color: #f59e0b; font-size: 18px;">आज की प्राथमिक प्रशासनिक कार्यवाहियां एवं आदेश</h2>
    <table>
      <thead>
        <tr>
          <th>आईडी</th>
          <th>समय</th>
          <th>वार्ड / क्षेत्र</th>
          <th>कार्यवाही / निर्णय विवरण</th>
          <th>अधिकारी / विभाग</th>
          <th>स्वीकृत राशि</th>
          <th>स्थिति</th>
        </tr>
      </thead>
      <tbody>
        ${auditLog.map(row => `
          <tr>
            <td><b>${row.id}</b></td>
            <td>${row.time}</td>
            <td>${row.ward}</td>
            <td>${row.action}</td>
            <td>${row.officer}</td>
            <td>${row.amount}</td>
            <td><span style="color:#10b981;">${row.status}</span></td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ranbir_singh_nikka_admin_dashboard_${new Date().toISOString().slice(0, 10)}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast("पूरा एडमिन डैशबोर्ड HTML फाइल सफलतापूर्वक डाउनलोड हुआ!");
  };

  // 7. EXPORT WAR ROOM DAILY REPORT JSON
  const handleExportJSON = () => {
    const reportData = {
      title: "रणबीर सिंह निक्का • विधायक वॉर रूम दैनिक प्रशासनिक व जन संवाद रिपोर्ट",
      constituency: "142 नूरपुर, कांगड़ा (हिमाचल प्रदेश)",
      date: new Date().toLocaleDateString('hi-IN'),
      generated_at: new Date().toISOString(),
      summary: {
        total_citizen_inbound: "48,250",
        today_inflow: "1,284",
        urgent_decisions_pending: "18",
        total_sanctioned_mla_lad: "₹42.35 Crore",
        emergency_water_tankers_deployed: "14",
        satisfaction_rate: "94.2%"
      },
      priority_actions_log: auditLog,
      campaign_motto: "घर-घर निक्का, हर घर निक्का"
    };

    const jsonString = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(reportData, null, 2));
    const link = document.createElement('a');
    link.href = jsonString;
    link.download = `nurpur_war_room_daily_report_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("दैनिक वॉर रूम रिपोर्ट JSON प्रारूप में डाउनलोड हो गई!");
  };

  // 8. EXPORT CSV
  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Action_ID,Time,Ward,Action_Description,Officer_Department,Amount,Status\n";
    auditLog.forEach(row => {
      csvContent += `"${row.id}","${row.time}","${row.ward}","${row.action}","${row.officer}","${row.amount}","${row.status}"\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `nurpur_war_room_actions_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("CSV रिपोर्ट सफलतापूर्वक डाउनलोड हुई!");
  };

  const filteredFeed = feedItems.filter(item => {
    if (activeFilter === 'ALL') return true;
    return item.channel === activeFilter;
  });

  return (
    <div className="bg-[#08101d] min-h-screen p-4 sm:p-6 space-y-6 text-slate-100">
      
      {/* 1. TOP ADMIN WAR ROOM HEADER (Command Center Theme) */}
      <div className="bg-[#0f1f33] border border-[#1e3a5f] p-4 sm:p-5 rounded-3xl shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        <div className="flex items-center gap-3.5">
          {onBackToOverview && (
            <button
              onClick={onBackToOverview}
              className="p-2 rounded-xl bg-[#102a43] hover:bg-[#1a3a60] text-slate-300 transition"
              title="मुख्य डैशबोर्ड पर वापस जाएं"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}

          <div className="w-12 h-12 rounded-full border-2 border-amber-400 overflow-hidden shrink-0 shadow-md bg-[#08101d] flex items-center justify-center p-0.5">
            <img 
              src={MLA_INFO.logoUrl} 
              alt="Logo" 
              className="w-full h-full object-contain" 
            />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base sm:text-lg font-black text-white tracking-wide">
                रणबीर सिंह निक्का • विधायक वॉर रूम व जन सेवा निर्णय डेस्क
              </h2>
              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                वि.स. 142 नूरपुर (कांगड़ा)
              </span>
              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-semibold px-2 py-0.5 rounded-full flex items-center">
                <span className="w-2 h-2 bg-emerald-400 rounded-full mr-1.5 animate-pulse"></span> 
                जन संवाद सक्रिय
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              घर-घर निक्का, हर घर निक्का — त्वरित प्रशासनिक निवारण, विधायक निधि स्वीकृति व पदयात्रा मॉनिटरिंग सिस्टम
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button 
            onClick={handleDownloadAdminHTML}
            className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 text-xs font-bold px-3 py-2 rounded-xl shadow-md flex items-center gap-1.5 active:scale-95 transition"
            title="पूरा डैशबोर्ड HTML फाइल के रूप में डाउनलोड करें"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download HTML</span>
          </button>

          <button 
            onClick={handleExportJSON}
            className="bg-[#102a43] hover:bg-[#1c3856] text-emerald-400 border border-[#1e3a5f] text-xs font-semibold px-3 py-2 rounded-xl transition active:scale-95 flex items-center gap-1.5"
            title="दैनिक प्रशासनिक कार्यवाही रिपोर्ट डाउनलोड करें"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Export Report (JSON)</span>
          </button>

          <button 
            onClick={handleExportCSV}
            className="bg-[#102a43] hover:bg-[#1c3856] text-slate-300 border border-[#1e3a5f] text-xs px-2.5 py-2 rounded-xl transition active:scale-95 flex items-center gap-1 font-semibold"
            title="CSV डाउनलोड"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">CSV</span>
          </button>

          <button 
            onClick={() => window.print()}
            className="bg-[#102a43] hover:bg-[#1c3856] text-slate-300 border border-[#1e3a5f] text-xs px-2.5 py-2 rounded-xl transition active:scale-95 flex items-center gap-1"
            title="प्रिंट रिपोर्ट"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Print</span>
          </button>
        </div>

      </div>

      {/* 2. TOP ROW: HIGH-LEVEL METRICS / KPIS (Dark Command Theme Cards) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        
        {/* Metric 1 */}
        <div 
          onClick={() => setActiveMetricModal('inbound')}
          className="bg-[#0f1f33] border border-[#1e3a5f] p-3.5 rounded-2xl shadow-xl hover:border-blue-400 hover:shadow-2xl transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span className="font-semibold text-slate-300">कुल नागरिक संवाद</span>
            <span className="text-blue-400 text-sm">💬</span>
          </div>
          <div className="text-2xl font-black text-white">48,250</div>
          <div className="text-[11px] text-emerald-400 mt-1 flex justify-between font-mono font-bold">
            <span>WhatsApp: 26.4k</span>
            <span>कॉल: 14.3k</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-1.5 flex items-center justify-end group-hover:text-blue-400 transition font-medium">
            विवरण देखें →
          </div>
        </div>

        {/* Metric 2 */}
        <div 
          onClick={() => setActiveMetricModal('today')}
          className="bg-[#0f1f33] border border-[#1e3a5f] p-3.5 rounded-2xl shadow-xl hover:border-amber-400 hover:shadow-2xl transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span className="font-semibold text-slate-300">आज प्राप्त समस्याएं</span>
            <span className="text-amber-400 text-sm">📥</span>
          </div>
          <div className="text-2xl font-black text-amber-400">1,284</div>
          <div className="text-[11px] text-slate-400 mt-1 font-mono">89 संवाद / घंटा प्रवाह</div>
          <div className="text-[10px] text-slate-500 mt-1.5 flex items-center justify-end group-hover:text-amber-400 transition font-medium">
            विवरण देखें →
          </div>
        </div>

        {/* Metric 3: Critical Pending Decisions */}
        <div 
          onClick={() => setActiveMetricModal('pending')}
          className="bg-rose-950/40 border border-rose-500/40 p-3.5 rounded-2xl shadow-xl hover:border-rose-400 hover:shadow-2xl transition relative cursor-pointer group"
        >
          <div className="flex items-center justify-between text-rose-300 text-xs mb-1">
            <span className="font-black">तत्काल निर्णय लंबित</span>
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
          </div>
          <div className="text-2xl font-black text-rose-400">18</div>
          <div className="text-[11px] text-rose-300 mt-1 font-semibold">अति-गंभीर • विधायक हस्तक्षेप</div>
          <div className="text-[10px] text-rose-400 mt-1.5 flex items-center justify-end group-hover:text-rose-200 transition font-bold">
            निर्णय लें →
          </div>
        </div>

        {/* Metric 4 */}
        <div 
          onClick={() => setActiveMetricModal('funds')}
          className="bg-[#0f1f33] border border-[#1e3a5f] p-3.5 rounded-2xl shadow-xl hover:border-amber-400 hover:shadow-2xl transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span className="font-semibold text-slate-300">स्वीकृत विधायक निधि</span>
            <span className="text-amber-400 text-sm">🏛️</span>
          </div>
          <div className="text-2xl font-black text-amber-300">₹42.35 Cr</div>
          <div className="text-[11px] text-amber-400/90 mt-1 font-semibold">148+ स्वीकृत विकास योजनाएं</div>
          <div className="text-[10px] text-slate-500 mt-1.5 flex items-center justify-end group-hover:text-amber-400 transition font-medium">
            ऑडिट ब्योरा →
          </div>
        </div>

        {/* Metric 5 */}
        <div 
          onClick={() => setActiveMetricModal('tankers')}
          className="bg-[#0f1f33] border border-[#1e3a5f] p-3.5 rounded-2xl shadow-xl hover:border-sky-400 hover:shadow-2xl transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span className="font-semibold text-slate-300">आपातकालीन जल टैंकर</span>
            <span className="text-sky-400 text-sm">🚰</span>
          </div>
          <div className="text-2xl font-black text-sky-400">14 वाहन सक्रिय</div>
          <div className="text-[11px] text-slate-400 mt-1 font-mono">औसत रिस्पांस: 28 मिनट</div>
          <div className="text-[10px] text-slate-500 mt-1.5 flex items-center justify-end group-hover:text-sky-400 transition font-medium">
            फ्लीट स्थिति →
          </div>
        </div>

        {/* Metric 6 */}
        <div 
          onClick={() => setActiveMetricModal('satisfaction')}
          className="bg-[#0f1f33] border border-[#1e3a5f] p-3.5 rounded-2xl shadow-xl hover:border-emerald-400 hover:shadow-2xl transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span className="font-semibold text-slate-300">समस्या निवारण दर</span>
            <span className="text-emerald-400 text-sm">✅</span>
          </div>
          <div className="text-2xl font-black text-emerald-400">94.2%</div>
          <div className="text-[11px] text-slate-400 mt-1">संतुष्ट नागरिक फीडबैक</div>
          <div className="text-[10px] text-slate-500 mt-1.5 flex items-center justify-end group-hover:text-emerald-400 transition font-medium">
            सर्वेक्षण डेटा →
          </div>
        </div>

      </div>

      {/* 3. MIDDLE SECTION: 2-COLUMN COMMAND CENTER */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: OPERATIONAL DECISION QUEUE & PRIORITY ACTIONS (7 COLS) */}
        <div className="xl:col-span-7 space-y-6">
          
          {/* Panel 1: Urgent Priority Decisions */}
          <div className="bg-[#0f1f33] border border-[#1e3a5f] rounded-3xl p-5 shadow-2xl space-y-4">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#1e3a5f] gap-2">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-rose-500"></span>
                <h3 className="font-black text-sm text-white uppercase tracking-wider">
                  त्वरित प्रशासनिक हस्तक्षेप निर्णय कतार (Priority Decision Queue)
                </h3>
                <span className="bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs px-2 py-0.5 rounded font-bold">
                  2 अति-आवश्यक
                </span>
              </div>
              <span className="text-xs text-slate-400">
                सिंगल क्लिक स्वीकृति व प्रशासनिक आदेश
              </span>
            </div>

            {/* Decision Case 1: Electricity Transformer */}
            <div 
              onClick={() => setActiveDecisionModal('ward14')}
              className={`p-4 rounded-2xl border transition shadow-lg cursor-pointer ${
                sanctionedCards['card1'] 
                  ? 'bg-emerald-950/40 border-emerald-500/50' 
                  : 'bg-[#0a1626] border-[#1c3856] hover:border-amber-500/60 hover:bg-[#0d1c30]'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-bold px-2 py-0.5 rounded">
                      अति-गंभीर
                    </span>
                    <h4 className="text-sm font-bold text-slate-100">
                      वार्ड 14 • जसूर-खन्नी — 100 KVA ट्रांसफार्मर बर्स्ट
                    </h4>
                    <span className="text-[11px] text-slate-400 font-mono">14 मिनट पूर्व</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    180 परिवार बिजली आपूर्ति विहीन। ग्राम पंचायत प्रधान व स्थानीय कार्यकर्ताओं ने विधायक निधि से त्वरित 100 KVA अतिरिक्त ट्रांसफार्मर लगाने की गुहार लगाई है।
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs font-mono font-bold text-amber-300 bg-amber-950/50 border border-amber-600/40 px-2 py-1 rounded">
                    ₹3.80 लाख MLA-LAD
                  </span>
                  <div className="text-[10px] text-slate-400 mt-1">अनुमानित लागत</div>
                </div>
              </div>

              {/* Action Bar */}
              <div 
                onClick={(e) => e.stopPropagation()} 
                className="mt-3 pt-3 border-t border-[#1c3856] flex flex-wrap items-center justify-between gap-2"
              >
                <div className="text-xs text-slate-400 flex items-center space-x-1.5">
                  <Building2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>अधिशासी अभियंता HPSEBL नूरपुर नोटिफाइड</span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleApproveFund('वार्ड 14 जसूर-खन्नी', 380000, '100 KVA नया ट्रांसफार्मर', 'card1')}
                    className="bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold px-3 py-1.5 rounded-lg shadow-md transition active:scale-95 flex items-center space-x-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{sanctionedCards['card1']?.status || '✓ राशि स्वीकृत करें (Sanction ₹3.8L)'}</span>
                  </button>
                  <button
                    onClick={() => handleIssueOfficerOrder('Sub-Divisional Officer Power', '24 घंटे के भीतर नया ट्रांसफार्मर स्थल पर स्थापित हो')}
                    className="bg-[#102a43] hover:bg-[#193b61] text-slate-200 border border-[#1c3856] text-xs px-2.5 py-1.5 rounded-lg transition"
                  >
                    24h अल्टीमेटम आदेश
                  </button>
                </div>
              </div>
            </div>

            {/* Decision Case 2: Water Supply Crisis */}
            <div 
              onClick={() => setActiveDecisionModal('ward8')}
              className={`p-4 rounded-2xl border transition shadow-lg cursor-pointer ${
                sanctionedCards['card2'] 
                  ? 'bg-sky-950/40 border-sky-500/50' 
                  : 'bg-[#0a1626] border-[#1c3856] hover:border-sky-500/60 hover:bg-[#0d1c30]'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="bg-sky-500/20 text-sky-300 border border-sky-500/30 text-[10px] font-bold px-2 py-0.5 rounded">
                      पेयजल संकट
                    </span>
                    <h4 className="text-sm font-bold text-slate-100">
                      वार्ड 8 • कोटला चौक — मुख्य जल शक्ति पाइपलाइन क्षतिग्रस्त
                    </h4>
                    <span className="text-[11px] text-slate-400 font-mono">32 मिनट पूर्व</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    3 दिनों से 450 घरों में पानी ठप। व्हाट्सएप व कॉल पर 42 स्थानीय नागरिकों की शिकायत दर्ज हुई है। पीने के पानी का संकट।
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs font-bold text-rose-300 bg-rose-950/50 border border-rose-600/40 px-2 py-1 rounded">
                    जन आक्रोश अलर्ट
                  </span>
                  <div className="text-[10px] text-slate-400 mt-1">कोटला व बस्ती क्षेत्र</div>
                </div>
              </div>

              {/* Action Bar */}
              <div 
                onClick={(e) => e.stopPropagation()} 
                className="mt-3 pt-3 border-t border-[#1c3856] flex flex-wrap items-center justify-between gap-2"
              >
                <div className="text-xs text-slate-400 flex items-center space-x-1.5">
                  <Truck className="w-3.5 h-3.5 text-sky-400" />
                  <span>2 आपातकालीन टैंकर नूरपुर डिपो में स्टैंडबाय</span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleDispatchTankers('वार्ड 8 कोटला चौक', 2, 'card2')}
                    className="bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-md transition active:scale-95 flex items-center space-x-1"
                  >
                    <Droplets className="w-3.5 h-3.5" />
                    <span>{sanctionedCards['card2']?.status || '🚰 2 टैंकर तुरंत भेजें (Deploy Tankers)'}</span>
                  </button>
                  <button
                    onClick={() => handleIssueOfficerOrder('XEN Jal Shakti Department, Nurpur', 'कोटला पाइपलाइन 3 घंटे में दुरुस्त करें')}
                    className="bg-[#102a43] hover:bg-[#193b61] text-slate-200 border border-[#1c3856] text-xs px-2.5 py-1.5 rounded-lg transition"
                  >
                    XEN को तत्काल आदेश
                  </button>
                </div>
              </div>
            </div>

            {/* Decision Case 3: Flood Protection Danga */}
            <div 
              onClick={() => setActiveDecisionModal('ward19')}
              className={`p-4 rounded-2xl border transition shadow-lg cursor-pointer ${
                sanctionedCards['card3'] 
                  ? 'bg-emerald-950/40 border-emerald-500/50' 
                  : 'bg-[#0a1626] border-[#1c3856] hover:border-emerald-500/60 hover:bg-[#0d1c30]'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded">
                      विकास कार्य
                    </span>
                    <h4 className="text-sm font-bold text-slate-100">
                      वार्ड 19 • भदवार खड्ड — सुरक्षा दीवार (Danga) निर्माण प्रस्ताव
                    </h4>
                    <span className="text-[11px] text-slate-400 font-mono">आज प्रातः</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    बरसात में कृषि भूमि कटाव रोकने हेतु 60 मीटर दंगा निर्माण की मांग रखी है। तकनीकी प्राक्कलन (Estimate) तैयार।
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs font-mono font-bold text-amber-300 bg-amber-950/50 border border-amber-600/40 px-2 py-1 rounded">
                    ₹5.20 लाख MLA-LAD
                  </span>
                  <div className="text-[10px] text-slate-400 mt-1">स्वीकृति योग्य</div>
                </div>
              </div>

              {/* Action Bar */}
              <div 
                onClick={(e) => e.stopPropagation()} 
                className="mt-3 pt-3 border-t border-[#1c3856] flex flex-wrap items-center justify-between gap-2"
              >
                <div className="text-xs text-slate-400 flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>BDO नूरपुर व पंचायत तकनीकी सहायक द्वारा सत्यापित</span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleApproveFund('वार्ड 19 भदवार खड्ड', 520000, '60 मीटर सुरक्षा दंगा निर्माण', 'card3')}
                    className="bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold px-3 py-1.5 rounded-lg shadow-md transition active:scale-95 flex items-center space-x-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{sanctionedCards['card3']?.status || '✓ ₹5.20 लाख स्वीकृत करें'}</span>
                  </button>
                  <button
                    onClick={() => showToast('भदवार दंगा निर्माण को आगामी पदयात्रा निरीक्षण सूची में शामिल किया गया')}
                    className="bg-[#102a43] hover:bg-[#193b61] text-slate-200 border border-[#1c3856] text-xs px-2.5 py-1.5 rounded-lg transition"
                  >
                    📝 पदयात्रा निरीक्षण में जोड़ें
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* Panel 2: Ward Sentiment Index */}
          <div className="bg-[#0f1f33] border border-[#1e3a5f] rounded-3xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1e3a5f]">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-amber-400"></span>
                <h3 className="font-black text-sm text-white uppercase tracking-wider">
                  वार्ड वार जन-संतुष्टि व समस्या इंडेक्स (Ward Sentiment Index)
                </h3>
              </div>
              <span className="text-xs text-slate-400">24 वार्ड व प्रमुख पंचायत क्लस्टर मॉनिटरिंग</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Ward 14 */}
              <div 
                onClick={() => setActiveWardModal('ward14')}
                className="bg-[#0a1626] border border-[#1c3856] p-3 rounded-2xl cursor-pointer hover:border-rose-400 hover:bg-[#0e2138] transition"
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-slate-200">वार्ड 14 (जसूर)</span>
                  <span className="text-rose-400 font-bold text-[11px]">68% संतुष्टि</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 mb-2">
                  <div className="bg-rose-500 h-2 rounded-full" style={{ width: '68%' }}></div>
                </div>
                <p className="text-[11px] text-slate-400">प्रमुख मुद्दा: बिजली ट्रांसफार्मर व लिंक रोड।</p>
                <div className="text-[10px] text-amber-400 mt-1.5 text-right font-bold">वार्ड विश्लेषण खोलें →</div>
              </div>

              {/* Ward 8 */}
              <div 
                onClick={() => setActiveWardModal('ward8')}
                className="bg-[#0a1626] border border-[#1c3856] p-3 rounded-2xl cursor-pointer hover:border-amber-400 hover:bg-[#0e2138] transition"
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-slate-200">वार्ड 8 (कोटला)</span>
                  <span className="text-amber-400 font-bold text-[11px]">74% संतुष्टि</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 mb-2">
                  <div className="bg-amber-500 h-2 rounded-full" style={{ width: '74%' }}></div>
                </div>
                <p className="text-[11px] text-slate-400">प्रमुख मुद्दा: पेयजल पाइपलाइन बहाली।</p>
                <div className="text-[10px] text-amber-400 mt-1.5 text-right font-bold">वार्ड विश्लेषण खोलें →</div>
              </div>

              {/* Ward 2 */}
              <div 
                onClick={() => setActiveWardModal('ward2')}
                className="bg-[#0a1626] border border-[#1c3856] p-3 rounded-2xl cursor-pointer hover:border-emerald-400 hover:bg-[#0e2138] transition"
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-slate-200">वार्ड 2 (नूरपुर)</span>
                  <span className="text-emerald-400 font-bold text-[11px]">96% संतुष्टि</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 mb-2">
                  <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '96%' }}></div>
                </div>
                <p className="text-[11px] text-slate-400">इंटरलॉकिंग टाइल व स्ट्रीट लाइट कार्य पूर्ण।</p>
                <div className="text-[10px] text-emerald-400 mt-1.5 text-right font-bold">वार्ड विश्लेषण खोलें →</div>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: MULTICHANNEL CITIZEN FEED & PADYATRA (5 COLS) */}
        <div className="xl:col-span-5 space-y-6">
          
          {/* Panel 3: Live Citizen Inbound Feed */}
          <div className="bg-[#0f1f33] border border-[#1e3a5f] rounded-3xl p-5 shadow-2xl space-y-4">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#1e3a5f] gap-2">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <h3 className="font-black text-sm text-white uppercase tracking-wider">
                  लाइव जन संवाद फीड (Live Citizen Inbound)
                </h3>
              </div>

              {/* Channel Filter Pills */}
              <div className="flex items-center space-x-1 text-xs">
                {(['ALL', 'WHATSAPP', 'VOICE', 'SMS'] as const).map((ch) => (
                  <button
                    key={ch}
                    onClick={() => setActiveFilter(ch)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition ${
                      activeFilter === ch 
                        ? 'bg-blue-600 text-white shadow-md' 
                        : 'bg-[#102a43] text-slate-300 hover:bg-[#163352]'
                    }`}
                  >
                    {ch === 'ALL' ? 'सभी' : ch}
                  </button>
                ))}
              </div>
            </div>

            {/* Inbound List */}
            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
              {filteredFeed.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setActiveCitizenModal(item.id)}
                  className="bg-[#0a1626] border border-[#1c3856] p-3.5 rounded-2xl hover:bg-[#0e2138] hover:border-blue-400/50 transition cursor-pointer space-y-2"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] ${
                        item.channel === 'WHATSAPP' 
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                          : item.channel === 'VOICE' 
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' 
                            : 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                      }`}>
                        {item.channel === 'WHATSAPP' ? 'WA' : item.channel === 'VOICE' ? '🎙️' : 'SMS'}
                      </span>
                      <span className="font-bold text-xs text-white">{item.name}</span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-800/40">
                      {item.timeAgo}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed italic bg-[#07101b] p-2.5 rounded-xl border border-[#162a42]">
                    {item.text}
                  </p>

                  <div 
                    onClick={(e) => e.stopPropagation()} 
                    className="flex items-center justify-between text-[11px] pt-1.5 border-t border-[#1c3856]"
                  >
                    <span className="text-slate-400 font-medium">{item.category}</span>
                    <button
                      onClick={() => handleFeedAction(item.name, 'त्वरित उत्तर प्रेषित किया गया')}
                      className="text-amber-400 font-bold hover:underline"
                    >
                      {item.replied ? '✓ उत्तर भेजा गया' : 'उत्तर भेजें →'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* Panel 4: Padyatra & Mass Outreach Tracker */}
          <div className="bg-[#0f1f33] border border-[#1e3a5f] rounded-3xl p-5 shadow-2xl space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-[#1e3a5f]">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-amber-400"></span>
                <h3 className="font-black text-sm text-white uppercase tracking-wider">
                  घर-घर निक्का पदयात्रा — दैनिक रूट मॉनिटरिंग
                </h3>
              </div>
              <span className="bg-amber-500/20 text-amber-300 text-xs px-2 py-0.5 rounded font-bold border border-amber-500/30">
                आज का लाइव दौरा
              </span>
            </div>

            <div 
              onClick={() => setIsPadyatraModalOpen(true)}
              className="flex items-center space-x-3 bg-[#0a1626] border border-[#1c3856] p-3 rounded-2xl cursor-pointer hover:border-amber-400 transition"
            >
              <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-[#1e3a5f] bg-[#07101b]">
                <img 
                  src="https://images.unsplash.com/photo-1541888946425-d0fbb18615f8?w=300&auto=format&fit=crop&q=80" 
                  alt="Padyatra"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0 text-xs">
                <div className="font-bold text-white text-sm">
                  जसूर • भदवार • खन्नी चौपाल संपर्क
                </div>
                <p className="text-slate-400 text-xs mt-0.5">
                  शाम 04:30 बजे — वार्ड 14 जनसभा व बुजुर्गों से प्रत्यक्ष आशीर्वाद संवाद
                </p>
                <div className="flex items-center space-x-2 mt-1.5 text-[11px] font-semibold">
                  <span className="text-emerald-400">● चौपाल 1 संपन्न</span>
                  <span className="text-slate-500">|</span>
                  <span className="text-amber-400">● चौपाल 2 जारी</span>
                </div>
              </div>
            </div>

            {/* Quick Add Note */}
            <form onSubmit={handleAddPadyatra} className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="आज की पदयात्रा में नई चौपाल या मांग दर्ज करें..."
                value={padyatraInput}
                onChange={(e) => setPadyatraInput(e.target.value)}
                className="flex-1 bg-[#0a1626] border border-[#1c3856] rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
              <button
                type="submit"
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold px-3.5 py-2 rounded-xl transition"
              >
                अपडेट जोड़ें
              </button>
            </form>

          </div>

        </div>

      </div>

      {/* 4. AUDIT LOG & ACTION RECORD (Full-width Live Register) */}
      <div className="bg-[#0f1f33] border border-[#1e3a5f] rounded-3xl p-5 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#1e3a5f] gap-2">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
            <h3 className="font-black text-sm text-white uppercase tracking-wider">
              दैनिक प्रशासनिक कार्यवाही व स्वीकृति लॉग (Live Action Audit Register)
            </h3>
          </div>
          <div className="text-xs text-slate-400 flex items-center space-x-2">
            <span>कुल {auditLog.length} कार्यवाहियां दर्ज</span>
            <span>•</span>
            <span className="text-emerald-400 font-semibold">अपरिवर्तनीय डिजिटल लेजर</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#08101d] text-slate-400 border-b border-[#1e3a5f]">
                <th className="py-2.5 px-3 font-semibold">आईडी</th>
                <th className="py-2.5 px-3 font-semibold">समय</th>
                <th className="py-2.5 px-3 font-semibold">वार्ड / पंचायत</th>
                <th className="py-2.5 px-3 font-semibold">कार्यवाही विवरण</th>
                <th className="py-2.5 px-3 font-semibold">अधिकारी / विभाग</th>
                <th className="py-2.5 px-3 font-semibold">स्वीकृत राशि</th>
                <th className="py-2.5 px-3 font-semibold">वर्तमान स्थिति</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1c3856]">
              {auditLog.map((log) => (
                <tr key={log.id} className="hover:bg-[#152a45]/80 text-slate-200 transition">
                  <td className="py-2.5 px-3 font-mono font-bold text-amber-400">{log.id}</td>
                  <td className="py-2.5 px-3 text-slate-400 font-mono">{log.time}</td>
                  <td className="py-2.5 px-3 font-medium text-slate-200">{log.ward}</td>
                  <td className="py-2.5 px-3 font-medium">{log.action}</td>
                  <td className="py-2.5 px-3 text-slate-400">{log.officer}</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-emerald-400">{log.amount}</td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. BOTTOM ACTION TOOLBAR */}
      <div className="bg-[#0f1f33] border border-[#1e3a5f] rounded-3xl p-5 shadow-2xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <ShieldAlert className="w-7 h-7 text-amber-400" />
          <div>
            <h4 className="text-sm font-bold text-white">
              सत्यापित प्रशासनिक रिकॉर्ड डेस्क • नूरपुर विधानसभा 142
            </h4>
            <p className="text-xs text-slate-400">
              समस्त स्वीकृतियां, आदेश व नागरिक शिकायतें डिजिटल रजिस्टर में सुरक्षित हैं।
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleDownloadAdminHTML}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-md transition"
          >
            Download Admin HTML
          </button>
          <button
            onClick={handleExportJSON}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-md transition"
          >
            Export Daily Report (JSON)
          </button>
          <button
            onClick={handleExportCSV}
            className="bg-[#102a43] hover:bg-[#193b61] text-slate-200 border border-[#1e3a5f] text-xs font-bold px-3 py-2 rounded-xl transition"
          >
            Download CSV Data
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 bg-emerald-600 text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-xl z-50 flex items-center space-x-2 animate-in slide-in-from-bottom duration-200">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Metric Modal */}
      {activeMetricModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-[#0f1f33] rounded-3xl border border-[#1e3a5f] max-w-lg w-full p-6 shadow-2xl space-y-4 text-slate-100">
            <div className="flex items-center justify-between pb-2 border-b border-[#1e3a5f]">
              <h4 className="font-black text-white text-base">
                विस्तृत विश्लेषण ऑडिट
              </h4>
              <button onClick={() => setActiveMetricModal(null)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3 text-xs text-slate-300">
              <p>नूरपुर विधानसभा क्षेत्र में 118 बूथों से प्राप्त संवाद का विस्तृत लेखा-जोखा।</p>
              <div className="grid grid-cols-2 gap-2 bg-[#08101d] p-3 rounded-xl border border-[#1c3856] font-medium">
                <div><b>कुल संवाद:</b> 48,250</div>
                <div><b>औसत समाधान समय:</b> 48 घंटे</div>
                <div><b>संतुष्टि दर:</b> 94.2%</div>
                <div><b>सक्रिय वार्ड:</b> 24 वार्ड</div>
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setActiveMetricModal(null)}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl"
              >
                बंद करें
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Decision Modal */}
      {activeDecisionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-[#0f1f33] rounded-3xl border border-[#1e3a5f] max-w-lg w-full p-6 shadow-2xl space-y-4 text-slate-100">
            <div className="flex items-center justify-between pb-2 border-b border-[#1e3a5f]">
              <h4 className="font-black text-white text-base">
                प्रशासनिक प्रकरण विवरण
              </h4>
              <button onClick={() => setActiveDecisionModal(null)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3 text-xs text-slate-300">
              <p>वार्ड स्तर से प्राप्त तत्काल हस्तक्षेप आवेदन पर प्रशासनिक कार्यवाही निर्देश।</p>
              <div className="bg-[#08101d] p-3 rounded-xl border border-amber-500/30 text-amber-300 space-y-1">
                <div><b>प्रकरण:</b> {activeDecisionModal === 'ward14' ? 'वार्ड 14 जसूर ट्रांसफार्मर' : activeDecisionModal === 'ward8' ? 'वार्ड 8 कोटला पाइपलाइन' : 'वार्ड 19 भदवार दंगा'}</div>
                <div><b>कार्यवाही:</b> आदेश संबंधित विभाग को जारी कर दिया गया है।</div>
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setActiveDecisionModal(null)}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl"
              >
                बंद करें
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ward Modal */}
      {activeWardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-[#0f1f33] rounded-3xl border border-[#1e3a5f] max-w-md w-full p-6 shadow-2xl space-y-4 text-slate-100">
            <div className="flex items-center justify-between pb-2 border-b border-[#1e3a5f]">
              <h4 className="font-black text-white text-base">
                वार्ड जन-संतुष्टि विश्लेषण
              </h4>
              <button onClick={() => setActiveWardModal(null)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="text-xs text-slate-300 space-y-2">
              <div className="bg-[#08101d] p-3 rounded-xl border border-[#1c3856]">
                <b>वार्ड:</b> {activeWardModal.toUpperCase()}
                <p className="mt-1">वार्ड में मुख्य रूप से सड़क व पेयजल योजनाओं पर काम जारी है। पन्ना प्रमुख दल निरंतर जनता के संपर्क में है।</p>
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setActiveWardModal(null)}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl"
              >
                बंद करें
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Citizen Modal */}
      {activeCitizenModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-[#0f1f33] rounded-3xl border border-[#1e3a5f] max-w-md w-full p-6 shadow-2xl space-y-4 text-slate-100">
            <div className="flex items-center justify-between pb-2 border-b border-[#1e3a5f]">
              <h4 className="font-black text-white text-base">
                नागरिक संवाद विवरण
              </h4>
              <button onClick={() => setActiveCitizenModal(null)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="text-xs text-slate-300 space-y-3">
              <p>नागरिक द्वारा प्रस्तुत मूल संवाद:</p>
              <div className="bg-[#08101d] p-3 rounded-xl border border-blue-500/30 text-blue-200 italic">
                "{feedItems.find(f => f.id === activeCitizenModal)?.text}"
              </div>
              <textarea
                placeholder="कार्यालय की ओर से उत्तर लिखें..."
                className="w-full bg-[#08101d] border border-[#1c3856] rounded-xl p-2.5 text-xs text-white placeholder-slate-500"
                rows={3}
                defaultValue="रणबीर सिंह निक्का कार्यालय: आपकी समस्या संबंधित अधिकारी को प्रेषित कर दी गई है। धन्यवाद।"
              />
            </div>
            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setActiveCitizenModal(null)}
                className="bg-[#102a43] text-slate-300 hover:bg-[#163352] font-bold text-xs px-3 py-2 rounded-xl"
              >
                रद्द करें
              </button>
              <button
                onClick={() => {
                  showToast('नागरिक को सफलतापूर्वक उत्तर भेजा गया!');
                  setActiveCitizenModal(null);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2 rounded-xl"
              >
                उत्तर प्रेषित करें
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Padyatra Modal */}
      {isPadyatraModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-[#0f1f33] rounded-3xl border border-[#1e3a5f] max-w-lg w-full p-6 shadow-2xl space-y-4 text-slate-100">
            <div className="flex items-center justify-between pb-2 border-b border-[#1e3a5f]">
              <h4 className="font-black text-white text-base">
                घर-घर निक्का पदयात्रा • लाइव चौपाल डायरी
              </h4>
              <button onClick={() => setIsPadyatraModalOpen(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2 text-xs text-slate-300">
              <div className="bg-emerald-950/40 border border-emerald-500/30 p-2.5 rounded-xl text-emerald-300 font-medium">
                ✓ चौपाल 1: भदवार पंचायत भवन (प्रातः 11:00) — 280 नागरिक उपस्थित • 14 प्रार्थना पत्र निस्तारित
              </div>
              <div className="bg-amber-950/40 border border-amber-500/30 p-2.5 rounded-xl text-amber-300 font-medium">
                ● चौपाल 2: जसूर वार्ड 14 (शाम 04:30) — वर्तमान में जारी • ट्रांसफार्मर व सड़क का स्थल निरीक्षण
              </div>
              <div className="bg-[#08101d] border border-[#1c3856] p-2.5 rounded-xl text-slate-400 font-medium">
                चौपाल 3: खन्नी दुर्गा माता मंदिर प्रांगण (शाम 06:00) — प्रस्तावित
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setIsPadyatraModalOpen(false)}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl"
              >
                बंद करें
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
