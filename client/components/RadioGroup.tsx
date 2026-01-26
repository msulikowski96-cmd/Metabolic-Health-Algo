import React from "react";
import { View, Pressable, StyleSheet, ViewStyle } from "react-native";
import * as Haptics from "expo-haptics";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { Spacing, BorderRadius, MetabolicColors } from "@/constants/theme";

interface RadioOption {
  label: string;
  value: string;
}

interface RadioGroupProps {
  label: string;
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
  style?: ViewStyle;
}

function RadioButton({
  option,
  isSelected,
  onSelect,
}: {
  option: RadioOption;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const scale = useSharedValue(1);
  const dotScale = useSharedValue(isSelected ? 1 : 0);

  React.useEffect(() => {
    dotScale.value = withSpring(isSelected ? 1 : 0, {
      damping: 15,
      stiffness: 200,
    });
  }, [isSelected, dotScale]);

  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const animatedDotStyle = useAnimatedStyle(() => ({
    transform: [{ scale: dotScale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 15, stiffness: 200 });
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
          styles.radioOption,
          isSelected ? styles.radioOptionSelected : null,
          animatedButtonStyle,
        ]}
      >
        <View style={styles.radioCircle}>
          <Animated.View
            style={[styles.radioCircleInner, animatedDotStyle]}
          />
        </View>
        <ThemedText
          style={[styles.radioLabel, isSelected ? styles.radioLabelSelected : null]}
          lightColor={isSelected ? MetabolicColors.primary : MetabolicColors.textPrimary}
          darkColor={isSelected ? MetabolicColors.primary : MetabolicColors.textPrimary}
        >
          {option.label}
        </ThemedText>
      </Animated.View>
    </Pressable>
  );
}

export function RadioGroup({
  label,
  options,
  value,
  onChange,
  style,
}: RadioGroupProps) {
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
        {options.map((option) => (
          <RadioButton
            key={option.value}
            option={option}
            isSelected={value === option.value}
            onSelect={() => onChange(option.value)}
          />
        ))}
      </View>
    </View>
  );
}

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
    flexDirection: "row",
    gap: Spacing.md,
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: MetabolicColors.surface,
    borderWidth: 1,
    borderColor: MetabolicColors.inputBorder,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  radioOptionSelected: {
    borderColor: MetabolicColors.primary,
    backgroundColor: `${MetabolicColors.primary}08`,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: MetabolicColors.inputBorder,
    marginRight: Spacing.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  radioCircleInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: MetabolicColors.primary,
  },
  radioLabel: {
    fontSize: 15,
    fontFamily: "Inter_500Medium",
  },
  radioLabelSelected: {
    fontWeight: "600",
  },
});
