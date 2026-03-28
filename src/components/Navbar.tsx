import React from 'react';
import { Home, User, Trophy, ShoppingBag } from 'lucide-react';
import { cn } from '../lib/utils';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'main', label: 'Quests', icon: Home },
    { id: 'profile', label: 'Character', icon: User },
    { id: 'achievements', label: 'Achievements', icon: Trophy },
    { id: 'store', label: 'Armory', icon: ShoppingBag },
  ];

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="bg-rpg-card/90 backdrop-blur-md border border-rpg-border rounded-2xl p-2 flex gap-2 shadow-2xl">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300",
                isActive 
                  ? "bg-rpg-red text-white font-bold shadow-lg shadow-rpg-red/20" 
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              )}
            >
              <Icon size={20} />
              <span className={cn("hidden md:block", isActive ? "block" : "hidden")}>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
