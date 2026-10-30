import React, { useState } from 'react';
import { 
  X, 
  Search, 
  Share2, 
  Printer, 
  MapPin, 
  CheckCircle, 
  QrCode, 
  ExternalLink,
  ShieldCheck,
  User,
  Vote
} from 'lucide-react';
import { VoterSlipData, Language } from '../../types/campaign';
import { MLA_INFO } from '../../data/campaignData';
import { lookupVoterSlip, generateVoterWhatsAppMessage, EnrichedVoterRecord } from '../../services/voterLookup';

interface VoterSlipModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const VoterSlipModal: React.FC<VoterSlipModalProps> = ({
  isOpen,
  onClose,
  lang
}) => {
  const [searchQuery, setSearchQuery] = useState('HP/142/089421');
  const [slipData, setSlipData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  if (!isOpen) return null;

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setHasSearched(true);
    try {
      const data = await lookupVoterSlip(searchQuery.trim());
      setSlipData(data);
    } catch (err) {
      console.error('Failed to lookup slip:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShareWhatsApp = () => {
    if (!slipData) return;
    const voter = slipData;
    const station = voter.pollingStationName || voter.boothName;
    const lat = voter.lat || voter.gpsCoordinates?.lat || 32.3021;
    const lng = voter.lng || voter.gpsCoordinates?.lng || 75.8920;
    const shareText = `*विधानसभा 142 नूरपुर • डिजिटल मतदाता पर्ची*\n\n👤 *मतदाता:* ${voter.name}\n🔢 *क्रम संख्या (Serial No):* ${voter.serialNo}\n🏛️ *मतदान केंद्र:* ${station}\n📍 *बूथ का रास्ता (Google Maps):* https://maps.google.com/?q=${lat},${lng}\n\n*जनसेवक रणबीर सिंह निक्का* - मतदान अवश्य करें!`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  const handlePrint = () => {
    window.print();
  };


  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#102a43] to-[#1c3d5a] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500 text-slate-950 rounded-xl font-black">
              <Vote className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white">
                {lang === 'hi' ? 'डिजिटल मतदाता पर्ची (Voter Slip)' : 'Digital Voter Slip Generator'}
              </h3>
              <p className="text-[11px] text-slate-300">
                142 नूरपुर विधानसभा • मतदान केंद्र एवं मार्ग दर्शन
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="बंद करें (Close Modal)"
            className="text-slate-300 hover:text-white p-1 rounded-lg hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-5 space-y-4">
          {/* Search Box */}
          <form onSubmit={handleSearch} className="space-y-2">
            <label className="text-xs font-bold text-slate-700 block">
              {lang === 'hi' ? 'वोटर आईडी (EPIC) / मोबाइल / नाम दर्ज करें:' : 'Enter EPIC / Mobile / Name:'}
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="उदा. HP/142/089421 या 9816012345 या राकेश"
                  className="w-full pl-9 pr-3 py-2 text-xs font-semibold rounded-xl border border-slate-300 focus:outline-hidden focus:border-amber-500 bg-slate-50 text-slate-900"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 disabled:bg-slate-400 text-slate-950 font-black rounded-xl text-xs transition shadow-xs cursor-pointer shrink-0"
              >
                {isLoading ? 'खोज रहे हैं...' : 'पर्ची देखें'}
              </button>
            </div>

            {/* Quick demo links */}
            <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500">
              <span className="font-bold">त्वरित खोज:</span>
              <button
                type="button"
                onClick={() => { setSearchQuery('HP/142/089421'); }}
                className="text-sky-700 font-bold hover:underline bg-slate-100 px-2 py-0.5 rounded cursor-pointer"
              >
                HP/142/089421 (भदवार)
              </button>
              <button
                type="button"
                onClick={() => { setSearchQuery('HP/142/076110'); }}
                className="text-sky-700 font-bold hover:underline bg-slate-100 px-2 py-0.5 rounded cursor-pointer"
              >
                HP/142/076110 (जसूर)
              </button>
              <button
                type="button"
                onClick={() => { setSearchQuery('HP/142/054320'); }}
                className="text-sky-700 font-bold hover:underline bg-slate-100 px-2 py-0.5 rounded cursor-pointer"
              >
                HP/142/054320 (रेहन)
              </button>
            </div>
          </form>

          {/* Printable Digital Voter Slip UI */}
          {slipData ? (
            <div className="space-y-3">
              {/* Actual Printable Ticket */}
              <div 
                id="printable-voter-slip"
                className="bg-white border-2 border-slate-900 rounded-2xl p-4 shadow-md text-slate-900 relative overflow-hidden"
              >
                {/* Tiranga Accent Strip */}
                <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 via-slate-200 to-green-600 mb-3 rounded-full"></div>

                {/* Official Banner Header */}
                <div className="border-b-2 border-slate-900 pb-2.5 mb-3 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <img 
                      src={MLA_INFO.photoUrl} 
                      alt={MLA_INFO.name} 
                      className="w-12 h-12 rounded-full object-cover border-2 border-amber-500 shrink-0 shadow-xs" 
                    />
                    <div>
                      <span className="bg-amber-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-sm uppercase tracking-wider">
                        🇮🇳 आधिकारिक मतदाता सूचना पर्ची
                      </span>
                      <h4 className="text-sm font-black text-slate-950 mt-0.5">
                        {slipData.assemblyConstituency}
                      </h4>
                      <p className="text-[10px] text-slate-600 font-bold">
                        विधायक: {MLA_INFO.name} (जनसेवक)
                      </p>
                    </div>
                  </div>

                  <div className="w-12 h-12 bg-slate-100 border border-slate-300 rounded-lg flex flex-col items-center justify-center p-1 text-center shrink-0">
                    <QrCode className="w-6 h-6 text-slate-800" />
                    <span className="text-[7px] font-mono font-bold text-slate-600">सत्यापित</span>
                  </div>
                </div>

                {/* Voter Demographics */}
                <div className="grid grid-cols-2 gap-2 text-xs border-b border-dashed border-slate-300 pb-3 mb-3">
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold block">मतदाता का नाम:</span>
                    <span className="text-xs font-black text-slate-950">{slipData.name}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold block">क्रम संख्या (Serial No):</span>
                    <span className="text-sm font-black text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300 inline-block">
                      #{slipData.serialNo}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold block">पिता / पति का नाम:</span>
                    <span className="text-xs font-bold text-slate-800">{slipData.guardianName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold block">भाग संख्या (Part No):</span>
                    <span className="text-xs font-bold text-slate-800">भाग {slipData.partNo}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold block">मकान सं. / वार्ड:</span>
                    <span className="text-xs font-bold text-slate-800">{slipData.houseNo} (वार्ड {slipData.wardNo})</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold block">EPIC / वोटर आईडी:</span>
                    <span className="text-xs font-mono font-black text-slate-950 bg-slate-100 px-1.5 py-0.5 rounded">
                      {slipData.epicNo}
                    </span>
                  </div>
                </div>

                {/* Polling Station & Navigation */}
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 space-y-1.5">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
                        आवंटित मतदान केंद्र (Polling Station)
                      </span>
                      <p className="text-xs font-extrabold text-slate-900 leading-snug">
                        {slipData.boothName}
                      </p>
                      <p className="text-[11px] text-slate-600 font-bold mt-0.5">
                        {slipData.roomNo}
                      </p>
                    </div>
                  </div>

                  <a
                    href={slipData.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1.5 text-xs font-extrabold text-sky-700 hover:text-sky-800 bg-sky-50 hover:bg-sky-100 px-3 py-1.5 rounded-lg border border-sky-200 transition"
                  >
                    <span>गूगल मैप्स पर पोलिंग बूथ देखें (Live GPS)</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                {/* Footer Note */}
                <div className="mt-3 text-[10px] text-center text-slate-500 border-t border-slate-200 pt-2 font-medium">
                  कृपया मतदान के दिन अपना पहचान पत्र (आधार / वोटर कार्ड / ड्राइविंग लाइसेंस) साथ लाएं।
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleShareWhatsApp}
                  className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-xs flex items-center justify-center gap-2 transition shadow-md cursor-pointer"
                >
                  <Share2 className="w-4 h-4" />
                  <span>व्हाट्सएप पर शेयर करें</span>
                </button>

                <button
                  type="button"
                  onClick={handlePrint}
                  className="py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-amber-400 font-extrabold rounded-xl text-xs flex items-center justify-center gap-2 transition shadow-md cursor-pointer border border-slate-700"
                >
                  <Printer className="w-4 h-4 text-amber-400" />
                  <span>पर्ची प्रिंट करें</span>
                </button>
              </div>
            </div>
          ) : hasSearched && !isLoading ? (
            <div className="p-6 text-center bg-slate-50 rounded-2xl border border-slate-200 text-slate-600 text-xs">
              इस विवरण से कोई मतदाता पर्ची नहीं मिली। कृपया सही EPIC या मोबाइल नंबर दर्ज करें।
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
