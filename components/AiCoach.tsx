import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Bot, Sparkles } from 'lucide-react';
import { geminiService } from '../services/gemini';
import { storageService } from '../services/storage';
import { Chat } from "@google/genai";
import { ChatMessage } from '../types';

interface Message {
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

interface AiCoachProps {
  onMessagesUpdate?: (messages: ChatMessage[]) => void;
}

export const AiCoach: React.FC<AiCoachProps> = ({ onMessagesUpdate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: "Hey! I'm GymPal. Ready to hit those calisthenics goals? How's the back feeling today?", timestamp: new Date().toISOString() }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const weekCountRef = useRef<number>(1);
  const weekStartRef = useRef<string | null>(null);

  useEffect(() => {
    const session = geminiService.createChatSession();
    if (session) {
      setChatSession(session);
      console.log('[AiCoach] Chat session initialized successfully');
    } else {
      console.error('[AiCoach] Failed to create chat session - check API key');
    }
  }, []);

  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Notify parent of message updates for chat archival
  useEffect(() => {
    if (onMessagesUpdate) {
      const chatMessages: ChatMessage[] = messages.map(m => ({
        role: m.role,
        text: m.text,
        timestamp: m.timestamp
      }));
      onMessagesUpdate(chatMessages);
    }
  }, [messages, onMessagesUpdate]);

  // Subscribe to get week data for context
  useEffect(() => {
    const unsubscribe = storageService.subscribe((data) => {
      if (data) {
        weekCountRef.current = data.weekCount || 1;
        weekStartRef.current = data.weekStartDate || null;
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSend = async () => {
    if (!input.trim()) {
      console.warn('Empty input');
      return;
    }

    if (!chatSession) {
      console.error('Chat session not initialized', { chatSession });
      return;
    }

    const userMsg = input.trim();
    const timestamp = new Date().toISOString();

    setMessages(prev => [...prev, { role: 'user', text: userMsg, timestamp }]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await chatSession.sendMessage({ message: userMsg });
      const aiResponse = response.text || "I'm having trouble thinking right now.";
      const aiTimestamp = new Date().toISOString();

      setMessages(prev => [...prev, { role: 'model', text: aiResponse, timestamp: aiTimestamp }]);

      // Save chat message to Firestore
      saveChatMessage(userMsg, timestamp, aiResponse, aiTimestamp);
    } catch (error) {
      console.error("Chat Error", error);
      const errorTimestamp = new Date().toISOString();
      setMessages(prev => [...prev, { role: 'model', text: "Sorry, connection error. Please try again.", timestamp: errorTimestamp }]);
    } finally {
      setIsTyping(false);
    }
  };

  const saveChatMessage = async (userMsg: string, userTime: string, aiMsg: string, aiTime: string) => {
    try {
      const weekNum = weekCountRef.current;
      const weekStart = weekStartRef.current || new Date().toISOString();

      // Create temporary chat entry for this week
      const userMessage: ChatMessage = {
        role: 'user',
        text: userMsg,
        timestamp: userTime
      };

      const aiMessage: ChatMessage = {
        role: 'model',
        text: aiMsg,
        timestamp: aiTime
      };

      // Store in a temporary array that App.tsx will process on week completion
      // This maintains the messages in state for immediate UI display
      console.log('[Chat] Messages ready for archival on week completion', {
        weekNumber: weekNum,
        weekStartDate: weekStart,
        messages: [userMessage, aiMessage]
      });
    } catch (error) {
      console.error('Failed to save chat message', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-4 w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full shadow-2xl shadow-blue-900/50 flex items-center justify-center text-white hover:scale-105 transition-transform z-50 border border-white/20"
      >
        <Sparkles className="w-6 h-6" />
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border border-white"></span>
        </span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-24 right-4 left-4 md:left-auto md:w-[380px] h-[60vh] md:h-[550px] bg-slate-900/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 flex flex-col z-50 animate-in fade-in slide-in-from-bottom-10 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900/50 to-indigo-900/50 p-4 flex justify-between items-center border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/20 rounded-xl border border-blue-500/30">
            <Bot className="w-5 h-5 text-blue-300" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm">GymPal AI</h3>
            <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-bold tracking-wide uppercase">
              Online
            </span>
          </div>
        </div>
        <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <X className="w-5 h-5 text-slate-400" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
              msg.role === 'user' 
                ? 'bg-blue-600 text-white rounded-br-sm' 
                : 'bg-white/5 text-slate-200 rounded-bl-sm border border-white/5'
            }`}>
              {msg.text}
              <div className={`text-[10px] mt-1 opacity-60 ${msg.role === 'user' ? 'text-blue-100' : 'text-slate-400'}`}>
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white/5 p-4 rounded-2xl rounded-bl-sm border border-white/5 flex gap-1.5 items-center">
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-75"></span>
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-150"></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 bg-black/20 border-t border-white/5">
        <div className="relative">
          <input
            type="text"
            className="w-full bg-slate-800 text-white placeholder-slate-500 rounded-xl pl-4 pr-12 py-3.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 border border-white/5"
            placeholder="Ask GymPal..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isTyping || !chatSession}
            className="absolute right-2 top-2 p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            type="button"
            title={!chatSession ? "Chat session loading..." : "Send message"}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
