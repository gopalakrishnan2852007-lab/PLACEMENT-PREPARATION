import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { GoogleGenAI } from "@google/genai";
import { Card, Button } from '@/src/components/ui/Base';
import { 
  ClipboardList, 
  Sparkles, 
  Zap, 
  Target, 
  Calendar,
  BookOpen,
  MessageSquare,
  Lightbulb
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import { cn } from '@/src/lib/utils';

const ai = new GoogleGenAI({ apiKey: (import.meta as any).env.VITE_GEMINI_API_KEY || '' });

export default function JDPrep() {
  const location = useLocation();
  const [jd, setJd] = useState('');
  const [loading, setLoading] = useState(false);
  const [guide, setGuide] = useState<string | null>(null);

  const generatePrepGuide = async (customJd?: string) => {
    const textToProcess = customJd || jd;
    if (!textToProcess.trim()) return;
    setLoading(true);

    const prompt = `
      Based on the following Job Description, generate a comprehensive Interview Preparation Guide.
      Include:
      1. **Top 5 Technical Skills** to master for this specific role.
      2. **Expected Interview Questions** (Technical & Behavioral).
      3. **Project Highlights**: What kind of projects should I highlight in my portfolio?
      4. **7-Day Rapid Prep Roadmap**: A day-by-day plan to get ready.
      5. **Company Culture Fit**: What values should I demonstrate?

      Job Description:
      ${textToProcess}
    `;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          systemInstruction: "You are an elite career coach and technical recruiter. Your goal is to provide a highly actionable, structured, and motivational preparation guide based on a job description. Use professional formatting with clear headings and bullet points."
        }
      });
      setGuide(response.text || "Failed to generate guide. Please try again.");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (location.state?.role && location.state?.company) {
      const autoJd = `I am applying for the role of ${location.state.role} at ${location.state.company}. Please provide a comprehensive preparation guide assuming standard industry requirements for this role.`;
      setJd(autoJd);
      
      // Clear the state so it doesn't re-run endlessly if the user navigates around
      window.history.replaceState({}, document.title);
      
      // Auto-trigger generation
      generatePrepGuide(autoJd);
    }
  }, [location.state]);

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="mb-12">
        <h1 className="text-4xl font-black text-white mb-4 tracking-tight">JD Prep Guide</h1>
        <p className="text-blue-200/60 max-w-2xl">
          Paste any Job Description and get a personalized 7-day preparation roadmap and interview question bank.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-6">
          <Card className="p-6 bg-white/5 border-white/10 backdrop-blur-md rounded-3xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center">
                <ClipboardList size={20} />
              </div>
              <h2 className="text-white font-bold">Job Description</h2>
            </div>
            <textarea
              placeholder="Paste the full job description here (Role, Requirements, Responsibilities)..."
              className="w-full h-[400px] bg-white/5 border border-white/10 rounded-2xl p-4 text-white/80 text-sm focus:border-blue-500 outline-none transition-all resize-none placeholder:text-white/20"
              value={jd}
              onChange={(e) => setJd(e.target.value)}
            />
            <Button 
              onClick={generatePrepGuide}
              disabled={!jd.trim() || loading}
              className="w-full mt-6 h-14 bg-blue-600 hover:bg-blue-500 text-white font-black text-lg rounded-2xl shadow-xl shadow-blue-600/20"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Zap size={20} className="animate-pulse" />
                  Generating Guide...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Sparkles size={20} />
                  Generate Prep Guide
                </span>
              )}
            </Button>
          </Card>

          <div className="grid grid-cols-1 gap-4">
            {[
              { icon: Target, title: "Skill Gap Analysis", color: "text-blue-400" },
              { icon: Calendar, title: "7-Day Roadmap", color: "text-green-400" },
              { icon: MessageSquare, title: "Mock Questions", color: "text-purple-400" }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all">
                <item.icon className={item.color} size={20} />
                <span className="text-white/60 font-medium text-sm">{item.title}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {guide ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="h-full"
              >
                <Card className="p-8 bg-white/5 border-white/10 backdrop-blur-md h-full overflow-y-auto max-h-[calc(100vh-250px)] relative rounded-3xl">
                  <div className="sticky top-0 bg-slate-900/80 backdrop-blur-md pb-4 mb-4 border-b border-white/10 flex items-center justify-between z-10">
                    <div className="flex items-center gap-2">
                      <Lightbulb className="text-blue-400" size={24} />
                      <h2 className="text-2xl font-black text-white tracking-tight">Your Prep Strategy</h2>
                    </div>
                    <Button 
                      variant="ghost" 
                      onClick={() => setGuide(null)}
                      className="text-white/40 hover:text-white"
                    >
                      Clear
                    </Button>
                  </div>
                  <div className="markdown-body prose prose-invert max-w-none prose-blue">
                    <Markdown>{guide}</Markdown>
                  </div>
                </Card>
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-white/10 rounded-[2.5rem] bg-white/5 backdrop-blur-sm min-h-[600px]">
                <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center text-white/20 mb-6 border border-white/10">
                  <BookOpen size={48} />
                </div>
                <h3 className="text-2xl font-black text-white/60 mb-2 tracking-tight">Ready to Prepare?</h3>
                <p className="text-white/30 text-sm max-w-xs mx-auto leading-relaxed">
                  Input the job description on the left to unlock a custom-tailored interview strategy and roadmap.
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
