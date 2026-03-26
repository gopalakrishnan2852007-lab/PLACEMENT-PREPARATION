import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Card, Button, Input } from '@/src/components/ui/Base';
import { 
  FileText, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Zap,
  Target,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import { cn } from '@/src/lib/utils';

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || '' });

export default function ResumeAnalyzer() {
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!resumeText || !jobDescription) return;
    setLoading(true);

    const prompt = `
      Analyze the following Resume against the Job Description. 
      Provide:
      1. ATS Match Score (0-100)
      2. Missing Keywords
      3. Strengths
      4. Areas for Improvement
      5. Suggestions for optimization.

      Resume:
      ${resumeText}

      Job Description:
      ${jobDescription}
    `;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          systemInstruction: "You are an expert HR and ATS optimization specialist. Provide a detailed, professional analysis of the resume against the job description. Use clear headings and bullet points."
        }
      });
      setAnalysis(response.text || "Analysis failed. Please try again.");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="mb-12">
        <h1 className="text-4xl font-black text-white mb-4 tracking-tight">AI Resume Scorer</h1>
        <p className="text-blue-200/60 max-w-2xl">
          Check how well your resume matches the job description. Get instant ATS optimization tips powered by Gemini AI.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <div className="space-y-6">
          <Card className="p-6 bg-white/5 border-white/10 backdrop-blur-md">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center">
                <FileText size={20} />
              </div>
              <h2 className="text-white font-bold">Your Resume Content</h2>
            </div>
            <textarea
              placeholder="Paste your resume text here..."
              className="w-full h-64 bg-white/5 border border-white/10 rounded-2xl p-4 text-white/80 text-sm focus:border-blue-500 outline-none transition-all resize-none placeholder:text-white/20"
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
            />
          </Card>

          <Card className="p-6 bg-white/5 border-white/10 backdrop-blur-md">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center">
                <Target size={20} />
              </div>
              <h2 className="text-white font-bold">Job Description</h2>
            </div>
            <textarea
              placeholder="Paste the job description here..."
              className="w-full h-64 bg-white/5 border border-white/10 rounded-2xl p-4 text-white/80 text-sm focus:border-purple-500 outline-none transition-all resize-none placeholder:text-white/20"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
          </Card>

          <Button 
            onClick={handleAnalyze}
            disabled={!resumeText || !jobDescription || loading}
            className="w-full h-14 bg-blue-600 hover:bg-blue-500 text-white font-black text-lg rounded-2xl shadow-xl shadow-blue-600/20"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Zap size={20} className="animate-pulse" />
                Analyzing with AI...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Sparkles size={20} />
                Get ATS Score
              </span>
            )}
          </Button>
        </div>

        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {analysis ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="h-full"
              >
                <Card className="p-8 bg-white/5 border-white/10 backdrop-blur-md h-full overflow-y-auto max-h-[calc(100vh-250px)] rounded-3xl">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-black text-white tracking-tight">Analysis Report</h2>
                    <Button 
                      variant="ghost" 
                      onClick={() => setAnalysis(null)}
                      className="text-white/40 hover:text-white"
                    >
                      Reset
                    </Button>
                  </div>
                  <div className="markdown-body prose prose-invert max-w-none prose-blue">
                    <Markdown>{analysis}</Markdown>
                  </div>
                </Card>
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-white/10 rounded-[2.5rem] bg-white/5 backdrop-blur-sm">
                <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center text-white/20 mb-6">
                  <Search size={40} />
                </div>
                <h3 className="text-xl font-bold text-white/60 mb-2">No Analysis Yet</h3>
                <p className="text-white/30 text-sm max-w-xs">
                  Paste your resume and the job description to get a detailed AI-powered analysis.
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: Zap, title: "ATS Optimized", desc: "Our AI understands how modern Applicant Tracking Systems work." },
          { icon: Target, title: "Keyword Matching", desc: "Identify exactly which skills you're missing for the role." },
          { icon: Sparkles, title: "Actionable Advice", desc: "Get specific phrasing suggestions to improve your impact." }
        ].map((item, i) => (
          <div key={i} className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all group">
            <item.icon className="text-blue-400 mb-4 group-hover:scale-110 transition-transform" size={24} />
            <h3 className="text-white font-bold mb-2">{item.title}</h3>
            <p className="text-white/40 text-sm">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
