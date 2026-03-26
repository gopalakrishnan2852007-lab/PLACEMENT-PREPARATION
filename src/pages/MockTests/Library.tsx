import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Input } from '@/src/components/ui/Base';
import { 
  Search, 
  Filter, 
  Plus, 
  Clock, 
  Trophy, 
  Users, 
  Play,
  BrainCircuit,
  Code2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { useStore } from '@/src/store/useStore';
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: (import.meta as any).env.VITE_GEMINI_API_KEY || '' });

const MOCK_DATA = [
  {
    id: 'test-1',
    title: 'TCS NQT Full Length Mock',
    category: 'Full Placement',
    difficulty: 'Medium',
    questionCount: 60,
    timeLimit: 90,
    attemptCount: 1240,
    avgScore: 68,
    icon: Users
  },
  {
    id: 'test-2',
    title: 'Advanced Graph Algorithms',
    category: 'DSA',
    difficulty: 'Hard',
    questionCount: 15,
    timeLimit: 45,
    attemptCount: 840,
    avgScore: 42,
    icon: Code2
  },
  {
    id: 'test-3',
    title: 'Quantitative Aptitude Basics',
    category: 'Quant',
    difficulty: 'Easy',
    questionCount: 30,
    timeLimit: 30,
    attemptCount: 3100,
    avgScore: 82,
    icon: BrainCircuit
  }
];

export default function Library() {
  const navigate = useNavigate();
  const { addCustomTest, customTests } = useStore();
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [genCategory, setGenCategory] = useState('DSA');
  const [genQuestions, setGenQuestions] = useState('10');
  const [genTimeLimit, setGenTimeLimit] = useState('15');

  const categories = ['All', 'DSA', 'Aptitude', 'Full Placement', 'Quant', 'Reasoning'];

  const handleGenerateTest = async () => {
    setGenerating(true);
    const prompt = `
      Create a multiple-choice mock test for a placement interview.
      Topic: ${genCategory}
      Number of questions: ${genQuestions}
      Difficulty: Medium to Hard.
      
      Output ONLY a valid minified JSON array of objects. Do not include markdown code blocks, backticks, or any other text.
      Each object must exactly match this interface:
      {
        "id": number, // start from 1
        "text": string, // The question text
        "options": [string, string, string, string], // Exactly 4 options
        "type": "MCQ",
        "answer": string // The exact string of the correct option
      }
    `;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });
      
      let rawText = response.text || "[]";
      // cleanup markdown if the model hallucinates backticks
      rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
      const questions = JSON.parse(rawText);

      const testId = `custom-test-${Date.now()}`;
      addCustomTest({
        id: testId,
        title: `AI Generated: ${genCategory} Mock`,
        category: genCategory,
        timeLimit: parseInt(genTimeLimit),
        questions: questions
      });

      setIsModalOpen(false);
      navigate(`/mock-tests/${testId}/attempt`);
    } catch (err) {
      console.error(err);
      alert('Failed to generate test. Please check API key or prompt.');
    } finally {
      setGenerating(false);
    }
  };

  const combinedTests = [
    ...customTests.map(t => ({
      id: t.id,
      title: t.title,
      category: t.category,
      difficulty: 'Medium',
      questionCount: t.questions.length,
      timeLimit: t.timeLimit,
      attemptCount: 0,
      avgScore: 0,
      icon: Search // fallback icon
    })),
    ...MOCK_DATA
  ];

  const filteredTests = combinedTests.filter(t => 
    (activeTab === 'All' || t.category === activeTab) &&
    t.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Mock Test Library</h2>
          <p className="text-zinc-400 mt-1">Practice with company-specific mocks and custom tests.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Create Custom Test
        </Button>
      </header>

      {/* Filters */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-zinc-900/50 p-4 rounded-2xl border border-white/5">
        <div className="flex items-center gap-1 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto hide-scrollbar">
          {categories.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-xl transition-all whitespace-nowrap",
                activeTab === tab 
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" 
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <Input 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tests..." 
              className="pl-9 bg-zinc-950 border-white/5 h-11"
            />
          </div>
          <Button variant="secondary" className="h-11 px-4 gap-2 border-white/5">
            <Filter className="h-4 w-4" />
            <span className="hidden sm:inline">Filters</span>
          </Button>
        </div>
      </div>

      {/* Test Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredTests.map((test, i) => (
            <motion.div
              key={test.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="p-6 h-full flex flex-col hover:border-blue-500/30 transition-colors group bg-zinc-900/50 border-white/5">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 text-blue-400 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
                    <test.icon size={24} />
                  </div>
                  <span className={cn(
                    "px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg border",
                    test.difficulty === 'Hard' ? "bg-red-500/10 text-red-400 border-red-500/20" :
                    test.difficulty === 'Medium' ? "bg-orange-500/10 text-orange-400 border-orange-500/20" :
                    "bg-green-500/10 text-green-400 border-green-500/20"
                  )}>
                    {test.difficulty}
                  </span>
                </div>
                
                <div className="mb-6 flex-1">
                  <h3 className="text-xl font-bold text-white mb-2 leading-tight group-hover:text-blue-400 transition-colors">{test.title}</h3>
                  <div className="flex flex-wrap items-center gap-3 text-[12px] font-medium text-zinc-500">
                    <span className="flex items-center gap-1"><Clock size={14} /> {test.timeLimit} mins</span>
                    <span className="w-1 h-1 rounded-full bg-zinc-700" />
                    <span>{test.questionCount} Questions</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-zinc-950/50 border border-white/5 mb-6">
                  <div>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-1">Avg Score</p>
                    <p className="text-lg font-black text-white">{test.avgScore}%</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-1">Attempts</p>
                    <p className="text-lg font-black text-white">{test.attemptCount.toLocaleString()}</p>
                  </div>
                </div>

                <Button 
                  onClick={() => navigate(`/mock-tests/${test.id}/attempt`)}
                  className="w-full gap-2 group-hover:bg-blue-500 transition-colors"
                >
                  <Play className="h-4 w-4 fill-current" />
                  Start Test
                </Button>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredTests.length === 0 && (
        <div className="text-center py-20">
          <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center text-white/20 mx-auto mb-4">
            <Search size={32} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No tests found</h3>
          <p className="text-zinc-500 text-sm">Try adjusting your filters or search query.</p>
        </div>
      )}

      {/* Custom Test Modal Wrapper */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg bg-zinc-900 border border-white/10 rounded-3xl p-8 shadow-2xl relative"
          >
            <h3 className="text-2xl font-black text-white mb-6 tracking-tight">Generate Custom Test</h3>
            <p className="text-zinc-400 text-sm mb-8">
              Our AI will instantly generate a unique mock test tailored to your requested parameters.
            </p>
            
            <div className="space-y-6 mb-8">
              <div>
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 block">Category</label>
                <select 
                  value={genCategory}
                  onChange={(e) => setGenCategory(e.target.value)}
                  className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500"
                >
                  {categories.slice(1).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 block">Questions</label>
                  <select 
                    value={genQuestions}
                    onChange={(e) => setGenQuestions(e.target.value)}
                    className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="10">10 Questions</option>
                    <option value="20">20 Questions</option>
                    <option value="30">30 Questions</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 block">Time Limit</label>
                  <select 
                    value={genTimeLimit}
                    onChange={(e) => setGenTimeLimit(e.target.value)}
                    className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="15">15 Minutes</option>
                    <option value="30">30 Minutes</option>
                    <option value="60">60 Minutes</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-white/5">
              <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button onClick={handleGenerateTest} disabled={generating} className="gap-2">
                <BrainCircuit size={18} className={generating ? "animate-spin" : ""} />
                {generating ? 'Generating...' : 'Generate with AI'}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
