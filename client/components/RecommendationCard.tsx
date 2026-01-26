import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { Feather } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  WithSpringConfig,
} from "react-native-reanimated";
import { Pressable } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { Spacing, BorderRadius, Shadows, MetabolicColors } from "@/constants/theme";

type FeatherIconName = keyof typeof Feather.glyphMap;

interface RecommendationCardProps {
  icon: FeatherIconName;
  title: string;
  description: string;
  accentColor?: string;
  style?: ViewStyle;
}

const springConfig: WithSpringConfig = {
  damping: 15,
  mass: 0.3,
  stiffness: 150,
  overshootClamping: true,
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function RecommendationCard({
  icon,
  title,
  description,
  accentColor = MetabolicColors.primary,
  style,
}: RecommendationCardProps) {
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
      <View style={[styles.card, { borderLeftColor: accentColor }]}>
        <View style={[styles.iconContainer, { backgroundColor: `${accentColor}15` }]}>
          <Feather name={icon} size={24} color={accentColor} />
        </View>
        <View style={styles.content}>
          <ThemedText
            style={styles.title}
            lightColor={MetabolicColors.textPrimary}
            darkColor={MetabolicColors.textPrimary}
          >
            {title}
          </ThemedText>
          <ThemedText
            style={styles.description}
            lightColor={MetabolicColors.textSecondary}
            darkColor={MetabolicColors.textSecondary}
          >
            {description}
          </ThemedText>
        </View>
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: MetabolicColors.surface,
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    borderLeftWidth: 4,
    ...Shadows.card,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.lg,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Inter_600SemiBold",
    marginBottom: Spacing.xs,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: "Inter_400Regular",
  },
});
