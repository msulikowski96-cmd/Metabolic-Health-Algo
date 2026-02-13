// healthCalculators.ts

// Function to calculate BMI with zones
function calculateBMI(weight: number, height: number): { bmi: number, zone: string } {
    const bmi = weight / (height * height);
    let zone;

    if (bmi < 18.5) zone = 'Underweight';
    else if (bmi < 24.9) zone = 'Normal weight';
    else if (bmi < 29.9) zone = 'Overweight';
    else zone = 'Obese';

    return { bmi, zone };
}

// Function to calculate BMR
function calculateBMR(weight: number, height: number, age: number, gender: 'male' | 'female'): number {
    if (gender === 'male') {
        return 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
        return 10 * weight + 6.25 * height - 5 * age - 161;
    }
}

// Function to calculate TDEE
function calculateTDEE(bmr: number, activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very active'): number {
    const activityMultipliers = {
        sedentary: 1.2,
        light: 1.375,
        moderate: 1.55,
        active: 1.725,
        veryActive: 1.9
    };
    return bmr * activityMultipliers[activityLevel];
}

// Function to calculate WHtR
function calculateWHtR(waist: number, height: number): number {
    return waist / height;
}

// Function to calculate BAI
function calculateBAI(hipCircumference: number, height: number): number {
    return (hipCircumference / (height * height)) - 18;
}

// Function to calculate Body Fat Percentage
function calculateBodyFatPercentage(sex: 'male' | 'female', age: number, weight: number, waist: number): number {
    if (sex === 'male') {
        return (86.01 * waist) / weight - (70.041 * age) + 36.76;
    } else {
        return (163.205 * waist) / weight - (97.684 * age) - 78.387;
    }
}

// Function to calculate LBM
function calculateLBM(weight: number, bodyFatPercentage: number): number {
    return weight * (1 - bodyFatPercentage / 100);
}

// Function to calculate Ideal Weight
function calculateIdealWeight(height: number, gender: 'male' | 'female'): number {
    if (gender === 'male') {
        return 52 + 1.9 * ((height / 0.0254) - 60);
    } else {
        return 49 + 1.7 * ((height / 0.0254) - 60);
    }
}

// Function to calculate BMI Prime
function calculateBMIPrime(weight: number, height: number): number {
    const bmi = weight / (height * height);
    return bmi / 25; // Assuming 25 is the normal BMI
}

// Function to calculate Ponderal Index
function calculatePonderalIndex(weight: number, height: number): number {
    return weight / (height * height * height) * 100; // Adjust by some factor for Ponderal Index
}

export {
    calculateBMI,
    calculateBMR,
    calculateTDEE,
    calculateWHtR,
    calculateBAI,
    calculateBodyFatPercentage,
    calculateLBM,
    calculateIdealWeight,
    calculateBMIPrime,
    calculatePonderalIndex
}