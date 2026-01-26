import React from "react";
import { View, Pressable, StyleSheet, ViewStyle } from "react-native";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { Spacing, BorderRadius, MetabolicColors } from "@/constants/theme";

interface ActivityLevel {
  value: string;
  label: string;
  description: string;
  multiplier: number;
}

const activityLevels: ActivityLevel[] = [
  {
    value: "sedentary",
    label: "Siedzący",
    description: "Brak lub minimalna aktywność",
    multiplier: 1.2,
  },
  {
    value: "light",
    label: "Lekka aktywność",
    description: "Ćwiczenia 1-3 dni/tydzień",
    multiplier: 1.375,
  },
  {
    value: "moderate",
    label: "Umiarkowana",
    description: "Ćwiczenia 3-5 dni/tydzień",
    multiplier: 1.55,
  },
  {
    value: "active",
    label: "Aktywny",
    description: "Ćwiczenia 6-7 dni/tydzień",
    multiplier: 1.725,
  },
  {
    value: "very_active",
    label: "Bardzo aktywny",
    description: "Ciężkie ćwiczenia codziennie",
    multiplier: 1.9,
  },
];

interface ActivityPickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  style?: ViewStyle;
}

function ActivityOption({
  level,
  isSelected,
  onSelect,
}: {
  level: ActivityLevel;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.98, { damping: 15, stiffness: 200 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 200 });
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSelect();
  };

  return (
    <Pressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View
        style={[
          styles.activityOption,
          isSelected ? styles.activityOptionSelected : null,
          animatedStyle,
        ]}
      >
        <View style={styles.activityContent}>
          <ThemedText
            style={[styles.activityLabel, isSelected ? styles.activityLabelSelected : null]}
            lightColor={isSelected ? MetabolicColors.primary : MetabolicColors.textPrimary}
            darkColor={isSelected ? MetabolicColors.primary : MetabolicColors.textPrimary}
          >
            {level.label}
          </ThemedText>
          <ThemedText
            style={styles.activityDescription}
            lightColor={MetabolicColors.textSecondary}
            darkColor={MetabolicColors.textSecondary}
          >
            {level.description}
          </ThemedText>
        </View>
        {isSelected ? (
          <View style={styles.checkContainer}>
            <Feather name="check" size={18} color={MetabolicColors.primary} />
          </View>
        ) : null}
      </Animated.View>
    </Pressable>
  );
}

export function ActivityPicker({
  label,
  value,
  onChange,
  style,
}: ActivityPickerProps) {
  return (
    <View style={[styles.container, style]}>
      <ThemedText
        style={styles.label}
        lightColor={MetabolicColors.textPrimary}
        darkColor={MetabolicColors.textPrimary}
      >
        {label}
      </ThemedText>
      <View style={styles.optionsContainer}>
        {activityLevels.map((level) => (
          <ActivityOption
            key={level.value}
            level={level}
            isSelected={value === level.value}
            onSelect={() => onChange(level.value)}
          />
        ))}
      </View>
    </View>
  );
}

export { activityLevels };

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.lg,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    fontFamily: "Inter_500Medium",
    marginBottom: Spacing.sm,
  },
  optionsContainer: {
    gap: Spacing.sm,
  },
  activityOption: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: MetabolicColors.surface,
    borderWidth: 1,
    borderColor: MetabolicColors.inputBorder,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  activityOptionSelected: {
    borderColor: MetabolicColors.primary,
    backgroundColor: `${MetabolicColors.primary}08`,
  },
  activityContent: {
    flex: 1,
  },
  activityLabel: {
    fontSize: 15,
    fontFamily: "Inter_500Medium",
    marginBottom: 2,
  },
  activityLabelSelected: {
    fontWeight: "600",
  },
  activityDescription: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
  },
  checkContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: `${MetabolicColors.primary}15`,
    alignItems: "center",
    justifyContent: "center",
  },
});
