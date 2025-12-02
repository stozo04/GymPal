import { WeeklyChat, ChatMessage } from '../types';

export interface DetectedPattern {
  type: 'pain' | 'exercise' | 'nutrition' | 'sleep' | 'performance';
  days: string[]; // Days of week when pattern occurs
  frequency: number; // How many times detected
  keywords: string[]; // Specific words/phrases detected
  context: string; // Brief description of pattern
}

interface PatternAnalysisResult {
  patterns: DetectedPattern[];
  summary: string;
}

// Keywords for different pattern types
const PAIN_KEYWORDS = [
  'back tightness', 'lower back', 'l4', 'l5', 'sore', 'pain', 'tight', 'ache',
  'discomfort', 'tender', 'sharp', 'dull', 'shooting', 'stiff', 'strain'
];

const EXERCISE_KEYWORDS = [
  'pullup', 'pushup', 'dead hang', 'planche', 'flag', 'muscle up', 'handstand',
  'dip', 'squat', 'deadlift', 'row', 'press', 'pull', 'carry', 'lunge'
];

const NUTRITION_KEYWORDS = [
  'protein', 'carb', 'fat', 'meal', 'eat', 'ate', 'breakfast', 'lunch', 'dinner',
  'snack', 'supplement', 'hydration', 'calories', 'macro', 'fasting'
];

const SLEEP_KEYWORDS = [
  'sleep', 'slept', 'tired', 'fatigue', 'rested', 'recovered', 'insomnia',
  'rest', 'wake', 'exhausted', 'energy'
];

const PERFORMANCE_KEYWORDS = [
  'strong', 'weak', 'faster', 'slower', 'harder', 'easier', 'improvement',
  'plateau', 'progress', 'failed', 'completed', 'reps', 'set', 'form'
];

// Get day of week from timestamp (0 = Sunday, 1 = Monday, etc.)
const getDayName = (timestamp: string): string => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const date = new Date(timestamp);
  return days[date.getDay()];
};

// Check if text contains keywords
const containsKeywords = (text: string, keywords: string[]): boolean => {
  const lowerText = text.toLowerCase();
  return keywords.some(keyword => lowerText.includes(keyword));
};

// Find all instances of a pattern type in messages
const findPatternInstances = (
  messages: ChatMessage[],
  keywords: string[],
  patternType: string
): Array<{ text: string; day: string; timestamp: string }> => {
  return messages
    .filter(msg => msg.role === 'user' && containsKeywords(msg.text, keywords))
    .map(msg => ({
      text: msg.text,
      day: getDayName(msg.timestamp),
      timestamp: msg.timestamp
    }));
};

// Analyze patterns from 4+ weeks of chat history
export const analyzePatterns = (chatHistory: WeeklyChat[] | undefined): PatternAnalysisResult => {
  if (!chatHistory || chatHistory.length < 4) {
    return {
      patterns: [],
      summary: 'Need at least 4 weeks of chat history to detect patterns.'
    };
  }

  // Get last 4+ weeks
  const recentWeeks = chatHistory.slice(-4);
  const allMessages = recentWeeks.flatMap(week => week.messages);

  const patterns: DetectedPattern[] = [];

  // Analyze pain patterns
  const painInstances = findPatternInstances(allMessages, PAIN_KEYWORDS, 'pain');
  if (painInstances.length > 0) {
    const dayFrequency: Record<string, number> = {};
    const allKeywordsFound: Set<string> = new Set();
    
    painInstances.forEach(instance => {
      dayFrequency[instance.day] = (dayFrequency[instance.day] || 0) + 1;
      PAIN_KEYWORDS.forEach(kw => {
        if (instance.text.toLowerCase().includes(kw)) {
          allKeywordsFound.add(kw);
        }
      });
    });

    const daysWithPain = Object.entries(dayFrequency)
      .sort((a, b) => b[1] - a[1])
      .map(([day]) => day);

    patterns.push({
      type: 'pain',
      days: daysWithPain,
      frequency: painInstances.length,
      keywords: Array.from(allKeywordsFound),
      context: `Pain/tightness mentioned ${painInstances.length} times, most often on ${daysWithPain[0]}`
    });
  }

  // Analyze exercise patterns
  const exerciseInstances = findPatternInstances(allMessages, EXERCISE_KEYWORDS, 'exercise');
  if (exerciseInstances.length > 0) {
    const dayFrequency: Record<string, number> = {};
    const exercisesFound: Set<string> = new Set();
    
    exerciseInstances.forEach(instance => {
      dayFrequency[instance.day] = (dayFrequency[instance.day] || 0) + 1;
      EXERCISE_KEYWORDS.forEach(ex => {
        if (instance.text.toLowerCase().includes(ex)) {
          exercisesFound.add(ex);
        }
      });
    });

    const daysWithExercise = Object.entries(dayFrequency)
      .sort((a, b) => b[1] - a[1])
      .map(([day]) => day);

    patterns.push({
      type: 'exercise',
      days: daysWithExercise,
      frequency: exerciseInstances.length,
      keywords: Array.from(exercisesFound),
      context: `Exercise discussions on ${daysWithExercise.join(', ')}`
    });
  }

  // Analyze nutrition patterns
  const nutritionInstances = findPatternInstances(allMessages, NUTRITION_KEYWORDS, 'nutrition');
  if (nutritionInstances.length > 0) {
    const dayFrequency: Record<string, number> = {};
    const nutritionTopics: Set<string> = new Set();
    
    nutritionInstances.forEach(instance => {
      dayFrequency[instance.day] = (dayFrequency[instance.day] || 0) + 1;
      NUTRITION_KEYWORDS.forEach(nt => {
        if (instance.text.toLowerCase().includes(nt)) {
          nutritionTopics.add(nt);
        }
      });
    });

    const daysWithNutrition = Object.entries(dayFrequency)
      .sort((a, b) => b[1] - a[1])
      .map(([day]) => day);

    patterns.push({
      type: 'nutrition',
      days: daysWithNutrition,
      frequency: nutritionInstances.length,
      keywords: Array.from(nutritionTopics),
      context: `Nutrition topics discussed ${nutritionInstances.length} times`
    });
  }

  // Analyze sleep patterns
  const sleepInstances = findPatternInstances(allMessages, SLEEP_KEYWORDS, 'sleep');
  if (sleepInstances.length > 0) {
    const dayFrequency: Record<string, number> = {};
    const sleepTopics: Set<string> = new Set();
    
    sleepInstances.forEach(instance => {
      dayFrequency[instance.day] = (dayFrequency[instance.day] || 0) + 1;
      SLEEP_KEYWORDS.forEach(st => {
        if (instance.text.toLowerCase().includes(st)) {
          sleepTopics.add(st);
        }
      });
    });

    const daysWithSleep = Object.entries(dayFrequency)
      .sort((a, b) => b[1] - a[1])
      .map(([day]) => day);

    patterns.push({
      type: 'sleep',
      days: daysWithSleep,
      frequency: sleepInstances.length,
      keywords: Array.from(sleepTopics),
      context: `Sleep/recovery mentioned ${sleepInstances.length} times`
    });
  }

  // Analyze performance patterns
  const performanceInstances = findPatternInstances(allMessages, PERFORMANCE_KEYWORDS, 'performance');
  if (performanceInstances.length > 0) {
    const dayFrequency: Record<string, number> = {};
    const performanceTopics: Set<string> = new Set();
    
    performanceInstances.forEach(instance => {
      dayFrequency[instance.day] = (dayFrequency[instance.day] || 0) + 1;
      PERFORMANCE_KEYWORDS.forEach(pt => {
        if (instance.text.toLowerCase().includes(pt)) {
          performanceTopics.add(pt);
        }
      });
    });

    const daysWithPerformance = Object.entries(dayFrequency)
      .sort((a, b) => b[1] - a[1])
      .map(([day]) => day);

    patterns.push({
      type: 'performance',
      days: daysWithPerformance,
      frequency: performanceInstances.length,
      keywords: Array.from(performanceTopics),
      context: `Performance insights mentioned ${performanceInstances.length} times`
    });
  }

  // Generate summary
  let summary = 'Pattern Analysis (4+ weeks):';
  if (patterns.length === 0) {
    summary += ' No strong patterns detected yet.';
  } else {
    patterns.forEach(pattern => {
      summary += `\n- ${pattern.type}: ${pattern.context}`;
    });
  }

  return { patterns, summary };
};

// Format patterns for inclusion in system instruction
export const formatPatternsForCoach = (patterns: DetectedPattern[]): string => {
  if (patterns.length === 0) {
    return '';
  }

  let instruction = '\n\nRECENT PATTERN ANALYSIS (Last 4+ weeks):';

  patterns.forEach(pattern => {
    if (pattern.days.length > 0) {
      instruction += `\n- ${pattern.type.toUpperCase()}: Mentioned on ${pattern.days.join(', ')} (${pattern.frequency}x)`;
      if (pattern.keywords.length > 0) {
        instruction += `\n  Keywords: ${pattern.keywords.slice(0, 3).join(', ')}`;
      }
    }
  });

  instruction += '\n\nUSE THIS TO:';
  instruction += '\n1. Reference specific patterns: "I noticed you mention back tightness on Fridays..."';
  instruction += '\n2. Suggest preventative measures based on correlations';
  instruction += '\n3. Tailor advice to their actual patterns, not generic recommendations';
  instruction += '\n4. Ask clarifying questions about day-of-week correlations with workouts';

  return instruction;
};
