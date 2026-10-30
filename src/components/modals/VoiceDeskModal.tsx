import React, { useState, useEffect, useRef } from 'react';
import { X, PhoneCall, PhoneOff, Mic, MicOff, Volume2, Sparkles, MessageSquare, Loader2 } from 'lucide-react';
import { Language } from '../../types/campaign';
import { transcribeAudio, sendChatMessage, synthesizeSpeech } from '../../services/api';

interface VoiceDeskModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const VoiceDeskModal: React.FC<VoiceDeskModalProps> = ({ isOpen, onClose, lang }) => {
  const [callState, setCallState] = useState<'connecting' | 'connected' | 'ended'>('connecting');
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: 'ai' | 'user'; text: string; time: string }>>([
    {
      sender: 'ai',
      text: lang === 'hi' 
        ? 'नमस्ते! विधायक रणबीर सिंह निक्का जी के 24x7 AI वॉयस सेवा डेस्क में आपका स्वागत है। माइक दबाकर अपनी समस्या या प्रश्न बोलें।' 
        : 'Namaste! Welcome to MLA Ranbir Singh Nikka 24x7 Voice Desk. Tap the microphone and speak your query.',
      time: '00:01'
    }
  ]);
  const [callDuration, setCallDuration] = useState(1);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setCallState('connecting');
      setCallDuration(1);
      return;
    }

    const timer = setTimeout(() => {
      setCallState('connected');
    }, 1200);

    const interval = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const formatDuration = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const [speechProvider, setSpeechProvider] = useState<'sarvam' | 'gemini'>('sarvam');
  const [dialectMode, setDialectMode] = useState<'kangri' | 'standard_hindi'>('kangri');

  const playVoiceResponse = async (text: string) => {
    try {
      const audioUrl = await synthesizeSpeech(text, 'Aoede', speechProvider);
      if (currentAudioRef.current) currentAudioRef.current.pause();
      const audio = new Audio(audioUrl);
      currentAudioRef.current = audio;
      await audio.play();
    } catch {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'hi-IN';
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  const speakQuery = async (userText: string, aiResponse?: string) => {
    const currentTime = formatDuration(callDuration);
    setMessages((prev) => [
      ...prev,
      { sender: 'user', text: userText, time: currentTime }
    ]);

    setIsProcessing(true);
    let reply = aiResponse;
    if (!reply) {
      try {
        reply = await sendChatMessage([{ role: 'user', content: userText }], lang);
      } catch {
        reply = lang === 'hi' 
          ? 'आपकी बात दर्ज कर ली गई है। विधायक कैंप ऑफिस टीम जल्द आपसे संपर्क करेगी।' 
          : 'Your voice note has been recorded. Camp Office squad will reach out soon.';
      }
    }

    setMessages((prev) => [
      ...prev,
      { sender: 'ai', text: reply || '', time: currentTime }
    ]);
    setIsProcessing(false);
    if (reply) playVoiceResponse(reply);
  };

  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach(t => t.stop());
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setIsProcessing(true);
        try {
          const transcribed = await transcribeAudio(audioBlob, {
            dialectMode,
            speechProvider
          });
          if (transcribed && transcribed.trim()) {
            await speakQuery(transcribed.trim());
          }
        } catch (err) {
          console.error('Transcription error in voice desk:', err);
        } finally {
          setIsProcessing(false);
          setIsRecording(false);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch {
      alert(lang === 'hi' ? 'माइक्रोफोन की अनुमति दें।' : 'Please allow microphone access.');
    }
  };

  const stopVoiceRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
  };

  const handleEndCall = () => {
    if (currentAudioRef.current) currentAudioRef.current.pause();
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setCallState('ended');
    setTimeout(() => {
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3">
      <div className="bg-[#0b1b2b] text-white w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-slate-700 relative overflow-hidden flex flex-col h-[560px]">
        
        {/* Background glow */}
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Top bar */}
        <div className="flex items-center justify-between text-xs text-slate-400 mb-4 z-10">
          <span className="flex items-center gap-1.5 font-bold text-amber-400">
            <Sparkles className="w-3.5 h-3.5" />
            24x7 Interactive Voice AI Desk
          </span>
          <button 
            onClick={handleEndCall}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Candidate & Desk avatar */}
        <div className="text-center my-auto flex flex-col items-center z-10">
          <div className="relative mb-3">
            <div className={`w-20 h-20 rounded-2xl overflow-hidden border-2 border-amber-400 shadow-xl ${
              callState === 'connected' ? 'ring-4 ring-emerald-500/30' : 'animate-pulse'
            }`}>
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDgnPad_M4eB_fy1Ehj3vnwKyrhb20mnByuc8sRcNz8GMcF0SsnonhWyrBYpIjiAvbekdpshkQyg84ieICet6mc5gZraFsrvege6p4Hud8HFcOIFBLhwiN-F0QGuDIwvpmObjsjWWCGBZtCfTfJx-XY9mV_j8J-DrSPrVyX6iJb5g5g09zw0uI3EOtrHdBo0rqA_lFzlqQem_wQL1_RIMmvS8WpDUo4w5OL9Zit1SKponYTJW4iP1Oa" 
                alt="Voice AI Desk"
                className="w-full h-full object-cover"
              />
            </div>
            {callState === 'connected' && (
              <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-[#0b1b2b] flex items-center justify-center text-[10px]">
                <Volume2 className="w-3 h-3 text-white" />
              </span>
            )}
          </div>

          <h3 className="text-base font-extrabold text-white">
            नूरपुर जनसंवाद वॉयस AI
          </h3>
          <p className="text-xs text-slate-300 mt-0.5">
            विधायक रणबीर सिंह निक्का हेल्पलाइन
          </p>

          <div className="mt-2 text-xs font-mono font-bold text-amber-400 bg-white/5 px-3 py-1 rounded-full border border-white/10">
            {callState === 'connecting' ? 'कनेक्ट हो रहा है (Connecting...)' : `कॉल सक्रिय • ${formatDuration(callDuration)}`}
          </div>

          {/* Animated Waveform when connected */}
          {callState === 'connected' && (
            <div className="flex items-center gap-1 mt-4 h-6">
              {[40, 70, 95, 60, 85, 45, 90, 75, 50, 80, 65, 40].map((h, i) => (
                <div
                  key={i}
                  className="w-1 bg-gradient-to-t from-amber-500 to-emerald-400 rounded-full animate-pulse"
                  style={{
                    height: `${h}%`,
                    animationDelay: `${i * 0.12}s`,
                    animationDuration: '0.8s'
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Live Conversation Transcript Box */}
        <div className="bg-slate-900/90 rounded-2xl p-3 border border-slate-800 h-32 overflow-y-auto space-y-2 text-xs mb-3 z-10 hide-scrollbar">
          {messages.map((m, idx) => (
            <div 
              key={idx}
              className={`p-2 rounded-xl ${
                m.sender === 'user' 
                  ? 'bg-amber-500/20 text-amber-200 ml-4 border border-amber-500/30' 
                  : 'bg-white/10 text-slate-200 mr-4 border border-white/10'
              }`}
            >
              <div className="text-[9px] font-bold text-slate-400 mb-0.5 flex justify-between">
                <span>{m.sender === 'user' ? 'आप (Citizen)' : 'निक्का वॉयस AI'}</span>
                <span>{m.time}</span>
              </div>
              <p className="leading-relaxed">{m.text}</p>
            </div>
          ))}
        </div>

        {/* Quick Voice Query Chips */}
        <div className="space-y-1.5 mb-4 z-10">
          <span className="text-[10px] text-slate-400 block font-bold">
            त्वरित प्रश्न टैप करें या सीधे बोलें:
          </span>
          <div className="flex gap-1.5 overflow-x-auto pb-1 hide-scrollbar">
            <button
              onClick={() => speakQuery(
                'वार्ड 14 में पानी की समस्या है',
                'वार्ड 14 में पानी का टोकन #NR-891 दर्ज किया गया है। जल शक्ति विभाग की टीम को तुरंत सूचना भेज दी गई है।'
              )}
              className="text-[10px] font-bold bg-white/10 hover:bg-white/20 text-white px-2.5 py-1 rounded-full whitespace-nowrap border border-white/10 transition"
            >
              💧 पानी की समस्या (Ward 14)
            </button>
            <button
              onClick={() => speakQuery(
                'आज विधायक जी की पदयात्रा कहाँ है?',
                'आज शाम 04:30 बजे विधायक रणबीर सिंह निक्का जी वार्ड 14 शिव मंदिर से मुख्य बाजार तक पदयात्रा पर हैं।'
              )}
              className="text-[10px] font-bold bg-white/10 hover:bg-white/20 text-white px-2.5 py-1 rounded-full whitespace-nowrap border border-white/10 transition"
            >
              🚶‍♂️ आज की पदयात्रा
            </button>
            <button
              onClick={() => speakQuery(
                'बिजली का ट्रांसफार्मर खराब है',
                'बिजली ट्रांसफार्मर आपातकालीन टीम को अलर्ट भेज दिया गया है। 24 घंटे में समस्या का समाधान होगा।'
              )}
              className="text-[10px] font-bold bg-white/10 hover:bg-white/20 text-white px-2.5 py-1 rounded-full whitespace-nowrap border border-white/10 transition"
            >
              ⚡ बिजली ट्रांसफार्मर
            </button>
          </div>
        </div>

        {/* Sarvam Indic Speech Engine & Dialect Toggle (sarvam_speech.py) */}
        <div className="bg-slate-900/80 p-2 rounded-xl border border-amber-500/30 flex items-center justify-between text-[10px] mb-2 z-10">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-amber-300 font-bold">
              {dialectMode === 'kangri' ? 'कांगड़ी / पहाड़ी डायलेक्ट' : 'मानक हिंदी'}
            </span>
            <span className="bg-amber-500/20 text-amber-300 text-[9px] px-1.5 py-0.2 rounded font-mono">
              Sarvam Indic
            </span>
          </div>
          <button
            type="button"
            onClick={() => setDialectMode(prev => prev === 'kangri' ? 'standard_hindi' : 'kangri')}
            className="text-[10px] text-slate-300 hover:text-white underline font-semibold"
          >
            {dialectMode === 'kangri' ? 'हिंदी में बदलें' : 'कांगड़ी मोड'}
          </button>
        </div>

        {/* Call Controls */}
        <div className="flex items-center justify-around pt-2 border-t border-slate-800 z-10">
          <button 
            type="button"
            onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
            disabled={isProcessing}
            className={`p-3.5 rounded-full border transition flex items-center justify-center cursor-pointer ${
              isRecording 
                ? 'bg-rose-600 text-white border-rose-500 animate-pulse shadow-lg ring-4 ring-rose-500/40' 
                : isProcessing
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                  : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
            }`}
            title={isRecording ? "बोलना रोकें (Stop Speaking)" : "बोलने के लिए दबाएं (Tap to Speak)"}
          >
            {isProcessing ? (
              <Loader2 className="w-5 h-5 animate-spin text-amber-400" />
            ) : isRecording ? (
              <MicOff className="w-5 h-5" />
            ) : (
              <Mic className="w-5 h-5 text-amber-400" />
            )}
          </button>

          <button 
            type="button"
            onClick={handleEndCall}
            className="p-4 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg hover:shadow-red-500/30 transition transform active:scale-95 cursor-pointer"
            title="End Call"
          >
            <PhoneOff className="w-6 h-6" />
          </button>

          <a 
            href="tel:1800123456" 
            className="p-3 bg-white/10 text-amber-400 hover:bg-white/20 rounded-full border border-white/10 transition"
            title="Direct Helpline Call"
          >
            <PhoneCall className="w-5 h-5" />
          </a>
        </div>

      </div>
    </div>
  );
};
