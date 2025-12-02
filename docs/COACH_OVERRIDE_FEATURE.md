# 🔄 Coach Workout Override Feature

**Status:** ✅ Implemented  
**Last Updated:** December 2, 2025  
**Purpose:** Allow users to replace an entire day's workout based on coach recommendations

---

## 📋 Overview

The Coach Override feature enables you to paste your coach's workout recommendations directly into GymPal, and the app will:

1. **Parse** the free-form text recommendation into structured exercises
2. **Extract** exercise names, sets, reps, duration, and notes
3. **Preview** the parsed exercises before applying
4. **Replace** the entire day's workout with the coach-recommended plan
5. **Preserve** the original workout as backup (in Firebase)
6. **Indicate** visually that a day has been overridden

### When You'd Use This

- **Recovery day adjustments**: "Let's go easy today - do 30min elliptical + mobility work"
- **Pain management**: "That shoulder is bothering you - here's a modified upper body day"
- **Bad day scenarios**: "You're tired/stressed - lighter session today focusing on mobility"
- **Real-time coaching**: Get updated workout recommendations based on your check-in

---

## 🎯 How to Use

### Step 1: Open a Workout Day
Navigate to any day of the week (Monday-Sunday) in the schedule view.

### Step 2: Click "Coach Override" Button
In the workout day header, you'll see a **purple "Coach Override"** button (with ⚡ icon) next to Back Saver and Skip Workout buttons.

### Step 3: Paste Coach Text
A modal will appear with a large text area. Copy and paste your coach's recommendation. Example:

```
1. **Elliptical:** 20-30 minutes at a very light, conversational pace.
2. **Mobility Focus:**
   * **Cat-Cow (5-10 reps):** Start on all fours, hands under shoulders...
   * **Bird-Dog (5-10 reps per side):** From all-fours position, extend opposite arm/leg...
```

### Step 4: Preview Exercises
Click **"Preview Exercises"** to see how the AI parsed your coach's recommendation. The app will:
- Extract exercise names
- Identify sets and reps
- Detect time durations (for cardio)
- Categorize by type (Cardio, Mobility, Core, Strength, Bodyweight)
- Group into logical sections

Review the preview. If it looks good, continue. If not, go back and paste adjusted text.

### Step 5: Apply Override
Click **"Apply Override"** to replace the day's workout. The app will:
- Save the original sections as backup
- Replace with coach-recommended sections
- Mark the day with a "Coach Override" badge
- Save everything to Firebase
- Show a success toast notification

---

## 🔧 Technical Implementation

### New Files

#### `services/overrideParser.ts`
Utility for parsing coach text recommendations into Exercise objects.

**Key Functions:**

```typescript
// Main parser - converts coach text to Exercise[]
parseCoachRecommendation(coachText: string): Exercise[]

// Groups exercises into logical sections by type
groupExercisesIntoSections(exercises: Exercise[]): Section[]
```

**Parsing Features:**
- Recognizes common formats: "3 sets x 10 reps", "5-10 reps", "3x10"
- Extracts time durations: "20-30 minutes", "45 sec", "3 hours"
- Auto-detects exercise type (cardio, mobility, core, strength, bodyweight)
- Handles bullet points, numbered lists, markdown formatting
- Extracts descriptions and notes from coach's text

**Exercise Type Detection:**
```
- Elliptical, treadmill, bike, rowing → "cardio"
- Cat-Cow, Bird-Dog, mobility, stretches → "mobility"
- Core, planks, abs → "core"
- Everything else → "bodyweight" (for calisthenics)
```

### Updated Files

#### `types.ts`
Added `WorkoutOverride` interface to store override metadata:

```typescript
export interface WorkoutOverride {
  dayKey: string;           // e.g., "monday"
  timestamp: string;         // ISO date when override was applied
  reason: string;            // The coach's full recommendation text
  originalSections: Section[]; // Backup of original sections
  overriddenSections: Section[]; // New sections from coach
}
```

Added to `UserData`:
```typescript
workoutOverrides?: Record<string, WorkoutOverride>;
```

#### `components/WorkoutView.tsx`
- Added "Coach Override" button to header
- Added modal with two-step flow: input → preview
- Added purple "Coach Override" badge when day is overridden
- Integrated parsing and preview functionality
- Passes override data to parent App component

**New Props:**
```typescript
currentOverride?: WorkoutOverride;  // Current day's override (if any)
onApplyOverride: (dayKey: string, coachText: string, sections: Section[]) => void;
```

#### `App.tsx`
- Added `workoutOverrides` state to track all overrides
- Added `applyCoachOverride()` handler function
- Loads overrides from Firebase on app start
- Passes override state and handler to WorkoutView

**Override Handler:**
```typescript
const applyCoachOverride = (dayKey: string, coachText: string, overrideSections: Section[]) => {
  // 1. Create WorkoutOverride record with backup
  // 2. Update plan with new sections
  // 3. Save to Firebase with timestamp
  // 4. Show success toast
}
```

---

## 📊 Data Flow

```
Coach Text Input
        ↓
[parseCoachRecommendation()]  ← services/overrideParser.ts
        ↓
Exercise[] (parsed exercises)
        ↓
[groupExercisesIntoSections()]
        ↓
Section[] (organized by type)
        ↓
User sees PREVIEW in modal
        ↓
User clicks "Apply Override"
        ↓
[applyCoachOverride()] in App.tsx
        ↓
WorkoutOverride object created with backup
        ↓
Firebase: { plan updated, workoutOverrides saved }
        ↓
Badge appears: "⚡ Coach Override"
```

---

## 🔄 Firebase Storage

Overrides are stored in Firestore under `userDat.workoutOverrides`:

```json
{
  "monday": {
    "dayKey": "monday",
    "timestamp": "2025-12-02T14:30:00Z",
    "reason": "Let's do a lighter day focusing on recovery...",
    "originalSections": [ /* backed up sections */ ],
    "overriddenSections": [ /* new coach sections */ ]
  }
}
```

This enables:
- ✅ Persistent storage across sessions
- ✅ Ability to revert (compare `originalSections` vs current)
- ✅ Coach recommendation history with timestamps
- ✅ Analytics on recovery vs intensity patterns

---

## 💡 Example: Real Coach Override

### Coach Message:
```
I'd recommend we adjust. We need to prioritize recovery and avoid 
overstressing your system, especially as we're focusing on building 
that foundational connective tissue strength. Let's do a lighter, 
more restorative session today:

1. **Elliptical:** 20-30 minutes at a very light, conversational pace. 
   Focus on gentle movement and getting blood flow, not pushing intensity.

2. **Mobility Focus:** Instead of any strenuous bodyweight work, 
   let's prioritize some gentle, spine-friendly mobility.
   
   * **Cat-Cow (5-10 reps):** Start on all fours, hands under shoulders, 
     knees under hips. Inhale, drop your belly, lift your tailbone and head 
     (Cow). Exhale, round your spine, tuck your chin to your chest (Cat). 
     Move slowly and fluidly.
   
   * **Bird-Dog (5-10 reps per side):** From all-fours, keep core braced. 
     Slowly extend right arm forward and left leg straight back, keeping 
     back flat and hips level. Hold briefly, return. Switch sides.

Listen to your body very closely today. If you feel any strain 
or increased tiredness, simply stop.
```

### Parsed Result:
The app would create:

```
Section: 🏃 Cardio / Warm-up
  - Elliptical
    Sets: 1 | Duration: 20-30 min
    Note: "Light, conversational pace..."

Section: 🧘 Mobility & Recovery
  - Cat-Cow
    Sets: 5-10 reps
    Desc: "Start on all fours, hands under shoulders..."
    
  - Bird-Dog
    Sets: 5-10 reps per side
    Desc: "From all-fours, keep core braced..."
```

---

## 🎨 UI/UX Elements

### Coach Override Button
- **Location**: Top right of workout day header (next to Back Saver & Skip)
- **Color**: Purple with ⚡ icon
- **States**: 
  - Enabled when day not yet completed
  - Only visible during active workout
  - Disabled if day already completed

### Override Modal
- **Step 1 (Input)**: Large textarea for pasting coach text
  - Character count shown
  - Placeholder with example format
  - "Preview" and "Cancel" buttons
  
- **Step 2 (Preview)**: Shows parsed exercises
  - Color-coded by section type
  - Shows sets/reps/duration for each
  - "Back" and "Apply Override" buttons

### Override Indicator
- **Purple badge** in header: "⚡ Coach Override"
- Appears only when `currentOverride` exists
- Persists until next week or manual revert

---

## 🔮 Future Enhancements

### Phase 2: Override Management
- **Revert to Original**: Button to swap back to original sections
- **Override History**: Timeline of all overrides this week with reasons
- **Edit Override**: Modify parsed exercises before applying

### Phase 3: AI Improvements
- **Smart parsing**: Use Gemini to validate extracted exercises against your history
- **Coach integration**: Coach AI analyzes override patterns and provides insights
- **Suggestions**: "This is the 3rd mobility day this week—great for L4/L5"

### Phase 4: Analytics
- **Override metrics**: Track how often overrides are used (fatigue? adaptation?)
- **Recovery correlation**: Compare weeks with many overrides vs baseline
- **Coach patterns**: Identify common recommendation types by time/season

---

## 🐛 Known Limitations

1. **Text parsing** is rule-based (not ML), so unusual formats may not parse perfectly
   - Solution: Preview before applying, adjust text format if needed
   
2. **No automatic duration conversion** for non-standard units
   - e.g., "30 minutes" works, but "half hour" may not
   
3. **Overrides replace entire day**—no partial override (yet)
   - Solution: Manually add/remove exercises after override if needed

4. **No undo button** post-apply (but original is backed up in Firebase)
   - Solution: Can manually swap back using `Section` backup data

---

## ✅ Testing Checklist

- [ ] Paste coach text with multiple exercise types
- [ ] Verify exercises are parsed into correct sections
- [ ] Apply override and confirm plan updates
- [ ] Refresh page and verify override persists
- [ ] Check Firebase: `userDat.workoutOverrides` has entry
- [ ] Override badge appears in header
- [ ] Can apply multiple overrides throughout week
- [ ] Original sections backed up correctly

---

## 📝 Summary

The Coach Override feature bridges the gap between AI coaching and real-time adaptation. When your fitness coach gives you a modified workout plan—whether for recovery, injury management, or performance—you can instantly integrate it into GymPal while preserving your original plan as a historical record.

This enables:
- **Real coaching workflows**: Coach can message updated plans, you apply them immediately
- **Flexibility**: Adapt to bad days, pain, or unexpected fatigue
- **Data preservation**: Original plans backed up for pattern analysis
- **Personalization**: Your app learns from deviations and patterns
