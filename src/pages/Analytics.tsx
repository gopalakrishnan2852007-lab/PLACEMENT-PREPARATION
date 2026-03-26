import React from 'react';
import { useStore } from '@/src/store/useStore';
import { Card } from '@/src/components/ui/Base';
import { 
  BarChart3, 
  TrendingUp, 
  Target, 
  BrainCircuit, 
  Code2, 
  Briefcase,
  Zap,
  Trophy,
  Calendar
} from 'lucide-react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { format, subDays, startOfWeek, endOfWeek, isWithinInterval } from 'date-fns';

export default function Analytics() {
  const { problems, aptitudeSessions, companies, xp } = useStore();

  // Radar Chart Data
  const radarData = [
    { subject: 'DSA', A: Math.min(100, (problems.filter(p => p.status === 'Solved').length / 100) * 100), fullMark: 100 },
    { subject: 'Aptitude', A: aptitudeSessions.length > 0 ? (aptitudeSessions.reduce((acc, s) => acc + (s.score / s.totalQuestions), 0) / aptitudeSessions.length) * 100 : 0, fullMark: 100 },
    { subject: 'Communication', A: 75, fullMark: 100 }, // Simulated
    { subject: 'Projects', A: 80, fullMark: 100 }, // Simulated
    { subject: 'Resume', A: 90, fullMark: 100 }, // Simulated
    { subject: 'Mock Interviews', A: 60, fullMark: 100 }, // Simulated
  ];

  // Weekly Activity Data
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), i);
    const dateStr = format(date, 'yyyy-MM-dd');
    const solvedCount = problems.filter(p => p.solvedAt && format(p.solvedAt, 'yyyy-MM-dd') === dateStr).length;
    return {
      name: format(date, 'EEE'),
      solved: solvedCount,
    };
  }).reverse();

  const level = Math.floor(xp / 100) + 1;
  const xpToNextLevel = 100 - (xp % 100);

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-3xl font-bold text-white tracking-tight">Analytics & Insights</h2>
        <p className="text-blue-200/60 mt-1">Deep dive into your preparation metrics and readiness.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-6 bg-white/5 border-white/10 backdrop-blur-md rounded-3xl">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <Zap className="h-5 w-5 text-blue-400" />
            Skill Coverage
          </h3>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.05)" />
                <PolarAngleAxis dataKey="subject" stroke="rgba(255,255,255,0.4)" fontSize={12} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="rgba(255,255,255,0.05)" tick={false} />
                <Radar
                  name="Skills"
                  dataKey="A"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.5}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6 bg-white/5 border-white/10 backdrop-blur-md rounded-3xl">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-400" />
            Weekly Problem Solving
          </h3>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={last7Days}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', backdropFilter: 'blur(8px)' }}
                  itemStyle={{ color: '#60a5fa' }}
                />
                <Bar dataKey="solved" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="p-6 bg-blue-600/10 border-blue-600/20 backdrop-blur-md rounded-3xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
              <Trophy className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Level {level}</h4>
              <p className="text-xs text-blue-200/40">{xp} Total XP</p>
            </div>
          </div>
          <p className="text-xs text-white/40 mb-2">{xpToNextLevel} XP to Level {level + 1}</p>
          <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600" style={{ width: `${xp % 100}%` }} />
          </div>
        </Card>

        <Card className="p-6 bg-white/5 border-white/10 backdrop-blur-md rounded-3xl">
          <h4 className="text-sm font-bold text-blue-200/40 mb-4 uppercase tracking-wider">Preparation Health</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/60">Consistency</span>
              <span className="text-sm font-bold text-green-400">Excellent</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/60">Accuracy</span>
              <span className="text-sm font-bold text-blue-400">Improving</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/60">Pipeline Activity</span>
              <span className="text-sm font-bold text-purple-400">Steady</span>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white/5 border-white/10 backdrop-blur-md rounded-3xl">
          <h4 className="text-sm font-bold text-blue-200/40 mb-4 uppercase tracking-wider">Estimated Readiness</h4>
          <div className="flex items-center gap-4">
            <div className="text-4xl font-bold text-white">72%</div>
            <div className="flex-1">
              <p className="text-xs text-white/40">You are ahead of 85% of applicants for SDE roles.</p>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs text-green-400">
            <TrendingUp className="h-3 w-3" />
            <span>+4% from last week</span>
          </div>
        </Card>
      </div>
    </div>
  );
}
