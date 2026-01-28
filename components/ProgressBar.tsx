import React from 'react';

interface ProgressBarProps {
  percentage: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ percentage }) => {
  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between text-xs uppercase tracking-widest text-cyan-600 font-bold">
        <span>Синхронизация</span>
        <span>{Math.round(percentage)}%</span>
      </div>
      <div className="relative h-6 w-full bg-gray-900 border border-gray-700 cyber-border overflow-hidden">
        {/* Grid Background inside bar */}
        <div className="absolute inset-0 opacity-20" 
             style={{backgroundImage: 'linear-gradient(to right, #333 1px, transparent 1px)', backgroundSize: '20px 100%'}}>
        </div>
        
        {/* Fill */}
        <div 
          className="h-full bg-gradient-to-r from-cyan-800 to-cyan-400 shadow-[0_0_15px_rgba(0,243,255,0.5)] transition-all duration-500 ease-out flex items-center justify-end pr-2 overflow-hidden"
          style={{ width: `${percentage}%` }}
        >
            {percentage > 10 && (
                 <span className="text-[10px] text-black font-black animate-pulse whitespace-nowrap">/// АКТИВНО</span>
            )}
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;