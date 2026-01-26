import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  WithSpringConfig,
} from "react-native-reanimated";
import { Pressable } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { Spacing, BorderRadius, Shadows, MetabolicColors } from "@/constants/theme";

interface MetricCardProps {
  title: string;
  value: string;
  unit?: string;
  subtitle?: string;
  badge?: {
    text: string;
    color: string;
  };
  gradientColors: string[];
  icon?: React.ReactNode;
  style?: ViewStyle;
  children?: React.ReactNode;
}

const springConfig: WithSpringConfig = {
  damping: 15,
  mass: 0.3,
  stiffness: 150,
  overshootClamping: true,
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function MetricCard({
  title,
  value,
  unit,
  subtitle,
  badge,
  gradientColors,
  icon,
  style,
  children,
}: MetricCardProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.98, springConfig);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, springConfig);
  };

  return (
    <AnimatedPressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[animatedStyle, style]}
    >
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        <View style={styles.header}>
          {icon ? <View style={styles.iconContainer}>{icon}</View> : null}
          <ThemedText
            style={styles.title}
            lightColor={MetabolicColors.textPrimary}
            darkColor={MetabolicColors.textPrimary}
          >
            {title}
          </ThemedText>
        </View>

        <View style={styles.valueContainer}>
          <ThemedText
            style={styles.value}
            lightColor={MetabolicColors.textPrimary}
            darkColor={MetabolicColors.textPrimary}
          >
            {value}
          </ThemedText>
          {unit ? (
            <ThemedText
              style={styles.unit}
              lightColor={MetabolicColors.textSecondary}
              darkColor={MetabolicColors.textSecondary}
            >
              {unit}
            </ThemedText>
          ) : null}
        </View>

        {badge ? (
          <View style={[styles.badge, { backgroundColor: badge.color }]}>
            <ThemedText style={styles.badgeText} lightColor="#FFFFFF" darkColor="#FFFFFF">
              {badge.text}
            </ThemedText>
          </View>
        ) : null}

        {subtitle ? (
          <ThemedText
            style={styles.subtitle}
            lightColor={MetabolicColors.textSecondary}
            darkColor={MetabolicColors.textSecondary}
          >
            {subtitle}
          </ThemedText>
        ) : null}

        {children}
      </LinearGradient>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
    ...Shadows.card,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  iconContainer: {
    marginRight: Spacing.sm,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Inter_600SemiBold",
  },
  valueContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: Spacing.sm,
  },
  value: {
    fontSize: 42,
    fontWeight: "700",
    fontFamily: "Inter_700Bold",
    letterSpacing: -1,
  },
  unit: {
    fontSize: 18,
    fontWeight: "500",
    marginLeft: Spacing.xs,
    fontFamily: "Inter_500Medium",
  },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    marginBottom: Spacing.sm,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: "600",
    fontFamily: "Inter_600SemiBold",
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
  },
});
