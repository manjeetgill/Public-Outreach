import React from 'react';
import { X, Play, Share2, Award, Heart, CheckCircle2 } from 'lucide-react';
import { Language } from '../../types/campaign';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const VideoModal: React.FC<VideoModalProps> = ({ isOpen, onClose, lang }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
      <div className="bg-white rounded-3xl border border-slate-200 max-w-2xl w-full overflow-hidden shadow-2xl space-y-4 animate-in fade-in duration-200">
        
        {/* Header */}
        <div className="p-4 px-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
            <h3 className="font-black text-slate-900 text-sm sm:text-base">
              नूरपुर प्रगति संदेश • विधायक रणबीर सिंह निक्का
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player Mockup Container */}
        <div className="px-6">
          <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-900 border border-slate-300 shadow-md flex items-center justify-center group">
            <img
              src="https://images.unsplash.com/photo-1541888946425-d0fbb18615f8?w=1000&auto=format&fit=crop&q=80"
              alt="Video Thumbnail"
              className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition duration-500"
            />
            
            {/* Play Button Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center space-y-3 bg-black/30">
              <div className="w-16 h-16 rounded-full bg-[#0066cc] text-white flex items-center justify-center shadow-xl hover:scale-110 transition cursor-pointer">
                <Play className="w-7 h-7 fill-white translate-x-0.5" />
              </div>
              <div className="text-center text-white text-xs font-semibold drop-shadow">
                “आपकी आवाज़, हमारी जिम्मेदारी” — 5 वर्ष के विकास कार्यों का वीडियो लेखा-जोखा
              </div>
            </div>

            <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-xs text-white text-[10px] font-mono px-2 py-0.5 rounded">
              HD • 04:35
            </div>
          </div>
        </div>

        {/* Details & CTA */}
        <div className="p-4 px-6 pt-0 flex items-center justify-between text-xs text-slate-600">
          <span className="font-medium">घर-घर निक्का • हर घर निक्का अभियान</span>
          <button
            onClick={onClose}
            className="bg-[#102a43] hover:bg-[#0b1c2e] text-white font-bold text-xs px-5 py-2 rounded-xl transition"
          >
            बंद करें
          </button>
        </div>

      </div>
    </div>
  );
};
