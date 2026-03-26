import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Card, Button, Input } from '@/src/components/ui/Base';
import { 
  FileText, 
  Search, 
  Sparkles, 
  Zap,
  Target,
  Building2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || '' });

export default function ResumeAnalyzer() {
  const [resumeText, setResumeText] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [targetCompany, setTargetCompany] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!resumeText || !targetRole) return;
    setLoading(true);

    const prompt = `
      You are an elite AI Resume Intelligence System trained to act like a top-tier recruiter from companies like Google, Amazon, and Microsoft.
      Your task is to deeply analyze a student's resume and provide brutally honest, structured, and highly actionable feedback to maximize their chances of getting shortlisted.

      INPUT:
      - Target Role: ${targetRole}
      - Target Company: ${targetCompany || "General Tech Industry"}
      
      - Resume Text:
      ${resumeText}

      OUTPUT FORMAT (STRICT — FOLLOW EXACTLY in Markdown):

      ### 1. 🔥 Overall Resume Score: (0–100)
      ### 2. 🤖 ATS Compatibility Score: (0–100)

      ### 3. 💪 Key Strengths:
      (Provide 4–6 strong, specific positives)

      ### 4. ❌ Critical Weaknesses:
      (Provide 4–6 clear issues that may cause rejection)

      ### 5. 📊 Section-wise Analysis:
      - **Summary/About:** (feedback + improvement)
      - **Skills:** (missing or irrelevant skills)
      - **Projects:** (impact, clarity, technical depth)
      - **Experience:** (if missing, say so clearly)
      - **Education:** (relevance)

      ### 6. 🎯 Missing Keywords (VERY IMPORTANT):
      (Suggest role-specific keywords recruiters expect, including technologies, tools, and action verbs)

      ### 7. ✍️ Line-by-Line Improvements:
      (Rewrite 2–3 weak resume lines into strong, impact-driven bullet points)

      ### 8. 🚀 Project Enhancement Suggestions:
      (Suggest how to improve at least 1 project to stand out. Add metrics, tech depth, or real-world impact)

      ### 9. 🧠 Personalized Action Plan:
      (Give 5 clear next steps to improve this resume within 7 days)

      ### 10. 🏁 Final Verdict:
      (Is this resume ready for top companies? YES/NO. Explain in 2–3 lines)

      RULES:
      - Be strict, honest, and recruiter-level critical
      - Avoid generic advice like "improve formatting"
      - Focus on placement success and shortlisting
      - Keep language simple, direct, and professional
      - Make the response structured and easy to scan
      - Prioritize impact, clarity, and real-world relevance
    `;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          systemInstruction: "You are an Elite Technical Recruiter for FAANG. Do not output anything outside of the 10 strictly requested output sections."
        }
      });
      setAnalysis(response.text || "Analysis failed. Please try again.");
    } catch (error) {
      console.error(error);
      setAnalysis("Error communicating with AI. Please check API Key configuration.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="mb-12">
        <h1 className="text-4xl font-black text-white mb-4 tracking-tight">Elite Resume Intelligence</h1>
        <p className="text-blue-200/60 max-w-2xl text-lg">
          Get brutally honest, recruiter-level critical feedback on your resume to maximize FAANG shortlisting chances.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        <div className="lg:col-span-5 space-y-6">
          
          <Card className="p-6 bg-white/5 border-white/10 backdrop-blur-md">
            <h2 className="text-white font-bold mb-4 flex items-center gap-2">
              <Target size={18} className="text-purple-400" /> Target Parameters
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-white/50 uppercase tracking-wider mb-2 block">Target Role (Required)</label>
                <Input 
                  placeholder="e.g. Frontend Developer, Data Analyst..." 
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-white/50 uppercase tracking-wider mb-2 block">Target Company (Optional)</label>
                <div className="relative">
                  <Building2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                  <Input 
                    placeholder="e.g. Google, Amazon, Microsoft..." 
                    value={targetCompany}
                    onChange={(e) => setTargetCompany(e.target.value)}
                    className="bg-white/5 border-white/10 text-white pl-10"
                  />
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white/5 border-white/10 backdrop-blur-md">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center">
                <FileText size={20} />
              </div>
              <h2 className="text-white font-bold">Resume Content</h2>
            </div>
            <textarea
              placeholder="Paste your raw resume text here (copy from PDF or Word)..."
              className="w-full h-80 bg-white/5 border border-white/10 rounded-2xl p-4 text-white/90 text-sm focus:border-blue-500 outline-none transition-all resize-none placeholder:text-white/20"
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
            />
          </Card>

          <Button 
            onClick={handleAnalyze}
            disabled={!resumeText || !targetRole || loading}
            className="w-full h-14 bg-blue-600 hover:bg-blue-500 text-white font-black text-lg rounded-2xl shadow-xl shadow-blue-600/20"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Zap size={20} className="animate-pulse" />
                Analyzing with Elite AI...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Sparkles size={20} />
                Generate Brutal Report
              </span>
            )}
          </Button>
        </div>

        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {analysis ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="h-full"
              >
                <Card className="p-8 bg-white/5 border-white/10 backdrop-blur-md h-full overflow-y-auto max-h-[calc(100vh-150px)] rounded-3xl">
                  <div className="sticky top-0 bg-slate-900/90 backdrop-blur-xl pb-4 mb-6 border-b border-white/10 flex items-center justify-between z-10">
                    <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
                      <Sparkles className="text-blue-400" size={24} />
                      Intelligence Report
                    </h2>
                    <Button 
                      variant="ghost" 
                      onClick={() => setAnalysis(null)}
                      className="text-white/40 hover:text-white"
                    >
                      Reset
                    </Button>
                  </div>
                  <div className="markdown-body prose prose-invert prose-blue max-w-none">
                    <Markdown>{analysis}</Markdown>
                  </div>
                </Card>
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-white/10 rounded-[2.5rem] bg-white/5 backdrop-blur-sm min-h-[600px]">
                <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center text-white/20 mb-6 border border-white/10">
                  <Search size={48} />
                </div>
                <h3 className="text-2xl font-black text-white/60 mb-2 tracking-tight">Ready for Feedback?</h3>
                <p className="text-white/40 text-sm max-w-xs leading-relaxed">
                  Enter your target role and paste your resume text to get an elite recruiter-level structural teardown.
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
