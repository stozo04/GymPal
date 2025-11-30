import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Timer as TimerIcon } from 'lucide-react';

interface TimerProps {
  initialSeconds: number;
  label?: string;
}

export const Timer: React.FC<TimerProps> = ({ initialSeconds, label }) => {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(false);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (isActive && seconds > 0) {
      intervalRef.current = window.setInterval(() => {
        setSeconds((s) => s - 1);
      }, 1000);
    } else if (seconds === 0) {
      setIsActive(false);
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, seconds]);

  const toggle = () => setIsActive(!isActive);
  
  const reset = () => {
    setIsActive(false);
    setSeconds(initialSeconds);
  };

  const formatTime = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center gap-3 bg-slate-800 p-2 rounded-lg border border-slate-600 inline-flex mt-2">
      <div className="flex items-center gap-2 px-2">
        <TimerIcon className={`w-4 h-4 ${isActive ? 'text-emerald-400 animate-pulse' : 'text-slate-400'}`} />
        <span className={`font-mono font-bold text-lg ${seconds === 0 ? 'text-emerald-400' : 'text-white'}`}>
          {formatTime(seconds)}
        </span>
      </div>
      
      <div className="h-6 w-px bg-slate-700 mx-1"></div>

      <button 
        onClick={toggle}
        className={`p-1.5 rounded hover:bg-slate-700 transition-colors ${isActive ? 'text-amber-400' : 'text-emerald-400'}`}
      >
        {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
      </button>
      
      <button 
        onClick={reset}
        className="p-1.5 rounded hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
      >
        <RotateCcw className="w-4 h-4" />
      </button>
    </div>
  );
};