
import React, { useState } from 'react';
import { X, Utensils, CheckCircle2, Calendar, Flame, Droplet, Wheat } from 'lucide-react';
import { NutritionLog } from '../types';

interface FuelModalProps {
  onClose: () => void;
  onSave: (date: string, data: NutritionLog) => void;
}

export const FuelModal: React.FC<FuelModalProps> = ({ onClose, onSave }) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [data, setData] = useState<NutritionLog>({
    protein: '',
    fat: '',
    carbs: '',
    calories: '',
    notes: ''
  });

  const handleSubmit = () => {
    onSave(date, data);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-slate-900/90 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200">
        
        <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-white/5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 z-20 transition-all">
            <X className="w-4 h-4" />
        </button>

        <div className="p-6 relative z-10">
            <div className="flex flex-col items-center text-center mb-6">
                <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-lg shadow-emerald-900/30 mb-3">
                    <Utensils className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">Fuel Log</h3>
                <p className="text-sm text-slate-400 mt-1">Track your daily intake</p>
            </div>

            <div className="space-y-4 mb-6">
                {/* Date Selection */}
                <div>
                    <label className="text-[10px] text-slate-500 uppercase font-bold block mb-1.5 tracking-wider">Date</label>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                        <input 
                            type="date" 
                            className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-3 text-white focus:border-emerald-500 outline-none text-sm font-medium cursor-pointer"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </div>
                </div>

                {/* Macros Grid */}
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="text-[10px] text-emerald-400/80 uppercase font-bold block mb-1.5 tracking-wider flex items-center gap-1">
                            <DumbbellIcon className="w-3 h-3" /> Protein (g)
                        </label>
                        <input 
                            type="number" 
                            placeholder="0"
                            className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white text-lg font-bold focus:border-emerald-500 outline-none text-center font-mono" 
                            value={data.protein} 
                            onChange={(e) => setData({...data, protein: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="text-[10px] text-blue-400/80 uppercase font-bold block mb-1.5 tracking-wider flex items-center gap-1">
                            <Flame className="w-3 h-3" /> Calories
                        </label>
                        <input 
                            type="number" 
                            placeholder="0"
                            className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white text-lg font-bold focus:border-blue-500 outline-none text-center font-mono" 
                            value={data.calories} 
                            onChange={(e) => setData({...data, calories: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="text-[10px] text-yellow-400/80 uppercase font-bold block mb-1.5 tracking-wider flex items-center gap-1">
                            <Droplet className="w-3 h-3" /> Fat (g)
                        </label>
                        <input 
                            type="number" 
                            placeholder="0"
                            className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white text-lg font-bold focus:border-yellow-500 outline-none text-center font-mono" 
                            value={data.fat} 
                            onChange={(e) => setData({...data, fat: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="text-[10px] text-orange-400/80 uppercase font-bold block mb-1.5 tracking-wider flex items-center gap-1">
                            <Wheat className="w-3 h-3" /> Carbs (g)
                        </label>
                        <input 
                            type="number" 
                            placeholder="0"
                            className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white text-lg font-bold focus:border-orange-500 outline-none text-center font-mono" 
                            value={data.carbs} 
                            onChange={(e) => setData({...data, carbs: e.target.value})}
                        />
                    </div>
                </div>
            </div>

            <button 
                onClick={handleSubmit}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold shadow-lg shadow-emerald-900/30 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
                <CheckCircle2 className="w-5 h-5" />
                Log Nutrition
            </button>
        </div>
      </div>
    </div>
  );
};

// Helper Icon for Protein since we used Lucide Dumbbell but renamed slightly to avoid conflict if needed, 
// though standard imports work fine. Creating a specific one for clarity.
const DumbbellIcon = (props: any) => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      {...props}
    >
      <path d="m6.5 6.5 11 11" />
      <path d="m21 21-1-1" />
      <path d="m3 3 1 1" />
      <path d="m18 22 4-4" />
      <path d="m2 6 4-4" />
      <path d="m3 10 7-7" />
      <path d="m14 21 7-7" />
    </svg>
)
