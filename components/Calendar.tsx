import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  history: Record<string, string[]>; // Used to mark completed/perfect days
  totalDailyTasks: number;
}

const Calendar: React.FC<CalendarProps> = ({ selectedDate, onSelectDate, history, totalDailyTasks }) => {
  const [viewDate, setViewDate] = useState(new Date(selectedDate));

  const daysInMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1).getDay(); // 0 is Sunday
  
  // Adjust for Monday start (0=Monday, 6=Sunday)
  const startDayOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

  const handlePrevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const handleYearChange = (delta: number) => {
    setViewDate(new Date(viewDate.getFullYear() + delta, viewDate.getMonth(), 1));
  };

  const isToday = (d: number) => {
    const today = new Date();
    return d === today.getDate() && 
           viewDate.getMonth() === today.getMonth() && 
           viewDate.getFullYear() === today.getFullYear();
  };

  const isSelected = (d: number) => {
    return d === selectedDate.getDate() && 
           viewDate.getMonth() === selectedDate.getMonth() && 
           viewDate.getFullYear() === selectedDate.getFullYear();
  };

  const getDayStatus = (day: number) => {
    const dateStr = `${viewDate.getFullYear()}-${String(viewDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const completedCount = history[dateStr]?.length || 0;
    
    if (completedCount === 0) return 'empty';
    if (completedCount === totalDailyTasks) return 'perfect';
    return 'partial';
  };

  const renderDays = () => {
    const days = [];
    // Empty slots for alignment
    for (let i = 0; i < startDayOffset; i++) {
      days.push(<div key={`empty-${i}`} className="h-10 w-full" />);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const status = getDayStatus(d);
      const selected = isSelected(d);
      
      let bgClass = "bg-gray-900 text-gray-400 border-gray-800";
      
      if (status === 'perfect') bgClass = "bg-cyan-900/40 text-cyan-300 border-cyan-600 shadow-[0_0_5px_rgba(0,243,255,0.2)]";
      else if (status === 'partial') bgClass = "bg-yellow-900/20 text-yellow-200 border-yellow-700";
      
      if (selected) {
        bgClass = "bg-orange-500 text-black border-orange-400 shadow-[0_0_10px_#ff9900] z-10 scale-110";
      } else if (isToday(d)) {
        bgClass += " ring-1 ring-white";
      }

      days.push(
        <button
          key={d}
          onClick={() => {
            const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), d);
            onSelectDate(newDate);
          }}
          className={`h-10 w-full flex items-center justify-center text-sm font-bold border transition-all duration-200 hover:bg-gray-800 cyber-border-reverse ${bgClass}`}
        >
          {d}
        </button>
      );
    }
    return days;
  };

  const months = [
    'ЯНВ', 'ФЕВ', 'МАР', 'АПР', 'МАЙ', 'ИЮН',
    'ИЮЛ', 'АВГ', 'СЕН', 'ОКТ', 'НОЯ', 'ДЕК'
  ];

  return (
    <div className="border border-gray-700 bg-black/50 p-4 backdrop-blur-sm cyber-border">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
            <button onClick={handlePrevMonth} className="text-cyan-500 hover:text-cyan-300"><ChevronLeft size={20}/></button>
            <span className="w-16 text-center font-bold tracking-widest text-cyan-400">{months[viewDate.getMonth()]}</span>
            <button onClick={handleNextMonth} className="text-cyan-500 hover:text-cyan-300"><ChevronRight size={20}/></button>
        </div>
        
        <div className="flex items-center space-x-2">
           <button onClick={() => handleYearChange(-1)} className="text-gray-500 hover:text-gray-300 text-xs">
             <ChevronLeft size={14}/>
           </button>
           <span className="text-orange-500 font-bold">{viewDate.getFullYear()}</span>
           <button onClick={() => handleYearChange(1)} className="text-gray-500 hover:text-gray-300 text-xs">
             <ChevronRight size={14}/>
           </button>
        </div>
      </div>

      {/* Days Header */}
      <div className="grid grid-cols-7 gap-1 mb-2 text-center">
        {['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'].map(d => (
          <div key={d} className="text-[10px] text-gray-500">{d}</div>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 gap-2">
        {renderDays()}
      </div>
    </div>
  );
};

export default Calendar;