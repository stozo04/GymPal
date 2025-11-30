import React, { useState, useMemo } from 'react';
import { TrendingUp, Search, ChevronDown, Utensils, Dumbbell } from 'lucide-react';
import { HistoryEntry, NutritionHistoryEntry, NutritionLog } from '../types';
import { NutritionChart } from './NutritionChart';

interface HistoryViewProps {
  exerciseHistory: Record<string, HistoryEntry[]>;
  actuals: Record<string, string>; // Current week's logs
  planItems: Record<string, string>; // Map id to name for current actuals
  nutritionHistory: NutritionHistoryEntry[];
  currentNutrition: Record<string, NutritionLog>;
  weekStartDate: string | null;
  masterExerciseList: string[];
}

export const HistoryView: React.FC<HistoryViewProps> = ({ 
    exerciseHistory, actuals, planItems, nutritionHistory, currentNutrition, weekStartDate, masterExerciseList
}) => {
  const [activeTab, setActiveTab] = useState<'strength' | 'nutrition'>('strength');
  const [selectedExercise, setSelectedExercise] = useState('');
  const [expandedEx, setExpandedEx] = useState<string | null>(null);

  const getCombinedHistory = (name: string): HistoryEntry[] => {
    const historical = exerciseHistory[name] || [];
    const currentLogs: HistoryEntry[] = [];
    Object.entries(planItems).forEach(([id, mapName]) => {
        if (mapName === name && actuals[id]) {
            currentLogs.push({
                date: 'This Week',
                value: actuals[id]
            });
        }
    });
    return [...currentLogs, ...historical]; 
  };

  const allExerciseNames = useMemo(() => {
     // Default to master list to mirror Admin/Add Workout
     return (masterExerciseList || []).sort();
  }, [masterExerciseList]);

  const filteredExercises = allExerciseNames.filter(name => 
    selectedExercise === '' || name === selectedExercise
  );

  const combinedNutrition = useMemo(() => {
     const currentWeekEntries: NutritionHistoryEntry[] = [];
     if (weekStartDate) {
        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        const start = new Date(weekStartDate);
        days.forEach((day, idx) => {
            const log = currentNutrition[day];
            if (log && (log.protein || log.calories)) {
                const d = new Date(start);
                d.setDate(start.getDate() + idx);
                const dateStr = d.toISOString().split('T')[0];
                currentWeekEntries.push({
                    date: dateStr,
                    protein: parseInt(log.protein || '0') || 0,
                    calories: parseInt(log.calories || '0') || 0
                });
            }
        });
     }
     return [...nutritionHistory, ...currentWeekEntries];
  }, [nutritionHistory, currentNutrition, weekStartDate]);


  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 pb-20">
      
      {/* Header Card */}
      <div className="glass-card p-6 rounded-3xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-400" />
              History & Trends
            </h2>
          </div>
          
          {/* Tab Switcher */}
          <div className="flex bg-black/20 p-1 rounded-xl mb-6 border border-white/5">
             <button 
                onClick={() => setActiveTab('strength')}
                className={`flex-1 py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${activeTab === 'strength' ? 'bg-slate-700 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
             >
                <Dumbbell className="w-4 h-4" /> Strength
             </button>
             <button 
                onClick={() => setActiveTab('nutrition')}
                className={`flex-1 py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${activeTab === 'nutrition' ? 'bg-slate-700 text-emerald-400 shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
             >
                <Utensils className="w-4 h-4" /> Fuel
             </button>
          </div>

          {/* Strength Filter */}
          {activeTab === 'strength' && (
            <div className="relative animate-in fade-in slide-in-from-top-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                <select 
                    className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-3 pl-10 pr-10 text-sm text-white focus:outline-none focus:border-indigo-500 appearance-none cursor-pointer"
                    value={selectedExercise}
                    onChange={(e) => {
                        const val = e.target.value;
                        setSelectedExercise(val);
                        setExpandedEx(val || null); 
                    }}
                >
                    <option value="">All Exercises</option>
                    {allExerciseNames.map(name => (
                        <option key={name} value={name}>{name}</option>
                    ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
            </div>
          )}
      </div>

      {/* Content Area */}
      <div className="space-y-3">
            {activeTab === 'strength' ? (
                filteredExercises.length === 0 ? (
                    <div className="text-center py-12 text-slate-500 bg-white/5 rounded-3xl border border-white/5 border-dashed">
                        No history found.
                    </div>
                ) : (
                    filteredExercises.map(name => {
                        const history = getCombinedHistory(name);
                        // Filter out exercises with no history if 'All Exercises' is selected
                        // But if specific exercise is selected, show it even if empty (so user knows no history exists)
                        if (history.length === 0 && selectedExercise === '') return null;
                        
                        const isExpanded = expandedEx === name;
                        const latest = history[0];

                        return (
                            <div key={name} className="bg-slate-900/40 backdrop-blur-md rounded-2xl border border-white/5 overflow-hidden">
                                <button 
                                    onClick={() => setExpandedEx(isExpanded ? null : name)}
                                    className="w-full px-5 py-4 flex justify-between items-center hover:bg-white/5 transition-colors"
                                >
                                    <span className="font-bold text-slate-200 text-left text-sm">{name}</span>
                                    {latest && (
                                        <div className="flex items-center gap-3">
                                            <span className="text-[10px] text-emerald-400 font-mono bg-emerald-900/20 px-2 py-1 rounded border border-emerald-500/20 font-bold">
                                                {latest.value}
                                            </span>
                                            <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                                        </div>
                                    )}
                                    {!latest && <span className="text-xs text-slate-500 italic">No logs yet</span>}
                                </button>
                                
                                {isExpanded && latest && (
                                    <div className="bg-black/20 border-t border-white/5 p-5">
                                        <div className="relative pl-4 space-y-6 before:absolute before:left-[5px] before:top-2 before:bottom-2 before:w-px before:bg-slate-700">
                                            {history.map((entry, i) => (
                                                <div key={i} className="relative animate-in fade-in slide-in-from-left-2" style={{ animationDelay: `${i * 50}ms` }}>
                                                    <div className={`absolute -left-[16px] w-2.5 h-2.5 rounded-full border-2 ${
                                                        i === 0 ? 'bg-emerald-500 border-emerald-500' : 'bg-slate-900 border-slate-600'
                                                    }`}></div>
                                                    <div className="flex justify-between items-baseline">
                                                        <span className={`text-[10px] font-mono font-bold uppercase tracking-wider ${i === 0 ? 'text-emerald-400' : 'text-slate-500'}`}>
                                                            {entry.date}
                                                        </span>
                                                    </div>
                                                    <div className={`text-sm mt-0.5 ${i === 0 ? 'text-white font-bold' : 'text-slate-300'}`}>
                                                        {entry.value}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })
                )
            ) : (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-2">
                    <NutritionChart data={combinedNutrition} />
                    
                    <div className="space-y-2">
                        <h4 className="text-[10px] font-bold text-slate-500 uppercase ml-1 mb-2 tracking-widest">Recent Logs</h4>
                        {combinedNutrition.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((entry, i) => (
                            <div key={i} className="bg-slate-900/40 p-4 rounded-xl border border-white/5 flex justify-between items-center">
                                <span className="text-sm font-mono text-slate-400">{entry.date.slice(5)}</span>
                                <div className="flex gap-6">
                                    <div className="flex flex-col items-end">
                                        <span className="text-[10px] text-slate-500 uppercase font-bold">Cals</span>
                                        <span className="text-sm font-bold text-blue-400">{entry.calories || '-'}</span>
                                    </div>
                                    <div className="flex flex-col items-end w-12">
                                        <span className="text-[10px] text-slate-500 uppercase font-bold">Prot</span>
                                        <span className="text-sm font-bold text-emerald-400">{entry.protein}g</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                         {combinedNutrition.length === 0 && <div className="text-center py-10 bg-slate-800/30 rounded-xl border border-slate-700/50 border-dashed text-slate-500 text-sm">No nutrition logs found yet. Start logging in your daily view!</div>}
                    </div>
                </div>
            )}
      </div>
    </div>
  );
};