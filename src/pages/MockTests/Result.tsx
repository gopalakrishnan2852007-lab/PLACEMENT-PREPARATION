import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button } from '@/src/components/ui/Base';
import { Trophy, Clock, Target, ArrowLeft, Share2, CheckCircle2, XCircle, ChevronDown } from 'lucide-react';
import { motion } from 'motion/react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { cn } from '@/src/lib/utils';

const TOPIC_DATA = [
  { subject: 'Algorithms', A: 80, fullMark: 100 },
  { subject: 'Data Structures', A: 90, fullMark: 100 },
  { subject: 'System Design', A: 60, fullMark: 100 },
  { subject: 'DBMS', A: 40, fullMark: 100 },
  { subject: 'OS Concepts', A: 70, fullMark: 100 },
  { subject: 'Aptitude', A: 85, fullMark: 100 },
];

const SECTION_DATA = [
  { name: 'Correct', value: 12, color: '#10B981' }, // Green
  { name: 'Incorrect', value: 3, color: '#EF4444' }, // Red
  { name: 'Unattempted', value: 5, color: '#3F3F46' }, // Zinc 700
];

export default function Result() {
  const { testId, attemptId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 space-y-8">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="secondary" size="icon" onClick={() => navigate('/mock-tests')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h2 className="text-3xl font-black text-white tracking-tight">Test Results</h2>
            <p className="text-zinc-400 mt-1">TCS NQT Full Length Mock • Attempt ID: {attemptId}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" className="gap-2">
            <Share2 className="h-4 w-4" /> Share Score
          </Button>
          <Button onClick={() => navigate(`/mock-tests/${testId}/attempt`)} className="gap-2">
            Reattempt Test
          </Button>
        </div>
      </header>

      {/* Top Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="p-8 bg-gradient-to-br from-blue-600 to-indigo-600 border-none relative overflow-hidden h-full">
            <div className="absolute right-[-20%] top-[-20%] w-32 h-32 bg-white/10 rounded-full blur-2xl" />
            <Trophy className="text-white/50 mb-4 h-8 w-8" />
            <p className="text-blue-100/60 text-xs font-black uppercase tracking-widest mb-1">Total Score</p>
            <h3 className="text-5xl font-black text-white">45<span className="text-2xl text-blue-200">/60</span></h3>
            <div className="mt-4 inline-block bg-white/20 px-3 py-1 text-xs font-bold text-white rounded-lg">
              Top 12% Percentile
            </div>
          </Card>
        </motion.div>

        {[
          { label: 'Accuracy', value: '80%', icon: Target, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { label: 'Time Taken', value: '12:45', sub: '/ 15:00', icon: Clock, color: 'text-orange-400', bg: 'bg-orange-500/10' },
          { label: 'Attempted', value: '15', sub: '/ 20', icon: CheckCircle2, color: 'text-purple-400', bg: 'bg-purple-500/10' },
        ].map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + (i * 0.1) }}>
            <Card className="p-6 bg-zinc-900/50 border-white/5 h-full flex flex-col justify-between">
              <div className={`w-10 h-10 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center mb-4`}>
                <stat.icon size={20} />
              </div>
              <div>
                <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-1">{stat.label}</p>
                <h3 className="text-3xl font-black text-white">
                  {stat.value}
                  {stat.sub && <span className="text-lg text-zinc-500 ml-1 font-medium">{stat.sub}</span>}
                </h3>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Visual Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-8 bg-zinc-900/50 border-white/5 text-center flex flex-col items-center">
          <h3 className="text-lg font-bold text-white mb-2 w-full text-left">Section Breakdown</h3>
          <div className="h-[250px] w-[250px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={SECTION_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {SECTION_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-black text-white">80%</span>
              <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Accuracy</span>
            </div>
          </div>
          <div className="flex items-center justify-center gap-6 mt-4 w-full">
            {SECTION_DATA.map(s => (
              <div key={s.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: s.color }} />
                <span className="text-xs font-bold text-zinc-400">{s.name} ({s.value})</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-8 bg-zinc-900/50 border-white/5 flex flex-col items-center">
          <h3 className="text-lg font-bold text-white mb-2 w-full text-left">Topic Performance Radar</h3>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={TOPIC_DATA}>
                <PolarGrid stroke="#27272A" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#71717A', fontSize: 10, fontWeight: 700 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar
                  name="Score"
                  dataKey="A"
                  stroke="#4F63D2"
                  fill="#4F63D2"
                  fillOpacity={0.4}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Question Analysis Table */}
      <h3 className="text-2xl font-black text-white mt-12 mb-6 tracking-tight">Question Analysis</h3>
      <Card className="bg-zinc-900/50 border-white/5 overflow-hidden">
        <div className="grid grid-cols-[1fr_2fr_1fr_100px] gap-4 p-4 text-[10px] font-black uppercase tracking-widest text-zinc-500 border-b border-white/5 bg-zinc-950">
          <div>Status</div>
          <div>Question</div>
          <div>Time Taken</div>
          <div className="text-right">Action</div>
        </div>
        {[1, 2, 3, 4, 5].map((item, i) => {
          const isCorrect = i % 3 !== 0;
          const isUnattempted = i === 2;
          
          return (
            <div key={i} className="grid grid-cols-[1fr_2fr_1fr_100px] gap-4 p-6 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors items-center">
              <div>
                {isUnattempted ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-800 text-zinc-400 text-xs font-bold">
                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-500" /> Skipped
                  </span>
                ) : isCorrect ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-bold">
                    <CheckCircle2 size={14} /> Correct
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-500/10 text-red-400 text-xs font-bold">
                    <XCircle size={14} /> Incorrect
                  </span>
                )}
              </div>
              <div className="text-sm font-medium text-white line-clamp-2">
                What is the time complexity of QuickSort in the worst case?
              </div>
              <div className="text-xs font-bold text-zinc-500 font-mono">
                {isUnattempted ? '-' : '0:45s'}
              </div>
              <div className="text-right">
                <Button variant="ghost" className="h-8 text-xs font-bold text-blue-400 hover:text-blue-300">
                  Review <ChevronDown size={14} className="ml-1" />
                </Button>
              </div>
            </div>
          );
        })}
      </Card>
    </div>
  );
}
