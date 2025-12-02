import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Timer as TimerIcon } from 'lucide-react';

interface TimerProps {
  initialSeconds: number;
}

export const Timer: React.FC<TimerProps> = ({ initialSeconds, label }) => {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const hasPlayedRef = useRef(false);

  const playTimerAlert = () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const now = audioContext.currentTime;

      // Create a beep sound using oscillator
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Set frequency and duration
      oscillator.frequency.value = 800; // Hz
      oscillator.type = 'sine';

      // Create envelope: quick attack, quick release
      gainNode.gain.setValueAtTime(0.3, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.5);

      oscillator.start(now);
      oscillator.stop(now + 0.5);
    } catch (e) {
      console.warn('Timer alert sound failed:', e);
    }
  };

  useEffect(() => {
    if (isActive && seconds > 0) {
      intervalRef.current = window.setInterval(() => {
        setSeconds((s) => s - 1);
      }, 1000);
      hasPlayedRef.current = false;
    } else if (seconds === 0 && !hasPlayedRef.current) {
      setIsActive(false);
      if (intervalRef.current) clearInterval(intervalRef.current);
      playTimerAlert();
      hasPlayedRef.current = true;
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