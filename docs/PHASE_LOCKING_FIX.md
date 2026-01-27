# Phase Locking Fix - Implementation Reference

**Status**: In Progress
**Created**: 2026-01-26
**Objective**: Restore progressive mastery system by fixing phase locks and completing Phase 2 tracking

---

## Overview

This document tracks the implementation of fixes for the broken phase locking system and incomplete Phase 2 progression tracking.

### Changes Summary
- ✅ = Completed
- 🚧 = In Progress
- ⏳ = Not Started

---

## Task 1: Fix Phase 3 & 4 Locking in HomeScreen ✅

**File**: `/mobile/src/screens/Home/HomeScreen.tsx`

### Current Issues
- Line 127: Phase 3 hardcoded as `styles.cardActive`
- Line 151: Phase 4 hardcoded as `styles.cardActive`

### Changes Required

#### 1.1 Update useProgressStore destructuring (line 13)
**Before**:
```tsx
const { isPhaseUnlocked, phase0Complete, phase1Complete } = useProgressStore();
```

**After**:
```tsx
const { isPhaseUnlocked, phase0Complete, phase1Complete, phase3Complete, phase4Complete } = useProgressStore();
```

#### 1.2 Fix Phase 3 Card (lines 125-147)
**Before**:
```tsx
<TouchableOpacity
  style={[styles.card, styles.cardActive]}
  onPress={() => {
    Haptics.selectionAsync();
    navigation.navigate('Phase3TrueCount');
  }}
  activeOpacity={0.8}
>
  <View style={styles.cardGlow} />
  <View style={styles.cardContent}>
    <View style={[styles.iconContainer, styles.iconActive]}>
      <Text style={styles.icon}>➗</Text>
    </View>
    <View style={styles.textContainer}>
      <View style={styles.titleRow}>
        <Text style={styles.cardTitle}>Phase 3: True Count</Text>
      </View>
      <Text style={styles.cardDescription}>Adjust for remaining decks.</Text>
    </View>
    <Text style={styles.arrow}>›</Text>
  </View>
</TouchableOpacity>
```

**After**:
```tsx
<TouchableOpacity
  style={[styles.card, isPhaseUnlocked(3) ? styles.cardActive : styles.cardLocked]}
  onPress={() => {
    if (isPhaseUnlocked(3)) {
      Haptics.selectionAsync();
      navigation.navigate('Phase3TrueCount');
    }
  }}
  activeOpacity={0.8}
  disabled={!isPhaseUnlocked(3)}
>
  {isPhaseUnlocked(3) && <View style={styles.cardGlow} />}
  <View style={styles.cardContent}>
    <View style={[styles.iconContainer, isPhaseUnlocked(3) ? styles.iconActive : styles.iconLocked]}>
      <Text style={styles.icon}>➗</Text>
    </View>
    <View style={styles.textContainer}>
      <View style={styles.titleRow}>
        <Text style={[styles.cardTitle, !isPhaseUnlocked(3) && styles.textLocked]}>Phase 3: True Count</Text>
        {phase3Complete && <Text style={styles.checkMark}>✓</Text>}
      </View>
      <Text style={[styles.cardDescription, !isPhaseUnlocked(3) && styles.textLocked]}>Adjust for remaining decks.</Text>
    </View>
    {isPhaseUnlocked(3) ? (
      <Text style={styles.arrow}>›</Text>
    ) : (
      <Text style={styles.lockIcon}>🔒</Text>
    )}
  </View>
</TouchableOpacity>
```

#### 1.3 Fix Phase 4 Card (lines 149-172)
**Before**:
```tsx
<TouchableOpacity
  style={[styles.card, styles.cardActive]}
  onPress={() => {
    Haptics.selectionAsync();
    navigation.navigate('Phase4Betting');
  }}
  activeOpacity={0.8}
>
  <View style={styles.cardGlow} />
  <View style={styles.cardContent}>
    <View style={[styles.iconContainer, styles.iconActive]}>
      <Text style={styles.icon}>💰</Text>
    </View>
    <View style={styles.textContainer}>
      <View style={styles.titleRow}>
        <Text style={styles.cardTitle}>Phase 4: Betting</Text>
        <Text style={styles.checkMark}>NEW!</Text>
      </View>
      <Text style={styles.cardDescription}>Size your bets based on the advantage.</Text>
    </View>
    <Text style={styles.arrow}>›</Text>
  </View>
</TouchableOpacity>
```

**After**:
```tsx
<TouchableOpacity
  style={[styles.card, isPhaseUnlocked(4) ? styles.cardActive : styles.cardLocked]}
  onPress={() => {
    if (isPhaseUnlocked(4)) {
      Haptics.selectionAsync();
      navigation.navigate('Phase4Betting');
    }
  }}
  activeOpacity={0.8}
  disabled={!isPhaseUnlocked(4)}
>
  {isPhaseUnlocked(4) && <View style={styles.cardGlow} />}
  <View style={styles.cardContent}>
    <View style={[styles.iconContainer, isPhaseUnlocked(4) ? styles.iconActive : styles.iconLocked]}>
      <Text style={styles.icon}>💰</Text>
    </View>
    <View style={styles.textContainer}>
      <View style={styles.titleRow}>
        <Text style={[styles.cardTitle, !isPhaseUnlocked(4) && styles.textLocked]}>Phase 4: Betting</Text>
        {phase4Complete && <Text style={styles.checkMark}>✓</Text>}
      </View>
      <Text style={[styles.cardDescription, !isPhaseUnlocked(4) && styles.textLocked]}>Size your bets based on the advantage.</Text>
    </View>
    {isPhaseUnlocked(4) ? (
      <Text style={styles.arrow}>›</Text>
    ) : (
      <Text style={styles.lockIcon}>🔒</Text>
    )}
  </View>
</TouchableOpacity>
```

---

## Task 2: Add Phase 2 Tracking to Progress Store ✅

**File**: `/mobile/src/store/useProgressStore.ts`

### Changes Required

#### 2.1 Add SessionResult interface fields (already exists, no change needed)

#### 2.2 Add phase2 state to ProgressState interface (after line 29)
```typescript
// Phase 2 (Running Count) progress
phase2Sessions: SessionResult[];
phase2ConsecutiveMastery: number; // Need 2 at 90%+
```

#### 2.3 Add PHASE_2 mastery requirements (after line 60)
```typescript
PHASE_2: {
    CARDS_PER_SESSION: 52, // Full deck
    REQUIRED_ACCURACY: 0.90,
    CONSECUTIVE_SESSIONS: 2,
    TIME_LIMIT_SECONDS: 60,
},
```

#### 2.4 Add phase2 initial state (after line 78)
```typescript
phase2Sessions: [],
phase2ConsecutiveMastery: 0,
```

#### 2.5 Add phase2 tracking to addSessionResult (after line 111)
```typescript
if (phase === 'phase2') {
    const isMastery =
        result.accuracy >= MASTERY_REQUIREMENTS.PHASE_2.REQUIRED_ACCURACY &&
        result.timeInSeconds <= MASTERY_REQUIREMENTS.PHASE_2.TIME_LIMIT_SECONDS;

    const newConsecutive = isMastery ? state.phase2ConsecutiveMastery + 1 : 0;
    const isComplete = newConsecutive >= MASTERY_REQUIREMENTS.PHASE_2.CONSECUTIVE_SESSIONS;

    return {
        phase2Sessions: [...state.phase2Sessions, result],
        phase2ConsecutiveMastery: newConsecutive,
        phase2Complete: state.phase2Complete || isComplete,
        totalXP: state.totalXP + (isMastery ? 200 : 50) + (isComplete ? 500 : 0),
    };
}
```

#### 2.6 Add phase2 to resetProgress (after line 162)
```typescript
phase2Sessions: [],
phase2ConsecutiveMastery: 0,
```

#### 2.7 Add phase2 to getPhaseProgress (after line 196)
```typescript
if (phase === 2) {
    return {
        sessions: state.phase2Sessions.length,
        masteryProgress: state.phase2ConsecutiveMastery / MASTERY_REQUIREMENTS.PHASE_2.CONSECUTIVE_SESSIONS,
    };
}
```

---

## Task 3: Connect RunningCount Drill to Progress System ✅

**File**: `/mobile/src/components/drills/RunningCount.tsx`

### Changes Required

#### 3.1 Add imports
```typescript
import { useProgressStore } from '../../store/useProgressStore';
```

#### 3.2 Add state tracking
```typescript
const { addSessionResult, updateStreak } = useProgressStore();
const [sessionStartTime] = useState(Date.now());
const [totalCards, setTotalCards] = useState(0);
const [correctCount, setCorrectCount] = useState(true); // Track if count is correct
```

#### 3.3 Add completion handler
```typescript
const handleComplete = (userFinalCount: number, actualRunningCount: number) => {
    const timeInSeconds = Math.floor((Date.now() - sessionStartTime) / 1000);
    const accuracy = userFinalCount === actualRunningCount ? 1.0 : 0.0;

    addSessionResult('phase2', {
        phase: 'phase2',
        accuracy,
        cardsCompleted: totalCards,
        timeInSeconds,
        timestamp: Date.now(),
    });

    updateStreak();

    // Show results modal
    setShowResults(true);
};
```

#### 3.4 Add results modal (similar to BasicStrategy.tsx results modal)
- Show accuracy
- Show time taken
- Show mastery progress (X/2 sessions)
- Show XP earned

---

## Task 4: Create Phase2RunningCount Screen Wrapper ✅

**Note**: Navigation already configured. The `Phase2RunningCount` component in `/components/drills/RunningCount.tsx` already functions as both drill and screen wrapper with intro modal and progress tracking.

**New File**: `/mobile/src/screens/GuidedLearning/Phase2RunningCount.tsx`

### Implementation

```typescript
import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { RunningCount } from '../../components/drills/RunningCount';
import { PhaseIntroModal } from '../../components/PhaseIntroModal';
import { useProgressStore } from '../../store/useProgressStore';
import { colors } from '../../theme/colors';

export const Phase2RunningCountScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
    const [showIntro, setShowIntro] = useState(true);
    const { getPhaseProgress } = useProgressStore();
    const progress = getPhaseProgress(2);

    return (
        <SafeAreaView style={styles.container}>
            <PhaseIntroModal
                visible={showIntro}
                onClose={() => setShowIntro(false)}
                title="Phase 2: Running Count"
                description="Keep a running tally as cards are dealt. You'll see cards one at a time—add or subtract based on their Hi-Lo value."
                objectives={[
                    'Count through 52 cards without errors',
                    'Complete the deck in under 60 seconds',
                    'Pass 2 consecutive sessions at 90%+ accuracy',
                ]}
            />

            {/* Progress indicator */}
            <View style={styles.progressContainer}>
                <Text style={styles.progressText}>
                    Mastery Progress: {Math.floor(progress.masteryProgress * 100)}%
                </Text>
                <Text style={styles.sessionsText}>
                    Sessions Completed: {progress.sessions}
                </Text>
            </View>

            <RunningCount navigation={navigation} />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    progressContainer: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.glassBorder,
    },
    progressText: {
        color: colors.textPrimary,
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    sessionsText: {
        color: colors.textSecondary,
        fontSize: 14,
    },
});
```

#### 4.1 Verify navigation registration
Check `/mobile/src/navigation/AppNavigator.tsx` to ensure Phase2RunningCount screen is registered.

---

## Verification Checklist

After all tasks complete:

### Code Review ✅
- [x] HomeScreen imports phase3Complete and phase4Complete
- [x] Phase 3 card uses isPhaseUnlocked(3) check
- [x] Phase 4 card uses isPhaseUnlocked(4) check
- [x] useProgressStore has phase2 state fields
- [x] MASTERY_REQUIREMENTS includes PHASE_2
- [x] addSessionResult handles 'phase2' case
- [x] RunningCount calls addSessionResult on completion
- [x] Navigation has Phase2RunningCount registered

### Manual Testing Required

#### Fresh Start Test
- [ ] Clear app storage (Settings → Developer → Clear Data)
- [ ] Launch app and verify Phase 2 is locked (grayed out with 🔒)
- [ ] Complete Phase 0 (2 sessions at 95%+) → Phase 1 should unlock
- [ ] Complete Phase 1 (3 sessions at 95%+) → Phase 2 should unlock
- [ ] Verify Phases 3-4 remain locked (grayed, cannot tap)

#### Phase 2 Mastery Test
- [ ] Play Phase 2 drill with wrong answer → verify shows 0% accuracy
- [ ] Complete with 90%+ accuracy but takes > 60 seconds → verify "Mastery Progress: 0%"
- [ ] Complete 1 session at 100% in < 60s → verify "Mastery Progress: 50%"
- [ ] Complete 2nd consecutive session at 100% in < 60s → verify "Phase 2 Complete! Phase 3 Unlocked!"
- [ ] Return to home screen → verify Phase 2 has checkmark ✓
- [ ] Verify Phase 3 is now active (glowing, tappable)

#### Persistence Test
- [ ] Start Phase 2 drill
- [ ] Complete 1 mastery session (verify 50% progress)
- [ ] Close app completely (swipe away)
- [ ] Reopen app
- [ ] Navigate to Phase 2 → verify progress bar still shows 50%
- [ ] Complete 2nd mastery session → verify Phase 3 unlocks

#### Visual Test
- [ ] Locked phases (2, 3, 4 initially):
  - [ ] Show lock icon 🔒
  - [ ] Have dimmed/grayed text
  - [ ] Cannot be tapped (no navigation)
  - [ ] No glow effect
- [ ] Unlocked phases:
  - [ ] Show arrow › instead of lock
  - [ ] Have bright text
  - [ ] Have neon glow border
  - [ ] Navigate on tap
- [ ] Completed phases:
  - [ ] Show checkmark ✓ next to title
  - [ ] Still tappable to replay

#### Edge Cases
- [ ] Fail a session after 1 mastery session → verify progress resets to 0%
- [ ] Complete Phase 0 and 1, then reset progress → verify Phase 2-4 lock again
- [ ] Navigate back from Phase 2 drill mid-session → verify doesn't save incomplete data

---

## Implementation Summary

### All Tasks Completed ✅

**Files Modified:**
1. `/mobile/src/screens/Home/HomeScreen.tsx` (+53 lines)
   - Added phase3Complete and phase4Complete to store destructuring
   - Changed Phase 3 card to use isPhaseUnlocked(3) check with disabled state
   - Changed Phase 4 card to use isPhaseUnlocked(4) check with disabled state
   - Added completion checkmarks for both phases
   - Added lock icons when phases are locked

2. `/mobile/src/store/useProgressStore.ts` (+37 lines)
   - Added phase2Sessions and phase2ConsecutiveMastery state
   - Added PHASE_2 mastery requirements (90% accuracy, 60s time limit, 2 consecutive)
   - Added phase2 case to addSessionResult function
   - Added phase2 to resetProgress function
   - Added phase2 to getPhaseProgress function

3. `/mobile/src/components/drills/RunningCount.tsx` (+159 lines)
   - Added session result tracking with addSessionResult call
   - Added sessionSummary state for results display
   - Updated finishSession to calculate accuracy and time
   - Added comprehensive results modal with:
     - Accuracy and time statistics
     - Mastery progress bar
     - Phase completion celebration
     - Home/Again navigation buttons
   - Added styles for stats grid, progress bar, and buttons

**Navigation:** Already configured, no changes needed

**Total Code Changes:** ~250 new lines across 3 files

**Breaking Changes:** None - Fully backward compatible

---

## Expected Outcome

After implementation:
- ✅ Phase progression works correctly: 0 → 1 → 2 → 3 → 4
- ✅ Users cannot skip Phase 2 training
- ✅ Phase 2 mastery criteria enforced (90% accuracy, < 60s, 2 consecutive)
- ✅ Progress persists across app restarts
- ✅ HomeScreen visually reflects locked/unlocked/completed states

---

## Notes

- Actual changes: ~250 lines across 3 files (revised from initial estimate)
- No breaking changes to existing Phase 0-1 data
- AsyncStorage will auto-migrate with new phase2 fields
- All changes maintain existing design patterns
- **Ready for testing on device/simulator**

---

## Next Steps

1. **Test the changes:** Run the app on iOS/Android simulator or device
2. **Follow the verification checklist** above to ensure all phase locking works
3. **Commit changes:** Once tested, commit with message like:
   ```bash
   git add -A
   git commit -m "fix: restore phase locking system and complete Phase 2 tracking

   - Fix Phase 3 & 4 hardcoded unlocks in HomeScreen
   - Add Phase 2 progress tracking to store (90% accuracy, 60s time limit, 2 consecutive)
   - Connect RunningCount drill to progress system with results modal
   - Phase progression now works correctly: 0 → 1 → 2 → 3 → 4"
   ```

4. **Address remaining issues** from the app assessment:
   - Build casino game loop (Issue #3)
   - Integrate Phase 5 (Issue #4)
   - Add test suite (Issue #8)
