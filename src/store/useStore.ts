import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { auth } from '../firebase';

export interface Problem {
  id: string;
  title: string;
  platform: 'LeetCode' | 'GFG' | 'Codeforces' | 'Other';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topic: string;
  status: 'Not Started' | 'In Progress' | 'Solved' | 'Needs Revision';
  notes?: string;
  solutionLink?: string;
  createdAt: number;
  solvedAt?: number;
}

export interface AptitudeSession {
  id: string;
  topic: string;
  source: string;
  score: number;
  totalQuestions: number;
  timeTaken: number; // in minutes
  date: number;
}

export interface Company {
  id: string;
  name: string;
  role: string;
  ctc: string;
  status: 'Applied' | 'OA' | 'Technical 1' | 'Technical 2' | 'HR' | 'Offer' | 'Rejected';
  priority: 'Low' | 'Medium' | 'High';
  nextAction?: string;
  appliedAt: number;
}

export interface TestAttempt {
  attemptId: string;
  testId: string;
  testName: string;
  category: string;
  score: number;
  totalMarks: number;
  percentage: number;
  percentile: number;
  timeTaken: number;
  accuracy: number;
  createdAt: number;
}

export interface Placement {
  id: string;
  userId: string;
  college: string;
  branch: string;
  batch: string;
  companyId: string;
  role: string;
  ctcOffered: string;
  isVerified: boolean;
  createdAt: number;
}

interface AppState {
  problems: Problem[];
  aptitudeSessions: AptitudeSession[];
  companies: Company[];
  testAttempts: TestAttempt[];
  placements: Placement[];
  xp: number;
  streak: number;
  readinessScore: number;
  level: number;
  lastSolvedDate?: number;
  theme: 'light' | 'dark';

  // Actions
  setTheme: (theme: 'light' | 'dark') => void;
  addProblem: (problem: Omit<Problem, 'id' | 'createdAt'>) => void;
  updateProblem: (id: string, updates: Partial<Problem>) => void;
  deleteProblem: (id: string) => void;
  
  addAptitudeSession: (session: Omit<AptitudeSession, 'id'>) => void;
  
  addCompany: (company: Omit<Company, 'id' | 'appliedAt'>) => void;
  updateCompany: (id: string, updates: Partial<Company>) => void;
  
  // Custom Mock Tests
  customTests: {
    id: string;
    title: string;
    questions: { id: number; text: string; options: string[]; type: string; answer: string }[];
    timeLimit: number;
    category: string;
  }[];
  addCustomTest: (test: any) => void;

  // Sync
  syncFromBackend: () => Promise<void>;
  pushToBackend: () => Promise<void>;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      problems: [],
      aptitudeSessions: [],
      companies: [],
      testAttempts: [],
      placements: [],
      customTests: [],
      theme: 'light',
      xp: 0,
      streak: 0,
      readinessScore: 0,
      level: 1,

      addProblem: (problem) => {
        const newProblem: Problem = {
          ...problem,
          id: crypto.randomUUID(),
          createdAt: Date.now(),
        };
        
        const xpGain = 10;
        set((state) => ({
          problems: [newProblem, ...state.problems],
          xp: state.xp + xpGain,
        }));

        // Update streak logic
        const today = new Date().setHours(0, 0, 0, 0);
        const lastSolved = get().lastSolvedDate ? new Date(get().lastSolvedDate!).setHours(0, 0, 0, 0) : null;
        
        if (problem.status === 'Solved') {
          if (!lastSolved || today > lastSolved) {
            set((state) => ({ 
              streak: today === lastSolved ? state.streak : (lastSolved && today - lastSolved === 86400000 ? state.streak + 1 : 1),
              lastSolvedDate: Date.now()
            }));
          }
        }
        get().pushToBackend();
      },

      setTheme: (theme) => {
        set({ theme });
        if (theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      },

      updateProblem: (id, updates) => {
        set((state) => ({
          problems: state.problems.map(p => p.id === id ? { ...p, ...updates } : p)
        }));
        get().pushToBackend();
      },

      deleteProblem: (id) => {
        set((state) => ({
          problems: state.problems.filter(p => p.id !== id)
        }));
        get().pushToBackend();
      },

      addAptitudeSession: (session) => {
        const newSession: AptitudeSession = {
          ...session,
          id: crypto.randomUUID(),
        };
        set((state) => ({
          aptitudeSessions: [newSession, ...state.aptitudeSessions],
          xp: state.xp + 25,
        }));
        get().pushToBackend();
      },

      addCompany: (company) => {
        const newCompany: Company = {
          ...company,
          id: crypto.randomUUID(),
          appliedAt: Date.now(),
        };
        set((state) => ({
          companies: [newCompany, ...state.companies],
        }));
        get().pushToBackend();
      },

      updateCompany: (id, updates) => {
        set((state) => ({
          companies: state.companies.map(c => c.id === id ? { ...c, ...updates } : c)
        }));
        get().pushToBackend();
      },

      addCustomTest: (test) => {
        set((state) => ({
          customTests: [test, ...state.customTests]
        }));
        get().pushToBackend();
      },

      syncFromBackend: async () => {
        const user = auth.currentUser;
        if (!user) return;
        try {
          const token = await user.getIdToken();
          const res = await fetch('/api/data', {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (res.ok) {
            const { data } = await res.json();
            if (data) {
              set((state) => ({
                ...state,
                problems: data.problems || [],
                aptitudeSessions: data.aptitudeSessions || [],
                companies: data.companies || [],
                testAttempts: data.testAttempts || [],
                placements: data.placements || [],
                xp: data.xp || 0,
                streak: data.streak || 0,
                readinessScore: data.readinessScore || 0,
                level: data.level || 1,
                lastSolvedDate: data.lastSolvedDate
              }));
            }
          }
        } catch (err) {
          console.error('Failed to sync from backend', err);
        }
      },

      pushToBackend: async () => {
        const user = auth.currentUser;
        if (!user) return;
        try {
          const token = await user.getIdToken();
          const state = get();
          const payload = {
            problems: state.problems,
            aptitudeSessions: state.aptitudeSessions,
            companies: state.companies,
            testAttempts: state.testAttempts,
            placements: state.placements,
            xp: state.xp,
            streak: state.streak,
            readinessScore: state.readinessScore,
            level: state.level,
            lastSolvedDate: state.lastSolvedDate
          };
          await fetch('/api/data', {
            method: 'POST',
            headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
          });
        } catch (err) {
          console.error('Failed to push to backend', err);
        }
      }
    }),
    {
      name: 'preptrack-storage',
    }
  )
);
