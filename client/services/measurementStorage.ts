import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Measurement {
  id: string;
  date: string;
  weight: number;
  height: number;
  waist: number;
  hip: number;
  age: number;
  gender: 'male' | 'female';
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very active';
  bmi: number;
  bmr: number;
  tdee: number;
  bodyFatPercentage: number;
  notes?: string;
}

const MEASUREMENTS_KEY = '@metabolic_app_measurements';
const PROFILE_KEY = '@metabolic_app_profile';

export const measurementStorage = {
  // Save a new measurement
  async saveMeasurement(measurement: Omit<Measurement, 'id'>): Promise<Measurement> {
    try {
      const existingMeasurements = await this.getAllMeasurements();
      const newMeasurement: Measurement = {
        ...measurement,
        id: Date.now().toString(),
      };
      existingMeasurements.push(newMeasurement);
      await AsyncStorage.setItem(MEASUREMENTS_KEY, JSON.stringify(existingMeasurements));
      return newMeasurement;
    } catch (error) {
      console.error('Error saving measurement:', error);
      throw error;
    }
  },

  // Get all measurements
  async getAllMeasurements(): Promise<Measurement[]> {
    try {
      const data = await AsyncStorage.getItem(MEASUREMENTS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting measurements:', error);
      return [];
    }
  },

  // Get measurement by ID
  async getMeasurementById(id: string): Promise<Measurement | null> {
    try {
      const measurements = await this.getAllMeasurements();
      return measurements.find(m => m.id === id) || null;
    } catch (error) {
      console.error('Error getting measurement by ID:', error);
      return null;
    }
  },

  // Update a measurement
  async updateMeasurement(id: string, updates: Partial<Measurement>): Promise<Measurement | null> {
    try {
      const measurements = await this.getAllMeasurements();
      const index = measurements.findIndex(m => m.id === id);
      if (index === -1) return null;
      measurements[index] = { ...measurements[index], ...updates };
      await AsyncStorage.setItem(MEASUREMENTS_KEY, JSON.stringify(measurements));
      return measurements[index];
    } catch (error) {
      console.error('Error updating measurement:', error);
      return null;
    }
  },

  // Delete a measurement
  async deleteMeasurement(id: string): Promise<boolean> {
    try {
      const measurements = await this.getAllMeasurements();
      const filtered = measurements.filter(m => m.id !== id);
      await AsyncStorage.setItem(MEASUREMENTS_KEY, JSON.stringify(filtered));
      return true;
    } catch (error) {
      console.error('Error deleting measurement:', error);
      return false;
    }
  },

  // Get recent measurements (last N)
  async getRecentMeasurements(limit: number = 10): Promise<Measurement[]> {
    try {
      const measurements = await this.getAllMeasurements();
      return measurements.slice(-limit).reverse();
    } catch (error) {
      console.error('Error getting recent measurements:', error);
      return [];
    }
  },

  // Clear all measurements
  async clearAllMeasurements(): Promise<boolean> {
    try {
      await AsyncStorage.removeItem(MEASUREMENTS_KEY);
      return true;
    } catch (error) {
      console.error('Error clearing measurements:', error);
      return false;
    }
  },

  // Export measurements as JSON
  async exportMeasurements(): Promise<string> {
    try {
      const measurements = await this.getAllMeasurements();
      return JSON.stringify(measurements, null, 2);
    } catch (error) {
      console.error('Error exporting measurements:', error);
      throw error;
    }
  },

  // Import measurements from JSON
  async importMeasurements(jsonData: string): Promise<boolean> {
    try {
      const measurements = JSON.parse(jsonData);
      if (!Array.isArray(measurements)) throw new Error('Invalid format');
      await AsyncStorage.setItem(MEASUREMENTS_KEY, JSON.stringify(measurements));
      return true;
    } catch (error) {
      console.error('Error importing measurements:', error);
      return false;
    }
  },

  // Save user profile
  async saveProfile(profile: { height: number; gender: 'male' | 'female'; dateOfBirth: string }): Promise<boolean> {
    try {
      await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
      return true;
    } catch (error) {
      console.error('Error saving profile:', error);
      return false;
    }
  },

  // Get user profile
  async getProfile() {
    try {
      const data = await AsyncStorage.getItem(PROFILE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting profile:', error);
      return null;
    }
  },
};
