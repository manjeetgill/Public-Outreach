import React, { useState } from 'react';
import { X, Play, Pause, Download, Volume2, FileText, Image as ImageIcon, Music, Check } from 'lucide-react';
import { MediaKitItem, Language } from '../../types/campaign';

interface MediaPreviewModalProps {
  item: MediaKitItem | null;
  onClose: () => void;
  lang: Language;
}

export const MediaPreviewModal: React.FC<MediaPreviewModalProps> = ({ item, onClose, lang }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  if (!item) return null;

  const handleDownload = () => {
    // Simulate download complete state
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/75 backdrop-blur-sm flex items-center justify-center p-3">
      <div className="bg-white w-full max-w-sm rounded-3xl p-5 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 space-y-4">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-orange-100 text-orange-600">
              {item.type === 'image' && <ImageIcon className="w-5 h-5" />}
              {item.type === 'audio' && <Music className="w-5 h-5" />}
              {item.type === 'pdf' && <FileText className="w-5 h-5" />}
            </span>
            <div>
              <h3 className="text-xs font-extrabold text-[#102a43] line-clamp-1">
                {lang === 'hi' ? item.title : item.titleEn}
              </h3>
              <p className="text-[10px] text-slate-500">{item.dimensionsOrFormat}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Preview */}
        {item.type === 'image' && (
          <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-950 aspect-[9/14] flex flex-col items-center justify-center p-4 text-center">
            {/* Poster graphic mockup */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#102a43] via-[#0b1b2b] to-[#ea580c]/60"></div>
            <div className="relative z-10 space-y-3">
              <span className="text-[10px] font-black bg-amber-500 text-slate-950 px-2 py-0.5 rounded-full uppercase tracking-wider">
                नूरपुर वि.स. 142
              </span>
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDgnPad_M4eB_fy1Ehj3vnwKyrhb20mnByuc8sRcNz8GMcF0SsnonhWyrBYpIjiAvbekdpshkQyg84ieICet6mc5gZraFsrvege6p4Hud8HFcOIFBLhwiN-F0QGuDIwvpmObjsjWWCGBZtCfTfJx-XY9mV_j8J-DrSPrVyX6iJb5g5g09zw0uI3EOtrHdBo0rqA_lFzlqQem_wQL1_RIMmvS8WpDUo4w5OL9Zit1SKponYTJW4iP1Oa" 
                alt="Ranbir Singh Nikka"
                className="w-24 h-24 rounded-2xl object-cover border-2 border-amber-400 mx-auto shadow-2xl"
              />
              <h4 className="text-lg font-black text-white">रणबीर सिंह निक्का</h4>
              <p className="text-xs text-amber-300 font-bold">"घर-घर निक्का, हर घर निक्का"</p>
              <div className="text-[10px] text-slate-200 bg-white/10 p-2 rounded-xl border border-white/20">
                148+ विकास कार्य • जनसेवा ही संकल्प
              </div>
            </div>
          </div>
        )}

        {item.type === 'audio' && (
          <div className="bg-[#102a43] text-white rounded-2xl p-5 text-center space-y-4 shadow-inner">
            <div className="w-16 h-16 rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center mx-auto text-amber-300">
              <Music className="w-8 h-8 animate-pulse" />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-white">आधिकारिक चुनावी धुन (Dholak Anthem)</h4>
              <p className="text-[11px] text-amber-300 mt-1">"निक्का जी की जय जयकार, नूरपुर में विकास बहार"</p>
            </div>

            {/* Simulated audio waveforms */}
            <div className="flex items-center justify-center gap-1.5 h-8">
              {[30, 60, 90, 70, 100, 45, 80, 55, 95, 65, 40].map((h, i) => (
                <div 
                  key={i} 
                  className={`w-1 rounded-full ${isPlaying ? 'bg-amber-400 animate-pulse' : 'bg-slate-500'}`}
                  style={{ height: `${isPlaying ? h : 20}%` }}
                />
              ))}
            </div>

            <div className="flex items-center justify-center gap-3">
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-12 h-12 rounded-full bg-amber-500 text-slate-950 font-bold flex items-center justify-center hover:bg-amber-400 transition shadow-lg"
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
              </button>
            </div>
          </div>
        )}

        {item.type === 'pdf' && (
          <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-red-600 font-bold">
              <FileText className="w-4 h-4" />
              <span>5-Year Development Report 2022-2027</span>
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              इस पुस्तिका में नूरपुर विधानसभा क्षेत्र के सभी 24 वार्डों में पूर्ण हुए सड़क, जल, शिक्षा और स्वास्थ्य योजनाओं का वित्तीय ब्योरा मय स्वीकृति पत्र क्रमांक संकलित है।
            </p>
            <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-[10px] text-slate-500 flex justify-between">
              <span>पृष्ठ संख्या: 4 (रंगीन)</span>
              <span>आकार: A4 प्रिंटेबल</span>
            </div>
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={handleDownload}
          className="w-full py-2.5 bg-[#102a43] hover:bg-[#0b1b2b] text-white font-extrabold rounded-xl text-xs flex items-center justify-center gap-2 transition shadow-md"
        >
          {downloaded ? <Check className="w-4 h-4 text-emerald-400" /> : <Download className="w-4 h-4" />}
          {downloaded ? (lang === 'hi' ? 'डाउनलोड पूरा हुआ!' : 'Downloaded!') : (lang === 'hi' ? 'डाउनलोड करें (Download File)' : 'Download Media')}
        </button>

      </div>
    </div>
  );
};
