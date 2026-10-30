import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  Share2, 
  FileText, 
  Sparkles, 
  Clock, 
  ChevronDown, 
  ChevronUp,
  Radio,
  RotateCcw
} from 'lucide-react';
import { Language, DailyBulletinData } from '../../types/campaign';

interface DailyJanvaniPlayerProps {
  lang: Language;
}

export const DailyJanvaniPlayer: React.FC<DailyJanvaniPlayerProps> = ({ lang }) => {
  const [bulletin, setBulletin] = useState<DailyBulletinData | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSeconds, setPlaybackSeconds] = useState(0);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [isTranscriptOpen, setIsTranscriptOpen] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isSynthesizing, setIsSynthesizing] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<any>(null);

  // Fetch bulletin metadata
  useEffect(() => {
    fetch('/api/ai/daily-bulletin')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.bulletin) {
          setBulletin(data.bulletin);
        }
      })
      .catch(err => console.warn('Bulletin fetch error:', err));
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const handleTogglePlay = async () => {
    if (isPlaying) {
      // Pause
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (timerRef.current) clearInterval(timerRef.current);
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsPlaying(false);
      return;
    }

    // Start playback
    setIsPlaying(true);

    // If audio is not yet generated, fetch from server synthesis or use speech synthesis
    if (!audioUrl) {
      setIsSynthesizing(true);
      try {
        const res = await fetch('/api/ai/daily-bulletin/synthesize', { method: 'POST' });
        const data = await res.json();
        if (data.success && data.audioBase64) {
          const url = `data:${data.mimeType || 'audio/wav'};base64,${data.audioBase64}`;
          setAudioUrl(url);
          const audio = new Audio(url);
          audio.playbackRate = playbackRate;
          audioRef.current = audio;
          audio.play().catch(() => playSpeechFallback());
          audio.onended = () => {
            setIsPlaying(false);
            setPlaybackSeconds(0);
            if (timerRef.current) clearInterval(timerRef.current);
          };
        } else {
          playSpeechFallback();
        }
      } catch {
        playSpeechFallback();
      } finally {
        setIsSynthesizing(false);
      }
    } else if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
      audioRef.current.play().catch(() => playSpeechFallback());
    }

    // Start progress timer
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setPlaybackSeconds(prev => {
        if (prev >= 58) {
          clearInterval(timerRef.current);
          setIsPlaying(false);
          return 0;
        }
        return prev + 1;
      });
    }, 1000 / playbackRate);
  };

  const playSpeechFallback = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window && bulletin) {
      window.speechSynthesis.cancel();
      const text = `नमस्ते नूरपुर! यह है आज की 60-सेकंड नूरपुर जनवाणी बुलेटिन। ${bulletin.scheduleSummary} आज का मुख्य विकास: ${bulletin.solvedGrievanceHighlight} किसान सलाह: ${bulletin.farmerAdvisory} घर-घर निक्का, हर घर निक्का।`;
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = 'hi-IN';
      utter.rate = playbackRate;
      utter.onend = () => {
        setIsPlaying(false);
        setPlaybackSeconds(0);
        if (timerRef.current) clearInterval(timerRef.current);
      };
      window.speechSynthesis.speak(utter);
    }
  };

  const handleToggleRate = () => {
    const nextRate = playbackRate === 1 ? 1.25 : playbackRate === 1.25 ? 1.5 : 1;
    setPlaybackRate(nextRate);
    if (audioRef.current) {
      audioRef.current.playbackRate = nextRate;
    }
  };

  const handleShareWhatsApp = () => {
    if (!bulletin) return;
    const text = `🎙️ *नूरपुर जनवाणी: 60-सेकंड दैनिक वॉइस कैप्सूल*\nदिनांक: ${bulletin.date}\n\n📢 *आज की मुख्य बातें:* \n• ${bulletin.scheduleSummary}\n\n✅ *निवारण समाचार:* \n• ${bulletin.solvedGrievanceHighlight}\n\n🌾 *किसान सलाह:* \n• ${bulletin.farmerAdvisory}\n\nपूरा ऑडियो बुलेटिन सुनें: Janadesh Civic App`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  if (!bulletin) return null;

  return (
    <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-2xl p-3 sm:p-4 text-slate-950 shadow-md border-2 border-amber-300 relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-white/20 rounded-full blur-xl pointer-events-none"></div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 relative z-10">
        
        {/* Left: Capsule Identity */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-950 text-amber-400 flex items-center justify-center shrink-0 shadow-md">
            <Radio className="w-5 h-5 animate-pulse text-amber-400" />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="bg-slate-950 text-amber-300 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                नूरपुर जनवाणी
              </span>
              <span className="text-[11px] font-bold text-slate-900">
                60s डेली वॉइस कैप्सूल
              </span>
            </div>
            <h4 className="text-xs sm:text-sm font-extrabold text-slate-950 mt-0.5 leading-tight line-clamp-1">
              {bulletin.headline}
            </h4>
          </div>
        </div>

        {/* Right: Audio Player Controls */}
        <div className="flex items-center gap-2 self-stretch sm:self-auto justify-between sm:justify-end">
          {/* Progress Timer */}
          <div className="text-[11px] font-mono font-black text-slate-900 bg-white/40 px-2 py-1 rounded-lg">
            0:{playbackSeconds.toString().padStart(2, '0')} / 0:58
          </div>

          {/* Speed Toggle */}
          <button
            onClick={handleToggleRate}
            className="text-[11px] font-black bg-white/50 hover:bg-white/80 px-2 py-1 rounded-lg transition cursor-pointer"
            title="स्पीड बदलें"
          >
            {playbackRate}x
          </button>

          {/* Play / Pause Primary Button */}
          <button
            onClick={handleTogglePlay}
            disabled={isSynthesizing}
            className="px-4 py-2 bg-slate-950 hover:bg-slate-900 text-amber-400 font-black rounded-xl text-xs flex items-center gap-1.5 shadow-md transition transform active:scale-95 cursor-pointer shrink-0"
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>रोकें</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{isSynthesizing ? 'तैयार हो रहा है...' : 'सुनें (Listen)'}</span>
              </>
            )}
          </button>

          {/* Transcript & WhatsApp Share */}
          <button
            onClick={() => setIsTranscriptOpen(!isTranscriptOpen)}
            className="p-2 bg-white/40 hover:bg-white/70 rounded-xl transition cursor-pointer"
            title="लिखित बुलेटिन पढ़ें"
          >
            <FileText className="w-4 h-4 text-slate-950" />
          </button>

          <button
            onClick={handleShareWhatsApp}
            className="p-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl transition shadow-xs cursor-pointer"
            title="व्हाट्सएप पर शेयर करें"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Waveform Animation when playing */}
      {isPlaying && (
        <div className="flex items-center gap-1 mt-2.5 pt-2 border-t border-slate-950/20">
          <span className="text-[10px] font-bold text-slate-900">ऑडियो प्रसारण चालू:</span>
          <div className="flex items-end gap-1 h-3 ml-2">
            {[40, 90, 60, 100, 75, 45, 80, 50, 95, 65, 30, 85].map((h, i) => (
              <span
                key={i}
                className="w-1 bg-slate-950 rounded-full animate-pulse"
                style={{ height: `${h}%`, animationDelay: `${i * 0.08}s` }}
              ></span>
            ))}
          </div>
        </div>
      )}

      {/* Transcript Drawer */}
      {isTranscriptOpen && (
        <div className="mt-3 pt-3 border-t border-slate-950/20 text-xs text-slate-950 bg-white/40 p-3 rounded-xl space-y-2 animate-fadeIn">
          <div className="flex items-center justify-between font-bold">
            <span>लिखित सारांश (Bulletin Transcript):</span>
            <span className="text-[10px] text-slate-800">{bulletin.date}</span>
          </div>
          <div className="space-y-1.5 text-[11px] leading-relaxed">
            <p><strong>1. आज का कार्यक्रम:</strong> {bulletin.scheduleSummary}</p>
            <p><strong>2. जनसमस्या निवारण:</strong> {bulletin.solvedGrievanceHighlight}</p>
            <p><strong>3. कृषि व मौसम सलाह:</strong> {bulletin.farmerAdvisory}</p>
          </div>
        </div>
      )}
    </div>
  );
};
