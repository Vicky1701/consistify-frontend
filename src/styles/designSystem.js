// Design System Constants for Consistify

// Color Palette
export const COLORS = {
  primary: {
    50: "#eff6ff",
    100: "#dbeafe",
    200: "#bfdbfe",
    300: "#93c5fd",
    400: "#60a5fa",
    500: "#3b82f6",
    600: "#2563eb",
    700: "#1d4ed8",
    800: "#1e40af",
    900: "#1e3a8a",
  },
  secondary: {
    50: "#f8fafc",
    100: "#f1f5f9",
    200: "#e2e8f0",
    300: "#cbd5e1",
    400: "#94a3b8",
    500: "#64748b",
    600: "#475569",
    700: "#334155",
    800: "#1e293b",
    900: "#0f172a",
  },
  success: {
    50: "#ecfdf5",
    100: "#d1fae5",
    200: "#a7f3d0",
    300: "#6ee7b7",
    400: "#34d399",
    500: "#10b981",
    600: "#059669",
    700: "#047857",
    800: "#065f46",
    900: "#064e3b",
  },
  warning: {
    50: "#fffbeb",
    100: "#fef3c7",
    200: "#fde68a",
    300: "#fcd34d",
    400: "#fbbf24",
    500: "#f59e0b",
    600: "#d97706",
    700: "#b45309",
    800: "#92400e",
    900: "#78350f",
  },
  error: {
    50: "#fef2f2",
    100: "#fee2e2",
    200: "#fecaca",
    300: "#fca5a5",
    400: "#f87171",
    500: "#ef4444",
    600: "#dc2626",
    700: "#b91c1c",
    800: "#991b1b",
    900: "#7f1d1d",
  },
  gradient: {
    primary: "linear-gradient(90deg, #2563eb 0%, #3b82f6 100%)",
    primaryHover: "linear-gradient(90deg, #1e40af 0%, #2563eb 100%)",
    secondary: "linear-gradient(90deg, #64748b 0%, #475569 100%)",
    success: "linear-gradient(90deg, #059669 0%, #10b981 100%)",
    card: "linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)",
    hero: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  },
};

// Typography
export const TYPOGRAPHY = {
  fontFamily: {
    primary:
      '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    mono: '"Monaco", "Menlo", "Ubuntu Mono", monospace',
  },
  fontSize: {
    xs: "0.75rem",
    sm: "0.875rem",
    base: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
    "2xl": "1.5rem",
    "3xl": "1.875rem",
    "4xl": "2.25rem",
    "5xl": "3rem",
  },
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
};

// Shadows
export const SHADOWS = {
  xs: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  sm: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
  md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
  xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
  card: "0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)",
  cardHover: "0 4px 8px rgba(0, 0, 0, 0.12), 0 2px 4px rgba(0, 0, 0, 0.08)",
};

// Spacing (using 8px base unit)
export const SPACING = {
  xs: "0.5rem", // 8px
  sm: "0.75rem", // 12px
  md: "1rem", // 16px
  lg: "1.5rem", // 24px
  xl: "2rem", // 32px
  "2xl": "3rem", // 48px
  "3xl": "4rem", // 64px
  "4xl": "6rem", // 96px
  "5xl": "8rem", // 128px
};

// Border Radius
export const BORDER_RADIUS = {
  none: "0",
  sm: "0.125rem",
  md: "0.375rem",
  lg: "0.5rem",
  xl: "0.75rem",
  "2xl": "1rem",
  "3xl": "1.5rem",
  full: "9999px",
};

// Animation Durations
export const ANIMATIONS = {
  fast: "150ms",
  normal: "250ms",
  slow: "350ms",
  slower: "500ms",
};

// Breakpoints
export const BREAKPOINTS = {
  xs: 0,
  sm: 600,
  md: 900,
  lg: 1200,
  xl: 1536,
};

// Z-Index Scale
export const Z_INDEX = {
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  backdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
};

// Component Specific Styles
export const COMPONENTS = {
  card: {
    background: COLORS.gradient.card,
    borderRadius: BORDER_RADIUS.xl,
    boxShadow: SHADOWS.card,
    padding: SPACING.lg,
    border: `1px solid ${COLORS.secondary[200]}`,
    transition: `all ${ANIMATIONS.normal} ease-in-out`,
    "&:hover": {
      boxShadow: SHADOWS.cardHover,
      transform: "translateY(-2px)",
    },
  },
  button: {
    primary: {
      background: COLORS.gradient.primary,
      color: "white",
      padding: `${SPACING.sm} ${SPACING.lg}`,
      borderRadius: BORDER_RADIUS.lg,
      boxShadow: SHADOWS.sm,
      transition: `all ${ANIMATIONS.normal} ease-in-out`,
      "&:hover": {
        background: COLORS.gradient.primaryHover,
        boxShadow: SHADOWS.md,
      },
    },
    secondary: {
      background: "transparent",
      color: COLORS.primary[600],
      border: `1px solid ${COLORS.primary[300]}`,
      padding: `${SPACING.sm} ${SPACING.lg}`,
      borderRadius: BORDER_RADIUS.lg,
      transition: `all ${ANIMATIONS.normal} ease-in-out`,
      "&:hover": {
        background: COLORS.primary[50],
        borderColor: COLORS.primary[400],
      },
    },
  },
  input: {
    borderRadius: BORDER_RADIUS.lg,
    border: `1px solid ${COLORS.secondary[300]}`,
    padding: `${SPACING.sm} ${SPACING.md}`,
    transition: `all ${ANIMATIONS.normal} ease-in-out`,
    "&:focus": {
      borderColor: COLORS.primary[500],
      boxShadow: `0 0 0 3px ${COLORS.primary[100]}`,
    },
  },
  modal: {
    backdrop: {
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      backdropFilter: "blur(4px)",
    },
    paper: {
      borderRadius: BORDER_RADIUS["2xl"],
      boxShadow: SHADOWS["2xl"],
      maxHeight: "90vh",
      overflow: "hidden",
    },
  },
};

// Status Colors
export const STATUS_COLORS = {
  "Not Started": {
    color: COLORS.secondary[600],
    background: COLORS.secondary[100],
    border: COLORS.secondary[300],
  },
  "In Progress": {
    color: COLORS.warning[700],
    background: COLORS.warning[100],
    border: COLORS.warning[300],
  },
  Completed: {
    color: COLORS.success[700],
    background: COLORS.success[100],
    border: COLORS.success[300],
  },
  Blocked: {
    color: COLORS.error[700],
    background: COLORS.error[100],
    border: COLORS.error[300],
  },
};

// Difficulty Colors
export const DIFFICULTY_COLORS = {
  Easy: {
    color: COLORS.success[700],
    background: COLORS.success[100],
    border: COLORS.success[300],
  },
  Medium: {
    color: COLORS.warning[700],
    background: COLORS.warning[100],
    border: COLORS.warning[300],
  },
  Hard: {
    color: COLORS.error[700],
    background: COLORS.error[100],
    border: COLORS.error[300],
  },
};

// Platform Colors
export const PLATFORM_COLORS = {
  LeetCode: {
    color: "#ff6b2d",
    background: "#fff3f0",
    border: "#ffd4c4",
  },
  HackerRank: {
    color: "#39aa56",
    background: "#f0f9f2",
    border: "#c6e6cc",
  },
  CodeChef: {
    color: "#8b4513",
    background: "#f8f4f0",
    border: "#e6d6c6",
  },
  Codeforces: {
    color: "#1f8dd6",
    background: "#f0f8ff",
    border: "#c4e0ff",
  },
  GeeksforGeeks: {
    color: "#0f7b0f",
    background: "#f0fff0",
    border: "#c6ffc6",
  },
  Custom: {
    color: COLORS.primary[600],
    background: COLORS.primary[50],
    border: COLORS.primary[200],
  },
};
