import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  ArrowRight, 
  Share2, 
  CheckCircle,
  Video,
  FileText,
  UserCheck
} from 'lucide-react';
import { Language } from '../../types/campaign';
import { EVENTS_LIST_MOCK, EventItemMock } from '../../data/campaignData';

interface EventsUpdatesSectionProps {
  lang: Language;
  onOpenEventModal?: (event: EventItemMock) => void;
}

export const EventsUpdatesSection: React.FC<EventsUpdatesSectionProps> = ({
  lang,
  onOpenEventModal
}) => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'news' | 'video'>('upcoming');
  const [registeredEventId, setRegisteredEventId] = useState<string | null>(null);

  const handleRegister = (e: React.MouseEvent, event: EventItemMock) => {
    e.stopPropagation();
    if (onOpenEventModal) {
      onOpenEventModal(event);
    } else {
      setRegisteredEventId(event.id);
      setTimeout(() => setRegisteredEventId(null), 4000);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-md p-5 sm:p-7 space-y-6">
      
      {/* Header matching Card 5 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-3">
        <div>
          <h3 className="text-xl sm:text-2xl font-black text-[#102a43]">
            कार्यक्रम एवं अपडेट
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            विधायक जनसंवाद, चौपाल, स्वास्थ्य शिविर व विकासात्मक बैठकों का आधिकारिक कैलेंडर
          </p>
        </div>

        {/* 4 Tabs: आगामी कार्यक्रम, पिछले कार्यक्रम, समाचार, वीडियो */}
        <div className="flex items-center space-x-1.5 bg-slate-100/90 p-1 rounded-xl text-xs font-bold overflow-x-auto">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
              activeTab === 'upcoming'
                ? 'bg-[#0066cc] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            आगामी कार्यक्रम
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
              activeTab === 'past'
                ? 'bg-[#0066cc] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            पिछले कार्यक्रम
          </button>
          <button
            onClick={() => setActiveTab('news')}
            className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
              activeTab === 'news'
                ? 'bg-[#0066cc] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            समाचार
          </button>
          <button
            onClick={() => setActiveTab('video')}
            className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
              activeTab === 'video'
                ? 'bg-[#0066cc] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            वीडियो
          </button>
        </div>
      </div>

      {/* Toast confirmation for registration */}
      {registeredEventId && (
        <div className="bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-xl p-3 text-xs flex items-center space-x-2 font-medium">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>कार्यक्रम हेतु आपका स्थान सफलतापूर्वक आरक्षित कर लिया गया है!</span>
        </div>
      )}

      {/* 3 Event Cards matching mockup */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {EVENTS_LIST_MOCK.map((ev, idx) => (
          <div
            key={ev.id}
            className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs hover:shadow-md transition flex flex-col justify-between group"
          >
            <div className="space-y-3">
              {/* Date Badge + Image Header */}
              <div className="flex items-start space-x-3">
                <div className="bg-rose-50 border border-rose-200 text-rose-700 rounded-xl p-2 text-center shrink-0 w-14">
                  <div className="text-xl font-black leading-none">{ev.day}</div>
                  <div className="text-[10px] font-bold mt-0.5 uppercase tracking-wider">{ev.month}</div>
                </div>

                <div className="h-14 w-28 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 shrink-0">
                  <img
                    src={ev.image}
                    alt={ev.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition"
                  />
                </div>
              </div>

              <div>
                <h4 className="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition">
                  {ev.title}
                </h4>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                  {ev.description}
                </p>
              </div>

              <div className="space-y-1 text-[11px] text-slate-600 font-medium">
                <div className="flex items-center space-x-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{ev.time}</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{ev.venue}</span>
                </div>
              </div>
            </div>

            {/* Bottom Button matching mockup */}
            <div className="pt-3 border-t border-slate-100 mt-3">
              {idx === 0 ? (
                <button
                  onClick={(e) => handleRegister(e, ev)}
                  className="w-full py-2 bg-[#0066cc] hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition shadow-2xs text-center"
                >
                  पंजीकरण करें
                </button>
              ) : (
                <button
                  onClick={(e) => handleRegister(e, ev)}
                  className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold rounded-xl text-xs transition text-center"
                >
                  अधिक जानकारी
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
