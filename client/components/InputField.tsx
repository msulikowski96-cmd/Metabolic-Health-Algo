import React, { useState } from "react";
import { View, TextInput, StyleSheet, ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { Spacing, BorderRadius, MetabolicColors } from "@/constants/theme";

interface InputFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: "default" | "numeric" | "decimal-pad";
  suffix?: string;
  error?: string;
  style?: ViewStyle;
  testID?: string;
}

const AnimatedView = Animated.createAnimatedComponent(View);

export function InputField({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = "default",
  suffix,
  error,
  style,
  testID,
}: InputFieldProps) {
  const [isFocused, setIsFocused] = useState(false);
  const borderColor = useSharedValue(MetabolicColors.inputBorder);

  const animatedStyle = useAnimatedStyle(() => ({
    borderColor: borderColor.value,
  }));

  const handleFocus = () => {
    setIsFocused(true);
    borderColor.value = withTiming(MetabolicColors.inputFocus, { duration: 200 });
  };

  const handleBlur = () => {
    setIsFocused(false);
    borderColor.value = withTiming(
      error ? MetabolicColors.warning : MetabolicColors.inputBorder,
      { duration: 200 }
    );
  };

  return (
    <View style={[styles.container, style]}>
      <ThemedText
        style={styles.label}
        lightColor={MetabolicColors.textPrimary}
        darkColor={MetabolicColors.textPrimary}
      >
        {label}
      </ThemedText>
      <AnimatedView
        style={[
          styles.inputContainer,
          animatedStyle,
          error && !isFocused ? styles.inputError : null,
        ]}
      >
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={MetabolicColors.textSecondary}
          keyboardType={keyboardType}
          onFocus={handleFocus}
          onBlur={handleBlur}
          testID={testID}
        />
        {suffix ? (
          <ThemedText
            style={styles.suffix}
            lightColor={MetabolicColors.textSecondary}
            darkColor={MetabolicColors.textSecondary}
          >
            {suffix}
          </ThemedText>
        ) : null}
      </AnimatedView>
      {error ? (
        <ThemedText
          style={styles.errorText}
          lightColor={MetabolicColors.warning}
          darkColor={MetabolicColors.warning}
        >
          {error}
        </ThemedText>
      ) : null}
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
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: MetabolicColors.surface,
    borderWidth: 1,
    borderColor: MetabolicColors.inputBorder,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.lg,
    height: Spacing.inputHeight,
  },
  inputError: {
    borderColor: MetabolicColors.warning,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Inter_400Regular",
    color: MetabolicColors.textPrimary,
  },
  suffix: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    marginLeft: Spacing.sm,
  },
  errorText: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    marginTop: Spacing.xs,
  },
});
