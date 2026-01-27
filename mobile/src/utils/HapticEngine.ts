import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export const HapticEngine = {
  /**
   * Logic/Math Error: A single distinct medium impact.
   */
  triggerError: async () => {
    if (Platform.OS === 'web') return;
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  },

  /**
   * Heat Warning: A light impact (subtle warning).
   */
  triggerHeatWarning: async () => {
    if (Platform.OS === 'web') return;
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  },

  /**
   * Perfect Shoe/Certification: A light impact blip.
   */
  triggerSuccess: async () => {
    if (Platform.OS === 'web') return;
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  },

  /**
   * Standard UI Feedback (Button press etc)
   */
  triggerSelection: async () => {
    if (Platform.OS === 'web') return;
    await Haptics.selectionAsync();
  }
};
