import React, { useState, useEffect, useMemo } from 'react';
import { TASK_BLOCKS, TOTAL_DAILY_TASKS, LEVELS } from './constants';
import { HistoryLog, GlobalStats, TaskBlock } from './types';
import Calendar from './components/Calendar';
import StatsPanel from './components/StatsPanel';
import ProgressBar from './components/ProgressBar';
import SyncModal from './components/SyncModal';
import { Check, Cpu, Settings } from 'lucide-react';

const STORAGE_KEY = 'cyber_habit_history_v1';

// Helper to format date as YYYY-MM-DD
const formatDateKey = (date: Date) => {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

const App: React.FC = () => {
  // --- State ---
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [history, setHistory] = useState<HistoryLog>({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);

  // --- Load Data ---
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // --- Save Data ---
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    }
  }, [history, isLoaded]);

  // --- Derived State for Selected Date ---
  const dateKey = formatDateKey(selectedDate);
  const completedTodayIds = history[dateKey] || [];
  
  const dailyPercentage = Math.round((completedTodayIds.length / TOTAL_DAILY_TASKS) * 100);

  // --- Stats Calculation Engine ---
  const stats: GlobalStats = useMemo(() => {
    const dates = Object.keys(history).sort();
    let totalPerfectDays = 0;
    let totalXp = 0;
    
    // XP & Perfect Days Calculation
    dates.forEach(date => {
      const tasksCompleted = history[date].length;
      // 10 XP per task, 100 Bonus XP for perfect day
      let dayXp = tasksCompleted * 10;
      if (tasksCompleted === TOTAL_DAILY_TASKS) {
        totalPerfectDays++;
        dayXp += 100;
      }
      totalXp += dayXp;
    });

    // Streak Calculation
    let currentStreak = 0;
    let maxStreak = 0;
    let tempStreak = 0;

    // We need a continuous timeline for streaks to handle "yesterday" logic correctly
    if (dates.length > 0) {
      const firstDate = new Date(dates[0]);
      const lastDate = new Date(); // Today
      // Normalize time
      lastDate.setHours(0,0,0,0);
      firstDate.setHours(0,0,0,0);
      
      // Iterate day by day from first recorded day to today
      const iterDate = new Date(firstDate);
      
      while (iterDate <= lastDate) {
        const dKey = formatDateKey(iterDate);
        const completedCount = history[dKey]?.length || 0;
        const isPerfect = completedCount === TOTAL_DAILY_TASKS;

        if (isPerfect) {
          tempStreak++;
        } else {
          // If today is not perfect yet, don't break streak immediately, 
          // only break if we are looking at a past day
          if (iterDate.getTime() < lastDate.getTime()) {
             tempStreak = 0;
          }
        }

        if (tempStreak > maxStreak) maxStreak = tempStreak;
        iterDate.setDate(iterDate.getDate() + 1);
      }
      currentStreak = tempStreak;
    }

    return {
      currentStreak,
      maxStreak,
      totalPerfectDays,
      totalXp,
      level: LEVELS.slice().reverse().find(l => totalXp >= l.minXp)?.name || 'Новичок',
      nextLevelXp: 0 // handled in component
    };
  }, [history]);


  // --- Handlers ---
  const toggleTask = (taskId: string) => {
    setHistory(prev => {
      const currentList = prev[dateKey] || [];
      const isCompleted = currentList.includes(taskId);
      
      let newList;
      if (isCompleted) {
        newList = currentList.filter(id => id !== taskId);
      } else {
        newList = [...currentList, taskId];
      }

      return {
        ...prev,
        [dateKey]: newList
      };
    });
  };

  const handleImportData = (newData: HistoryLog) => {
    setHistory(newData);
  };

  // Helper component to render a list of tasks
  const RenderTaskBlock = ({ block, cols = 1 }: { block: TaskBlock | undefined, cols?: number }) => {
    if (!block) return null;
    return (
      <div className="relative mb-8">
        {/* Block Header */}
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3 cyber-font">
          <span className="w-2 h-8 bg-cyan-500 block"></span>
          {block.title}
        </h2>
        
        <div className={`grid grid-cols-1 ${cols === 2 ? 'md:grid-cols-2' : ''} gap-4`}>
          {block.tasks.map(task => {
            const isCompleted = completedTodayIds.includes(task.id);
            return (
              <div 
                key={task.id}
                onClick={() => toggleTask(task.id)}
                className={`
                  group cursor-pointer relative p-4 border transition-all duration-300 overflow-hidden
                  ${isCompleted 
                    ? 'bg-cyan-900/10 border-cyan-500 shadow-[0_0_15px_rgba(0,243,255,0.15)]' 
                    : 'bg-gray-900/40 border-gray-800 hover:border-gray-600'}
                  cyber-border
                `}
              >
                 {/* Content */}
                <div className="flex items-start justify-between relative z-10">
                  <div>
                    <div className={`font-bold text-lg mb-1 transition-colors ${isCompleted ? 'text-cyan-400' : 'text-gray-300 group-hover:text-white'}`}>
                      {task.label}
                    </div>
                    {task.notes && (
                      <div className="text-xs text-gray-500 font-mono uppercase tracking-wide">
                        {task.notes}
                      </div>
                    )}
                  </div>
                  
                  {/* Checkbox Visual */}
                  <div className={`
                    w-6 h-6 border flex items-center justify-center transition-all duration-300
                    ${isCompleted ? 'bg-cyan-500 border-cyan-400 rotate-0' : 'bg-transparent border-gray-600 rotate-45 group-hover:border-white'}
                  `}>
                    {isCompleted && <Check size={16} className="text-black stroke-[4]" />}
                  </div>
                </div>

                {/* Decoration Lines */}
                <div className={`absolute bottom-0 left-0 h-[2px] transition-all duration-500 ${isCompleted ? 'w-full bg-cyan-500' : 'w-0 bg-gray-700 group-hover:w-1/3'}`} />
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (!isLoaded) return <div className="min-h-screen bg-black text-cyan-500 flex items-center justify-center font-mono">ИНИЦИАЛИЗАЦИЯ СИСТЕМЫ...</div>;

  const morningBlock = TASK_BLOCKS.find(b => b.id === 'morning');
  const dayBlock = TASK_BLOCKS.find(b => b.id === 'day');
  const eveningBlock = TASK_BLOCKS.find(b => b.id === 'evening');
  const allDayBlock = TASK_BLOCKS.find(b => b.id === 'allday');

  return (
    <div className="min-h-screen bg-black pb-12 selection:bg-cyan-500 selection:text-black">
      {/* Background Decor */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none opacity-20"
           style={{
             backgroundImage: 'radial-gradient(circle at 50% 50%, #111 0%, #000 100%)',
           }} 
      />
      
      <div className="max-w-7xl mx-auto px-4 py-6 relative z-10">
        
        {/* Header */}
        <header className="mb-8 border-b border-gray-800 pb-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-black uppercase text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-orange-500 tracking-tighter" style={{ textShadow: '0 0 20px rgba(0,243,255,0.3)' }}>
              My tracker
            </h1>
            <p className="text-gray-500 font-mono text-sm mt-1">Система ежедневной синхронизации v1.0</p>
          </div>
          <div className="flex items-center space-x-4">
             <button 
                onClick={() => setIsSyncModalOpen(true)} 
                className="text-gray-500 hover:text-cyan-500 transition-colors flex items-center gap-2 border border-gray-800 px-3 py-1 bg-gray-900 cyber-border hover:border-cyan-500"
             >
               <span className="text-xs uppercase font-bold hidden md:inline">Настройки</span>
               <Settings size={20} />
             </button>
             <div className="text-right">
                <div className="text-xs text-gray-500 uppercase">Дата системы</div>
                <div className="text-xl font-bold font-mono text-cyan-500">{dateKey}</div>
             </div>
          </div>
        </header>

        {/* Stats Grid */}
        <StatsPanel stats={stats} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Navigation: Calendar & Progress (Sticky on Desktop) - Width 3 cols */}
          <div className="lg:col-span-3 space-y-6">
             <div className="lg:sticky lg:top-6 space-y-6">
                <Calendar 
                  selectedDate={selectedDate} 
                  onSelectDate={setSelectedDate}
                  history={history}
                  totalDailyTasks={TOTAL_DAILY_TASKS}
                />
                
                <div className="p-4 bg-gray-900/40 border border-gray-800 cyber-border">
                  <h3 className="text-gray-400 uppercase text-xs font-bold mb-4 flex items-center gap-2">
                    <Cpu size={14} /> 
                    Дневная целостность
                  </h3>
                  <ProgressBar percentage={dailyPercentage} />
                </div>
             </div>
          </div>

          {/* Main Content Area - Width 9 cols */}
          <div className="lg:col-span-9">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Left Column of Content: Morning & All Day (All Day hidden on mobile here) */}
              <div>
                <RenderTaskBlock block={morningBlock} />
                <div className="hidden md:block">
                  <RenderTaskBlock block={allDayBlock} />
                </div>
              </div>

              {/* Right Column of Content: Day & Evening */}
              <div>
                <RenderTaskBlock block={dayBlock} />
                <RenderTaskBlock block={eveningBlock} />
              </div>

            </div>

            {/* Mobile Only: All Day Block at the bottom */}
            <div className="md:hidden">
              <RenderTaskBlock block={allDayBlock} />
            </div>

            {/* End of list spacer */}
            <div className="mt-8 h-12 border-t border-gray-800 border-dashed flex items-center justify-center text-gray-700 font-mono text-xs">
              /// КОНЕЦ ПРОТОКОЛА ///
            </div>
          </div>

        </div>
      </div>

      <SyncModal 
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
        data={history}
        onImport={handleImportData}
      />
    </div>
  );
};

export default App;