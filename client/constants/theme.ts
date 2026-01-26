import { Platform } from "react-native";

export const MetabolicColors = {
  primary: "#6B9E78",
  primaryDark: "#5A8A66",
  accent: "#E8A87C",
  background: "#FAFBFC",
  surface: "#FFFFFF",
  textPrimary: "#2C3E50",
  textSecondary: "#7F8C8D",
  success: "#27AE60",
  warning: "#F39C12",
  error: "#E74C3C",
  inputBorder: "#E0E6ED",
  inputFocus: "#6B9E78",
  gradients: {
    hero: ["#A8E6CF", "#DCD0FF"],
    bmi: ["#CEE5F2", "#ACCBEE"],
    bmr: ["#D4F1E3", "#A8E6CF"],
    tdee: ["#FFE6D5", "#FFD1BA"],
  },
  zones: {
    underweight: "#3498DB",
    normal: "#27AE60",
    overweight: "#F39C12",
    obese: "#E74C3C",
  },
};

const tintColorLight = MetabolicColors.primary;
const tintColorDark = "#7AB88A";

export const Colors = {
  light: {
    text: MetabolicColors.textPrimary,
    buttonText: "#FFFFFF",
    tabIconDefault: MetabolicColors.textSecondary,
    tabIconSelected: tintColorLight,
    link: MetabolicColors.primary,
    backgroundRoot: MetabolicColors.background,
    backgroundDefault: MetabolicColors.surface,
    backgroundSecondary: "#F5F7F9",
    backgroundTertiary: "#EEF1F4",
  },
  dark: {
    text: "#ECEDEE",
    buttonText: "#FFFFFF",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
    link: "#7AB88A",
    backgroundRoot: "#1A1D1F",
    backgroundDefault: "#252829",
    backgroundSecondary: "#303335",
    backgroundTertiary: "#3B3E41",
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 32,
  "4xl": 40,
  "5xl": 48,
  "6xl": 64,
  inputHeight: 52,
  buttonHeight: 52,
};

export const BorderRadius = {
  xs: 8,
  sm: 10,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 32,
  full: 9999,
};

export const Typography = {
  h1: {
    fontSize: 48,
    lineHeight: 58,
    fontWeight: "700" as const,
  },
  h2: {
    fontSize: 36,
    lineHeight: 47,
    fontWeight: "600" as const,
  },
  h3: {
    fontSize: 24,
    lineHeight: 34,
    fontWeight: "600" as const,
  },
  h4: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: "600" as const,
  },
  bodyLarge: {
    fontSize: 18,
    lineHeight: 29,
    fontWeight: "400" as const,
  },
  body: {
    fontSize: 16,
    lineHeight: 26,
    fontWeight: "400" as const,
  },
  small: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "400" as const,
  },
  caption: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: "400" as const,
  },
  label: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "500" as const,
  },
  link: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "400" as const,
  },
};

export const Shadows = {
  card: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHover: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: "Inter_400Regular",
    sansMedium: "Inter_500Medium",
    sansSemiBold: "Inter_600SemiBold",
    sansBold: "Inter_700Bold",
  },
  default: {
    sans: "Inter_400Regular",
    sansMedium: "Inter_500Medium",
    sansSemiBold: "Inter_600SemiBold",
    sansBold: "Inter_700Bold",
  },
  web: {
    sans: "Inter_400Regular, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    sansMedium: "Inter_500Medium, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    sansSemiBold: "Inter_600SemiBold, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    sansBold: "Inter_700Bold, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  },
});
