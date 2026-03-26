import React, { useState } from 'react';
import { Card, Button, Input } from '@/src/components/ui/Base';
import { useStore } from '@/src/store/useStore';
import { auth } from '@/src/firebase';
import { updateProfile } from 'firebase/auth';
import { User, Mail, Shield, Bell, Moon, Sun, Save, Loader2, LogOut } from 'lucide-react';
import { signOut } from '@/src/firebase';

export default function Settings() {
  const { theme, setTheme } = useStore();
  const [displayName, setDisplayName] = useState(auth.currentUser?.displayName || '');
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState('');

  const handleUpdateProfile = async () => {
    if (!auth.currentUser) return;
    setIsUpdating(true);
    setMessage('');
    try {
      await updateProfile(auth.currentUser, { displayName });
      setMessage('Profile updated successfully!');
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <header>
        <h2 className="text-3xl font-bold text-text-primary tracking-tight">Settings</h2>
        <p className="text-text-secondary mt-1">Manage your account preferences and profile details.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-4">
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-zinc-50 dark:bg-zinc-800/50 text-primary-accent font-semibold rounded-xl border border-primary-accent/20">
            <User className="w-5 h-5" />
            Profile details
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-text-secondary hover:bg-zinc-50 dark:hover:bg-zinc-800/50 font-medium rounded-xl transition-colors">
            <Shield className="w-5 h-5" />
            Security
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-text-secondary hover:bg-zinc-50 dark:hover:bg-zinc-800/50 font-medium rounded-xl transition-colors">
            <Bell className="w-5 h-5" />
            Notifications
          </button>
          <div className="pt-4 mt-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-center">
            <Button variant="outline" className="w-full text-red-500 border-red-200 hover:bg-red-50" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <Card className="p-6 md:p-8">
            <h3 className="text-xl font-bold text-text-primary mb-6">Profile Details</h3>
            
            <div className="flex items-center gap-6 mb-8">
              <img 
                src={auth.currentUser?.photoURL || `https://ui-avatars.com/api/?name=${auth.currentUser?.displayName || 'User'}&size=120`}
                alt="Profile" 
                className="w-24 h-24 rounded-full border-4 border-zinc-50 shadow-sm"
              />
              <div>
                <Button variant="outline" className="mb-2">Change Avatar</Button>
                <p className="text-xs text-text-secondary">Avatar changes require social relogin.</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-text-primary">Display Name</label>
                <Input 
                  value={displayName} 
                  onChange={(e) => setDisplayName(e.target.value)} 
                  placeholder="E.g. John Doe" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-text-primary">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                  <Input 
                    value={auth.currentUser?.email || ''} 
                    disabled 
                    className="pl-10 bg-zinc-50 text-zinc-500 cursor-not-allowed" 
                  />
                </div>
                <p className="text-xs text-text-secondary mt-1">Email address is synced from your Google Account.</p>
              </div>

              {message && (
                <div className={`p-4 rounded-xl text-sm font-medium ${message.includes('Error') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-700'}`}>
                  {message}
                </div>
              )}

              <Button onClick={handleUpdateProfile} disabled={isUpdating} className="gap-2">
                {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save Changes
              </Button>
            </div>
          </Card>

          <Card className="p-6 md:p-8">
            <h3 className="text-xl font-bold text-text-primary mb-6">Preferences</h3>
            <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-100 dark:border-zinc-800 transition-colors">
              <div className="flex gap-4 items-center">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 transition-colors">
                  {theme === 'dark' ? <Moon className="w-5 h-5 fill-current" /> : <Sun className="w-5 h-5" />}
                </div>
                <div>
                  <p className="font-bold text-text-primary">Dark Mode</p>
                  <p className="text-sm text-text-secondary">Switch to {theme === 'dark' ? 'light' : 'dark'} theme</p>
                </div>
              </div>
              <Button 
                variant={theme === 'dark' ? 'primary' : 'outline'} 
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="w-24 font-bold"
              >
                {theme === 'dark' ? 'Enabled' : 'Enable'}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
