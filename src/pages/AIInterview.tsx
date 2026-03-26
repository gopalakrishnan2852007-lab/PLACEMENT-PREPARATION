import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Card, Button, Input } from '../components/ui/Base';
import { 
  Bot, 
  Send, 
  User, 
  Sparkles, 
  RefreshCcw,
  MessageSquare,
  Trophy,
  ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import { cn } from '../lib/utils';
import { useLocation } from 'react-router-dom';

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || '' });

interface Message {
  role: 'user' | 'model';
  text: string;
}

export default function AIInterview() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: "Welcome to the AI Interview Simulator. I'll be conducting this session. What specific role are you targeting today?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const [topic, setTopic] = useState(location.state?.topic || '');
  const [isStarted, setIsStarted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleStart = async () => {
    if (!topic.trim()) return;
    setIsStarted(true);
    setLoading(true);
    
    const prompt = `User's target role: ${topic}. Begin the interview now by asking the first question.`;
    
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          systemInstruction: `Act as an AI-Driven Interview Platform (like HireVue). The candidate is applying for the role mentioned in the prompt.
Rules:
1. You will ask 3 Behavioral Questions (STAR method) and 1 Coding Logic Question.
2. Ask the questions ONE BY ONE. Do not ask multiple questions at once.
3. After the candidate answers, do not just move on—provide a 'Performance Score' out of 10 based on clarity, keywords, and technical accuracy.
4. Give tips on how to improve 'AI-friendliness' (eye contact, keywords, structure) along with the score.
5. Then, ask the next question.`
        }
      });
      
      setMessages([{ role: 'model', text: response.text || "Let's begin. Question 1:" }]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = { role: 'user', text: input } as Message;
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      // We need to send the history
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [...history, { role: 'user', parts: [{ text: input }] }],
        config: {
          systemInstruction: `Act as an AI-Driven Interview Platform (like HireVue).
Rules:
1. You will ask 3 Behavioral Questions (STAR method) and 1 Coding Logic Question.
2. Ask ONE BY ONE.
3. Upon receiving an answer, FIRST provide a 'Performance Score' out of 10 based on clarity, keywords, and technical accuracy.
4. Give tips on how to improve 'AI-friendliness' (eye contact, keywords, structure).
5. Then ask the next question.`
        }
      });

      setMessages(prev => [...prev, { role: 'model', text: response.text || "I'm sorry, I couldn't process that." }]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!isStarted) {
    return (
      <div className="bg-white text-zinc-900 min-h-[calc(100vh-6rem)] rounded-[2.5rem] p-8 md:p-12 shadow-xl border border-zinc-200 max-w-4xl mx-auto relative overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-blue-600/20 text-blue-500 mb-6 border border-blue-500/20">
            <Bot size={40} />
          </div>
          <h1 className="text-4xl font-black text-zinc-900 mb-4 tracking-tight">AI Interview Coach</h1>
          <p className="text-zinc-500 text-lg max-w-2xl mx-auto">
            Practice mock interviews for any role or company. Get real-time feedback and improve your communication skills.
          </p>
        </motion.div>

        <Card className="p-10">
          <div className="space-y-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">What are you preparing for?</label>
              <Input 
                placeholder="e.g. Frontend Engineer at Google, Java Developer, HR Round..."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="h-14 text-lg"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {['Technical', 'Behavioral', 'System Design'].map((type) => (
                <button
                  key={type}
                  onClick={() => setTopic(prev => prev ? `${prev} (${type})` : type)}
                  className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200 text-zinc-500 hover:border-blue-500/30 hover:text-zinc-900 transition-all text-sm font-bold"
                >
                  {type}
                </button>
              ))}
            </div>

            <Button 
              onClick={handleStart}
              disabled={!topic.trim()}
              className="w-full h-14 text-lg"
            >
              Start Mock Interview
            </Button>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {[
            { icon: Sparkles, title: "Real-time Feedback", desc: "Get instant analysis on your answers and body language.", color: "text-blue-500", bg: "bg-blue-500/10" },
            { icon: Trophy, title: "Company Specific", desc: "Tailored questions for top product-based companies.", color: "text-purple-500", bg: "bg-purple-500/10" },
            { icon: MessageSquare, title: "Unlimited Practice", desc: "Practice as many times as you want, anytime.", color: "text-emerald-500", bg: "bg-emerald-500/10" }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-8 rounded-[2rem] bg-zinc-50 border border-zinc-200"
            >
              <div className={`w-12 h-12 ${feature.bg} ${feature.color} rounded-2xl flex items-center justify-center mb-6 border border-zinc-200`}>
                <feature.icon size={24} />
              </div>
              <h3 className="text-zinc-900 font-bold mb-2">{feature.title}</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white text-zinc-900 h-[calc(100vh-6rem)] rounded-[2.5rem] p-8 md:p-12 shadow-xl border border-zinc-200 flex flex-col max-w-5xl mx-auto relative overflow-hidden">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-5">
          <div className="w-12 h-12 rounded-2xl bg-blue-600/20 text-blue-500 flex items-center justify-center border border-blue-500/20">
            <Bot size={24} />
          </div>
          <div>
            <h2 className="text-xl font-black text-zinc-900 tracking-tight">Interviewing for: {topic}</h2>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Live Session</span>
            </div>
          </div>
        </div>
        <Button 
          variant="secondary" 
          onClick={() => setIsStarted(false)}
          className="gap-2"
        >
          <ArrowLeft size={16} />
          End Session
        </Button>
      </div>

      <Card className="flex-1 flex flex-col overflow-hidden border-zinc-200">
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-8 space-y-8 scroll-smooth"
        >
          <AnimatePresence initial={false}>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "flex gap-5 max-w-[85%]",
                  msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
                )}
              >
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border",
                  msg.role === 'user' ? "bg-zinc-50 border-zinc-200 text-zinc-500" : "bg-blue-600/10 border-blue-500/20 text-blue-500"
                )}>
                  {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
                </div>
                <div className={cn(
                  "p-6 rounded-[2rem] text-sm leading-relaxed shadow-xl",
                  msg.role === 'user' 
                    ? "bg-blue-600 text-white rounded-tr-none" 
                    : "bg-zinc-50/50 border border-zinc-200 text-zinc-700 rounded-tl-none"
                )}>
                  <div className="markdown-body prose  max-w-none prose-blue">
                    <Markdown>{msg.text}</Markdown>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {loading && (
            <div className="flex gap-5">
              <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-500 flex items-center justify-center">
                <RefreshCcw size={20} className="animate-spin" />
              </div>
              <div className="p-6 rounded-[2rem] bg-zinc-50/50 border border-zinc-200 text-zinc-500 text-sm italic rounded-tl-none">
                AI is analyzing your response...
              </div>
            </div>
          )}
        </div>

        <div className="p-6 bg-zinc-50/50 border-t border-zinc-200">
          <div className="flex gap-3">
            <Input 
              placeholder="Type your answer here..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1 h-14 bg-zinc-500"
            />
            <Button 
              onClick={handleSend}
              disabled={!input.trim() || loading}
              className="w-14 h-14 p-0 rounded-2xl"
            >
              <Send size={24} />
            </Button>
          </div>
          <p className="text-[10px] text-zinc-700 mt-4 text-center uppercase tracking-widest font-black">
            Powered by Gemini AI • Professional Interview Coach
          </p>
        </div>
      </Card>
    </div>
  );
}
