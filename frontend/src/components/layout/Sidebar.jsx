import React from 'react';
import { LayoutDashboard, Database, Activity, Target, Search, CheckCircle2 } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: CheckCircle2, label: 'Data Quality', path: '/quality' },
    { icon: Target, label: 'Anomalies', path: '/anomalies' },
    { icon: Activity, label: 'Analysis', path: '/analysis' },
    { icon: Search, label: 'Data Explorer', path: '/explorer' },
  ];

  return (
    <div className="w-64 h-screen bg-surface border-r border-white/10 p-4 flex flex-col hidden md:flex">
      <div className="flex items-center gap-3 mb-10 px-2 mt-4">
        <img src="/logo.png" alt="InsightX Logo" className="h-8 w-auto object-contain drop-shadow-sm" />
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          InsightX
        </h1>
      </div>
      
      <nav className="flex-1 flex flex-col gap-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'bg-primary/20 text-blue-400 border border-blue-500/30 shadow-[inset_0_0_10px_rgba(59,130,246,0.2)]' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`
            }
          >
            <item.icon size={20} />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>
      
      <div className="p-4 rounded-xl bg-gradient-to-b from-white/5 to-transparent border border-white/5 mt-auto">
        <p className="text-xs text-gray-400 text-center">AI Analytics Command Center</p>
      </div>
    </div>
  );
};

export default Sidebar;
