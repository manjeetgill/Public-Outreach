/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { DesktopNavbar } from './components/web/DesktopNavbar';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { WebFooter } from './components/web/WebFooter';

// Screens
import { HomeScreen } from './components/screens/HomeScreen';
import { HisaabScreen } from './components/screens/HisaabScreen';
import { NivaranScreen } from './components/screens/NivaranScreen';
import { WardsScreen } from './components/screens/WardsScreen';
import { VisionScreen } from './components/screens/VisionScreen';
import { KaryakartaScreen } from './components/screens/KaryakartaScreen';
import { AdminScreen } from './components/screens/AdminScreen';

// Modals
import { LodgeComplaintModal } from './components/modals/LodgeComplaintModal';
import { VoiceDeskModal } from './components/modals/VoiceDeskModal';
import { WhatsAppAgentModal } from './components/modals/WhatsAppAgentModal';
import { VolunteerRegisterModal } from './components/modals/VolunteerRegisterModal';
import { MediaPreviewModal } from './components/modals/MediaPreviewModal';

import { INITIAL_GRIEVANCES } from './data/campaignData';
import { ScreenTab, Language, GrievanceTicket, MediaKitItem } from './types/campaign';
import { fetchGrievances, subscribeToRealtimeGrievances, createGrievance } from './services/api';

export default function App() {
  const [currentTab, setCurrentTab] = useState<ScreenTab>('screen-home');
  const [lang, setLang] = useState<Language>('hi');
  const [isFrameMode, setIsFrameMode] = useState<boolean>(false);

  // Modals state
  const [isComplaintModalOpen, setIsComplaintModalOpen] = useState(false);
  const [isVoiceDeskOpen, setIsVoiceDeskOpen] = useState(false);
  const [isWhatsAppAgentOpen, setIsWhatsAppAgentOpen] = useState(false);
  const [isVolunteerModalOpen, setIsVolunteerModalOpen] = useState(false);
  const [previewMediaItem, setPreviewMediaItem] = useState<MediaKitItem | null>(null);

  // Dynamic grievances state
  const [grievances, setGrievances] = useState<GrievanceTicket[]>(INITIAL_GRIEVANCES);

  // Real-time REST API & Live Sync Integration
  useEffect(() => {
    // 1. Initial REST API load
    fetchGrievances().then((tickets) => {
      if (tickets && tickets.length > 0) {
        setGrievances(tickets);
      }
    });

    // 2. Real-time live sync subscription (SSE / Firestore-aligned sync)
    const unsubscribe = subscribeToRealtimeGrievances((event) => {
      if (event.type === 'SNAPSHOT' && Array.isArray(event.data)) {
        setGrievances(event.data);
      } else if (event.type === 'GRIEVANCE_CREATED' && event.data) {
        setGrievances((prev) => {
          if (prev.some(t => t.token === event.data.token)) return prev;
          return [event.data, ...prev];
        });
      } else if (event.type === 'GRIEVANCE_UPDATED' && event.data) {
        setGrievances((prev) => 
          prev.map(t => t.token === event.data.token ? event.data : t)
        );
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSelectTab = (tab: ScreenTab) => {
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddGrievance = async (newTicket: GrievanceTicket) => {
    // Optimistic local update
    setGrievances((prev) => [newTicket, ...prev]);
    // Persist to REST API backend
    await createGrievance({
      category: newTicket.category,
      title: newTicket.title,
      titleEn: newTicket.titleEn,
      location: newTicket.location,
      wardNo: newTicket.wardNo,
      citizenName: newTicket.citizenName,
      phone: newTicket.phone
    });
  };

  const handleToggleLang = () => {
    setLang((prev) => (prev === 'hi' ? 'en' : 'hi'));
  };

  const handleToggleFrameMode = () => {
    setIsFrameMode((prev) => !prev);
  };

  const handleSelectWardForComplaint = (_wardNumber: number) => {
    setIsComplaintModalOpen(true);
  };

  return (
    <div className="bg-slate-100 min-h-screen text-slate-900 selection:bg-amber-500 selection:text-white font-sans flex flex-col justify-between">
      {isFrameMode ? (
        /* Mobile Preview Frame */
        <div className="min-h-screen py-4 flex justify-center items-start">
          <div className="w-full max-w-[440px] bg-[#f7f9ff] min-h-screen flex flex-col relative shadow-2xl pb-24 border-x border-slate-200 rounded-3xl overflow-hidden">
            <div className="bg-slate-900 text-slate-300 text-[10px] px-3 py-1 flex justify-between items-center">
              <span>📱 Mobile Preview</span>
              <button onClick={handleToggleFrameMode} className="text-amber-400 font-bold hover:underline">
                Switch to Web App ↗
              </button>
            </div>

            <Header 
              lang={lang} 
              onToggleLang={handleToggleLang} 
              isFrameMode={isFrameMode} 
              onToggleFrameMode={handleToggleFrameMode} 
              onOpenVoiceDesk={() => setIsVoiceDeskOpen(true)} 
              onOpenAdmin={() => handleSelectTab(currentTab === 'screen-admin' ? 'screen-home' : 'screen-admin')} 
            />

            <main className="flex-1 overflow-y-auto">
              {currentTab === 'screen-home' && (
                <HomeScreen 
                  onSwitchTab={handleSelectTab} 
                  onOpenComplaintModal={() => setIsComplaintModalOpen(true)} 
                  onOpenVoiceDesk={() => setIsVoiceDeskOpen(true)} 
                  onOpenWhatsAppAgent={() => setIsWhatsAppAgentOpen(true)} 
                  lang={lang} 
                />
              )}
              {currentTab === 'screen-hisaab' && (
                <HisaabScreen lang={lang} />
              )}
              {currentTab === 'screen-nivaran' && (
                <NivaranScreen 
                  onOpenComplaintModal={() => setIsComplaintModalOpen(true)} 
                  grievances={grievances} 
                  lang={lang} 
                />
              )}
              {currentTab === 'screen-wards' && (
                <div className="p-4">
                  <WardsScreen onSelectWardForComplaint={handleSelectWardForComplaint} lang={lang} />
                </div>
              )}
              {currentTab === 'screen-vision' && (
                <div className="p-4">
                  <VisionScreen lang={lang} />
                </div>
              )}
              {currentTab === 'screen-karyakarta' && (
                <KaryakartaScreen 
                  onOpenRegisterModal={() => setIsVolunteerModalOpen(true)} 
                  onOpenMediaModal={(item) => setPreviewMediaItem(item)} 
                  lang={lang} 
                />
              )}
              {currentTab === 'screen-admin' && (
                <div className="p-2">
                  <AdminScreen lang={lang} onBackToOverview={() => handleSelectTab('screen-home')} />
                </div>
              )}
            </main>

            <BottomNav 
              currentTab={currentTab} 
              onSelectTab={handleSelectTab} 
              lang={lang} 
              onOpenComplaintModal={() => setIsComplaintModalOpen(true)} 
            />
          </div>
        </div>
      ) : (
        /* Full Desktop / Wide Web View */
        <div className="min-h-screen flex flex-col justify-between">
          <div>
            <DesktopNavbar 
              currentTab={currentTab} 
              onSelectTab={handleSelectTab} 
              lang={lang} 
              onToggleLang={handleToggleLang} 
              isFrameMode={isFrameMode} 
              onToggleFrameMode={handleToggleFrameMode} 
              onOpenVoiceDesk={() => setIsVoiceDeskOpen(true)} 
              onOpenComplaintModal={() => setIsComplaintModalOpen(true)} 
            />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              {currentTab === 'screen-home' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-8 space-y-6">
                      <HomeScreen 
                        onSwitchTab={handleSelectTab} 
                        onOpenComplaintModal={() => setIsComplaintModalOpen(true)} 
                        onOpenVoiceDesk={() => setIsVoiceDeskOpen(true)} 
                        onOpenWhatsAppAgent={() => setIsWhatsAppAgentOpen(true)} 
                        lang={lang} 
                      />
                    </div>

                    <aside className="lg:col-span-4 space-y-6">
                      {/* Ward Highlights Card */}
                      <div className="bg-gradient-to-br from-[#102a43] to-[#1c3d5a] text-white rounded-2xl p-5 shadow-sm space-y-3">
                        <span className="bg-amber-500 text-slate-950 font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                          नूरपुर वि.स. 142
                        </span>
                        <h3 className="text-base font-extrabold text-white">
                          {lang === 'hi' ? '24 वार्ड सम्पूर्ण विकास रिकॉर्ड' : '24 Wards Comprehensive Record'}
                        </h3>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {lang === 'hi' 
                            ? 'अपने मोहल्ले या वार्ड का फंड आवंटन, पूर्ण कार्य व पन्ना प्रमुख की सूची देखें।' 
                            : 'Explore ward-level fund allocation, finished schemes and grassroots coordinators.'}
                        </p>
                        <button
                          onClick={() => handleSelectTab('screen-wards')}
                          className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold rounded-xl text-xs transition shadow-md"
                        >
                          {lang === 'hi' ? 'वार्ड दर्शन खोलें (Explore All 24 Wards)' : 'Explore 24 Wards'}
                        </button>
                      </div>

                      {/* Vision 2029 Pillars Card */}
                      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                          जन संकल्प पत्र 2024–2029
                        </span>
                        <h4 className="text-sm font-extrabold text-slate-900">
                          {lang === 'hi' ? 'नूरपुर विज़न 2029: 4 मुख्य स्तंभ' : 'Nurpur Vision 2029: 4 Pillars'}
                        </h4>
                        <ul className="text-xs text-slate-600 space-y-1.5">
                          <li className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></span>
                            100-बेड सुपर स्पेशियलिटी अस्पताल
                          </li>
                          <li className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></span>
                            कौशल विकास व आईटी पार्क
                          </li>
                          <li className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></span>
                            फल व सब्जी कोल्ड स्टोरेज चेन
                          </li>
                          <li className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></span>
                            100% सोलर रूफटॉप व हरित ऊर्जा
                          </li>
                        </ul>
                        <button
                          onClick={() => handleSelectTab('screen-vision')}
                          className="w-full py-2 bg-[#102a43] hover:bg-[#0b1b2b] text-white font-bold rounded-xl text-xs transition"
                        >
                          {lang === 'hi' ? 'विज़न 2029 विस्तार से पढ़ें' : 'View Vision Document'}
                        </button>
                      </div>

                      {/* Volunteer Mobilization Card */}
                      <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-200 space-y-2">
                        <h4 className="text-xs font-black text-emerald-950 uppercase tracking-wider">
                          {lang === 'hi' ? 'कार्यकर्ता अभियान' : 'Volunteer Mobilization'}
                        </h4>
                        <p className="text-xs text-emerald-800">
                          {lang === 'hi' 
                            ? 'नूरपुर के 118 पोलिंग बूथों पर युवा व मातृशक्ति कार्यकर्ता दल से जुड़ें।' 
                            : 'Join our team of active volunteers across all 118 polling booths in Nurpur.'}
                        </p>
                        <button
                          onClick={() => setIsVolunteerModalOpen(true)}
                          className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs transition"
                        >
                          {lang === 'hi' ? 'कार्यकर्ता बनें (Join Campaign)' : 'Register as Volunteer'}
                        </button>
                      </div>
                    </aside>
                  </div>
                </div>
              )}

              {currentTab === 'screen-hisaab' && (
                <div className="space-y-6">
                  <HisaabScreen lang={lang} />
                </div>
              )}

              {currentTab === 'screen-nivaran' && (
                <div className="space-y-6">
                  <NivaranScreen 
                    onOpenComplaintModal={() => setIsComplaintModalOpen(true)} 
                    grievances={grievances} 
                    lang={lang} 
                  />
                </div>
              )}

              {currentTab === 'screen-wards' && (
                <div className="space-y-6">
                  <WardsScreen onSelectWardForComplaint={handleSelectWardForComplaint} lang={lang} />
                </div>
              )}

              {currentTab === 'screen-vision' && (
                <div className="space-y-6">
                  <VisionScreen lang={lang} />
                </div>
              )}

              {currentTab === 'screen-karyakarta' && (
                <div className="space-y-6">
                  <KaryakartaScreen 
                    onOpenRegisterModal={() => setIsVolunteerModalOpen(true)} 
                    onOpenMediaModal={(item) => setPreviewMediaItem(item)} 
                    lang={lang} 
                  />
                </div>
              )}

              {currentTab === 'screen-admin' && (
                <div className="space-y-6">
                  <AdminScreen lang={lang} onBackToOverview={() => handleSelectTab('screen-home')} />
                </div>
              )}
            </main>
          </div>

          <WebFooter onSelectTab={handleSelectTab} lang={lang} />
        </div>
      )}

      {/* Global Interactive Modals */}
      <LodgeComplaintModal 
        isOpen={isComplaintModalOpen} 
        onClose={() => setIsComplaintModalOpen(false)} 
        onAddComplaint={handleAddGrievance} 
        lang={lang} 
      />

      <VoiceDeskModal 
        isOpen={isVoiceDeskOpen} 
        onClose={() => setIsVoiceDeskOpen(false)} 
        lang={lang} 
      />

      <WhatsAppAgentModal 
        isOpen={isWhatsAppAgentOpen} 
        onClose={() => setIsWhatsAppAgentOpen(false)} 
        lang={lang} 
      />

      <VolunteerRegisterModal 
        isOpen={isVolunteerModalOpen} 
        onClose={() => setIsVolunteerModalOpen(false)} 
        lang={lang} 
      />

      <MediaPreviewModal 
        item={previewMediaItem} 
        onClose={() => setPreviewMediaItem(null)} 
        lang={lang} 
      />
    </div>
  );
}
