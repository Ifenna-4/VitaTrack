import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  X, 
  Send, 
  Activity, 
  ShieldCheck, 
  Bot, 
  User, 
  ChevronRight,
  RefreshCw,
  Info
} from 'lucide-react';
import { UserProfile, HealthReading, CheckIn, ChatMessage } from '../types';
import { askVitaAssistant } from '../services/api';

interface VitaAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  readings: HealthReading[];
  checkIns: CheckIn[];
}

export const VitaAssistantModal: React.FC<VitaAssistantModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  readings,
  checkIns,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      role: 'assistant',
      timestamp: new Date().toISOString(),
      content: `Hello ${userProfile.name.split(' ')[0]}! I'm **Vita**, your health monitoring assistant. I have reviewed your ${readings.length} recorded readings and personal profile (${userProfile.conditions.join(', ')}). \n\nI can help you analyze trends, summarize weekly data, or evaluate how symptoms and numbers match up. How can I help you today?`,
    },
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Suggested Prompts from requirements
  const suggestedPrompts = [
    'How has my blood pressure changed this month?',
    'Summarize my readings from this week.',
    'What trends do you see in my readings?',
    'When was my highest recorded blood glucose?',
    'How consistent have I been with checking my readings?',
  ];

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [isOpen, messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    const userMessage: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInput('');
    setIsLoading(true);

    try {
      const chatHistory = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const reply = await askVitaAssistant(
        query,
        chatHistory,
        userProfile,
        readings,
        checkIns
      );

      const assistantMessage: ChatMessage = {
        id: `asst-${Date.now()}`,
        role: 'assistant',
        content: reply,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `asst-err-${Date.now()}`,
          role: 'assistant',
          content: 'I had trouble evaluating that question. Please try asking again in a moment.',
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-2xl w-full h-[90vh] max-h-[700px] flex flex-col shadow-2xl border border-slate-200 overflow-hidden relative">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-white z-10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-base">Vita</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-teal-50 text-teal-800 border border-teal-200">
                  AI Health Companion
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Grounded in your {readings.length} recorded measurements
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 text-xs sm:text-sm ${
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.role === 'assistant' && (
                <div className="w-7 h-7 rounded-lg bg-teal-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-4 leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-teal-700 text-white shadow-2xs rounded-br-xs'
                    : 'bg-white text-slate-800 border border-slate-200/90 shadow-2xs rounded-bl-xs'
                }`}
              >
                <div className="whitespace-pre-line space-y-2">
                  {msg.content}
                </div>
                <div
                  className={`mt-1.5 text-[10px] ${
                    msg.role === 'user' ? 'text-teal-200 text-right' : 'text-slate-400'
                  }`}
                >
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                </div>
              </div>

              {msg.role === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 text-xs justify-start">
              <div className="w-7 h-7 rounded-lg bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3 shadow-2xs flex items-center gap-1.5 text-slate-500">
                <span className="w-2 h-2 rounded-full bg-teal-600 animate-bounce"></span>
                <span className="w-2 h-2 rounded-full bg-teal-600 animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 rounded-full bg-teal-600 animate-bounce [animation-delay:0.4s]"></span>
                <span className="text-xs ml-1 font-medium">Vita is analyzing your logs...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompts Carousel */}
        <div className="px-4 py-2 border-t border-slate-100 bg-white overflow-x-auto flex gap-2 shrink-0 no-scrollbar">
          {suggestedPrompts.map((prompt) => (
            <button
              key={prompt}
              type="button"
              disabled={isLoading}
              onClick={() => handleSend(prompt)}
              className="text-[11px] font-medium px-3 py-1.5 bg-slate-100 hover:bg-teal-50 hover:text-teal-900 text-slate-700 border border-slate-200/80 rounded-full whitespace-nowrap transition-colors shrink-0 disabled:opacity-50"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-white border-t border-slate-100 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Vita about your blood pressure, glucose, or check-ins..."
              className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 text-slate-900 placeholder:text-slate-400"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold text-xs sm:text-sm transition-all disabled:opacity-50 flex items-center gap-1.5 shrink-0"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Send</span>
            </button>
          </form>

          {/* Unobtrusive Mandatory Disclaimer */}
          <p className="mt-2 text-[10px] text-slate-400 text-center leading-normal">
            Vita provides educational insights based on your recorded data and does not diagnose conditions or replace professional medical advice.
          </p>
        </div>
      </div>
    </div>
  );
};
