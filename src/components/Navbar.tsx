import { Search, Bell, ChevronDown, Globe } from "lucide-react";
import { auth } from "../firebase";

export function Navbar() {
  const user = auth.currentUser;

  return (
    <header className="h-16 bg-white border-b border-zinc-100 px-8 flex items-center justify-between sticky top-0 z-40">
      {/* Search Bar */}
      <div className="flex-1 max-w-md">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary group-focus-within:text-primary-accent transition-colors" />
          <input 
            type="text" 
            placeholder="Search problems, companies..." 
            className="w-full h-10 bg-zinc-100 rounded-full pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary-accent/20 focus:bg-white border border-transparent focus:border-primary-accent/20 transition-all"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-6">
        {/* Language Selector */}
        <button className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors">
          <Globe className="h-4 w-4" />
          <span className="text-sm font-medium">English</span>
          <ChevronDown className="h-4 w-4" />
        </button>

        {/* Notifications */}
        <button className="relative p-2 text-text-secondary hover:text-text-primary transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
        </button>

        {/* User Dropdown */}
        <button className="flex items-center gap-3 pl-4 border-l border-zinc-100 hover:opacity-80 transition-opacity">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-text-primary leading-none">{user?.displayName || 'Candidate'}</p>
            <p className="text-[10px] text-text-secondary font-medium mt-1 uppercase tracking-wider">Student</p>
          </div>
          <img 
            src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.displayName || 'User'}`} 
            alt="Avatar" 
            className="h-9 w-9 rounded-full border border-zinc-100"
          />
          <ChevronDown className="h-4 w-4 text-text-secondary" />
        </button>
      </div>
    </header>
  );
}
