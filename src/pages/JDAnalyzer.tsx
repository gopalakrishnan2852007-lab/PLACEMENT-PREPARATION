import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Card, Button } from '@/src/components/ui/Base';
import { analyzeJDFn } from '@/src/firebase';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ClipboardList, Sparkles, User, Target, Building2, 
  Map, FileText, Loader2, CheckCircle2, XCircle, ChevronRight, Zap 
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useStore } from '@/src/store/useStore';
import { GoogleGenAI } from "@google/genai";

// Suppress error using any if Vite env is strictly typed but env typing is missing
const ai = new GoogleGenAI({ apiKey: (import.meta as any).env.VITE_GEMINI_API_KEY || '' });

interface AnalysisResult {
  role: string;
  experienceLevel: string;
  extractedSkills: {
    mustHave: string[];
    goodToHave: string[];
  };
  skillCategories: {
    programming: string[];
    frameworks: string[];
    databases: string[];
    softSkills: string[];
  };
  skillGap: {
    missingSkills: string[];
    strengths: string[];
  };
  companySuggestions: Array<{ name: string; category: string; matchPercent: number }>;
  roadmap: Array<{ day: number; topic: string; action: string }>;
  atsPredictor: {
    score: number;
    resumeTips: string[];
  };
  interviewQuestions: string[];
}

export default function JDAnalyzer() {
  const location = useLocation();
  const [jdText, setJdText] = useState('');
  const [userSkills, setUserSkills] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (location.state?.role && location.state?.company) {
      const autoJd = `Applying for the role of ${location.state.role} at ${location.state.company}. Provide a comprehensive preparation guide assuming standard industry requirements for this role.`;
      setJdText(autoJd);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const analyze = async () => {
    if (!jdText.trim()) {
      setError("Please paste a Job Description.");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const prompt = `
      You are an expert technical recruiter and career coach.
      Analyze this Job Description and the user's current skills to generate a comprehensive placement preparation matrix.
      You MUST return exactly ONLY RAW JSON matching this structure. Do not wrap in markdown \`\`\`json.
      
      {
        "role": "e.g., Frontend Engineer",
        "experienceLevel": "e.g., Fresher / 2-4 Years",
        "extractedSkills": {
          "mustHave": ["React", "JavaScript", "CSS"],
          "goodToHave": ["AWS", "Docker", "Figma"]
        },
        "skillCategories": {
          "programming": ["JavaScript", "TypeScript"],
          "frameworks": ["React", "Node.js"],
          "databases": ["MongoDB"],
          "softSkills": ["Communication"]
        },
        "skillGap": {
          "missingSkills": ["Docker", "AWS"],
          "strengths": ["React", "JavaScript"]
        },
        "companySuggestions": [
          { "name": "Google", "category": "Product", "matchPercent": 92 },
          { "name": "TCS", "category": "Service", "matchPercent": 75 },
          { "name": "Stripe", "category": "Startup", "matchPercent": 88 }
        ],
        "roadmap": [
          { "day": 1, "topic": "Core JavaScript Concepts", "action": "Review Closures, Promises, and Event Loop" },
          { "day": 2, "topic": "React Hooks Deep Dive", "action": "Build a custom hook, practice useEffect optimizations" }
        ],
        "atsPredictor": {
          "score": 85,
          "resumeTips": ["Add measurable metrics to past projects", "Explicitly mention Docker"]
        },
        "interviewQuestions": [
          "Explain the Virtual DOM in React.",
          "How would you optimize a slow-loading web application?"
        ]
      }

      Input User Skills: ${userSkills || 'Unknown, assume fresher basics'}
      Input Job Description:
      ${jdText}
    `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          temperature: 0.2,
          responseMimeType: "application/json"
        }
      });
      
      const parsedJSON = JSON.parse(response.text || "{}");
      setResult(parsedJSON);

    } catch (err: any) {
      console.error(err);
      setError("AI Generation Failed: Please verify your Gemini API key.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 h-full relative">
      <div className="mb-8">
        <h1 className="text-4xl font-black text-zinc-900 dark:text-white mb-2 tracking-tight">JD Analyzer & Prep Planner</h1>
        <p className="text-zinc-500 dark:text-zinc-400">
          AI-powered Job Description mapping, Skill Gap logic, and ATS Optimization Engine.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* INPUT PANE */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold flex items-center gap-2">
                <ClipboardList className="text-blue-500" size={20} />
                Job Description
              </h3>
            </div>
            <textarea
              className="w-full h-64 bg-zinc-50 dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 text-sm focus:ring-1 focus:ring-blue-500 outline-none resize-none transition-all dark:text-white"
              placeholder="Paste the full job description here..."
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
            />

            <div className="flex items-center justify-between mt-6 mb-4">
              <h3 className="font-bold flex items-center gap-2">
                <User className="text-purple-500" size={20} />
                My Skills (Optional)
              </h3>
            </div>
            <textarea
              className="w-full h-24 bg-zinc-50 dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 text-sm focus:ring-1 focus:ring-purple-500 outline-none resize-none transition-all dark:text-white"
              placeholder="e.g. React, Node.js, Python, 2 years experience..."
              value={userSkills}
              onChange={(e) => setUserSkills(e.target.value)}
            />

            {error && <p className="text-red-500 text-xs font-bold mt-4 animate-pulse">{error}</p>}

            <Button 
              onClick={analyze}
              disabled={loading || !jdText.trim()}
              className="w-full mt-6 bg-blue-600 hover:bg-blue-500 text-white font-bold h-14 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
              {loading ? 'Analyzing Profile Data...' : 'Analyze JD & Build Plan'}
            </Button>
          </Card>
        </div>

        {/* OUTPUT PANE */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            {!result ? (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="h-full min-h-[600px] flex flex-col items-center justify-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] bg-zinc-50 dark:bg-[#18181b] p-12 text-center"
              >
                <div className="w-24 h-24 bg-blue-500/10 rounded-full flex items-center justify-center mb-6">
                  <Zap className="text-blue-500 w-12 h-12" />
                </div>
                <h3 className="text-2xl font-black text-zinc-400 dark:text-zinc-500 mb-2">Awaiting Parameters</h3>
                <p className="text-zinc-500 text-sm max-w-sm">Feed the AI engine a Job Description and your Resume Skills to instantly generate a targeted readiness matrix.</p>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="space-y-6"
              >
                {/* Header Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card className="p-4 bg-gradient-to-br from-blue-500/10 to-transparent border-blue-500/20">
                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Target Role</p>
                    <p className="font-black text-lg text-blue-500 dark:text-blue-400 line-clamp-1">{result.role}</p>
                  </Card>
                  <Card className="p-4">
                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Experience required</p>
                    <p className="font-black text-lg text-zinc-900 dark:text-white line-clamp-1">{result.experienceLevel}</p>
                  </Card>
                  <Card className="p-4 col-span-2 bg-gradient-to-r from-orange-500/10 to-transparent border-orange-500/20 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">ATS Prediction Score</p>
                      <div className="flex items-end gap-2">
                        <p className="font-black text-3xl text-orange-500">{result.atsPredictor.score}</p>
                        <p className="text-orange-500/60 font-medium mb-1">/ 100</p>
                      </div>
                    </div>
                    <FileText className="text-orange-500/40 w-12 h-12" />
                  </Card>
                </div>

                {/* Skills Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* JD Requirements */}
                  <Card className="p-6">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-3">
                      <Target className="text-red-500" size={18} />
                      Required Skills (JD)
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Must Have</p>
                        <div className="flex flex-wrap gap-2">
                          {result.extractedSkills.mustHave.map(s => (
                            <span key={s} className="px-2.5 py-1 rounded bg-red-500/10 text-red-500 text-xs font-bold ring-1 ring-red-500/20">{s}</span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Good to Have (Bonus)</p>
                        <div className="flex flex-wrap gap-2">
                          {result.extractedSkills.goodToHave.map(s => (
                            <span key={s} className="px-2.5 py-1 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-xs font-medium">{s}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Skill Gap Analysis */}
                  <Card className="p-6">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-3">
                      <User className="text-green-500" size={18} />
                      Your Skill Gap
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 flex items-center gap-1"><CheckCircle2 size={12} className="text-green-500"/> Core Strengths</p>
                        <div className="flex flex-wrap gap-2">
                          {result.skillGap.strengths.length > 0 ? result.skillGap.strengths.map(s => (
                            <span key={s} className="px-2.5 py-1 rounded bg-green-500/10 text-green-500 text-xs font-bold ring-1 ring-green-500/20">{s}</span>
                          )) : <span className="text-xs text-zinc-500 italic">No matching strengths found.</span>}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 flex items-center gap-1"><XCircle size={12} className="text-red-500" /> Missing / Weaknesses</p>
                        <div className="flex flex-wrap gap-2">
                          {result.skillGap.missingSkills.length > 0 ? result.skillGap.missingSkills.map(s => (
                            <span key={s} className="px-2.5 py-1 rounded bg-red-500/10 text-red-500 text-xs font-bold ring-1 ring-red-500/20">{s}</span>
                          )) : <span className="text-xs text-green-500 italic">No critical missing skills!</span>}
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Resume Optimizer Tips */}
                <Card className="p-6 border-orange-500/20 bg-orange-500/5">
                  <h3 className="text-lg font-bold mb-3 flex items-center gap-2 text-orange-500">
                    <FileText size={18} />
                    Resume Optimization Tips
                  </h3>
                  <ul className="space-y-2">
                    {result.atsPredictor.resumeTips.map((tip, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-zinc-700 dark:text-zinc-300">
                        <div className="mt-1 w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </Card>

                {/* 7 Day Roadmap */}
                <Card className="p-6">
                  <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                    <Map className="text-purple-500" size={18} />
                    7-Day Accelerated Prep Roadmap
                  </h3>
                  <div className="space-y-4 relative">
                    <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-zinc-200 dark:bg-zinc-800" />
                    {result.roadmap.map((step) => (
                      <div key={step.day} className="flex gap-6 relative z-10">
                        <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-[#18181b] border-2 border-purple-500 flex items-center justify-center font-bold text-xs shrink-0 text-zinc-900 dark:text-white">
                          D{step.day}
                        </div>
                        <div className="pt-1 pb-4">
                          <h4 className="font-bold text-zinc-900 dark:text-white mb-1">{step.topic}</h4>
                          <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">{step.action}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Company & Interview Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="p-6">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                      <Building2 className="text-blue-500" size={18} />
                      Target Company Matches
                    </h3>
                    <div className="space-y-3">
                      {result.companySuggestions.map((c, i) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800">
                          <div>
                            <p className="font-bold text-zinc-900 dark:text-white">{c.name}</p>
                            <p className="text-[10px] font-bold text-zinc-500 uppercase">{c.category}</p>
                          </div>
                          <div className="text-right">
                            <span className={cn(
                              "text-sm font-black",
                              c.matchPercent > 80 ? "text-green-500" : c.matchPercent > 60 ? "text-orange-500" : "text-red-500"
                            )}>{c.matchPercent}% Match</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>

                  <Card className="p-6">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                      <ClipboardList className="text-indigo-500" size={18} />
                      Expected Interview Questions
                    </h3>
                    <ul className="space-y-3">
                      {result.interviewQuestions.map((q, i) => (
                        <li key={i} className="flex gap-3 text-sm p-3 rounded-xl bg-zinc-50 dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300">
                          <span className="font-black text-indigo-500">Q.</span>
                          {q}
                        </li>
                      ))}
                    </ul>
                  </Card>
                </div>

              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
