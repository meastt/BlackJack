import { Platform } from 'react-native';

/**
 * Rebirth safety flag:
 * - iOS should always run in training mode for App Review compliance.
 * - Android can still expose simulator while refactor is in progress.
 */
export const trainingModeEnabled = Platform.OS === 'ios';
