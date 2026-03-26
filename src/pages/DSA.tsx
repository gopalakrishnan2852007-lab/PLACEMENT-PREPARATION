import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Card, Button, Input } from '../components/ui/Base';
import { 
  Plus, 
  Search, 
  Filter, 
  ExternalLink, 
  MoreVertical, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Code2
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

const platforms = ['LeetCode', 'GFG', 'Codeforces', 'Other'];
const difficulties = ['Easy', 'Medium', 'Hard'];
const statuses = ['Not Started', 'In Progress', 'Solved', 'Needs Revision'];

export default function DSA() {
  const { problems, addProblem, updateProblem, deleteProblem } = useStore();
  const [isAdding, setIsAdding] = useState(false);
  const [search, setSearch] = useState('');
  const [filterTopic, setFilterTopic] = useState('All');

  const filteredProblems = problems.filter(p => 
    (p.title.toLowerCase().includes(search.toLowerCase()) || p.topic.toLowerCase().includes(search.toLowerCase())) &&
    (filterTopic === 'All' || p.topic === filterTopic)
  );

  const topics = ['All', ...new Set(problems.map(p => p.topic))];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    addProblem({
      title: formData.get('title') as string,
      platform: formData.get('platform') as any,
      difficulty: formData.get('difficulty') as any,
      topic: formData.get('topic') as string,
      status: formData.get('status') as any,
      notes: formData.get('notes') as string,
      solutionLink: formData.get('solutionLink') as string,
    });
    setIsAdding(false);
  };

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-text-primary tracking-tight">DSA Tracker</h2>
          <p className="text-text-secondary mt-1">Master coding patterns and track your progress.</p>
        </div>
        <Button onClick={() => setIsAdding(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Problem
        </Button>
      </header>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
          <Input 
            placeholder="Search problems or topics..." 
            className="pl-12"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          {topics.map(topic => (
            <button
              key={topic}
              onClick={() => setFilterTopic(topic)}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 border",
                filterTopic === topic 
                  ? "bg-blue-600/10 text-blue-500 border-blue-500/20" 
                  : "bg-white/5 text-zinc-500 hover:text-zinc-100 border-white/5"
              )}
            >
              {topic}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredProblems.length === 0 ? (
          <Card className="p-12 text-center border-dashed border-2 border-zinc-200 bg-zinc-50 flex flex-col items-center justify-center mt-4">
            <div className="w-16 h-16 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center mb-4">
              <Code2 size={32} />
            </div>
            <h3 className="text-xl font-bold text-text-primary mb-2">No problems tracked yet</h3>
            <p className="text-sm text-text-secondary max-w-sm mx-auto mb-6">Start tracking your LeetCode and GeeksForGeeks progress to unlock insights and stay consistent.</p>
            <Button onClick={() => setIsAdding(true)} className="gap-2">
              <Plus className="h-4 w-4" /> Add First Problem
            </Button>
          </Card>
        ) : (
          <AnimatePresence mode="popLayout">
          {filteredProblems.map((problem) => (
            <motion.div
              key={problem.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <Card className="p-5 flex items-center gap-5 group hover:border-blue-500/20 transition-all duration-300">
                <div className={cn(
                  "h-12 w-12 rounded-2xl flex items-center justify-center border transition-colors",
                  problem.status === 'Solved' ? "bg-success-green/10 border-success-green/20 text-success-green" :
                  problem.status === 'In Progress' ? "bg-primary-accent/10 border-primary-accent/20 text-primary-accent" :
                  problem.status === 'Needs Revision' ? "bg-warning-orange/10 border-warning-orange/20 text-warning-orange" :
                  "bg-zinc-100 border-zinc-200 text-text-secondary"
                )}>
                  {problem.status === 'Solved' ? <CheckCircle2 className="h-6 w-6" /> :
                   problem.status === 'In Progress' ? <Clock className="h-6 w-6" /> :
                   <AlertCircle className="h-6 w-6" />}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h4 className="text-base font-bold text-text-primary truncate">{problem.title}</h4>
                    <span className={cn(
                      "text-[10px] font-black px-2 py-0.5 rounded-lg uppercase tracking-widest border",
                      problem.difficulty === 'Easy' ? "bg-success-green/10 text-success-green border-success-green/10" :
                      problem.difficulty === 'Medium' ? "bg-warning-orange/10 text-warning-orange border-warning-orange/10" :
                      "bg-red-500/10 text-red-500 border-red-500/10"
                    )}>
                      {problem.difficulty}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-text-secondary font-medium">
                    <span className="flex items-center gap-1.5">
                      <Code2 className="h-3.5 w-3.5" />
                      {problem.platform}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Filter className="h-3.5 w-3.5" />
                      {problem.topic}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {problem.solutionLink && (
                    <a 
                      href={problem.solutionLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-2.5 text-zinc-600 hover:text-blue-500 hover:bg-blue-500/10 rounded-xl transition-all"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                  <select 
                    value={problem.status}
                    onChange={(e) => updateProblem(problem.id, { status: e.target.value as any })}
                    className="bg-zinc-50 border border-zinc-200 text-xs font-bold rounded-xl px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-accent/20 transition-all cursor-pointer"
                  >
                    {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-zinc-700 hover:text-red-500"
                    onClick={() => deleteProblem(problem.id)}
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
        )}
      </div>

      {isAdding && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full max-w-lg bg-white border border-zinc-100 rounded-[2.5rem] p-8 shadow-2xl"
          >
            <h3 className="text-2xl font-black text-text-primary mb-8 tracking-tight">Add New Problem</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest ml-1">Problem Title</label>
                <Input name="title" placeholder="e.g., Two Sum" required />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest ml-1">Platform</label>
                  <select name="platform" className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-4 py-3 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-accent/20 transition-all font-bold">
                    {platforms.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest ml-1">Difficulty</label>
                  <select name="difficulty" className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-4 py-3 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-accent/20 transition-all font-bold">
                    {difficulties.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest ml-1">Topic</label>
                  <Input name="topic" placeholder="e.g., Arrays" required />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest ml-1">Initial Status</label>
                  <select name="status" className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-4 py-3 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-accent/20 transition-all font-bold">
                    {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest ml-1">Solution Link (Optional)</label>
                <Input name="solutionLink" placeholder="https://leetcode.com/..." />
              </div>
              <div className="flex justify-end gap-4 mt-10">
                <Button type="button" variant="ghost" onClick={() => setIsAdding(false)}>Cancel</Button>
                <Button type="submit">Add Problem</Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
