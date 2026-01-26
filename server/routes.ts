import type { Express } from "express";
import { createServer, type Server } from "node:http";

interface CalculateRequest {
  height: number;
  weight: number;
  age: number;
  gender: "female" | "male";
  activityLevel: string;
}

interface BMIZone {
  label: string;
  color: string;
}

interface Recommendation {
  icon: "activity" | "heart" | "coffee" | "moon" | "droplet";
  title: string;
  description: string;
  accentColor: string;
}

interface CalculateResponse {
  bmi: number;
  bmiZone: BMIZone;
  bmr: number;
  tdee: number;
  recommendations: Recommendation[];
}

const MetabolicColors = {
  primary: "#6B9E78",
  zones: {
    underweight: "#3498DB",
    normal: "#27AE60",
    overweight: "#F39C12",
    obese: "#E74C3C",
  },
};

const activityMultipliers: Record<string, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

function getBMIZone(bmi: number): BMIZone {
  if (bmi < 18.5) {
    return { label: "Niedowaga", color: MetabolicColors.zones.underweight };
  } else if (bmi < 25) {
    return { label: "Norma", color: MetabolicColors.zones.normal };
  } else if (bmi < 30) {
    return { label: "Nadwaga", color: MetabolicColors.zones.overweight };
  } else {
    return { label: "Otyłość", color: MetabolicColors.zones.obese };
  }
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

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/calculate", (req, res) => {
    try {
      const { height, weight, age, gender, activityLevel } =
        req.body as CalculateRequest;

      if (
        typeof height !== "number" ||
        typeof weight !== "number" ||
        typeof age !== "number"
      ) {
        return res.status(400).json({ error: "Invalid input data" });
      }

      if (height < 100 || height > 250) {
        return res
          .status(400)
          .json({ error: "Height must be between 100 and 250 cm" });
      }

      if (weight < 30 || weight > 300) {
        return res
          .status(400)
          .json({ error: "Weight must be between 30 and 300 kg" });
      }

      if (age < 15 || age > 120) {
        return res
          .status(400)
          .json({ error: "Age must be between 15 and 120 years" });
      }

      const heightInMeters = height / 100;
      const bmi = weight / (heightInMeters * heightInMeters);
      const bmiZone = getBMIZone(bmi);

      let bmr: number;
      if (gender === "male") {
        bmr = 10 * weight + 6.25 * height - 5 * age + 5;
      } else {
        bmr = 10 * weight + 6.25 * height - 5 * age - 161;
      }

      const multiplier = activityMultipliers[activityLevel] || 1.2;
      const tdee = bmr * multiplier;

      const recommendations = generateRecommendations(
        bmi,
        bmiZone.label,
        Math.round(tdee)
      );

      const response: CalculateResponse = {
        bmi: Math.round(bmi * 10) / 10,
        bmiZone,
        bmr: Math.round(bmr),
        tdee: Math.round(tdee),
        recommendations,
      };

      res.json(response);
    } catch (error) {
      console.error("Calculation error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  const httpServer = createServer(app);

  return httpServer;
}
