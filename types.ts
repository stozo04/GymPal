
export interface Exercise {
  id: string;
  name: string;
  sets: string;
  reps: string;
  type: 'cardio' | 'strength' | 'core' | 'mobility' | 'bodyweight';
  val: number;
  unit: string;
  note: string;
  desc: string;
}

export interface Section {
  title: string;
  items: Exercise[];
  isAdHoc?: boolean;
}

export interface DayPlan {
  id: string;
  title: string;
  subtitle: string;
  sections: Section[];
}

export interface Plan {
  [key: string]: DayPlan;
}

export interface NutritionLog {
  protein?: string;
  calories?: string;
  fat?: string;
  carbs?: string;
  notes?: string;
}

export interface BodyStats {
  weight: number | string;
  waist: number | string;
  history: {
    date: string;
    weight: number | string;
    waist: number | string;
  }[];
}

export interface SkillLevel {
  id: string;
  currentLevel: number; // 1-based index
}

export interface HistoryEntry {
  date: string;
  value: string;
  note?: string;
}

export interface NutritionHistoryEntry {
  date: string;
  protein: number;
  calories: number;
  fat?: number;
  carbs?: number;
}

export interface ChatMessage {
  role: "user" | "model";
  text: string;
  timestamp: string;
}

export interface WeeklyChat {
  weekNumber: number;
  weekStartDate: string;
  messages: ChatMessage[];
  summary?: string; // AI-generated summary of the week's conversation
}

export interface WorkoutOverride {
  dayKey: string;
  timestamp: string;
  reason: string; // Coach's reason for the override
  originalSections: Section[]; // Backup of original sections
  overriddenSections: Section[]; // New sections from coach recommendation
}

export interface UserData {
  completed: string[];
  intensities: Record<string, number>;
  actuals: Record<string, string>;
  lastWeekActuals: Record<string, string>;
  nutrition: Record<string, NutritionLog>;
  bodyStats: BodyStats;
  skillLevels: Record<string, number>;
  weekCount: number;
  weekStartDate: string | null;
  plan: Plan | null;
  exerciseHistory: Record<string, HistoryEntry[]>;
  nutritionHistory: NutritionHistoryEntry[];
  masterExerciseList: string[];
  skipReasons?: Record<string, string>;
  chatHistory?: WeeklyChat[]; // Array of weekly chat sessions
  workoutOverrides?: Record<string, WorkoutOverride>; // Coach overrides by day key (e.g., "monday", "tuesday")
}

export interface SkillNode {
  level: number;
  title: string;
  criteria: string;
}

export interface SkillTreeDef {
  id: string;
  title: string;
  description: string;
  nodes: SkillNode[];
}
