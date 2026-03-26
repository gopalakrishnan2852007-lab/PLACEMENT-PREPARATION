import React from 'react';
import { Card, Button } from '@/src/components/ui/Base';
import { 
  Trophy, 
  MapPin, 
  Briefcase, 
  ExternalLink,
  MessageSquare,
  Sparkles,
  ArrowUpRight,
  Quote
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { useNavigate } from 'react-router-dom';

const PLACEMENTS_DATA = [
  {
    id: 1,
    name: "Arun Kumar",
    role: "Software Development Engineer",
    company: "Amazon",
    ctc: "44 LPA",
    location: "Bangalore",
    image: "https://ui-avatars.com/api/?name=Arun+Kumar&background=0D8ABC&color=fff",
    testimonial: "The AI mock tests helped me crack the online assessment. The interview prep guides gave exactly the questions they asked in Technical Round 2!",
    tags: ["DSA Mastery", "AI Mock Interviews"]
  },
  {
    id: 2,
    name: "Sneha Reddy",
    role: "Frontend Engineer",
    company: "Microsoft",
    ctc: "51 LPA",
    location: "Hyderabad",
    image: "https://ui-avatars.com/api/?name=Sneha+Reddy&background=E53E3E&color=fff",
    testimonial: "Using the JD Analyzer tailored my resume perfectly. I was able to pass the ATS parser with a 92% match score.",
    tags: ["Resume Analyzer", "React JS"]
  },
  {
    id: 3,
    name: "Vikram Sharma",
    role: "System Engineer",
    company: "TCS Digital",
    ctc: "7.5 LPA",
    location: "Pune",
    image: "https://ui-avatars.com/api/?name=Vikram+Sharma&background=38A169&color=fff",
    testimonial: "The Aptitude Test tracking engine was a game changer for my TCS NQT preparation. Consistent timing practice was the key.",
    tags: ["Aptitude Tests", "NQT Prep"]
  },
  {
    id: 4,
    name: "Priya Desai",
    role: "Data Analyst",
    company: "Goldman Sachs",
    ctc: "22 LPA",
    location: "Bengaluru",
    image: "https://ui-avatars.com/api/?name=Priya+Desai&background=D69E2E&color=fff",
    testimonial: "GOATED Tools for SQL flashcards helped me tremendously. The Kanban company board also kept me sane during the mass application phase.",
    tags: ["SQL", "Company Tracker"]
  }
];

export default function Placements() {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="flex items-center gap-3 text-3xl font-black text-white tracking-tight">
            Hall of Fame <Trophy className="text-yellow-500 h-8 w-8" />
          </h2>
          <p className="text-zinc-400 mt-2 max-w-xl">
            Meet the students who cracked their dream companies using the Placement Preparation Tracker. Read their stories and learn their strategies.
          </p>
        </div>
        <Button onClick={() => navigate('/companies')} className="shrink-0 gap-2 bg-gradient-to-r from-blue-600 to-emerald-500 hover:from-blue-500 hover:to-emerald-400 border-none">
          <Sparkles className="h-4 w-4" />
          Start Your Journey
        </Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        {PLACEMENTS_DATA.map((alum, i) => (
          <motion.div
            key={alum.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="h-full bg-zinc-900/40 border border-white/5 p-6 hover:border-blue-500/30 transition-all duration-300 group overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-500" />
              
              <div className="flex items-start gap-5">
                <img 
                  src={alum.image} 
                  alt={alum.name} 
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-white/10 group-hover:ring-blue-500/30 transition-all"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">{alum.name}</h3>
                  <p className="text-sm font-medium text-emerald-400 flex items-center gap-1.5 mb-2">
                    <Briefcase className="h-3.5 w-3.5" />
                    {alum.role}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400 font-medium">
                    <span className="flex items-center gap-1"><Trophy className="h-3.5 w-3.5 text-zinc-500" /> {alum.company}</span>
                    <span className="w-1 h-1 rounded-full bg-zinc-700" />
                    <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-zinc-500" /> {alum.location}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 font-black text-sm border border-emerald-500/20">
                    {alum.ctc}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-white/5 relative">
                <Quote className="absolute top-5 left-0 h-8 w-8 text-white/5" />
                <p className="text-sm text-zinc-300 leading-relaxed indent-6 relative z-10 font-medium italic">
                  "{alum.testimonial}"
                </p>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {alum.tags.map((tag, j) => (
                  <span key={j} className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-300 border border-blue-500/20 bg-blue-500/5 rounded-md">
                    {tag}
                  </span>
                ))}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
