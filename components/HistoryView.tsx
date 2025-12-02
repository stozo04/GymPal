import React, { useState, useMemo } from 'react';
import { TrendingUp, Search, ChevronDown, Utensils, Dumbbell, Ruler, LineChart, MessageCircle } from 'lucide-react';
import { BodyStats, HistoryEntry, NutritionHistoryEntry, NutritionLog, WeeklyChat } from '../types';
import { NutritionChart } from './NutritionChart';

interface HistoryViewProps {
  exerciseHistory: Record<string, HistoryEntry[]>;
  actuals: Record<string, string>; // Current week's logs
  planItems: Record<string, string>; // Map id to name for current actuals
  nutritionHistory: NutritionHistoryEntry[];
  currentNutrition: Record<string, NutritionLog>;
  weekStartDate: string | null;
  masterExerciseList: string[];
  bodyStats: BodyStats;
  chatHistory?: WeeklyChat[];
}

export const HistoryView: React.FC<HistoryViewProps> = ({ 
  exerciseHistory, actuals, planItems, nutritionHistory, currentNutrition, weekStartDate, masterExerciseList, bodyStats, chatHistory = []
}) => {
  const [activeTab, setActiveTab] = useState<'strength' | 'nutrition' | 'body' | 'coach'>('strength');
  const [selectedExercise, setSelectedExercise] = useState('');
  const [expandedEx, setExpandedEx] = useState<string | null>(null);
  const [expandedWeek, setExpandedWeek] = useState<number | null>(null);

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

  const strengthEvents = useMemo(() => {
    const events: { name: string; date: string; value: string; isCurrent: boolean }[] = [];
    filteredExercises.forEach(name => {
      getCombinedHistory(name).forEach(entry => {
        events.push({
          name,
          date: entry.date,
          value: entry.value,
          isCurrent: entry.date === 'This Week'
        });
      });
    });

    const toTime = (date: string) => {
      if (date === 'This Week') return Number.MAX_SAFE_INTEGER;
      const t = new Date(date).getTime();
      return isNaN(t) ? -Infinity : t;
    };

    return events.sort((a, b) => toTime(b.date) - toTime(a.date));
  }, [filteredExercises, exerciseHistory, actuals, planItems]);

  const bodyHistory = useMemo(() => {
    return [...(bodyStats.history || [])].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [bodyStats.history]);

  const latestBody = bodyHistory[0];
  const prevBody = bodyHistory[1];
  const delta = (field: 'weight' | 'waist') => {
    if (!latestBody || !prevBody) return null;
    const latest = Number(latestBody[field]) || 0;
    const prev = Number(prevBody[field]) || 0;
    const diff = latest - prev;
    if (diff === 0) return 'no change';
    const dir = diff > 0 ? '+' : '';
    return `${dir}${diff.toFixed(1)}`;
  };


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
             <button 
                onClick={() => setActiveTab('body')}
                className={`flex-1 py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${activeTab === 'body' ? 'bg-slate-700 text-purple-300 shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
             >
                <LineChart className="w-4 h-4" /> Body
             </button>
          <button
            onClick={() => setActiveTab('coach')}
            className={`flex-1 py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${activeTab === 'coach' ? 'bg-slate-700 text-blue-400 shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <MessageCircle className="w-4 h-4" /> Coach
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
            {activeTab === 'strength' && (
                <>
                  {filteredExercises.length === 0 ? (
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
                  )}

                  {strengthEvents.length > 0 && (
                    <div className="bg-slate-900/50 rounded-2xl border border-white/5 p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm font-bold text-slate-300">
                          <LineChart className="w-4 h-4 text-indigo-400" />
                          Full workout log
                        </div>
                        <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">{strengthEvents.length} entries</span>
                      </div>
                      <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                        {strengthEvents.map((evt, i) => (
                          <div key={`${evt.name}-${i}`} className="flex items-center justify-between bg-white/5 rounded-xl px-3 py-2 border border-white/5">
                            <div className="flex flex-col">
                              <span className="text-xs font-bold text-white">{evt.name}</span>
                              <span className="text-[10px] font-mono text-slate-500">{evt.date}</span>
                            </div>
                            <span className={`text-sm font-mono ${evt.isCurrent ? 'text-emerald-400' : 'text-slate-200'}`}>{evt.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
            )}

            {activeTab === 'nutrition' && (
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

            {activeTab === 'body' && (
              <div className="space-y-4 animate-in fade-in slide-in-from-left-2">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-slate-900/60 rounded-2xl border border-white/5 p-4 flex items-center gap-3">
                <img src="/assets/scale_icon.svg" alt="Weight Scale" className="w-5 h-5" />
                    <div>
                      <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Weight</div>
                      <div className="text-xl font-bold text-white">{latestBody?.weight || bodyStats.weight || '-'} lbs</div>
                      {delta('weight') && <div className="text-[10px] text-blue-300">vs last check-in {delta('weight')} lbs</div>}
                    </div>
                  </div>
                  <div className="bg-slate-900/60 rounded-2xl border border-white/5 p-4 flex items-center gap-3">
                    <Ruler className="w-5 h-5 text-purple-300" />
                    <div>
                      <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Waist</div>
                      <div className="text-xl font-bold text-white">{latestBody?.waist || bodyStats.waist || '-'} in</div>
                      {delta('waist') && <div className="text-[10px] text-purple-200">vs last check-in {delta('waist')} in</div>}
                    </div>
                  </div>
                  <div className="bg-slate-900/60 rounded-2xl border border-white/5 p-4 flex flex-col justify-center">
                    <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">Check-ins</div>
                    <div className="text-xl font-bold text-white">{bodyHistory.length}</div>
                    <div className="text-[10px] text-slate-400">Stored entries</div>
                  </div>
                </div>

                <div className="bg-slate-900/50 rounded-2xl border border-white/5 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-300">
                      <LineChart className="w-4 h-4 text-indigo-400" />
                      Weight & waist history
                    </div>
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Newest first</span>
                  </div>
                  {bodyHistory.length === 0 && (
                    <div className="text-center py-10 bg-slate-800/30 rounded-xl border border-slate-700/50 border-dashed text-slate-500 text-sm">
                      No check-ins yet. Log weight/waist to see trends.
                    </div>
                  )}
                  <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                    {bodyHistory.map((entry, idx) => (
                      <div key={entry.date} className="flex items-center justify-between bg-white/5 rounded-xl px-3 py-2 border border-white/5">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">{entry.date}</span>
                          <span className="text-xs text-slate-300">Check-in #{bodyHistory.length - idx}</span>
                        </div>
                        <div className="flex gap-4 text-sm font-mono">
                          <span className="text-blue-300">{entry.weight} lbs</span>
                          <span className="text-purple-200">{entry.waist} in</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

        {activeTab === 'coach' && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-2 max-h-[600px] overflow-y-auto pr-2">
            {chatHistory.length === 0 ? (
              <div className="text-center py-16 bg-slate-900/40 rounded-3xl border border-white/5 border-dashed">
                <MessageCircle className="w-12 h-12 text-blue-400/30 mx-auto mb-4" />
                <div className="text-slate-400">
                  <p className="font-bold mb-1">No coach conversations yet</p>
                  <p className="text-sm">Chat with your AI Coach to see archived conversations here!</p>
                </div>
              </div>
            ) : (
              chatHistory.map((week) => (
                <div key={week.weekNumber} className="bg-slate-900/40 backdrop-blur-md rounded-2xl border border-white/5 overflow-hidden">
                  <div className="px-5 py-4 bg-gradient-to-r from-blue-900/40 to-indigo-900/40 border-b border-white/5">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-bold text-white">Week {week.weekNumber}</h4>
                        <p className="text-[10px] text-slate-400 mt-1">
                          {new Date(week.weekStartDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          {' '}-{' '}
                          {new Date(new Date(week.weekStartDate).getTime() + 6 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                      <span className="text-[10px] font-mono bg-blue-900/50 text-blue-300 px-2.5 py-1.5 rounded border border-blue-500/30 font-bold">
                        {week.messages.length} messages
                      </span>
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    {week.summary ? (
                      <div className="bg-white/5 border border-blue-500/20 rounded-xl p-4">
                        <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-2">Weekly Summary</p>
                        <p className="text-sm text-slate-200 leading-relaxed">{week.summary}</p>
                      </div>
                    ) : (
                      <div className="bg-white/5 border border-slate-500/20 rounded-xl p-4">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">No Summary</p>
                        <p className="text-sm text-slate-400">{week.messages.length} conversation(s) to review</p>
                      </div>
                    )}

                    <div className="space-y-2">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">All Messages</p>
                      <div className="max-h-96 overflow-y-auto pr-2 space-y-2">
                        {week.messages.map((msg, idx) => (
                          <div key={idx} className={`rounded-xl p-3 border ${msg.role === 'user' ? 'bg-blue-900/30 border-blue-500/30' : 'bg-slate-800/30 border-slate-600/30'}`}>
                            <p className="text-[10px] font-bold text-slate-400 mb-1 uppercase">
                              {msg.role === 'user' ? '👤 You' : '🤖 Coach'}
                            </p>
                            <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                            <p className="text-[8px] text-slate-500 mt-2">
                              {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
