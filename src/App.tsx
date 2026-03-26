import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged, auth, User } from './firebase';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import DSA from './pages/DSA';
import AIInterview from './pages/AIInterview';
import Aptitude from './pages/Aptitude';
import ResumeAnalyzer from './pages/ResumeAnalyzer';
import JDPrep from './pages/JDPrep';
import Flashcards from './pages/Flashcards';
import Analytics from './pages/Analytics';
import Placements from './pages/Placements';
import { Layout } from './components/Layout';
import { useStore } from './store/useStore';
import Interviews from './pages/Interviews';
import { Library, Attempt, Result } from './pages/MockTests';
import { AskAI } from './components/shared/AskAI';
import GoatedTools from './pages/GoatedTools';
import Settings from './pages/Settings';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await useStore.getState().syncFromBackend();
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/login" 
          element={user ? <Navigate to="/" replace /> : <Login />} 
        />
        
        <Route 
          path="/mock-tests/:testId/attempt" 
          element={user ? <Attempt /> : <Navigate to="/login" replace />} 
        />
        
        <Route element={user ? <Layout /> : <Navigate to="/login" replace />}>
          <Route path="/" element={<Dashboard user={user!} />} />
          <Route path="/dsa" element={<DSA />} />
          <Route path="/ai-interview" element={<AIInterview />} />
          <Route path="/aptitude" element={<Aptitude />} />
          <Route path="/resume-analyzer" element={<ResumeAnalyzer />} />
          <Route path="/jd-prep" element={<JDPrep />} />
          <Route path="/flashcards" element={<Flashcards />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/companies" element={<Interviews />} />
          <Route path="/mock-tests" element={<Library />} />
          <Route path="/mock-tests/:testId/result/:attemptId" element={<Result />} />
          <Route path="/interviews" element={<AIInterview />} />
          <Route path="/goated-tools" element={<GoatedTools />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/placements" element={<Placements />} />
        </Route>

        <Route path="*" element={<Navigate to={user ? "/" : "/login"} replace />} />
      </Routes>
      
      {/* Global Floating AI Coach available to logged-in users */}
      {user && <AskAI />}
    </BrowserRouter>
  );
}
