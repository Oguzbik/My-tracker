import React from 'react';
import { GlobalStats } from '../types';
import { LEVELS } from '../constants';
import { Trophy, Flame, Zap, Shield } from 'lucide-react';

interface StatsPanelProps {
  stats: GlobalStats;
}

const StatsPanel: React.FC<StatsPanelProps> = ({ stats }) => {
  const currentLevelInfo = LEVELS.slice().reverse().find(l => stats.totalXp >= l.minXp) || LEVELS[0];
  const nextLevelInfo = LEVELS.find(l => l.minXp > stats.totalXp);
  
  // Calculate XP progress to next level
  let xpProgress = 100;
  if (nextLevelInfo) {
    const prevLevelXp = currentLevelInfo.minXp;
    const range = nextLevelInfo.minXp - prevLevelXp;
    const current = stats.totalXp - prevLevelXp;
    xpProgress = Math.min(100, Math.max(0, (current / range) * 100));
  }

  const StatItem = ({ label, value, icon, colorClass }: any) => (
    <div className="flex flex-col items-center justify-center p-2 bg-gray-900/50 border border-gray-800 cyber-border-reverse">
      <div className={`mb-1 ${colorClass}`}>{icon}</div>
      <span className="text-2xl font-bold font-mono">{value}</span>
      <span className="text-[10px] uppercase tracking-wider text-gray-500">{label}</span>
    </div>
  );

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <StatItem 
        label="Стрик" 
        value={stats.currentStreak} 
        icon={<Flame size={20}/>} 
        colorClass="text-orange-500"
      />
      <StatItem 
        label="Макс. стрик" 
        value={stats.maxStreak} 
        icon={<Trophy size={20}/>} 
        colorClass="text-yellow-400"
      />
      <StatItem 
        label="Идеальные дни" 
        value={stats.totalPerfectDays} 
        icon={<Shield size={20}/>} 
        colorClass="text-cyan-400"
      />
      
      {/* Level Card */}
      <div className="flex flex-col justify-between p-2 bg-gray-900/50 border border-orange-900/50 cyber-border-reverse relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-1 opacity-20 group-hover:opacity-40 transition-opacity">
            <Zap size={40} className="text-orange-500"/>
        </div>
        <div className="flex justify-between items-end z-10">
             <span className="text-[10px] text-orange-300 uppercase">Ранг</span>
             <span className="text-xs text-gray-400">{stats.totalXp} XP</span>
        </div>
        <div className="text-sm font-bold text-orange-400 truncate z-10 leading-tight">
            {currentLevelInfo.name}
        </div>
        <div className="w-full h-1 bg-gray-800 mt-2">
            <div className="h-full bg-orange-500" style={{width: `${xpProgress}%`}}></div>
        </div>
      </div>
    </div>
  );
};

export default StatsPanel;