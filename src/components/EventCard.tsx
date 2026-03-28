import React from 'react';
import { Calendar, Clock, ExternalLink, Star } from 'lucide-react';
import { Event } from '../types';

interface EventCardProps {
  event: Event;
  onRate: (id: string) => void;
}

export const EventCard: React.FC<EventCardProps> = ({ event, onRate }) => {
  return (
    <div className="rpg-panel p-6 flex flex-col gap-4 hover:border-rpg-accent/50 transition-all group bg-rpg-card hover:shadow-xl">
      <div className="flex justify-between items-start">
        <div>
          <span className="text-xs font-mono text-rpg-accent bg-rpg-accent/10 px-2 py-1 rounded uppercase tracking-tighter font-bold">
            {event.category}
          </span>
          <h3 className="text-xl font-bold mt-2 group-hover:text-rpg-accent transition-colors text-white">{event.title}</h3>
        </div>
        <div className="flex items-center gap-1 text-rpg-gold font-bold">
          <Star size={16} fill="currentColor" />
          <span>{event.points} XP</span>
        </div>
      </div>
      
      <p className="text-slate-400 text-sm line-clamp-2 leading-relaxed">{event.description}</p>
      
      <div className="grid grid-cols-2 gap-3 text-xs text-slate-500 font-mono font-medium">
        <div className="flex items-center gap-2">
          <Calendar size={14} className="text-rpg-red" />
          <span>{event.date}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock size={14} className="text-rpg-accent" />
          <span>{event.time}</span>
        </div>
      </div>

      <div className="flex gap-2 mt-2">
        <a 
          href={event.link} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex-1 rpg-button flex items-center justify-center gap-2 bg-rpg-accent text-white border-none hover:bg-rpg-accent/90 shadow-sm"
        >
          <ExternalLink size={16} />
          Join
        </a>
        <button 
          onClick={() => onRate(event.id)}
          className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors font-bold text-sm shadow-sm"
        >
          Rate Event
        </button>
      </div>
    </div>
  );
};
