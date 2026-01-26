import React, { useState, useRef, useCallback } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withDelay,
  withTiming,
  FadeInDown,
  FadeInUp,
} from "react-native-reanimated";
import { useMutation } from "@tanstack/react-query";

import { ThemedText } from "@/components/ThemedText";
import { InputField } from "@/components/InputField";
import { RadioGroup } from "@/components/RadioGroup";
import { ActivityPicker, activityLevels } from "@/components/ActivityPicker";
import { PrimaryButton } from "@/components/PrimaryButton";
import { MetricCard } from "@/components/MetricCard";
import { RecommendationCard } from "@/components/RecommendationCard";
import { BMIIndicator, getBMIZone } from "@/components/BMIIndicator";
import { Spacing, BorderRadius, MetabolicColors, Shadows } from "@/constants/theme";
import { apiRequest } from "@/lib/query-client";

const { width } = Dimensions.get("window");
const isSmallScreen = width < 380;

interface FormData {
  height: string;
  weight: string;
  age: string;
  gender: "female" | "male";
  activityLevel: string;
}

interface MetabolicResults {
  bmi: number;
  bmiZone: { label: string; color: string };
  bmr: number;
  tdee: number;
  recommendations: Recommendation[];
}

interface Recommendation {
  icon: "activity" | "heart" | "coffee" | "moon" | "droplet";
  title: string;
  description: string;
  accentColor: string;
}

const genderOptions = [
  { label: "Kobieta", value: "female" },
  { label: "Mężczyzna", value: "male" },
];

function calculateMetrics(data: FormData): MetabolicResults {
  const height = parseFloat(data.height) / 100;
  const weight = parseFloat(data.weight);
  const age = parseFloat(data.age);
  const isMale = data.gender === "male";

  const bmi = weight / (height * height);
  const bmiZone = getBMIZone(bmi);

  let bmr: number;
  if (isMale) {
    bmr = 10 * weight + 6.25 * (height * 100) - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * (height * 100) - 5 * age - 161;
  }

  const activityMultiplier = activityLevels.find(
    (l) => l.value === data.activityLevel
  )?.multiplier || 1.2;
  const tdee = bmr * activityMultiplier;

  const recommendations = generateRecommendations(bmi, bmiZone.label, tdee);

  return {
    bmi: Math.round(bmi * 10) / 10,
    bmiZone,
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    recommendations,
  };
}

function generateRecommendations(
  bmi: number,
  zone: string,
  tdee: number
): Recommendation[] {
  const recs: Recommendation[] = [];

  if (zone === "Niedowaga") {
    recs.push({
      icon: "heart",
      title: "Zwiększ kaloryczność",
      description: `Twoje zapotrzebowanie kaloryczne to około ${tdee} kcal. Rozważ zwiększenie spożycia o 300-500 kcal dziennie, aby bezpiecznie przytyć.`,
      accentColor: MetabolicColors.zones.underweight,
    });
  } else if (zone === "Nadwaga" || zone === "Otyłość") {
    recs.push({
      icon: "heart",
      title: "Deficyt kaloryczny",
      description: `Przy TDEE ${tdee} kcal, rozważ redukcję o 300-500 kcal dziennie. To pozwoli na zdrową utratę 0.5-1 kg tygodniowo.`,
      accentColor: MetabolicColors.zones.overweight,
    });
  } else {
    recs.push({
      icon: "heart",
      title: "Utrzymuj balans",
      description: `Twoje BMI jest w normie! Utrzymuj spożycie około ${tdee} kcal dziennie, aby zachować zdrową wagę.`,
      accentColor: MetabolicColors.zones.normal,
    });
  }

  recs.push({
    icon: "activity",
    title: "Aktywność fizyczna",
    description:
      "Zalecane jest co najmniej 150 minut umiarkowanej aktywności fizycznej tygodniowo lub 75 minut intensywnych ćwiczeń.",
    accentColor: MetabolicColors.primary,
  });

  recs.push({
    icon: "droplet",
    title: "Nawodnienie",
    description:
      "Pij co najmniej 2-2.5 litra wody dziennie. Nawodnienie wpływa na metabolizm i ogólne samopoczucie.",
    accentColor: "#3498DB",
  });

  recs.push({
    icon: "moon",
    title: "Regeneracja",
    description:
      "Sen 7-9 godzin dziennie wspomaga metabolizm, regenerację mięśni i regulację hormonów odpowiedzialnych za apetyt.",
    accentColor: "#9B59B6",
  });

  return recs;
}

export default function MetabolicScreen() {
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<ScrollView>(null);
  const resultsRef = useRef<View>(null);

  const [formData, setFormData] = useState<FormData>({
    height: "",
    weight: "",
    age: "",
    gender: "female",
    activityLevel: "moderate",
  });

  const [results, setResults] = useState<MetabolicResults | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const resultsOpacity = useSharedValue(0);
  const resultsTranslateY = useSharedValue(30);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    const height = parseFloat(formData.height);
    if (!formData.height || isNaN(height) || height < 100 || height > 250) {
      newErrors.height = "Podaj wzrost (100-250 cm)";
    }

    const weight = parseFloat(formData.weight);
    if (!formData.weight || isNaN(weight) || weight < 30 || weight > 300) {
      newErrors.weight = "Podaj wagę (30-300 kg)";
    }

    const age = parseFloat(formData.age);
    if (!formData.age || isNaN(age) || age < 15 || age > 120) {
      newErrors.age = "Podaj wiek (15-120 lat)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateMutation = useMutation({
    mutationFn: async (data: FormData) => {
      try {
        const response = await apiRequest("POST", "/api/calculate", {
          height: parseFloat(data.height),
          weight: parseFloat(data.weight),
          age: parseFloat(data.age),
          gender: data.gender,
          activityLevel: data.activityLevel,
        });
        return response.json();
      } catch (error) {
        return calculateMetrics(data);
      }
    },
    onSuccess: (data) => {
      setResults(data);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      resultsOpacity.value = withDelay(200, withTiming(1, { duration: 400 }));
      resultsTranslateY.value = withDelay(200, withSpring(0, { damping: 15 }));

      setTimeout(() => {
        scrollViewRef.current?.scrollTo({ y: 500, animated: true });
      }, 300);
    },
    onError: () => {
      const calculatedResults = calculateMetrics(formData);
      setResults(calculatedResults);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      resultsOpacity.value = withDelay(200, withTiming(1, { duration: 400 }));
      resultsTranslateY.value = withDelay(200, withSpring(0, { damping: 15 }));

      setTimeout(() => {
        scrollViewRef.current?.scrollTo({ y: 500, animated: true });
      }, 300);
    },
  });

  const handleCalculate = () => {
    if (validateForm()) {
      resultsOpacity.value = 0;
      resultsTranslateY.value = 30;
      calculateMutation.mutate(formData);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  const handleReset = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setResults(null);
    resultsOpacity.value = 0;
    resultsTranslateY.value = 30;
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  const resultsAnimatedStyle = useAnimatedStyle(() => ({
    opacity: resultsOpacity.value,
    transform: [{ translateY: resultsTranslateY.value }],
  }));

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <ScrollView
      ref={scrollViewRef}
      style={styles.container}
      contentContainerStyle={[
        styles.contentContainer,
        { paddingTop: insets.top, paddingBottom: insets.bottom + Spacing["3xl"] },
      ]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <LinearGradient
        colors={MetabolicColors.gradients.hero}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.heroGradient}
      >
        <Animated.View entering={FadeInDown.delay(100).duration(500)}>
          <View style={styles.logoContainer}>
            <Image
              source={require("../../assets/images/icon.png")}
              style={styles.logo}
              resizeMode="contain"
            />
            <ThemedText
              style={styles.logoText}
              lightColor={MetabolicColors.textPrimary}
              darkColor={MetabolicColors.textPrimary}
            >
              MetabolicAI
            </ThemedText>
          </View>

          <ThemedText
            style={styles.heroTitle}
            lightColor={MetabolicColors.textPrimary}
            darkColor={MetabolicColors.textPrimary}
          >
            Poznaj swoje wskaźniki zdrowia
          </ThemedText>

          <ThemedText
            style={styles.heroSubtitle}
            lightColor={MetabolicColors.textSecondary}
            darkColor={MetabolicColors.textSecondary}
          >
            Oblicz BMI, BMR i TDEE, aby lepiej zrozumieć swój metabolizm
          </ThemedText>
        </Animated.View>

        <Animated.View
          entering={FadeInUp.delay(200).duration(500)}
          style={styles.formCard}
        >
          <ThemedText
            style={styles.formTitle}
            lightColor={MetabolicColors.textPrimary}
            darkColor={MetabolicColors.textPrimary}
          >
            Wprowadź swoje dane
          </ThemedText>

          <View style={styles.formRow}>
            <InputField
              label="Wzrost"
              value={formData.height}
              onChangeText={(v) => updateField("height", v)}
              placeholder="175"
              keyboardType="numeric"
              suffix="cm"
              error={errors.height}
              style={styles.formField}
              testID="input-height"
            />
            <InputField
              label="Waga"
              value={formData.weight}
              onChangeText={(v) => updateField("weight", v)}
              placeholder="70"
              keyboardType="numeric"
              suffix="kg"
              error={errors.weight}
              style={styles.formField}
              testID="input-weight"
            />
          </View>

          <InputField
            label="Wiek"
            value={formData.age}
            onChangeText={(v) => updateField("age", v)}
            placeholder="30"
            keyboardType="numeric"
            suffix="lat"
            error={errors.age}
            testID="input-age"
          />

          <RadioGroup
            label="Płeć"
            options={genderOptions}
            value={formData.gender}
            onChange={(v) => updateField("gender", v)}
          />

          <ActivityPicker
            label="Poziom aktywności"
            value={formData.activityLevel}
            onChange={(v) => updateField("activityLevel", v)}
          />

          <PrimaryButton
            onPress={handleCalculate}
            loading={calculateMutation.isPending}
            testID="button-calculate"
          >
            Oblicz moje wskaźniki
          </PrimaryButton>
        </Animated.View>
      </LinearGradient>

      {results ? (
        <Animated.View style={[styles.resultsSection, resultsAnimatedStyle]} ref={resultsRef}>
          <ThemedText
            style={styles.sectionTitle}
            lightColor={MetabolicColors.textPrimary}
            darkColor={MetabolicColors.textPrimary}
          >
            Twoje wyniki
          </ThemedText>

          <View style={styles.metricsGrid}>
            <MetricCard
              title="BMI"
              value={results.bmi.toString()}
              subtitle="Wskaźnik masy ciała"
              badge={{
                text: results.bmiZone.label,
                color: results.bmiZone.color,
              }}
              gradientColors={MetabolicColors.gradients.bmi}
              icon={<Feather name="user" size={18} color={MetabolicColors.textPrimary} />}
              style={styles.metricCard}
            >
              <BMIIndicator bmi={results.bmi} />
            </MetricCard>

            <MetricCard
              title="BMR"
              value={results.bmr.toString()}
              unit="kcal"
              subtitle="Twoje podstawowe spalanie"
              gradientColors={MetabolicColors.gradients.bmr}
              icon={<Feather name="zap" size={18} color={MetabolicColors.textPrimary} />}
              style={styles.metricCard}
            />

            <MetricCard
              title="TDEE"
              value={results.tdee.toString()}
              unit="kcal"
              subtitle="Całkowite dzienne zapotrzebowanie"
              gradientColors={MetabolicColors.gradients.tdee}
              icon={<Feather name="trending-up" size={18} color={MetabolicColors.textPrimary} />}
              style={styles.metricCard}
            />
          </View>

          <ThemedText
            style={styles.sectionTitle}
            lightColor={MetabolicColors.textPrimary}
            darkColor={MetabolicColors.textPrimary}
          >
            Rekomendacje dla Ciebie
          </ThemedText>

          <View style={styles.recommendationsContainer}>
            {results.recommendations.map((rec, index) => (
              <Animated.View
                key={rec.title}
                entering={FadeInUp.delay(100 + index * 100).duration(400)}
              >
                <RecommendationCard
                  icon={rec.icon}
                  title={rec.title}
                  description={rec.description}
                  accentColor={rec.accentColor}
                  style={styles.recommendationCard}
                />
              </Animated.View>
            ))}
          </View>

          <PrimaryButton onPress={handleReset} style={styles.resetButton} testID="button-reset">
            Oblicz ponownie
          </PrimaryButton>
        </Animated.View>
      ) : null}

      <View style={styles.footer}>
        <ThemedText
          style={styles.footerText}
          lightColor={MetabolicColors.textSecondary}
          darkColor={MetabolicColors.textSecondary}
        >
          MetabolicAI - Twój asystent zdrowia metabolicznego
        </ThemedText>
        <ThemedText
          style={styles.footerDisclaimer}
          lightColor={MetabolicColors.textSecondary}
          darkColor={MetabolicColors.textSecondary}
        >
          Wyniki mają charakter informacyjny i nie zastępują konsultacji lekarskiej.
        </ThemedText>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: MetabolicColors.background,
  },
  contentContainer: {
    flexGrow: 1,
  },
  heroGradient: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing["3xl"],
    paddingBottom: Spacing["4xl"],
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing["2xl"],
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: Spacing.sm,
  },
  logoText: {
    fontSize: 24,
    fontWeight: "700",
    fontFamily: "Inter_700Bold",
  },
  heroTitle: {
    fontSize: isSmallScreen ? 28 : 32,
    fontWeight: "700",
    fontFamily: "Inter_700Bold",
    lineHeight: isSmallScreen ? 34 : 40,
    marginBottom: Spacing.md,
  },
  heroSubtitle: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: "Inter_400Regular",
    marginBottom: Spacing["2xl"],
  },
  formCard: {
    backgroundColor: MetabolicColors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    ...Shadows.card,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: "600",
    fontFamily: "Inter_600SemiBold",
    marginBottom: Spacing.xl,
  },
  formRow: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  formField: {
    flex: 1,
  },
  resultsSection: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing["3xl"],
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "600",
    fontFamily: "Inter_600SemiBold",
    marginBottom: Spacing.xl,
  },
  metricsGrid: {
    gap: Spacing.lg,
    marginBottom: Spacing["3xl"],
  },
  metricCard: {
    width: "100%",
  },
  recommendationsContainer: {
    gap: Spacing.md,
    marginBottom: Spacing["2xl"],
  },
  recommendationCard: {
    marginBottom: 0,
  },
  resetButton: {
    marginTop: Spacing.lg,
    backgroundColor: MetabolicColors.textSecondary,
  },
  footer: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing["4xl"],
    paddingBottom: Spacing.xl,
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
    marginBottom: Spacing.sm,
  },
  footerDisclaimer: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    lineHeight: 18,
  },
});
