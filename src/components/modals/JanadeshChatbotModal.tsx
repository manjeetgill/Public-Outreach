import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Send, 
  Bot, 
  User, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  RotateCcw, 
  Loader2,
  HelpCircle,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { sendChatMessage, transcribeAudio, synthesizeSpeech } from '../../services/api';
import { Language } from '../../types/campaign';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface JanadeshChatbotModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const JanadeshChatbotModal: React.FC<JanadeshChatbotModalProps> = ({
  isOpen,
  onClose,
  lang
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      role: 'assistant',
      content: lang === 'hi' 
        ? 'नमस्ते! मैं आपका "जनादेश मित्र" (AI जनसंवाद सहायक) हूँ। आप मुझसे नूरपुर के विकास कार्यों (₹312 करोड़), जन समस्या शिकायत दर्ज करने की प्रक्रिया, पदयात्रा कार्यक्रम या विधायक रिपोर्ट कार्ड के बारे में कोई भी प्रश्न पूछ सकते हैं।'
        : 'Namaste! I am "Janadesh Mitra", your official AI civic assistant. Feel free to ask about Nurpur 5-year development projects (₹312 Cr+), lodging civic complaints, Padyatra schedule, or election manifesto.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  // Auto scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (!isOpen) return null;

  const quickSuggestions = lang === 'hi' ? [
    'नूरपुर में ₹312 करोड़ के प्रमुख विकास कार्य क्या हैं?',
    'वार्ड में सड़क या पानी की शिकायत कैसे दर्ज करें?',
    'रणबीर सिंह निक्का जी की आगामी पदयात्रा का समय क्या है?',
    'पन्ना प्रमुख या वालंटियर के रूप में कैसे जुड़ें?'
  ] : [
    'What are major development works in Nurpur?',
    'How can I lodge a water or road complaint?',
    'When is the next Padyatra public outreach?',
    'How do I register as a youth volunteer?'
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputPrompt).trim();
    if (!text || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputPrompt('');
    setIsLoading(true);

    try {
      // Build conversation history for multi-turn chat
      const historyPayload = messages
        .concat(userMessage)
        .map(m => ({ role: m.role, content: m.content }));

      const replyText = await sendChatMessage(historyPayload, lang);

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      const errorMessage: Message = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: lang === 'hi' 
          ? 'माफ़ कीजिए, उत्तर प्राप्त करने में समस्या आई। कृपया पुनः प्रयास करें।'
          : 'Sorry, there was an issue retrieving the response. Please try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Start recording voice via microphone for Audio Transcription (gemini-3.5-transcribe)
  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach(t => t.stop());
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        
        setIsTranscribing(true);
        try {
          const transcribedText = await transcribeAudio(audioBlob);
          if (transcribedText) {
            setInputPrompt((prev) => prev ? `${prev} ${transcribedText}` : transcribedText);
          }
        } catch (err) {
          console.error('Audio transcription error:', err);
        } finally {
          setIsTranscribing(false);
          setIsRecording(false);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Microphone access denied:', err);
      alert(lang === 'hi' ? 'माइक्रोफोन की अनुमति दें।' : 'Please grant microphone access.');
    }
  };

  const stopVoiceRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
  };

  // Play assistant message via Text to Speech (gemini-3.8-flash-lite-tts)
  const handlePlayTTS = async (message: Message) => {
    if (playingAudioId === message.id) {
      currentAudioRef.current?.pause();
      setPlayingAudioId(null);
      return;
    }

    try {
      setPlayingAudioId(message.id);
      const audioUrl = await synthesizeSpeech(message.content, 'Zephyr');
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
      }
      const audio = new Audio(audioUrl);
      currentAudioRef.current = audio;
      audio.onended = () => setPlayingAudioId(null);
      audio.onerror = () => setPlayingAudioId(null);
      await audio.play();
    } catch (err) {
      console.error('TTS error:', err);
      setPlayingAudioId(null);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'assistant',
        content: lang === 'hi' 
          ? 'बातचीत रीसेट कर दी गई है। आप नूरपुर विधानसभा व विकास कार्यों से जुड़ा कोई नया प्रश्न पूछ सकते हैं।'
          : 'Conversation reset. Feel free to ask about any Nurpur campaign or civic topic.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl h-[92vh] max-h-[720px] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#102a43] to-[#1c3d5a] text-white px-4 py-3.5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-extrabold tracking-wide">
                  {lang === 'hi' ? 'जनादेश मित्र • AI जनसंवाद' : 'Janadesh Mitra • AI Civic Chat'}
                </h3>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <p className="text-[10px] text-slate-300">
                {lang === 'hi' ? 'Gemini 3.8 Flash • बहुभाषी नागरिक संवाद' : 'Powered by Gemini 3.8 Flash • Bilingual'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleResetChat}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition text-xs font-semibold flex items-center gap-1"
              title="Reset conversation"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[11px]">{lang === 'hi' ? 'रीसेट' : 'Clear'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Conversation Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/70">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-2.5 max-w-[88%] ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              >
                <div className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-xs shadow-2xs mt-0.5 ${
                  isUser 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-amber-500 text-white'
                }`}>
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div className={`rounded-2xl px-3.5 py-2.5 text-xs shadow-xs leading-relaxed ${
                  isUser 
                    ? 'bg-blue-600 text-white rounded-tr-xs' 
                    : 'bg-white text-slate-800 border border-slate-200/90 rounded-tl-xs'
                }`}>
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                  
                  <div className={`flex items-center justify-between gap-3 text-[10px] mt-1.5 pt-1 border-t ${
                    isUser ? 'border-blue-500/50 text-blue-200' : 'border-slate-100 text-slate-400'
                  }`}>
                    <span>{msg.timestamp}</span>

                    {!isUser && (
                      <button
                        onClick={() => handlePlayTTS(msg)}
                        className="hover:text-amber-600 font-bold flex items-center gap-1 transition"
                        title="Listen to response (Gemini TTS)"
                      >
                        {playingAudioId === msg.id ? (
                          <>
                            <VolumeX className="w-3.5 h-3.5 text-amber-600" />
                            <span className="text-amber-600">रोकें</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>सुनें</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center gap-2 text-slate-500 text-xs py-2 px-3 bg-white rounded-xl border border-slate-200 w-fit">
              <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
              <span>{lang === 'hi' ? 'जनादेश मित्र उत्तर तैयार कर रहा है...' : 'Janadesh Mitra is typing...'}</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto text-[11px] no-scrollbar">
          <span className="text-slate-400 shrink-0 font-medium">{lang === 'hi' ? 'सुझाव:' : 'Try:'}</span>
          {quickSuggestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              className="shrink-0 bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-full transition font-medium text-[11px]"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar with Voice Transcription */}
        <div className="p-3 bg-white border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            {/* Microphone Button for Gemini 3.5 Transcribe */}
            <button
              type="button"
              onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
              disabled={isTranscribing}
              className={`p-2.5 rounded-xl transition flex items-center justify-center shrink-0 ${
                isRecording 
                  ? 'bg-rose-600 text-white animate-pulse shadow-md ring-2 ring-rose-300' 
                  : isTranscribing
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
              title={isRecording ? 'Stop recording' : 'Speak into microphone (Gemini 3.5 Transcribe)'}
            >
              {isTranscribing ? (
                <Loader2 className="w-4 h-4 animate-spin text-amber-600" />
              ) : isRecording ? (
                <MicOff className="w-4 h-4" />
              ) : (
                <Mic className="w-4 h-4" />
              )}
            </button>

            <input
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder={
                isRecording
                  ? (lang === 'hi' ? '🎤 बोलिए... आवाज़ रिकॉर्ड हो रही है' : '🎤 Speak now... recording audio')
                  : isTranscribing
                    ? (lang === 'hi' ? 'ऑडियो टेक्स्ट में बदला जा रहा है...' : 'Transcribing audio via Gemini 3.5...')
                    : (lang === 'hi' ? 'नूरपुर विकास या समस्या निवारण से जुड़ा प्रश्न पूछें...' : 'Ask about Nurpur works, grievances, or Padyatra...')
              }
              className="flex-1 bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 transition"
            />

            <button
              type="submit"
              disabled={!inputPrompt.trim() || isLoading}
              className="p-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 text-white rounded-xl font-bold transition shadow-sm shrink-0 active:scale-95"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1.5 px-1">
            <span>💡 {lang === 'hi' ? 'माइक दबाकर बोलें — Gemini 3.5 आपकी आवाज़ को टेक्स्ट में बदल देगा' : 'Tap mic to speak — transcribed with Gemini 3.5 Transcribe'}</span>
            <span>Gemini 3.8 Flash</span>
          </div>
        </div>

      </div>
    </div>
  );
};
