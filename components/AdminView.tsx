import React, { useState, useMemo } from 'react';
import { Settings, Plus, Trash2, Search, Database, TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { StatCard } from './StatCard';
import { BodyMetricsChart } from './BodyMetricsChart';

interface AdminViewProps {
  exerciseList: string[];
  exerciseHistory: Record<string, Array<{ date: string, value: string, note: string }>>;
  completedWorkouts: string[];
  intensities: Record<string, number>;
  weekStartDate: string | null;
  bodyStats: { weight: number | string; waist: number | string; history: Array<{ date: string; weight: number | string; waist: number | string }> };
  onAdd: (name: string) => void;
  onDelete: (name: string) => void;
}

export const AdminView: React.FC<AdminViewProps> = ({
  exerciseList,
  exerciseHistory,
  completedWorkouts,
  intensities,
  weekStartDate,
  bodyStats,
  onAdd,
  onDelete
}) => {
  const [newEx, setNewEx] = useState('');
  const [search, setSearch] = useState('');

  // Calculate all-time stats
  const stats = useMemo(() => {
    // All-time consistency: count all completed workouts across all history
    const allWorkouts = Object.values(exerciseHistory).flat().length;

    // All-time RPE: average RPE across all recorded intensities
    const allRPEValues = Object.values(intensities)
      .filter(v => v !== undefined && v > 0) as number[];
    const avgRPE = allRPEValues.length > 0
      ? (allRPEValues.reduce((a, b) => a + b, 0) / allRPEValues.length).toFixed(1)
      : '—';

    // Consistency = unique completed workout days / (number of weeks × days per week with exercises)
    const uniqueCompletedDays = new Set<string>();
    Object.values(exerciseHistory).forEach(historyEntries => {
      historyEntries.forEach(entry => uniqueCompletedDays.add(entry.date));
    });
    const totalUniqueCompletedDays = uniqueCompletedDays.size;

    // Estimate weeks: use oldest and newest dates in exerciseHistory
    let estimatedWeeks = 1;
    if (totalUniqueCompletedDays > 0) {
      const allDates = Object.values(exerciseHistory).flat().map(e => new Date(e.date).getTime());
      if (allDates.length > 0) {
        const minDate = Math.min(...allDates);
        const maxDate = Math.max(...allDates);
        estimatedWeeks = Math.max(1, Math.ceil((maxDate - minDate) / (7 * 24 * 60 * 60 * 1000)) + 1);
      }
    }

    // Assume 6 workout days per week (7 days - 1 rest day)
    const estimatedScheduledDays = estimatedWeeks * 6;
    const consistencyScore = estimatedScheduledDays > 0
      ? Math.round((totalUniqueCompletedDays / estimatedScheduledDays) * 100)
      : 0;

    return {
      allWorkouts: totalUniqueCompletedDays,
      avgRPE,
      consistency: consistencyScore
    };
  }, [exerciseHistory, intensities]);

  const filtered = exerciseList.filter(ex => 
    ex.toLowerCase().includes(search.toLowerCase())
  ).sort();

  const handleAdd = () => {
    if (!newEx.trim()) return;
    onAdd(newEx.trim());
    setNewEx('');
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 pb-20">
      {/* Hero: Performance Dashboard */}
      <div className="glass-card p-8 rounded-3xl border border-white/10 bg-gradient-to-br from-blue-900/20 via-slate-900/40 to-slate-900/20">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">Performance Hub</h1>
            <p className="text-sm text-slate-400 mt-1">Track your all-time progress</p>
          </div>
          <TrendingUp className="w-8 h-8 text-emerald-400 opacity-50" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <StatCard
            label="Consistency"
            value={`${stats.consistency}%`}
            sub={stats.consistency >= 80 ? '🔥 Great all-time!' : 'Keep pushing'}
          />
          <StatCard
            label="Avg RPE"
            value={stats.avgRPE.toString()}
            sub="/ 10"
          />
        </div>
      </div>

      {/* Body Metrics Progression */}
      <div className="glass-card p-6 rounded-3xl border border-white/10 bg-gradient-to-br from-amber-900/10 via-slate-900/40 to-slate-900/20">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-amber-400" />
            Body Metrics Progression
          </h2>
        </div>
        <p className="text-sm text-slate-400 mb-6">Track your weight loss and waist size changes over time with detailed history.</p>
        <BodyMetricsChart
          history={bodyStats.history}
          currentWeight={bodyStats.weight}
          currentWaist={bodyStats.waist}
        />
      </div>

      {/* Exercise Database Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Database className="w-5 h-5 text-blue-400" />
            Exercise Database
          </h2>
          <span className="text-xs px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full">{exerciseList.length} exercises</span>
        </div>
        <p className="text-sm text-slate-400">Manage your global exercise library. These appear in the dropdown when adding workouts.</p>
      </div>

      <div className="bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-3xl overflow-hidden">
        <div className="p-6 border-b border-white/5 bg-white/5">
            <div className="flex gap-2 mb-4">
                <input 
                    type="text" 
                    className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500"
                    placeholder="New Exercise Name..."
                    value={newEx}
                    onChange={(e) => setNewEx(e.target.value)}
                />
                <button 
                    onClick={handleAdd}
                    disabled={!newEx.trim()}
                    className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:bg-slate-700 text-white px-4 rounded-xl font-bold transition-all"
                >
                    <Plus className="w-5 h-5" />
                </button>
            </div>

            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                    type="text" 
                    className="w-full bg-slate-800/50 border border-white/5 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-300 focus:outline-none focus:bg-slate-800 transition-colors"
                    placeholder="Search database..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
        </div>

        <div className="max-h-[50vh] overflow-y-auto p-2">
            {filtered.map(ex => (
                <div key={ex} className="flex justify-between items-center p-3 hover:bg-white/5 rounded-xl group transition-colors">
                    <span className="text-sm text-slate-300 font-medium">{ex}</span>
                    <button 
                        onClick={() => {
                            if(window.confirm(`Delete "${ex}" from database?`)) onDelete(ex);
                        }}
                        className="p-2 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            ))}
            {filtered.length === 0 && (
                <div className="text-center py-8 text-slate-500 text-sm italic">
                    {search ? "No matches found." : "Database is empty."}
                </div>
            )}
        </div>
      </div>
    </div>
  );
};