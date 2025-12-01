

import { Plan, SkillTreeDef } from './types';

// --- SAFE ALTERNATIVES DATABASE (L4/L5 Friendly) ---
export const SAFE_ALTERNATIVES: Record<string, { name: string; note: string; desc: string }[]> = {
  // Squat Pattern (No spinal load)
  'Box Squats': [
    { name: 'Sit-to-Stands', note: 'Bodyweight only. Back Saver.', desc: 'Sit fully on a bench. Stand up without using hands momentum. Lower slowly.' },
    { name: 'Cable Goblet Squats', note: 'Hold cable at chest. Keep elbows high.', desc: 'Stand facing machine. Hold low pulley handle at chest. Squat down keeping torso upright.' },
    { name: 'Step-Ups', note: 'Unilateral. Easier on back.', desc: 'One foot on bench. Drive through heel. Keep chest tall.' }
  ],
  'Step-Ups': [{ name: 'Box Squats', note: 'Sit fully, then stand.', desc: 'Sit back onto bench/chair. Pause. Drive up.' }],
  
  // Push Pattern
  'Standard Pushups': [
    { name: 'Incline Pushups', note: 'Hands on bench. Back Saver.', desc: 'Easier angle. Keep body in straight plank.' },
    { name: 'Knee Pushups', note: 'Focus on chest contraction.', desc: 'From knees, keep hips down.' },
    { name: 'Scapular Pushups', note: 'Straight arm strength.', desc: 'Plank position. Keep arms straight. Squeeze shoulder blades together, then push them apart.' }
  ],
  
  // Pull Pattern (Progression to Pullup)
  'Gym Monster Lat Pulldown': [
    { name: 'Resistance Band Pulldown', note: 'Lighter load.', desc: 'Kneel. Pull band apart to chest.' },
    { name: 'Inverted Rows', note: 'Set bar waist height.', desc: 'Hang under bar/handles. Keep body straight. Pull chest to bar.' },
    { name: 'Dead Hangs', note: 'Grip strength builder.', desc: 'Just hang from the bar. Keep shoulders active (not by ears).' }
  ],
  'Dead Hangs': [
      { name: 'Active Hangs (Scapular Shrugs)', note: 'Dynamic hanging.', desc: 'Hang from bar. Pull shoulders down away from ears. Relax. Repeat.' }
  ],

  // Core (Anti-Rotation/Flexion - NO Situps for L4/L5)
  'Dead Bugs': [
    { name: 'Dead Bug (Wall Press)', note: 'Max tension.', desc: 'Lie on back, head near wall. Press hands into wall behind you. Perform leg movements. Keeps spine flat.' },
    { name: 'Bird Dogs', note: 'Back Saver Mode.', desc: 'Hands/knees. Reach opposite arm/leg. Neutral spine.' }
  ],
  'Hollow Body Hold': [{ name: 'Dead Bug (Wall Press)', note: 'Safer high-tension core.', desc: 'Lie on back. Press hands into wall. Keep spine glued to floor.' }],
  
  // Flexibility
  'Elephant Walks': [
    { name: 'Seated Hamstring Stretch', note: 'Gentle.', desc: 'Sit on floor. Reach for toes with flat back.' }
  ],
  'Couch Stretch': [
    { name: 'Standing Quad Stretch', note: 'Balance needed.', desc: 'Hold foot behind butt. Squeeze glute.' }
  ],
  'Rower (Intervals)': [
     { name: 'Rower (Steady State)', note: 'Gentle cardio.', desc: 'No sprinting. Just move.' }
  ],
  'Pike Static Hold': [
      { name: 'Downward Dog', note: 'Yoga classic.', desc: 'Hips high. Push floor away.' },
      { name: 'Incline Pike Pushup', note: 'Hands on bench.', desc: 'Easier on shoulders.' }
  ]
};

export const SPEEDIANCE_LIBRARY = [
  {
    name: "Adductor Bench",
    note: "Targets Full Body.",
    desc: "A guided movement primarily engaging the full body.",
  },
  {
    name: "Single Leg Extensions",
    note: "Targets Legs.",
    desc: "A guided movement primarily engaging the legs.",
  },
  {
    name: "Barbell Front Box Squat",
    note: "Targets Legs.",
    desc: "A guided movement primarily engaging the legs.",
  },
  {
    name: "Single Arm Push Press",
    note: "Targets Chest/Shoulders.",
    desc: "A guided movement primarily engaging the chest/shoulders.",
  },
  {
    name: "Seated Alternating Hammer Curl",
    note: "Targets Biceps.",
    desc: "A guided movement primarily engaging the biceps.",
  },
  {
    name: "Seated Dual Handle Hammer Curl",
    note: "Targets Biceps.",
    desc: "A guided movement primarily engaging the biceps.",
  },
  {
    name: "Seated Single Arm Hammer Curl",
    note: "Targets Biceps.",
    desc: "A guided movement primarily engaging the biceps.",
  },
  {
    name: "Standing Alternating Hammer Curl",
    note: "Targets Biceps.",
    desc: "A guided movement primarily engaging the biceps.",
  },
  {
    name: "Standing Dual Handle Hammer Curl",
    note: "Targets Biceps.",
    desc: "A guided movement primarily engaging the biceps.",
  },
  {
    name: "Standing Single Handle Hammer Curl",
    note: "Targets Biceps.",
    desc: "A guided movement primarily engaging the biceps.",
  },
  {
    name: "Barbell Open Knee Hip Thrust",
    note: "Targets Hips/Glutes.",
    desc: "A guided movement primarily engaging the hips/glutes.",
  },
  {
    name: "Cable Side Lunge",
    note: "Targets Legs.",
    desc: "A guided movement primarily engaging the legs.",
  },
  {
    name: "Seated Dual Handle Low To High Chest Fly",
    note: "Targets Chest.",
    desc: "A guided movement primarily engaging the chest.",
  },
  {
    name: "Incline Dual Handle High To Low Chest Press",
    note: "Targets Chest/Shoulders.",
    desc: "A guided movement primarily engaging the chest/shoulders.",
  },
  {
    name: "Standing Single Arm Chest Fly",
    note: "Targets Chest.",
    desc: "A guided movement primarily engaging the chest.",
  },
  {
    name: "Kneeling Single Arm High To Low Cross Fly",
    note: "Targets Chest.",
    desc: "A guided movement primarily engaging the chest.",
  },
  {
    name: "Standing Dual Handle Reverse Curl",
    note: "Targets Biceps.",
    desc: "A guided movement primarily engaging the biceps.",
  },
  {
    name: "Barbell Narrow Stance Front Squat",
    note: "Targets Legs.",
    desc: "A guided movement primarily engaging the legs.",
  },
  {
    name: "Single Arm Deadlift",
    note: "Targets Full Body.",
    desc: "A guided movement primarily engaging the full body.",
  },
  {
    name: "Single Arm Rack Squat",
    note: "Targets Legs.",
    desc: "A guided movement primarily engaging the legs.",
  },
  {
    name: "Dual Handle Narrow Stance Squat",
    note: "Targets Legs.",
    desc: "A guided movement primarily engaging the legs.",
  },
  {
    name: "Dual Handle Narrow Stance Front Squat",
    note: "Targets Legs.",
    desc: "A guided movement primarily engaging the legs.",
  },
  {
    name: "Single Arm Curtsy Lunge",
    note: "Targets Legs.",
    desc: "A guided movement primarily engaging the legs.",
  },
  {
    name: "Seated Single Arm Wrist Curl",
    note: "Targets Biceps.",
    desc: "A guided movement primarily engaging the biceps.",
  },
  {
    name: "Seated Single Arm Wrist Reverse Curl",
    note: "Targets Biceps.",
    desc: "A guided movement primarily engaging the biceps.",
  },
  {
    name: "Seated Dual Handle Wrist Curl",
    note: "Targets Biceps.",
    desc: "A guided movement primarily engaging the biceps.",
  },
  {
    name: "Seated Dual Handle Wrist Reverse Curl",
    note: "Targets Biceps.",
    desc: "A guided movement primarily engaging the biceps.",
  },
  {
    name: "Seated Single Leg Abduction",
    note: "Targets Legs.",
    desc: "A guided movement primarily engaging the legs.",
  },
  {
    name: "Standing High Cable Biceps Curl With Rope Attachment",
    note: "Targets Biceps.",
    desc: "A guided movement primarily engaging the biceps.",
  },
  {
    name: "Standing Dual Handle Crossbody Triceps Extension",
    note: "Targets Triceps.",
    desc: "A guided movement primarily engaging the triceps.",
  },
  {
    name: "Standing Single Leg Extension",
    note: "Targets Legs.",
    desc: "A guided movement primarily engaging the legs.",
  },
  {
    name: "Standing Single Arm Horizontal Triceps Extension",
    note: "Targets Triceps.",
    desc: "A guided movement primarily engaging the triceps.",
  },
  {
    name: "Half Kneeling Single Arm Preacher Curl",
    note: "Targets Biceps.",
    desc: "A guided movement primarily engaging the biceps.",
  },
  {
    name: "Single Arm Reverse Lunge",
    note: "Targets Legs.",
    desc: "A guided movement primarily engaging the legs.",
  },
  {
    name: "Cable Side Step Iso Squat",
    note: "Targets Legs.",
    desc: "A guided movement primarily engaging the legs.",
  },
  {
    name: "Standing Dual Handle Marching",
    note: "Targets Full Body.",
    desc: "A guided movement primarily engaging the full body.",
  },
  {
    name: "Standing Single Arm Marching",
    note: "Targets Full Body.",
    desc: "A guided movement primarily engaging the full body.",
  },
  {
    name: "Seated Tricep Rope Cross Body Crunch",
    note: "Targets Triceps.",
    desc: "A guided movement primarily engaging the triceps.",
  },
  {
    name: "Standing Tricep Rope Push Twist",
    note: "Targets Triceps.",
    desc: "A guided movement primarily engaging the triceps.",
  },
  {
    name: "Spine Bench Tricep Rope Crunch",
    note: "Targets Triceps.",
    desc: "A guided movement primarily engaging the triceps.",
  },
  {
    name: "Dual Handle Straight Arm Crunch",
    note: "Targets Core.",
    desc: "A guided movement primarily engaging the core.",
  },
  {
    name: "Straight Arm Barbell Crunch",
    note: "Targets Core.",
    desc: "A guided movement primarily engaging the core.",
  },
  {
    name: "Kneeling Bench Straight Leg Kickback",
    note: "Targets Legs.",
    desc: "A guided movement primarily engaging the legs.",
  },
  {
    name: "Incline Tripod Row",
    note: "Targets Back.",
    desc: "A guided movement primarily engaging the back.",
  },
  {
    name: "Bent Over Barbell Reverse Grip Straight Arm Pulldown",
    note: "Targets Back.",
    desc: "A guided movement primarily engaging the back.",
  },
  {
    name: "Incline Dual Handle Straight Arm Pushdown",
    note: "Targets Full Body.",
    desc: "A guided movement primarily engaging the full body.",
  },
  {
    name: "Seated Barbell Good Morning",
    note: "Targets Full Body.",
    desc: "A guided movement primarily engaging the full body.",
  },
  {
    name: "Incline Single Arm Chest Press",
    note: "Targets Chest/Shoulders.",
    desc: "A guided movement primarily engaging the chest/shoulders.",
  },
  {
    name: "Single Handle Duck Squat",
    note: "Targets Legs.",
    desc: "A guided movement primarily engaging the legs.",
  },
  {
    name: "Seated Barbell Wide Row",
    note: "Targets Back.",
    desc: "A guided movement primarily engaging the back.",
  },
  {
    name: "Kneeling Dual Handle Low To High Chest Press",
    note: "Targets Chest/Shoulders.",
    desc: "A guided movement primarily engaging the chest/shoulders.",
  },
  {
    name: "Kneeling Dual Handle Low To High Chest Fly",
    note: "Targets Chest.",
    desc: "A guided movement primarily engaging the chest.",
  },
  {
    name: "Supine Narrow Grip Dual Handle Chest Press",
    note: "Targets Chest/Shoulders.",
    desc: "A guided movement primarily engaging the chest/shoulders.",
  },
  {
    name: "Standing Single Arm High To Low Chest Press",
    note: "Targets Chest/Shoulders.",
    desc: "A guided movement primarily engaging the chest/shoulders.",
  },
  {
    name: "Kneeling Dual Arm High To Low Chest Press",
    note: "Targets Chest/Shoulders.",
    desc: "A guided movement primarily engaging the chest/shoulders.",
  },
  {
    name: "Kneeling Barbell High To Low Chest Press",
    note: "Targets Chest/Shoulders.",
    desc: "A guided movement primarily engaging the chest/shoulders.",
  },
  {
    name: "Standing Single Arm Shrug",
    note: "Targets Shoulders.",
    desc: "A guided movement primarily engaging the shoulders.",
  },
  {
    name: "Standing Barbell Chest Press",
    note: "Targets Chest/Shoulders.",
    desc: "A guided movement primarily engaging the chest/shoulders.",
  },
  {
    name: "Standing Barbell Low To High Chest Press",
    note: "Targets Chest/Shoulders.",
    desc: "A guided movement primarily engaging the chest/shoulders.",
  },
  {
    name: "Standing Single Arm Low To High Cross Fly",
    note: "Targets Chest.",
    desc: "A guided movement primarily engaging the chest.",
  },
  {
    name: "Seated Single Arm Shoulder Press",
    note: "Targets Chest/Shoulders.",
    desc: "A guided movement primarily engaging the chest/shoulders.",
  },
  {
    name: "Standing Single Arm Crossbody Overhead Triceps Extension",
    note: "Targets Triceps.",
    desc: "A guided movement primarily engaging the triceps.",
  },
  {
    name: "Upper Body Rowing",
    note: "Targets Back.",
    desc: "A guided movement primarily engaging the back.",
  },
  {
    name: "Lower Body Rowing",
    note: "Targets Back.",
    desc: "A guided movement primarily engaging the back.",
  },
  {
    name: "Standing Single Arm Bayesian Biceps Curl",
    note: "Targets Biceps.",
    desc: "A guided movement primarily engaging the biceps.",
  },
  {
    name: "Standing Single Arm Pinwheel Curls",
    note: "Targets Biceps.",
    desc: "A guided movement primarily engaging the biceps.",
  },
  {
    name: "Incline Dual Handle Front Raise",
    note: "Targets Shoulders.",
    desc: "A guided movement primarily engaging the shoulders.",
  },
  {
    name: "Standing Tricep Rope Curl With Wrist Rotation",
    note: "Targets Biceps.",
    desc: "A guided movement primarily engaging the biceps.",
  },
  {
    name: "Kneeling Bent Over Overhead Curl",
    note: "Targets Biceps.",
    desc: "A guided movement primarily engaging the biceps.",
  },
  {
    name: "Standing Single Arm Neutral Grip Front Raise",
    note: "Targets Shoulders.",
    desc: "A guided movement primarily engaging the shoulders.",
  },
  {
    name: "Standing Single Arm Lateral Raise",
    note: "Targets Back.",
    desc: "A guided movement primarily engaging the back.",
  },
  {
    name: "Dual Handle Push Press",
    note: "Targets Chest/Shoulders.",
    desc: "A guided movement primarily engaging the chest/shoulders.",
  },
  {
    name: "Single Arm High Pull",
    note: "Targets Full Body.",
    desc: "A guided movement primarily engaging the full body.",
  },
  {
    name: "Barbell Push Press",
    note: "Targets Chest/Shoulders.",
    desc: "A guided movement primarily engaging the chest/shoulders.",
  },
  {
    name: "Barbell High Pull",
    note: "Targets Full Body.",
    desc: "A guided movement primarily engaging the full body.",
  },
  {
    name: "Half Kneeling Pallof Press",
    note: "Targets Chest/Shoulders.",
    desc: "A guided movement primarily engaging the chest/shoulders.",
  },
  {
    name: "Dual Handle Dead Bug",
    note: "Targets Full Body.",
    desc: "A guided movement primarily engaging the full body.",
  },
  {
    name: "Bird Dog Row",
    note: "Targets Back.",
    desc: "A guided movement primarily engaging the back.",
  },
  {
    name: "Standing Single Leg Pallof Press",
    note: "Targets Legs.",
    desc: "A guided movement primarily engaging the legs.",
  },
  {
    name: "Seated Single Arm Side Crunch",
    note: "Targets Core.",
    desc: "A guided movement primarily engaging the core.",
  },
  {
    name: "Standing Tricep Rope Low To High Woodchops",
    note: "Targets Triceps.",
    desc: "A guided movement primarily engaging the triceps.",
  },
  {
    name: "Standing Tricep Rope High To Low Woodchops",
    note: "Targets Triceps.",
    desc: "A guided movement primarily engaging the triceps.",
  },
  {
    name: "Standing Push Twist",
    note: "Targets Full Body.",
    desc: "A guided movement primarily engaging the full body.",
  },
  {
    name: "Dual Handle Straight Arm Reverse Crunch",
    note: "Targets Core.",
    desc: "A guided movement primarily engaging the core.",
  },
  {
    name: "Seated Tricep Rope Crunch",
    note: "Targets Triceps.",
    desc: "A guided movement primarily engaging the triceps.",
  },
  {
    name: "Standing Tricep Rope Shrug",
    note: "Targets Triceps.",
    desc: "A guided movement primarily engaging the triceps.",
  },
  {
    name: "Half Kneeling Single Arm Row",
    note: "Targets Back.",
    desc: "A guided movement primarily engaging the back.",
  },
  {
    name: "Bent Over Dual Handle Straight Arm Pulldown",
    note: "Targets Back.",
    desc: "A guided movement primarily engaging the back.",
  },
  {
    name: "Bent Over Single Arm Underhand Row",
    note: "Targets Back.",
    desc: "A guided movement primarily engaging the back.",
  },
  {
    name: "Bent Over Alternating Row",
    note: "Targets Back.",
    desc: "A guided movement primarily engaging the back.",
  },
  {
    name: "Bent Over Single Arm Row",
    note: "Targets Back.",
    desc: "A guided movement primarily engaging the back.",
  },
  {
    name: "Kneeling Alternating Lat Pulldowns",
    note: "Targets Back.",
    desc: "A guided movement primarily engaging the back.",
  },
  {
    name: "Kneeling Single Arm Lat Pulldown",
    note: "Targets Back.",
    desc: "A guided movement primarily engaging the back.",
  },
  {
    name: "Kneeling Barbell Reverse Grip Lat Pulldown",
    note: "Targets Back.",
    desc: "A guided movement primarily engaging the back.",
  },
  {
    name: "Kneeling Barbell Lat Pulldown",
    note: "Targets Back.",
    desc: "A guided movement primarily engaging the back.",
  },
  {
    name: "Kneeling Dual Handle Lat Pulldown",
    note: "Targets Back.",
    desc: "A guided movement primarily engaging the back.",
  },
  {
    name: "Seated Barbell Wide Reverse Grip Lat Pulldown",
    note: "Targets Back.",
    desc: "A guided movement primarily engaging the back.",
  },
  {
    name: "Seated Single Arm Crossbody Row",
    note: "Targets Back.",
    desc: "A guided movement primarily engaging the back.",
  },
  {
    name: "Seated Single Arm Crossbody Pulldown",
    note: "Targets Back.",
    desc: "A guided movement primarily engaging the back.",
  },
  {
    name: "Standing Barbell Reverse Grip Row",
    note: "Targets Back.",
    desc: "A guided movement primarily engaging the back.",
  },
  {
    name: "Standing Barbell Row",
    note: "Targets Back.",
    desc: "A guided movement primarily engaging the back.",
  },
  {
    name: "Standing Tricep Rope Row",
    note: "Targets Triceps.",
    desc: "A guided movement primarily engaging the triceps.",
  },
  {
    name: "Barbell Reverse Grip Bench Press",
    note: "Targets Chest/Shoulders.",
    desc: "A guided movement primarily engaging the chest/shoulders.",
  },
  {
    name: "Supine Dual Handle Twist Fly",
    note: "Targets Chest.",
    desc: "A guided movement primarily engaging the chest.",
  },
  {
    name: "Dual Handle Reverse Grip Bench Press",
    note: "Targets Chest/Shoulders.",
    desc: "A guided movement primarily engaging the chest/shoulders.",
  },
  {
    name: "Dual Handle Triceps Bench Press",
    note: "Targets Triceps.",
    desc: "A guided movement primarily engaging the triceps.",
  },
  {
    name: "Single Arm Bench Press",
    note: "Targets Chest/Shoulders.",
    desc: "A guided movement primarily engaging the chest/shoulders.",
  },
  {
    name: "Kneeling Dual Handle Chest Fly",
    note: "Targets Chest.",
    desc: "A guided movement primarily engaging the chest.",
  },
  {
    name: "Standing Alternating Chest Fly",
    note: "Targets Chest.",
    desc: "A guided movement primarily engaging the chest.",
  },
  {
    name: "Single Arm Rotator Cuff Internal Rotation",
    note: "Targets Full Body.",
    desc: "A guided movement primarily engaging the full body.",
  },
  {
    name: "Incline Dual Handle Twist Fly",
    note: "Targets Chest.",
    desc: "A guided movement primarily engaging the chest.",
  },
  {
    name: "Incline Barbell Close Grip Chest Press",
    note: "Targets Chest/Shoulders.",
    desc: "A guided movement primarily engaging the chest/shoulders.",
  },
  {
    name: "Seated Dual Handle High To Low Chest Fly",
    note: "Targets Chest.",
    desc: "A guided movement primarily engaging the chest.",
  },
  {
    name: "Standing Dual Handle High To Low Chest Press",
    note: "Targets Chest/Shoulders.",
    desc: "A guided movement primarily engaging the chest/shoulders.",
  },
  {
    name: "Standing Dual Handle Toes Out Calf Raises",
    note: "Targets Shoulders.",
    desc: "A guided movement primarily engaging the shoulders.",
  },
  {
    name: "Standing Dual Handle Toes In Calf Raises",
    note: "Targets Shoulders.",
    desc: "A guided movement primarily engaging the shoulders.",
  },
  {
    name: "Standing Barbell Toes In Calf Raises",
    note: "Targets Shoulders.",
    desc: "A guided movement primarily engaging the shoulders.",
  },
  {
    name: "Standing Barbell Calf Raises",
    note: "Targets Shoulders.",
    desc: "A guided movement primarily engaging the shoulders.",
  },
  {
    name: "Tricep Rope Single Leg Romanian Deadlift",
    note: "Targets Legs.",
    desc: "A guided movement primarily engaging the legs.",
  },
  {
    name: "Tricep Rope Staggered Romanian Deadlift",
    note: "Targets Triceps.",
    desc: "A guided movement primarily engaging the triceps.",
  },
  {
    name: "Dual Handle Stiff Leg Deadlift",
    note: "Targets Legs.",
    desc: "A guided movement primarily engaging the legs.",
  },
  {
    name: "Barbell Stiff Leg Deadlift",
    note: "Targets Legs.",
    desc: "A guided movement primarily engaging the legs.",
  },
  {
    name: "Dual Handle Box Squat",
    note: "Targets Legs.",
    desc: "A guided movement primarily engaging the legs.",
  },
  {
    name: "Barbell Box Squat",
    note: "Targets Legs.",
    desc: "A guided movement primarily engaging the legs.",
  },
  {
    name: "Dual Handle Front Rack Box Squat",
    note: "Targets Legs.",
    desc: "A guided movement primarily engaging the legs.",
  },
  {
    name: "Barbell Front Rack Alternating Reverse Lunges",
    note: "Targets Legs.",
    desc: "A guided movement primarily engaging the legs.",
  },
  {
    name: "Barbell Front Rack Split Squat",
    note: "Targets Legs.",
    desc: "A guided movement primarily engaging the legs.",
  },
  {
    name: "Single Handle Goblet Alternating Reverse Lunge",
    note: "Targets Legs.",
    desc: "A guided movement primarily engaging the legs.",
  },
  {
    name: "Barbell Quarter Squat",
    note: "Targets Legs.",
    desc: "A guided movement primarily engaging the legs.",
  },
  {
    name: "Barbell Narrow Stance Squat",
    note: "Targets Legs.",
    desc: "A guided movement primarily engaging the legs.",
  },
  {
    name: "Single Arm Overhead Squat",
    note: "Targets Legs.",
    desc: "A guided movement primarily engaging the legs.",
  },
  {
    name: "Dual Handle Overhead Squat",
    note: "Targets Legs.",
    desc: "A guided movement primarily engaging the legs.",
  },
  {
    name: "Barbell Overhead Squat",
    note: "Targets Legs.",
    desc: "A guided movement primarily engaging the legs.",
  },
  {
    name: "Side Plank Hip Abduction",
    note: "Targets Hips/Glutes.",
    desc: "A guided movement primarily engaging the hips/glutes.",
  },
  {
    name: "Incline Single Leg Kickback",
    note: "Targets Legs.",
    desc: "A guided movement primarily engaging the legs.",
  },
  {
    name: "Dual Handle Straight Arm Glute Bridge",
    note: "Targets Hips/Glutes.",
    desc: "A guided movement primarily engaging the hips/glutes.",
  },
  {
    name: "Kneeling Barbell Hip Thrust",
    note: "Targets Hips/Glutes.",
    desc: "A guided movement primarily engaging the hips/glutes.",
  },
  {
    name: "Seated Barbell Wrist Curl",
    note: "Targets Biceps.",
    desc: "A guided movement primarily engaging the biceps.",
  },
  {
    name: "Seated Barbell Wrist Reverse Curl",
    note: "Targets Biceps.",
    desc: "A guided movement primarily engaging the biceps.",
  },
  {
    name: "Incline Dual Handle Triceps Push Down",
    note: "Targets Triceps.",
    desc: "A guided movement primarily engaging the triceps.",
  },
  {
    name: "Reverse Narrow Grip Barbell Bench Press",
    note: "Targets Chest/Shoulders.",
    desc: "A guided movement primarily engaging the chest/shoulders.",
  },
  {
    name: "Bent Over Dual Handle Underhand Triceps Kickback",
    note: "Targets Triceps.",
    desc: "A guided movement primarily engaging the triceps.",
  },
  {
    name: "Kneeling Single Arm Underhand Tricep Kickback",
    note: "Targets Triceps.",
    desc: "A guided movement primarily engaging the triceps.",
  },
  {
    name: "Kneeling Single Arm Tricep Kickback",
    note: "Targets Triceps.",
    desc: "A guided movement primarily engaging the triceps.",
  },
  {
    name: "Half Kneeling Single Arm Tricep Kickback",
    note: "Targets Triceps.",
    desc: "A guided movement primarily engaging the triceps.",
  },
  {
    name: "Seated Single Arm Overhead Tricep Extension",
    note: "Targets Triceps.",
    desc: "A guided movement primarily engaging the triceps.",
  },
  {
    name: "Seated Dual Handle Bent Over Kickback",
    note: "Targets Full Body.",
    desc: "A guided movement primarily engaging the full body.",
  },
  {
    name: "Seated Tricep Rope Overhead Extension",
    note: "Targets Triceps.",
    desc: "A guided movement primarily engaging the triceps.",
  },
  {
    name: "Standing Barbell Reverse Grip Tricep Push Down",
    note: "Targets Triceps.",
    desc: "A guided movement primarily engaging the triceps.",
  },
  {
    name: "Standing Barbell Reverse Grip Tricep Overhead Extension",
    note: "Targets Triceps.",
    desc: "A guided movement primarily engaging the triceps.",
  },
  {
    name: "Standing Single Arm Overhead Tricep Extension",
    note: "Targets Triceps.",
    desc: "A guided movement primarily engaging the triceps.",
  },
  {
    name: "Incline Single Arm Preacher Curl",
    note: "Targets Biceps.",
    desc: "A guided movement primarily engaging the biceps.",
  },
  {
    name: "Incline Barbell High Cable Biceps Curl",
    note: "Targets Biceps.",
    desc: "A guided movement primarily engaging the biceps.",
  },
  {
    name: "Standing High Cable Tricep Rope Curl",
    note: "Targets Biceps.",
    desc: "A guided movement primarily engaging the biceps.",
  },
  {
    name: "Bent Over Reverse Grip Double Handle Row",
    note: "Targets Back.",
    desc: "A guided movement primarily engaging the back.",
  },
  {
    name: "Incline Alternating Spider Curl",
    note: "Targets Biceps.",
    desc: "A guided movement primarily engaging the biceps.",
  },
  {
    name: "Supine Barbell Overhand Biceps Curl",
    note: "Targets Biceps.",
    desc: "A guided movement primarily engaging the biceps.",
  },
  {
    name: "Supine Barbell High Cable Biceps Curl",
    note: "Targets Biceps.",
    desc: "A guided movement primarily engaging the biceps.",
  },
  {
    name: "Supine Alternating Biceps Curl",
    note: "Targets Biceps.",
    desc: "A guided movement primarily engaging the biceps.",
  },
  {
    name: "Supine Dual Handle Biceps Curl",
    note: "Targets Biceps.",
    desc: "A guided movement primarily engaging the biceps.",
  },
  {
    name: "Supine Barbell Biceps Curl",
    note: "Targets Biceps.",
    desc: "A guided movement primarily engaging the biceps.",
  },
  {
    name: "Tricep Rope Squatting Hammer Curl",
    note: "Targets Legs.",
    desc: "A guided movement primarily engaging the legs.",
  },
  {
    name: "Dual Handle Squatting Biceps Curl",
    note: "Targets Legs.",
    desc: "A guided movement primarily engaging the legs.",
  },
  {
    name: "Tricep Rope Squatting Bicep Curl",
    note: "Targets Legs.",
    desc: "A guided movement primarily engaging the legs.",
  },
  {
    name: "Barbell Squatting Bicep Curl",
    note: "Targets Legs.",
    desc: "A guided movement primarily engaging the legs.",
  },
  {
    name: "Seated Dual Handle High Cable Curl",
    note: "Targets Biceps.",
    desc: "A guided movement primarily engaging the biceps.",
  },
  {
    name: "Seated Single Arm Biceps Curl",
    note: "Targets Biceps.",
    desc: "A guided movement primarily engaging the biceps.",
  },
  {
    name: "Seated Alternating Biceps Curl",
    note: "Targets Biceps.",
    desc: "A guided movement primarily engaging the biceps.",
  },
  {
    name: "Standing Barbell Close Grip Biceps Curl",
    note: "Targets Biceps.",
    desc: "A guided movement primarily engaging the biceps.",
  },
  {
    name: "Barbell Drag Curl",
    note: "Targets Biceps.",
    desc: "A guided movement primarily engaging the biceps.",
  },
  {
    name: "Standing Dual Handle Drag Curl",
    note: "Targets Biceps.",
    desc: "A guided movement primarily engaging the biceps.",
  },
  {
    name: "Standing Barbell Wide Grip Biceps Curl",
    note: "Targets Biceps.",
    desc: "A guided movement primarily engaging the biceps.",
  },
  {
    name: "Standing Dual Handle High Cable Curl",
    note: "Targets Biceps.",
    desc: "A guided movement primarily engaging the biceps.",
  },
  {
    name: "Standing Dual Handle Bayesian Biceps Curl",
    note: "Targets Biceps.",
    desc: "A guided movement primarily engaging the biceps.",
  },
  {
    name: "Bent Over Single Arm Wide Row",
    note: "Targets Back.",
    desc: "A guided movement primarily engaging the back.",
  },
  {
    name: "Seated Elbows Out Barbell Row",
    note: "Targets Back.",
    desc: "A guided movement primarily engaging the back.",
  },
  {
    name: "Seated Dual Handle Wide Row",
    note: "Targets Back.",
    desc: "A guided movement primarily engaging the back.",
  },
  {
    name: "Seated Bent Over Single Arm Reverse Fly",
    note: "Targets Chest.",
    desc: "A guided movement primarily engaging the chest.",
  },
  {
    name: "Standing Barbell Wide Row",
    note: "Targets Back.",
    desc: "A guided movement primarily engaging the back.",
  },
  {
    name: "Standing Dual Handle Wide Row",
    note: "Targets Back.",
    desc: "A guided movement primarily engaging the back.",
  },
  {
    name: "Side Lying Single Arm Lateral Raise",
    note: "Targets Back.",
    desc: "A guided movement primarily engaging the back.",
  },
  {
    name: "Seated Dual Handle Reverse Grip Lateral Raise",
    note: "Targets Back.",
    desc: "A guided movement primarily engaging the back.",
  },
  {
    name: "Seated Single Arm Lateral Raise",
    note: "Targets Back.",
    desc: "A guided movement primarily engaging the back.",
  },
  {
    name: "Seated Single Arm Z Press",
    note: "Targets Chest/Shoulders.",
    desc: "A guided movement primarily engaging the chest/shoulders.",
  },
  {
    name: "Seated Barbell Z Press",
    note: "Targets Chest/Shoulders.",
    desc: "A guided movement primarily engaging the chest/shoulders.",
  },
  {
    name: "Seated Dual Handle Z Press",
    note: "Targets Chest/Shoulders.",
    desc: "A guided movement primarily engaging the chest/shoulders.",
  },
  {
    name: "Seated Bradford Press",
    note: "Targets Chest/Shoulders.",
    desc: "A guided movement primarily engaging the chest/shoulders.",
  },
  {
    name: "Standing Dual Handle Reverse Grip Lateral Raise",
    note: "Targets Back.",
    desc: "A guided movement primarily engaging the back.",
  },
  {
    name: "Half Kneeling Dual Shoulder Press",
    note: "Targets Chest/Shoulders.",
    desc: "A guided movement primarily engaging the chest/shoulders.",
  },
  {
    name: "Half Kneeling Single Arm Neutral Grip Shoulder Press",
    note: "Targets Chest/Shoulders.",
    desc: "A guided movement primarily engaging the chest/shoulders.",
  },
  {
    name: "Half Kneeling Alternating Neutral Grip Shoulder Press",
    note: "Targets Chest/Shoulders.",
    desc: "A guided movement primarily engaging the chest/shoulders.",
  },
  {
    name: "Incline Supine Dual Handle Neutral Grip Front Raise",
    note: "Targets Shoulders.",
    desc: "A guided movement primarily engaging the shoulders.",
  },
  {
    name: "Incline Supine Alternating Neutral Grip Front Raise",
    note: "Targets Shoulders.",
    desc: "A guided movement primarily engaging the shoulders.",
  },
  {
    name: "Incline Supine Single Arm Neutral Grip Front Raise",
    note: "Targets Shoulders.",
    desc: "A guided movement primarily engaging the shoulders.",
  },
  {
    name: "Seated Dual Handle Neutral Grip Shoulder Press",
    note: "Targets Chest/Shoulders.",
    desc: "A guided movement primarily engaging the chest/shoulders.",
  },
  {
    name: "Seated Barbell Reverse Grip Shoulder Press",
    note: "Targets Chest/Shoulders.",
    desc: "A guided movement primarily engaging the chest/shoulders.",
  },
  {
    name: "Seated Dual Handle Neutral Grip Front Raise",
    note: "Targets Shoulders.",
    desc: "A guided movement primarily engaging the shoulders.",
  },
  {
    name: "Seated Single Arm Neutral Grip Front Raise",
    note: "Targets Shoulders.",
    desc: "A guided movement primarily engaging the shoulders.",
  },
  {
    name: "Seated Dual Handle Shoulder Press",
    note: "Targets Chest/Shoulders.",
    desc: "A guided movement primarily engaging the chest/shoulders.",
  },
  {
    name: "Seated Alternating Neutral Grip Front Raise",
    note: "Targets Shoulders.",
    desc: "A guided movement primarily engaging the shoulders.",
  },
  {
    name: "Standing Barbell Reverse Grip Shoulder Press",
    note: "Targets Chest/Shoulders.",
    desc: "A guided movement primarily engaging the chest/shoulders.",
  },
  {
    name: "Standing Barbell Reverse Grip Front Raise",
    note: "Targets Shoulders.",
    desc: "A guided movement primarily engaging the shoulders.",
  },
  {
    name: "Standing Alternating Arnold Press",
    note: "Targets Chest/Shoulders.",
    desc: "A guided movement primarily engaging the chest/shoulders.",
  },
  {
    name: "Standing Dual Handle Neutral Grip Front Raise",
    note: "Targets Shoulders.",
    desc: "A guided movement primarily engaging the shoulders.",
  },
  {
    name: "Supine Barbell Triceps Extension",
    note: "Targets Triceps.",
    desc: "A guided movement primarily engaging the triceps.",
  },
  {
    name: "Standing Cable Hip Abduction",
    note: "Targets Hips/Glutes.",
    desc: "A guided movement primarily engaging the hips/glutes.",
  },
  {
    name: "Standing Cable Kickbacks",
    note: "Targets Full Body.",
    desc: "A guided movement primarily engaging the full body.",
  },
  {
    name: "Kneeling Tricep Rope Pull Through",
    note: "Targets Triceps.",
    desc: "A guided movement primarily engaging the triceps.",
  },
  {
    name: "Seated Double Handle Biceps Curl",
    note: "Targets Biceps.",
    desc: "A guided movement primarily engaging the biceps.",
  },
  {
    name: "Floor Seated Dual Handle Row",
    note: "Targets Back.",
    desc: "A guided movement primarily engaging the back.",
  },
  {
    name: "Seated Single Arm Row",
    note: "Targets Back.",
    desc: "A guided movement primarily engaging the back.",
  },
  {
    name: "Barbell Overhead Biceps Curl",
    note: "Targets Biceps.",
    desc: "A guided movement primarily engaging the biceps.",
  },
  {
    name: "Seated Single Arm High Row",
    note: "Targets Back.",
    desc: "A guided movement primarily engaging the back.",
  },
  {
    name: "Reverse Nordic Curl",
    note: "Targets Biceps.",
    desc: "A guided movement primarily engaging the biceps.",
  },
  {
    name: "Bent Over Dual Handle Triceps Extension",
    note: "Targets Triceps.",
    desc: "A guided movement primarily engaging the triceps.",
  },
  {
    name: "Kneeling Tricep Rope Crunch",
    note: "Targets Triceps.",
    desc: "A guided movement primarily engaging the triceps.",
  },
  {
    name: "Standing Single Arm Overhead Press",
    note: "Targets Chest/Shoulders.",
    desc: "A guided movement primarily engaging the chest/shoulders.",
  },
  {
    name: "Dual Handle Single Leg Romanian Deadlift",
    note: "Targets Legs.",
    desc: "A guided movement primarily engaging the legs.",
  },
  {
    name: "Dual Handle Rack Split Squat",
    note: "Targets Legs.",
    desc: "A guided movement primarily engaging the legs.",
  },
  {
    name: "Standing Single Arm Biceps Curls",
    note: "Targets Biceps.",
    desc: "A guided movement primarily engaging the biceps.",
  },
  {
    name: "Bent Over Tricep Rope Overhead Triceps Extension",
    note: "Targets Triceps.",
    desc: "A guided movement primarily engaging the triceps.",
  },
  {
    name: "Standing Single Arm Low To High Chest Press",
    note: "Targets Chest/Shoulders.",
    desc: "A guided movement primarily engaging the chest/shoulders.",
  },
  {
    name: "Single Arm Rack Split Squat",
    note: "Targets Legs.",
    desc: "A guided movement primarily engaging the legs.",
  },
  {
    name: "Standing Single Arm Row",
    note: "Targets Back.",
    desc: "A guided movement primarily engaging the back.",
  },
  {
    name: "Single Arm Split Squat",
    note: "Targets Legs.",
    desc: "A guided movement primarily engaging the legs.",
  },
  {
    name: "Barbell Staggered Romanian Deadlift",
    note: "Targets Full Body.",
    desc: "A guided movement primarily engaging the full body.",
  },
  {
    name: "Barbell Single Leg Romanian Deadlift",
    note: "Targets Legs.",
    desc: "A guided movement primarily engaging the legs.",
  },
  {
    name: "Kneeling Cable Kickback",
    note: "Targets Full Body.",
    desc: "A guided movement primarily engaging the full body.",
  },
  {
    name: "Single Arm Single Leg Romanian Deadlift",
    note: "Targets Legs.",
    desc: "A guided movement primarily engaging the legs.",
  },
  {
    name: "Single Arm Staggered Romanian Deadlift",
    note: "Targets Full Body.",
    desc: "A guided movement primarily engaging the full body.",
  },
  {
    name: "Barbell Zercher Split Squat",
    note: "Targets Legs.",
    desc: "A guided movement primarily engaging the legs.",
  },
  {
    name: "Kneeling Tricep Rope Hammer Curl",
    note: "Targets Biceps.",
    desc: "A guided movement primarily engaging the biceps.",
  },
  {
    name: "Dual Handle Staggered Deadlift",
    note: "Targets Full Body.",
    desc: "A guided movement primarily engaging the full body.",
  },
  {
    name: "Half Kneeling Low To High Woodchops",
    note: "Targets Full Body.",
    desc: "A guided movement primarily engaging the full body.",
  },
  {
    name: "Belt Lateral Split Squat",
    note: "Targets Legs.",
    desc: "A guided movement primarily engaging the legs.",
  },
  {
    name: "Belt Reverse Lunges",
    note: "Targets Legs.",
    desc: "A guided movement primarily engaging the legs.",
  },
  {
    name: "Barbell Reverse Lunge",
    note: "Targets Legs.",
    desc: "A guided movement primarily engaging the legs.",
  },
  {
    name: "Dragon Bench",
    note: "Targets Full Body.",
    desc: "A guided movement primarily engaging the full body.",
  },
  {
    name: "Seated Leg Curl",
    note: "Targets Legs.",
    desc: "A guided movement primarily engaging the legs.",
  },
  {
    name: "Adductor Floor Upper",
    note: "Targets Full Body.",
    desc: "A guided movement primarily engaging the full body.",
  },
  {
    name: "Lunge Horizontal Press",
    note: "Targets Legs.",
    desc: "A guided movement primarily engaging the legs.",
  },
  {
    name: "Adductor Floor Low",
    note: "Targets Full Body.",
    desc: "A guided movement primarily engaging the full body.",
  },
  {
    name: "Unilateral Aerobic Skiing",
    note: "Targets Back.",
    desc: "A guided movement primarily engaging the back.",
  },
  {
    name: "HandsWU-8",
    note: "Targets Full Body.",
    desc: "A guided movement primarily engaging the full body.",
  },
  {
    name: "Pallof Press",
    note: "Targets Chest/Shoulders.",
    desc: "A guided movement primarily engaging the chest/shoulders.",
  },
  {
    name: "Standing Tricep Rope Upright Row",
    note: "Targets Triceps.",
    desc: "A guided movement primarily engaging the triceps.",
  },
  {
    name: "Standing Leg Curl",
    note: "Targets Legs.",
    desc: "A guided movement primarily engaging the legs.",
  },
  {
    name: "Abductor Floor",
    note: "Targets Full Body.",
    desc: "A guided movement primarily engaging the full body.",
  },
  {
    name: "Standing Cable External Rotation",
    note: "Targets Full Body.",
    desc: "A guided movement primarily engaging the full body.",
  },
  {
    name: "Prone Incline Dual Handle Straight Arm Push Down",
    note: "Targets Full Body.",
    desc: "A guided movement primarily engaging the full body.",
  },
  {
    name: "Standing Horizontal Woodchops",
    note: "Targets Full Body.",
    desc: "A guided movement primarily engaging the full body.",
  },
  {
    name: "Bent Over Tricep Rope Straight Arm Pulldown",
    note: "Targets Triceps.",
    desc: "A guided movement primarily engaging the triceps.",
  },
  {
    name: "Dual Handle Bulgarian Split Squat",
    note: "Targets Legs.",
    desc: "A guided movement primarily engaging the legs.",
  },
  {
    name: "Single Arm Single Leg Romanian Deadlift (L9)",
    note: "Targets Legs.",
    desc: "A guided movement primarily engaging the legs.",
  },
  {
    name: "Lateral Lunge Rear Fly",
    note: "Targets Legs.",
    desc: "A guided movement primarily engaging the legs.",
  },
  {
    name: "Prone Single Leg Curl",
    note: "Targets Legs.",
    desc: "A guided movement primarily engaging the legs.",
  },
  {
    name: "Dual Handle Split Squat",
    note: "Targets Legs.",
    desc: "A guided movement primarily engaging the legs.",
  },
  {
    name: "Hip Torsion",
    note: "Targets Hips/Glutes.",
    desc: "A guided movement primarily engaging the hips/glutes.",
  },
  {
    name: "Barbell Single Leg Hip Thrust",
    note: "Targets Legs.",
    desc: "A guided movement primarily engaging the legs.",
  },
  {
    name: "Adductor Lying",
    note: "Targets Full Body.",
    desc: "A guided movement primarily engaging the full body.",
  },
  {
    name: "Lateral Lunge With Pallof Press",
    note: "Targets Legs.",
    desc: "A guided movement primarily engaging the legs.",
  },
  {
    name: "Lunge With Horiz Pull And Overhead Press",
    note: "Targets Legs.",
    desc: "A guided movement primarily engaging the legs.",
  },
  {
    name: "Side Leg Pull",
    note: "Targets Legs.",
    desc: "A guided movement primarily engaging the legs.",
  },
  {
    name: "Bench Kickback",
    note: "Targets Full Body.",
    desc: "A guided movement primarily engaging the full body.",
  },
  {
    name: "Incline Bench Single Leg Curl",
    note: "Targets Legs.",
    desc: "A guided movement primarily engaging the legs.",
  },
  {
    name: "Standing Single Leg Calf Raise",
    note: "Targets Legs.",
    desc: "A guided movement primarily engaging the legs.",
  },
  {
    name: "Lateral Lunge Pallof Press With Rotation",
    note: "Targets Legs.",
    desc: "A guided movement primarily engaging the legs.",
  },
  {
    name: "Weighted Tiger Combination Stretch",
    note: "Targets Full Body.",
    desc: "A guided movement primarily engaging the full body.",
  },
  {
    name: "Weighted Tiger Pose",
    note: "Targets Full Body.",
    desc: "A guided movement primarily engaging the full body.",
  },
  {
    name: "Pes Pull",
    note: "Targets Full Body.",
    desc: "A guided movement primarily engaging the full body.",
  },
  {
    name: "Single Handle Low To High Woodchops",
    note: "Targets Full Body.",
    desc: "A guided movement primarily engaging the full body.",
  },
  {
    name: "Side Lying Knee Flexion With Adduction",
    note: "Targets Full Body.",
    desc: "A guided movement primarily engaging the full body.",
  },
  {
    name: "Kneeling Shoulder Internal Rotation",
    note: "Targets Full Body.",
    desc: "A guided movement primarily engaging the full body.",
  },
  {
    name: "Seated Single Arm Concentration Curl",
    note: "Targets Biceps.",
    desc: "A guided movement primarily engaging the biceps.",
  },
  {
    name: "Forearm Plank Cable Pull",
    note: "Targets Full Body.",
    desc: "A guided movement primarily engaging the full body.",
  },
  {
    name: "Quadriceps Flatbench",
    note: "Targets Back.",
    desc: "A guided movement primarily engaging the back.",
  },
  {
    name: "Handle Lateral Split Squat",
    note: "Targets Legs.",
    desc: "A guided movement primarily engaging the legs.",
  },
  {
    name: "Single Leg Ground Press High Position",
    note: "Targets Legs.",
    desc: "A guided movement primarily engaging the legs.",
  },
  {
    name: "Single Leg Pulldown Low Position",
    note: "Targets Legs.",
    desc: "A guided movement primarily engaging the legs.",
  },
  {
    name: "Frog Leg",
    note: "Targets Legs.",
    desc: "A guided movement primarily engaging the legs.",
  },
  {
    name: "Squat Position + Alternating Reverse Lunges",
    note: "Targets Legs.",
    desc: "A guided movement primarily engaging the legs.",
  },
  {
    name: "Seated Single Arm Lat Pulldown",
    note: "Targets Back.",
    desc: "A guided movement primarily engaging the back.",
  },
  {
    name: "Side Lying Hip Abduction",
    note: "Targets Hips/Glutes.",
    desc: "A guided movement primarily engaging the hips/glutes.",
  },
  {
    name: "Half Kneeling Tricep Rope Low To High Cable Pull",
    note: "Targets Triceps.",
    desc: "A guided movement primarily engaging the triceps.",
  },
  {
    name: "Dual Handle Reverse Lunge",
    note: "Targets Legs.",
    desc: "A guided movement primarily engaging the legs.",
  },
  {
    name: "Bent Over Single Arm Reverse Fly",
    note: "Targets Chest.",
    desc: "A guided movement primarily engaging the chest.",
  },
  {
    name: "Half Kneeling Tricep Rope High To Low Cable Pull",
    note: "Targets Triceps.",
    desc: "A guided movement primarily engaging the triceps.",
  },
  {
    name: "Leaning Single Arm Lateral Raise",
    note: "Targets Back.",
    desc: "A guided movement primarily engaging the back.",
  },
  {
    name: "Standing Single Arm Neutral Grip Front Raise",
    note: "Targets Shoulders.",
    desc: "A guided movement primarily engaging the shoulders.",
  },
  {
    name: "Standing Single Leg Hip Flexion",
    note: "Targets Legs.",
    desc: "A guided movement primarily engaging the legs.",
  },
  {
    name: "Standing High To Low Woodchops",
    note: "Targets Full Body.",
    desc: "A guided movement primarily engaging the full body.",
  },
  {
    name: "Dual Handle Staggered Romanian Deadlift",
    note: "Targets Full Body.",
    desc: "A guided movement primarily engaging the full body.",
  },
  {
    name: "Single Arm Bulgarian Split Squat",
    note: "Targets Legs.",
    desc: "A guided movement primarily engaging the legs.",
  },
  {
    name: "Half Kneeling Single Arm Underhand Lat Pulldown",
    note: "Targets Back.",
    desc: "A guided movement primarily engaging the back.",
  },
  {
    name: "Standing Single Leg Hip Extension",
    note: "Targets Legs.",
    desc: "A guided movement primarily engaging the legs.",
  },
  {
    name: "Standing Single Arm Underhand Triceps Push Down",
    note: "Targets Triceps.",
    desc: "A guided movement primarily engaging the triceps.",
  },
  {
    name: "Standing Single Arm Triceps Push Down",
    note: "Targets Triceps.",
    desc: "A guided movement primarily engaging the triceps.",
  },
  {
    name: "Standing Cable Hip Abduction Floor",
    note: "Targets Hips/Glutes.",
    desc: "A guided movement primarily engaging the hips/glutes.",
  },
  {
    name: "Belt Bulgarian Split Squat",
    note: "Targets Legs.",
    desc: "A guided movement primarily engaging the legs.",
  },
  {
    name: "Belt Split Squat",
    note: "Targets Legs.",
    desc: "A guided movement primarily engaging the legs.",
  },
  {
    name: "Single Arm Cross Body Triceps Push Down",
    note: "Targets Triceps.",
    desc: "A guided movement primarily engaging the triceps.",
  },
  {
    name: "Incline Bench Single Leg Reverse Crunch",
    note: "Targets Legs.",
    desc: "A guided movement primarily engaging the legs.",
  },
  {
    name: "Standing Single Arm Biceps Curl",
    note: "Targets Biceps.",
    desc: "A guided movement primarily engaging the biceps.",
  },
  {
    name: "Standing Single Arm Chest Press",
    note: "Targets Chest/Shoulders.",
    desc: "A guided movement primarily engaging the chest/shoulders.",
  },
  {
    name: "Half Kneeling Horizontal Woodchops",
    note: "Targets Full Body.",
    desc: "A guided movement primarily engaging the full body.",
  },
  {
    name: "Single Handle High Pull 45 Degrees",
    note: "Targets Full Body.",
    desc: "A guided movement primarily engaging the full body.",
  },
  {
    name: "Single Handle High Pull 60 Degrees",
    note: "Targets Full Body.",
    desc: "A guided movement primarily engaging the full body.",
  },
  {
    name: "Single Arm Romanian Deadlift",
    note: "Targets Full Body.",
    desc: "A guided movement primarily engaging the full body.",
  },
  {
    name: "Single Handle Low Pull 60 Degrees",
    note: "Targets Full Body.",
    desc: "A guided movement primarily engaging the full body.",
  },
  {
    name: "Iso Squat Cable Side Step",
    note: "Targets Legs.",
    desc: "A guided movement primarily engaging the legs.",
  },
  {
    name: "Quadriceps Cross Flatbench",
    note: "Targets Back.",
    desc: "A guided movement primarily engaging the back.",
  },
  {
    name: "Squat With Single Arm Chest Press",
    note: "Targets Legs.",
    desc: "A guided movement primarily engaging the legs.",
  },
  {
    name: "Bench Kneeling Bent Over Row",
    note: "Targets Back.",
    desc: "A guided movement primarily engaging the back.",
  },
  {
    name: "Side Plank Cable Press",
    note: "Targets Chest/Shoulders.",
    desc: "A guided movement primarily engaging the chest/shoulders.",
  },
  {
    name: "Incline Straight Leg Kickback",
    note: "Targets Legs.",
    desc: "A guided movement primarily engaging the legs.",
  },
  {
    name: "Standing Shoulder Internal Rotation",
    note: "Targets Full Body.",
    desc: "A guided movement primarily engaging the full body.",
  },
  {
    name: "Adductor Bench Upper",
    note: "Targets Full Body.",
    desc: "A guided movement primarily engaging the full body.",
  },
  {
    name: "Forearm Reverse Curl",
    note: "Targets Biceps.",
    desc: "A guided movement primarily engaging the biceps.",
  },
  {
    name: "Standing Cable Hip Abduction",
    note: "Targets Hips/Glutes.",
    desc: "A guided movement primarily engaging the hips/glutes.",
  },
  {
    name: "Leg Curl Floor",
    note: "Targets Legs.",
    desc: "A guided movement primarily engaging the legs.",
  },
  {
    name: "Seated Single Handle Low Pull",
    note: "Targets Full Body.",
    desc: "A guided movement primarily engaging the full body.",
  },
  {
    name: "Adductor Lying Top",
    note: "Targets Full Body.",
    desc: "A guided movement primarily engaging the full body.",
  },
  {
    name: "Single Arm Staggered Deadlift",
    note: "Targets Full Body.",
    desc: "A guided movement primarily engaging the full body.",
  },
  {
    name: "Leg Curl Cross Flatbench",
    note: "Targets Legs.",
    desc: "A guided movement primarily engaging the legs.",
  },
  {
    name: "Seated Single Handle High Pull",
    note: "Targets Full Body.",
    desc: "A guided movement primarily engaging the full body.",
  },
  {
    name: "Handle Side Bend",
    note: "Targets Full Body.",
    desc: "A guided movement primarily engaging the full body.",
  },
  {
    name: "Kneeling Bench Bent Leg Kickback",
    note: "Targets Legs.",
    desc: "A guided movement primarily engaging the legs.",
  },
  {
    name: "Barbell Bulgarian Split Squat",
    note: "Targets Legs.",
    desc: "A guided movement primarily engaging the legs.",
  },
  {
    name: "Pallof Press To Woodchops",
    note: "Targets Chest/Shoulders.",
    desc: "A guided movement primarily engaging the chest/shoulders.",
  },
  {
    name: "Standing Cable Kickback Floor",
    note: "Targets Full Body.",
    desc: "A guided movement primarily engaging the full body.",
  },
  {
    name: "Side Plank Row",
    note: "Targets Back.",
    desc: "A guided movement primarily engaging the back.",
  },
  {
    name: "Kneeling Incline Single Arm Lateral Raise",
    note: "Targets Back.",
    desc: "A guided movement primarily engaging the back.",
  },
  {
    name: "Forearm Rotation",
    note: "Targets Full Body.",
    desc: "A guided movement primarily engaging the full body.",
  },
  {
    name: "Kneeling Contralateral Resistance Swim",
    note: "Targets Back.",
    desc: "A guided movement primarily engaging the back.",
  },
  {
    name: "Incline Single Arm 45 Degrees Row",
    note: "Targets Back.",
    desc: "A guided movement primarily engaging the back.",
  },
  {
    name: "Pes Push",
    note: "Targets Full Body.",
    desc: "A guided movement primarily engaging the full body.",
  },
  {
    name: "Belt Alternating Reverse Lunge",
    note: "Targets Legs.",
    desc: "A guided movement primarily engaging the legs.",
  },
  {
    name: "Barbell Alternating Reverse Lunge",
    note: "Targets Legs.",
    desc: "A guided movement primarily engaging the legs.",
  },
  {
    name: "Dual Handle Alternating Reverse Lunge",
    note: "Targets Legs.",
    desc: "A guided movement primarily engaging the legs.",
  },
  {
    name: "Barbell Good Morning",
    note: "Targets Full Body.",
    desc: "A guided movement primarily engaging the full body.",
  },
  {
    name: "Supine Dual Handle Triceps Extension",
    note: "Targets Triceps.",
    desc: "A guided movement primarily engaging the triceps.",
  },
  {
    name: "Barbell Thruster",
    note: "Targets Full Body.",
    desc: "A guided movement primarily engaging the full body.",
  },
  {
    name: "Straight Arm Barbell Crunch Floor",
    note: "Targets Core.",
    desc: "A guided movement primarily engaging the core.",
  },
  {
    name: "Tricep Rope Romanian Deadlift",
    note: "Targets Triceps.",
    desc: "A guided movement primarily engaging the triceps.",
  },
  {
    name: "Tricep Rope Bent Over Row",
    note: "Targets Triceps.",
    desc: "A guided movement primarily engaging the triceps.",
  },
  {
    name: "Standing Dual Handle Triceps Push Down",
    note: "Targets Triceps.",
    desc: "A guided movement primarily engaging the triceps.",
  },
  {
    name: "Seated Dual Handle Underhand Row",
    note: "Targets Back.",
    desc: "A guided movement primarily engaging the back.",
  },
  {
    name: "Seated Barbell Reverse Grip Row",
    note: "Targets Back.",
    desc: "A guided movement primarily engaging the back.",
  },
  {
    name: "Supine Dual Handle Reverse Fly",
    note: "Targets Chest.",
    desc: "A guided movement primarily engaging the chest.",
  },
  {
    name: "Incline Tricep Rope Straight Arm Pushdown",
    note: "Targets Triceps.",
    desc: "A guided movement primarily engaging the triceps.",
  },
  {
    name: "Incline Supine Barbell Overhead Triceps Extension",
    note: "Targets Triceps.",
    desc: "A guided movement primarily engaging the triceps.",
  },
  {
    name: "Incline Prone Dual Handle Wide Row",
    note: "Targets Back.",
    desc: "A guided movement primarily engaging the back.",
  },
  {
    name: "Incline Bench Spider Curl",
    note: "Targets Biceps.",
    desc: "A guided movement primarily engaging the biceps.",
  },
  {
    name: "Incline Tricep Rope Triceps Push Down",
    note: "Targets Triceps.",
    desc: "A guided movement primarily engaging the triceps.",
  },
  {
    name: "Seated Barbell Row",
    note: "Targets Back.",
    desc: "A guided movement primarily engaging the back.",
  },
  {
    name: "Incline Prone Dual Handle Row",
    note: "Targets Back.",
    desc: "A guided movement primarily engaging the back.",
  },
  {
    name: "Kneeling Dual Handle Triceps Dips",
    note: "Targets Triceps.",
    desc: "A guided movement primarily engaging the triceps.",
  },
  {
    name: "Prone Incline Dual Handle Lateral Raise",
    note: "Targets Back.",
    desc: "A guided movement primarily engaging the back.",
  },
  {
    name: "Incline Dual Handle Front Raise",
    note: "Targets Shoulders.",
    desc: "A guided movement primarily engaging the shoulders.",
  },
  {
    name: "Kneeling Tricep Rope Overhead Triceps Extension",
    note: "Targets Triceps.",
    desc: "A guided movement primarily engaging the triceps.",
  },
  {
    name: "Seated Barbell Reverse Grip Lat Pulldown",
    note: "Targets Back.",
    desc: "A guided movement primarily engaging the back.",
  },
  {
    name: "Kneeling Tricep Rope Lat Pulldown",
    note: "Targets Triceps.",
    desc: "A guided movement primarily engaging the triceps.",
  },
  {
    name: "Kneeling Dual Handle High To Low Chest Fly",
    note: "Targets Chest.",
    desc: "A guided movement primarily engaging the chest.",
  },
  {
    name: "Tricep Rope Goblet Squat",
    note: "Targets Legs.",
    desc: "A guided movement primarily engaging the legs.",
  },
  {
    name: "Standing Tricep Rope Overhead Triceps Extension",
    note: "Targets Triceps.",
    desc: "A guided movement primarily engaging the triceps.",
  },
  {
    name: "Seated Barbell Calf Raise",
    note: "Targets Shoulders.",
    desc: "A guided movement primarily engaging the shoulders.",
  },
  {
    name: "Dual Handle Zottman Curl",
    note: "Targets Biceps.",
    desc: "A guided movement primarily engaging the biceps.",
  },
  {
    name: "Standing Tricep Rope Face Pull Middle Delts",
    note: "Targets Triceps.",
    desc: "A guided movement primarily engaging the triceps.",
  },
  {
    name: "Standing Tricep Rope Face Pull Rear Delts",
    note: "Targets Triceps.",
    desc: "A guided movement primarily engaging the triceps.",
  },
  {
    name: "Incline Supine Barbell Biceps Curl",
    note: "Targets Biceps.",
    desc: "A guided movement primarily engaging the biceps.",
  },
  {
    name: "Incline Dual Handle Chest Fly",
    note: "Targets Chest.",
    desc: "A guided movement primarily engaging the chest.",
  },
  {
    name: "Bent Over Dual Handle Wide Row",
    note: "Targets Back.",
    desc: "A guided movement primarily engaging the back.",
  },
  {
    name: "Incline Dual Handle Chest Fly Floor",
    note: "Targets Chest.",
    desc: "A guided movement primarily engaging the chest.",
  },
  {
    name: "Belt Squat",
    note: "Targets Legs.",
    desc: "A guided movement primarily engaging the legs.",
  },
  {
    name: "Handle Goblet Squat",
    note: "Targets Legs.",
    desc: "A guided movement primarily engaging the legs.",
  },
  {
    name: "Belt Hip Thrust",
    note: "Targets Hips/Glutes.",
    desc: "A guided movement primarily engaging the hips/glutes.",
  },
  {
    name: "Incline Dual Handle Chest Press",
    note: "Targets Chest/Shoulders.",
    desc: "A guided movement primarily engaging the chest/shoulders.",
  },
  {
    name: "Incline Dual Handle High To Low Chest Fly",
    note: "Targets Chest.",
    desc: "A guided movement primarily engaging the chest.",
  },
  {
    name: "Standing Dual Handle Arnold Press",
    note: "Targets Chest/Shoulders.",
    desc: "A guided movement primarily engaging the chest/shoulders.",
  },
  {
    name: "Standing Barbell Overhead Biceps Curl",
    note: "Targets Biceps.",
    desc: "A guided movement primarily engaging the biceps.",
  },
  {
    name: "Bent Over Barbell Straight Arm Pulldown",
    note: "Targets Back.",
    desc: "A guided movement primarily engaging the back.",
  },
  {
    name: "Bent Over Dual Handle Reverse Fly",
    note: "Targets Chest.",
    desc: "A guided movement primarily engaging the chest.",
  },
  {
    name: "Standing Dual Handle Front Raise",
    note: "Targets Shoulders.",
    desc: "A guided movement primarily engaging the shoulders.",
  },
  {
    name: "Standing Dual Handle Shoulder Press",
    note: "Targets Chest/Shoulders.",
    desc: "A guided movement primarily engaging the chest/shoulders.",
  },
  {
    name: "Bent Over Reverse Grip Barbell Row",
    note: "Targets Back.",
    desc: "A guided movement primarily engaging the back.",
  },
  {
    name: "Dual Handle Alternating Biceps Curl",
    note: "Targets Biceps.",
    desc: "A guided movement primarily engaging the biceps.",
  },
  {
    name: "Crunch From Top",
    note: "Targets Core.",
    desc: "A guided movement primarily engaging the core.",
  },
  {
    name: "Standing Tricep Rope Pull Through",
    note: "Targets Triceps.",
    desc: "A guided movement primarily engaging the triceps.",
  },
  {
    name: "Supine Leg Press",
    note: "Targets Legs.",
    desc: "A guided movement primarily engaging the legs.",
  },
  {
    name: "Dual Handle Standing Lower Cross Pull",
    note: "Targets Full Body.",
    desc: "A guided movement primarily engaging the full body.",
  },
  {
    name: "Seated Incline Dual Handle Biceps Curl",
    note: "Targets Biceps.",
    desc: "A guided movement primarily engaging the biceps.",
  },
  {
    name: "Lying Alternating Glute Bridges",
    note: "Targets Hips/Glutes.",
    desc: "A guided movement primarily engaging the hips/glutes.",
  },
  {
    name: "Seated Barbell Shoulder Press",
    note: "Targets Chest/Shoulders.",
    desc: "A guided movement primarily engaging the chest/shoulders.",
  },
  {
    name: "Standing Alternating Chest Press",
    note: "Targets Chest/Shoulders.",
    desc: "A guided movement primarily engaging the chest/shoulders.",
  },
  {
    name: "Bent Over Dual Handle Triceps Extension Floor",
    note: "Targets Triceps.",
    desc: "A guided movement primarily engaging the triceps.",
  },
  {
    name: "Incline Dual Handle Underhand Row",
    note: "Targets Back.",
    desc: "A guided movement primarily engaging the back.",
  },
  {
    name: "Alternating Straight Leg Press Down",
    note: "Targets Legs.",
    desc: "A guided movement primarily engaging the legs.",
  },
  {
    name: "Seated Alternating Shoulder Press",
    note: "Targets Chest/Shoulders.",
    desc: "A guided movement primarily engaging the chest/shoulders.",
  },
  {
    name: "Aerobic Skiing Alternate Arm Pulls",
    note: "Targets Full Body.",
    desc: "A guided movement primarily engaging the full body.",
  },
  {
    name: "Dual Handle Rhomboids Butterfly",
    note: "Targets Chest.",
    desc: "A guided movement primarily engaging the chest.",
  },
  {
    name: "Standing Dual Handle Chest Fly",
    note: "Targets Chest.",
    desc: "A guided movement primarily engaging the chest.",
  },
  {
    name: "Standing Barbell Upright Row",
    note: "Targets Back.",
    desc: "A guided movement primarily engaging the back.",
  },
  {
    name: "Dual Handle Calf Raises",
    note: "Targets Shoulders.",
    desc: "A guided movement primarily engaging the shoulders.",
  },
  {
    name: "Incline Dual Handle Cross Chest Fly",
    note: "Targets Chest.",
    desc: "A guided movement primarily engaging the chest.",
  },
  {
    name: "LegsWU-8",
    note: "Targets Legs.",
    desc: "A guided movement primarily engaging the legs.",
  },
  {
    name: "Bench Supine Cable Scissor Kick",
    note: "Targets Full Body.",
    desc: "A guided movement primarily engaging the full body.",
  },
  {
    name: "Seated Bent Over Dual Handle Reverse Fly",
    note: "Targets Chest.",
    desc: "A guided movement primarily engaging the chest.",
  },
  {
    name: "Standing Dual Handle Lateral Raise",
    note: "Targets Back.",
    desc: "A guided movement primarily engaging the back.",
  },
  {
    name: "Standing Dual Handle High To Low Chest Fly",
    note: "Targets Chest.",
    desc: "A guided movement primarily engaging the chest.",
  },
  {
    name: "Barbell Deadlift",
    note: "Targets Full Body.",
    desc: "A guided movement primarily engaging the full body.",
  },
  {
    name: "Dual Handle Romanian Deadlift",
    note: "Targets Full Body.",
    desc: "A guided movement primarily engaging the full body.",
  },
  {
    name: "Seated Dual Handle Pulldown",
    note: "Targets Back.",
    desc: "A guided movement primarily engaging the back.",
  },
  {
    name: "Seated Dual Handle Push Down",
    note: "Targets Full Body.",
    desc: "A guided movement primarily engaging the full body.",
  },
  {
    name: "Squat Position Alternating Reverse Lunges",
    note: "Targets Legs.",
    desc: "A guided movement primarily engaging the legs.",
  },
  {
    name: "Standing Dual Handle Row",
    note: "Targets Back.",
    desc: "A guided movement primarily engaging the back.",
  },
  {
    name: "Seated Barbell Lat Pulldown",
    note: "Targets Back.",
    desc: "A guided movement primarily engaging the back.",
  },
  {
    name: "Dual Handle Bent Over Row",
    note: "Targets Back.",
    desc: "A guided movement primarily engaging the back.",
  },
  {
    name: "LegsWU-5",
    note: "Targets Legs.",
    desc: "A guided movement primarily engaging the legs.",
  },
  {
    name: "Aerobic Skiing Straight Arms",
    note: "Targets Full Body.",
    desc: "A guided movement primarily engaging the full body.",
  },
  {
    name: "LegsWU-2",
    note: "Targets Legs.",
    desc: "A guided movement primarily engaging the legs.",
  },
  {
    name: "Seated Incline Cable Reverse Crunch",
    note: "Targets Core.",
    desc: "A guided movement primarily engaging the core.",
  },
  {
    name: "LegsWU-4",
    note: "Targets Legs.",
    desc: "A guided movement primarily engaging the legs.",
  },
  {
    name: "Alternating Arm Circles On A Incline Bench",
    note: "Targets Full Body.",
    desc: "A guided movement primarily engaging the full body.",
  },
  {
    name: "Hands Rotation In",
    note: "Targets Full Body.",
    desc: "A guided movement primarily engaging the full body.",
  },
  {
    name: "Barbell Romanian Deadlift",
    note: "Targets Full Body.",
    desc: "A guided movement primarily engaging the full body.",
  },
  {
    name: "HandsWU-6",
    note: "Targets Full Body.",
    desc: "A guided movement primarily engaging the full body.",
  },
  {
    name: "Barbell Hip Thrust",
    note: "Targets Hips/Glutes.",
    desc: "A guided movement primarily engaging the hips/glutes.",
  },
  {
    name: "LegsWU-1",
    note: "Targets Legs.",
    desc: "A guided movement primarily engaging the legs.",
  },
  {
    name: "LegsWU-3",
    note: "Targets Legs.",
    desc: "A guided movement primarily engaging the legs.",
  },
  {
    name: "Incline Barbell Front Raise",
    note: "Targets Shoulders.",
    desc: "A guided movement primarily engaging the shoulders.",
  },
  {
    name: "Standing Barbell Triceps Push Down",
    note: "Targets Triceps.",
    desc: "A guided movement primarily engaging the triceps.",
  },
  {
    name: "Standing Tricep Rope Hammer Curl",
    note: "Targets Biceps.",
    desc: "A guided movement primarily engaging the biceps.",
  },
  {
    name: "Hands Rotation Out",
    note: "Targets Full Body.",
    desc: "A guided movement primarily engaging the full body.",
  },
  {
    name: "Seated Incline Barbell Crunch",
    note: "Targets Core.",
    desc: "A guided movement primarily engaging the core.",
  },
  {
    name: "Barbell Bent Over Row",
    note: "Targets Back.",
    desc: "A guided movement primarily engaging the back.",
  },
  {
    name: "Standing Tricep Rope Triceps Pushdown",
    note: "Targets Triceps.",
    desc: "A guided movement primarily engaging the triceps.",
  },
  {
    name: "Standing Barbell Shoulder Press",
    note: "Targets Chest/Shoulders.",
    desc: "A guided movement primarily engaging the chest/shoulders.",
  },
  {
    name: "Seated Incline Alternating Biceps Curl",
    note: "Targets Biceps.",
    desc: "A guided movement primarily engaging the biceps.",
  },
  {
    name: "Standing Dual Handle Chest Press",
    note: "Targets Chest/Shoulders.",
    desc: "A guided movement primarily engaging the chest/shoulders.",
  },
  {
    name: "Seated Alternating Row",
    note: "Targets Back.",
    desc: "A guided movement primarily engaging the back.",
  },
  {
    name: "Standing Dual Handle Low To High Chest Fly",
    note: "Targets Chest.",
    desc: "A guided movement primarily engaging the chest.",
  },
  {
    name: "Standing Barbell Biceps Curl",
    note: "Targets Biceps.",
    desc: "A guided movement primarily engaging the biceps.",
  },
  {
    name: "Incline Dual Handle Shrug",
    note: "Targets Shoulders.",
    desc: "A guided movement primarily engaging the shoulders.",
  },
  {
    name: "Barbell Pull Over Fitball",
    note: "Targets Full Body.",
    desc: "A guided movement primarily engaging the full body.",
  },
  {
    name: "Y Front Raise",
    note: "Targets Shoulders.",
    desc: "A guided movement primarily engaging the shoulders.",
  },
  {
    name: "Crunch Lying From Bottom",
    note: "Targets Core.",
    desc: "A guided movement primarily engaging the core.",
  },
  {
    name: "Single Handle Low Pull 45 Degrees Left",
    note: "Targets Full Body.",
    desc: "A guided movement primarily engaging the full body.",
  },
  {
    name: "Supine Incline Dual Handle Lateral Raise",
    note: "Targets Back.",
    desc: "A guided movement primarily engaging the back.",
  },
  {
    name: "Barbell Front Squat",
    note: "Targets Legs.",
    desc: "A guided movement primarily engaging the legs.",
  },
  {
    name: "HandsWU-4",
    note: "Targets Full Body.",
    desc: "A guided movement primarily engaging the full body.",
  },
  {
    name: "Dual Handle Thruster",
    note: "Targets Full Body.",
    desc: "A guided movement primarily engaging the full body.",
  },
  {
    name: "Supine Incline Barbell Upright Row",
    note: "Targets Back.",
    desc: "A guided movement primarily engaging the back.",
  },
  {
    name: "Barbell Zercher Squat",
    note: "Targets Legs.",
    desc: "A guided movement primarily engaging the legs.",
  },
  {
    name: "Incline Dual Handle Low To High Chest Fly",
    note: "Targets Chest.",
    desc: "A guided movement primarily engaging the chest.",
  },
  {
    name: "Seated Alternating Lat Pulldown",
    note: "Targets Back.",
    desc: "A guided movement primarily engaging the back.",
  },
  {
    name: "Barbell Narrow Grip Bench Press",
    note: "Targets Chest/Shoulders.",
    desc: "A guided movement primarily engaging the chest/shoulders.",
  },
  {
    name: "DYAD",
    note: "Targets Full Body.",
    desc: "A guided movement primarily engaging the full body.",
  },
  {
    name: "Dual Handle Front Squat",
    note: "Targets Legs.",
    desc: "A guided movement primarily engaging the legs.",
  },
  {
    name: "Barbell Roman Chair Pull",
    note: "Targets Full Body.",
    desc: "A guided movement primarily engaging the full body.",
  },
  {
    name: "Dual Handle Deadlift",
    note: "Targets Full Body.",
    desc: "A guided movement primarily engaging the full body.",
  },
  {
    name: "Dual Handle Bench Press",
    note: "Targets Chest/Shoulders.",
    desc: "A guided movement primarily engaging the chest/shoulders.",
  },
  {
    name: "Dual Handle Rhomboids Butterfly Lower",
    note: "Targets Chest.",
    desc: "A guided movement primarily engaging the chest.",
  },
  {
    name: "Incline Barbell Bench Press",
    note: "Targets Chest/Shoulders.",
    desc: "A guided movement primarily engaging the chest/shoulders.",
  },
  {
    name: "Barbell Pull Over Cross Bench",
    note: "Targets Full Body.",
    desc: "A guided movement primarily engaging the full body.",
  },
  {
    name: "Barbell Upper Pull",
    note: "Targets Full Body.",
    desc: "A guided movement primarily engaging the full body.",
  },
  {
    name: "Standing Barbell Shrugs",
    note: "Targets Shoulders.",
    desc: "A guided movement primarily engaging the shoulders.",
  },
  {
    name: "HandsWU-2",
    note: "Targets Full Body.",
    desc: "A guided movement primarily engaging the full body.",
  },
  {
    name: "HandsWU-5",
    note: "Targets Full Body.",
    desc: "A guided movement primarily engaging the full body.",
  },
  {
    name: "Standing Alternating Row",
    note: "Targets Back.",
    desc: "A guided movement primarily engaging the back.",
  },
  {
    name: "Leg Rotation In",
    note: "Targets Legs.",
    desc: "A guided movement primarily engaging the legs.",
  },
  {
    name: "Incline Dual Handle Cross Reverse Fly",
    note: "Targets Chest.",
    desc: "A guided movement primarily engaging the chest.",
  },
  {
    name: "Standing Dual Handle Biceps Curl",
    note: "Targets Biceps.",
    desc: "A guided movement primarily engaging the biceps.",
  },
  {
    name: "Dual Handle Alternating Bench Press",
    note: "Targets Chest/Shoulders.",
    desc: "A guided movement primarily engaging the chest/shoulders.",
  },
  {
    name: "Aerobic Rowing",
    note: "Targets Back.",
    desc: "A guided movement primarily engaging the back.",
  },
  {
    name: "Kneeling Dual Handle Underhand Lat Pulldown",
    note: "Targets Back.",
    desc: "A guided movement primarily engaging the back.",
  },
  {
    name: "Breaststroke",
    note: "Targets Full Body.",
    desc: "A guided movement primarily engaging the full body.",
  },
  {
    name: "Seated Dual Handle Arnold Press",
    note: "Targets Chest/Shoulders.",
    desc: "A guided movement primarily engaging the chest/shoulders.",
  },
  {
    name: "Standing Dual Handle Low To High Chest Press",
    note: "Targets Chest/Shoulders.",
    desc: "A guided movement primarily engaging the chest/shoulders.",
  },
  {
    name: "HandsWU-3",
    note: "Targets Full Body.",
    desc: "A guided movement primarily engaging the full body.",
  },
  {
    name: "Single Handle Low Pull 45 Degrees Right",
    note: "Targets Full Body.",
    desc: "A guided movement primarily engaging the full body.",
  },
  {
    name: "Barbell Supine Straight Arm Pullover",
    note: "Targets Full Body.",
    desc: "A guided movement primarily engaging the full body.",
  },
  {
    name: "Standing Barbell Front Raise",
    note: "Targets Shoulders.",
    desc: "A guided movement primarily engaging the shoulders.",
  },
  {
    name: "Standing Alternating Shoulder Press",
    note: "Targets Chest/Shoulders.",
    desc: "A guided movement primarily engaging the chest/shoulders.",
  },
  {
    name: "Barbell Pull Over Slant Bench",
    note: "Targets Full Body.",
    desc: "A guided movement primarily engaging the full body.",
  },
  {
    name: "HandsWU-1",
    note: "Targets Full Body.",
    desc: "A guided movement primarily engaging the full body.",
  },
  {
    name: "HandsWU-7",
    note: "Targets Full Body.",
    desc: "A guided movement primarily engaging the full body.",
  },
  {
    name: "Wide Grip Barbell Row",
    note: "Targets Back.",
    desc: "A guided movement primarily engaging the back.",
  },
  {
    name: "Barbell Bench Press",
    note: "Targets Chest/Shoulders.",
    desc: "A guided movement primarily engaging the chest/shoulders.",
  },
  {
    name: "Narrow Grip Barbell Pull",
    note: "Targets Back.",
    desc: "A guided movement primarily engaging the back.",
  },
  {
    name: "Bent Over Barbell Wide Row",
    note: "Targets Back.",
    desc: "A guided movement primarily engaging the back.",
  },
  {
    name: "Seated Dual Handle Lateral Raise",
    note: "Targets Back.",
    desc: "A guided movement primarily engaging the back.",
  },
  {
    name: "Standing Barbell Overhead Triceps Extension",
    note: "Targets Triceps.",
    desc: "A guided movement primarily engaging the triceps.",
  },
  {
    name: "Barbell Pull Over Floor",
    note: "Targets Full Body.",
    desc: "A guided movement primarily engaging the full body.",
  },
  {
    name: "Dual Handle Slant Bench Press Lower",
    note: "Targets Chest/Shoulders.",
    desc: "A guided movement primarily engaging the chest/shoulders.",
  },
  {
    name: "Aerobic Skiing Bent Arms",
    note: "Targets Full Body.",
    desc: "A guided movement primarily engaging the full body.",
  },
  {
    name: "Standing Dual Handle Shrug",
    note: "Targets Shoulders.",
    desc: "A guided movement primarily engaging the shoulders.",
  },
  {
    name: "Barbell Squat",
    note: "Targets Legs.",
    desc: "A guided movement primarily engaging the legs.",
  },
  {
    name: "Seated Dual Handle Neutral Grip Row",
    note: "Targets Back.",
    desc: "A guided movement primarily engaging the back.",
  },
  {
    name: "Leg Rotation Out",
    note: "Targets Legs.",
    desc: "A guided movement primarily engaging the legs.",
  },
  {
    name: "Incline Barbell Straight Arm Pushdown",
    note: "Targets Full Body.",
    desc: "A guided movement primarily engaging the full body.",
  },
  {
    name: "Barbell Pull Over Behind The Neck",
    note: "Targets Full Body.",
    desc: "A guided movement primarily engaging the full body.",
  },
  {
    name: "Seated Dual Handle Front Raise",
    note: "Targets Shoulders.",
    desc: "A guided movement primarily engaging the shoulders.",
  },
  {
    name: "Supine Dual Handle Chest Fly",
    note: "Targets Chest.",
    desc: "A guided movement primarily engaging the chest.",
  },
  {
    name: "Aerobic Skiing (Seated Position)",
    note: "Targets Full Body.",
    desc: "A guided movement primarily engaging the full body.",
  },
];

export const SKILL_TREES: SkillTreeDef[] = [
  {
    id: "pull_mastery",
    title: "Strength: The Muscle Up",
    description: "Road to the ultimate calisthenics flex.",
    nodes: [
      { level: 1, title: "Dead Hang", criteria: "Hold for 30s" },
      { level: 2, title: "Active Hang", criteria: "3x10 Scapular Pulls" },
      { level: 3, title: "Inverted Rows", criteria: "3x8 (Body Horizontal)" },
      { level: 4, title: "Negative Pull-ups", criteria: "3x5 (5s descent)" },
      {
        level: 5,
        title: "Assisted Pull-up",
        criteria: "Band/Machine (Full ROM)",
      },
      { level: 6, title: "Chin-Up", criteria: "1 Strict Rep (Underhand)" },
      { level: 7, title: "THE PULL-UP", criteria: "1 Strict Rep (Overhand)" },
      { level: 8, title: "High Pull-Up", criteria: "Chest to Bar" },
      { level: 9, title: "Explosive Pull-Up", criteria: "Waist to Bar" },
      { level: 10, title: "THE MUSCLE UP", criteria: "1 Rep (Over the bar)" },
    ],
  },
  {
    id: "flexibility_mastery",
    title: "Mobility: The Front Split",
    description: "Unlocking hips and hamstrings.",
    nodes: [
      { level: 1, title: "Touch Knees", criteria: "Standing, Straight legs" },
      {
        level: 2,
        title: "Elephant Walks",
        criteria: "30 reps (Palms on block)",
      },
      { level: 3, title: "Touch Toes", criteria: "Fingertips to floor" },
      { level: 4, title: "Palms to Floor", criteria: "Full palm contact" },
      { level: 5, title: "Couch Stretch", criteria: "60s hold/side" },
      { level: 6, title: "Deep Lunge", criteria: "Hips below knee level" },
      { level: 7, title: "Pigeon Pose", criteria: "Shin parallel to front" },
      { level: 8, title: "Frog Stretch", criteria: "Inner thighs flat" },
      { level: 9, title: "Supported Split", criteria: "Using blocks/hands" },
      { level: 10, title: "FULL SPLITS", criteria: "Hips on floor" },
    ],
  },
  {
    id: "core_mastery",
    title: "Core: The L-Sit",
    description: "Iron abs protected spine.",
    nodes: [
      {
        level: 1,
        title: "Bird Dogs",
        criteria: "Perfect stability (No wobble)",
      },
      { level: 2, title: "Dead Bugs", criteria: "3x10 Slow & Controlled" },
      { level: 3, title: "Plank", criteria: "60s Hold (Good form)" },
      { level: 4, title: "Hollow Hold", criteria: "30s Hold (Low back glued)" },
      { level: 5, title: "Hanging Knee Raise", criteria: "3x10 (No swinging)" },
      {
        level: 6,
        title: "L-Sit Tuck",
        criteria: "10s Hold (Floor/Parallettes)",
      },
      { level: 7, title: "L-Sit One Leg", criteria: "5s Hold/side" },
      { level: 8, title: "Toes to Bar", criteria: "3 Strict Reps" },
      { level: 9, title: "L-Sit (Bent Knees)", criteria: "15s Hold" },
      { level: 10, title: "FULL L-SIT", criteria: "10s Hold (Legs Straight)" },
    ],
  },
  {
    id: "handstand_mastery",
    title: "Skill: The Handstand",
    description: "Inversion and balance.",
    nodes: [
      { level: 1, title: "Pike Pushup Hold", criteria: "30s Hold" },
      { level: 2, title: "Elevated Pike", criteria: "Feet on box/chair 30s" },
      { level: 3, title: "Wall Walk", criteria: "Walk feet up wall" },
      { level: 4, title: "Chest-to-Wall", criteria: "30s Hold (Nose to wall)" },
      { level: 5, title: "Back-to-Wall", criteria: "Balance drills" },
      { level: 6, title: "Crow Pose", criteria: "10s Balance" },
      { level: 7, title: "Wall Kick-Ups", criteria: "Consistent entry" },
      {
        level: 8,
        title: "Freestanding Kick-up",
        criteria: "Find balance point",
      },
      { level: 9, title: "Handstand", criteria: "5s Freestanding Hold" },
      {
        level: 10,
        title: "Handstand Pushup",
        criteria: "1 Rep (Wall Assisted)",
      },
    ],
  },
];

export const INITIAL_PLAN: Plan = {
  monday: {
    id: 'monday',
    title: "Monday: Full Body & Core Foundation",
    subtitle: "Focus: Controlled movements, protecting back.",
    sections: [
      {
        title: "Warmup",
        items: [
           { id: 'w1', name: "Rower or Elliptical", sets: "1", reps: "5 min", type: 'cardio', val: 5, unit: 'min', note: "Low intensity.", desc: "Get blood flowing." },
           { id: 'w2', name: "Cat-Cow Stretch", sets: "1", reps: "10 reps", type: 'mobility', val: 0, unit: '', note: "Gentle spinal movement.", desc: "Arch spine then round spine." },
           { id: 'w3', name: "Arm Circles", sets: "1", reps: "10 reps", type: 'mobility', val: 0, unit: '', note: "Forward & Backward.", desc: "Mobilize shoulders." },
           { id: 'w4', name: "Leg Swings", sets: "1", reps: "10 reps", type: 'mobility', val: 0, unit: '', note: "Front/Back & Side/Side.", desc: "Mobilize hips." }
        ]
      },
      {
        title: "Main Workout",
        items: [
          { id: 'm1', name: "Incline Push-ups", sets: "3", reps: "10-15 reps", type: 'strength', val: 0, unit: '', note: "Hands on bench.", desc: "Focus on chest reaching surface, full control." },
          { id: 'm2', name: "Assisted Rows (Gym Monster)", sets: "3", reps: "10-15 reps", type: 'strength', val: 0, unit: 'lbs', note: "Set cable low.", desc: "Grab handles, lean back slightly, pull to lower chest, squeeze shoulder blades." },
          { id: 'm3', name: "Dead Bugs", sets: "3", reps: "8-12/side", type: 'core', val: 0, unit: '', note: "Lower back pressed to floor.", desc: "Slowly extend opposite arm/leg without arching back." },
          { id: 'm4', name: "Glute Bridges", sets: "3", reps: "12-15 reps", type: 'strength', val: 0, unit: '', note: "Squeeze glutes.", desc: "Lift hips, form straight line shoulders to knees." },
          { id: 'm5', name: "Bodyweight Squats", sets: "3", reps: "10-15 reps", type: 'strength', val: 0, unit: '', note: "Chest up.", desc: "Controlled movement, only go as deep as comfortable with no back strain." }
        ]
      },
      {
        title: "Cool-down",
        items: [
            { id: 'cd1', name: "Child's Pose", sets: "1", reps: "60 sec", type: 'mobility', val: 60, unit: 'sec', note: "Rest for back.", desc: "Hips to heels." },
            { id: 'cd2', name: "Kneeling Hip Flexor Stretch", sets: "1", reps: "60 sec/side", type: 'mobility', val: 60, unit: 'sec', note: "One knee down.", desc: "Push hips forward gently." },
            { id: 'cd3', name: "Lying Hamstring Stretch", sets: "1", reps: "60 sec/side", type: 'mobility', val: 60, unit: 'sec', note: "Lie on back.", desc: "Lift leg straight up, pull gently." },
            { id: 'cd4', name: "Chest Stretch", sets: "1", reps: "60 sec/side", type: 'mobility', val: 60, unit: 'sec', note: "Hand against wall.", desc: "Gently rotate away." }
        ]
      }
    ]
  },
  tuesday: {
    id: 'tuesday',
    title: "Tuesday: Active Recovery & Flexibility",
    subtitle: "Steady cardio and deep stretching.",
    sections: [
        {
            title: "Cardio",
            items: [
                { id: 't1', name: "Elliptical or Rower", sets: "1", reps: "30-45 min", type: 'cardio', val: 45, unit: 'min', note: "Steady, moderate pace.", desc: "Zone 2 cardio." }
            ]
        },
        {
            title: "Flexibility Session",
            items: [
                { id: 't2', name: "Cat-Cow Stretch", sets: "1", reps: "10 reps", type: 'mobility', val: 0, unit: '', note: "Gentle spinal mobility.", desc: "" },
                { id: 't3', name: "Kneeling Hip Flexor Stretch", sets: "2", reps: "45-60 sec/side", type: 'mobility', val: 60, unit: 'sec', note: "Open hips.", desc: "" },
                { id: 't4', name: "Lying Hamstring Stretch", sets: "2", reps: "45-60 sec/side", type: 'mobility', val: 60, unit: 'sec', note: "Target hamstrings.", desc: "" },
                { id: 't5', name: "Pigeon Pose", sets: "2", reps: "45-60 sec/side", type: 'mobility', val: 60, unit: 'sec', note: "Go easy.", desc: "Modified if needed." },
                { id: 't6', name: "Child's Pose", sets: "1", reps: "2 min", type: 'mobility', val: 2, unit: 'min', note: "Relax.", desc: "" }
            ]
        }
    ]
  },
  wednesday: {
    id: 'wednesday',
    title: "Wednesday: Upper Body & Core Strength",
    subtitle: "Push/Pull balance.",
    sections: [
        {
            title: "Warmup",
            items: [
                { id: 'w_wed', name: "Rower (Warmup)", sets: "1", reps: "5 min", type: 'cardio', val: 5, unit: 'min', note: "Light pace.", desc: "" },
                { id: 'w_dyn', name: "Dynamic Stretches", sets: "1", reps: "Complete routine", type: 'mobility', val: 0, unit: '', note: "Cat-Cow, Arm Circles.", desc: "" }
            ]
        },
        {
            title: "Strength",
            items: [
                { id: 'w1', name: "Knee Push-ups", sets: "3", reps: "10-15 reps", type: 'strength', val: 0, unit: '', note: "Or Wall Push-ups.", desc: "Focus on slow, controlled descent – 2 seconds down." },
                { id: 'w2', name: "Gym Monster Lat Pulldown", sets: "3", reps: "10-15 reps", type: 'strength', val: 0, unit: 'lbs', note: "Feel the lats.", desc: "Pull to upper chest, control the release." },
                { id: 'w3', name: "Plank", sets: "3", reps: "30-60 sec", type: 'core', val: 60, unit: 'sec', note: "Knees or Full.", desc: "Straight line, brace core, no hip sagging." },
                { id: 'w4', name: "Side Plank", sets: "3", reps: "20-40 sec/side", type: 'core', val: 40, unit: 'sec', note: "Obliques.", desc: "Knees or Full." },
                { id: 'w5', name: "Bicep Curls (Gym Monster)", sets: "3", reps: "12-15 reps", type: 'strength', val: 0, unit: 'lbs', note: "Light weight.", desc: "Focus on slow, controlled movement." }
            ]
        },
        {
            title: "Cool-down",
            items: [
                { id: 'cd_wed', name: "Static Stretches", sets: "1", reps: "Routine", type: 'mobility', val: 0, unit: '', note: "See Monday cool-down.", desc: "" }
            ]
        }
    ]
  },
  thursday: {
    id: 'thursday',
    title: "Thursday: Lower Body & Core Stability",
    subtitle: "Leg endurance and stability.",
    sections: [
        {
            title: "Warmup",
            items: [
                { id: 'w_thu', name: "Elliptical (Warmup)", sets: "1", reps: "5 min", type: 'cardio', val: 5, unit: 'min', note: "", desc: "" },
                { id: 'w_dyn2', name: "Dynamic Stretches", sets: "1", reps: "Routine", type: 'mobility', val: 0, unit: '', note: "Leg swings focus.", desc: "" }
            ]
        },
        {
            title: "Strength",
            items: [
                { id: 'th1', name: "Goblet Squat", sets: "3", reps: "10-15 reps", type: 'strength', val: 0, unit: 'lbs', note: "Bodyweight or very light.", desc: "Perfect form, chest up, control movement." },
                { id: 'th2', name: "Wall Sit", sets: "3", reps: "30-60 sec", type: 'strength', val: 60, unit: 'sec', note: "Quad endurance.", desc: "No spinal load." },
                { id: 'th3', name: "Calf Raises", sets: "3", reps: "15-20 reps", type: 'strength', val: 0, unit: '', note: "Squeeze top.", desc: "Raise up onto balls of feet." },
                { id: 'th4', name: "Hollow Body Hold (Modified)", sets: "3", reps: "20-40 sec", type: 'core', val: 40, unit: 'sec', note: "Low back on floor.", desc: "Arms overhead, legs extended. Bend knees if needed." },
                { id: 'th5', name: "Bird Dog", sets: "3", reps: "8-12/side", type: 'core', val: 0, unit: '', note: "Neutral spine.", desc: "Extend opposite arm and leg, keep hips level." }
            ]
        },
        {
             title: "Cool-down",
             items: [
                 { id: 'cd_thu', name: "Static Stretches", sets: "1", reps: "Routine", type: 'mobility', val: 0, unit: '', note: "", desc: "" }
             ]
        }
    ]
  },
  friday: {
    id: 'friday',
    title: "Friday: Full Body & Calisthenics",
    subtitle: "Foundation for advanced moves.",
    sections: [
        {
            title: "Warmup",
            items: [
                { id: 'w_fri', name: "Rower/Elliptical", sets: "1", reps: "5 min", type: 'cardio', val: 5, unit: 'min', note: "", desc: "" },
                { id: 'w_dyn3', name: "Dynamic Stretches", sets: "1", reps: "Routine", type: 'mobility', val: 0, unit: '', note: "", desc: "" }
            ]
        },
        {
            title: "Strength",
            items: [
                { id: 'f1', name: "Incline Push-ups", sets: "3", reps: "8-12 reps", type: 'strength', val: 0, unit: '', note: "Lower incline if possible.", desc: "Perfect form." },
                { id: 'f2', name: "Assisted Pull-ups (Gym Monster)", sets: "3", reps: "5-8 reps", type: 'strength', val: 0, unit: 'lbs', note: "Controlled pull.", desc: "Slow eccentric phase. Squeeze back." },
                { id: 'f3', name: "Australian Rows (Gym Monster)", sets: "3", reps: "10-15 reps", type: 'strength', val: 0, unit: '', note: "Set cable high.", desc: "Lie back, pull chest to bar/handles." },
                { id: 'f4', name: "Bodyweight Lunges", sets: "3", reps: "8-10/leg", type: 'strength', val: 0, unit: '', note: "Controlled steps.", desc: "Keep torso upright." },
                { id: 'f5', name: "Reverse Crunches", sets: "3", reps: "10-15 reps", type: 'core', val: 0, unit: '', note: "Gentle.", desc: "Lift hips off floor, knees to chest. No momentum." }
            ]
        },
        {
             title: "Cool-down",
             items: [
                 { id: 'cd_fri', name: "Static Stretches", sets: "1", reps: "Routine", type: 'mobility', val: 0, unit: '', note: "", desc: "" }
             ]
        }
    ]
  },
  saturday: {
    id: 'saturday',
    title: "Saturday: Active Recovery & Deep Stretch",
    subtitle: "Targeting splits goals.",
    sections: [
        {
            title: "Cardio",
            items: [
                { id: 's1', name: "Elliptical or Rower", sets: "1", reps: "30-45 min", type: 'cardio', val: 45, unit: 'min', note: "Moderate pace.", desc: "" }
            ]
        },
        {
            title: "Deep Flexibility",
            items: [
                { id: 's2', name: "Cat-Cow Stretch", sets: "1", reps: "10 reps", type: 'mobility', val: 0, unit: '', note: "Warmup spine.", desc: "" },
                { id: 's3', name: "Kneeling Hip Flexor Stretch", sets: "2", reps: "45-90 sec/side", type: 'mobility', val: 90, unit: 'sec', note: "Deep hold.", desc: "" },
                { id: 's4', name: "Lying Hamstring Stretch", sets: "2", reps: "45-90 sec/side", type: 'mobility', val: 90, unit: 'sec', note: "Deep hold.", desc: "" },
                { id: 's5', name: "Pigeon Pose", sets: "2", reps: "45-90 sec/side", type: 'mobility', val: 90, unit: 'sec', note: "Deep hold.", desc: "" },
                { id: 's6', name: "Frog Pose", sets: "2", reps: "45-90 sec", type: 'mobility', val: 90, unit: 'sec', note: "Inner thighs.", desc: "Go gently." },
                { id: 's7', name: "Butterfly Stretch", sets: "2", reps: "45-90 sec", type: 'mobility', val: 90, unit: 'sec', note: "Push knees to floor.", desc: "" },
                { id: 's8', name: "Child's Pose", sets: "1", reps: "2 min", type: 'mobility', val: 2, unit: 'min', note: "Recover.", desc: "" }
            ]
        }
    ]
  },
  sunday: {
    id: 'sunday',
    title: "Sunday: Rest",
    subtitle: "Complete rest or light walk.",
    sections: []
  }
};
