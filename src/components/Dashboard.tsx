import React from 'react';
import { 
  Activity, 
  Camera, 
  CalendarCheck, 
  TrendingUp, 
  Sparkles, 
  Heart, 
  Droplets, 
  Gauge, 
  Clock, 
  ChevronRight, 
  AlertCircle, 
  CheckCircle2, 
  Info, 
  Flame,
  UtensilsCrossed,
  ShieldCheck,
  Plus
} from 'lucide-react';
import { UserProfile, HealthReading, CheckIn, Condition } from '../types';
import { classifyBloodPressure, classifyGlucose, isBloodPressure, isBloodGlucose } from '../utils/healthCalculations';

interface DashboardProps {
  userProfile: UserProfile;
  readings: HealthReading[];
  checkIns: CheckIn[];
  onOpenCapture: () => void;
  onOpenCheckIn: () => void;
  onOpenVitaAssistant: () => void;
  onNavigateTab: (tab: any) => void;
  onResetDemo: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  userProfile,
  readings,
  checkIns,
  onOpenCapture,
  onOpenCheckIn,
  onOpenVitaAssistant,
  onNavigateTab,
  onResetDemo,
}) => {
  // Determine time of day greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  // Latest readings by type
  const bpReadings = readings
    .filter((r) => r.type === 'blood_pressure')
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const glucoseReadings = readings
    .filter((r) => r.type === 'blood_glucose')
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const latestBP = bpReadings[0];
  const latestGlucose = glucoseReadings[0];

  // Latest check-in
  const latestCheckIn = checkIns[0];

  // Check conditions for layout emphasis
  const hasHypertension = userProfile.conditions.includes('hypertension');
  const hasHypotension = userProfile.conditions.includes('hypotension');
  const hasDiabetes = userProfile.conditions.includes('diabetes');

  const formatLastRecorded = (isoString?: string) => {
    if (!isoString) return 'Not recorded yet';
    const date = new Date(isoString);
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();
    const isYesterday = new Date(today.setDate(today.getDate() - 1)).toDateString() === date.toDateString();

    const timeStr = date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    if (isToday) return `Today, ${timeStr}`;
    if (isYesterday) return `Yesterday, ${timeStr}`;
    return `${date.toLocaleDateString([], { month: 'short', day: 'numeric' })}, ${timeStr}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Demo Profile Notice Banner */}
      {userProfile.isDemo && (
        <div className="bg-amber-50/90 border border-amber-200/90 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-amber-900 shadow-2xs">
          <div className="flex items-center gap-3">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
            </span>
            <div>
              <p className="text-xs font-bold text-amber-950 uppercase tracking-wider">
                Prototype Mode: Demo Profile Active
              </p>
              <p className="text-xs text-amber-800">
                You are viewing sample longitudinal data for {userProfile.name} ({userProfile.conditions.join(', ')}). All numbers are sample measurements.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={onResetDemo}
              className="text-xs font-semibold px-3 py-1.5 bg-white border border-amber-300 rounded-lg text-amber-900 hover:bg-amber-100 transition-colors shadow-2xs"
            >
              Reset Sample Data
            </button>
          </div>
        </div>
      )}

      {/* Top Header Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
            {greeting}, {userProfile.name.split(' ')[0]}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-1">
            Let's check in on your health today.
          </p>
        </div>

        {/* Quick Top Actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenCapture}
            className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-all active:scale-[0.99]"
          >
            <Camera className="w-4 h-4 stroke-[2.5]" />
            <span>+ Add Reading</span>
          </button>

          <button
            onClick={onOpenCheckIn}
            className="flex items-center gap-1.5 px-3.5 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs sm:text-sm font-semibold rounded-xl shadow-2xs transition-colors"
          >
            <CalendarCheck className="w-4 h-4 text-teal-600" />
            <span>Check-In</span>
          </button>
        </div>
      </div>

      {/* Prominent "Today's Check-In" Card */}
      <div className="bg-gradient-to-br from-teal-900 to-slate-900 text-white rounded-2xl p-6 sm:p-7 shadow-sm relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-800/80 border border-teal-600/50 text-[11px] font-semibold tracking-wider uppercase text-teal-200">
              <Flame className="w-3.5 h-3.5 text-amber-300" />
              <span>{userProfile.streakDays} Day Check-In Streak</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold">Today's Check-In Routine</h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Consistent daily monitoring captures subtle shifts before symptoms escalate. Record your morning resting vitals and tell Vita how you feel.
            </p>

            {latestCheckIn && (
              <div className="pt-2 flex items-center gap-2 text-xs text-teal-200">
                <span className="w-2 h-2 rounded-full bg-teal-400"></span>
                <span>
                  Latest feeling: <strong>"{latestCheckIn.feeling.replace('_', ' ')}"</strong>{' '}
                  {latestCheckIn.symptoms.length > 0 && `(Symptoms: ${latestCheckIn.symptoms.join(', ')})`}
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
            <button
              onClick={onOpenCapture}
              className="flex items-center justify-center gap-2 px-5 py-3 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all active:scale-[0.99]"
            >
              <Camera className="w-4 h-4" />
              <span>Scan Health Device</span>
            </button>
            <button
              onClick={onOpenCheckIn}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm rounded-xl border border-white/20 transition-colors"
            >
              <CalendarCheck className="w-4 h-4 text-teal-300" />
              <span>Log Daily Symptoms</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Condition Measurement Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
            Active Monitored Measurements
          </h3>
          <span className="text-xs text-slate-400">
            Prioritized by your medical profile
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Card 1: Blood Pressure */}
          <div
            className={`bg-white rounded-2xl p-6 border transition-all shadow-xs relative ${
              hasHypertension || hasHypotension ? 'border-teal-500/80 ring-1 ring-teal-500/20' : 'border-slate-200'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-rose-50 text-rose-700 rounded-xl">
                  <Gauge className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-bold text-slate-900">Blood Pressure</h4>
                    {(hasHypertension || hasHypotension) && (
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-teal-50 text-teal-800 border border-teal-200/60 rounded-md">
                        Primary Focus
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Last recorded: <strong>{formatLastRecorded(latestBP?.timestamp)}</strong></span>
                  </p>
                </div>
              </div>

              {latestBP && isBloodPressure(latestBP.values) && (
                (() => {
                  const c = classifyBloodPressure(latestBP.values.systolic, latestBP.values.diastolic);
                  return (
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${c.bgColor} ${c.borderColor} ${c.color}`}>
                      {c.label}
                    </span>
                  );
                })()
              )}
            </div>

            {/* Reading Number Display */}
            {latestBP && isBloodPressure(latestBP.values) ? (
              <div className="mt-6 flex items-baseline justify-between">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
                      {latestBP.values.systolic} / {latestBP.values.diastolic}
                    </span>
                    <span className="text-sm font-semibold text-slate-500">mmHg</span>
                  </div>
                  <div className="mt-1 flex items-center gap-3 text-xs text-slate-500">
                    <span>Pulse: <strong className="text-slate-800">{latestBP.values.pulse || 74} bpm</strong></span>
                    {latestBP.deviceModel && (
                      <span className="truncate max-w-[200px] text-slate-400">• {latestBP.deviceModel}</span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => onNavigateTab('history')}
                  className="text-xs font-semibold text-teal-700 hover:text-teal-900 flex items-center gap-1 hover:underline"
                >
                  <span>View Trends</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="mt-6 p-4 bg-slate-50 rounded-xl text-center">
                <p className="text-xs text-slate-500">No blood pressure readings recorded yet.</p>
                <button
                  onClick={onOpenCapture}
                  className="mt-2 text-xs font-bold text-teal-700 hover:underline"
                >
                  + Scan your monitor now
                </button>
              </div>
            )}

            {/* Sub-bar note */}
            {latestBP?.notes && (
              <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500 italic">
                "{latestBP.notes}"
              </div>
            )}
          </div>

          {/* Card 2: Blood Glucose */}
          <div
            className={`bg-white rounded-2xl p-6 border transition-all shadow-xs relative ${
              hasDiabetes ? 'border-teal-500/80 ring-1 ring-teal-500/20' : 'border-slate-200'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-teal-50 text-teal-700 rounded-xl">
                  <Droplets className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-bold text-slate-900">Blood Glucose</h4>
                    {hasDiabetes && (
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-teal-50 text-teal-800 border border-teal-200/60 rounded-md">
                        Primary Focus
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Last recorded: <strong>{formatLastRecorded(latestGlucose?.timestamp)}</strong></span>
                  </p>
                </div>
              </div>

              {latestGlucose && isBloodGlucose(latestGlucose.values) && (
                (() => {
                  const c = classifyGlucose(latestGlucose.values.glucose, latestGlucose.values.mealContext);
                  return (
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${c.bgColor} ${c.borderColor} ${c.color}`}>
                      {c.label}
                    </span>
                  );
                })()
              )}
            </div>

            {/* Glucose Number Display */}
            {latestGlucose && isBloodGlucose(latestGlucose.values) ? (
              <div className="mt-6 flex items-baseline justify-between">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
                      {latestGlucose.values.glucose}
                    </span>
                    <span className="text-sm font-semibold text-slate-500">mg/dL</span>
                  </div>
                  <div className="mt-1 flex items-center gap-3 text-xs text-slate-500">
                    <span className="capitalize">
                      Context: <strong className="text-slate-800">{(latestGlucose.values.mealContext || 'fasting').replace('_', ' ')}</strong>
                    </span>
                    {latestGlucose.deviceModel && (
                      <span className="truncate max-w-[200px] text-slate-400">• {latestGlucose.deviceModel}</span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => onNavigateTab('history')}
                  className="text-xs font-semibold text-teal-700 hover:text-teal-900 flex items-center gap-1 hover:underline"
                >
                  <span>View Trends</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="mt-6 p-4 bg-slate-50 rounded-xl text-center">
                <p className="text-xs text-slate-500">No blood glucose readings recorded yet.</p>
                <button
                  onClick={onOpenCapture}
                  className="mt-2 text-xs font-bold text-teal-700 hover:underline"
                >
                  + Scan your glucose meter
                </button>
              </div>
            )}

            {/* Sub-bar note */}
            {latestGlucose?.notes && (
              <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500 italic">
                "{latestGlucose.notes}"
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Feature Split Banner: AI Trend Spotlight & Food Around You */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left: AI Trend Insights Spotlight (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-purple-50 text-purple-700 rounded-lg">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Longitudinal Trend Spotlight</h4>
                  <p className="text-[11px] text-slate-500">Derived from your last 7 recorded measurements</p>
                </div>
              </div>
              <button
                onClick={() => onNavigateTab('insights')}
                className="text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1"
              >
                <span>All Insights</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200/90 rounded-xl">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-800 mb-1">
                <TrendingUp className="w-4 h-4 text-amber-600" />
                <span>Trend Detected</span>
              </div>
              <p className="text-sm font-semibold text-slate-900">
                "Your systolic readings have gradually increased over your last 7 recorded measurements."
              </p>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Average shifted from 122 mmHg earlier in the cycle to 134 mmHg recently. Check-ins report correlated work tension on Oct 6.
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Non-diagnostic educational observation</span>
            </span>
            <button
              onClick={onOpenVitaAssistant}
              className="text-xs font-bold text-teal-700 hover:underline flex items-center gap-1"
            >
              <span>Ask Vita about this</span>
              <Sparkles className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right: Food Around You Location Card (1 col) */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="p-2 bg-emerald-50 text-emerald-700 rounded-lg">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Food Around You</h4>
                <p className="text-[11px] text-slate-500">{userProfile.location}</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Based on your location ({userProfile.location}), here are common foods and healthier options you may encounter nearby:
            </p>

            <div className="mt-3 p-3 bg-emerald-50/60 border border-emerald-100 rounded-xl text-xs space-y-1">
              <p className="font-semibold text-emerald-950">Local Swap Recommendation:</p>
              <p className="text-emerald-800 text-[11px] leading-relaxed">
                If dining at local taco or barbecue spots, swap refined flour tortillas for avocado and leafy greens to minimize glycemic spikes.
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('food')}
            className="mt-4 w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl transition-colors text-center"
          >
            Explore Neighborhood Guide
          </button>
        </div>
      </div>
    </div>
  );
};
