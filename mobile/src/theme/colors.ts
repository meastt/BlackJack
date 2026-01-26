// Vegas Nights Theme - Neon tubing with glassmorphism

export const colors = {
  // Primary palette - Vegas Neon
  primary: '#1A1A1A',           // Dark charcoal
  secondary: '#2D2D2D',         // Lighter charcoal
  accent: '#FF2D7C',            // Hot pink neon
  accentBlue: '#00D4FF',        // Electric cyan
  accentGreen: '#00FF88',       // Neon green
  accentPurple: '#A855F7',      // Neon purple
  accentYellow: '#FFE500',      // Vegas gold
  success: '#00FF88',           // Neon green

  // Background colors
  background: '#121212',        // Near black
  surface: 'rgba(255, 255, 255, 0.08)',      // Glass surface
  surfaceLight: 'rgba(255, 255, 255, 0.12)', // Lighter glass
  surfaceDark: 'rgba(0, 0, 0, 0.4)',         // Dark glass overlay

  // Glass effect colors
  glassBorder: 'rgba(255, 255, 255, 0.15)',
  glassHighlight: 'rgba(255, 255, 255, 0.1)',

  // Text colors
  textPrimary: '#FFFFFF',
  textSecondary: 'rgba(255, 255, 255, 0.7)',
  textMuted: 'rgba(255, 255, 255, 0.4)',

  // Card suits - Neon style
  hearts: '#FF2D7C',            // Hot pink
  diamonds: '#FF2D7C',          // Hot pink
  clubs: '#FFFFFF',
  spades: '#FFFFFF',

  // Status colors - Neon
  correct: '#00FF88',           // Neon green
  incorrect: '#FF2D7C',         // Hot pink
  warning: '#FFE500',           // Vegas gold

  // Count indicators - Neon
  positiveCount: '#00FF88',     // Neon green
  negativeCount: '#FF2D7C',     // Hot pink
  neutralCount: '#00D4FF',      // Electric cyan

  // UI elements
  border: 'rgba(255, 255, 255, 0.1)',
  borderGlow: 'rgba(0, 212, 255, 0.5)',
  overlay: 'rgba(0, 0, 0, 0.8)',
  disabled: 'rgba(255, 255, 255, 0.2)',

  // Neon glow colors (for shadows/effects)
  glowPink: 'rgba(255, 45, 124, 0.6)',
  glowCyan: 'rgba(0, 212, 255, 0.6)',
  glowGreen: 'rgba(0, 255, 136, 0.6)',
  glowPurple: 'rgba(168, 85, 247, 0.6)',
};

export const gradients = {
  neonPink: ['#FF2D7C', '#FF6B9D'],
  neonCyan: ['#00D4FF', '#00A3CC'],
  neonGreen: ['#00FF88', '#00CC6A'],
  neonPurple: ['#A855F7', '#7C3AED'],
  darkGlass: ['rgba(30, 30, 30, 0.9)', 'rgba(20, 20, 20, 0.95)'],
};

// Glassmorphism style helper
export const glassStyle = {
  backgroundColor: colors.surface,
  borderWidth: 1,
  borderColor: colors.glassBorder,
  // Note: For full glass effect, also add blur using expo-blur's BlurView
};

// Neon glow shadow helper
export const neonGlow = (color: string) => ({
  shadowColor: color,
  shadowOffset: { width: 0, height: 0 },
  shadowOpacity: 0.8,
  shadowRadius: 10,
  elevation: 10,
});
