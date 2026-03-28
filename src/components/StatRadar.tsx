import React from 'react';
import { 
  Radar, RadarChart, PolarGrid, 
  PolarAngleAxis, ResponsiveContainer 
} from 'recharts';
import { UserStats } from '../types';

interface StatRadarProps {
  stats: UserStats;
}

export const StatRadar: React.FC<StatRadarProps> = ({ stats }) => {
  const data = [
    { subject: 'STR', A: stats.str, fullMark: 100 },
    { subject: 'DEX', A: stats.dex, fullMark: 100 },
    { subject: 'INT', A: stats.int, fullMark: 100 },
    { subject: 'CHA', A: stats.cha, fullMark: 100 },
  ];

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid stroke="#334155" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} />
          <Radar
            name="Stats"
            dataKey="A"
            stroke="#2596be"
            fill="#2596be"
            fillOpacity={0.4}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};
