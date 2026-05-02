import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Bell, Search, User } from 'lucide-react';

export default function Navbar() {
  const { user } = useAuth();

  return (
    <header className="h-20 border-b border-white/5 bg-[#030712]/80 backdrop-blur-xl sticky top-0 z-30 px-8 flex items-center justify-between">
      <div className="relative w-96">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input 
          type="text" 
          placeholder="Search projects or tasks..." 
          className="input-field pl-12"
        />
      </div>

      <div className="flex items-center gap-6">
        <button className="relative p-2.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-primary-500 rounded-full ring-4 ring-[#030712]"></span>
        </button>

        <div className="flex items-center gap-4 pl-6 border-l border-white/10">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-slate-200">{user?.name}</p>
            <p className="text-[11px] text-slate-500 font-medium">{user?.role?.toUpperCase()}</p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center font-bold text-white shadow-xl shadow-primary-500/10 border border-white/10">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
}
