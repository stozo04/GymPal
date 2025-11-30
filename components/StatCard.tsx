import React from 'react';

interface StatCardProps {
  label: string;
  value: string;
  sub: string;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, sub }) => {
  return (
    <div className="bg-slate-900/40 backdrop-blur-md p-4 rounded-2xl border border-white/5 flex flex-col items-center text-center shadow-lg shadow-black/10">
      <div className="text-slate-400 text-[10px] uppercase font-bold tracking-widest mb-2">{label}</div>
      <div className="text-2xl font-bold text-white mb-1">{value}</div>
      <div className="text-xs text-slate-500 font-medium">{sub}</div>
    </div>
  );
};

export const StatRow: React.FC<StatCardProps> = ({ label, value, sub }) => {
  return (
    <div className="flex items-center justify-between p-4 bg-slate-900/40 rounded-xl border border-white/5">
      <div>
        <div className="text-sm font-bold text-slate-200">{label}</div>
        <div className="text-xs text-slate-500 mt-0.5">{sub}</div>
      </div>
      <div className="text-lg font-bold text-white font-mono">{value}</div>
    </div>
  );
};