import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, Minus, Pin, Sparkles, User, RefreshCw, MessageSquare } from 'lucide-react';
import { Language } from '../../types/campaign';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  time: string;
}

interface AIJanSahayakWidgetProps {
  lang: Language;
  onOpenReportModal?: () => void;
  onNavigateToTab?: (tab: any) => void;
  isFloating?: boolean;
}

export const AIJanSahayakWidget: React.FC<AIJanSahayakWidgetProps> = ({
  lang,
  onOpenReportModal,
  onNavigateToTab,
  isFloating = false
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-0',
      sender: 'ai',
      text: lang === 'hi' 
        ? 'नमस्ते! मैं जनसहायक हूँ। मैं आपकी कैसे सहायता कर सकता हूँ?'
        : 'Hello! I am Jan Sahayak, your AI Civic Assistant. How can I assist you today?',
      time: 'Just Now'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isPinned, setIsPinned] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    { label: '🚀 सरकारी योजनाओं की जानकारी', prompt: 'नूरपुर विधानसभा क्षेत्र में लागू प्रमुख सरकारी योजनाओं की जानकारी दें।' },
    { label: '📋 मेरी क्षेत्र की समस्या दर्ज करें', prompt: 'मुझे अपने वार्ड की सड़क व पानी की समस्या दर्ज करनी है।' },
    { label: '📅 आगामी कार्यक्रम', prompt: 'विधायक रणबीर सिंह निक्का जी के आगामी जनसंवाद कार्यक्रम कब हैं?' },
    { label: '👤 रणबीर सिंह निक्का जी के कार्य', prompt: 'पिछले कार्यकाल में नूरपुर में क्या-क्या प्रमुख विकास कार्य हुए हैं?' },
    { label: '🪪 मतदाता संबंधी जानकारी', prompt: 'मतदाता सूची में नाम देखने या वोटर कार्ड बनवाने की प्रक्रिया बताएं।' },
    { label: '💬 किसी अन्य प्रश्न पूछें', prompt: 'विधायक कार्यालय का पता और हेल्पलाइन नंबर क्या है?' },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMsg: Message = {
      id: 'user-' + Date.now(),
      sender: 'user',
      text: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      let reply = '';
      const lower = text.toLowerCase();

      if (lower.includes('योजना') || lower.includes('scheme')) {
        reply = 'हिमाचल सरकार व विधायक निधि से नूरपुर में "हर घर नल से जल", "सुख आश्रय पेंशन", "राजीव गांधी प्राकृतिक खेती", और "सोलर रूफटॉप सब्सिडी" योजनाएं सक्रिय हैं। आप अपने नजदीकी ब्लॉक कार्यालय या विधायक कैंप कार्यालय में आवेदन कर सकते हैं।';
      } else if (lower.includes('समस्या') || lower.includes('शिकायत') || lower.includes('road') || lower.includes('पानी')) {
        reply = 'आप तुरंत हमारे "Report an Issue" (समस्या दर्ज करें) फॉर्म द्वारा अपनी समस्या दर्ज कर सकते हैं। शिकायत दर्ज होते ही 48 घंटे के भीतर संबंधित विभाग को आदेश जारी होता है।';
        if (onOpenReportModal) {
          setTimeout(() => onOpenReportModal(), 1200);
        }
      } else if (lower.includes('कार्यक्रम') || lower.includes('event') || lower.includes('दौरा')) {
        reply = 'आगामी कार्यक्रम:\n• 07 Nov: समुदाय स्वास्थ्य शिविर (वार्ड 3)\n• 14 Nov: जन सुझाव बैठक (नगर परिषद हॉल)\n• 21 Nov: युवा रोजगार मंच (नूरपुर कॉलेज)';
      } else if (lower.includes('कार्य') || lower.includes('achievement') || lower.includes('सड़क')) {
        reply = 'विधायक रणबीर सिंह निक्का जी के नेतृत्व में ₹42+ करोड़ की विधायक निधि से 148 विकास योजनाएं पूर्ण हो चुकी हैं, जिनमें 4-लेन बाईपास, 24 वार्डों में एलईडी लाइटिंग, और पेयजल संवर्धन शामिल हैं।';
      } else if (lower.includes('मतदाता') || lower.includes('voter')) {
        reply = 'मतदाता पंजीकरण व सूची सत्यापन के लिए आप ECI के voters.eci.gov.in पोर्टल पर जा सकते हैं अथवा हमारे "Voter Information" सेक्शन से सीधे सर्च कर सकते हैं।';
      } else {
        reply = 'विधायक मुख्य जनसंपर्क कार्यालय: कैंप रोड, कोर्ट परिसर के पास, नूरपुर (कांगड़ा)।\n24x7 टोल-फ्री हेल्पलाइन: 1800-123-456\nWhatsApp हेल्पलाइन: +91 98160-00000';
      }

      const aiMsg: Message = {
        id: 'ai-' + Date.now(),
        sender: 'ai',
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 700);
  };

  if (isMinimized) {
    return (
      <div 
        onClick={() => setIsMinimized(false)}
        className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-2xl shadow-xl flex items-center space-x-2.5 cursor-pointer transition select-none border border-blue-400"
      >
        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
          <Bot className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="text-xs font-bold flex items-center space-x-1">
            <span>AI Jan Sahayak</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          </div>
          <div className="text-[10px] text-blue-100">Click to expand chat</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden flex flex-col transition-all ${
      isFloating ? 'fixed bottom-4 right-4 z-40 w-80 sm:w-96 max-h-[560px]' : 'w-full h-full min-h-[460px] max-h-[580px]'
    }`}>
      {/* Blue Header Bar matching mockup */}
      <div className="bg-[#0066cc] text-white px-4 py-3 flex items-center justify-between shrink-0 shadow-xs">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-full bg-white/20 border border-white/30 flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-sm font-bold flex items-center space-x-1.5 leading-none">
              <span>AI Jan Sahayak</span>
              <span className="text-[10px] bg-emerald-500 text-white px-1.5 py-0.2 rounded-full font-semibold">Online</span>
            </div>
            <div className="text-[10px] text-blue-100 mt-0.5">24x7 जन संवाद व समाधान</div>
          </div>
        </div>

        <div className="flex items-center space-x-1 text-white/80">
          <button 
            onClick={() => setIsPinned(!isPinned)}
            className={`p-1 rounded hover:bg-white/10 ${isPinned ? 'text-amber-300' : 'text-white'}`}
            title="Pin widget"
          >
            <Pin className="w-3.5 h-3.5" />
          </button>
          <button 
            onClick={() => setIsMinimized(true)}
            className="p-1 rounded hover:bg-white/10"
            title="Minimize"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          {isFloating && (
            <button 
              onClick={() => setIsMinimized(true)}
              className="p-1 rounded hover:bg-white/10"
              title="Close"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Messages Body */}
      <div className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-slate-50/70 text-xs">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 shadow-2xs leading-relaxed whitespace-pre-line ${
                m.sender === 'user'
                  ? 'bg-[#0066cc] text-white rounded-br-xs'
                  : 'bg-white border border-slate-200 text-slate-800 rounded-bl-xs'
              }`}
            >
              {m.text}
            </div>
            <span className="text-[9px] text-slate-400 mt-1 px-1">{m.time}</span>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center space-x-1.5 text-slate-400 bg-white border border-slate-200 rounded-full px-3 py-1.5 w-fit shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce delay-100"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce delay-200"></span>
            <span className="text-[10px] text-slate-500 font-medium ml-1">जनसहायक सोच रहा है...</span>
          </div>
        )}

        {/* Quick Action Prompt Pills matching mockup */}
        {messages.length <= 2 && (
          <div className="pt-2 space-y-1.5">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">
              त्वरित विषय (Quick Topics):
            </div>
            <div className="flex flex-col gap-1.5">
              {quickPrompts.map((qp, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(qp.prompt)}
                  className="text-left bg-white hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 border border-slate-200 text-slate-700 px-3 py-1.5 rounded-xl text-xs font-medium transition shadow-2xs flex items-center justify-between"
                >
                  <span>{qp.label}</span>
                  <span className="text-slate-300 text-xs">→</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Bottom Input Area */}
      <form 
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-2.5 bg-white border-t border-slate-200 flex items-center space-x-2 shrink-0"
      >
        <input
          type="text"
          placeholder={lang === 'hi' ? 'अपना प्रश्न लिखें...' : 'Ask your question...'}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white"
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          className="bg-[#0066cc] hover:bg-blue-700 disabled:opacity-50 text-white p-2 rounded-xl transition shadow-xs shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
