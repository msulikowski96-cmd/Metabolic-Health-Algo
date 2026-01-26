import React from "react";
import { View, StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withDelay,
} from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { Spacing, BorderRadius, MetabolicColors } from "@/constants/theme";

interface BMIIndicatorProps {
  bmi: number;
}

const zones = [
  { min: 0, max: 18.5, label: "Niedowaga", color: MetabolicColors.zones.underweight },
  { min: 18.5, max: 25, label: "Norma", color: MetabolicColors.zones.normal },
  { min: 25, max: 30, label: "Nadwaga", color: MetabolicColors.zones.overweight },
  { min: 30, max: 50, label: "Otyłość", color: MetabolicColors.zones.obese },
];

export function BMIIndicator({ bmi }: BMIIndicatorProps) {
  const indicatorPosition = useSharedValue(0);

  React.useEffect(() => {
    const normalizedBmi = Math.min(Math.max(bmi, 15), 40);
    const position = ((normalizedBmi - 15) / 25) * 100;
    indicatorPosition.value = withDelay(300, withSpring(position, { damping: 15 }));
  }, [bmi, indicatorPosition]);

  const indicatorStyle = useAnimatedStyle(() => ({
    left: `${indicatorPosition.value}%`,
  }));

  return (
    <View style={styles.container}>
      <View style={styles.barContainer}>
        {zones.map((zone, index) => {
          const width = ((zone.max - zone.min) / 25) * 100;
          return (
            <View
              key={zone.label}
              style={[
                styles.zoneBar,
                {
                  backgroundColor: zone.color,
                  width: `${width}%`,
                  borderTopLeftRadius: index === 0 ? BorderRadius.full : 0,
                  borderBottomLeftRadius: index === 0 ? BorderRadius.full : 0,
                  borderTopRightRadius: index === zones.length - 1 ? BorderRadius.full : 0,
                  borderBottomRightRadius: index === zones.length - 1 ? BorderRadius.full : 0,
                },
              ]}
            />
          );
        })}
        <Animated.View style={[styles.indicator, indicatorStyle]}>
          <View style={styles.indicatorDot} />
          <View style={styles.indicatorLine} />
        </Animated.View>
      </View>
      <View style={styles.labelsContainer}>
        <ThemedText style={styles.label} lightColor={MetabolicColors.textSecondary}>15</ThemedText>
        <ThemedText style={styles.label} lightColor={MetabolicColors.textSecondary}>18.5</ThemedText>
        <ThemedText style={styles.label} lightColor={MetabolicColors.textSecondary}>25</ThemedText>
        <ThemedText style={styles.label} lightColor={MetabolicColors.textSecondary}>30</ThemedText>
        <ThemedText style={styles.label} lightColor={MetabolicColors.textSecondary}>40</ThemedText>
      </View>
    </View>
  );
}

export function getBMIZone(bmi: number): { label: string; color: string } {
  for (const zone of zones) {
    if (bmi < zone.max) {
      return { label: zone.label, color: zone.color };
    }
  }
  return { label: "Otyłość", color: MetabolicColors.zones.obese };
}

const styles = StyleSheet.create({
  container: {
    marginTop: Spacing.md,
  },
  barContainer: {
    flexDirection: "row",
    height: 8,
    borderRadius: BorderRadius.full,
    overflow: "visible",
    position: "relative",
  },
  zoneBar: {
    height: "100%",
  },
  indicator: {
    position: "absolute",
    top: -4,
    marginLeft: -8,
    alignItems: "center",
  },
  indicatorDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: MetabolicColors.textPrimary,
    borderWidth: 3,
    borderColor: MetabolicColors.surface,
  },
  indicatorLine: {
    width: 2,
    height: 8,
    backgroundColor: MetabolicColors.textPrimary,
    marginTop: -2,
  },
  labelsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: Spacing.sm,
  },
  label: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
  },
});
