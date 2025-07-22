// Comprehensive Dark Mode Only Design System
// Optimized for low-light conditions with WCAG AA compliance

export const darkModeColors = {
  // Primary Background Hierarchy
  backgrounds: {
    primary: '#0a0c0e',      // Rich black - main app background
    secondary: '#1a1d21',    // Elevated surfaces (cards, modals)
    tertiary: '#242831',     // Interactive surfaces (buttons, inputs)
    quaternary: '#2d3139',   // Hover states, active elements
    overlay: '#0a0c0e99',    // Modal overlays (60% opacity)
  },

  // Text Color Hierarchy (WCAG AA Compliant)
  text: {
    primary: '#f8f9fa',      // High contrast - headings, important text (19.3:1 ratio)
    secondary: '#e9ecef',    // Medium contrast - body text, labels (17.4:1 ratio)
    tertiary: '#ced4da',     // Lower contrast - captions, metadata (12.6:1 ratio)
    quaternary: '#adb5bd',   // Subtle text - placeholders, disabled (8.2:1 ratio)
    inverse: '#0a0c0e',      // Text on light backgrounds
  },

  // Interactive Element Colors
  interactive: {
    primary: {
      default: '#38bdf8',    // Sky blue - primary actions
      hover: '#0ea5e9',      // Darker on hover
      active: '#0284c7',     // Even darker when pressed
      disabled: '#1e293b',   // Muted when disabled
    },
    secondary: {
      default: '#64748b',    // Slate - secondary actions
      hover: '#475569',      // Darker on hover
      active: '#334155',     // Even darker when pressed
      disabled: '#1e293b',   // Muted when disabled
    },
    accent: {
      default: '#06d6a0',    // Teal - accent elements
      hover: '#059669',      // Darker on hover
      active: '#047857',     // Even darker when pressed
      disabled: '#1e293b',   // Muted when disabled
    },
  },

  // Border Colors
  borders: {
    primary: '#374151',      // Main borders, dividers
    secondary: '#4b5563',    // Elevated borders
    interactive: '#6b7280',  // Input borders, interactive elements
    focus: '#38bdf8',        // Focus rings
    error: '#ef4444',        // Error states
    success: '#10b981',      // Success states
    warning: '#f59e0b',      // Warning states
  },

  // System State Colors (Optimized for dark backgrounds)
  states: {
    success: {
      background: '#064e3b',  // Dark green background
      border: '#10b981',      // Green border
      text: '#6ee7b7',        // Light green text
      icon: '#10b981',        // Green icons
    },
    warning: {
      background: '#451a03',  // Dark amber background
      border: '#f59e0b',      // Amber border
      text: '#fbbf24',        // Light amber text
      icon: '#f59e0b',        // Amber icons
    },
    error: {
      background: '#450a0a',  // Dark red background
      border: '#ef4444',      // Red border
      text: '#fca5a5',        // Light red text
      icon: '#ef4444',        // Red icons
    },
    info: {
      background: '#0c4a6e',  // Dark blue background
      border: '#3b82f6',      // Blue border
      text: '#93c5fd',        // Light blue text
      icon: '#3b82f6',        // Blue icons
    },
  },

  // Shadows for Depth (Optimized for dark mode)
  shadows: {
    small: '0 1px 3px rgba(0, 0, 0, 0.5)',
    medium: '0 4px 12px rgba(0, 0, 0, 0.4)',
    large: '0 8px 32px rgba(0, 0, 0, 0.3)',
    glow: '0 0 20px rgba(56, 189, 248, 0.3)', // Blue glow for interactive elements
  },

  // Glass Effect Colors
  glass: {
    background: 'rgba(26, 29, 33, 0.8)',
    border: 'rgba(55, 65, 81, 0.5)',
    backdrop: 'blur(12px)',
  },
} as const;

// Component-Specific Color Mappings
export const componentColors = {
  // Button Variants
  buttons: {
    primary: {
      background: darkModeColors.interactive.primary.default,
      backgroundHover: darkModeColors.interactive.primary.hover,
      backgroundActive: darkModeColors.interactive.primary.active,
      backgroundDisabled: darkModeColors.interactive.primary.disabled,
      text: darkModeColors.text.inverse,
      textDisabled: darkModeColors.text.quaternary,
      border: darkModeColors.interactive.primary.default,
      shadow: darkModeColors.shadows.medium,
      shadowHover: darkModeColors.shadows.glow,
    },
    secondary: {
      background: 'transparent',
      backgroundHover: darkModeColors.backgrounds.tertiary,
      backgroundActive: darkModeColors.backgrounds.quaternary,
      backgroundDisabled: darkModeColors.backgrounds.secondary,
      text: darkModeColors.text.secondary,
      textDisabled: darkModeColors.text.quaternary,
      border: darkModeColors.borders.secondary,
      borderHover: darkModeColors.borders.interactive,
      shadow: darkModeColors.shadows.small,
    },
    ghost: {
      background: 'transparent',
      backgroundHover: 'rgba(56, 189, 248, 0.1)',
      backgroundActive: 'rgba(56, 189, 248, 0.2)',
      text: darkModeColors.interactive.primary.default,
      textHover: darkModeColors.interactive.primary.hover,
      border: 'transparent',
    },
  },

  // Form Elements
  forms: {
    input: {
      background: darkModeColors.backgrounds.tertiary,
      backgroundFocus: darkModeColors.backgrounds.quaternary,
      backgroundDisabled: darkModeColors.backgrounds.secondary,
      text: darkModeColors.text.primary,
      placeholder: darkModeColors.text.quaternary,
      border: darkModeColors.borders.interactive,
      borderFocus: darkModeColors.borders.focus,
      borderError: darkModeColors.borders.error,
      shadow: darkModeColors.shadows.small,
      shadowFocus: `0 0 0 3px rgba(56, 189, 248, 0.2)`,
    },
    label: {
      text: darkModeColors.text.secondary,
      textRequired: darkModeColors.states.error.text,
    },
  },

  // Navigation
  navigation: {
    background: darkModeColors.backgrounds.secondary,
    border: darkModeColors.borders.primary,
    link: {
      text: darkModeColors.text.secondary,
      textHover: darkModeColors.text.primary,
      textActive: darkModeColors.interactive.primary.default,
      background: 'transparent',
      backgroundHover: darkModeColors.backgrounds.tertiary,
      backgroundActive: 'rgba(56, 189, 248, 0.1)',
    },
  },

  // Cards and Surfaces
  cards: {
    background: darkModeColors.backgrounds.secondary,
    backgroundHover: darkModeColors.backgrounds.tertiary,
    border: darkModeColors.borders.primary,
    borderHover: darkModeColors.borders.secondary,
    shadow: darkModeColors.shadows.medium,
    shadowHover: darkModeColors.shadows.large,
  },

  // Modals and Overlays
  modals: {
    backdrop: darkModeColors.backgrounds.overlay,
    background: darkModeColors.backgrounds.secondary,
    border: darkModeColors.borders.secondary,
    shadow: darkModeColors.shadows.large,
  },
} as const;

// Accessibility Guidelines
export const accessibilityGuidelines = {
  // Minimum contrast ratios (WCAG AA)
  contrastRatios: {
    normalText: 4.5,      // 14px and above
    largeText: 3.0,       // 18px+ or 14px+ bold
    uiComponents: 3.0,    // Buttons, form controls
    graphicalObjects: 3.0, // Icons, charts
  },

  // Focus indicators
  focus: {
    outlineColor: darkModeColors.borders.focus,
    outlineWidth: '2px',
    outlineStyle: 'solid',
    outlineOffset: '2px',
    boxShadow: `0 0 0 3px rgba(56, 189, 248, 0.2)`,
  },

  // Motion preferences
  reducedMotion: {
    transitionDuration: '0.01ms',
    animationDuration: '0.01ms',
    animationIterationCount: 1,
  },
} as const;

// Design Tokens for CSS Variables
export const designTokens = {
  // Spacing Scale (8px base)
  spacing: {
    xs: '0.25rem',    // 4px
    sm: '0.5rem',     // 8px
    md: '1rem',       // 16px
    lg: '1.5rem',     // 24px
    xl: '2rem',       // 32px
    '2xl': '3rem',    // 48px
    '3xl': '4rem',    // 64px
  },

  // Typography Scale
  typography: {
    fontFamily: {
      primary: "'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      mono: "'IBM Plex Mono', 'SF Mono', Monaco, 'Cascadia Code', monospace",
    },
    fontSize: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem', // 36px
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.6,
    },
  },

  // Border Radius Scale
  borderRadius: {
    none: '0',
    sm: '0.25rem',    // 4px
    md: '0.5rem',     // 8px
    lg: '0.75rem',    // 12px
    xl: '1rem',       // 16px
    '2xl': '1.5rem',  // 24px
    full: '9999px',
  },

  // Transition Timings
  transitions: {
    fast: '150ms ease-in-out',
    normal: '300ms ease-in-out',
    slow: '500ms ease-in-out',
  },
} as const;

export default darkModeColors;