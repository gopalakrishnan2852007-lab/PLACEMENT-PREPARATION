import React, { useState } from 'react';
import { Card, Button } from '@/src/components/ui/Base';
import { 
  BookOpen, 
  ChevronLeft, 
  ChevronRight, 
  RotateCcw, 
  CheckCircle2, 
  XCircle,
  Brain,
  Database,
  Network,
  Cpu
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';

interface Flashcard {
  id: number;
  category: string;
  question: string;
  answer: string;
}

const flashcards: Flashcard[] = [
  { id: 1, category: 'OS', question: 'What is a Deadlock?', answer: 'A situation where a set of processes are blocked because each process is holding a resource and waiting for another resource held by some other process.' },
  { id: 2, category: 'DBMS', question: 'What is ACID property?', answer: 'Atomicity, Consistency, Isolation, and Durability - a set of properties that guarantee database transactions are processed reliably.' },
  { id: 3, category: 'Networking', question: 'What is the OSI Model?', answer: 'A conceptual framework used to describe the functions of a networking system. It has 7 layers: Physical, Data Link, Network, Transport, Session, Presentation, and Application.' },
  { id: 4, category: 'OOPS', question: 'What is Polymorphism?', answer: 'The ability of a message to be displayed in more than one form. In programming, it allows one interface to be used for a general class of actions.' },
  { id: 5, category: 'OS', question: 'What is Virtual Memory?', answer: 'A memory management technique that provides an "idealized abstraction of the storage resources that are actually available on a given machine" which "creates the illusion to users of a very large (main) memory".' },
  { id: 6, category: 'DBMS', question: 'What is Normalization?', answer: 'The process of organizing data in a database to reduce redundancy and improve data integrity.' },
  { id: 7, category: 'Networking', question: 'What is TCP/IP?', answer: 'Transmission Control Protocol/Internet Protocol - a suite of communication protocols used to interconnect network devices on the internet.' },
  { id: 8, category: 'OOPS', question: 'What is Encapsulation?', answer: 'The bundling of data with the methods that operate on that data, or the restricting of direct access to some of an object\'s components.' },
];

const categories = [
  { name: 'All', icon: Brain },
  { name: 'OS', icon: Cpu },
  { name: 'DBMS', icon: Database },
  { name: 'Networking', icon: Network },
  { name: 'OOPS', icon: BookOpen },
];

export default function Flashcards() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [score, setScore] = useState({ correct: 0, incorrect: 0 });

  const filteredCards = selectedCategory === 'All' 
    ? flashcards 
    : flashcards.filter(c => c.category === selectedCategory);

  const currentCard = filteredCards[currentIdx];

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIdx((prev) => (prev + 1) % filteredCards.length);
    }, 150);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIdx((prev) => (prev - 1 + filteredCards.length) % filteredCards.length);
    }, 150);
  };

  const handleScore = (type: 'correct' | 'incorrect') => {
    setScore(prev => ({ ...prev, [type]: prev[type] + 1 }));
    handleNext();
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
        <div>
          <h1 className="text-3xl font-black text-white mb-2 tracking-tight">CS Fundamentals Flashcards</h1>
          <p className="text-blue-200/60 text-sm">Quick revision for core subjects. Master OS, DBMS, CN, and OOPS.</p>
        </div>
        <div className="flex items-center gap-4 bg-white/5 p-2 rounded-2xl border border-white/10 backdrop-blur-md">
          <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-400 rounded-xl border border-green-500/20">
            <CheckCircle2 size={16} />
            <span className="text-sm font-bold">{score.correct}</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 rounded-xl border border-red-500/20">
            <XCircle size={16} />
            <span className="text-sm font-bold">{score.incorrect}</span>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setScore({ correct: 0, incorrect: 0 })}
            className="text-white/40 hover:text-white"
          >
            <RotateCcw size={16} />
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-12">
        {categories.map((cat) => (
          <button
            key={cat.name}
            onClick={() => {
              setSelectedCategory(cat.name);
              setCurrentIdx(0);
              setIsFlipped(false);
            }}
            className={cn(
              "flex items-center gap-2 px-6 py-3 rounded-2xl border transition-all text-sm font-bold backdrop-blur-sm",
              selectedCategory === cat.name 
                ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/20" 
                : "bg-white/5 border-white/10 text-white/40 hover:border-white/20 hover:text-white/60"
            )}
          >
            <cat.icon size={16} />
            {cat.name}
          </button>
        ))}
      </div>

      <div className="relative h-[400px] w-full perspective-1000 mb-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentCard?.id}
            initial={{ opacity: 0, x: 20, rotateY: 0 }}
            animate={{ opacity: 1, x: 0, rotateY: isFlipped ? 180 : 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4, type: 'spring', stiffness: 260, damping: 20 }}
            onClick={() => setIsFlipped(!isFlipped)}
            className="relative w-full h-full cursor-pointer preserve-3d"
          >
            {/* Front */}
            <div className={cn(
              "absolute inset-0 w-full h-full backface-hidden rounded-[2.5rem] p-12 flex flex-col items-center justify-center text-center border transition-colors",
              "bg-white/5 border-white/10 shadow-2xl backdrop-blur-xl",
              isFlipped ? "opacity-0" : "opacity-100"
            )}>
              <span className="text-xs font-black uppercase tracking-[0.2em] text-blue-400 mb-8 bg-blue-400/10 px-4 py-1.5 rounded-full">
                {currentCard?.category}
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-white leading-tight tracking-tight">
                {currentCard?.question}
              </h2>
              <p className="mt-12 text-white/20 text-sm font-medium uppercase tracking-widest animate-pulse">
                Click to reveal answer
              </p>
            </div>

            {/* Back */}
            <div className={cn(
              "absolute inset-0 w-full h-full backface-hidden rounded-[2.5rem] p-12 flex flex-col items-center justify-center text-center border transition-colors rotate-y-180",
              "bg-blue-600 border-blue-500 shadow-2xl shadow-blue-600/20",
              !isFlipped ? "opacity-0" : "opacity-100"
            )}>
              <h2 className="text-xl md:text-2xl font-bold text-white leading-relaxed">
                {currentCard?.answer}
              </h2>
              <div className="mt-12 flex gap-4">
                <Button 
                  onClick={(e) => { e.stopPropagation(); handleScore('incorrect'); }}
                  className="bg-white/10 hover:bg-white/20 text-white border-white/20 rounded-2xl px-8 h-12 font-bold"
                >
                  Still Learning
                </Button>
                <Button 
                  onClick={(e) => { e.stopPropagation(); handleScore('correct'); }}
                  className="bg-white text-blue-600 hover:bg-white/90 rounded-2xl px-8 h-12 font-bold"
                >
                  Mastered It
                </Button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex gap-4">
          <Button 
            variant="outline" 
            onClick={handlePrev}
            className="w-14 h-14 rounded-2xl border-white/10 bg-white/5 text-white hover:bg-white/10 backdrop-blur-sm"
          >
            <ChevronLeft size={24} />
          </Button>
          <Button 
            variant="outline" 
            onClick={handleNext}
            className="w-14 h-14 rounded-2xl border-white/10 bg-white/5 text-white hover:bg-white/10 backdrop-blur-sm"
          >
            <ChevronRight size={24} />
          </Button>
        </div>
        <div className="text-right">
          <p className="text-white/20 text-xs font-black uppercase tracking-widest mb-1">Progress</p>
          <p className="text-white font-black text-xl">
            {currentIdx + 1} <span className="text-white/10">/</span> {filteredCards.length}
          </p>
        </div>
      </div>
    </div>
  );
}
