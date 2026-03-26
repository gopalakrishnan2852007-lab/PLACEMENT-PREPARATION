import React, { useState, useEffect } from 'react';
import { Card, Button } from '@/src/components/ui/Base';
import { motion, AnimatePresence } from 'motion/react';
import { Timer, ArrowRight, CheckCircle2, XCircle } from 'lucide-react';

type Question = {
  id: string;
  topic: string;
  problem: string;
  options: string[];
  correctAnswer: number;
};

const SAMPLE_QUESTIONS: Question[] = [
  { id: '1', topic: 'Quantitative Aptitude', problem: 'If 20% of a number is 50, what is the number?', options: ['200', '250', '300', '100'], correctAnswer: 1 },
  { id: '2', topic: 'Logical Reasoning', problem: 'Which number completes the series: 2, 6, 12, 20, 30, ?', options: ['40', '42', '44', '46'], correctAnswer: 1 },
  { id: '3', topic: 'Verbal Ability', problem: 'Select the synonym for "ELUCIDATE".', options: ['Confuse', 'Clarify', 'Complicate', 'Hide'], correctAnswer: 1 },
  { id: '4', topic: 'Quantitative Aptitude', problem: 'A train 120m long passes a standing man in 12 seconds. Speed in km/hr?', options: ['36', '72', '10', '12'], correctAnswer: 0 },
  { id: '5', topic: 'Logical Reasoning', problem: 'If A is brother of B, B is sister of C, C is father of D. How is D related to A?', options: ['Nephew', 'Niece', 'Nephew or Niece', 'None'], correctAnswer: 2 }
];

interface AptitudeTestProps {
  onComplete: (sessionData: { topic: string; source: string; score: number; totalQuestions: number; timeTaken: number }) => void;
  onClose: () => void;
}

export function AptitudeTest({ onComplete, onClose }: AptitudeTestProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isFinished, setIsFinished] = useState(false);
  const [timePassed, setTimePassed] = useState(0);

  useEffect(() => {
    if (isFinished) return;
    const interval = setInterval(() => setTimePassed(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, [isFinished]);

  const currentQuestion = SAMPLE_QUESTIONS[currentIndex];

  const handleSelectOption = (optIndex: number) => {
    setSelectedAnswers(prev => ({ ...prev, [currentIndex]: optIndex }));
  };

  const handleNext = () => {
    if (currentIndex < SAMPLE_QUESTIONS.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handleFinish = () => {
    let score = 0;
    SAMPLE_QUESTIONS.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswer) score++;
    });

    onComplete({
      topic: 'Mixed Aptitude Test',
      source: 'Internal Engine',
      score,
      totalQuestions: SAMPLE_QUESTIONS.length,
      timeTaken: Math.max(1, Math.round(timePassed / 60)) // minutes
    });
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  if (isFinished) {
    let score = 0;
    SAMPLE_QUESTIONS.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswer) score++;
    });
    const percentage = Math.round((score / SAMPLE_QUESTIONS.length) * 100);

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-md">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-lg bg-white rounded-3xl p-8 shadow-2xl text-center border border-zinc-100">
          <h2 className="text-3xl font-black text-text-primary mb-4">Test Complete!</h2>
          <div className="text-6xl font-black text-primary-accent mb-6">{percentage}%</div>
          <p className="text-text-secondary mb-8">You scored {score} out of {SAMPLE_QUESTIONS.length} in {formatTime(timePassed)}.</p>
          <Button onClick={handleFinish} className="w-full h-12 text-lg">Save Results to Tracker</Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-md overflow-y-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="bg-zinc-50 border-b border-zinc-100 p-6 flex justify-between items-center sticky top-0 z-10">
          <div>
            <h3 className="text-xl font-bold text-text-primary">Aptitude Test</h3>
            <p className="text-sm font-semibold text-primary-accent">{currentQuestion.topic}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 font-mono font-bold text-lg text-text-primary bg-white px-4 py-2 rounded-xl border border-zinc-200">
              <Timer className="w-5 h-5 text-primary-accent" />
              {formatTime(timePassed)}
            </div>
            <button onClick={onClose} className="text-text-secondary hover:text-red-500 transition-colors">
              <XCircle className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-8 flex-1 overflow-y-auto">
          <div className="mb-8">
            <div className="text-sm font-bold text-text-secondary uppercase tracking-widest mb-4">Question {currentIndex + 1} of {SAMPLE_QUESTIONS.length}</div>
            <h2 className="text-2xl font-bold text-text-primary leading-tight">{currentQuestion.problem}</h2>
          </div>

          <div className="space-y-4">
            {currentQuestion.options.map((opt, optIndex) => {
              const isSelected = selectedAnswers[currentIndex] === optIndex;
              return (
                <button
                  key={optIndex}
                  onClick={() => handleSelectOption(optIndex)}
                  className={`w-full text-left p-5 rounded-2xl border-2 transition-all ${
                    isSelected 
                      ? 'border-primary-accent bg-blue-50/50 shadow-md transform scale-[1.01]' 
                      : 'border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      isSelected ? 'bg-primary-accent text-white' : 'bg-zinc-100 text-zinc-500'
                    }`}>
                      {String.fromCharCode(65 + optIndex)}
                    </div>
                    <span className={`text-lg font-medium ${isSelected ? 'text-primary-accent' : 'text-text-primary'}`}>
                      {opt}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="bg-zinc-50 border-t border-zinc-100 p-6 flex justify-between items-center sticky bottom-0 z-10">
          <Button 
            variant="outline" 
            onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
            disabled={currentIndex === 0}
          >
            Previous
          </Button>
          <Button onClick={handleNext} disabled={selectedAnswers[currentIndex] === undefined} className="px-8 h-12">
            {currentIndex === SAMPLE_QUESTIONS.length - 1 ? 'Finish Section' : 'Next Question'}
            {currentIndex !== SAMPLE_QUESTIONS.length - 1 && <ArrowRight className="w-5 h-5 ml-2" />}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
