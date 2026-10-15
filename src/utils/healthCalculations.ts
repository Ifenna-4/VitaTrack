import { HealthReading, HealthInsight, BloodPressureValues, BloodGlucoseValues } from '../types';

export function isBloodPressure(values: any): values is BloodPressureValues {
  return typeof values.systolic === 'number' && typeof values.diastolic === 'number';
}

export function isBloodGlucose(values: any): values is BloodGlucoseValues {
  return typeof values.glucose === 'number';
}

export function classifyBloodPressure(sys: number, dia: number): {
  label: string;
  category: 'optimal' | 'normal' | 'elevated' | 'stage1' | 'stage2' | 'hypotension' | 'crisis';
  color: string;
  bgColor: string;
  borderColor: string;
  guidelineNote: string;
} {
  if (sys >= 180 || dia >= 120) {
    return {
      label: 'Significantly Elevated',
      category: 'crisis',
      color: 'text-rose-700',
      bgColor: 'bg-rose-50',
      borderColor: 'border-rose-200',
      guidelineNote: 'Reading may be outside typical home range. Check for symptoms and consider contacting your healthcare provider.',
    };
  }
  if (sys < 90 || dia < 60) {
    return {
      label: 'Low (Hypotension)',
      category: 'hypotension',
      color: 'text-amber-700',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      guidelineNote: 'Lower than typical resting range. Maintain hydration and note any lightheadedness.',
    };
  }
  if (sys >= 140 || dia >= 90) {
    return {
      label: 'Stage 2 Hypertension Range',
      category: 'stage2',
      color: 'text-rose-600',
      bgColor: 'bg-rose-50',
      borderColor: 'border-rose-200',
      guidelineNote: 'Per AHA guidelines: Systolic ≥140 or Diastolic ≥90 mmHg.',
    };
  }
  if (sys >= 130 || dia >= 80) {
    return {
      label: 'Stage 1 Hypertension Range',
      category: 'stage1',
      color: 'text-amber-700',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      guidelineNote: 'Per AHA guidelines: Systolic 130–139 or Diastolic 80–89 mmHg.',
    };
  }
  if (sys >= 120 && dia < 80) {
    return {
      label: 'Elevated Range',
      category: 'elevated',
      color: 'text-yellow-700',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      guidelineNote: 'Per AHA guidelines: Systolic 120–129 with Diastolic <80 mmHg.',
    };
  }
  return {
    label: 'Normal / Target Range',
    category: 'optimal',
    color: 'text-emerald-700',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    guidelineNote: 'Per AHA guidelines: Systolic <120 and Diastolic <80 mmHg.',
  };
}

export function classifyGlucose(glucose: number, context: string = 'fasting'): {
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  guidelineNote: string;
} {
  if (glucose >= 250) {
    return {
      label: 'Notably High',
      color: 'text-rose-700',
      bgColor: 'bg-rose-50',
      borderColor: 'border-rose-200',
      guidelineNote: 'Significantly above standard post-prandial targets. Review recent meal context.',
    };
  }
  if (glucose < 70) {
    return {
      label: 'Low (Hypoglycemia range)',
      color: 'text-amber-700',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      guidelineNote: 'Below 70 mg/dL. Standard guidance recommends consuming fast-acting carbohydrate if symptomatic.',
    };
  }

  if (context === 'fasting') {
    if (glucose <= 99) {
      return {
        label: 'Normal Fasting',
        color: 'text-emerald-700',
        bgColor: 'bg-emerald-50',
        borderColor: 'border-emerald-200',
        guidelineNote: 'ADA target: 70–99 mg/dL fasting.',
      };
    }
    if (glucose <= 125) {
      return {
        label: 'Pre-diabetes Fasting Range',
        color: 'text-amber-700',
        bgColor: 'bg-amber-50',
        borderColor: 'border-amber-200',
        guidelineNote: 'ADA target: 100–125 mg/dL fasting.',
      };
    }
    return {
      label: 'Elevated Fasting Range',
      color: 'text-rose-600',
      bgColor: 'bg-rose-50',
      borderColor: 'border-rose-200',
      guidelineNote: 'ADA target: ≥126 mg/dL fasting.',
    };
  }

  // After meal / casual
  if (glucose < 140) {
    return {
      label: 'In Post-Meal Target',
      color: 'text-emerald-700',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      guidelineNote: 'Typical non-diabetic target <140 mg/dL 2 hrs post meal.',
    };
  }
  if (glucose < 180) {
    return {
      label: 'Within Diabetic Post-Meal Target',
      color: 'text-teal-700',
      bgColor: 'bg-teal-50',
      borderColor: 'border-teal-200',
      guidelineNote: 'ADA post-prandial target for adults managing diabetes is <180 mg/dL.',
    };
  }
  return {
    label: 'Elevated Post-Meal',
    color: 'text-rose-600',
    bgColor: 'bg-rose-50',
    borderColor: 'border-rose-200',
    guidelineNote: 'Higher than standard post-meal target (>180 mg/dL).',
  };
}

export function generateHealthInsights(readings: HealthReading[]): HealthInsight[] {
  const insights: HealthInsight[] = [];
  const bpReadings = readings
    .filter((r) => r.type === 'blood_pressure')
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  const glucoseReadings = readings
    .filter((r) => r.type === 'blood_glucose')
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  // 1. Blood Pressure Trajectory (Last 7 readings trend)
  if (bpReadings.length >= 5) {
    const last7 = bpReadings.slice(-7);
    const firstHalfAvg = last7.slice(0, 3).reduce((acc, r) => acc + (r.values as BloodPressureValues).systolic, 0) / 3;
    const secondHalfAvg = last7.slice(-3).reduce((acc, r) => acc + (r.values as BloodPressureValues).systolic, 0) / 3;
    const diff = secondHalfAvg - firstHalfAvg;

    if (diff > 4) {
      insights.push({
        id: 'ins-bp-trend-increase',
        type: 'trend',
        category: 'blood_pressure',
        title: 'Systolic Readings Trajectory',
        description: 'Your systolic readings have gradually increased over your last 7 recorded measurements.',
        metric: `+${Math.round(diff)} mmHg shift`,
        severity: 'attention',
        dateRange: 'Past 7 measurements',
      });
    } else if (diff < -4) {
      insights.push({
        id: 'ins-bp-trend-decrease',
        type: 'trend',
        category: 'blood_pressure',
        title: 'Systolic Improvement Observed',
        description: 'Your systolic readings have shown a steady downward trajectory across your recent measurements.',
        metric: `-${Math.round(Math.abs(diff))} mmHg shift`,
        severity: 'positive',
        dateRange: 'Past 7 measurements',
      });
    } else {
      insights.push({
        id: 'ins-bp-trend-stable',
        type: 'trend',
        category: 'blood_pressure',
        title: 'Blood Pressure Stability',
        description: 'Your blood pressure has maintained a stable baseline within consistent parameters over recent checks.',
        metric: 'Stable (±3 mmHg)',
        severity: 'positive',
        dateRange: 'Past 7 measurements',
      });
    }
  }

  // 2. Weekly Average Comparison
  if (bpReadings.length >= 6) {
    const recentWeek = bpReadings.slice(-4);
    const priorWeek = bpReadings.slice(-8, -4);

    if (priorWeek.length > 0) {
      const recentAvg = Math.round(recentWeek.reduce((acc, r) => acc + (r.values as BloodPressureValues).systolic, 0) / recentWeek.length);
      const priorAvg = Math.round(priorWeek.reduce((acc, r) => acc + (r.values as BloodPressureValues).systolic, 0) / priorWeek.length);

      if (recentAvg > priorAvg) {
        insights.push({
          id: 'ins-weekly-diff',
          type: 'trend',
          category: 'blood_pressure',
          title: 'Trend Detected',
          description: `Your average systolic reading this week (${recentAvg} mmHg) is higher than your previous week (${priorAvg} mmHg).`,
          metric: `${recentAvg} vs ${priorAvg} mmHg`,
          severity: 'attention',
          dateRange: 'Week-over-week',
        });
      } else {
        insights.push({
          id: 'ins-weekly-diff-good',
          type: 'trend',
          category: 'blood_pressure',
          title: 'Week-over-Week Improvement',
          description: `Your average systolic reading this week (${recentAvg} mmHg) is lower than your previous week (${priorAvg} mmHg).`,
          metric: `${recentAvg} vs ${priorAvg} mmHg`,
          severity: 'positive',
          dateRange: 'Week-over-week',
        });
      }
    }
  }

  // 3. Consistency
  const now = new Date('2026-10-07T18:00:00Z').getTime();
  const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000;
  const thisWeekBP = bpReadings.filter((r) => new Date(r.timestamp).getTime() >= oneWeekAgo);

  if (thisWeekBP.length >= 3) {
    insights.push({
      id: 'ins-consistency',
      type: 'consistency',
      category: 'general',
      title: 'Consistency',
      description: `You've recorded your blood pressure ${thisWeekBP.length} times this week, maintaining a proactive routine.`,
      metric: `${thisWeekBP.length} logs / week`,
      severity: 'positive',
      dateRange: 'Last 7 days',
    });
  }

  // 4. Morning vs Evening Pattern
  const morningReadings = bpReadings.filter((r) => {
    const hour = new Date(r.timestamp).getUTCHours();
    return hour >= 6 && hour <= 11;
  });
  const eveningReadings = bpReadings.filter((r) => {
    const hour = new Date(r.timestamp).getUTCHours();
    return hour >= 17 && hour <= 23;
  });

  if (morningReadings.length >= 2 && eveningReadings.length >= 2) {
    const mornAvg = Math.round(morningReadings.reduce((acc, r) => acc + (r.values as BloodPressureValues).systolic, 0) / morningReadings.length);
    const eveAvg = Math.round(eveningReadings.reduce((acc, r) => acc + (r.values as BloodPressureValues).systolic, 0) / eveningReadings.length);

    if (mornAvg > eveAvg + 4) {
      insights.push({
        id: 'ins-diurnal-pattern',
        type: 'pattern',
        category: 'blood_pressure',
        title: 'Pattern Identified',
        description: `Your morning readings have generally been higher than your evening readings (avg ${mornAvg} vs ${eveAvg} mmHg).`,
        metric: `Morning +${mornAvg - eveAvg} mmHg`,
        severity: 'neutral',
        dateRange: 'Diurnal variation',
      });
    }
  }

  // 5. Blood Glucose Insights
  if (glucoseReadings.length >= 3) {
    const fasting = glucoseReadings.filter((r) => (r.values as BloodGlucoseValues).mealContext === 'fasting');
    if (fasting.length >= 2) {
      const avgFasting = Math.round(fasting.reduce((acc, r) => acc + (r.values as BloodGlucoseValues).glucose, 0) / fasting.length);
      insights.push({
        id: 'ins-glucose-fasting',
        type: 'trend',
        category: 'blood_glucose',
        title: 'Fasting Glucose Baseline',
        description: `Your fasting blood glucose has averaged ${avgFasting} mg/dL across ${fasting.length} morning checks.`,
        metric: `${avgFasting} mg/dL avg`,
        severity: avgFasting <= 110 ? 'positive' : 'attention',
        dateRange: 'Recent morning checks',
      });
    }
  }

  return insights;
}
