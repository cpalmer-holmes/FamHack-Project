/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Navbar } from './components/Navbar';
import { EventCard } from './components/EventCard';
import { StatRadar } from './components/StatRadar';
import { Login } from './components/Login';
import { RatingModal, RatingData } from './components/RatingModal';
import { Event, Achievement, Item, User, UserStats } from './types';
import { cn } from './lib/utils';
import { 
  Shield, 
  Zap, 
  Brain, 
  Heart, 
  Award, 
  Sword, 
  Crown, 
  Sparkles,
  Search,
  Filter,
  Star,
  X
} from 'lucide-react';

// Mock Data
const MOCK_EVENTS: Event[] = [
  {
    id: '1',
    title: 'Hackathon April 2026',
    description: '8 Hour Long Hackathon - Informatics Forum.',
    date: 'April 15, 2026',
    time: '10:00 AM',
    link: 'https://compsoc.uni.edu/hackathon',
    points: 500,
    stats: { int: 10, dex: 5 },
    category: 'Coding'
  },
  {
    id: '2',
    title: 'GameSoc Game Night',
    description: 'Monthly GameSoc Game Night - Appleton Floor 6.',
    date: 'April 20, 2026',
    time: '6:00 PM',
    link: 'https://compsoc.uni.edu/gaming',
    points: 200,
    stats: { dex: 15, cha: 5 },
    category: 'Social'
  },
  {
    id: '3',
    title: 'SigInt Workshop',
    description: 'TBD',
    date: 'April 25, 2026',
    time: '2:00 PM',
    link: 'https://compsoc.uni.edu/ai',
    points: 300,
    stats: { int: 20 },
    category: 'Workshop'
  },
  {
    id: '4',
    title: 'AGM',
    description: 'TBD.',
    date: 'May 1, 2026',
    time: '5:00 PM',
    link: 'https://compsoc.uni.edu/agm',
    points: 100,
    stats: { cha: 15, int: 5 },
    category: 'Society'
  }
];

const MOCK_ACHIEVEMENTS: Achievement[] = [
  { 
    id: 'a1', 
    title: 'Event Attendance', 
    description: 'Attend your first Compsoc event.', 
    icon: 'https://comp-soc.com/compsoc-mini.svg', 
    rarity: 'Common',
    unlockedDate: '28/10/25'
  },
  { 
    id: 'a2', 
    title: '1st Place Nov GameJam', 
    description: 'Participate in a Hackathon.', 
    icon: 'https://comp-soc.com/SIGs/gamedevsig.webp', 
    rarity: 'Rare',
    unlockedDate: '02/11/25'
  },
  { 
    id: 'a3', 
    title: 'Attend the Intro to Unity', 
    description: 'Win a gaming tournament.', 
    icon: 'https://comp-soc.com/SIGs/gamedevsig.webp', 
    rarity: 'Epic',
    unlockedDate: '15/02/26'
  },
  { 
    id: 'a4', 
    title: 'Workshop Warrior', 
    description: 'Attend 5 workshops.', 
    icon: 'https://comp-soc.com/compsoc-mini.svg', 
    rarity: 'Rare',
    unlockedDate: '22/02/26'
  },
  { 
    id: 'a5', 
    title: 'Veteran Member', 
    description: 'Be part of Compsoc for 3 years.', 
    icon: 'https://comp-soc.com/compsoc-mini.svg', 
    rarity: 'Legendary',
    unlockedDate: '05/03/26'
  },
  { 
    id: 'a6', 
    title: 'Quest Master', 
    description: 'Complete all quests.', 
    icon: 'https://comp-soc.com/compsoc-mini.svg', 
    rarity: 'Legendary',
    unlockedDate: '15/03/26'
  },
];

const MOCK_ITEMS: Item[] = [
  { id: 'i1', name: 'Bow', description: 'Precise.', price: 500, image: 'https://png.pngtree.com/png-clipart/20240806/original/pngtree-wooden-longbow-and-arrow-png-image_15713016.png', type: 'Weapon' },
  { id: 'i2', name: 'Sword', description: 'A symbol of precision and speed. Slash enemies down', price: 1200, image: 'https://png.pngtree.com/png-vector/20240730/ourmid/pngtree-beautiful-sword-on-transparent-background-png-image_13298016.png', type: 'Weapon' },
  { id: 'i3', name: 'Axe', description: 'Lethal. Brutal.', price: 800, image: 'https://static.vecteezy.com/system/resources/previews/034/722/652/non_2x/viking-axe-isolated-on-transparent-free-png.png', type: 'Body' },
  { id: 'i4', name: 'Dagger', description: 'Perfect for rogues.', price: 300, image: 'https://png.pngtree.com/png-clipart/20240810/original/pngtree-realistic-silver-dagger-illustration-png-image_15744386.png', type: 'Accessory' },
];

const INITIAL_USER: User = {
  name: 'John CompSoc',
  guild: '',
  points: 1500,
  stats: { str: 45, dex: 60, int: 85, cha: 40 },
  badges: ['1', '2'],
  achievements: ['a1', 'a2', 'a3', 'a4', 'a5', 'a6'],
  inventory: ['i1']
};

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('main');
  const [armorySubTab, setArmorySubTab] = useState<'store' | 'stats'>('store');
  const [user, setUser] = useState<User>(INITIAL_USER);
  const [searchQuery, setSearchQuery] = useState('');
  const [ratingEventId, setRatingEventId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleLogin = (name: string) => {
    setUser(prev => ({ ...prev, name }));
    setIsLoggedIn(true);
  };

  const filteredEvents = useMemo(() => {
    return MOCK_EVENTS.filter(e => 
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handleRate = (id: string) => {
    setRatingEventId(id);
  };

  const handleRatingSubmit = (ratingData: RatingData) => {
    console.log('handleRatingSubmit called with:', ratingData);
    
    // Award XP
    const xpAward = 150;
    setUser(prev => ({ ...prev, points: prev.points + xpAward }));
    
    // Close modal
    setRatingEventId(null);
    
    // Show success message
    showToast(`Quest Feedback Received! +${xpAward} XP awarded.`);
  };

  const buyItem = (item: Item) => {
    if (user.points >= item.price) {
      setUser(prev => ({
        ...prev,
        points: prev.points - item.price,
        inventory: [...prev.inventory, item.id]
      }));
      alert(`Purchased ${item.name}!`);
    } else {
      alert('Not enough XP!');
    }
  };

  const buyStat = (stat: keyof UserStats) => {
    const cost = 100; // Let's make it 100 XP for 1 point
    if (user.points >= cost) {
      setUser(prev => ({
        ...prev,
        points: prev.points - cost,
        stats: {
          ...prev.stats,
          [stat]: prev.stats[stat] + 1
        }
      }));
    } else {
      alert('Not enough XP!');
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'main':
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-4xl mx-auto p-6 pb-32"
          >
            <header className="mb-10">
              <h1 className="text-4xl font-black tracking-tighter uppercase italic text-rpg-red">Available Quests</h1>
              <p className="text-slate-400 mt-2 font-medium">Complete events to level up your stats and earn XP.</p>
              
              <div className="mt-6 flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input 
                    type="text" 
                    placeholder="Search quests..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-rpg-card border border-rpg-border rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-rpg-accent transition-colors shadow-inner text-white"
                  />
                </div>
                <button className="rpg-button flex items-center gap-2 bg-rpg-accent text-white border-none hover:bg-rpg-accent/90">
                  <Filter size={18} />
                  Filter
                </button>
              </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredEvents.map(event => (
                <EventCard key={event.id} event={event} onRate={handleRate} />
              ))}
            </div>
          </motion.div>
        );

      case 'profile':
        return (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="max-w-5xl mx-auto p-6 pb-32 grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Left Column: Avatar & Basic Info */}
            <div className="lg:col-span-1 flex flex-col gap-6">
              <div className="rpg-panel p-8 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rpg-red to-rpg-accent" />
                <div className="w-32 h-32 bg-slate-800 rounded-full mx-auto mb-4 border-4 border-rpg-border flex items-center justify-center text-5xl shadow-inner">
                  👤
                </div>
                <h2 className="text-2xl font-bold text-white">{user.name}</h2>
                <p className="text-rpg-accent font-mono text-sm uppercase tracking-widest mt-1 font-bold">{user.guild}</p>
                
                <div className="mt-6 flex flex-col gap-2">
                  <div className="flex justify-between text-xs font-mono mb-1 text-slate-400">
                    <span className="font-bold">Level 12</span>
                    <span className="font-bold">{user.points} / 2000 XP</span>
                  </div>
                  <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(user.points / 2000) * 100}%` }}
                      className="h-full bg-rpg-red"
                    />
                  </div>
                </div>
              </div>

              <div className="rpg-panel p-6">
                <h3 className="text-sm font-mono uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                  <Crown size={16} className="text-rpg-gold" />
                  Rarest Achievements
                </h3>
                <div className="flex justify-around">
                  {MOCK_ACHIEVEMENTS.slice(0, 3).map(ach => (
                    <div key={ach.id} className="group relative">
                      <div className={cn(
                        "w-16 h-16 rounded-full border-2 border-rpg-gold flex items-center justify-center overflow-hidden cursor-help hover:scale-110 transition-transform shadow-sm bg-slate-800"
                      )}>
                        <img 
                          src={ach.icon} 
                          alt={ach.title} 
                          className="w-full h-full object-contain p-1" 
                          referrerPolicy="no-referrer" 
                        />
                      </div>
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-32 bg-slate-900 text-white text-[10px] p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none text-center shadow-lg">
                        {ach.title}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Middle Column: Stats */}
            <div className="lg:col-span-1 flex flex-col gap-6">
              <div className="rpg-panel p-6">
                <h3 className="text-sm font-mono uppercase tracking-widest text-slate-400 mb-4">Attribute Matrix</h3>
                <StatRadar stats={user.stats} />
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                    <Sword className="text-rpg-red" size={20} />
                    <div>
                      <div className="stat-label">Strength</div>
                      <div className="font-bold text-white">{user.stats.str}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                    <Zap className="text-rpg-gold" size={20} />
                    <div>
                      <div className="stat-label">Dexterity</div>
                      <div className="font-bold text-white">{user.stats.dex}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                    <Brain className="text-rpg-accent" size={20} />
                    <div>
                      <div className="stat-label">Intelligence</div>
                      <div className="font-bold text-white">{user.stats.int}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                    <Heart className="text-pink-500" size={20} />
                    <div>
                      <div className="stat-label">Charisma</div>
                      <div className="font-bold text-white">{user.stats.cha}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Badges */}
            <div className="lg:col-span-1 flex flex-col gap-6">
              <div className="rpg-panel p-6">
                <h3 className="text-sm font-mono uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                  <Award size={16} className="text-rpg-accent" />
                  Quest Badges
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  {user.badges.map(badgeId => {
                    const event = MOCK_EVENTS.find(e => e.id === badgeId);
                    return (
                      <div key={badgeId} className="aspect-square bg-slate-800/50 rounded-xl border border-rpg-border flex flex-col items-center justify-center p-2 text-center group hover:border-rpg-accent transition-colors shadow-sm">
                        <Sparkles size={24} className="text-rpg-gold mb-1" />
                        <span className="text-[10px] font-bold line-clamp-1 text-slate-300">{event?.title}</span>
                      </div>
                    );
                  })}
                  {/* Empty slots */}
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="aspect-square bg-slate-800/20 rounded-xl border border-dashed border-slate-700 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-slate-700" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 'achievements':
        return (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="max-w-6xl mx-auto p-6 pb-32"
          >
            <header className="mb-12 text-center">
              <h1 className="text-4xl font-black tracking-tighter uppercase italic text-rpg-red">Achievements</h1>
              <p className="text-slate-400 mt-2 font-medium">Your journey through the society, immortalized in digital steel.</p>
              
              <div className="flex justify-center gap-8 mt-8">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-slate-400" />
                  <span className="text-xs font-mono text-slate-500 uppercase">Common</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rpg-accent" />
                  <span className="text-xs font-mono text-slate-500 uppercase">Rare</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-500" />
                  <span className="text-xs font-mono text-slate-500 uppercase">Epic</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rpg-gold" />
                  <span className="text-xs font-mono text-slate-500 uppercase">Legendary</span>
                </div>
              </div>
            </header>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
              {MOCK_ACHIEVEMENTS.map(ach => {
                const isUnlocked = user.achievements.includes(ach.id);
                const rarityColors = {
                  Common: 'border-slate-400/50',
                  Rare: 'border-rpg-accent/50',
                  Epic: 'border-purple-500/50',
                  Legendary: 'border-rpg-gold/50'
                };
                
                const rarityGlow = {
                  Common: 'shadow-slate-400/5',
                  Rare: 'shadow-rpg-accent/10',
                  Epic: 'shadow-purple-500/10',
                  Legendary: 'shadow-rpg-gold/10'
                };

                return (
                  <div 
                    key={ach.id} 
                    className={cn(
                      "flex flex-col items-center group transition-all duration-500",
                      isUnlocked ? "opacity-100" : "opacity-20 grayscale"
                    )}
                  >
                    <div className={cn(
                      "relative w-32 h-32 rounded-lg border-4 flex items-center justify-center overflow-hidden mb-4 transition-all duration-300 bg-slate-800/50",
                      rarityColors[ach.rarity],
                      rarityGlow[ach.rarity],
                      isUnlocked && "group-hover:scale-110 group-hover:border-opacity-100 shadow-xl"
                    )}>
                      <img 
                        src={ach.icon} 
                        alt={ach.title} 
                        className="w-full h-full object-cover" 
                        referrerPolicy="no-referrer" 
                      />
                      
                      {/* Hover Overlay */}
                      {isUnlocked && (
                        <div className="absolute inset-0 bg-slate-900/90 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4 text-center">
                          <p className="text-[10px] font-bold text-white leading-tight">{ach.description}</p>
                          <span className="text-[8px] font-mono text-slate-400 mt-2">{ach.unlockedDate}</span>
                        </div>
                      )}
                    </div>
                    
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider text-center line-clamp-1">{ach.title}</h4>
                    <span className={cn(
                      "text-[9px] font-mono uppercase mt-1",
                      ach.rarity === 'Common' && "text-slate-400",
                      ach.rarity === 'Rare' && "text-rpg-accent",
                      ach.rarity === 'Epic' && "text-purple-400",
                      ach.rarity === 'Legendary' && "text-rpg-gold"
                    )}>
                      {ach.rarity}
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        );

      case 'store':
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="max-w-5xl mx-auto p-6 pb-32"
          >
            <div className="rpg-panel overflow-hidden bg-slate-800/40 border-slate-700">
              {/* XP LEFT Header */}
              <div className="bg-slate-800/80 p-4 border-b border-slate-700">
                <h2 className="text-xl font-black text-white tracking-widest uppercase italic">XP LEFT : {user.points}</h2>
              </div>

              {/* Sub-Tabs */}
              <div className="flex">
                <button 
                  onClick={() => setArmorySubTab('store')}
                  className={cn(
                    "flex-1 py-3 font-black uppercase tracking-widest transition-colors",
                    armorySubTab === 'store' ? "bg-rpg-red text-white" : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                  )}
                >
                  Store
                </button>
                <button 
                  onClick={() => setArmorySubTab('stats')}
                  className={cn(
                    "flex-1 py-3 font-black uppercase tracking-widest transition-colors",
                    armorySubTab === 'stats' ? "bg-rpg-red text-white" : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                  )}
                >
                  Stats
                </button>
              </div>

              {/* Content Area */}
              <div className="p-8 bg-slate-700/30 min-h-[500px]">
                {armorySubTab === 'store' ? (
                  <div className="flex flex-col gap-10">
                    {/* Item Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      {MOCK_ITEMS.map(item => {
                        const isOwned = user.inventory.includes(item.id);
                        return (
                          <div key={item.id} className="relative aspect-[4/3] bg-slate-800 rounded-lg border-2 border-slate-600 overflow-hidden group hover:border-rpg-accent transition-all">
                            {/* Price Badge */}
                            <div className="absolute top-2 left-2 bg-rpg-red text-white text-[10px] font-black px-3 py-1 rounded-sm shadow-md z-10">
                              - {item.price} XP
                            </div>
                            
                            <div className="w-full h-full flex items-center justify-center overflow-hidden">
                              <img 
                                src={item.image} 
                                alt={item.name} 
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                                referrerPolicy="no-referrer"
                              />
                            </div>

                            {/* Hover info */}
                            <div className="absolute inset-0 bg-slate-900/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4 text-center">
                              <h4 className="font-bold text-white mb-1">{item.name}</h4>
                              <p className="text-[10px] text-slate-300 mb-3">{item.description}</p>
                              <button 
                                onClick={() => buyItem(item)}
                                disabled={isOwned}
                                className={cn(
                                  "px-4 py-1 rounded text-xs font-bold transition-all",
                                  isOwned ? "bg-slate-700 text-slate-500" : "bg-rpg-accent text-white hover:scale-105"
                                )}
                              >
                                {isOwned ? 'OWNED' : 'BUY'}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Inventory Section */}
                    <div>
                      <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4">Inventory</h3>
                      <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
                        {/* Owned Items */}
                        {user.inventory.map(itemId => {
                          const item = MOCK_ITEMS.find(i => i.id === itemId);
                          return (
                            <div key={itemId} className="aspect-square bg-slate-800 rounded border border-slate-600 flex items-center justify-center overflow-hidden shadow-inner">
                              {item?.image && (
                                <img 
                                  src={item.image} 
                                  alt={item?.name} 
                                  className="w-full h-full object-cover" 
                                  referrerPolicy="no-referrer"
                                />
                              )}
                            </div>
                          );
                        })}
                        {/* Empty Slots */}
                        {[...Array(16 - user.inventory.length)].map((_, i) => (
                          <div key={i} className="aspect-square bg-slate-800/30 rounded border border-slate-700/50 flex items-center justify-center">
                            <div className="w-1 h-1 rounded-full bg-slate-700" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Stat Purchase Grid */}
                    <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { id: 'str', name: 'Strength', icon: Sword, color: 'text-rpg-red' },
                        { id: 'dex', name: 'Speed', icon: Zap, color: 'text-rpg-gold' },
                        { id: 'int', name: 'Intelligence', icon: Brain, color: 'text-rpg-accent' },
                        { id: 'cha', name: 'Stamina', icon: Heart, color: 'text-pink-500' },
                      ].map(stat => (
                        <button 
                          key={stat.id}
                          onClick={() => buyStat(stat.id as keyof UserStats)}
                          className="relative aspect-[16/9] bg-slate-800 rounded-lg border-2 border-slate-600 p-4 flex flex-col items-center justify-center group hover:border-rpg-accent transition-all"
                        >
                          <div className="absolute top-2 left-2 bg-rpg-red text-white text-[10px] font-black px-3 py-1 rounded-sm shadow-md">
                            - 100 XP = 1 PT
                          </div>
                          <stat.icon className={cn("mb-2", stat.color)} size={32} />
                          <span className="font-black uppercase tracking-widest text-white text-sm">{stat.name}</span>
                        </button>
                      ))}
                    </div>

                    {/* Current Stats Panel */}
                    <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
                      <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6 text-center">Current Stats</h3>
                      <div className="flex flex-col gap-6">
                        {[
                          { name: 'STRENGTH', value: user.stats.str },
                          { name: 'SPEED', value: user.stats.dex },
                          { name: 'INTELLIGENCE', value: user.stats.int },
                          { name: 'STAMINA', value: user.stats.cha },
                        ].map(s => (
                          <div key={s.name} className="text-center">
                            <div className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.3em] mb-1">{s.name}</div>
                            <div className="text-2xl font-black text-white">{s.value}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-rpg-bg">
      <AnimatePresence mode="wait">
        {!isLoggedIn ? (
          <Login onLogin={handleLogin} />
        ) : (
          <motion.div 
            key="main-app"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen"
          >
            <AnimatePresence mode="wait">
              {renderContent()}
            </AnimatePresence>
            <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
            
            <AnimatePresence>
              {ratingEventId && (
                <RatingModal 
                  event={MOCK_EVENTS.find(e => e.id === ratingEventId)!}
                  onClose={() => setRatingEventId(null)}
                  onSubmit={handleRatingSubmit}
                />
              )}
            </AnimatePresence>

            {/* Toast Notification */}
            <AnimatePresence>
              {toast && (
                <motion.div
                  initial={{ opacity: 0, y: 50, x: '-50%' }}
                  animate={{ opacity: 1, y: 0, x: '-50%' }}
                  exit={{ opacity: 0, y: 50, x: '-50%' }}
                  className={cn(
                    "fixed bottom-24 left-1/2 z-[100] px-6 py-3 rounded-xl font-black uppercase tracking-widest text-white shadow-2xl border border-white/10 backdrop-blur-md",
                    toast.type === 'success' ? "bg-rpg-accent" : "bg-rpg-red"
                  )}
                >
                  <div className="flex items-center gap-3">
                    {toast.type === 'success' ? <Sparkles size={20} /> : <X size={20} />}
                    {toast.message}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
