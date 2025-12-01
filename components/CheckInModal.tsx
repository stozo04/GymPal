import React, { useRef, useState } from 'react';
import { X, Scale, CheckCircle2, Calendar } from 'lucide-react';
import { BodyStats } from '../types';

interface CheckInModalProps {
  onClose: () => void;
  bodyStats: BodyStats;
  onUpdateBodyStats: (stats: BodyStats) => void;
  onSaveBodyStats: (date: string) => void;
}

export const CheckInModal: React.FC<CheckInModalProps> = ({ 
  onClose, bodyStats, onUpdateBodyStats, onSaveBodyStats 
}) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const dateInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-slate-900/90 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200">
        
        <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-white/5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 z-20 transition-all">
            <X className="w-4 h-4" />
        </button>

        <div className="p-8 relative z-10">
            <div className="flex flex-col items-center text-center mb-8">
                <div className="p-4 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl shadow-lg shadow-purple-900/30 mb-4">
                    <Scale className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">Body Check-in</h3>
                <p className="text-sm text-slate-400 mt-1">Track your physique progress</p>
            </div>

            <div className="space-y-4 mb-8">
                <div>
                    <label className="text-[10px] text-slate-500 uppercase font-bold block mb-1.5 tracking-wider">Date</label>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                        <input 
                            type="date" 
                            ref={dateInputRef}
                            className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-3 text-white focus:border-purple-500 outline-none text-sm font-medium cursor-pointer"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            onClick={() => {
                              try {
                                dateInputRef.current?.showPicker?.();
                              } catch {
                                // ignore if browser disallows programmatic open
                              }
                            }}
                        />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-[10px] text-slate-500 uppercase font-bold block mb-1.5 tracking-wider">Weight (lbs)</label>
                        <input 
                            type="number" 
                            className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white text-lg font-bold focus:border-purple-500 outline-none text-center font-mono" 
                            value={bodyStats.weight} 
                            onChange={(e) => onUpdateBodyStats({...bodyStats, weight: e.target.value})}
                            autoFocus
                        />
                    </div>
                    <div>
                        <label className="text-[10px] text-slate-500 uppercase font-bold block mb-1.5 tracking-wider">Waist (in)</label>
                        <input 
                            type="number" 
                            className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white text-lg font-bold focus:border-purple-500 outline-none text-center font-mono" 
                            value={bodyStats.waist} 
                            onChange={(e) => onUpdateBodyStats({...bodyStats, waist: e.target.value})}
                        />
                    </div>
                </div>
            </div>

            <button 
                onClick={() => {
                    onSaveBodyStats(date);
                    onClose();
                }}
                className="w-full py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold shadow-lg shadow-purple-900/30 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
                <CheckCircle2 className="w-5 h-5" />
                Save Entry
            </button>
        </div>
      </div>
    </div>
  );
};
