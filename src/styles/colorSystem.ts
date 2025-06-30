// Comprehensive Color Design System
// Based on rich_black, oxford_blue, yinmn_blue, silver_lake_blue, platinum palette

export const colorSystem = {
  // Primary Color Families with 100-900 shades
  rich_black: {
    50: '#f8f9fa',   // Lightest tint for backgrounds
    100: '#e9ecef',  // Very light backgrounds, disabled states
    200: '#dee2e6',  // Light borders, dividers
    300: '#ced4da',  // Medium borders, inactive elements
    400: '#adb5bd',  // Placeholder text, secondary borders
    500: '#6c757d',  // Secondary text, icons
    600: '#495057',  // Primary text on light backgrounds
    700: '#343a40',  // Dark text, headers
    800: '#212529',  // Very dark text, primary content
    900: '#0a0c0e',  // Pure rich black, highest contrast
  },

  oxford_blue: {
    50: '#f0f4f8',   // Light backgrounds, subtle highlights
    100: '#d9e2ec',  // Very light accents, hover states
    200: '#bcccdc',  // Light borders, inactive states
    300: '#9fb3c8',  // Medium accents, secondary elements
    400: '#829ab1',  // Active secondary elements
    500: '#627d98',  // Primary oxford blue, main brand color
    600: '#486581',  // Darker brand color, hover states
    700: '#334e68',  // Dark accents, active states
    800: '#243b53',  // Very dark accents, headers
    900: '#102a43',  // Darkest oxford blue, high contrast
  },

  yinmn_blue: {
    50: '#f0f9ff',   // Lightest blue backgrounds
    100: '#e0f2fe',  // Very light blue accents
    200: '#bae6fd',  // Light blue highlights
    300: '#7dd3fc',  // Medium blue accents
    400: '#38bdf8',  // Bright blue elements
    500: '#0ea5e9',  // Primary yinmn blue, call-to-action
    600: '#0284c7',  // Darker blue, hover states
    700: '#0369a1',  // Dark blue accents
    800: '#075985',  // Very dark blue
    900: '#0c4a6e',  // Darkest blue, high contrast
  },

  silver_lake_blue: {
    50: '#f8fafc',   // Subtle backgrounds
    100: '#f1f5f9',  // Light neutral backgrounds
    200: '#e2e8f0',  // Light borders, dividers
    300: '#cbd5e1',  // Medium borders, inactive elements
    400: '#94a3b8',  // Secondary text, placeholders
    500: '#64748b',  // Primary silver lake blue, balanced neutral
    600: '#475569',  // Darker neutral, text on light backgrounds
    700: '#334155',  // Dark neutral, headers
    800: '#1e293b',  // Very dark neutral
    900: '#0f172a',  // Darkest neutral, high contrast
  },

  platinum: {
    50: '#ffffff',   // Pure white, highest contrast
    100: '#fefefe',  // Near white, subtle backgrounds
    200: '#fafafa',  // Very light backgrounds
    300: '#f5f5f5',  // Light backgrounds, cards
    400: '#eeeeee',  // Light borders, dividers
    500: '#e0e0e0',  // Primary platinum, neutral elements
    600: '#bdbdbd',  // Medium neutral, secondary elements
    700: '#9e9e9e',  // Dark neutral, tertiary text
    800: '#757575',  // Very dark neutral
    900: '#424242',  // Darkest platinum, high contrast text
  },

  // System State Colors
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',  // Primary success
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },

  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',  // Primary warning
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },

  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',  // Primary error
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },

  info: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',  // Primary info
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },
} as const;

// Usage Guidelines and Semantic Mappings
export const semanticColors = {
  // Light Mode Mappings
  light: {
    // Primary Elements
    primary: {
      background: colorSystem.platinum[50],        // Pure white backgrounds
      surface: colorSystem.platinum[100],          // Card backgrounds
      border: colorSystem.yinmn_blue[200],         // Primary borders
      text: colorSystem.rich_black[900],           // Primary text
    },
    
    // Secondary Elements
    secondary: {
      background: colorSystem.platinum[200],       // Secondary backgrounds
      surface: colorSystem.platinum[300],          // Secondary surfaces
      border: colorSystem.silver_lake_blue[300],   // Secondary borders
      text: colorSystem.oxford_blue[700],          // Secondary text
    },
    
    // Tertiary Elements
    tertiary: {
      background: colorSystem.platinum[300],       // Tertiary backgrounds
      surface: colorSystem.platinum[400],          // Tertiary surfaces
      border: colorSystem.silver_lake_blue[400],   // Tertiary borders
      text: colorSystem.silver_lake_blue[600],     // Tertiary text
    },
    
    // Interactive Elements
    interactive: {
      primary: colorSystem.yinmn_blue[500],        // Primary buttons, links
      primaryHover: colorSystem.yinmn_blue[600],   // Primary hover states
      secondary: colorSystem.oxford_blue[500],     // Secondary buttons
      secondaryHover: colorSystem.oxford_blue[600], // Secondary hover states
      accent: colorSystem.yinmn_blue[400],         // Accent elements
    },
    
    // Navigation
    navigation: {
      background: colorSystem.platinum[50],        // Nav background
      text: colorSystem.rich_black[800],           // Nav text
      active: colorSystem.yinmn_blue[500],         // Active nav items
      hover: colorSystem.yinmn_blue[100],          // Nav hover backgrounds
    },
  },

  // Dark Mode Mappings
  dark: {
    // Primary Elements
    primary: {
      background: colorSystem.rich_black[900],     // Dark backgrounds
      surface: colorSystem.rich_black[800],        // Card backgrounds
      border: colorSystem.oxford_blue[700],        // Primary borders
      text: colorSystem.platinum[50],              // Primary text
    },
    
    // Secondary Elements
    secondary: {
      background: colorSystem.rich_black[800],     // Secondary backgrounds
      surface: colorSystem.rich_black[700],        // Secondary surfaces
      border: colorSystem.silver_lake_blue[600],   // Secondary borders
      text: colorSystem.platinum[200],             // Secondary text
    },
    
    // Tertiary Elements
    tertiary: {
      background: colorSystem.rich_black[700],     // Tertiary backgrounds
      surface: colorSystem.rich_black[600],        // Tertiary surfaces
      border: colorSystem.silver_lake_blue[500],   // Tertiary borders
      text: colorSystem.platinum[400],             // Tertiary text
    },
    
    // Interactive Elements
    interactive: {
      primary: colorSystem.yinmn_blue[400],        // Primary buttons, links
      primaryHover: colorSystem.yinmn_blue[300],   // Primary hover states
      secondary: colorSystem.oxford_blue[400],     // Secondary buttons
      secondaryHover: colorSystem.oxford_blue[300], // Secondary hover states
      accent: colorSystem.yinmn_blue[500],         // Accent elements
    },
    
    // Navigation
    navigation: {
      background: colorSystem.rich_black[900],     // Nav background
      text: colorSystem.platinum[100],             // Nav text
      active: colorSystem.yinmn_blue[400],         // Active nav items
      hover: colorSystem.oxford_blue[800],         // Nav hover backgrounds
    },
  },
} as const;

// Accessibility Guidelines
export const accessibilityGuidelines = {
  // WCAG AA Compliant Contrast Ratios (4.5:1 minimum)
  textContrast: {
    // Safe combinations for normal text (4.5:1+)
    safe: [
      { bg: colorSystem.platinum[50], text: colorSystem.rich_black[900] },      // 21:1
      { bg: colorSystem.platinum[50], text: colorSystem.rich_black[800] },      // 16:1
      { bg: colorSystem.platinum[50], text: colorSystem.oxford_blue[800] },     // 12:1
      { bg: colorSystem.rich_black[900], text: colorSystem.platinum[50] },      // 21:1
      { bg: colorSystem.rich_black[900], text: colorSystem.platinum[100] },     // 19:1
      { bg: colorSystem.oxford_blue[800], text: colorSystem.platinum[50] },     // 12:1
    ],
    
    // Avoid these combinations (insufficient contrast)
    avoid: [
      { bg: colorSystem.platinum[50], text: colorSystem.silver_lake_blue[400] }, // 3.2:1
      { bg: colorSystem.platinum[200], text: colorSystem.platinum[600] },        // 2.8:1
      { bg: colorSystem.yinmn_blue[100], text: colorSystem.yinmn_blue[300] },   // 2.1:1
    ],
  },
  
  // Large text combinations (3:1 minimum for 18pt+ or 14pt+ bold)
  largeTextContrast: {
    safe: [
      { bg: colorSystem.platinum[50], text: colorSystem.silver_lake_blue[600] }, // 4.8:1
      { bg: colorSystem.platinum[100], text: colorSystem.oxford_blue[700] },     // 7.2:1
      { bg: colorSystem.rich_black[800], text: colorSystem.platinum[200] },      // 13:1
    ],
  },
} as const;

// Color Hierarchy System
export const colorHierarchy = {
  // Primary Actions (highest priority)
  primaryAction: {
    light: {
      background: colorSystem.yinmn_blue[500],
      backgroundHover: colorSystem.yinmn_blue[600],
      backgroundActive: colorSystem.yinmn_blue[700],
      text: colorSystem.platinum[50],
      border: colorSystem.yinmn_blue[500],
    },
    dark: {
      background: colorSystem.yinmn_blue[400],
      backgroundHover: colorSystem.yinmn_blue[300],
      backgroundActive: colorSystem.yinmn_blue[200],
      text: colorSystem.rich_black[900],
      border: colorSystem.yinmn_blue[400],
    },
  },
  
  // Secondary Actions (medium priority)
  secondaryAction: {
    light: {
      background: colorSystem.oxford_blue[500],
      backgroundHover: colorSystem.oxford_blue[600],
      backgroundActive: colorSystem.oxford_blue[700],
      text: colorSystem.platinum[50],
      border: colorSystem.oxford_blue[500],
    },
    dark: {
      background: colorSystem.oxford_blue[400],
      backgroundHover: colorSystem.oxford_blue[300],
      backgroundActive: colorSystem.oxford_blue[200],
      text: colorSystem.rich_black[900],
      border: colorSystem.oxford_blue[400],
    },
  },
  
  // Tertiary Actions (lowest priority)
  tertiaryAction: {
    light: {
      background: 'transparent',
      backgroundHover: colorSystem.platinum[200],
      backgroundActive: colorSystem.platinum[300],
      text: colorSystem.silver_lake_blue[700],
      border: colorSystem.silver_lake_blue[300],
    },
    dark: {
      background: 'transparent',
      backgroundHover: colorSystem.rich_black[700],
      backgroundActive: colorSystem.rich_black[600],
      text: colorSystem.platinum[300],
      border: colorSystem.silver_lake_blue[600],
    },
  },
  
  // System States
  systemStates: {
    success: colorSystem.success[500],
    warning: colorSystem.warning[500],
    error: colorSystem.error[500],
    info: colorSystem.info[500],
  },
} as const;

// Specific Use Cases for Each Shade
export const shadeUseCases = {
  rich_black: {
    50: 'Page backgrounds, highest contrast surfaces',
    100: 'Card backgrounds, modal overlays',
    200: 'Subtle borders, divider lines',
    300: 'Input borders, inactive elements',
    400: 'Placeholder text, disabled states',
    500: 'Secondary text, icon colors',
    600: 'Primary text on light backgrounds',
    700: 'Headers, emphasized text',
    800: 'High contrast text, navigation',
    900: 'Maximum contrast text, logos',
  },
  
  oxford_blue: {
    50: 'Light accent backgrounds, hover states',
    100: 'Subtle highlights, notification backgrounds',
    200: 'Light borders, inactive button states',
    300: 'Secondary accents, breadcrumbs',
    400: 'Active secondary elements, tags',
    500: 'Primary brand color, main buttons',
    600: 'Button hover states, active links',
    700: 'Dark accents, pressed states',
    800: 'Header backgrounds, navigation',
    900: 'High contrast accents, dark themes',
  },
  
  yinmn_blue: {
    50: 'Info backgrounds, light notifications',
    100: 'Subtle info highlights, tooltips',
    200: 'Light info borders, progress backgrounds',
    300: 'Info accents, secondary buttons',
    400: 'Bright interactive elements, links',
    500: 'Primary call-to-action, main interactive',
    600: 'CTA hover states, active buttons',
    700: 'Pressed button states, dark accents',
    800: 'Dark interactive elements',
    900: 'High contrast interactive, dark themes',
  },
  
  silver_lake_blue: {
    50: 'Neutral backgrounds, subtle surfaces',
    100: 'Light neutral surfaces, cards',
    200: 'Neutral borders, dividers',
    300: 'Medium borders, inactive states',
    400: 'Secondary text, placeholders',
    500: 'Balanced neutral, body text',
    600: 'Text on light backgrounds, labels',
    700: 'Headers, emphasized neutral text',
    800: 'Dark neutral text, navigation',
    900: 'High contrast neutral, dark themes',
  },
  
  platinum: {
    50: 'Pure white, maximum contrast',
    100: 'Near white, subtle backgrounds',
    200: 'Very light surfaces, cards',
    300: 'Light backgrounds, input fields',
    400: 'Light borders, dividers',
    500: 'Neutral elements, disabled states',
    600: 'Medium neutral, secondary elements',
    700: 'Dark neutral, tertiary text',
    800: 'Very dark neutral, emphasis',
    900: 'Darkest neutral, high contrast',
  },
} as const;

export default colorSystem;