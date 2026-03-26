import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/src/components/ui/Base';
import { Clock, ChevronLeft, ChevronRight, Bookmark, AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { motion } from 'motion/react';
import { useStore } from '@/src/store/useStore';

const DEFAULT_MOCK_QUESTIONS = [
  { id: 1, text: "What is the time complexity of QuickSort in the worst case?", options: ["O(n log n)", "O(n^2)", "O(n)", "O(1)"], type: "MCQ" },
  { id: 2, text: "Which data structure is best for implementing a priority queue?", options: ["Array", "Linked List", "Heap", "Stack"], type: "MCQ" },
  { id: 3, text: "In a relational database, what does ACID stand for?", options: ["Atomicity, Consistency, Isolation, Durability", "Atomicity, Concurrency, Isolation, Database", "Automatic, Consistent, Isolated, Durable", "Anything Consistent Is Durable"], type: "MCQ" },
  { id: 4, text: "What will be the output of `console.log(typeof null)` in JavaScript?", options: ["null", "undefined", "object", "string"], type: "MCQ" },
  { id: 5, text: "Which protocol is used for secure communication over a computer network?", options: ["HTTP", "TCP", "UDP", "HTTPS"], type: "MCQ" },
];

export default function Attempt() {
  const { testId } = useParams();
  const navigate = useNavigate();
  const { customTests } = useStore();
  
  const customTest = customTests.find(t => t.id === testId);
  const MOCK_QUESTIONS = customTest ? customTest.questions : DEFAULT_MOCK_QUESTIONS;
  
  const [currentIdx, setCurrentIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(customTest ? customTest.timeLimit * 60 : 15 * 60);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [reviewMarked, setReviewMarked] = useState<Set<number>>(new Set());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (opt: string) => {
    setAnswers(prev => ({ ...prev, [currentIdx]: opt }));
  };

  const toggleReview = () => {
    setReviewMarked(prev => {
      const newSet = new Set(prev);
      if (newSet.has(currentIdx)) newSet.delete(currentIdx);
      else newSet.add(currentIdx);
      return newSet;
    });
  };

  const clearResponse = () => {
    setAnswers(prev => {
      const newAnswers = { ...prev };
      delete newAnswers[currentIdx];
      return newAnswers;
    });
  };

  const handleSubmit = () => {
    // In a real app, calculate score and write to Firestore
    alert('Test Submitted! Navigating to results...');
    navigate(`/mock-tests/${testId}/result/attempt-123`);
  };

  const question = MOCK_QUESTIONS[currentIdx];
  const isLast = currentIdx === MOCK_QUESTIONS.length - 1;
  const isFirst = currentIdx === 0;

  return (
    <div className="fixed inset-0 z-50 bg-zinc-950 flex flex-col">
      {/* Top Bar */}
      <header className="h-16 border-b border-white/5 bg-zinc-900/50 px-6 flex items-center justify-between">
        <div>
          <h2 className="text-white font-bold tracking-tight">{customTest ? customTest.title : "TCS NQT Full Length Mock"}</h2>
          <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest mt-0.5">Attempting ID: {testId}</p>
        </div>

        <div className={cn(
          "flex items-center gap-3 px-4 py-2 rounded-xl border bg-zinc-950 font-mono text-lg font-black tracking-widest",
          timeLeft < 300 ? "border-red-500/50 text-red-400" : "border-white/10 text-white"
        )}>
          <Clock size={18} className={timeLeft < 300 ? "animate-pulse" : ""} />
          {formatTime(timeLeft)}
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel: Question Display */}
        <div className="flex-1 flex flex-col border-r border-white/5">
          <div className="flex-1 overflow-y-auto p-8 relative">
            <div className="max-w-3xl mx-auto">
              <div className="flex justify-between items-center mb-8">
                <span className="text-sm font-bold text-blue-400 bg-blue-500/10 px-3 py-1 rounded-lg">Question {currentIdx + 1} of {MOCK_QUESTIONS.length}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Marks: +4, -1</span>
                </div>
              </div>

              <h3 className="text-xl font-medium text-white mb-8 leading-relaxed">
                {question.text}
              </h3>

              <div className="space-y-4">
                {question.options.map((opt, i) => {
                  const isSelected = answers[currentIdx] === opt;
                  return (
                    <button
                      key={i}
                      onClick={() => handleSelectOption(opt)}
                      className={cn(
                        "w-full flex items-center gap-4 p-5 rounded-2xl border text-left transition-all",
                        isSelected 
                          ? "bg-blue-600/10 border-blue-500 text-blue-100" 
                          : "bg-white/5 border-white/5 text-zinc-300 hover:border-white/20 hover:bg-white/10"
                      )}
                    >
                      <div className={cn(
                        "w-6 h-6 rounded-full border flex items-center justify-center shrink-0",
                        isSelected ? "border-blue-500 bg-blue-500" : "border-zinc-500"
                      )}>
                        {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                      <span className="text-sm font-medium">{opt}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Bottom Action Bar */}
          <div className="h-20 border-t border-white/5 bg-zinc-900/50 px-8 flex items-center justify-between">
            <div className="flex gap-4">
              <Button 
                variant="secondary" 
                onClick={toggleReview}
                className={cn("gap-2 border-white/10", reviewMarked.has(currentIdx) && "bg-orange-500/10 text-orange-400 border-orange-500/20")}
              >
                <Bookmark className={cn("h-4 w-4", reviewMarked.has(currentIdx) && "fill-current")} />
                {reviewMarked.has(currentIdx) ? 'Marked for Review' : 'Mark for Review'}
              </Button>
              <Button variant="ghost" className="text-zinc-400 hover:text-white" onClick={clearResponse}>
                Clear Response
              </Button>
            </div>
            <div className="flex gap-4">
              <Button variant="secondary" onClick={() => setCurrentIdx(prev => prev - 1)} disabled={isFirst} className="gap-2 border-white/10">
                <ChevronLeft className="h-4 w-4" /> Previous
              </Button>
              <Button 
                onClick={() => isLast ? handleSubmit() : setCurrentIdx(prev => prev + 1)} 
                className={cn("gap-2", isLast && "bg-emerald-600 hover:bg-emerald-500 text-white")}
              >
                {isLast ? 'Submit Test' : 'Save & Next'} {!isLast && <ChevronRight className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Right Panel: Question Palette */}
        <div className="w-80 bg-zinc-900/30 flex flex-col p-6 overflow-y-auto">
          <div className="mb-6">
            <h3 className="text-sm font-bold text-white mb-4 tracking-tight">Question Palette</h3>
            <div className="grid grid-cols-2 gap-3 mb-8">
              <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                <div className="w-3 h-3 rounded bg-blue-500" /> Answered ({Object.keys(answers).length})
              </div>
              <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                <div className="w-3 h-3 rounded border border-white/10 bg-zinc-800" /> Unanswered ({MOCK_QUESTIONS.length - Object.keys(answers).length})
              </div>
              <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                <div className="w-3 h-3 rounded bg-orange-500" /> Marked ({reviewMarked.size})
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-3">
            {MOCK_QUESTIONS.map((_, i) => {
              const isAnswered = i in answers;
              const isMarked = reviewMarked.has(i);
              const isCurrent = currentIdx === i;

              return (
                <button
                  key={i}
                  onClick={() => setCurrentIdx(i)}
                  className={cn(
                    "h-12 w-full flex items-center justify-center rounded-xl text-sm font-black transition-all",
                    isCurrent ? "ring-2 ring-white ring-offset-2 ring-offset-zinc-950 scale-105 shadow-xl" : "hover:scale-105",
                    isMarked 
                      ? "bg-orange-500 text-white shadow-orange-500/20 shadow-lg" 
                      : isAnswered 
                        ? "bg-blue-600 text-white shadow-blue-600/20 shadow-lg" 
                        : "bg-zinc-800 border border-white/5 text-zinc-400"
                  )}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>

          <div className="mt-auto pt-8">
            <Button onClick={handleSubmit} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white h-12 text-lg">
              Submit Final Test
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
