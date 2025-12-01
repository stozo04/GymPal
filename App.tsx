
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Dumbbell, 
  Activity, 
  Utensils,
  Save,
  Loader2,
  BarChart3,
  RefreshCw,
  Scale,
  Trophy,
  History,
  Home,
  ChevronRight,
  Settings,
  MoreVertical,
  ChevronDown
} from 'lucide-react';
import confetti from 'canvas-confetti';

import { SAFE_ALTERNATIVES, INITIAL_PLAN, SKILL_TREES, SPEEDIANCE_LIBRARY } from './constants';
import { Plan, DayPlan, NutritionLog, BodyStats, HistoryEntry, NutritionHistoryEntry, UserData, Exercise } from './types';
import { storageService } from './services/storage';
import { StatCard } from './components/StatCard';
import { SkillCard } from './components/SkillCard';
import WorkoutView from './components/WorkoutView';
import { AiCoach } from './components/AiCoach';
import { HistoryView } from './components/HistoryView';
import { CheckInModal } from './components/CheckInModal';
import { FuelModal } from './components/FuelModal';
import { AdminView } from './components/AdminView';

const normalizePlan = (dataPlan: any): Plan => {
  let newPlan = { ...dataPlan };
  ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].forEach(day => {
    if (!newPlan[day]) {
      newPlan[day] = {
        id: day,
        title: `${day.charAt(0).toUpperCase() + day.slice(1)}: Rest / Ad-Hoc`,
        subtitle: "Add exercises here if needed.",
        sections: []
      };
    }
  });
  return newPlan;
};

const getSmartMonday = () => {
  const d = new Date();
  const day = d.getDay(); // 0 is Sunday
  const diff = d.getDate() + (day === 0 ? 1 : (1 - day));
  const monday = new Date(d.setDate(diff));
  monday.setHours(0, 0, 0, 0);
  return monday.toISOString();
};

const generateSeedList = () => {
   const seed = new Set<string>();
   // Add from INITIAL_PLAN
   (Object.values(INITIAL_PLAN) as DayPlan[]).forEach(d => d.sections.forEach(s => s.items.forEach(i => seed.add(i.name))));
   // Add from SAFE_ALTERNATIVES
   Object.keys(SAFE_ALTERNATIVES).forEach(k => {
        seed.add(k);
        SAFE_ALTERNATIVES[k].forEach(v => seed.add(v.name));
   });
   // Add from SPEEDIANCE_LIBRARY
   SPEEDIANCE_LIBRARY.forEach(ex => seed.add(ex));
   return Array.from(seed).sort();
};

export default function App() {
  const [activeTab, setActiveTab] = useState('schedule');
  const [plan, setPlan] = useState<Plan | null>(null);
  const [completedWorkouts, setCompletedWorkouts] = useState<string[]>([]);
  const [intensities, setIntensities] = useState<Record<string, number>>({});
  const [actuals, setActuals] = useState<Record<string, string>>({});
  const [lastWeekActuals, setLastWeekActuals] = useState<Record<string, string>>({});
  const [nutritionLogs, setNutritionLogs] = useState<Record<string, NutritionLog>>({});
  const [bodyStats, setBodyStats] = useState<BodyStats>({ weight: 170, waist: 0, history: [] });
  const [weekCount, setWeekCount] = useState(1);
  const [weekStartDate, setWeekStartDate] = useState<string | null>(null);
  const [masterExerciseList, setMasterExerciseList] = useState<string[]>([]);
  const [exerciseHistory, setExerciseHistory] = useState<Record<string, HistoryEntry[]>>({});
  const [nutritionHistory, setNutritionHistory] = useState<NutritionHistoryEntry[]>([]);
  const [skillLevels, setSkillLevels] = useState<Record<string, number>>({});
  
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [showFuelModal, setShowFuelModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [loading, setLoading] = useState(true);

  // Data Sync
  useEffect(() => {
    const unsubscribe = storageService.subscribe((data) => {
      if (data) {
        setCompletedWorkouts(data.completed || []);
        setIntensities(data.intensities || {});
        setActuals(data.actuals || {});
        setLastWeekActuals(data.lastWeekActuals || {});
        setNutritionLogs(data.nutrition || {});
        setBodyStats(data.bodyStats || { weight: 170, waist: 0, history: [] });
        setWeekCount(data.weekCount || 1);
        setExerciseHistory(data.exerciseHistory || {});
        setNutritionHistory(data.nutritionHistory || []);
        
        // Ensure skill levels are initialized
        const initialSkills: Record<string, number> = {};
        SKILL_TREES.forEach(tree => initialSkills[tree.id] = 1);
        setSkillLevels({ ...initialSkills, ...(data.skillLevels || {}) });

        if (data.weekStartDate) {
          setWeekStartDate(data.weekStartDate);
        } else {
          const newStart = getSmartMonday();
          setWeekStartDate(newStart);
          storageService.saveUserData({ weekStartDate: newStart });
        }
        
        if (data.plan) {
          setPlan(normalizePlan(data.plan));
        } else {
          setPlan(INITIAL_PLAN);
          storageService.saveUserData({ plan: INITIAL_PLAN });
        }

        // Seed Master List if empty
        if (!data.masterExerciseList || data.masterExerciseList.length === 0) {
            const seed = generateSeedList();
            setMasterExerciseList(seed);
            storageService.saveUserData({ masterExerciseList: seed });
        } else {
            setMasterExerciseList(data.masterExerciseList);
        }

      } else {
        // Init new user
        const start = getSmartMonday();
        setWeekStartDate(start);
        setPlan(INITIAL_PLAN);
        const seed = generateSeedList();
        setMasterExerciseList(seed);
        
        const initialSkills: Record<string, number> = {};
        SKILL_TREES.forEach(tree => initialSkills[tree.id] = 1);
        setSkillLevels(initialSkills);

        storageService.saveUserData({ 
            plan: INITIAL_PLAN, 
            weekCount: 1, 
            weekStartDate: start,
            masterExerciseList: seed,
            skillLevels: initialSkills
        });
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const getFormattedDate = (dayName: string) => {
    if (!weekStartDate) return '';
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const index = days.indexOf(dayName.toLowerCase());
    if (index === -1) return '';
    const start = new Date(weekStartDate);
    const target = new Date(start);
    target.setDate(start.getDate() + index);
    return target.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' });
  };

  // Actions
  const toggleComplete = (id: string) => {
    const newCompleted = completedWorkouts.includes(id) 
      ? completedWorkouts.filter(item => item !== id)
      : [...completedWorkouts, id];
    setCompletedWorkouts(newCompleted);
    storageService.saveUserData({ completed: newCompleted });
  };

  const saveIntensity = (id: string, value: number) => {
    const newIntensities = { ...intensities, [id]: value };
    setIntensities(newIntensities);
    storageService.saveUserData({ intensities: newIntensities });
  };

  const saveActual = (id: string, value: string) => {
    const newActuals = { ...actuals, [id]: value };
    setActuals(newActuals);
    storageService.saveUserData({ actuals: newActuals });
  };

  const handleLogFuel = (date: string, data: NutritionLog) => {
    // 1. Check if date corresponds to a day in the current week to update weekly view
    if (weekStartDate) {
       const start = new Date(weekStartDate);
       const entryDate = new Date(date);
       // Reset hours for comparison
       start.setHours(0,0,0,0);
       entryDate.setHours(0,0,0,0);
       
       const diffTime = entryDate.getTime() - start.getTime();
       const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
       
       if (diffDays >= 0 && diffDays <= 6) {
           const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
           const dayKey = days[diffDays];
           const newNutritionLogs = { ...nutritionLogs, [dayKey]: data };
           setNutritionLogs(newNutritionLogs);
           storageService.saveUserData({ nutrition: newNutritionLogs });
       }
    }

    // 2. Always update long-term history
    // Check if entry for this date exists
    const existingIndex = nutritionHistory.findIndex(h => h.date === date);
    let newHistory = [...nutritionHistory];
    
    const entry: NutritionHistoryEntry = {
        date: date,
        protein: parseInt(data.protein || '0') || 0,
        calories: parseInt(data.calories || '0') || 0,
        fat: parseInt(data.fat || '0') || 0,
        carbs: parseInt(data.carbs || '0') || 0
    };

    if (existingIndex >= 0) {
        newHistory[existingIndex] = entry;
    } else {
        newHistory.push(entry);
    }
    
    setNutritionHistory(newHistory);
    storageService.saveUserData({ nutritionHistory: newHistory });
  };

  const saveBodyStats = (dateOverride?: string) => {
    const date = dateOverride || new Date().toISOString().split('T')[0];
    
    // Check if entry for this date already exists to prevent dupes
    const existingIndex = bodyStats.history.findIndex(h => h.date === date);
    let newHistory = [...bodyStats.history];
    
    const entry = {
        date: date,
        weight: bodyStats.weight,
        waist: bodyStats.waist
    };

    if (existingIndex >= 0) {
        newHistory[existingIndex] = entry;
    } else {
        newHistory = [entry, ...newHistory].slice(0, 20); // Keep last 20
    }
    
    const updatedStats = { ...bodyStats, history: newHistory };
    setBodyStats(updatedStats);
    storageService.saveUserData({ bodyStats: updatedStats });
  };

  const addAdHocExercise = (dayKey: string, exerciseData: any) => {
    if (!plan) return;
    const newPlan = JSON.parse(JSON.stringify(plan));
    const day = newPlan[dayKey];
    let adHocSection = day.sections.find((s: any) => s.isAdHoc);
    if (!adHocSection) {
      adHocSection = { title: "Added Exercises", isAdHoc: true, items: [] };
      day.sections.push(adHocSection);
    }
    const newItem = {
      id: `adhoc_${Date.now()}`,
      name: exerciseData.name,
      sets: exerciseData.sets,
      reps: exerciseData.reps,
      type: 'strength',
      val: exerciseData.weight || 0,
      unit: exerciseData.weight ? 'lbs' : '',
      note: "Custom addition",
      desc: "User added exercise."
    };
    adHocSection.items.push(newItem);
    setPlan(newPlan);
    storageService.saveUserData({ plan: newPlan });
  };

  const swapExercise = (dayKey: string, sectionIdx: number, itemIdx: number, targetVariant?: any) => {
    if (!plan) return;
    const item = plan[dayKey].sections[sectionIdx].items[itemIdx];
    
    // If target provided, use it. Otherwise default to first available
    let nextVariant = targetVariant;
    
    if (!nextVariant) {
        let variants = SAFE_ALTERNATIVES[item.name] || [];
        if (variants.length === 0) {
            Object.keys(SAFE_ALTERNATIVES).forEach(key => {
                const found = SAFE_ALTERNATIVES[key].find(v => v.name === item.name);
                if (found) {
                variants = [{ name: key, note: "Original variant", desc: "Standard variation" }, ...SAFE_ALTERNATIVES[key].filter(v => v.name !== item.name)];
                }
            });
        }
        if (variants.length === 0) {
            alert("No alternatives found.");
            return;
        }
        nextVariant = variants[0];
    }

    const newPlan = JSON.parse(JSON.stringify(plan));
    
    // Add new exercise to Master List if missing
    if (!masterExerciseList.includes(nextVariant.name)) {
        const updatedMaster = [...masterExerciseList, nextVariant.name].sort();
        setMasterExerciseList(updatedMaster);
        storageService.saveUserData({ masterExerciseList: updatedMaster });
    }

    const oldItem = newPlan[dayKey].sections[sectionIdx].items[itemIdx];
    newPlan[dayKey].sections[sectionIdx].items[itemIdx] = {
      ...oldItem,
      name: nextVariant.name,
      note: nextVariant.note,
      desc: nextVariant.desc,
      val: 0 // Reset weight
    };

    setPlan(newPlan);
    storageService.saveUserData({ plan: newPlan });
  };

  const calculateProgressionAndRotation = (currentPlan: Plan, intensities: Record<string, number>) => {
    let changes: string[] = [];
    const newPlan = JSON.parse(JSON.stringify(currentPlan));

    Object.keys(newPlan).forEach(dayKey => {
      newPlan[dayKey].sections.forEach((section: any) => {
        section.items.forEach((item: any) => {
          const rpe = intensities[item.id];
          
          if (rpe) {
             // 1. Strength Logic (Double Progression)
             if (item.type === 'strength') {
                 // Convert reps string "10 reps" to number 10
                 const currentReps = parseInt(item.reps) || 0;
                 
                 if (currentReps < 12 && rpe <= 7) {
                     // Phase 1: Build Volume
                     const newReps = currentReps + 2;
                     item.reps = `${newReps} reps`;
                     changes.push(`${item.name}: Reps ${currentReps} -> ${newReps}`);
                 } else if (currentReps >= 12 && rpe <= 7) {
                     // Phase 2: Add Load, Cut Volume
                     item.val += 5; // Add 5lbs
                     item.reps = "8 reps"; // Reset to base volume
                     changes.push(`${item.name}: +5lbs (Reps reset to 8)`);
                 }
             }
             // 2. Bodyweight/Core Logic
             else if (item.type === 'bodyweight' || item.type === 'core') {
                 const currentReps = parseInt(item.reps) || 0;
                 if (currentReps < 20 && rpe <= 6) {
                     item.reps = `${currentReps + 2} reps`;
                     changes.push(`${item.name}: +2 Reps`);
                 }
             }
             // 3. Time Based Logic
             else if ((item.unit === 'sec' || item.unit === 'min') && rpe <= 6) {
                 item.val = Math.ceil(item.val * 1.1); // +10%
                 changes.push(`${item.name}: +10% Time`);
             }
          }
        });
      });
    });

    return { newPlan, changes };
  };

  const generateNextWeek = async () => {
    if (!plan) return;
    const { newPlan, changes } = calculateProgressionAndRotation(plan, intensities);

    let confirmMsg = "Ready for Week " + (weekCount + 1) + "?";
    if (changes.length > 0) {
      confirmMsg += "\n\nAI Adjustments:\n" + changes.map(c => "• " + c).join("\n");
    } else {
      confirmMsg += "\n\nMaintained plan structure.";
    }

    if (!confirm(confirmMsg)) return;
    
    // Save History Logic
    const newHistory = { ...exerciseHistory };
    const newStartDate = getSmartMonday(); 
    
    // 1. Save Exercise History
    Object.keys(plan).forEach(dayKey => {
        const day = plan[dayKey];
        day.sections.forEach(s => {
            s.items.forEach(item => {
                if (actuals[item.id]) {
                    if (!newHistory[item.name]) newHistory[item.name] = [];
                    newHistory[item.name].unshift({
                        date: getFormattedDate(dayKey) || newStartDate,
                        value: actuals[item.id],
                        note: `RPE ${intensities[item.id] || '-'}`
                    });
                }
            });
        });
    });

    // 2. Save Nutrition History
    const newNutriHistory = [...nutritionHistory];
    const currentWeekStart = new Date(weekStartDate || Date.now());
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    days.forEach((day, idx) => {
        const log = nutritionLogs[day];
        if (log && (log.protein || log.calories || log.fat || log.carbs)) {
            const d = new Date(currentWeekStart);
            d.setDate(currentWeekStart.getDate() + idx);
            // Check if already saved today to avoid dupe in same session if multiple generations
            const dateStr = d.toISOString().split('T')[0];
            if (!newNutriHistory.find(n => n.date === dateStr)) {
                 newNutriHistory.push({
                    date: dateStr,
                    protein: parseInt(log.protein || '0') || 0,
                    calories: parseInt(log.calories || '0') || 0,
                    fat: parseInt(log.fat || '0') || 0,
                    carbs: parseInt(log.carbs || '0') || 0
                });
            }
        }
    });

    // 3. Sync Master List with new plan
    const newMasterList = new Set(masterExerciseList);
    (Object.values(newPlan) as DayPlan[]).forEach(day => {
        day.sections.forEach(s => {
            s.items.forEach(i => {
                newMasterList.add(i.name);
            });
        });
    });
    const updatedMaster = Array.from(newMasterList).sort();

    storageService.saveUserData({
        plan: newPlan,
        completed: [],
        intensities: {},
        actuals: {},
        lastWeekActuals: actuals, 
        nutrition: {},
        weekCount: weekCount + 1,
        weekStartDate: newStartDate,
        exerciseHistory: newHistory,
        nutritionHistory: newNutriHistory,
        masterExerciseList: updatedMaster
    });
    
    // Update local state
    setExerciseHistory(newHistory);
    setNutritionHistory(newNutriHistory);
    setMasterExerciseList(updatedMaster);
    
    setActiveTab('schedule');
  };

  const unlockSkill = (treeId: string, level: number) => {
      const newLevels = { ...skillLevels, [treeId]: level + 1 };
      setSkillLevels(newLevels);
      storageService.saveUserData({ skillLevels: newLevels });
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FFD700', '#FFA500', '#ffffff']
      });
  };

  const addMasterExercise = (name: string) => {
      if (masterExerciseList.includes(name)) return;
      const updated = [...masterExerciseList, name].sort();
      setMasterExerciseList(updated);
      storageService.saveUserData({ masterExerciseList: updated });
  };

  const deleteMasterExercise = (name: string) => {
      const updated = masterExerciseList.filter(n => n !== name);
      setMasterExerciseList(updated);
      storageService.saveUserData({ masterExerciseList: updated });
  };

  const handleCompleteRestDay = (dayKey: string) => {
    if (!plan) return;
    const newPlan = JSON.parse(JSON.stringify(plan));
    const day = newPlan[dayKey];
    
    let statusSection = day.sections.find((s: any) => s.title === "Status");
    if (!statusSection) {
        statusSection = { title: "Status", items: [] };
        day.sections.push(statusSection);
    }
    
    // Check if already completed to avoid duplicates
    const existing = statusSection.items.find((i: any) => i.name === "Rest Day / Active Recovery");
    
    if (existing) {
         if (!completedWorkouts.includes(existing.id)) {
             const newCompleted = [...completedWorkouts, existing.id];
             setCompletedWorkouts(newCompleted);
             storageService.saveUserData({ completed: newCompleted });
             confetti({
                particleCount: 200,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#3b82f6', '#10b981', '#f59e0b']
             });
         }
         return;
    }

    const restItem: Exercise = {
        id: `rest_${Date.now()}`,
        name: "Rest Day / Active Recovery",
        sets: "1",
        reps: "1",
        type: 'bodyweight',
        val: 0,
        unit: '',
        note: "Completed",
        desc: "Day marked as complete."
    };

    statusSection.items.push(restItem);
    setPlan(newPlan);
    
    const newCompleted = [...completedWorkouts, restItem.id];
    setCompletedWorkouts(newCompleted);
    
    storageService.saveUserData({ plan: newPlan, completed: newCompleted });
    
    confetti({
        particleCount: 200,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#3b82f6', '#10b981', '#f59e0b']
    });
  };

  if (loading || !plan) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  const activeWorkoutData = plan[activeTab];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-safe">
      
      {/* BACKGROUND AMBIENCE */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-600/5 rounded-full blur-[120px]"></div>
      </div>

      {/* HEADER */}
      <header className="sticky top-0 z-40 pt-safe transition-all duration-300 glass">
        <div className="px-5 py-4 flex items-center justify-between">
          
          <div className="relative">
              <button 
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center gap-3 group focus:outline-none"
              >
                <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2.5 rounded-xl shadow-lg shadow-blue-900/30 group-hover:scale-105 transition-transform">
                    <Dumbbell className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                    <h1 className="text-lg font-extrabold text-white tracking-tight leading-none">GymPal</h1>
                    <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-900/30 px-1.5 py-0.5 rounded border border-emerald-500/20 uppercase tracking-wider">
                            WEEK {weekCount}
                        </span>
                        <ChevronDown className={`w-3 h-3 text-slate-500 transition-transform ${showMenu ? 'rotate-180' : ''}`} />
                    </div>
                </div>
              </button>

              {/* Dropdown Menu */}
              {showMenu && (
                  <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)}></div>
                  <div className="absolute top-full left-0 mt-2 w-48 bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 p-1">
                      <button 
                        onClick={() => { setShowCheckIn(true); setShowMenu(false); }}
                        className="w-full flex items-center gap-3 px-3 py-3 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors text-left"
                      >
                          <Scale className="w-4 h-4 text-purple-400" />
                          Log Body Stats
                      </button>
                      <button 
                        onClick={() => { setActiveTab('admin'); setShowMenu(false); }}
                        className="w-full flex items-center gap-3 px-3 py-3 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors text-left"
                      >
                          <Settings className="w-4 h-4 text-slate-400" />
                          Settings
                      </button>
                  </div>
                  </>
              )}
          </div>

          <div className="flex items-center gap-4">
             {/* Dynamic Header Action based on context could go here */}
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="px-5 py-6 pb-24 relative z-10 max-w-lg mx-auto md:max-w-2xl">
        
        {/* SCHEDULE HOME */}
        {activeTab === 'schedule' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Hero Card: Today */}
                {(() => {
                    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
                    const todayKey = days[new Date().getDay()];
                    const todayPlan = plan[todayKey];
                    const completedCount = todayPlan.sections.flatMap(s => s.items).filter(i => completedWorkouts.includes(i.id)).length;
                    const totalCount = todayPlan.sections.flatMap(s => s.items).length;
                    const progress = totalCount === 0 ? 0 : (completedCount / totalCount) * 100;
                    
                    return (
                        <div 
                            onClick={() => setActiveTab(todayKey)}
                            className="relative overflow-hidden rounded-[2rem] p-6 bg-gradient-to-br from-blue-600 to-indigo-700 shadow-2xl shadow-blue-900/40 cursor-pointer group hover:scale-[1.02] transition-transform duration-300"
                        >
                            <div className="absolute top-0 right-0 p-6 opacity-10">
                                <Activity className="w-32 h-32 text-white transform rotate-12" />
                            </div>
                            
                            <div className="relative z-10">
                                <div className="text-xs font-bold text-blue-200 uppercase tracking-widest mb-1">Today's Focus</div>
                                <h2 className="text-3xl font-black text-white capitalize mb-2">{todayKey}</h2>
                                <p className="text-blue-100 text-sm font-medium line-clamp-2 max-w-[80%] opacity-90">
                                    {todayPlan.subtitle}
                                </p>

                                <div className="mt-6 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="relative w-12 h-12">
                                            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                                                <path className="text-blue-800" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
                                                <path className="text-white drop-shadow-md transition-all duration-1000 ease-out" strokeDasharray={`${progress}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                                            </svg>
                                            <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white">
                                                {Math.round(progress)}%
                                            </div>
                                        </div>
                                        <div className="text-xs font-medium text-blue-200">
                                            {completedCount} / {totalCount} Exercises
                                        </div>
                                    </div>
                                    <div className="bg-white/20 p-2.5 rounded-full text-white backdrop-blur-sm group-hover:bg-white group-hover:text-blue-600 transition-colors">
                                        <ChevronRight className="w-5 h-5" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })()}

                {/* Week Grid */}
                <div>
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 ml-1">This Week</h3>
                    <div className="grid grid-cols-2 gap-3">
                        {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(dayKey => {
                            const dayData = plan[dayKey];
                            const isToday = dayKey === ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][new Date().getDay()];
                            if (isToday) return null; // Skip today as it's shown above

                            const totalItems = dayData.sections.flatMap(s => s.items).length;
                            const completedCount = dayData.sections.flatMap(s => s.items).filter(i => completedWorkouts.includes(i.id)).length;
                            const isEmpty = totalItems === 0;

                            return (
                                <button 
                                    key={dayKey}
                                    onClick={() => setActiveTab(dayKey)}
                                    className={`p-4 rounded-2xl text-left transition-all ${
                                        isEmpty 
                                            ? 'bg-slate-900/40 border border-white/5 opacity-60' 
                                            : 'glass-card hover:bg-white/5 border border-white/5'
                                    }`}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="font-bold text-white capitalize">{dayKey.slice(0,3)}</span>
                                        {!isEmpty && (
                                            <div className={`w-2 h-2 rounded-full ${completedCount === totalItems ? 'bg-emerald-500' : 'bg-slate-700'}`}></div>
                                        )}
                                    </div>
                                    <div className="text-[10px] text-slate-500 font-mono mb-2">{getFormattedDate(dayKey)}</div>
                                    <div className="text-xs text-slate-400 line-clamp-1 opacity-80">
                                        {dayData.title.split(':')[1] || dayData.title}
                                    </div>
                                </button>
                            )
                        })}
                    </div>
                </div>
            
                <button onClick={generateNextWeek} className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2 transition-all">
                    <RefreshCw className="w-5 h-5" />
                    Complete Week & Start Next
                </button>
            </div>
        )}

        {/* WORKOUT VIEW */}
        {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].includes(activeTab) && activeWorkoutData && (
          <WorkoutView 
            dayKey={activeTab}
            dateLabel={getFormattedDate(activeTab) || ''}
            data={activeWorkoutData}
            completed={completedWorkouts}
            intensities={intensities}
            actuals={actuals}
            lastWeekActuals={lastWeekActuals}
            masterExerciseList={masterExerciseList}
            toggle={toggleComplete}
            setIntensity={saveIntensity}
            setActual={saveActual}
            onAddExercise={addAdHocExercise}
            onSwap={(sectionIdx, itemIdx, targetVariant) => swapExercise(activeTab, sectionIdx, itemIdx, targetVariant)}
            onBack={() => setActiveTab('schedule')}
            onCompleteDay={() => handleCompleteRestDay(activeTab)}
          />
        )}

        {/* HISTORY VIEW */}
        {activeTab === 'history' && (
            <HistoryView 
                exerciseHistory={exerciseHistory}
                actuals={actuals}
                // Build a map of item.id -> item.name for the current week to show recent logs
                planItems={(() => {
                    const map: Record<string, string> = {};
                    if (plan) {
                        (Object.values(plan) as DayPlan[]).forEach(d => d.sections.forEach(s => s.items.forEach(i => map[i.id] = i.name)));
                    }
                    return map;
                })()}
                nutritionHistory={nutritionHistory}
                currentNutrition={nutritionLogs}
                weekStartDate={weekStartDate}
                masterExerciseList={masterExerciseList}
                bodyStats={bodyStats}
            />
        )}

        {/* PROGRESS (SKILLS) VIEW */}
        {activeTab === 'progress' && (
             <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 pb-20">
                 <div className="space-y-4">
                    {SKILL_TREES.map(tree => (
                        <SkillCard 
                            key={tree.id} 
                            tree={tree} 
                            currentLevel={skillLevels[tree.id] || 1} 
                            onUnlock={unlockSkill}
                        />
                    ))}
                 </div>
             </div>
        )}

        {/* ADMIN VIEW */}
        {activeTab === 'admin' && (
            <AdminView 
                exerciseList={masterExerciseList} 
                onAdd={addMasterExercise} 
                onDelete={deleteMasterExercise} 
            />
        )}

      </main>

      {/* FIXED BOTTOM NAVIGATION */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-t border-white/5 pb-safe">
         <div className="flex justify-around items-center h-16 max-w-lg mx-auto md:max-w-2xl px-2">
            <button 
                onClick={() => setActiveTab('schedule')} 
                className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${['schedule', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].includes(activeTab) ? 'text-blue-400' : 'text-slate-500 hover:text-slate-300'}`}
            >
                <Home className={`w-5 h-5 ${['schedule', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].includes(activeTab) ? 'fill-current' : ''}`} />
                <span className="text-[10px] font-bold">Home</span>
            </button>

            <button 
                onClick={() => setActiveTab('progress')} 
                className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${activeTab === 'progress' ? 'text-amber-400' : 'text-slate-500 hover:text-slate-300'}`}
            >
                <Trophy className={`w-5 h-5 ${activeTab === 'progress' ? 'fill-current' : ''}`} />
                <span className="text-[10px] font-bold">Skills</span>
            </button>
            
            <div className="w-12"></div> {/* Spacer for AI FAB */}

            <button 
                onClick={() => setActiveTab('history')} 
                className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${activeTab === 'history' ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-300'}`}
            >
                <History className="w-5 h-5" />
                <span className="text-[10px] font-bold">History</span>
            </button>
            
            <button 
                onClick={() => setShowFuelModal(true)} 
                className="flex flex-col items-center justify-center w-full h-full gap-1 transition-colors text-slate-500 hover:text-emerald-400"
            >
                <Utensils className="w-5 h-5" />
                <span className="text-[10px] font-bold">Fuel</span>
            </button>
         </div>
      </nav>

      {/* Floating AI Coach */}
      <AiCoach />

      {/* Check In Modal */}
      {showCheckIn && (
        <CheckInModal 
            bodyStats={bodyStats} 
            onUpdateBodyStats={(s) => setBodyStats(s)}
            onSaveBodyStats={saveBodyStats}
            onClose={() => setShowCheckIn(false)} 
        />
      )}

      {/* Fuel Log Modal */}
      {showFuelModal && (
        <FuelModal 
            onClose={() => setShowFuelModal(false)}
            onSave={handleLogFuel}
        />
      )}

    </div>
  );
}
