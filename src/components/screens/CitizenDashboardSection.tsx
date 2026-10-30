import React, { useState } from 'react';
import { 
  FileText, 
  Plus, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  User, 
  Calendar,
  Share2,
  Sparkles
} from 'lucide-react';
import { Language, GrievanceTicket } from '../../types/campaign';
import { CITIZEN_TICKETS_MOCK, CitizenTicketItem } from '../../data/campaignData';

interface CitizenDashboardSectionProps {
  lang: Language;
  onOpenReportModal?: () => void;
  onOpenYojanaModal?: () => void;
  userTickets?: GrievanceTicket[];
}

export const CitizenDashboardSection: React.FC<CitizenDashboardSectionProps> = ({
  lang,
  onOpenReportModal,
  onOpenYojanaModal,
  userTickets = []
}) => {
  const [activeTab, setActiveTab] = useState<'requests' | 'participation' | 'events' | 'profile'>('requests');
  const [ticketsList, setTicketsList] = useState<CitizenTicketItem[]>(CITIZEN_TICKETS_MOCK);

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-md p-5 sm:p-7 space-y-6">
      
      {/* 0. Sarkari Yojana Eligibility Engine Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-2xl p-4 sm:p-5 text-white shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="bg-white/20 backdrop-blur-xs text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-200" />
              <span>AI कल्याणकारी योजना साथी</span>
            </span>
            <span className="text-xs bg-amber-200 text-amber-950 font-black px-2 py-0.5 rounded-full">
              8+ योजनाएं
            </span>
          </div>
          <h4 className="text-base sm:text-lg font-black text-white">
            {lang === 'hi' 
              ? 'पात्रता जांचें: मुझे कौन सी सरकारी योजना मिल सकती है?' 
              : 'Check Welfare Eligibility: Which Government Schemes Apply to Me?'}
          </h4>
          <p className="text-xs text-amber-100 max-w-xl leading-relaxed">
            {lang === 'hi'
              ? 'सुख आश्रय, प्यारी बहना ₹1500, प्राकृतिक खेती, स्वावलंबन और कन्यादान योजना हेतु 3 आसान प्रश्नों में अपनी पात्रता तुरंत जांचें।'
              : 'Instant evaluation for Sukh Aashray, Pyari Behna ₹1500/mo, Prakritik Kheti & Swavalamban in 3 quick questions.'}
          </p>
        </div>
        {onOpenYojanaModal && (
          <button
            onClick={onOpenYojanaModal}
            className="whitespace-nowrap px-4 py-2.5 bg-slate-900 hover:bg-black text-amber-300 font-extrabold text-xs rounded-xl shadow-lg transition active:scale-95 flex items-center gap-1.5 shrink-0"
          >
            <span>{lang === 'hi' ? 'अपनी पात्रता जांचें →' : 'Check Eligibility →'}</span>
          </button>
        )}
      </div>

      {/* Header matching Card 7 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-3">
        <div>
          <h3 className="text-xl sm:text-2xl font-black text-[#102a43]">
            मेरी डैशबोर्ड
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            अपनी दर्ज की गई समस्याएं और अनुरोधों की स्थिति देखें
          </p>
        </div>

        {/* 4 Tabs: मेरे अनुरोध, मेरी भागीदारी, मेरे कार्यक्रम, मेरी प्रोफाइल */}
        <div className="flex items-center space-x-1.5 bg-slate-100/90 p-1 rounded-xl text-xs font-bold overflow-x-auto">
          <button
            onClick={() => setActiveTab('requests')}
            className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
              activeTab === 'requests'
                ? 'bg-[#0066cc] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            मेरे अनुरोध
          </button>
          <button
            onClick={() => setActiveTab('participation')}
            className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
              activeTab === 'participation'
                ? 'bg-[#0066cc] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            मेरी भागीदारी
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
              activeTab === 'events'
                ? 'bg-[#0066cc] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            मेरे कार्यक्रम
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
              activeTab === 'profile'
                ? 'bg-[#0066cc] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            मेरी प्रोफाइल
          </button>
        </div>
      </div>

      {/* Main Table Container matching exact mockup table */}
      <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">टोकन ID</th>
                <th className="py-3 px-4">समस्या विवरण</th>
                <th className="py-3 px-4">दिनांक</th>
                <th className="py-3 px-4 text-right">वर्तमान स्थिति</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              
              {/* Dynamic user added tickets first */}
              {userTickets.map((t) => (
                <tr key={t.token} className="hover:bg-blue-50/40 transition">
                  <td className="py-3.5 px-4 font-mono font-bold text-blue-600">
                    {t.token}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{t.title}</div>
                    <div className="text-[10px] text-slate-400">{t.location}</div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 font-mono">
                    {t.submittedDate}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold px-2.5 py-1 rounded-full">
                      Received
                    </span>
                  </td>
                </tr>
              ))}

              {/* Mock tickets matching Card 7 */}
              {ticketsList.map((ticket) => {
                let badgeClass = 'bg-blue-50 text-blue-700 border-blue-200';
                if (ticket.status === 'In Progress') {
                  badgeClass = 'bg-amber-50 text-amber-700 border-amber-200';
                } else if (ticket.status === 'Resolved') {
                  badgeClass = 'bg-emerald-50 text-emerald-700 border-emerald-200';
                }

                return (
                  <tr key={ticket.id} className="hover:bg-slate-50 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-700">
                      {ticket.id}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{ticket.title}</div>
                      <div className="text-[10px] text-slate-400">{ticket.location}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 font-mono">
                      {ticket.date}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${badgeClass}`}>
                        {ticket.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Action Buttons matching mockup */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <button
          onClick={onOpenReportModal}
          className="bg-[#0066cc] hover:bg-blue-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs transition active:scale-95 flex items-center space-x-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>नई समस्या दर्ज करें</span>
        </button>

        <button
          onClick={() => {}}
          className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center space-x-1 hover:underline"
        >
          <span>सभी देखें</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
};
