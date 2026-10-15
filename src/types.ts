export type Condition = 'hypertension' | 'hypotension' | 'diabetes';

export type Feeling = 'great' | 'okay' | 'not_my_best' | 'concerned';

export interface UserProfile {
  name: string;
  email: string;
  conditions: Condition[];
  familyHistory: string[];
  location: string;
  remindersEnabled: boolean;
  createdAt: string;
  streakDays: number;
  isDemo?: boolean;
}

export interface BloodPressureValues {
  systolic: number;
  diastolic: number;
  pulse?: number;
}

export interface BloodGlucoseValues {
  glucose: number;
  unit: 'mg/dL';
  mealContext?: 'fasting' | 'before_meal' | 'after_meal' | 'bedtime' | 'random';
}

export interface HealthReading {
  id: string;
  type: 'blood_pressure' | 'blood_glucose';
  values: BloodPressureValues | BloodGlucoseValues;
  timestamp: string; // ISO date string
  source: 'camera_scan' | 'manual' | 'demo';
  deviceModel?: string;
  notes?: string;
  flag?: 'optimal' | 'normal' | 'elevated' | 'high' | 'low';
  symptomsAtTime?: string[];
}

export interface CheckIn {
  id: string;
  timestamp: string;
  feeling: Feeling;
  symptoms: string[];
  notes?: string;
}

export interface HealthInsight {
  id: string;
  type: 'trend' | 'consistency' | 'pattern' | 'correlation';
  title: string;
  description: string;
  metric?: string;
  severity: 'positive' | 'neutral' | 'attention';
  dateRange: string;
  category: 'blood_pressure' | 'blood_glucose' | 'general';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  suggestedFollowUps?: string[];
}
