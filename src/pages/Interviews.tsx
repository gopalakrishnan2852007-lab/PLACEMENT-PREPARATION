import React, { useState } from 'react';
import { useStore, Company } from '@/src/store/useStore';
import { Card, Button, Input } from '@/src/components/ui/Base';
import { 
  Plus, 
  Briefcase, 
  Search, 
  Filter, 
  MoreVertical, 
  Calendar, 
  DollarSign, 
  MapPin, 
  ChevronRight,
  MessageSquare,
  History,
  FileText,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';

const columns = [
  { id: 'Applied', label: 'Applied', color: 'bg-zinc-800' },
  { id: 'OA', label: 'OA', color: 'bg-blue-600' },
  { id: 'Technical 1', label: 'Tech 1', color: 'bg-purple-600' },
  { id: 'Technical 2', label: 'Tech 2', color: 'bg-indigo-600' },
  { id: 'HR', label: 'HR', color: 'bg-pink-600' },
  { id: 'Offer', label: 'Offer', color: 'bg-green-600' },
  { id: 'Rejected', label: 'Rejected', color: 'bg-red-600' },
];

export default function Interviews() {
  const { companies, addCompany, updateCompany } = useStore();
  const navigate = useNavigate();
  const [isAdding, setIsAdding] = useState(false);
  const [activeTab, setActiveTab] = useState<'Pipeline' | 'HR Bank' | 'History'>('Pipeline');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    addCompany({
      name: formData.get('name') as string,
      role: formData.get('role') as string,
      ctc: formData.get('ctc') as string,
      status: formData.get('status') as any,
      priority: formData.get('priority') as any,
      nextAction: formData.get('nextAction') as string,
    });
    setIsAdding(false);
  };

  return (
    <div className="bg-white text-zinc-900 min-h-[calc(100vh-6rem)] rounded-[2.5rem] p-8 md:p-12 shadow-xl border border-zinc-200 space-y-8 relative overflow-hidden">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-zinc-900">Interview Pipeline</h2>
          <p className="text-zinc-500 mt-1">Manage your applications and prepare for HR rounds.</p>
        </div>
        <Button onClick={() => setIsAdding(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Company
        </Button>
      </header>

      <div className="flex items-center gap-1 p-1 bg-white border border-zinc-200 rounded-xl w-fit">
        {['Pipeline', 'HR Bank', 'History'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-lg transition-all",
              activeTab === tab 
                ? "bg-zinc-800 text-white shadow-sm" 
                : "text-zinc-500 hover:text-zinc-700"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'Pipeline' && (
        <>
          {companies.length === 0 ? (
            <Card className="p-12 text-center border-dashed border-2 border-zinc-200 bg-zinc-50 flex flex-col items-center justify-center mt-8">
              <div className="w-16 h-16 rounded-full bg-orange-500/10 text-orange-500 flex items-center justify-center mb-4">
                <Briefcase size={32} />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 mb-2">No active applications</h3>
              <p className="text-sm text-zinc-500 max-w-sm mx-auto mb-6">Track your job applications, prepare for HR rounds, and manage your placement pipeline.</p>
              <Button onClick={() => setIsAdding(true)} className="gap-2 bg-zinc-900 hover:bg-zinc-800 text-white">
                <Plus className="h-4 w-4" /> Add First Application
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4 overflow-x-auto pb-4 pt-4">
              {columns.map((column) => (
                <div key={column.id} className="min-w-[250px] space-y-4">
                  <div className="flex items-center justify-between px-2">
                    <div className="flex items-center gap-2">
                      <div className={cn("h-2 w-2 rounded-full", column.color)} />
                      <h3 className="text-sm font-bold text-zinc-700">{column.label}</h3>
                    </div>
                    <span className="text-[10px] font-bold text-zinc-600 bg-white px-1.5 py-0.5 rounded border border-zinc-200">
                      {companies.filter(c => c.status === column.id).length}
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    {companies
                      .filter(c => c.status === column.id)
                      .map((company) => (
                        <motion.div
                          key={company.id}
                          layoutId={company.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <Card className={cn(
                            "p-4 transition-colors cursor-pointer group relative overflow-hidden",
                            company.status === 'Offer' 
                              ? "border-green-500/50 bg-green-500/5 shadow-[0_0_15px_-3px_theme(colors.green.500/20)]" 
                              : "hover:border-zinc-300"
                          )}>
                            {company.status === 'Offer' && (
                              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-green-500/20 to-transparent blur-xl" />
                            )}
                            <div className="flex items-center justify-between mb-3 relative">
                              <h4 className="text-sm font-bold text-zinc-900 group-hover:text-orange-500 transition-colors">
                                {company.name}
                              </h4>
                              <Button variant="ghost" size="icon" className="h-6 w-6 text-zinc-600">
                                <MoreVertical className="h-3 w-3" />
                              </Button>
                            </div>
                            <p className="text-xs text-zinc-500 mb-4">{company.role}</p>
                            
                            <div className="space-y-2 mb-4">
                              <div className="flex items-center gap-2 text-[10px] text-zinc-500 uppercase tracking-wider">
                                <DollarSign className="h-3 w-3" />
                                {company.ctc}
                              </div>
                              {company.nextAction && (
                                <div className="flex items-center gap-2 text-[10px] text-orange-500 font-bold uppercase tracking-wider">
                                  <ArrowRight className="h-3 w-3" />
                                  {company.nextAction}
                                </div>
                              )}
                            </div>

                            <div className="flex items-center justify-between pt-3 border-t border-zinc-200">
                              <span className={cn(
                                "text-[8px] font-bold px-1.5 py-0.5 rounded uppercase",
                                company.priority === 'High' ? "bg-red-500/10 text-red-500" :
                                company.priority === 'Medium' ? "bg-orange-500/10 text-orange-500" :
                                "bg-zinc-800 text-zinc-500"
                              )}>
                                {company.priority}
                              </span>
                              <div className="flex -space-x-1.5">
                                <Button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigate('/jd-prep', { state: { role: company.role, company: company.name } });
                                  }}
                                  className="h-6 px-2 text-[10px] bg-blue-500/10 text-blue-500 hover:bg-blue-500/20"
                                >
                                  Prepare AI Guide
                                </Button>
                              </div>
                            </div>
                          </Card>
                        </motion.div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {activeTab === 'HR Bank' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-bold text-zinc-900 mb-6 flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-orange-500" />
              Common HR Questions
            </h3>
            <div className="space-y-4">
              {[
                "Tell me about yourself.",
                "What are your strengths and weaknesses?",
                "Why do you want to join this company?",
                "Where do you see yourself in 5 years?",
                "Tell me about a time you faced a challenge."
              ].map((q, i) => (
                <div key={i} className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 hover:border-zinc-300 transition-colors cursor-pointer">
                  <p className="text-sm font-medium text-zinc-800">{q}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] font-bold text-green-500 bg-green-500/10 px-1.5 py-0.5 rounded">Answer Prepared</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
          <Card className="p-6">
            <h3 className="text-lg font-bold text-zinc-900 mb-6 flex items-center gap-2">
              <History className="h-5 w-5 text-orange-500" />
              Interview Experiences
            </h3>
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-bold text-zinc-900">Amazon - SDE Intern</h4>
                  <span className="text-[10px] font-bold text-zinc-500 uppercase">2 days ago</span>
                </div>
                <p className="text-xs text-zinc-500 line-clamp-2 mb-3">
                  Asked about Graph traversals and some OS concepts like Paging and Virtual Memory.
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-blue-500 bg-blue-500/10 px-1.5 py-0.5 rounded uppercase">Technical Round 1</span>
                  <span className="text-[10px] font-bold text-green-500 bg-green-500/10 px-1.5 py-0.5 rounded uppercase">Verdict: Passed</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg bg-white border border-zinc-200 rounded-2xl p-6 shadow-2xl"
          >
            <h3 className="text-xl font-bold text-zinc-900 mb-6">Add New Application</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-zinc-500">Company Name</label>
                  <Input name="name" placeholder="e.g., Google" required />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-zinc-500">Role</label>
                  <Input name="role" placeholder="e.g., Software Engineer" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-zinc-500">CTC Offered</label>
                  <Input name="ctc" placeholder="e.g., 24 LPA" required />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-zinc-500">Priority</label>
                  <select name="priority" className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-1 focus:ring-orange-500">
                    {['Low', 'Medium', 'High'].map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-zinc-500">Current Status</label>
                  <select name="status" className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-1 focus:ring-orange-500">
                    {columns.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-zinc-500">Next Action</label>
                  <Input name="nextAction" placeholder="e.g., Prepare for OA" />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-8">
                <Button type="button" variant="ghost" onClick={() => setIsAdding(false)}>Cancel</Button>
                <Button type="submit">Add Application</Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
