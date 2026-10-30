import React, { useState } from 'react';
import { 
  X, 
  Video, 
  Sparkles, 
  Upload, 
  Play, 
  Film, 
  Image as ImageIcon, 
  Check, 
  AlertCircle, 
  Loader2,
  Ratio
} from 'lucide-react';
import { generateAiVideo } from '../../services/api';
import { Language } from '../../types/campaign';

interface AiVideoStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const AiVideoStudioModal: React.FC<AiVideoStudioModalProps> = ({
  isOpen,
  onClose,
  lang
}) => {
  const [tab, setTab] = useState<'text-to-video' | 'animate-photo'>('animate-photo');
  const [promptText, setPromptText] = useState('नूरपुर के विकास कार्यों पर आधारित प्रेरणादायक चुनावी अभियान वीडियो (Cinematic video showcasing Nurpur development roads and clean water)');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(
    'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=80'
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setIsGenerating(true);
    setStatusMessage(null);
    setErrorMessage(null);

    try {
      const result = await generateAiVideo({
        prompt: promptText,
        imageBase64: tab === 'animate-photo' ? selectedPhoto?.split(',')[1] : undefined,
        aspectRatio
      });

      if (result.success) {
        setStatusMessage(lang === 'hi' ? 'वीडियो उत्पादन सफलतापूर्वक प्रारंभ हुआ!' : 'Video generation initiated successfully!');
      } else {
        setErrorMessage(
          result.error || 
          (lang === 'hi' 
            ? 'gemini-omni-1.1-flash मॉडल के लिए सेटिंग्स में पेड API Key संलग्न होना आवश्यक है।' 
            : 'Gemini Omni Flash model requires a paid API key configured in Settings > Secrets.')
        );
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Generation failed');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#102a43] to-[#1c3d5a] text-white px-5 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-md">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold tracking-wide flex items-center gap-2">
                <span>{lang === 'hi' ? 'AI वीडियो निर्माण केंद्र' : 'AI Video Studio'}</span>
                <span className="text-[10px] bg-amber-400 text-slate-900 font-black px-1.5 py-0.2 rounded">
                  Gemini Omni Flash
                </span>
              </h3>
              <p className="text-[10px] text-slate-300">
                {lang === 'hi' ? 'फोटो से वीडियो एनीमेशन एवं टेक्स्ट-टू-वीडियो' : 'Animate Photos & Generate Videos from Text'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Studio Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          
          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => setTab('animate-photo')}
              className={`py-2 rounded-lg font-bold flex items-center justify-center gap-1.5 transition ${
                tab === 'animate-photo' 
                  ? 'bg-white text-slate-900 shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ImageIcon className="w-4 h-4 text-amber-500" />
              <span>{lang === 'hi' ? 'फोटो को वीडियो बनाएं' : 'Animate Photo into Video'}</span>
            </button>

            <button
              onClick={() => setTab('text-to-video')}
              className={`py-2 rounded-lg font-bold flex items-center justify-center gap-1.5 transition ${
                tab === 'text-to-video' 
                  ? 'bg-white text-slate-900 shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Video className="w-4 h-4 text-blue-500" />
              <span>{lang === 'hi' ? 'टेक्स्ट से वीडियो बनाएं' : 'Generate Video from Text'}</span>
            </button>
          </div>

          {/* Aspect Ratio Selector (16:9 landscape vs 9:16 portrait) */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1.5 flex items-center gap-1">
              <Ratio className="w-3.5 h-3.5 text-slate-500" />
              <span>{lang === 'hi' ? 'वीडियो आस्पेक्ट रेशियो चुनें (Aspect Ratio):' : 'Select Video Aspect Ratio:'}</span>
            </label>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setAspectRatio('16:9')}
                className={`p-2.5 rounded-xl border font-bold flex items-center justify-between transition cursor-pointer ${
                  aspectRatio === '16:9'
                    ? 'border-blue-600 bg-blue-50 text-blue-900 ring-2 ring-blue-300'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-3.5 border-2 border-current rounded-xs shrink-0" />
                  <div className="text-left">
                    <div className="font-black text-xs">16:9 Landscape</div>
                    <div className="text-[10px] text-slate-500">यूट्यूब व टीवी स्क्रीन</div>
                  </div>
                </div>
                {aspectRatio === '16:9' && <Check className="w-4 h-4 text-blue-600" />}
              </button>

              <button
                type="button"
                onClick={() => setAspectRatio('9:16')}
                className={`p-2.5 rounded-xl border font-bold flex items-center justify-between transition cursor-pointer ${
                  aspectRatio === '9:16'
                    ? 'border-blue-600 bg-blue-50 text-blue-900 ring-2 ring-blue-300'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-6 border-2 border-current rounded-xs shrink-0" />
                  <div className="text-left">
                    <div className="font-black text-xs">9:16 Portrait</div>
                    <div className="text-[10px] text-slate-500">इंस्टाग्राम रील्स व व्हाट्सएप</div>
                  </div>
                </div>
                {aspectRatio === '9:16' && <Check className="w-4 h-4 text-blue-600" />}
              </button>
            </div>
          </div>

          {/* Photo Upload / Selection (if animate-photo mode) */}
          {tab === 'animate-photo' && (
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                <Upload className="w-3.5 h-3.5 text-slate-500" />
                <span>{lang === 'hi' ? 'अभियान फोटो अपलोड या चुनें:' : 'Upload Campaign Photo:'}</span>
              </label>

              <div className="relative border-2 border-dashed border-slate-300 rounded-2xl p-3 bg-slate-50 text-center">
                {selectedPhoto ? (
                  <div className="relative group">
                    <img 
                      src={selectedPhoto} 
                      alt="Campaign asset" 
                      className="w-full h-36 object-cover rounded-xl shadow-xs"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition rounded-xl flex items-center justify-center gap-2 text-white font-bold text-xs">
                      <button
                        onClick={() => setSelectedPhoto(null)}
                        className="bg-rose-600 hover:bg-rose-700 px-3 py-1.5 rounded-lg"
                      >
                        हटाएं
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="py-6 flex flex-col items-center justify-center text-slate-400">
                    <Upload className="w-8 h-8 mb-2 text-slate-400" />
                    <p className="font-bold text-slate-700 text-xs">
                      {lang === 'hi' ? 'फोटो खींचें या गैलरी से चुनें' : 'Click to upload campaign photo'}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1">PNG, JPG (Max 10MB)</p>
                    <button
                      type="button"
                      onClick={() => setSelectedPhoto('https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=80')}
                      className="mt-3 text-[11px] text-blue-600 hover:underline font-bold"
                    >
                      + {lang === 'hi' ? 'नमूना फोटो लोड करें' : 'Use sample photo'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Text / Motion Prompt Input */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>
                {tab === 'animate-photo' 
                  ? (lang === 'hi' ? 'एनीमेशन व मोशन निर्देश:' : 'Motion & Cinematic Prompt:') 
                  : (lang === 'hi' ? 'वीडियो प्रॉम्प्ट एवं दृश्य विवरण:' : 'Video Scene Prompt:')}
              </span>
            </label>
            <textarea
              rows={3}
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              placeholder={lang === 'hi' ? 'जैसे: धीमी गति में तिरंगा लहराते हुए, नूरपुर के नए पुल पर गाड़ियां चलते हुए दिखाइए...' : 'e.g. Cinematic drone shot moving forward over Nurpur bridge with fluttering flags...'}
              className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white transition"
            />
          </div>

          {/* Status / Error feedback */}
          {statusMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{statusMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold">{errorMessage}</p>
                <p className="text-[10px] text-amber-700">
                  {lang === 'hi' 
                    ? 'पेड API कुंजी सेटिंग्स > सीक्रेट्स में जोड़कर वीडियो जेनरेशन सक्रिय कर सकते हैं।' 
                    : 'You can enable video generation anytime by connecting a paid key in Settings > Secrets.'}
                </p>
              </div>
            </div>
          )}

          {/* Generate Action Button */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating || (!promptText.trim() && !selectedPhoto)}
            className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md transition active:scale-98"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{lang === 'hi' ? 'AI वीडियो तैयार हो रहा है...' : 'Generating Video via Gemini Omni...'}</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>
                  {tab === 'animate-photo' 
                    ? (lang === 'hi' ? 'फोटो को वीडियो में बदलें (Gemini Omni)' : 'Animate Photo into Video') 
                    : (lang === 'hi' ? 'AI वीडियो बनाएं (Gemini Omni)' : 'Generate Video from Text')}
                </span>
              </>
            )}
          </button>

        </div>

      </div>
    </div>
  );
};
