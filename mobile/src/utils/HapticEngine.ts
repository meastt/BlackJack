import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export const HapticEngine = {
  /**
   * Logic/Math Error: A 'heavy' double-vibration (punishment loop).
   */
  triggerError: async () => {
    if (Platform.OS === 'web') return;
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    // Double hit for emphasis (simulated by delay if needed, or just heavy impact)
    // On iOS, Error is already quite distinct.
    // For a "heavy double", we might chain two impacts.
    setTimeout(() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }, 100);
  },

  /**
   * Heat Warning: A 'long' slow pulse (anxiety/tension).
   * Note: 'Long' vibration is limited on some platforms/APIs.
   */
  triggerHeatWarning: async () => {
    if (Platform.OS === 'web') return;
    // Warning notification is usually longer/stronger than success
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  },

  /**
   * Perfect Shoe/Certification: A 'light' rapid triple-pulse (reward loop).
   */
  triggerSuccess: async () => {
    if (Platform.OS === 'web') return;
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setTimeout(() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }, 100);
    setTimeout(() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }, 200);
  },

  /**
   * Standard UI Feedback (Button press etc)
   */
  triggerSelection: async () => {
    if (Platform.OS === 'web') return;
    await Haptics.selectionAsync();
  }
};
