
import React, { useState, useMemo } from 'react';
import { 
  CheckCircle2, 
  HelpCircle, 
  ExternalLink, 
  Plus, 
  X, 
  History, 
  Shuffle, 
  ShieldCheck,
  Search,
  ChevronDown,
  ArrowLeft
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { DayPlan, NutritionLog, Exercise } from '../types';
import { SAFE_ALTERNATIVES } from '../constants';
import { Timer } from './Timer';

interface WorkoutViewProps {
  dayKey: string;
  dateLabel: string;
  data: DayPlan;
  completed: string[];
  intensities: Record<string, number>;
  actuals: Record<string, string>;
  lastWeekActuals: Record<string, string>;
  masterExerciseList: string[];
  toggle: (id: string) => void;
  setIntensity: (id: string, val: number) => void;
  setActual: (id: string, val: string) => void;
  onAddExercise: (dayKey: string, ex: any) => void;
  onSwap: (sectionIdx: number, itemIdx: number, targetVariant?: any) => void;
  onBack: () => void;
  onCompleteDay: () => void;
  onSkipDay: () => void;
}

interface SwapConfig {
  sectionIdx: number;
  itemIdx: number;
  currentItem: Exercise;
  variants: any[];
}

export default function WorkoutView({ 
  dayKey, dateLabel, data, completed, intensities, actuals, lastWeekActuals, masterExerciseList,
  toggle, setIntensity, setActual, onAddExercise, onSwap, onBack, onCompleteDay, onSkipDay
}: WorkoutViewProps) {
  const [openInfo, setOpenInfo] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newEx, setNewEx] = useState({ name: '', sets: '3', reps: '10', weight: '' });
  const [backSaverMode, setBackSaverMode] = useState(false);
  const [isCustomInput, setIsCustomInput] = useState(false);
  const [swapConfig, setSwapConfig] = useState<SwapConfig | null>(null);

  // Filter master list based on newEx.name input if needed, or just use it directly
  // Here we just use the master list for the dropdown
  const exerciseOptions = useMemo(() => {
    return (masterExerciseList || []).sort();
  }, [masterExerciseList]);

  const handleSaveAdd = () => {
    if (!newEx.name) return;
    onAddExercise(dayKey, newEx);
    setIsAdding(false);
    setNewEx({ name: '', sets: '3', reps: '10', weight: '' });
    setIsCustomInput(false);
  };

  const getIntensityEmoji = (val: number) => {
    if (!val) return "😶";
    if (val <= 2) return "😃"; if (val <= 4) return "🙂"; if (val <= 6) return "😐"; if (val <= 8) return "😓"; return "🤬";
  };

  const getDisplayItem = (item: Exercise): Exercise => {
    if (!backSaverMode) return item;
    const variants = SAFE_ALTERNATIVES[item.name];
    if (variants && variants.length > 0) {
      return {
        ...item,
        name: variants[0].name + " (Rehab)",
        note: variants[0].note,
        desc: variants[0].desc,
        val: 0,
        unit: item.unit
      };
    }
    return item;
  };

  const handleToggle = (id: string) => {
    const isChecking = !completed.includes(id);
    
    if (isChecking) {
        const allDayItemIds = data.sections.flatMap(s => s.items).map(i => i.id);
        const completedDayItems = completed.filter(c => allDayItemIds.includes(c));
        
        // If we are checking the last one
        if (completedDayItems.length === allDayItemIds.length - 1) {
             confetti({
                particleCount: 200,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#3b82f6', '#10b981', '#f59e0b']
             });
        }
    }
    toggle(id);
  };

  // Helper to resolve all alternatives for an exercise
  const getAlternatives = (itemName: string) => {
     let variants = SAFE_ALTERNATIVES[itemName] || [];
     if (variants.length === 0) {
         Object.keys(SAFE_ALTERNATIVES).forEach(key => {
             const found = SAFE_ALTERNATIVES[key].find(v => v.name === itemName);
             if (found) {
                 variants = [{ name: key, note: "Original variant", desc: "Standard variation" }, ...SAFE_ALTERNATIVES[key].filter(v => v.name !== itemName)];
             }
         });
     }
     return variants;
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 pb-20">
      
      {/* Header with Back Saver */}
      <div className={`relative p-5 rounded-3xl overflow-hidden transition-all duration-500 border border-white/5 ${
        backSaverMode ? 'bg-emerald-900/30' : 'bg-gradient-to-br from-slate-800 to-slate-900'
      }`}>
        {/* Back Button */}
        <button onClick={onBack} className="absolute top-5 right-5 text-slate-400 hover:text-white flex items-center gap-1 text-xs font-bold uppercase tracking-wider bg-white/5 px-3 py-1.5 rounded-full">
            <ArrowLeft className="w-3 h-3" /> Back
        </button>

        <div className="flex flex-wrap items-center gap-3">
            <div>
                <h2 className="text-xl font-extrabold text-white capitalize flex items-center gap-2">
                {data.title.split(':')[0]}
                <span className="text-slate-500 font-medium text-base">({dateLabel})</span>
                </h2>
                <p className="text-slate-400 text-sm mt-1 max-w-[80%]">
                    {backSaverMode ? "Rehab Mode Active: Reduced impact." : data.subtitle}
                </p>
            </div>
            
          <div className="flex items-center gap-2 bg-white/5 rounded-xl px-2 py-1">
            <button
              onClick={() => setBackSaverMode(!backSaverMode)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all text-[11px] font-bold uppercase tracking-wide ${backSaverMode
                ? 'bg-emerald-500/10 border-emerald-400/40 text-emerald-200'
                : 'bg-slate-900/60 border-slate-700 text-slate-200 hover:text-white'
                }`}
            >
              <ShieldCheck className="w-4 h-4" />
              {backSaverMode ? "Back Saver Active" : "Enable Back Saver"}
            </button>
            <button
              onClick={onSkipDay}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-red-500/40 text-red-100 bg-red-900/30 hover:bg-red-900/50 transition-all text-[11px] font-bold uppercase tracking-wide"
            >
              <X className="w-4 h-4" />
              Skip Workout
            </button>
          </div>
        </div>
        </div>

      {data.sections.length === 0 && (
        <div className="text-center py-12 bg-slate-900/30 rounded-3xl border border-slate-800 border-dashed">
          <p className="text-slate-500 mb-6 text-sm">No scheduled exercises.</p>
          <div className="flex flex-col gap-3 px-10 max-w-xs mx-auto">
             <button 
                onClick={onCompleteDay} 
                className="w-full px-5 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2"
             >
                <CheckCircle2 className="w-5 h-5" />
                Mark Day Complete
             </button>
             <button 
                onClick={() => setIsAdding(true)} 
                className="w-full px-5 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2"
             >
                <Plus className="w-5 h-5" />
                Add Exercise
             </button>
          </div>
        </div>
      )}

      {data.sections.map((section, idx) => (
        <div key={idx} className={`rounded-3xl border overflow-hidden transition-all ${
            backSaverMode ? 'bg-emerald-900/5 border-emerald-500/20' : 'bg-slate-900/40 border-slate-800'
        }`}>
          <div className={`px-5 py-3 border-b flex justify-between items-center ${
              backSaverMode ? 'bg-emerald-900/10 border-emerald-500/20' : 'bg-white/5 border-white/5'
          }`}>
            <h3 className="font-bold text-slate-200 text-sm tracking-wide uppercase">{section.title}</h3>
            {section.isAdHoc && <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded uppercase font-bold tracking-wider">Added</span>}
          </div>
          <div className="divide-y divide-white/5">
            {section.items.map((originalItem, itemIdx) => {
              const item = getDisplayItem(originalItem);
              const isDone = completed.includes(item.id);
              const intensity = intensities[item.id] || 0;
              const actualValue = actuals[item.id] || '';
              const lastWeekValue = lastWeekActuals[item.id];
              const variants = getAlternatives(originalItem.name);
              const hasAlternatives = variants.length > 0;
              const isTimeBased = item.unit === 'sec' || item.unit === 'min';
              const timerSeconds = item.unit === 'min' ? item.val * 60 : item.val;

              return (
                <div key={item.id} className={`p-5 transition-all ${isDone ? 'bg-emerald-500/5' : ''}`}>
                  <div className="flex gap-4">
                    <button 
                      onClick={() => handleToggle(item.id)}
                      className={`mt-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                        isDone ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-900/20' : 'border-slate-600 text-transparent hover:border-emerald-400'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </button>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className={`font-bold text-base ${isDone ? 'text-emerald-400/80 line-through' : 'text-slate-100'}`}>
                          {item.name}
                        </h4>
                        <div className="flex items-center gap-2">
                           {lastWeekValue && (
                             <span className="text-[10px] font-mono text-blue-300 flex items-center gap-1 opacity-70">
                               <History className="w-3 h-3" /> {lastWeekValue}
                             </span>
                           )}
                           {hasAlternatives && !isDone && !backSaverMode && (
                             <button 
                                onClick={() => setSwapConfig({
                                    sectionIdx: idx,
                                    itemIdx: itemIdx,
                                    currentItem: originalItem,
                                    variants: variants
                                })} 
                                className="p-1.5 text-slate-500 hover:text-purple-400 bg-slate-800 rounded-lg" 
                                title="Swap Exercise"
                             >
                               <Shuffle className="w-3.5 h-3.5" />
                             </button>
                           )}
                           <button onClick={() => setOpenInfo(item.id === openInfo ? null : item.id)} className="p-1.5 text-slate-500 hover:text-blue-400 bg-slate-800 rounded-lg">
                             <HelpCircle className="w-3.5 h-3.5" />
                           </button>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 text-xs font-mono mb-3">
                        <span className="px-2 py-0.5 bg-slate-800/80 rounded text-slate-400">{item.sets} {isNaN(Number(item.sets))?'':'sets'}</span>
                        <span className="px-2 py-0.5 bg-blue-500/10 rounded text-blue-300 font-bold border border-blue-500/20">{item.reps}</span>
                        {item.val > 0 && <span className="px-2 py-0.5 bg-emerald-500/10 rounded text-emerald-400 font-bold border border-emerald-500/20">{item.val} {item.unit}</span>}
                      </div>
                      
                      {isTimeBased && !isDone && timerSeconds > 0 && (
                        <div className="mb-3">
                          <Timer initialSeconds={timerSeconds} label={item.name} />
                        </div>
                      )}

                      <p className={`text-sm ${isDone ? 'text-slate-600' : 'text-slate-400'}`}>{item.note}</p>

                      {openInfo === item.id && (
                        <div className="mt-3 p-3 bg-slate-950/50 rounded-xl border border-white/5 text-sm">
                          <p className="text-slate-300 mb-2">{item.desc}</p>
                          <a href={`https://www.youtube.com/results?search_query=${encodeURIComponent(item.name + " exercise form")}`} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-blue-400 flex items-center gap-1 hover:underline"><ExternalLink className="w-3 h-3"/> Watch Tutorial</a>
                        </div>
                      )}

                      {isDone && (
                        <div className="mt-4 pt-3 border-t border-white/5 space-y-3">
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">RPE (Rate of Effort)</span>
                              <span className="text-lg leading-none">{getIntensityEmoji(intensity)}</span>
                            </div>
                            <div className="grid grid-cols-5 gap-2">
                              {[1, 3, 5, 7, 10].map(rpe => (
                                <button
                                  key={rpe}
                                  onClick={() => setIntensity(item.id, rpe)}
                                  className={`py-3 rounded-lg text-sm font-bold transition-all ${intensity === rpe
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/50 scale-105'
                                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 active:scale-95'
                                    }`}
                                >
                                  {rpe}
                                </button>
                              ))}
                            </div>
                            <div className="text-[10px] text-slate-400 mt-1.5">
                              {intensity === 1 && "Easy - could do much more"}
                              {intensity === 3 && "Light - some effort"}
                              {intensity === 5 && "Moderate - moderate effort"}
                              {intensity === 7 && "Hard - challenging"}
                              {intensity === 10 && "Max effort - all out"}
                            </div>
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1.5 tracking-wider">Log Result</span>
                            <input type="text" placeholder={`${item.sets} x ${item.reps}`} className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-colors" value={actualValue} onChange={(e) => setActual(item.id, e.target.value)} />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Add Exercise Button */}
      {data.sections.length > 0 && !isAdding && (
        <button 
          onClick={() => setIsAdding(true)}
          className="w-full py-4 border border-dashed border-slate-700 rounded-2xl text-slate-500 font-bold hover:border-blue-500 hover:text-blue-400 hover:bg-blue-500/5 transition-all flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Exercise
        </button>
      )}

      {/* Swap Modal */}
      {swapConfig && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
             <div className="w-full max-w-sm bg-slate-900/90 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-5 border-b border-white/5 flex justify-between items-center">
                    <h3 className="font-bold text-white">Select Alternative</h3>
                    <button onClick={() => setSwapConfig(null)} className="p-2 bg-white/5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white"><X className="w-4 h-4" /></button>
                </div>
                <div className="p-2 max-h-[60vh] overflow-y-auto">
                    {/* Current Exercise (for context) */}
                    <div className="p-3 mb-2 opacity-50">
                        <div className="text-[10px] uppercase font-bold text-slate-500 mb-1">Current</div>
                        <div className="font-bold text-slate-300">{swapConfig.currentItem.name}</div>
                    </div>
                    
                    {swapConfig.variants.map((variant, i) => (
                        <button 
                            key={i}
                            onClick={() => {
                                onSwap(swapConfig.sectionIdx, swapConfig.itemIdx, variant);
                                setSwapConfig(null);
                            }}
                            className="w-full text-left p-4 rounded-xl hover:bg-blue-600/20 border border-transparent hover:border-blue-500/50 transition-all group mb-2"
                        >
                            <div className="flex justify-between items-center mb-1">
                                <span className="font-bold text-white group-hover:text-blue-300">{variant.name}</span>
                                <ChevronDown className="w-4 h-4 -rotate-90 text-slate-500 group-hover:text-blue-400" />
                            </div>
                            <p className="text-xs text-slate-400 group-hover:text-blue-200/70">{variant.note}</p>
                        </button>
                    ))}
                </div>
             </div>
        </div>
      )}

      {/* Add Exercise Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-slate-900/90 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200 p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-white text-lg">Add Movement</h3>
                <button onClick={() => { setIsAdding(false); setIsCustomInput(false); }} className="p-2 bg-white/5 rounded-full hover:bg-white/10"><X className="w-5 h-5 text-slate-300"/></button>
            </div>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-slate-400 uppercase font-bold block mb-2">Exercise Name</label>
              {!isCustomInput ? (
                  <div className="relative">
                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                     <select 
                        className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-10 text-sm text-white focus:outline-none focus:border-blue-500 appearance-none cursor-pointer"
                        value={newEx.name}
                        onChange={(e) => {
                            if (e.target.value === 'CUSTOM_ENTRY') {
                                setIsCustomInput(true);
                                setNewEx({...newEx, name: ''});
                            } else {
                                setNewEx({...newEx, name: e.target.value});
                            }
                        }}
                     >
                        <option value="" disabled>Select Exercise...</option>
                        {exerciseOptions.map(ex => (
                            <option key={ex} value={ex}>{ex}</option>
                        ))}
                        <option value="CUSTOM_ENTRY" className="font-bold text-blue-400">+ Type Custom Name</option>
                     </select>
                     <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                  </div>
              ) : (
                  <div className="flex gap-2">
                     <input 
                        type="text" 
                        className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-blue-500 outline-none text-sm" 
                        placeholder="e.g. Zumba Class"
                        value={newEx.name}
                        autoFocus
                        onChange={e => setNewEx({...newEx, name: e.target.value})}
                     />
                     <button onClick={() => setIsCustomInput(false)} className="text-xs text-slate-400 hover:text-white underline whitespace-nowrap px-2">
                        Back to List
                     </button>
                  </div>
              )}
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-slate-400 uppercase font-bold block mb-2">Sets</label>
                <input type="text" className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white text-center" value={newEx.sets} onChange={e => setNewEx({...newEx, sets: e.target.value})} />
              </div>
              <div>
                <label className="text-xs text-slate-400 uppercase font-bold block mb-2">Reps</label>
                <input type="text" className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white text-center" value={newEx.reps} onChange={e => setNewEx({...newEx, reps: e.target.value})} />
              </div>
              <div>
                <label className="text-xs text-slate-400 uppercase font-bold block mb-2">Lbs</label>
                <input type="text" className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white text-center" value={newEx.weight} onChange={e => setNewEx({...newEx, weight: e.target.value})} />
              </div>
            </div>
            <button 
              onClick={handleSaveAdd}
              disabled={!newEx.name}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-bold mt-2 shadow-lg shadow-blue-900/20 active:scale-95 transition-all"
            >
              Confirm Addition
            </button>
          </div>
          </div>
        </div>
      )}
    </div>
  );
}
