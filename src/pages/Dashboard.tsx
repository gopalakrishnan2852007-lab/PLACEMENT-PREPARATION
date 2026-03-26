import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Code2, 
  Zap, 
  Trophy, 
  ArrowRight,
  ChevronDown,
  MoreHorizontal,
  Plus,
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { motion } from 'motion/react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { auth } from '../firebase';
import { cn } from '../lib/utils';
import { User } from 'firebase/auth';

interface DashboardProps {
  user: User;
}

// Mock Data
const performanceData = [
  { name: 'Arrays', solved: 45 },
  { name: 'DP', solved: 32 },
  { name: 'Graphs', solved: 28 },
  { name: 'Trees', solved: 38 },
  { name: 'Strings', solved: 25 },
  { name: 'Recursion', solved: 20 },
  { name: 'Sorting', solved: 42 },
];

const coverageData = [
  { topic: 'Arrays', percentage: 85, color: '#4F63D2' },
  { topic: 'DP', percentage: 62, color: '#22C55E' },
  { topic: 'Graphs', percentage: 48, color: '#4F63D2' },
  { topic: 'Trees', percentage: 75, color: '#22C55E' },
  { topic: 'OS Concepts', percentage: 90, color: '#4F63D2' },
  { topic: 'DBMS', percentage: 82, color: '#22C55E' },
];

const scheduleData = [
  { time: '10:00', title: 'LeetCode Session', desc: '3 problems — Arrays & Hashing', active: true, duration: '10:00-11:30' },
  { time: '12:00', title: 'Aptitude Practice', desc: 'Quantitative Reasoning', active: false },
  { time: '14:00', title: 'Mock Interview', desc: 'Technical Round — System Design', active: false },
  { time: '16:00', title: 'Resume Review', desc: 'Update projects section', active: false },
];

const upcomingInterviews = [
  { company: 'Google', role: 'Software Engineer', date: 'Mar 28, 10:00 AM', initials: 'G', color: 'bg-blue-500' },
  { company: 'Meta', role: 'Product Engineer', date: 'Apr 02, 02:30 PM', initials: 'M', color: 'bg-indigo-600' },
];

const linkedCompanies = [
  { name: 'Amazon', role: 'SDE-1', status: 'Applied', statusColor: 'bg-[#EEF0FF] text-[#4F63D2]' },
  { name: 'Netflix', role: 'UI Engineer', status: 'OA Round', statusColor: 'bg-[#FFF3E0] text-[#F97316]' },
  { name: 'Microsoft', role: 'Full Stack', status: 'Technical', statusColor: 'bg-[#E8F5E9] text-[#22C55E]' },
];

// Reusable Components
const CircularProgress = ({ percentage, color, size = 76 }: { percentage: number, color: string, size?: number }) => {
  const radius = 38;
  const strokeWidth = 7;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex flex-col items-center">
      <svg height={size} width={size} viewBox="0 0 76 76" className="transform -rotate-90">
        <circle
          stroke="#EEF0FF"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke={color}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset }}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>
      <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[14px] font-bold text-text-primary">
        {percentage}%
      </span>
    </div>
  );
};

export default function Dashboard({ user }: DashboardProps) {
  const navigate = useNavigate();
  return (
    <div className="space-y-8 pb-12">
      {/* Hero Welcome Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[16px] p-8 card-shadow flex flex-col md:flex-row items-center justify-between relative overflow-hidden"
      >
        <div className="relative z-10 flex-1">
          <h1 className="text-[24px] font-bold text-text-primary mb-2">
            Hello, {user?.displayName?.split(' ')[0] || 'Candidate'}! 👋
          </h1>
          <p className="text-text-secondary mb-6">
            You have <span className="text-primary-accent font-semibold">12 problems</span> due for revision today. Let's crush it!
          </p>
          <button onClick={() => navigate('/dsa')} className="bg-primary-accent text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity">
            Start Revision
            <ArrowRight size={18} />
          </button>
        </div>
        
        <div className="hidden md:block relative w-64 h-48">
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-48 h-48 bg-primary-accent/5 rounded-full blur-3xl" />
          <div className="relative z-10 flex items-center justify-center h-full text-[80px]">
            👨‍💻
          </div>
        </div>
        
        {/* Subtle Gradient Overlay */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-primary-accent/5 to-transparent pointer-events-none" />
      </motion.div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "DSA Solved", value: "247", sub: "problems solved", trend: "+12", color: "border-primary-accent" },
          { label: "Current Streak", value: "14 🔥", sub: "day streak", trend: "+2", color: "border-warning-orange" },
          { label: "Aptitude Accuracy", value: "85%", sub: "avg accuracy", trend: "+5%", color: "border-success-green" },
          { label: "Companies Applied", value: "18", sub: "in pipeline", trend: "+3", color: "border-indigo-500" },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`bg-white p-6 rounded-[16px] card-shadow border-t-4 ${stat.color}`}
          >
            <p className="text-text-secondary text-xs font-bold uppercase tracking-wider mb-2">{stat.label}</p>
            <div className="flex items-end justify-between">
              <div>
                <h3 className="text-[28px] font-bold text-text-primary leading-none mb-1">{stat.value}</h3>
                <p className="text-text-secondary text-xs">{stat.sub}</p>
              </div>
              <div className="flex items-center gap-1 text-success-green text-xs font-bold">
                <Plus size={12} />
                {stat.trend}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Performance Chart */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-8 bg-white p-8 rounded-[16px] card-shadow"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-[18px] font-bold text-text-primary">DSA Performance</h3>
              <p className="text-text-secondary text-sm mt-1">
                Top topic: <span className="text-text-primary font-semibold">Arrays (45 solved)</span>
              </p>
            </div>
            <button className="flex items-center gap-2 px-3 py-1.5 bg-zinc-100 rounded-lg text-xs font-bold text-text-secondary hover:bg-zinc-200 transition-colors">
              This Month
              <ChevronDown size={14} />
            </button>
          </div>

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F2FF" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#7C83A0', fontSize: 12, fontWeight: 500 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#7C83A0', fontSize: 12, fontWeight: 500 }}
                />
                <Tooltip 
                  cursor={{ fill: '#F0F2FF' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Bar 
                  dataKey="solved" 
                  fill="#4F63D2" 
                  radius={[4, 4, 0, 0]} 
                  barSize={28}
                >
                  {performanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} className="hover:opacity-80 transition-opacity cursor-pointer" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Topic Coverage Rings */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-4 bg-white p-8 rounded-[16px] card-shadow"
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-[18px] font-bold text-text-primary">My Coverage</h3>
            <button className="text-text-secondary hover:text-text-primary transition-colors">
              <MoreHorizontal size={20} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-y-8 gap-x-4">
            {coverageData.map((item, i) => (
              <div key={i} className="flex flex-col items-center">
                <CircularProgress percentage={item.percentage} color={item.color} />
                <p className="text-[12px] font-bold text-text-secondary mt-3 text-center">{item.topic}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Schedule Section */}
        <div className="lg:col-span-4 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-[18px] font-bold text-text-primary">Today's Schedule</h3>
            <button className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg text-xs font-bold text-text-secondary card-shadow hover:bg-zinc-50 transition-colors">
              Today
              <ChevronDown size={14} />
            </button>
          </div>

          <div className="space-y-4">
            {scheduleData.map((item, i) => (
              <div key={i} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <span className="text-[12px] font-bold text-text-secondary w-10">{item.time}</span>
                  <div className="w-px h-full bg-zinc-200 my-2 border-dashed border-l" />
                </div>
                <div className={cn(
                  "flex-1 p-4 rounded-[16px] transition-all",
                  item.active 
                    ? "bg-primary-accent text-white shadow-lg shadow-primary-accent/20" 
                    : "bg-white text-text-primary card-shadow border-l-4 border-zinc-200"
                )}>
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-bold">{item.title}</h4>
                    {item.active && <Clock size={14} className="opacity-60" />}
                  </div>
                  <p className={cn("text-xs", item.active ? "text-white/80" : "text-text-secondary")}>
                    {item.desc}
                  </p>
                  {item.duration && (
                    <p className="text-[10px] mt-2 font-bold opacity-60 uppercase tracking-wider">{item.duration}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Interviews & Companies */}
        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Upcoming Interviews */}
            <div className="bg-white p-8 rounded-[16px] card-shadow">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[18px] font-bold text-text-primary">Upcoming Interviews</h3>
                <button className="text-primary-accent text-xs font-bold hover:underline">See all</button>
              </div>
              <div className="space-y-4">
                {upcomingInterviews.map((item, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-xl hover:bg-zinc-50 transition-colors group">
                    <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-white font-bold", item.color)}>
                      {item.initials}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-text-primary">{item.company}</h4>
                      <p className="text-xs text-text-secondary">{item.role}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-text-primary">{item.date.split(',')[0]}</p>
                      <p className="text-[10px] text-text-secondary">{item.date.split(',')[1]}</p>
                    </div>
                    <button className="p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreHorizontal size={16} className="text-text-secondary" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Linked Companies */}
            <div className="bg-white p-8 rounded-[16px] card-shadow">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[18px] font-bold text-text-primary">Linked Companies</h3>
                <button className="text-primary-accent text-xs font-bold hover:underline">See all</button>
              </div>
              <div className="space-y-4">
                {linkedCompanies.map((item, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-xl hover:bg-zinc-50 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center text-text-secondary font-bold">
                      {item.name[0]}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-text-primary">{item.name}</h4>
                      <p className="text-xs text-text-secondary">{item.role}</p>
                    </div>
                    <span className={cn("px-3 py-1 rounded-full text-[10px] font-bold", item.statusColor)}>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Activity Feed / Recent Wins */}
          <div className="bg-white p-8 rounded-[16px] card-shadow">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-success-green/10 text-success-green rounded-xl flex items-center justify-center">
                <Trophy size={20} />
              </div>
              <h3 className="text-[18px] font-bold text-text-primary">Recent Achievements</h3>
            </div>
            <div className="flex flex-wrap gap-4">
              {[
                "Solved 50 DP Problems",
                "14 Day Streak",
                "Top 5% in Aptitude",
                "Resume Score: 92/100"
              ].map((win, i) => (
                <div key={i} className="flex items-center gap-2 px-4 py-2 bg-success-green/5 border border-success-green/10 rounded-full text-success-green text-xs font-bold">
                  <CheckCircle2 size={14} />
                  {win}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
