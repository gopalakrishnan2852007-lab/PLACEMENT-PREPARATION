import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { MessageSquare, X, Send, Sparkles, User, Minimize2, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import { cn } from '../../lib/utils';
import { Button } from '../ui/Base';

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || '' });

interface Message {
  role: 'user' | 'model';
  text: string;
}

const SYSTEM_PROMPT = `Act as a Senior FAANG Engineer and specialized DSA Tutor. I am a complete beginner with zero knowledge of Data Structures and Algorithms.
Instructions:
1. Explain this topic using a 'Real-World Analogy' (like a parking lot or a train).
2. Explain the 'Why': Why do companies use this instead of something else?
3. Give me a 'Cheat Sheet' of the 3 most important operations and their Time Complexity (Big O).
4. Provide one 'LeetCode Easy' code example with line-by-line comments explaining the logic.
5. End with one practice question for me to solve. Do not give me the answer yet.`;

export function AskAI() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: "Hey! I'm your FAANG-level DSA Mentor. Tell me what topic or problem you're stuck on, and I'll break it down from scratch for you!" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading, isOpen, isMinimized]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      // Build conversation history for context
      const history = messages.map(m => ({ role: m.role, parts: [{ text: m.text }] }));
      
      const chat = ai.chats.create({
        model: "gemini-3-flash-preview",
        config: {
          systemInstruction: SYSTEM_PROMPT
        }
      });

      // Restore history manually if SDK requires it, or just send the latest prompt
      // For simplicity here, we send the whole prompt context if needed, but chat handles it.
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
            ...messages.map(m => ({ role: m.role, parts: [{text: m.text}] })),
            { role: 'user', parts: [{ text: userMsg }]}
        ],
        config: { systemInstruction: SYSTEM_PROMPT }
      });

      setMessages(prev => [...prev, { role: 'model', text: response.text || "I'm having trouble thinking right now." }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', text: "Oh no! There was a glitch connecting to the mentor." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div 
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <button
              onClick={() => setIsOpen(true)}
              className="bg-blue-600 hover:bg-blue-500 text-white w-14 h-14 rounded-full shadow-2xl shadow-blue-500/30 flex items-center justify-center transition-transform hover:scale-110 relative group"
            >
              <Sparkles size={24} />
              <div className="absolute inset-0 bg-white/20 rounded-full blur animate-pulse" />
              
              {/* Tooltip */}
              <div className="absolute right-full mr-4 bg-zinc-900 border border-white/10 text-white text-xs font-bold px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                Ask AI Mentor
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: 50, opacity: 0, scale: 0.95 }}
            animate={{ 
              y: 0, 
              opacity: 1, 
              scale: 1,
              height: isMinimized ? 'auto' : '600px',
            }}
            exit={{ y: 50, opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={cn(
              "fixed bottom-6 right-6 z-50 w-[400px] max-w-[calc(100vw-3rem)] bg-zinc-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden",
              isMinimized ? "" : "h-[600px] max-h-[calc(100vh-6rem)]"
            )}
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-white/5 bg-zinc-950/50 flex items-center justify-between cursor-pointer" onClick={() => setIsMinimized(!isMinimized)}>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/20">
                  <Sparkles size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white tracking-tight">FAANG AI Mentor</h3>
                  <p className="text-[10px] text-zinc-400 font-medium">Zero-to-Hero Tutor</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); }} className="w-8 h-8 rounded-lg hover:bg-white/5 flex items-center justify-center text-zinc-400 transition-colors">
                  {isMinimized ? <Maximize2 size={14} /> : <Minimize2 size={14} />}
                </button>
                <button onClick={(e) => { e.stopPropagation(); setIsOpen(false); setIsMinimized(false); }} className="w-8 h-8 rounded-lg hover:bg-red-500/10 hover:text-red-400 flex items-center justify-center text-zinc-400 transition-colors">
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            {!isMinimized && (
              <>
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 font-sans text-sm">
                  {messages.map((msg, idx) => (
                    <div key={idx} className={cn("flex gap-3", msg.role === 'user' ? "flex-row-reverse" : "")}>
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center shrink-0 border",
                        msg.role === 'user' ? "bg-zinc-800 border-white/5 text-zinc-400" : "bg-blue-600 border-blue-500 text-white"
                      )}>
                        {msg.role === 'user' ? <User size={14} /> : <Sparkles size={14} />}
                      </div>
                      <div className={cn(
                        "p-3 rounded-2xl max-w-[80%]",
                        msg.role === 'user' 
                          ? "bg-zinc-800/80 text-zinc-200 rounded-tr-sm border border-white/5" 
                          : "bg-blue-600/10 text-zinc-300 rounded-tl-sm border border-blue-500/20 prose prose-invert prose-p:leading-relaxed prose-pre:bg-zinc-950 prose-pre:border prose-pre:border-white/5 overflow-hidden text-sm"
                      )}>
                        {msg.role === 'user' ? msg.text : <Markdown>{msg.text}</Markdown>}
                      </div>
                    </div>
                  ))}
                  {loading && (
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                        <Sparkles size={14} className="text-white animate-pulse" />
                      </div>
                      <div className="p-4 rounded-2xl rounded-tl-sm bg-blue-600/10 border border-blue-500/20 flex gap-1 items-center">
                        <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" />
                        <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0.2s' }} />
                        <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0.4s' }} />
                      </div>
                    </div>
                  )}
                </div>

                {/* Input Area */}
                <div className="p-4 bg-zinc-950/80 border-t border-white/5">
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      className="w-full bg-zinc-900 border border-white/10 text-white text-sm rounded-xl pl-4 pr-12 py-3 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-zinc-600"
                      placeholder="E.g. What is a Linked List in Python?"
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleSend()}
                      disabled={loading}
                    />
                    <button
                      onClick={handleSend}
                      disabled={!input.trim() || loading}
                      className="absolute right-2 w-8 h-8 flex items-center justify-center bg-blue-600 text-white rounded-lg hover:bg-blue-500 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors"
                    >
                      <Send size={14} className={cn(loading && "opacity-0")} />
                      {loading && <div className="absolute w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                    </button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
