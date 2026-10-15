import { UserProfile, HealthReading, CheckIn, Condition } from '../types';

export const DEFAULT_DEMO_USER: UserProfile = {
  name: 'Eleanor Vance',
  email: 'eleanor.vance@example.com',
  conditions: ['hypertension', 'diabetes'],
  familyHistory: ['Hypertension', 'Diabetes'],
  location: 'Austin, TX',
  remindersEnabled: true,
  createdAt: '2026-09-15T08:00:00Z',
  streakDays: 7,
  isDemo: true,
};

// Realistic chronological readings demonstrating clear trends
export const DEMO_READINGS: HealthReading[] = [
  // October 7 (Today)
  {
    id: 'rd-01',
    type: 'blood_pressure',
    values: { systolic: 128, diastolic: 82, pulse: 74 },
    timestamp: '2026-10-07T08:42:00.000Z',
    source: 'camera_scan',
    deviceModel: 'Omron Series 7 (Arm Monitor)',
    notes: 'Morning measurement after 5 min seated rest.',
    flag: 'normal',
  },
  {
    id: 'rd-02',
    type: 'blood_glucose',
    values: { glucose: 104, unit: 'mg/dL', mealContext: 'fasting' },
    timestamp: '2026-10-07T07:15:00.000Z',
    source: 'camera_scan',
    deviceModel: 'Accu-Chek Guide',
    notes: 'Morning fasting blood glucose before breakfast.',
    flag: 'optimal',
  },

  // October 6
  {
    id: 'rd-03',
    type: 'blood_pressure',
    values: { systolic: 142, diastolic: 90, pulse: 82 },
    timestamp: '2026-10-06T09:10:00.000Z',
    source: 'camera_scan',
    deviceModel: 'Omron Series 7 (Arm Monitor)',
    notes: 'Felt slight tension after stressful project morning.',
    flag: 'elevated',
    symptomsAtTime: ['Headache'],
  },
  {
    id: 'rd-04',
    type: 'blood_glucose',
    values: { glucose: 148, unit: 'mg/dL', mealContext: 'after_meal' },
    timestamp: '2026-10-06T13:30:00.000Z',
    source: 'manual',
    deviceModel: 'Accu-Chek Guide',
    notes: '2 hours post lunch (quinoa bowl).',
    flag: 'normal',
  },
  {
    id: 'rd-05',
    type: 'blood_pressure',
    values: { systolic: 134, diastolic: 86, pulse: 78 },
    timestamp: '2026-10-06T19:40:00.000Z',
    source: 'camera_scan',
    deviceModel: 'Omron Series 7 (Arm Monitor)',
    notes: 'Evening reading before dinner.',
    flag: 'normal',
  },

  // October 5
  {
    id: 'rd-06',
    type: 'blood_pressure',
    values: { systolic: 131, diastolic: 84, pulse: 76 },
    timestamp: '2026-10-05T08:35:00.000Z',
    source: 'camera_scan',
    deviceModel: 'Omron Series 7 (Arm Monitor)',
    notes: 'Routine morning reading.',
    flag: 'normal',
  },
  {
    id: 'rd-07',
    type: 'blood_glucose',
    values: { glucose: 110, unit: 'mg/dL', mealContext: 'fasting' },
    timestamp: '2026-10-05T07:20:00.000Z',
    source: 'camera_scan',
    deviceModel: 'Accu-Chek Guide',
    notes: 'Fasting reading.',
    flag: 'normal',
  },

  // October 4
  {
    id: 'rd-08',
    type: 'blood_pressure',
    values: { systolic: 129, diastolic: 82, pulse: 72 },
    timestamp: '2026-10-04T08:50:00.000Z',
    source: 'camera_scan',
    deviceModel: 'Omron Series 7 (Arm Monitor)',
    notes: 'Post weekend walk.',
    flag: 'normal',
  },
  {
    id: 'rd-09',
    type: 'blood_glucose',
    values: { glucose: 122, unit: 'mg/dL', mealContext: 'after_meal' },
    timestamp: '2026-10-04T14:10:00.000Z',
    source: 'camera_scan',
    deviceModel: 'Accu-Chek Guide',
    notes: 'Post lunch reading.',
    flag: 'normal',
  },

  // October 3
  {
    id: 'rd-10',
    type: 'blood_pressure',
    values: { systolic: 126, diastolic: 80, pulse: 70 },
    timestamp: '2026-10-03T08:30:00.000Z',
    source: 'camera_scan',
    deviceModel: 'Omron Series 7 (Arm Monitor)',
    notes: 'Restful sleep reported.',
    flag: 'optimal',
  },
  {
    id: 'rd-11',
    type: 'blood_glucose',
    values: { glucose: 102, unit: 'mg/dL', mealContext: 'fasting' },
    timestamp: '2026-10-03T07:10:00.000Z',
    source: 'camera_scan',
    deviceModel: 'Accu-Chek Guide',
    notes: 'Morning fasting.',
    flag: 'optimal',
  },

  // October 2
  {
    id: 'rd-12',
    type: 'blood_pressure',
    values: { systolic: 124, diastolic: 79, pulse: 69 },
    timestamp: '2026-10-02T08:15:00.000Z',
    source: 'camera_scan',
    deviceModel: 'Omron Series 7 (Arm Monitor)',
    notes: 'Morning baseline.',
    flag: 'optimal',
  },
  {
    id: 'rd-13',
    type: 'blood_glucose',
    values: { glucose: 108, unit: 'mg/dL', mealContext: 'fasting' },
    timestamp: '2026-10-02T07:30:00.000Z',
    source: 'camera_scan',
    deviceModel: 'Accu-Chek Guide',
    notes: 'Morning baseline.',
    flag: 'normal',
  },

  // October 1
  {
    id: 'rd-14',
    type: 'blood_pressure',
    values: { systolic: 122, diastolic: 78, pulse: 68 },
    timestamp: '2026-10-01T08:20:00.000Z',
    source: 'camera_scan',
    deviceModel: 'Omron Series 7 (Arm Monitor)',
    notes: 'Beginning of tracking window.',
    flag: 'optimal',
  },
  {
    id: 'rd-15',
    type: 'blood_glucose',
    values: { glucose: 99, unit: 'mg/dL', mealContext: 'fasting' },
    timestamp: '2026-10-01T07:15:00.000Z',
    source: 'camera_scan',
    deviceModel: 'Accu-Chek Guide',
    notes: 'Beginning of tracking window.',
    flag: 'optimal',
  },
];

export const DEMO_CHECK_INS: CheckIn[] = [
  {
    id: 'ci-01',
    timestamp: '2026-10-07T08:45:00.000Z',
    feeling: 'okay',
    symptoms: [],
    notes: 'Rested well, drinking lemon water.',
  },
  {
    id: 'ci-02',
    timestamp: '2026-10-06T09:15:00.000Z',
    feeling: 'not_my_best',
    symptoms: ['Headache', 'Fatigue'],
    notes: 'Felt dull throbbing headache upon waking up. Correlates with elevated blood pressure reading (142/90).',
  },
  {
    id: 'ci-03',
    timestamp: '2026-10-05T08:40:00.000Z',
    feeling: 'great',
    symptoms: [],
    notes: 'Went for a 20-minute morning stroll.',
  },
  {
    id: 'ci-04',
    timestamp: '2026-10-04T09:00:00.000Z',
    feeling: 'okay',
    symptoms: [],
    notes: 'Feeling relaxed after family weekend.',
  },
  {
    id: 'ci-05',
    timestamp: '2026-10-03T08:35:00.000Z',
    feeling: 'great',
    symptoms: [],
    notes: 'Good energy today.',
  },
  {
    id: 'ci-06',
    timestamp: '2026-10-02T08:20:00.000Z',
    feeling: 'okay',
    symptoms: ['Dizziness'],
    notes: 'Mild dizziness standing up quickly after desk work.',
  },
  {
    id: 'ci-07',
    timestamp: '2026-10-01T08:25:00.000Z',
    feeling: 'great',
    symptoms: [],
    notes: 'Starting my daily check-in routine with VitaTrack.',
  },
];

export interface FoodOption {
  title: string;
  category: 'Grocery' | 'Restaurant' | 'Local Staples' | 'Healthier Swaps';
  description: string;
  conditionTips: {
    hypertension?: string;
    diabetes?: string;
    hypotension?: string;
  };
  highlightBadge?: string;
}

export const LOCATION_FOOD_DATA: Record<string, FoodOption[]> = {
  'Austin, TX': [
    {
      title: 'H-E-B Fresh Produce & Heart-Check Aisle',
      category: 'Grocery',
      description: 'Abundant fresh local greens, unsalted pecans, avocado, and Texas citrus.',
      conditionTips: {
        hypertension: 'High potassium in avocado & leafy greens helps balance sodium levels naturally.',
        diabetes: 'Pecans and seeds provide healthy fats that slow down post-meal glucose absorption.',
        hypotension: 'Nutritious whole foods that pair easily with hydrating infused mineral waters.',
      },
      highlightBadge: 'Local Favorite',
    },
    {
      title: 'Tex-Mex Bowl Customization',
      category: 'Restaurant',
      description: 'When dining out at local taco spots or casual bowls (e.g. Torchy’s or Chipotle).',
      conditionTips: {
        hypertension: 'Ask for salsa on the side to moderate sodium; double the fajita bell peppers and grilled onions.',
        diabetes: 'Swap tortilla chips for a salad base or black bean foundation to minimize glycemic spikes.',
        hypotension: 'Ensure adequate broth/hydration with fresh grilled protein.',
      },
      highlightBadge: 'Smart Dining',
    },
    {
      title: 'Smoked Lean Brisket & Greens',
      category: 'Local Staples',
      description: 'Texas barbecue staples ordered with mindful choices.',
      conditionTips: {
        hypertension: 'Choose lean cut over fatty bark (heavy in salted dry rubs); skip commercial high-sugar sauces.',
        diabetes: 'Barbecue sauce is often rich in molasses and sugar; savor vinegar-based splashes or dry herbs instead.',
        hypotension: 'Moderate protein with plenty of water and fiber.',
      },
      highlightBadge: 'Regional Dish',
    },
    {
      title: 'White Rice & Refried Beans → Spiced Black Beans & Cauliflower Rice',
      category: 'Healthier Swaps',
      description: 'Traditional starch sides reimagined for cardiovascular and metabolic balance.',
      conditionTips: {
        hypertension: 'Black beans simmered with cumin and garlic deliver potassium and magnesium with zero added salt.',
        diabetes: 'Provides steady, slow-burning dietary fiber instead of rapid post-meal spikes.',
        hypotension: 'Wholesome fiber that sustains steady systemic energy without post-prandial slump.',
      },
      highlightBadge: 'Balanced Swap',
    },
  ],
  'New York, NY': [
    {
      title: 'Neighborhood Bodega & Fruit Stands',
      category: 'Grocery',
      description: 'Ubiquitous fresh fruit carts offering bananas, berries, and raw unsalted nuts.',
      conditionTips: {
        hypertension: 'Grab fresh berries and bananas on the morning commute for essential dietary potassium.',
        diabetes: 'Berries have a low glycemic index and high polyphenol content for gentle glucose management.',
      },
      highlightBadge: 'Fast & Fresh',
    },
    {
      title: 'Classic Deli Breakfast Plate',
      category: 'Restaurant',
      description: 'Navigating New York deli bagel and breakfast counters.',
      conditionTips: {
        hypertension: 'Deli meats are sodium-dense; opt for poached eggs with sliced tomato and avocado instead of cured bacon.',
        diabetes: 'A dense New York bagel contains ~50g carbohydrates; try a scooped bagel or an omelet with greens.',
      },
      highlightBadge: 'Deli Guide',
    },
    {
      title: 'Halal Cart Chicken Salad',
      category: 'Local Staples',
      description: 'Popular street fare found across Manhattan and Brooklyn.',
      conditionTips: {
        hypertension: 'Request white and red sauces on the side to control sodium; request extra fresh chopped salad.',
        diabetes: 'Choose the chicken over salad greens instead of saffron rice to keep carbohydrate load balanced.',
      },
      highlightBadge: 'Street Food',
    },
    {
      title: 'Cream Cheese Everything Bagel → Sprouted Toast with Smoked Salmon & Cucumber',
      category: 'Healthier Swaps',
      description: 'Preserving the iconic NYC brunch flavor with nutrient-dense swaps.',
      conditionTips: {
        hypertension: 'Rinse smoked salmon lightly or choose fresh poached lox with crisp hydrating cucumber.',
        diabetes: 'Sprouted grain bread avoids the sharp spike of refined white flour bagels.',
      },
      highlightBadge: 'Balanced Swap',
    },
  ],
  'General / Universal': [
    {
      title: 'Local Supermarket Whole Foods Aisles',
      category: 'Grocery',
      description: 'Focus on perimeter shopping: dark leafy greens, berries, legumes, and lean proteins.',
      conditionTips: {
        hypertension: 'Potassium-rich foods (spinach, sweet potatoes, beans) support blood pressure flexibility.',
        diabetes: 'High-fiber legumes and vegetables slow glucose absorption and promote satiety.',
        hypotension: 'Balanced whole food nutrition with regular hydration supports healthy fluid retention.',
      },
      highlightBadge: 'Everyday Staple',
    },
    {
      title: 'Casual Dining & Fast Casual Eateries',
      category: 'Restaurant',
      description: 'Practical ordering strategies for work lunches and family dinners.',
      conditionTips: {
        hypertension: 'Ask for dressings and sauces on the side; request steamed or grilled vegetables.',
        diabetes: 'Pair complex carbohydrates with protein and olive oil to smooth glycemic curves.',
      },
      highlightBadge: 'Dining Out',
    },
    {
      title: 'Starch & Grain Mindful Portions',
      category: 'Local Staples',
      description: 'How to enjoy customary cultural grains without compromising health targets.',
      conditionTips: {
        hypertension: 'Pair grain portions with plenty of herbs, citrus, and vegetables rather than sodium sauces.',
        diabetes: 'If rice or bread is a regular part of meals, pair a smaller portion with vegetables and protein.',
      },
      highlightBadge: 'Plate Balance',
    },
    {
      title: 'Refined Flours & High-Sodium Condiments → Whole Grains & Herbal Seasonings',
      category: 'Healthier Swaps',
      description: 'Flavorful swaps using garlic, rosemary, lemon zest, and toasted spices.',
      conditionTips: {
        hypertension: 'Herbal seasoning creates rich flavor without relying on salt shakers.',
        diabetes: 'Keeps meals anti-inflammatory while moderating glycemic index.',
      },
      highlightBadge: 'Healthy Habit',
    },
  ],
};

// Preset sample photos for rapid prototype demonstration and testing
export const DEVICE_PRESET_SCENARIOS = [
  {
    id: 'preset-bp-normal',
    type: 'blood_pressure' as const,
    title: 'Standard Arm Monitor (Normal: 128/82)',
    device: 'Omron Series 7 Digital Display',
    reading: { systolic: 128, diastolic: 82, pulse: 74 },
    imagePreview: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=600&q=80',
    description: 'Clear LCD showing SYS 128, DIA 82, PULSE 74',
  },
  {
    id: 'preset-bp-elevated',
    type: 'blood_pressure' as const,
    title: 'Elevated Reading (Stage 1: 142/90)',
    device: 'Upper Arm Digital Cuff',
    reading: { systolic: 142, diastolic: 90, pulse: 82 },
    imagePreview: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80',
    description: 'LCD showing SYS 142, DIA 90, PULSE 82 with tension note',
  },
  {
    id: 'preset-glucose-fasting',
    type: 'blood_glucose' as const,
    title: 'Fasting Glucose (Normal: 104 mg/dL)',
    device: 'Accu-Chek Guide OLED',
    reading: { glucose: 104, unit: 'mg/dL' as const },
    imagePreview: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?auto=format&fit=crop&w=600&q=80',
    description: 'OLED meter reading 104 mg/dL, 8:42 AM',
  },
  {
    id: 'preset-glucose-postmeal',
    type: 'blood_glucose' as const,
    title: 'Post-Meal Glucose (146 mg/dL)',
    device: 'Contour Next Gen Meter',
    reading: { glucose: 146, unit: 'mg/dL' as const },
    imagePreview: 'https://images.unsplash.com/photo-1584362917165-526a968579e8?auto=format&fit=crop&w=600&q=80',
    description: 'High-contrast LCD showing 146 mg/dL post-lunch',
  },
];
