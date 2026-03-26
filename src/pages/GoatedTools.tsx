import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Card, Button, Input } from '../components/ui/Base';
import { Brain, Mail, Wand2, Terminal, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import { useNavigate } from 'react-router-dom';

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || '' });

type ToolType = 'dsa' | 'email' | 'app' | 'simulator';

export default function GoatedTools() {
  const navigate = useNavigate();
  const [activeTool, setActiveTool] = useState<ToolType>('dsa');
  
  // DSA State
  const [dsaTopic, setDsaTopic] = useState('');
  const [dsaLang, setDsaLang] = useState('');
  
  // Email State
  const [emailCompany, setEmailCompany] = useState('');
  const [emailIssue, setEmailIssue] = useState('');

  // App State
  const [appName, setAppName] = useState('');
  const [appStack, setAppStack] = useState('');

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleGenerateDSA = async () => {
    if (!dsaTopic || !dsaLang) return;
    setLoading(true);
    setResult(null);

    const prompt = `Act as a Senior FAANG Engineer and specialized DSA Tutor. I am a complete beginner with zero knowledge of Data Structures and Algorithms.

Topic: ${dsaTopic}
Language: ${dsaLang}

Instructions:
1. Explain this topic using a 'Real-World Analogy' (like a parking lot or a train).
2. Explain the 'Why': Why do companies use this instead of something else?
3. Give me a 'Cheat Sheet' of the 3 most important operations and their Time Complexity (Big O).
4. Provide one 'LeetCode Easy' code example with line-by-line comments explaining the logic.
5. End with one practice question for me to solve. Do not give me the answer yet.`;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });
      setResult(response.text || "Generation failed.");
    } catch (error) {
      console.error(error);
      setResult("Error generating response. Please check your API key.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateEmail = async () => {
    if (!emailCompany || !emailIssue) return;
    setLoading(true);
    setResult(null);

    const prompt = `I need to write a high-stakes, professional email to a Recruiter/Placement Cell at ${emailCompany}.

The Problem: During my online assessment/AI interview, I experienced a critical issue: ${emailIssue}.

The Goal: Persuade them that I am a top-tier candidate who was stopped by a technical bug, and request a 'Manual Link Reset' or a rescheduled slot.

Tone: Professional, apologetic for the inconvenience, but technically clear about the error.

Write the email now.`;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });
      setResult(response.text || "Generation failed.");
    } catch (error) {
      console.error(error);
      setResult("Error generating response. Please check your API key.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateApp = async () => {
    if (!appName || !appStack) return;
    setLoading(true);
    setResult(null);

    const prompt = `Act as a Principal Software Architect. I want to build a ${appName}.

Stack: ${appStack}
Standard: Production-ready, Clean Code, SOLID principles.

Output Requirements:
1. Project Structure: Provide a professional folder architecture.
2. State Management: Use the best practice for this stack.
3. UI/UX: Use a modern 'Glassmorphism' or 'Minimalist' design logic with Tailwind CSS.
4. Error Handling: Implement global error boundaries and try/catch blocks.

Task: Generate the core App entry file and the primary functional component with full logic. No placeholders.`;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });
      setResult(response.text || "Generation failed.");
    } catch (error) {
      console.error(error);
      setResult("Error generating response. Please check your API key.");
    } finally {
      setLoading(false);
    }
  };

  const renderToolInputs = () => {
    switch (activeTool) {
      case 'dsa':
        return (
          <div className="space-y-4">
            <div>
              <label className="text-sm text-zinc-500 mb-1 block">Data Structure / Algorithm Topic</label>
              <Input 
                placeholder="e.g., Binary Search Trees, Graphs, Dynamic Programming"
                value={dsaTopic}
                onChange={(e) => setDsaTopic(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm text-zinc-500 mb-1 block">Programming Language</label>
              <Input 
                placeholder="e.g., Python, C++, Java, JavaScript"
                value={dsaLang}
                onChange={(e) => setDsaLang(e.target.value)}
              />
            </div>
            <Button 
              className="w-full h-12 mt-4" 
              onClick={handleGenerateDSA}
              disabled={!dsaTopic || !dsaLang || loading}
            >
              {loading ? <Loader2 className="animate-spin" /> : <><Sparkles size={18} className="mr-2" /> Generate Zero-to-Hero Lesson</>}
            </Button>
          </div>
        );
      case 'email':
        return (
          <div className="space-y-4">
            <div>
              <label className="text-sm text-zinc-500 mb-1 block">Company / Recruiter Name</label>
              <Input 
                placeholder="e.g., Google HR, Amazon Placement Cell"
                value={emailCompany}
                onChange={(e) => setEmailCompany(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm text-zinc-500 mb-1 block">What went wrong?</label>
              <Input 
                placeholder="e.g., Rendering Failure, Hardware glitch, Power cut"
                value={emailIssue}
                onChange={(e) => setEmailIssue(e.target.value)}
              />
            </div>
            <Button 
              className="w-full h-12 mt-4 bg-purple-600 hover:bg-purple-700 text-white" 
              onClick={handleGenerateEmail}
              disabled={!emailCompany || !emailIssue || loading}
            >
              {loading ? <Loader2 className="animate-spin" /> : <><Sparkles size={18} className="mr-2" /> Generate Recovery Email</>}
            </Button>
          </div>
        );
      case 'app':
        return (
          <div className="space-y-4">
            <div>
              <label className="text-sm text-zinc-500 mb-1 block">What are you building?</label>
              <Input 
                placeholder="e.g., Crypto Dashboard, Expense Tracker, Chatbot"
                value={appName}
                onChange={(e) => setAppName(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm text-zinc-500 mb-1 block">Tech Stack</label>
              <Input 
                placeholder="e.g., React, Tailwind, Next.js, Firebase"
                value={appStack}
                onChange={(e) => setAppStack(e.target.value)}
              />
            </div>
            <Button 
              className="w-full h-12 mt-4 bg-amber-600 hover:bg-amber-700 text-white" 
              onClick={handleGenerateApp}
              disabled={!appName || !appStack || loading}
            >
              {loading ? <Loader2 className="animate-spin" /> : <><Sparkles size={18} className="mr-2" /> Generate App Architecture</>}
            </Button>
          </div>
        );
      case 'simulator':
        return (
          <div className="space-y-6 text-center py-6">
            <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
              <Terminal size={32} />
            </div>
            <h3 className="text-xl font-bold text-zinc-900">AI Interview Simulator</h3>
            <p className="text-zinc-500 text-sm max-w-sm mx-auto">
              Launch our fully interactive, real-time mock interview environment powered by Gemini. You will receive live scoring and feedback.
            </p>
            <Button 
              className="h-12 bg-emerald-600 hover:bg-emerald-700 text-white" 
              onClick={() => navigate('/interviews')}
            >
              Open Simulator <ArrowRight size={18} className="ml-2" />
            </Button>
          </div>
        );
    }
  };

  return (
    <div className="bg-white text-zinc-900 min-h-[calc(100vh-6rem)] rounded-[2.5rem] p-8 md:p-12 shadow-xl border border-zinc-200 max-w-6xl mx-auto h-full flex flex-col relative overflow-hidden">
      <div className="mb-8">
        <h1 className="text-4xl font-black text-zinc-900 mb-4 tracking-tight">The "GOATED" Tools</h1>
        <p className="text-zinc-500 max-w-2xl">
          Instantly execute the absolute best career prompts. Generate emails, master DSA topics, build complex apps, and simulate interviews on demand.
        </p>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        <button
          onClick={() => { setActiveTool('dsa'); setResult(null); }}
          className={`p-4 rounded-2xl flex flex-col items-center gap-3 border transition-all ${
            activeTool === 'dsa' 
              ? 'bg-blue-600/10 border-blue-500 shadow-[0_0_30px_-5px_theme(colors.blue.500/30)]' 
              : 'bg-zinc-50 border-zinc-200 hover:border-white/20'
          }`}
        >
          <div className={`p-3 rounded-xl ${activeTool === 'dsa' ? 'bg-blue-500 text-zinc-900' : 'bg-blue-500/10 text-blue-400'}`}>
            <Brain size={24} />
          </div>
          <span className="font-bold text-zinc-900 text-sm">Zero-to-Hero DSA</span>
        </button>

        <button
          onClick={() => { setActiveTool('email'); setResult(null); }}
          className={`p-4 rounded-2xl flex flex-col items-center gap-3 border transition-all ${
            activeTool === 'email' 
              ? 'bg-purple-600/10 border-purple-500 shadow-[0_0_30px_-5px_theme(colors.purple.500/30)]' 
              : 'bg-zinc-50 border-zinc-200 hover:border-white/20'
          }`}
        >
          <div className={`p-3 rounded-xl ${activeTool === 'email' ? 'bg-purple-500 text-zinc-900' : 'bg-purple-500/10 text-purple-400'}`}>
            <Mail size={24} />
          </div>
          <span className="font-bold text-zinc-900 text-sm">Recovery Email</span>
        </button>

        <button
          onClick={() => { setActiveTool('app'); setResult(null); }}
          className={`p-4 rounded-2xl flex flex-col items-center gap-3 border transition-all ${
            activeTool === 'app' 
              ? 'bg-amber-600/10 border-amber-500 shadow-[0_0_30px_-5px_theme(colors.amber.500/30)]' 
              : 'bg-zinc-50 border-zinc-200 hover:border-white/20'
          }`}
        >
          <div className={`p-3 rounded-xl ${activeTool === 'app' ? 'bg-amber-500 text-zinc-900' : 'bg-amber-500/10 text-amber-400'}`}>
            <Wand2 size={24} />
          </div>
          <span className="font-bold text-zinc-900 text-sm">App Architect</span>
        </button>

        <button
          onClick={() => { setActiveTool('simulator'); setResult(null); }}
          className={`p-4 rounded-2xl flex flex-col items-center gap-3 border transition-all ${
            activeTool === 'simulator' 
              ? 'bg-emerald-600/10 border-emerald-500 shadow-[0_0_30px_-5px_theme(colors.emerald.500/30)]' 
              : 'bg-zinc-50 border-zinc-200 hover:border-white/20'
          }`}
        >
          <div className={`p-3 rounded-xl ${activeTool === 'simulator' ? 'bg-emerald-500 text-zinc-900' : 'bg-emerald-500/10 text-emerald-400'}`}>
            <Terminal size={24} />
          </div>
          <span className="font-bold text-zinc-900 text-sm">AI Simulator</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1">
        <Card className="p-6 bg-zinc-50 border-zinc-200 h-fit">
          <h2 className="text-xl font-bold text-zinc-900 mb-6">
            {activeTool === 'dsa' && 'Configure Lesson'}
            {activeTool === 'email' && 'Configure Email'}
            {activeTool === 'app' && 'Configure App'}
            {activeTool === 'simulator' && 'Launch'}
          </h2>
          {renderToolInputs()}
        </Card>

        <Card className="lg:col-span-2 bg-white border-zinc-200 overflow-hidden flex flex-col min-h-[500px]">
          <div className="bg-zinc-50 border-b border-zinc-200 p-3 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
            <span className="ml-2 text-xs font-mono text-zinc-500 font-bold uppercase tracking-widest">
              Output Generation
            </span>
          </div>
          
          <div className="p-8 flex-1 overflow-y-auto">
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full flex flex-col items-center justify-center space-y-4"
                >
                  <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
                  <p className="text-zinc-500 font-medium animate-pulse">Running GOATED Prompt...</p>
                </motion.div>
              ) : result ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="markdown-body prose  max-w-none prose-blue font-mono text-sm leading-relaxed"
                >
                  <Markdown>{result}</Markdown>
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-full flex flex-col items-center justify-center text-center opacity-50"
                >
                  <Sparkles className="w-16 h-16 text-zinc-600 mb-4" />
                  <p className="text-zinc-500 max-w-[250px]">
                    Fill in the configuration to the left and click generate to see the absolute BEST ai response.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Card>
      </div>
    </div>
  );
}
