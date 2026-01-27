// Protocol 21 Theme - Tactical, Precision, Stealth

export const colors = {
  // Primary Brand (The Edge)
  primary: '#6366f1',           // Electric Indigo - Main Action / Brand
  primaryDark: '#4f46e5',       // Darker Indigo (Press state)
  primaryLight: '#818cf8',      // Lighter Indigo (Highlight)

  // Backgrounds (The Void)
  background: '#050505',        // Void Black - Main App Background
  surface: '#1A1A1A',           // Tungsten - Card Surfaces, Panels
  surfaceLight: '#262626',      // Graphite - Borders, Separators, Lighter panels
  surfaceDark: '#0a0a0a',       // Deep overlay

  // Text Colors
  textPrimary: '#FFFFFF',       // Signal White
  textSecondary: '#9ca3af',     // Muted Platinum
  textTertiary: '#4b5563',      // Dark Grey (Subtle details)

  // Functional Status
  success: '#10b981',           // Emerald (Sharp win)
  error: '#ef4444',             // Red (Loss/Error)
  warning: '#f59e0b',           // Amber (Push/Warning)
  info: '#3b82f6',              // Azure (Information)

  // Card Suits (Stealth Deck)
  hearts: '#f43f5e',            // Rose - Clean Red
  diamonds: '#f43f5e',          // Rose - Clean Red
  clubs: '#e5e5e5',             // Silver - Clean White
  spades: '#e5e5e5',            // Silver - Clean White

  // Count Indicators (Heatmap)
  countHot: '#f43f5e',          // Rose (High count = Action)
  countCold: '#3b82f6',         // Blue (Low count = Cold)
  countNeutral: '#9ca3af',      // Platinum

  // UI Elements
  border: '#262626',            // Graphite
  borderActive: '#6366f1',      // Indigo Glow
  overlay: 'rgba(5, 5, 5, 0.85)', // Deep Void Overlay
  disabled: 'rgba(255, 255, 255, 0.1)',
};

export const gradients = {
  primary: ['#6366f1', '#4f46e5'],
  void: ['#050505', '#1a1a1a'],
  surface: ['#1A1A1A', '#262626'],
  danger: ['#ef4444', '#dc2626'],
  success: ['#10b981', '#059669'],
};

// Tactical Shadow (Sharp, not glowing)
export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 4,
  },
  glow: {
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
};

