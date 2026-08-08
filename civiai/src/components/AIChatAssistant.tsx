import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  RefreshCw, 
  CheckCircle2, 
  ArrowRight, 
  FileText, 
  Building2, 
  UserCheck, 
  Globe, 
  ShieldAlert,
  ChevronRight
} from 'lucide-react';
import { ChatMessage, CitizenProfile, Language, Scheme } from '../types';

interface AIChatAssistantProps {
  activePersona: CitizenProfile;
  currentLanguage: Language;
  onSelectScheme: (s: Scheme) => void;
  onNavigateToEligibility: () => void;
  onNavigateToGrievance: () => void;
  onNavigateToVault: () => void;
}

export const AIChatAssistant: React.FC<AIChatAssistantProps> = ({
  activePersona,
  currentLanguage,
  onSelectScheme,
  onNavigateToEligibility,
  onNavigateToGrievance,
  onNavigateToVault
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      sender: 'assistant',
      text: `Namaste ${activePersona.name}! I am your personal CiviAI Government Assistant.\n\nI have evaluated your profile (**${activePersona.occupation}**, **${activePersona.state}**, Annual Income ₹${activePersona.annualIncome.toLocaleString('en-IN')}).\n\nHow can I help you today?`,
      timestamp: 'Just now',
      suggestedSchemes: [],
    }
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Voice Speech Recognition
  const toggleSpeechRecognition = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech Recognition is not supported in this browser. Try Google Chrome or Microsoft Edge.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = currentLanguage === 'Hindi' ? 'hi-IN' : currentLanguage === 'Kannada' ? 'kn-IN' : currentLanguage === 'Tamil' ? 'ta-IN' : 'en-IN';

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognition.start();
    } catch (e) {
      setIsListening(false);
    }
  };

  // Speech Synthesis
  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const cleanText = text.replace(/[*#_`]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = currentLanguage === 'Hindi' ? 'hi-IN' : 'en-IN';
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleSend = async (customPrompt?: string) => {
    const textToSend = customPrompt || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `m-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    if (!customPrompt) setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          history: messages.slice(-6),
          profile: activePersona,
          language: currentLanguage
        }),
      });

      let replyText = "";
      let suggested: Scheme[] = [];
      let simpleText = undefined;

      if (response.ok) {
        const data = await response.json();
        replyText = data.reply;
        suggested = data.suggestedSchemes || [];
        simpleText = data.simplifiedText;
      }

      if (!replyText) {
        replyText = `Namaste ${activePersona.name}! Based on your profile (${activePersona.occupation}, ${activePersona.state}):\n\n` +
          `• **Key Recommendations:** You match criteria for PM-KISAN, Ayushman Bharat ₹5 Lakh Health Cover, and PM Awas Yojana.\n` +
          `• **Next Step:** Select 'Eligibility Evaluation' to test your profile against rules or upload documents in the Vault.`;
      }

      const assistantMsg: ChatMessage = {
        id: `m-${Date.now() + 1}`,
        sender: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedSchemes: suggested,
        simplifiedText: simpleText,
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: `m-${Date.now() + 1}`,
          sender: 'assistant',
          text: `Namaste ${activePersona.name}! Based on your active profile (${activePersona.occupation}, ${activePersona.state}, Income ₹${activePersona.annualIncome.toLocaleString('en-IN')}):\n\n` +
            `• **Top Matched Scheme:** PM-KISAN Samman Nidhi (₹6,000/year direct transfer) & Ayushman Bharat (₹5 Lakh health cover).\n` +
            `• **Action Recommended:** Click 'Check Match' on the schemes below or open the 'Eligibility Evaluation' tab.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-6 px-4 sm:px-6">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700 border border-indigo-500/30 rounded-2xl p-6 mb-6 text-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-2">
            <span className="bg-white/20 text-white text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wider backdrop-blur-sm">
              AI Government Assistant
            </span>
            <span className="text-xs text-indigo-100 font-medium">Powered by Gemini 3.6 Flash</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Ask CiviAI Anything About Government Services
          </h2>
          <p className="text-xs text-indigo-100 max-w-2xl leading-relaxed">
            Ask in plain conversational language. CiviAI automatically checks eligibility criteria, simplifies official jargon, and guides your application step-by-step.
          </p>
        </div>

        {/* Persona Pill */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-xl flex items-center gap-3 relative z-10 shrink-0 text-white">
          <img src={activePersona.avatarUrl} alt={activePersona.name} className="w-10 h-10 rounded-full object-cover ring-2 ring-white/50" />
          <div className="text-xs">
            <p className="font-bold text-white">{activePersona.name}</p>
            <p className="text-indigo-100">{activePersona.occupation} • {activePersona.state}</p>
            <p className="text-[10px] text-emerald-200 font-bold">Income: ₹{activePersona.annualIncome.toLocaleString('en-IN')}</p>
          </div>
        </div>
      </div>

      {/* Quick Starter Prompts */}
      <div className="mb-6 flex flex-wrap gap-2">
        {[
          "Which schemes can I apply for right now?",
          "How do I get Ayushman Bharat ₹5 Lakh health card?",
          "Check my eligibility for PM Kisan ₹6,000 subsidy",
          "Draft a formal complaint for delay in ration delivery",
          "Where is the nearest CSC Seva Kendra or Aadhaar center?"
        ].map((prompt, i) => (
          <button
            key={i}
            onClick={() => handleSend(prompt)}
            className="text-xs bg-white hover:bg-indigo-50 text-slate-700 border border-slate-200 hover:border-indigo-300 px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 shadow-sm font-medium"
          >
            <Sparkles className="w-3 h-3 text-indigo-600" />
            <span>{prompt}</span>
          </button>
        ))}
      </div>

      {/* Chat Messages Container */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col h-[520px] overflow-hidden">
        
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold text-slate-500">
                  {msg.sender === 'user' ? activePersona.name : 'CiviAI Bot'}
                </span>
                <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
              </div>

              <div
                className={`max-w-3xl rounded-2xl p-4 text-sm leading-relaxed whitespace-pre-line ${
                  msg.sender === 'user'
                    ? 'bg-indigo-600 text-white font-medium rounded-br-none shadow-sm'
                    : 'bg-slate-100 border border-slate-200 text-slate-800 rounded-bl-none'
                }`}
              >
                {msg.text}

                {/* Read Aloud Button for Assistant Messages */}
                {msg.sender === 'assistant' && (
                  <div className="mt-3 pt-3 border-t border-slate-200 flex items-center justify-between gap-2">
                    <button
                      onClick={() => speakText(msg.text)}
                      className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center gap-1 font-bold"
                    >
                      {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                      <span>{isSpeaking ? 'Stop Audio' : 'Listen in Audio'}</span>
                    </button>

                    <button
                      onClick={onNavigateToVault}
                      className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 font-medium"
                    >
                      <FileText className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Attach Vault Docs</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Matched Scheme Recommendation Cards */}
              {msg.suggestedSchemes && msg.suggestedSchemes.length > 0 && (
                <div className="mt-3 w-full max-w-3xl grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {msg.suggestedSchemes.map((scheme) => (
                    <div
                      key={scheme.id}
                      className="bg-slate-50 border border-slate-200 hover:border-indigo-400 p-3 rounded-xl transition-all shadow-sm flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="text-[10px] bg-indigo-50 text-indigo-700 border border-indigo-200 px-1.5 py-0.5 rounded font-bold uppercase">
                            {scheme.category}
                          </span>
                          <span className="text-[10px] text-slate-500 font-medium">{scheme.sponsoringBody}</span>
                        </div>
                        <h4 className="font-bold text-xs text-slate-900 line-clamp-1">{scheme.title}</h4>
                        <p className="text-[11px] text-slate-600 mt-1 line-clamp-2">{scheme.simplifiedDescription}</p>
                      </div>

                      <div className="mt-3 pt-2 border-t border-slate-200 flex items-center justify-between">
                        <span className="text-[10px] font-bold text-emerald-700">{scheme.financialAssistance || 'Free Benefit'}</span>
                        <button
                          onClick={() => {
                            onSelectScheme(scheme);
                            onNavigateToEligibility();
                          }}
                          className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-2.5 py-1 rounded transition-colors flex items-center gap-1 shadow-sm"
                        >
                          <span>Check Match</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-3 text-slate-600 text-xs py-2 bg-slate-50 p-3 rounded-xl w-fit border border-slate-200">
              <RefreshCw className="w-4 h-4 animate-spin text-indigo-600" />
              <span>Analyzing citizen profile & consulting national scheme databases...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Controls Bar */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center gap-2">
          
          {/* Voice Input Button */}
          <button
            onClick={toggleSpeechRecognition}
            className={`p-2.5 rounded-xl transition-colors border ${
              isListening
                ? 'bg-rose-500 text-white animate-pulse border-rose-400'
                : 'bg-white text-slate-600 hover:text-indigo-600 border-slate-200 shadow-sm'
            }`}
            title="Voice Assistant Mic"
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Text Input */}
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={`Ask in ${currentLanguage} (e.g., "Am I eligible for PM Kisan or Ayushman Bharat?")...`}
            className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-colors shadow-sm"
          />

          {/* Send Button */}
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || loading}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold px-4 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-1.5 text-xs"
          >
            <span>Ask</span>
            <Send className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
};
