import React, { useState, useEffect, useMemo } from 'react';
import { 
  Dumbbell, 
  Activity, 
  PlayCircle, 
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
  Settings
} from 'lucide-react';
import confetti from 'canvas-confetti';

import { SAFE_ALTERNATIVES, INITIAL_PLAN, SKILL_TREES, SPEEDIANCE_LIBRARY } from './constants';
import { Plan, NutritionLog, BodyStats, HistoryEntry, NutritionHistoryEntry } from './types';
import { storageService } from './services/storage';
import { StatCard, StatRow } from './components/StatCard';
import { SkillCard } from './components/SkillCard';
import WorkoutView from './components/WorkoutView';
import { AiCoach } from './components/AiCoach';
import { HistoryView } from './components/HistoryView';
import { CheckInModal } from './components/CheckInModal';
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
   Object.values(INITIAL_PLAN).forEach(d => d.sections.forEach(s => s.items.forEach(i => seed.add(i.name))));
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
  const [skillLevels, setSkillLevels] = useState<Record<string, number>>({ 
    pull_mastery: 1, 
    flexibility_mastery: 1, 
    core_mastery: 1,
    handstand_mastery: 1
  });
  const [weekCount, setWeekCount] = useState(1);
  const [weekStartDate, setWeekStartDate] = useState<string | null>(null); 
  const [exerciseHistory, setExerciseHistory] = useState<Record<string, HistoryEntry[]>>({});
  const [nutritionHistory, setNutritionHistory] = useState<NutritionHistoryEntry[]>([]);
  const [masterExerciseList, setMasterExerciseList] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

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
        
        // Initialize skill levels, adding default if missing
        const defaultSkills = { pull_mastery: 1, flexibility_mastery: 1, core_mastery: 1, handstand_mastery: 1 };
        setSkillLevels({ ...defaultSkills, ...(data.skillLevels || {}) });
        
        setWeekCount(data.weekCount || 1);
        setExerciseHistory(data.exerciseHistory || {});
        setNutritionHistory(data.nutritionHistory || []);

        // Master List Seeding - Force seed if empty
        let currentMasterList = data.masterExerciseList || [];
        if (currentMasterList.length === 0) {
           const seedList = generateSeedList();
           // Add from History if exists
           if (data.exerciseHistory) {
               Object.keys(data.exerciseHistory).forEach(k => {
                   if (!seedList.includes(k)) seedList.push(k);
               });
           }
           seedList.sort();
           currentMasterList = seedList;
           storageService.saveUserData({ masterExerciseList: seedList });
        }
        setMasterExerciseList(currentMasterList);
        
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
      } else {
        // Initialize new user
        const start = getSmartMonday();
        const seedList = generateSeedList();
        
        setWeekStartDate(start);
        setPlan(INITIAL_PLAN);
        setMasterExerciseList(seedList);

        storageService.saveUserData({ 
          plan: INITIAL_PLAN, 
          weekCount: 1, 
          weekStartDate: start,
          bodyStats: { weight: 170, waist: 0, history: [] },
          skillLevels: { pull_mastery: 1, flexibility_mastery: 1, core_mastery: 1, handstand_mastery: 1 },
          exerciseHistory: {},
          nutritionHistory: [],
          masterExerciseList: seedList
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

  const planItemsMap = useMemo(() => {
    if (!plan) return {};
    const map: Record<string, string> = {};
    Object.values(plan).forEach(day => {
        day.sections.forEach(sec => {
            sec.items.forEach(item => {
                map[item.id] = item.name;
            });
        });
    });
    return map;
  }, [plan]);

  const toggleComplete = (id: string) => {
    setIsSaving(true);
    let newCompleted = completedWorkouts.includes(id) 
      ? completedWorkouts.filter(item => item !== id)
      : [...completedWorkouts, id];
    setCompletedWorkouts(newCompleted);
    storageService.saveUserData({ completed: newCompleted });
    setTimeout(() => setIsSaving(false), 500);
  };

  const saveIntensity = (id: string, value: number) => {
    setIsSaving(true);
    const newIntensities = { ...intensities, [id]: value };
    setIntensities(newIntensities);
    storageService.saveUserData({ intensities: newIntensities });
    setTimeout(() => setIsSaving(false), 500);
  };

  const saveActual = (id: string, value: string) => {
    setIsSaving(true);
    const newActuals = { ...actuals, [id]: value };
    setActuals(newActuals);
    storageService.saveUserData({ actuals: newActuals });
    setTimeout(() => setIsSaving(false), 500);
  };

  const saveNutrition = (dayKey: string, field: string, value: string) => {
    setIsSaving(true);
    const dayLog = nutritionLogs[dayKey] || {};
    const newDayLog = { ...dayLog, [field]: value };
    const newNutritionLogs = { ...nutritionLogs, [dayKey]: newDayLog };
    setNutritionLogs(newNutritionLogs);
    storageService.saveUserData({ nutrition: newNutritionLogs });
    setTimeout(() => setIsSaving(false), 500);
  };

  const saveBodyStats = (dateOverride?: string) => {
    setIsSaving(true);
    const dateToUse = (typeof dateOverride === 'string' && dateOverride) 
        ? dateOverride 
        : new Date().toISOString().split('T')[0];

    const newEntry = {
      date: dateToUse,
      weight: bodyStats.weight,
      waist: bodyStats.waist
    };

    let newHistory = [...(bodyStats.history || [])];
    const existingIndex = newHistory.findIndex(h => h.date === dateToUse);
    
    if (existingIndex >= 0) {
        newHistory[existingIndex] = newEntry;
    } else {
        newHistory = [newEntry, ...newHistory].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }

    const updatedStats = {
      ...bodyStats,
      history: newHistory.slice(0, 10) 
    };
    
    setBodyStats(updatedStats);
    storageService.saveUserData({ bodyStats: updatedStats });
    setTimeout(() => setIsSaving(false), 500);
  };

  const unlockSkill = (treeId: string, level: number) => {
    setIsSaving(true);
    const newLevels = { ...skillLevels, [treeId]: level };
    setSkillLevels(newLevels);
    storageService.saveUserData({ skillLevels: newLevels });
    setTimeout(() => setIsSaving(false), 500);
    
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#f59e0b', '#fbbf24', '#ffffff'] // Gold theme
    });
  };

  const addMasterExercise = (name: string) => {
    if (masterExerciseList.includes(name)) return;
    setIsSaving(true);
    const newList = [...masterExerciseList, name].sort();
    setMasterExerciseList(newList);
    storageService.saveUserData({ masterExerciseList: newList });
    setTimeout(() => setIsSaving(false), 500);
  };

  const deleteMasterExercise = (name: string) => {
    setIsSaving(true);
    const newList = masterExerciseList.filter(ex => ex !== name);
    setMasterExerciseList(newList);
    storageService.saveUserData({ masterExerciseList: newList });
    setTimeout(() => setIsSaving(false), 500);
  };

  const addAdHocExercise = (dayKey: string, exerciseData: any) => {
    if (!plan) return;
    setIsSaving(true);
    const newPlan: Plan = JSON.parse(JSON.stringify(plan));
    const day = newPlan[dayKey];
    let adHocSection = day.sections.find(s => s.isAdHoc);
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
    // @ts-ignore
    adHocSection.items.push(newItem);
    setPlan(newPlan);
    storageService.saveUserData({ plan: newPlan });
    setTimeout(() => setIsSaving(false), 500);

    if (!masterExerciseList.includes(exerciseData.name)) {
        addMasterExercise(exerciseData.name);
    }
  };

  const swapExercise = (dayKey: string, sectionIdx: number, itemIdx: number, targetVariant?: any) => {
    if (!plan) return;
    const item = plan[dayKey].sections[sectionIdx].items[itemIdx];
    let nextVariant = targetVariant;

    // If no specific variant passed, try to auto-find one (legacy behavior)
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
            alert("No safe alternatives found for this exercise.");
            return;
        }
        
        // Auto-select first if not provided
        nextVariant = variants[0];
        if (!window.confirm(`Swap "${item.name}" for "${nextVariant.name}"?`)) return;
    }

    setIsSaving(true);
    const newPlan: Plan = JSON.parse(JSON.stringify(plan));
    
    const oldItem = newPlan[dayKey].sections[sectionIdx].items[itemIdx];
    newPlan[dayKey].sections[sectionIdx].items[itemIdx] = {
      ...oldItem,
      name: nextVariant.name,
      note: nextVariant.note,
      desc: nextVariant.desc,
      val: 0 
    };

    setPlan(newPlan);
    storageService.saveUserData({ plan: newPlan });
    
    // Ensure new swapped exercise is in the master list
    if (!masterExerciseList.includes(nextVariant.name)) {
        addMasterExercise(nextVariant.name);
    }
    
    setTimeout(() => setIsSaving(false), 500);
  };

  const calculateProgressionAndRotation = (currentPlan: Plan, intensities: Record<string, number>) => {
    let changes: string[] = [];
    const newPlan: Plan = JSON.parse(JSON.stringify(currentPlan)); 

    Object.keys(newPlan).forEach(dayKey => {
      newPlan[dayKey].sections.forEach(section => {
        section.items.forEach((item, idx, arr) => {
          const rpe = intensities[item.id];
          
          // 1. ROTATION LOGIC (20% Chance, only if easy/moderate)
          const roll = Math.random();
          let didSwap = false;
          
          if (roll < 0.20 && (!rpe || rpe < 7) && item.type === 'strength') {
             let variants = SAFE_ALTERNATIVES[item.name] || [];
             if (variants.length > 0) {
               const nextVariant = variants[Math.floor(Math.random() * variants.length)];
               const oldName = item.name;
               item.name = nextVariant.name;
               item.note = nextVariant.note;
               item.desc = nextVariant.desc;
               item.val = 0; // Reset weight on new exercise
               if (item.unit === 'sec') item.reps = "30s";
               else item.reps = "10 reps";
               
               changes.push(`Rotated: ${oldName} -> ${item.name}`);
               didSwap = true;
             }
          }

          // 2. PROGRESSION LOGIC (Double Progression & Volume Accumulation)
          if (!didSwap && rpe && rpe <= 7) {
            
            // A. TIMED EXERCISES (Core Holds, Cardio)
            if (item.unit === 'sec' || item.unit === 'min') {
                 // Add 10-15% duration
                 const currentVal = item.val;
                 const nextVal = Math.round(currentVal * 1.15);
                 item.val = nextVal;
                 item.reps = `${nextVal} ${item.unit}`;
                 changes.push(`${item.name}: +Duration (${currentVal} -> ${nextVal}${item.unit})`);
            }
            
            // B. BODYWEIGHT / CORE (Volume Accumulation)
            // Goal: Build reps up to ~20 before adding external weight/vest
            else if (item.type === 'bodyweight' || item.type === 'core' || (item.type === 'strength' && item.val === 0)) {
                 const currentReps = parseInt(item.reps.replace(/[^0-9]/g, '')) || 10;
                 
                 if (currentReps < 20) {
                     // Add 1-2 reps
                     const nextReps = currentReps + 2;
                     item.reps = `${nextReps} reps`;
                     changes.push(`${item.name}: +2 Reps (Endurance)`);
                 } else {
                     // Graduation: Add Weight, Reset Reps
                     item.val = 5; 
                     item.unit = 'lbs';
                     item.reps = '10 reps'; 
                     changes.push(`${item.name}: Graduated to Weighted (Start at 5lbs)`);
                 }
            }
            
            // C. WEIGHTED STRENGTH (Double Progression Model)
            // Goal: Build Reps to 12 -> Increase Weight -> Drop Reps to 8
            else if (item.type === 'strength' && item.unit === 'lbs' && item.val > 0) {
                 const currentReps = parseInt(item.reps.replace(/[^0-9]/g, '')) || 8;
                 
                 if (currentReps < 12) {
                     // Step 1: Build Reps
                     const nextReps = currentReps + 1;
                     item.reps = `${nextReps} reps`;
                     changes.push(`${item.name}: +1 Rep (Building Volume)`);
                 } else {
                     // Step 2: Increase Load, Drop Volume
                     item.val += 5; // Standard 5lb jump
                     item.reps = "8 reps"; // Reset to lower end of hypertrophy range
                     changes.push(`${item.name}: +5lbs (Reset to 8 reps)`);
                 }
            }
          }
        });
      });
    });
    return { newPlan, changes };
  };

  const generateNextWeek = async () => {
    if(!plan) return;
    const { newPlan, changes } = calculateProgressionAndRotation(plan, intensities);

    let confirmMsg = "Ready for Week " + (weekCount + 1) + "?";
    if (changes.length > 0) {
      confirmMsg += "\n\nAuto Adjustments:\n" + changes.map(c => "• " + c).join("\n");
    } else {
      confirmMsg += "\n\nMaintained plan structure.";
    }

    if (!window.confirm(confirmMsg)) return;
    
    setIsSaving(true);
    const newStartDate = getSmartMonday(); 
    const dateStr = new Date().toISOString().split('T')[0];
    
    const updatedHistory = { ...exerciseHistory };
    Object.keys(actuals).forEach(id => {
       const logValue = actuals[id];
       if (logValue) {
          const exName = planItemsMap[id];
          if (exName) {
             if (!updatedHistory[exName]) updatedHistory[exName] = [];
             updatedHistory[exName].push({ date: dateStr, value: logValue });
          }
       }
    });
    setExerciseHistory(updatedHistory);

    const updatedNutritionHistory = [...nutritionHistory];
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    if (weekStartDate) {
        const start = new Date(weekStartDate);
        days.forEach((day, idx) => {
            const log = nutritionLogs[day];
            if (log && (log.protein || log.calories)) {
                const d = new Date(start);
                d.setDate(start.getDate() + idx);
                const actualDate = d.toISOString().split('T')[0];
                
                updatedNutritionHistory.push({
                    date: actualDate,
                    protein: parseInt(log.protein || '0') || 0,
                    calories: parseInt(log.calories || '0') || 0
                });
            }
        });
    }
    setNutritionHistory(updatedNutritionHistory);

    const newMasterList = new Set(masterExerciseList);
    Object.values(newPlan).forEach(day => {
        day.sections.forEach(s => {
            s.items.forEach(i => {
                newMasterList.add(i.name);
            });
        });
    });
    const updatedMasterList = Array.from(newMasterList).sort();
    setMasterExerciseList(updatedMasterList);

    storageService.saveUserData({
        plan: newPlan,
        completed: [],
        intensities: {},
        actuals: {},
        lastWeekActuals: actuals, 
        nutrition: {},
        weekCount: weekCount + 1,
        weekStartDate: newStartDate,
        exerciseHistory: updatedHistory,
        nutritionHistory: updatedNutritionHistory,
        masterExerciseList: updatedMasterList
    });
    setActiveTab('schedule');
    setIsSaving(false);
  };

  const todayKey = useMemo(() => {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return days[new Date().getDay()];
  }, []);

  if (loading || !plan) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  const activeWorkoutData = plan[activeTab];
  const activeNutritionData = nutritionLogs[activeTab] || {};

  const isDayView = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].includes(activeTab);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-32">
        <div className="fixed inset-0 pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-blue-900/10 to-transparent"></div>
            <div className="absolute top-[-100px] right-[-100px] w-[300px] h-[300px] bg-blue-600/20 rounded-full blur-[100px]"></div>
            <div className="absolute bottom-[-100px] left-[-100px] w-[300px] h-[300px] bg-emerald-600/10 rounded-full blur-[100px]"></div>
        </div>

      <header className={`sticky top-0 z-30 transition-all duration-300 ${isDayView ? 'bg-slate-950/80 backdrop-blur-md' : 'bg-transparent pt-4'}`}>
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          {!isDayView ? (
            <div className="flex items-center gap-3 relative">
                <button 
                    onClick={() => setShowMenu(!showMenu)}
                    className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2.5 rounded-xl shadow-lg shadow-blue-900/20 hover:scale-105 transition-transform active:scale-95 z-50 relative"
                >
                    <Dumbbell className="w-5 h-5 text-white" />
                </button>
                
                <div>
                    <h1 className="text-lg font-bold text-white leading-none">GymPal</h1>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-900/20 px-1.5 py-0.5 rounded border border-emerald-900/50">WEEK {weekCount}</span>
                        {isSaving && <span className="text-[10px] text-blue-400 animate-pulse flex items-center gap-1 ml-1"><Save className="w-3 h-3" /></span>}
                    </div>
                </div>

                {showMenu && (
                    <>
                        <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)}></div>
                        <div className="absolute top-14 left-0 w-52 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 p-1">
                            <button 
                                onClick={() => { setShowCheckIn(true); setShowMenu(false); }}
                                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-200 hover:bg-white/10 rounded-xl transition-colors text-left"
                            >
                                <Scale className="w-4 h-4 text-purple-400" />
                                <span>Log Body Stats</span>
                            </button>
                            <button 
                                onClick={() => { setActiveTab('admin'); setShowMenu(false); }}
                                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-200 hover:bg-white/10 rounded-xl transition-colors text-left"
                            >
                                <Settings className="w-4 h-4 text-slate-400" />
                                <span>Settings</span>
                            </button>
                        </div>
                    </>
                )}
            </div>
          ) : (
            <div className="flex items-center gap-2 w-full">
                <button onClick={() => setActiveTab('schedule')} className="p-2 -ml-2 text-slate-400 hover:text-white">
                    <ChevronRight className="w-5 h-5 rotate-180" />
                </button>
                <h1 className="text-lg font-bold text-white capitalize">{activeTab}</h1>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-2 relative z-10">
        {activeTab === 'schedule' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
             
             {plan[todayKey] && (
                <div 
                    onClick={() => setActiveTab(todayKey)}
                    className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 shadow-2xl shadow-blue-900/30 border border-white/10 group cursor-pointer transition-transform hover:scale-[1.02]"
                >
                    <div className="absolute top-0 right-0 p-6 opacity-20 pointer-events-none">
                        <Activity className="w-32 h-32 text-white transform rotate-12 translate-x-10 -translate-y-10" />
                    </div>
                    
                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h2 className="text-xs font-bold text-blue-200 uppercase tracking-wider mb-1">Today's Focus</h2>
                                <h3 className="text-2xl font-extrabold text-white capitalize">{todayKey}</h3>
                            </div>
                            <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
                                <PlayCircle className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        
                        <p className="text-blue-100 text-sm mb-6 line-clamp-2 pr-12">
                            {plan[todayKey].subtitle}
                        </p>

                        <div className="flex gap-2">
                             {plan[todayKey].sections.flatMap(s => s.items).slice(0, 3).map((ex, i) => (
                                 <div key={i} className="text-[10px] bg-black/20 backdrop-blur-md text-white px-2 py-1 rounded-md border border-white/10 truncate max-w-[80px]">
                                     {ex.name}
                                 </div>
                             ))}
                             {plan[todayKey].sections.flatMap(s => s.items).length > 3 && (
                                 <div className="text-[10px] bg-white/20 text-white px-2 py-1 rounded-md">
                                     +{plan[todayKey].sections.flatMap(s => s.items).length - 3}
                                 </div>
                             )}
                        </div>
                    </div>
                </div>
             )}

             <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase mb-3 ml-1">This Week</h4>
                <div className="grid grid-cols-2 gap-3">
                    {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
                        .filter(d => d !== todayKey)
                        .map(dayKey => {
                        const dayData = plan[dayKey];
                        const totalItems = dayData.sections.flatMap(s => s.items).length;
                        const completedCount = dayData.sections.flatMap(s => s.items).filter(i => completedWorkouts.includes(i.id)).length;
                        const progress = totalItems > 0 ? (completedCount / totalItems) * 100 : 0;
                        const isRest = totalItems === 0;

                        return (
                            <div 
                                key={dayKey}
                                onClick={() => setActiveTab(dayKey)}
                                className={`p-4 rounded-2xl glass-card cursor-pointer transition-all hover:bg-slate-800/60 group relative overflow-hidden`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-sm font-bold text-slate-200 capitalize">{dayKey.slice(0,3)}</span>
                                    {!isRest && (
                                        <div className="relative w-5 h-5">
                                            <svg className="w-full h-full" viewBox="0 0 36 36">
                                                <path
                                                    className="text-slate-700"
                                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                />
                                                <path
                                                    className={`${progress === 100 ? 'text-emerald-500' : 'text-blue-500'} transition-all duration-500`}
                                                    strokeDasharray={`${progress}, 100`}
                                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                />
                                            </svg>
                                        </div>
                                    )}
                                    {isRest && <div className="w-1.5 h-1.5 rounded-full bg-slate-700"></div>}
                                </div>
                                <div className="text-[10px] text-slate-500 line-clamp-1">{getFormattedDate(dayKey)}</div>
                                <div className="text-[10px] text-slate-400 mt-1 line-clamp-1 truncate">
                                    {isRest ? 'Rest Day' : dayData.subtitle}
                                </div>
                            </div>
                        );
                    })}
                </div>
             </div>
          </div>
        )}

        {isDayView && activeWorkoutData && (
          <WorkoutView 
            dayKey={activeTab}
            dateLabel={getFormattedDate(activeTab)}
            data={activeWorkoutData}
            nutrition={activeNutritionData}
            completed={completedWorkouts}
            intensities={intensities}
            actuals={actuals}
            lastWeekActuals={lastWeekActuals}
            masterExerciseList={masterExerciseList}
            toggle={toggleComplete}
            setIntensity={saveIntensity}
            setActual={saveActual}
            onAddExercise={addAdHocExercise}
            onSwap={(sIdx, iIdx, targetVariant) => swapExercise(activeTab, sIdx, iIdx, targetVariant)}
            onSaveNutrition={(field, val) => saveNutrition(activeTab, field, val)}
            // @ts-ignore
            onBack={() => setActiveTab('schedule')}
          />
        )}

        {activeTab === 'recap' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
            <div className="glass-card p-6 rounded-3xl">
              <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-400" />
                Week {weekCount} Performance
              </h2>
              <div className="grid grid-cols-2 gap-3 mb-6">
                <StatCard label="Consistency" value={completedWorkouts.length > 0 ? "Good" : "Start"} sub="Active Days" />
                <StatCard label="Avg Intensity" value={Object.values(intensities).length ? (Object.values(intensities).reduce((a: number, b: number) => a + b, 0) / Object.values(intensities).length).toFixed(1) : "-"} sub="Target: 6-8" />
              </div>

              <button onClick={generateNextWeek} className="w-full flex justify-center items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-4 rounded-xl font-bold transition-all shadow-lg shadow-emerald-900/20 active:scale-95">
                <RefreshCw className="w-4 h-4" /> Start Week {weekCount + 1}
              </button>
            </div>
            
            <div>
               <h2 className="text-lg font-bold text-white mb-4 px-1 flex items-center gap-2">
                 <Trophy className="w-5 h-5 text-amber-400" />
                 Skill Mastery
               </h2>
               <div className="grid grid-cols-1 gap-4">
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
          </div>
        )}
        
        {activeTab === 'history' && (
           <HistoryView 
              exerciseHistory={exerciseHistory}
              actuals={actuals}
              planItems={planItemsMap}
              nutritionHistory={nutritionHistory}
              currentNutrition={nutritionLogs}
              weekStartDate={weekStartDate}
              masterExerciseList={masterExerciseList}
           />
        )}

        {activeTab === 'nutrition' && (
          <div className="glass-card rounded-3xl p-6 animate-in fade-in slide-in-from-bottom-4">
             <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2"><Utensils className="w-5 h-5 text-emerald-400"/> Fuel Strategy</h2>
             <div className="space-y-3">
               <StatRow label="Protein Target" value="170g" sub="Daily Goal" />
               <StatRow label="Calorie Target" value="Maintenance" sub="For Recomp" />
               <div className="p-5 bg-slate-900/50 rounded-2xl text-sm text-slate-400 mt-6 border border-white/5">
                  <p className="mb-3 font-bold text-slate-300">Quick Tips:</p>
                  <ul className="space-y-2 list-disc pl-4 marker:text-blue-500">
                    <li>Log nutrition in daily workout tabs.</li>
                    <li>Pre-log dinner in LoseIt app.</li>
                    <li>Small carb snack at 3:30 PM.</li>
                    <li>30g Protein shake after training.</li>
                  </ul>
               </div>
             </div>
          </div>
        )}

        {activeTab === 'admin' && (
            <AdminView 
                exerciseList={masterExerciseList}
                onAdd={addMasterExercise}
                onDelete={deleteMasterExercise}
            />
        )}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 glass z-40 pb-safe">
        <div className="flex justify-around items-center h-16 max-w-md mx-auto px-2">
            <button 
                onClick={() => setActiveTab('schedule')}
                className={`flex flex-col items-center justify-center w-16 h-full gap-1 ${['schedule', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].includes(activeTab) ? 'text-blue-400' : 'text-slate-500 hover:text-slate-300'}`}
            >
                <Home className={`w-6 h-6 ${['schedule', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].includes(activeTab) ? 'fill-blue-400/20' : ''}`} />
                <span className="text-[10px] font-medium">Home</span>
            </button>

            <button 
                onClick={() => setActiveTab('recap')}
                className={`flex flex-col items-center justify-center w-16 h-full gap-1 ${activeTab === 'recap' ? 'text-amber-400' : 'text-slate-500 hover:text-slate-300'}`}
            >
                <Trophy className={`w-6 h-6 ${activeTab === 'recap' ? 'fill-amber-400/20' : ''}`} />
                <span className="text-[10px] font-medium">Progress</span>
            </button>

            <button 
                onClick={() => setActiveTab('history')}
                className={`flex flex-col items-center justify-center w-16 h-full gap-1 ${activeTab === 'history' ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-300'}`}
            >
                <History className={`w-6 h-6 ${activeTab === 'history' ? 'fill-indigo-400/20' : ''}`} />
                <span className="text-[10px] font-medium">History</span>
            </button>

            <button 
                onClick={() => setActiveTab('nutrition')}
                className={`flex flex-col items-center justify-center w-16 h-full gap-1 ${activeTab === 'nutrition' ? 'text-emerald-400' : 'text-slate-500 hover:text-slate-300'}`}
            >
                <Utensils className={`w-6 h-6 ${activeTab === 'nutrition' ? 'fill-emerald-400/20' : ''}`} />
                <span className="text-[10px] font-medium">Fuel</span>
            </button>
        </div>
      </nav>

      <AiCoach />

      {showCheckIn && (
        <CheckInModal 
          onClose={() => setShowCheckIn(false)}
          bodyStats={bodyStats}
          onUpdateBodyStats={(stats) => setBodyStats(stats)}
          onSaveBodyStats={saveBodyStats}
        />
      )}
    </div>
  );
}