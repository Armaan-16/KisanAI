import React, { useState, useEffect, useRef } from 'react';
import { IconSend, IconMic, IconImage, IconX } from './Icons';
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
  const [isListening, setIsListening] = useState(false);
  const [attachedImage, setAttachedImage] = useState<{ base64: string; type: string } | null>(null);
  
  const chatSessionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const toggleListening = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }

    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Your browser does not support voice input.");
      return;
    }

    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = language === 'hi' ? 'hi-IN' : language === 'or' ? 'or-IN' : 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    setIsListening(true);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(prev => prev ? `${prev} ${transcript}` : transcript);
      setIsListening(false);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        // Remove data URL prefix for API
        const base64Data = base64String.split(',')[1];
        setAttachedImage({
          base64: base64Data,
          type: file.type
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setAttachedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSend = async () => {
    if ((!input.trim() && !attachedImage) || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      image: attachedImage ? `data:${attachedImage.type};base64,${attachedImage.base64}` : undefined,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    const currentImage = attachedImage;
    setAttachedImage(null); // Clear image immediately
    if (fileInputRef.current) fileInputRef.current.value = '';
    
    setIsLoading(true);

    try {
      let response: GenerateContentResponse;
      
      // If we have an image, we construct a multipart message
      if (currentImage) {
          const parts: any[] = [];
          if (userMsg.text) {
              parts.push({ text: userMsg.text });
          }
          parts.push({
              inlineData: {
                  mimeType: currentImage.type,
                  data: currentImage.base64
              }
          });
          
          response = await chatSessionRef.current.sendMessage({ 
              message: parts
          });
      } else {
          response = await chatSessionRef.current.sendMessage({ message: userMsg.text });
      }

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
              className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                msg.role === 'user'
                  ? 'bg-green-600 text-white rounded-tr-none'
                  : 'bg-green-100 dark:bg-slate-800 text-gray-800 dark:text-slate-100 rounded-tl-none border border-green-200 dark:border-slate-700'
              }`}
            >
              {msg.image && (
                <div className="mb-2 rounded-lg overflow-hidden">
                   <img src={msg.image} alt="User upload" className="max-w-full h-auto max-h-48 object-cover" />
                </div>
              )}
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
        {attachedImage && (
            <div className="flex items-center gap-2 mb-2 p-2 bg-gray-100 dark:bg-slate-800 rounded-lg w-fit animate-in fade-in slide-in-from-bottom-2">
                <div className="w-10 h-10 rounded overflow-hidden">
                    <img src={`data:${attachedImage.type};base64,${attachedImage.base64}`} alt="Preview" className="w-full h-full object-cover" />
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">Image attached</span>
                <button onClick={handleRemoveImage} className="p-1 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-full">
                    <IconX className="w-4 h-4 text-gray-500" />
                </button>
            </div>
        )}
        <div className="relative flex items-center gap-2">
          {/* File Input Hidden */}
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*" 
            onChange={handleImageSelect}
          />
          
          <div className="relative flex-1">
             <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t.chatPlaceholder}
                className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-200 text-sm rounded-full pl-4 pr-24 py-3 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all placeholder-gray-400 dark:placeholder-gray-500"
                disabled={isLoading}
             />
             <div className="absolute right-2 top-1.5 flex items-center gap-1">
                 <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isLoading}
                    className="p-1.5 rounded-full text-gray-400 hover:text-green-600 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                    title="Attach Image"
                 >
                    <IconImage className="w-5 h-5" />
                 </button>
                 <button
                    onClick={toggleListening}
                    disabled={isLoading}
                    className={`p-1.5 rounded-full transition-all ${isListening ? 'text-red-500 bg-red-100 animate-pulse' : 'text-gray-400 hover:text-green-600 hover:bg-gray-100 dark:hover:bg-slate-700'}`}
                    title="Voice Input"
                 >
                    <IconMic className="w-5 h-5" />
                 </button>
             </div>
          </div>

          <button
            onClick={handleSend}
            disabled={isLoading || (!input.trim() && !attachedImage)}
            className={`p-3 rounded-full transition-all shrink-0 ${
                (input.trim() || attachedImage) ? 'bg-green-600 text-white hover:bg-green-700 shadow-md' : 'bg-gray-200 dark:bg-slate-800 text-gray-400 dark:text-slate-600'
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
