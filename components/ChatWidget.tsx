import React, { useState, useEffect, useRef } from 'react';
import { IconSend } from './Icons';
import { createChatSession } from '../services/geminiService';
import { ChatMessage, Language } from '../types';
import { translations } from '../utils/translations';
import { GenerateContentResponse } from "@google/genai";

interface ChatWidgetProps {
  language: Language;
}

const ChatWidget: React.FC<ChatWidgetProps> = ({ language }) => {
  const t = translations[language];
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatSessionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Reset messages and re-init session when language changes
    setMessages([
      {
        id: 'welcome',
        role: 'model',
        text: t.chatWelcome,
        timestamp: Date.now()
      }
    ]);
    chatSessionRef.current = createChatSession(language);
  }, [language, t.chatWelcome]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response: GenerateContentResponse = await chatSessionRef.current.sendMessage({ message: userMsg.text });
      const responseText = response.text || "I'm sorry, I couldn't understand that.";

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: Date.now(),
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "Sorry, I'm having trouble connecting to the network.",
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-md border border-green-100 dark:border-slate-800 flex flex-col h-[calc(100vh-140px)] md:h-[600px] overflow-hidden transition-colors duration-300">
      <div className="p-3 border-b border-green-100 dark:border-slate-800 bg-green-50 dark:bg-slate-800">
        <h3 className="font-semibold text-green-800 dark:text-green-400 flex items-center gap-2">
           <span className="font-bold">{t.chatTitle}</span>
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-slate-950 space-y-4 scrollbar-hide">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-green-600 text-white rounded-tr-none'
                  : 'bg-green-100 dark:bg-slate-800 text-gray-800 dark:text-slate-100 rounded-tl-none border border-green-200 dark:border-slate-700'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
           <div className="flex justify-start">
             <div className="bg-green-100 dark:bg-slate-800 p-3 rounded-2xl rounded-tl-none text-sm text-green-800 dark:text-green-400 italic animate-pulse">
               {t.analyzing}
             </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t.chatPlaceholder}
            className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-200 text-sm rounded-full pl-4 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all placeholder-gray-400 dark:placeholder-gray-500"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className={`absolute right-1 top-1 p-2 rounded-full transition-all ${
                input.trim() ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-200 dark:bg-slate-700 text-gray-400 dark:text-slate-500'
            }`}
          >
            <IconSend className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWidget;
