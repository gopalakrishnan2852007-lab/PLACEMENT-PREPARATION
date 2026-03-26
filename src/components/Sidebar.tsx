import { Link, useLocation } from "react-router-dom";
import { cn } from "../lib/utils";
import { 
  LayoutDashboard, 
  Code2, 
  BrainCircuit, 
  Briefcase, 
  Settings,
  LogOut,
  Bot,
  ClipboardList,
  GraduationCap,
  Sparkles,
  FileText,
  Target
} from "lucide-react";
import { auth, signOut } from "../firebase";
import { Logo } from "./Logo";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: Code2, label: "DSA Problems", path: "/dsa" },
  { icon: BrainCircuit, label: "Aptitude", path: "/aptitude" },
  { icon: Briefcase, label: "Companies", path: "/companies" },
  { icon: ClipboardList, label: "Mock Tests", path: "/mock-tests" },
  { icon: Bot, label: "Interviews", path: "/interviews" },
  { icon: FileText, label: "Resume AI", path: "/resume-analyzer" },
  { icon: Target, label: "JD Analyzer", path: "/jd-prep" },
  { icon: GraduationCap, label: "Placements", path: "/placements" },
  { icon: Sparkles, label: "GOATED Tools", path: "/goated-tools" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

export function Sidebar() {
  const location = useLocation();
  const user = auth.currentUser;

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-[220px] bg-sidebar flex flex-col z-50 overflow-y-auto">
      {/* Logo Section */}
      <div className="flex items-center gap-3 px-6 py-8">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white border border-white/20">
          <Logo size={24} />
        </div>
        <h1 className="text-lg font-bold text-white tracking-tight">JOBSEEKER</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-0">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "group flex items-center gap-3 px-6 py-3.5 text-sm font-medium transition-all duration-200 relative",
                isActive 
                  ? "bg-sidebar-active text-white" 
                  : "text-white/60 hover:text-white hover:bg-white/5"
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-white" />
              )}
              <item.icon className={cn("h-[18px] w-[18px]", isActive ? "opacity-100" : "opacity-60 group-hover:opacity-100")} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="mt-auto p-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-2 mb-4">
          <img 
            src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.displayName || 'User'}`} 
            alt="User" 
            className="h-9 w-9 rounded-full border-2 border-white/20"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">{user?.displayName || 'Candidate'}</p>
            <p className="text-[10px] text-white/40 truncate">Premium Member</p>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-white/60 hover:bg-white/5 hover:text-white transition-all"
        >
          <LogOut className="h-[18px] w-[18px]" />
          Log Out
        </button>
      </div>
    </aside>
  );
}
