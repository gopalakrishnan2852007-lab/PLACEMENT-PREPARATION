import React, { useState, useEffect } from 'react';
import { useStore, AptitudeSession } from '@/src/store/useStore';
import { Card, Button, Input } from '@/src/components/ui/Base';
import { 
  Plus, 
  BrainCircuit, 
  Timer as TimerIcon, 
  TrendingUp, 
  Target, 
  AlertCircle,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { format } from 'date-fns';

import { AptitudeTest } from './AptitudeTest';

export default function Aptitude() {
  const { aptitudeSessions, addAptitudeSession } = useStore();
  const [isAdding, setIsAdding] = useState(false);
  const [isTimerOpen, setIsTimerOpen] = useState(false);
  const [isTestOpen, setIsTestOpen] = useState(false);

  const chartData = [...aptitudeSessions]
    .sort((a, b) => a.date - b.date)
    .map(s => ({
      date: format(s.date, 'MMM dd'),
      accuracy: Math.round((s.score / s.totalQuestions) * 100),
      topic: s.topic
    }));

  const topics = [...new Set(aptitudeSessions.map(s => s.topic))];
  const weakAreas = topics.filter(topic => {
    const sessions = aptitudeSessions.filter(s => s.topic === topic);
    const avgAccuracy = sessions.reduce((acc, s) => acc + (s.score / s.totalQuestions), 0) / sessions.length;
    return avgAccuracy < 0.7;
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    addAptitudeSession({
      topic: formData.get('topic') as string,
      source: formData.get('source') as string,
      score: Number(formData.get('score')),
      totalQuestions: Number(formData.get('totalQuestions')),
      timeTaken: Number(formData.get('timeTaken')),
      date: Date.now(),
    });
    setIsAdding(false);
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-text-primary tracking-tight">Aptitude Tracker</h2>
          <p className="text-text-secondary mt-1">Sharpen your logical, quantitative, and verbal skills.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => setIsTestOpen(true)} className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white">
            <Play className="h-4 w-4" />
            Take Aptitude Test
          </Button>
          <Button variant="outline" onClick={() => setIsTimerOpen(true)} className="gap-2 hidden sm:flex">
            <TimerIcon className="h-4 w-4 text-primary-accent" />
            Mock Timer
          </Button>
          <Button onClick={() => setIsAdding(true)} variant="outline" className="gap-2 hidden sm:flex">
            <Plus className="h-4 w-4" />
            Log Custom
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="p-6">
            <h3 className="text-lg font-bold text-text-primary mb-6 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary-accent" />
              Accuracy Trend
            </h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorAccuracy" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F0F2FF" vertical={false} />
                  <XAxis 
                    dataKey="date" 
                    stroke="#7C83A0" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <YAxis 
                    stroke="#7C83A0" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #F0F2FF', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                    itemStyle={{ color: '#4F63D2' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="accuracy" 
                    stroke="#4F63D2" 
                    fillOpacity={1} 
                    fill="url(#colorAccuracy)" 
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-6">
              <h3 className="text-sm font-bold text-text-secondary mb-4 uppercase tracking-wider">Weak Areas</h3>
              <div className="space-y-3">
                {weakAreas.length > 0 ? weakAreas.map(topic => (
                  <div key={topic} className="flex items-center justify-between p-3 rounded-xl bg-red-500/5 border border-red-500/10">
                    <span className="text-sm font-medium text-text-primary">{topic}</span>
                    <span className="text-xs font-bold text-red-400 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      Needs Focus
                    </span>
                  </div>
                )) : (
                  <p className="text-sm text-text-secondary italic">No weak areas detected yet. Keep practicing!</p>
                )}
              </div>
            </Card>
            <Card className="p-6">
              <h3 className="text-sm font-bold text-text-secondary mb-4 uppercase tracking-wider">Top Topics</h3>
              <div className="space-y-3">
                {topics.slice(0, 3).map(topic => (
                  <div key={topic} className="flex items-center justify-between p-3 rounded-xl bg-success-green/5 border border-success-green/10">
                    <span className="text-sm font-medium text-text-primary">{topic}</span>
                    <span className="text-xs font-bold text-success-green flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      Mastered
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        <div className="space-y-8">
          <Card className="p-6">
            <h3 className="text-lg font-bold text-text-primary mb-6 flex items-center gap-2">
              <Target className="h-5 w-5 text-primary-accent" />
              Recent Sessions
            </h3>
            <div className="space-y-4">
              {aptitudeSessions.slice(0, 5).map(session => (
                <div key={session.id} className="p-4 rounded-xl bg-zinc-50 border border-zinc-100 hover:bg-zinc-100 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-bold text-text-primary">{session.topic}</h4>
                    <span className="text-xs font-bold text-primary-accent">
                      {Math.round((session.score / session.totalQuestions) * 100)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-text-secondary uppercase tracking-tighter">
                    <span>{session.source}</span>
                    <span>{session.timeTaken} mins</span>
                  </div>
                </div>
              ))}
              {aptitudeSessions.length === 0 && (
                <p className="text-sm text-text-secondary text-center py-8">No sessions logged yet.</p>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Add Session Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-md">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full max-w-lg bg-white border border-zinc-100 rounded-3xl p-8 shadow-2xl"
          >
            <h3 className="text-2xl font-bold text-text-primary mb-6 tracking-tight">Log Practice Session</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Topic</label>
                  <Input name="topic" placeholder="e.g., Quant - Percentages" required />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Source</label>
                  <Input name="source" placeholder="e.g., IndiaBix" required />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Score</label>
                  <Input name="score" type="number" placeholder="20" required />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Total Qs</label>
                  <Input name="totalQuestions" type="number" placeholder="25" required />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Time (mins)</label>
                  <Input name="timeTaken" type="number" placeholder="30" required />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="ghost" onClick={() => setIsAdding(false)}>Cancel</Button>
                <Button type="submit" className="px-8">Log Session</Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Mock Timer Modal */}
      {isTimerOpen && <MockTimer onClose={() => setIsTimerOpen(false)} />}

      {/* Interactive Aptitude Test Engine */}
      {isTestOpen && (
        <AptitudeTest 
          onClose={() => setIsTestOpen(false)} 
          onComplete={(session) => {
            addAptitudeSession({ ...session, date: Date.now() });
            setIsTestOpen(false);
          }} 
        />
      )}
    </div>
  );
}

function MockTimer({ onClose }: { onClose: () => void }) {
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 mins
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-md bg-white border border-zinc-100 rounded-3xl p-10 shadow-2xl text-center"
      >
        <h3 className="text-2xl font-bold text-text-primary mb-2 tracking-tight">Mock Test Timer</h3>
        <p className="text-sm text-text-secondary mb-8">Stay focused. You can do this!</p>
        
        <div className="text-7xl font-mono font-bold text-primary-accent mb-12 tracking-tighter drop-shadow-[0_0_15px_rgba(79,99,210,0.2)]">
          {formatTime(timeLeft)}
        </div>

        <div className="flex items-center justify-center gap-6">
          <Button 
            variant="outline" 
            size="icon" 
            className="h-14 w-14 rounded-full"
            onClick={() => {
              setIsActive(false);
              setTimeLeft(30 * 60);
            }}
          >
            <RotateCcw className="h-6 w-6" />
          </Button>
          <Button 
            className="h-20 w-20 rounded-full shadow-xl shadow-primary-accent/30"
            onClick={() => setIsActive(!isActive)}
          >
            {isActive ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8 ml-1" />}
          </Button>
          <Button 
            variant="ghost" 
            onClick={onClose}
          >
            Close
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
