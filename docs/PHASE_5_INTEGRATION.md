# Phase 5 Integration - Implementation Reference

**Status**: In Progress
**Created**: 2026-01-26
**Objective**: Integrate Deviations (Illustrious 18) into the guided learning progression as Phase 5

---

## Overview

The DrillDeviations component exists but is only accessible from "Practice & Tools". This task integrates it into the guided learning path as Phase 5, completing the 6-phase progression system (0-5).

### Changes Summary
- ✅ = Completed
- 🚧 = In Progress
- ⏳ = Not Started

---

## Task 1: Add Phase 5 to HomeScreen ✅

**File**: `/mobile/src/screens/Home/HomeScreen.tsx`

### Changes Required

#### 1.1 Import phase5Complete from store
Update line 13 to include phase5Complete:
```tsx
const { isPhaseUnlocked, phase0Complete, phase1Complete, phase3Complete, phase4Complete, phase5Complete } = useProgressStore();
```

#### 1.2 Add Phase 5 Card (after Phase 4, before Practice section)
Add new TouchableOpacity component:
```tsx
{/* Phase 5 - Deviations */}
<TouchableOpacity
  style={[styles.card, isPhaseUnlocked(5) ? styles.cardActive : styles.cardLocked]}
  onPress={() => {
    if (isPhaseUnlocked(5)) {
      Haptics.selectionAsync();
      navigation.navigate('Phase5Deviations');
    }
  }}
  activeOpacity={0.8}
  disabled={!isPhaseUnlocked(5)}
>
  {isPhaseUnlocked(5) && <View style={styles.cardGlow} />}
  <View style={styles.cardContent}>
    <View style={[styles.iconContainer, isPhaseUnlocked(5) ? styles.iconActive : styles.iconLocked]}>
      <Text style={styles.icon}>🎓</Text>
    </View>
    <View style={styles.textContainer}>
      <View style={styles.titleRow}>
        <Text style={[styles.cardTitle, !isPhaseUnlocked(5) && styles.textLocked]}>Phase 5: Deviations</Text>
        {phase5Complete && <Text style={styles.checkMark}>✓</Text>}
      </View>
      <Text style={[styles.cardDescription, !isPhaseUnlocked(5) && styles.textLocked]}>
        Master the Illustrious 18 strategy deviations.
      </Text>
    </View>
    {isPhaseUnlocked(5) ? (
      <Text style={styles.arrow}>›</Text>
    ) : (
      <Text style={styles.lockIcon}>🔒</Text>
    )}
  </View>
</TouchableOpacity>
```

---

## Task 2: Add Phase 5 Tracking to Progress Store ✅

**File**: `/mobile/src/store/useProgressStore.ts`

### Changes Required

#### 2.1 Add phase5 state (after phase2 progress, ~line 35)
```typescript
// Phase 5 (Deviations) progress
phase5Sessions: SessionResult[];
phase5ConsecutiveMastery: number; // Need 3 at 90%+
```

#### 2.2 Add PHASE_5 mastery requirements (after PHASE_2)
```typescript
PHASE_5: {
    SCENARIOS_PER_SESSION: 20, // 20 deviation scenarios
    REQUIRED_ACCURACY: 0.90,
    CONSECUTIVE_SESSIONS: 3,
},
```

#### 2.3 Add phase5 initial state
```typescript
phase5Sessions: [],
phase5ConsecutiveMastery: 0,
```

#### 2.4 Add phase5 tracking to addSessionResult
```typescript
if (phase === 'phase5') {
    const isMastery = result.accuracy >= MASTERY_REQUIREMENTS.PHASE_5.REQUIRED_ACCURACY;
    const newConsecutive = isMastery ? state.phase5ConsecutiveMastery + 1 : 0;
    const isComplete = newConsecutive >= MASTERY_REQUIREMENTS.PHASE_5.CONSECUTIVE_SESSIONS;

    return {
        phase5Sessions: [...state.phase5Sessions, result],
        phase5ConsecutiveMastery: newConsecutive,
        phase5Complete: state.phase5Complete || isComplete,
        totalXP: state.totalXP + (isMastery ? 200 : 50) + (isComplete ? 500 : 0),
    };
}
```

#### 2.5 Add phase5 to resetProgress
```typescript
phase5Sessions: [],
phase5ConsecutiveMastery: 0,
```

#### 2.6 Add phase5 to getPhaseProgress
```typescript
if (phase === 5) {
    return {
        sessions: state.phase5Sessions.length,
        masteryProgress: state.phase5ConsecutiveMastery / MASTERY_REQUIREMENTS.PHASE_5.CONSECUTIVE_SESSIONS,
    };
}
```

---

## Task 3: Create Phase5Deviations Screen Wrapper ✅

**New File**: `/mobile/src/screens/GuidedLearning/Phase5Deviations.tsx`

### Implementation

```typescript
import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { DrillDeviations } from '../../components/drills/DrillDeviations';
import { PhaseIntroModal } from '../../components/PhaseIntroModal';
import { colors } from '../../theme/colors';

export const Phase5Deviations: React.FC<{ navigation: any }> = ({ navigation }) => {
    const [showIntro, setShowIntro] = useState(true);

    return (
        <SafeAreaView style={styles.container}>
            <PhaseIntroModal
                visible={showIntro}
                onClose={() => setShowIntro(false)}
                title="Phase 5: Deviations"
                description="Master the Illustrious 18 - strategy deviations based on the True Count. These plays override Basic Strategy when the count is favorable."
                objectives={[
                    'Learn when to deviate from Basic Strategy',
                    'Memorize the top 5 Illustrious 18 plays',
                    'Pass 3 consecutive sessions at 90%+ accuracy',
                ]}
            />

            <DrillDeviations navigation={navigation} />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
});
```

---

## Task 4: Connect DrillDeviations to Progress System ✅

**File**: `/mobile/src/components/drills/DrillDeviations.tsx`

### Current State
The drill exists but needs to track sessions and report to progress store.

### Changes Required

#### 4.1 Add progress store import and state tracking
```typescript
import { useProgressStore, MASTERY_REQUIREMENTS } from '../../store/useProgressStore';

// Inside component:
const { addSessionResult, updateStreak, getPhaseProgress } = useProgressStore();
const [sessionStartTime, setSessionStartTime] = useState(Date.now());
const [showResults, setShowResults] = useState(false);
```

#### 4.2 Add completion handler
After session ends (when all scenarios complete):
```typescript
const handleSessionComplete = (correctCount: number, totalScenarios: number) => {
    const timeInSeconds = Math.floor((Date.now() - sessionStartTime) / 1000);
    const accuracy = correctCount / totalScenarios;

    addSessionResult('phase5', {
        phase: 'phase5',
        accuracy,
        cardsCompleted: totalScenarios,
        timeInSeconds,
        timestamp: Date.now(),
    });

    updateStreak();

    const progress = getPhaseProgress(5);
    const isMastery = accuracy >= MASTERY_REQUIREMENTS.PHASE_5.REQUIRED_ACCURACY;

    // Show results modal with progress
    setShowResults(true);
};
```

#### 4.3 Add results modal (similar to Phase 2)
Display:
- Accuracy
- Scenarios completed
- Mastery progress (X/3 sessions)
- Phase completion celebration

---

## Task 5: Update Navigation ✅

**File**: `/mobile/src/navigation/AppNavigator.tsx`

### Add Phase5Deviations screen
```typescript
import { Phase5Deviations } from '../screens/GuidedLearning/Phase5Deviations';

// Inside Stack.Navigator:
<Stack.Screen
    name="Phase5Deviations"
    component={Phase5Deviations}
    options={{
        title: 'Phase 5: Deviations',
        headerTitleAlign: 'center',
        headerShown: false,
    }}
/>
```

---

## Verification Checklist

### Code Review
- [ ] HomeScreen imports phase5Complete
- [ ] Phase 5 card uses isPhaseUnlocked(5)
- [ ] useProgressStore has phase5 state
- [ ] MASTERY_REQUIREMENTS includes PHASE_5
- [ ] addSessionResult handles 'phase5' case
- [ ] Phase5Deviations screen created
- [ ] Navigation registered
- [ ] DrillDeviations calls addSessionResult

### Manual Testing
- [ ] Complete Phase 4 → verify Phase 5 unlocks
- [ ] Phase 5 locked initially (grayed, cannot tap)
- [ ] Complete Phase 5 drill → verify progress tracked
- [ ] Complete 3 sessions at 90%+ → verify Phase 5 complete
- [ ] Verify checkmark appears on HomeScreen
- [ ] Persistence: close/reopen app, verify progress saved

---

## Expected Outcome

After implementation:
- ✅ 6-phase progression complete: 0 → 1 → 2 → 3 → 4 → 5
- ✅ Phase 5 locked until Phase 4 complete
- ✅ Deviations drill integrated into guided learning
- ✅ Progress tracking for Phase 5 mastery
- ✅ Completion unlocks Certification phase

---

## Implementation Summary

### All Tasks Completed ✅

**Files Modified:**
1. `/mobile/src/screens/Home/HomeScreen.tsx` (+37 lines)
   - Added phase5Complete to store destructuring
   - Added Phase 5 card with lock/unlock logic
   - Added completion checkmark display

2. `/mobile/src/store/useProgressStore.ts` (+32 lines)
   - Added phase5Sessions and phase5ConsecutiveMastery state
   - Added PHASE_5 mastery requirements (90% accuracy, 3 consecutive sessions)
   - Added phase5 tracking to addSessionResult, resetProgress, getPhaseProgress

3. `/mobile/src/screens/GuidedLearning/Phase5Deviations.tsx` (NEW, 33 lines)
   - Created screen wrapper with PhaseIntroModal
   - Wraps DrillDeviations component

4. `/mobile/src/components/drills/DrillDeviations.tsx` (+173 lines)
   - Added progress tracking with session results
   - Tracks 20 scenarios per session
   - Added HUD showing progress, accuracy during session
   - Added comprehensive results modal with mastery progress
   - Calls addSessionResult on completion

5. `/mobile/src/navigation/AppNavigator.tsx` (+8 lines)
   - Imported Phase5Deviations component
   - Registered Phase5Deviations screen route

**Total Code Changes:** ~283 new lines across 5 files

**Breaking Changes:** None - Fully backward compatible

---

## Notes

- Actual changes: ~283 lines across 5 files (close to estimate)
- DrillDeviations now tracks 20 scenarios per session with 90% accuracy requirement
- 3 consecutive mastery sessions required to complete Phase 5
- Maintains consistency with Phase 0-4 patterns
- No breaking changes to existing progress
- **Ready for testing on device/simulator**

---

## Next Steps

1. **Test the changes:** Run the app and verify Phase 5 integration
2. **Follow the verification checklist** to ensure phase locking works
3. **Once tested, commit changes:**
   ```bash
   git add -A
   git commit -m "feat: integrate Phase 5 (Deviations) into guided learning

   - Add Phase 5 card to HomeScreen with lock/unlock logic
   - Add Phase 5 progress tracking (90% accuracy, 3 consecutive sessions)
   - Create Phase5Deviations screen wrapper with intro modal
   - Connect DrillDeviations to progress system with session tracking
   - Add results modal showing mastery progress
   - Complete 6-phase progression: 0 → 1 → 2 → 3 → 4 → 5"
   ```

4. **Next priorities:**
   - Build casino game loop (enables certification)
   - Add test suite for mathematical integrity
   - Wire analytics dashboard
