import React, { useState } from 'react';
import { X, Send, CheckCheck, ExternalLink, Bot, PhoneCall, Sparkles } from 'lucide-react';
import { MLA_INFO } from '../../data/campaignData';
import { Language } from '../../types/campaign';

interface WhatsAppAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const WhatsAppAgentModal: React.FC<WhatsAppAgentModalProps> = ({ isOpen, onClose, lang }) => {
  const [inputText, setInputText] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'ai' | 'user'; text: string; time: string }>>([
    {
      sender: 'ai',
      text: '🙏 जय हिंद! मैं रणबीर सिंह निक्का जी का आधिकारिक AI जनसेवक सहायक हूँ। मैं आपकी किस प्रकार सहायता कर सकता हूँ?\n\n1️⃣ नई शिकायत दर्ज करें\n2️⃣ राशन/योजना स्थिति जानें\n3️⃣ आज की पदयात्रा रूट\n4️⃣ वार्ड अनुसार विकास कार्य',
      time: '10:00 AM'
    }
  ]);

  if (!isOpen) return null;

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg = { sender: 'user' as const, text, time };
    
    let botReplyText = '';
    const lower = text.toLowerCase();

    if (lower.includes('शिकायत') || lower.includes('complaint') || lower.includes('1')) {
      const token = `#NR-${Math.floor(1000 + Math.random() * 9000)}`;
      botReplyText = `✅ आपकी शिकायत दर्ज कर ली गई है!\n\n📌 टोकन क्रमांक: ${token}\n📍 कार्यक्षेत्र: नूरपुर विधानसभा (142)\n⏱️ समय सीमा: 24 से 48 घंटे में निरीक्षण।\n\nविधायक कैंप ऑफिस कंट्रोल रूम से संबंधित विभाग को आदेश प्रेषित कर दिया गया है।`;
    } else if (lower.includes('राशन') || lower.includes('ration') || lower.includes('योजना') || lower.includes('2')) {
      botReplyText = `🌾 राष्ट्रीय खाद्य सुरक्षा एवं हिमाचल अन्न योजना:\n\nनूरपुर डिपो में इस माह का गंदम, चावल व दाल का कोटा वितरित हो रहा है। यदि आपका राशन कार्ड सत्यापन लंबित है, तो अपना आधार नंबर लेकर कैंप कार्यालय पधारें।`;
    } else if (lower.includes('पदयात्रा') || lower.includes('दौरा') || lower.includes('3')) {
      botReplyText = `🚶‍♂️ आज का पदयात्रा कार्यक्रम:\n\n• 04:30 PM: वार्ड १४, शिव मंदिर चौक से मुख्य बाजार तक\n• 07:30 PM: युवा चौपाल, अंबेडकर पार्क, वार्ड १९\n\nआप भी अपने मोहल्ले की समस्याओं के साथ सादर आमंत्रित हैं!`;
    } else if (lower.includes('विकास') || lower.includes('काम') || lower.includes('road') || lower.includes('4')) {
      botReplyText = `📊 नूरपुर 5-वर्षीय विकास रिपोर्ट:\n\n• कुल स्वीकृत योजनाएं: 142\n• पूर्ण कार्य: 148+ (लागत ₹42 Cr MLA निधि)\n• बाईपास 4-लेन व सोलर स्ट्रीट लाइट कार्य पूर्ण।\n\nऐप के 'काम का हिसाब' टैब में सभी वार्डों की वित्तीय सूची देखें।`;
    } else {
      botReplyText = `धन्यवाद! आपका संदेश "${text}" विधायक रणबीर सिंह निक्का जी के कैंप कार्यालय में पंजीकृत हुआ है। हमारी हेल्पलाइन 1800-123-456 पर भी संपर्क कर सकते हैं।`;
    }

    setChatMessages((prev) => [...prev, userMsg, { sender: 'ai', text: botReplyText, time }]);
    setInputText('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-3">
      <div className="bg-[#e5ddd5] w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl border border-slate-300 flex flex-col h-[580px] animate-in fade-in zoom-in-95 duration-200">
        
        {/* WhatsApp Header */}
        <div className="bg-[#075e54] text-white p-3 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <img 
                src={MLA_INFO.photoUrl} 
                alt="Ranbir Singh Nikka" 
                className="w-10 h-10 rounded-full object-cover border-2 border-white/50"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#075e54]"></span>
            </div>
            <div>
              <div className="flex items-center gap-1">
                <h3 className="text-xs font-bold leading-tight">रणबीर सिंह निक्का AI</h3>
                <span className="bg-emerald-400 text-slate-950 text-[9px] font-black px-1 rounded-full">✓</span>
              </div>
              <p className="text-[10px] text-emerald-100 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-300 rounded-full animate-ping"></span>
                24x7 ऑटो जन सेवा चैटबॉट
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a 
              href={`https://wa.me/919816000000?text=${encodeURIComponent('नमस्ते रणबीर सिंह निक्का जी, मुझे सहायता चाहिए')}`}
              target="_blank" 
              rel="noreferrer"
              className="p-1.5 bg-white/10 hover:bg-white/20 rounded-full text-white transition"
              title="Open Official WhatsApp"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
            <button 
              onClick={onClose}
              className="p-1.5 text-white/80 hover:text-white rounded-full transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Chat message body with whatsapp style doodle background */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2.5 text-xs hide-scrollbar bg-[#efeae2]">
          <div className="text-center my-1">
            <span className="bg-white/80 text-slate-600 text-[10px] px-2.5 py-1 rounded-lg shadow-sm border border-slate-200">
              🔒 सुरक्षित जनसंवाद • संदेश सीधे कैंप कार्यालय सुरक्षित हैं
            </span>
          </div>

          {chatMessages.map((msg, i) => (
            <div 
              key={i} 
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div 
                className={`max-w-[85%] p-2.5 rounded-2xl shadow-sm text-xs leading-relaxed whitespace-pre-wrap ${
                  msg.sender === 'user' 
                    ? 'bg-[#d9fdd3] text-slate-900 rounded-tr-none' 
                    : 'bg-white text-slate-900 rounded-tl-none border border-slate-200'
                }`}
              >
                <p>{msg.text}</p>
                <div className="flex items-center justify-end gap-1 mt-1 text-[9px] text-slate-400">
                  <span>{msg.time}</span>
                  {msg.sender === 'user' && <CheckCheck className="w-3 h-3 text-sky-600" />}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick query chips */}
        <div className="p-2 bg-white/95 border-t border-slate-200 space-y-1.5">
          <div className="flex gap-1.5 overflow-x-auto pb-1 hide-scrollbar">
            <button 
              onClick={() => handleSend('1. नई समस्या दर्ज करें')}
              className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-[10px] font-bold whitespace-nowrap hover:bg-emerald-100 transition"
            >
              📝 शिकायत दर्ज करें
            </button>
            <button 
              onClick={() => handleSend('2. राशन व योजना स्थिति')}
              className="px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-full text-[10px] font-bold whitespace-nowrap hover:bg-amber-100 transition"
            >
              🌾 राशन कार्ड सहायता
            </button>
            <button 
              onClick={() => handleSend('3. आज की पदयात्रा')}
              className="px-2.5 py-1 bg-blue-50 text-blue-800 border border-blue-200 rounded-full text-[10px] font-bold whitespace-nowrap hover:bg-blue-100 transition"
            >
              🚶 पदयात्रा समय
            </button>
          </div>

          {/* Input box */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-1.5"
          >
            <input 
              type="text" 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="अपनी समस्या या संदेश टाइप करें..."
              className="flex-1 bg-slate-100 border border-slate-300 rounded-full px-3.5 py-2 text-xs focus:outline-none focus:bg-white focus:ring-1 focus:ring-emerald-600"
            />
            <button 
              type="submit"
              className="w-9 h-9 rounded-full bg-[#075e54] text-white flex items-center justify-center hover:bg-[#064e46] transition shrink-0 shadow-sm"
            >
              <Send className="w-4 h-4 ml-0.5" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
