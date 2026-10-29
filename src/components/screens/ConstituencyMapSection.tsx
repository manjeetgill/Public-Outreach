import React, { useState } from 'react';
import { 
  MapPin, 
  Layers, 
  Plus, 
  Minus, 
  X, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  ExternalLink,
  ChevronRight,
  Filter
} from 'lucide-react';
import { Language } from '../../types/campaign';
import { MAP_PINS_MOCK, MapPinMock } from '../../data/campaignData';

interface ConstituencyMapSectionProps {
  lang: Language;
  onOpenReportModal?: () => void;
}

export const ConstituencyMapSection: React.FC<ConstituencyMapSectionProps> = ({
  lang,
  onOpenReportModal
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'roads' | 'water' | 'health' | 'education' | 'other'>('all');
  const [activePin, setActivePin] = useState<MapPinMock | null>(MAP_PINS_MOCK[0]); // Default open ward 5 as in mockup
  const [zoomLevel, setZoomLevel] = useState(1);

  const categories = [
    { id: 'all', label: 'सभी', labelEn: 'All', icon: '🌐' },
    { id: 'roads', label: 'सड़कें', labelEn: 'Roads', icon: '🛣️' },
    { id: 'water', label: 'जल आपूर्ति', labelEn: 'Water', icon: '💧' },
    { id: 'health', label: 'स्वास्थ्य', labelEn: 'Healthcare', icon: '➕' },
    { id: 'education', label: 'शिक्षा', labelEn: 'Education', icon: '📄' },
    { id: 'other', label: 'अन्य', labelEn: 'Other', icon: '👥' },
  ];

  const filteredPins = selectedCategory === 'all' 
    ? MAP_PINS_MOCK 
    : MAP_PINS_MOCK.filter(p => p.category === selectedCategory);

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-md p-5 sm:p-7 space-y-5">
      
      {/* Header matching Card 4 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
        <div>
          <h3 className="text-xl sm:text-2xl font-black text-[#102a43]">
            क्षेत्रीय मानचित्र
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            अपने क्षेत्र की समस्याएं और विकास कार्य देखें
          </p>
        </div>
        <div className="flex items-center space-x-2 text-xs">
          <span className="flex items-center space-x-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>पूर्ण कार्य</span>
          </span>
          <span className="flex items-center space-x-1 text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-medium">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <span>प्रगति पर</span>
          </span>
          <span className="flex items-center space-x-1 text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 font-medium">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            <span>शिकायत दर्ज</span>
          </span>
        </div>
      </div>

      {/* Main Map Canvas Area: Left Filter Sidebar + Right Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch min-h-[440px]">
        
        {/* Left Filter by Category Sidebar (3 cols) */}
        <div className="lg:col-span-3 bg-slate-50/80 rounded-2xl border border-slate-200 p-3 space-y-2 flex flex-col justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center space-x-1.5 px-1">
              <Filter className="w-3.5 h-3.5 text-blue-600" />
              <span>Filter by Category</span>
            </div>
            <div className="space-y-1">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id as any)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition ${
                    selectedCategory === cat.id
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/80'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span>{cat.icon}</span>
                    <span>{cat.label}</span>
                  </div>
                  <ChevronRight className={`w-3.5 h-3.5 ${selectedCategory === cat.id ? 'text-white' : 'text-slate-400'}`} />
                </button>
              ))}
            </div>
          </div>

          {/* Quick Lodge Issue in My Ward Button */}
          {onOpenReportModal && (
            <div className="pt-3 border-t border-slate-200">
              <button
                onClick={onOpenReportModal}
                className="w-full py-2 bg-white hover:bg-blue-50 text-blue-700 border border-blue-300 font-bold rounded-xl text-xs transition shadow-2xs text-center"
              >
                + अपने वार्ड की समस्या जोड़ें
              </button>
            </div>
          )}
        </div>

        {/* Right Stylized Interactive GIS Map (9 cols) */}
        <div className="lg:col-span-9 bg-[#edf4fb] rounded-2xl border border-slate-300 relative overflow-hidden flex items-center justify-center min-h-[420px] select-none shadow-inner">
          
          {/* Stylized Topographic Map Background Representation of Nurpur Assembly Constituency */}
          <svg className="w-full h-full absolute inset-0 opacity-80" viewBox="0 0 800 500" preserveAspectRatio="none">
            <defs>
              <pattern id="gridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#d5e3f2" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="800" height="500" fill="#f1f7fd" />
            <rect width="800" height="500" fill="url(#gridPattern)" />

            {/* Hill Contours / River Stream */}
            <path d="M 50 120 Q 200 80, 450 140 T 780 180" fill="none" stroke="#c0d7ed" strokeWidth="8" strokeDasharray="4 2" />
            <path d="M 120 480 Q 300 350, 500 380 T 750 320" fill="none" stroke="#b0d0ec" strokeWidth="12" />
            
            {/* Main Roads Highway Network NH-154 & SH-28 */}
            <path d="M 0 250 Q 220 220, 400 240 T 800 260" fill="none" stroke="#e6c387" strokeWidth="6" />
            <path d="M 280 0 Q 320 220, 390 350 T 440 500" fill="none" stroke="#f6d396" strokeWidth="4" />
            <path d="M 400 240 L 680 120" fill="none" stroke="#f6d396" strokeWidth="3" strokeDasharray="6 3" />
            
            {/* Village / Town Label Texts */}
            <text x="380" y="230" fill="#1e3a5f" fontSize="16" fontWeight="bold" fontFamily="sans-serif">Nurpur (नूरपुर शहर)</text>
            <text x="180" y="270" fill="#5a738e" fontSize="13" fontWeight="bold" fontFamily="sans-serif">Jasur (जसूर)</text>
            <text x="620" y="340" fill="#5a738e" fontSize="13" fontWeight="bold" fontFamily="sans-serif">Kotla (कोटला)</text>
            <text x="650" y="140" fill="#5a738e" fontSize="13" fontWeight="bold" fontFamily="sans-serif">Bhadwar (भदवार)</text>
            <text x="210" y="110" fill="#5a738e" fontSize="12" fontWeight="600" fontFamily="sans-serif">Rehan (रैहन)</text>
            <text x="520" y="440" fill="#5a738e" fontSize="12" fontWeight="600" fontFamily="sans-serif">Sath (सथ)</text>
            <text x="120" y="380" fill="#5a738e" fontSize="12" fontWeight="600" fontFamily="sans-serif">Jakhani (जखानी)</text>
          </svg>

          {/* Interactive Map Pins */}
          {filteredPins.map((pin) => {
            const isSelected = activePin?.id === pin.id;
            const colorClass = pin.status === 'Resolved' 
              ? 'bg-emerald-500 text-white shadow-emerald-400' 
              : pin.status === 'In Progress' 
                ? 'bg-amber-500 text-white shadow-amber-400' 
                : 'bg-rose-500 text-white shadow-rose-400';

            return (
              <div
                key={pin.id}
                onClick={() => setActivePin(pin)}
                style={{ left: `${pin.xPercent}%`, top: `${pin.yPercent}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 group"
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-lg transition-transform ${
                  isSelected ? 'scale-125 ring-4 ring-white ring-offset-2' : 'hover:scale-110'
                } ${colorClass}`}>
                  <MapPin className="w-4 h-4 fill-current" />
                </div>
                <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded whitespace-nowrap shadow-md pointer-events-none">
                  {pin.titleHi}
                </div>
              </div>
            );
          })}

          {/* Interactive Popup on Selected Pin matching exact popup in mockup */}
          {activePin && (
            <div 
              style={{ 
                left: `${Math.min(Math.max(activePin.xPercent, 25), 75)}%`, 
                top: `${Math.min(Math.max(activePin.yPercent - 22, 18), 65)}%` 
              }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-30 bg-white rounded-2xl border border-slate-200 shadow-2xl p-3 max-w-xs w-64 text-xs animate-in fade-in duration-200"
            >
              <div className="flex items-start justify-between pb-1.5 border-b border-slate-100">
                <div>
                  <h5 className="font-black text-slate-900 text-xs sm:text-sm">
                    {activePin.titleHi}
                  </h5>
                  <div className="text-[10px] text-amber-700 font-bold mt-0.5 flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                    <span>स्थिति: {activePin.statusHi}</span>
                  </div>
                  <div className="text-[9px] text-slate-400">
                    रिपोर्ट: {activePin.date}
                  </div>
                </div>
                <button
                  onClick={() => setActivePin(null)}
                  className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="my-2 h-24 rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
                <img
                  src={activePin.image}
                  alt={activePin.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <p className="text-[11px] text-slate-600 leading-tight mb-2">
                {activePin.description}
              </p>

              <div className="flex items-center justify-between text-[10px] pt-1 border-t border-slate-100 font-medium">
                <span className="text-slate-500">{activePin.wardName}</span>
                <span className="text-blue-600 font-bold">कार्यवाही प्रगति पर →</span>
              </div>
            </div>
          )}

          {/* Map Zoom Controls bottom right */}
          <div className="absolute bottom-4 right-4 z-20 flex flex-col space-y-1 bg-white rounded-xl border border-slate-200 shadow-md p-1">
            <button 
              onClick={() => setZoomLevel(prev => Math.min(prev + 0.2, 1.8))}
              className="p-1.5 text-slate-700 hover:bg-slate-100 rounded-lg transition"
              title="Zoom In"
            >
              <Plus className="w-4 h-4" />
            </button>
            <div className="h-px bg-slate-200"></div>
            <button 
              onClick={() => setZoomLevel(prev => Math.max(prev - 0.2, 0.8))}
              className="p-1.5 text-slate-700 hover:bg-slate-100 rounded-lg transition"
              title="Zoom Out"
            >
              <Minus className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
