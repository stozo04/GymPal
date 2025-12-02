import { Exercise, Section } from "../types";

/**
 * Parses coach recommendations (free-form text) into structured Exercise objects
 * Handles various formats:
 * - "Exercise Name: X sets x Y reps"
 * - "Exercise Name (Xmin)" or "Exercise Name (X-Y minutes)"
 * - Bullet points and numbered lists
 */

interface ParsedExercise {
  name: string;
  sets: string;
  reps: string;
  type: "cardio" | "strength" | "core" | "mobility" | "bodyweight";
  val: number;
  unit: string;
  note: string;
  desc: string;
}

const EXERCISE_TYPE_KEYWORDS: Record<string, "cardio" | "strength" | "core" | "mobility" | "bodyweight"> = {
  // Cardio
  "elliptical": "cardio",
  "treadmill": "cardio",
  "bike": "cardio",
  "cycling": "cardio",
  "running": "cardio",
  "walking": "cardio",
  "rowing": "cardio",
  "jump rope": "cardio",

  // Mobility/Flexibility
  "mobility": "mobility",
  "cat-cow": "mobility",
  "bird-dog": "mobility",
  "stretch": "mobility",
  "foam roll": "mobility",
  "flexibility": "mobility",

  // Core
  "core": "core",
  "planck": "core",
  "abs": "core",

  // Default to bodyweight for calisthenics
};

const getExerciseType = (name: string): "cardio" | "strength" | "core" | "mobility" | "bodyweight" => {
  const lower = name.toLowerCase();
  for (const [keyword, type] of Object.entries(EXERCISE_TYPE_KEYWORDS)) {
    if (lower.includes(keyword)) {
      return type;
    }
  }
  return "bodyweight";
};

/**
 * Extract time duration from text (e.g., "20-30 minutes" -> "20-30", "30 min" -> "30")
 */
const extractDuration = (text: string): { val: number; unit: string } => {
  const timeRegex = /(\d+(?:-\d+)?)\s*(minute|min|second|sec|hour|hr|m|s)?/i;
  const match = text.match(timeRegex);
  
  if (match) {
    const timeValue = match[1];
    let unit = match[2]?.toLowerCase() || "min";
    
    // Normalize unit names
    if (unit.startsWith("second") || unit === "sec" || unit === "s") unit = "sec";
    else if (unit.startsWith("minute") || unit === "min" || unit === "m") unit = "min";
    else if (unit.startsWith("hour") || unit === "hr") unit = "hour";
    
    // Parse the numeric value (take first number if range like "20-30")
    const numVal = parseInt(timeValue.split("-")[0], 10);
    return { val: numVal, unit };
  }
  
  return { val: 0, unit: "" };
};

/**
 * Extract sets and reps from text
 * Handles formats like:
 * - "3 sets x 10 reps"
 * - "5-10 reps"
 * - "3x10"
 */
const extractSetsReps = (
  text: string
): { sets: string; reps: string } => {
  let sets = "3";
  let reps = "10";

  // Try "X sets x Y reps" format
  const setsRepsRegex = /(\d+(?:-\d+)?)\s*(?:set)?s?\s*x\s*(\d+(?:-\d+)?)\s*reps?/i;
  const match = text.match(setsRepsRegex);

  if (match) {
    sets = match[1];
    reps = match[2];
  } else {
    // Try just "X-Y reps" or "X reps"
    const repsOnlyRegex = /(\d+(?:-\d+)?)\s*(?:\-\s*(\d+))?\s*reps?/i;
    const repsMatch = text.match(repsOnlyRegex);
    if (repsMatch) {
      reps = repsMatch[1];
      sets = "1"; // Default to 1 set if only reps specified
    }
  }

  return { sets, reps };
};

/**
 * Main parsing function that converts coach text into Exercise objects
 */
export const parseCoachRecommendation = (
  coachText: string
): Exercise[] => {
  const exercises: Exercise[] = [];

  // Split by common delimiters: newlines, bullet points, numbers followed by period
  const lines = coachText
    .split(/\n+|\*\*?(?=\d+\.?|-|\*)|(?=\d+\.)/g)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  for (let line of lines) {
    // Skip if line is just metadata text
    if (
      line.match(/^(why|implementation|example|result|time|value):/i) ||
      line.length < 3
    ) {
      continue;
    }

    // Remove bullet/number prefixes
    line = line
      .replace(/^[\*\-•]\s*/, "")
      .replace(/^\d+\.\s*/, "")
      .replace(/^\*\*/, "")
      .replace(/\*\*$/, "")
      .trim();

    // Skip empty lines
    if (line.length < 3) continue;

    // Try to extract exercise name and details
    // Format: "**Exercise Name (details):** description" or just "Exercise Name: description"
    const colonSplit = line.split(":");
    const firstPart = colonSplit[0].trim();
    const description = colonSplit.slice(1).join(":").trim();

    // Extract exercise name (before parentheses or the whole thing)
    const nameMatch = firstPart.match(/^(.*?)(?:\s*\(.*\))?$/);
    let exerciseName = nameMatch ? nameMatch[1].trim() : firstPart;

    // Remove markdown emphasis
    exerciseName = exerciseName.replace(/\*\*/g, "").trim();

    // Skip if name is too short or looks like a label
    if (
      exerciseName.length < 2 ||
      exerciseName.match(/^(why|what|how|when|note|notes|important)$/i)
    ) {
      continue;
    }

    // Extract sets and reps from full line
    const { sets, reps } = extractSetsReps(line);

    // Extract duration if time-based (cardio, mobility circuits, etc)
    const { val, unit } = extractDuration(firstPart);

    // Determine exercise type
    const type = getExerciseType(exerciseName);

    // Create exercise object
    const exercise: Exercise = {
      id: `coach_${Date.now()}_${exercises.length}`,
      name: exerciseName,
      sets: sets,
      reps: reps,
      type: type,
      val: val, // For cardio/time-based: duration value
      unit: unit || (type === "cardio" ? "min" : "reps"), // Default unit
      note: description || `Added from coach recommendation`,
      desc: description || `Coach-recommended ${type} exercise`,
    };

    exercises.push(exercise);
  }

  return exercises;
};

/**
 * Group parsed exercises into sections by type
 */
export const groupExercisesIntoSections = (
  exercises: Exercise[]
): Section[] => {
  const sectionMap: Record<string, Exercise[]> = {
    cardio: [],
    mobility: [],
    core: [],
    strength: [],
    bodyweight: [],
  };

  // Group by type
  exercises.forEach((ex) => {
    const key = ex.type;
    if (sectionMap[key]) {
      sectionMap[key].push(ex);
    }
  });

  // Create sections with better titles
  const sections: Section[] = [];
  const sectionTitles: Record<string, string> = {
    cardio: "🏃 Cardio / Warm-up",
    mobility: "🧘 Mobility & Recovery",
    core: "💪 Core Work",
    strength: "🏋️ Strength",
    bodyweight: "🤸 Bodyweight",
  };

  for (const [type, items] of Object.entries(sectionMap)) {
    if (items.length > 0) {
      sections.push({
        title: sectionTitles[type],
        items: items,
        isAdHoc: true, // Mark as coach recommendation
      });
    }
  }

  return sections;
};
