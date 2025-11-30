import React, { useMemo } from 'react';
import { NutritionHistoryEntry } from '../types';

interface NutritionChartProps {
  data: NutritionHistoryEntry[];
}

export const NutritionChart: React.FC<NutritionChartProps> = ({ data }) => {
  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [data]);

  if (sortedData.length < 2) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-slate-500 bg-white/5 rounded-3xl border border-white/5 border-dashed">
        <p className="font-bold">Not enough data to chart.</p>
        <p className="text-xs opacity-70">Log nutrition for at least 2 days.</p>
      </div>
    );
  }

  const maxCal = Math.max(...sortedData.map(d => d.calories)) || 2500;
  const minCal = Math.min(...sortedData.map(d => d.calories)) || 1500;
  const maxProt = Math.max(...sortedData.map(d => d.protein)) || 200;
  const minProt = Math.min(...sortedData.map(d => d.protein)) || 100;

  const width = 100;
  const height = 100;
  const padding = 5;

  const getY = (val: number, min: number, max: number) => {
    const range = max - min || 1;
    const normalized = (val - min) / range;
    return (height - padding) - (normalized * (height - (padding * 2)));
  };

  const getX = (index: number) => {
    return padding + (index / (sortedData.length - 1)) * (width - (padding * 2));
  };

  const calPoints = sortedData.map((d, i) => `${getX(i)},${getY(d.calories, minCal * 0.9, maxCal * 1.1)}`).join(' ');
  const protPoints = sortedData.map((d, i) => `${getX(i)},${getY(d.protein, minProt * 0.8, maxProt * 1.2)}`).join(' ');

  return (
    <div className="bg-slate-900/40 backdrop-blur-md p-5 rounded-3xl border border-white/5">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]"></div>
            <span className="text-[10px] font-bold text-blue-300 uppercase tracking-widest">Calories</span>
        </div>
        <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"></div>
            <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-widest">Protein</span>
        </div>
      </div>

      <div className="relative h-48 w-full">
        <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="w-full h-full overflow-visible">
            <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(255,255,255,0.05)" strokeWidth="0.2" strokeDasharray="2" />
            
            <polyline fill="none" stroke="#3b82f6" strokeWidth="1.5" points={calPoints} strokeLinecap="round" strokeLinejoin="round" />
            <polyline fill="none" stroke="#10b981" strokeWidth="1.5" points={protPoints} strokeLinecap="round" strokeLinejoin="round" />

            {sortedData.map((d, i) => (
                <circle key={`c-${i}`} cx={getX(i)} cy={getY(d.calories, minCal * 0.9, maxCal * 1.1)} r="2" fill="#0f172a" stroke="#3b82f6" strokeWidth="1" />
            ))}
             {sortedData.map((d, i) => (
                <circle key={`p-${i}`} cx={getX(i)} cy={getY(d.protein, minProt * 0.8, maxProt * 1.2)} r="2" fill="#0f172a" stroke="#10b981" strokeWidth="1" />
            ))}
        </svg>

        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            {sortedData.map((d, i) => (
               <div key={i} className="absolute transform -translate-x-1/2 text-[8px] text-slate-600 font-mono" style={{ left: `${(i / (sortedData.length - 1)) * 100}%`, top: '105%' }}>
                 {d.date.slice(5)}
               </div>
            ))}
        </div>
      </div>
    </div>
  );
};