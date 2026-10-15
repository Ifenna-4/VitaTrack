import React, { useState } from 'react';
import { 
  Heart, 
  MapPin, 
  Bell, 
  Camera, 
  CheckCircle2, 
  TrendingUp, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles,
  Info,
  Check,
  ShieldAlert,
  Flame,
  Droplets,
  Gauge
} from 'lucide-react';
import { Condition, UserProfile } from '../types';

interface OnboardingFlowProps {
  initialName: string;
  initialEmail: string;
  onComplete: (profile: Partial<UserProfile>) => void;
}

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({
  initialName,
  initialEmail,
  onComplete,
}) => {
  const [step, setStep] = useState<number>(1);

  // Step 1: Family History
  const [familyHistory, setFamilyHistory] = useState<string[]>([]);

  // Step 2: Medical History
  const [conditions, setConditions] = useState<Condition[]>([]);

  // Step 3: Location
  const [location, setLocation] = useState<string>('Austin, TX');

  // Step 4: Notifications
  const [remindersEnabled, setRemindersEnabled] = useState<boolean>(true);

  // Validation / progression helpers
  const toggleFamilyCondition = (item: string) => {
    if (item === 'None' || item === 'Not sure') {
      setFamilyHistory([item]);
      return;
    }
    const filtered = familyHistory.filter((x) => x !== 'None' && x !== 'Not sure');
    if (filtered.includes(item)) {
      setFamilyHistory(filtered.filter((x) => x !== item));
    } else {
      setFamilyHistory([...filtered, item]);
    }
  };

  const toggleCondition = (cond: Condition | 'none') => {
    if (cond === 'none') {
      setConditions([]);
      return;
    }
    if (conditions.includes(cond)) {
      setConditions(conditions.filter((c) => c !== cond));
    } else {
      setConditions([...conditions, cond]);
    }
  };

  const handleFinish = () => {
    onComplete({
      name: initialName || 'Eleanor Vance',
      email: initialEmail || 'eleanor@example.com',
      conditions: conditions.length > 0 ? conditions : ['hypertension'],
      familyHistory: familyHistory.length > 0 ? familyHistory : ['Hypertension'],
      location: location.trim() || 'Austin, TX',
      remindersEnabled,
      isDemo: false,
      streakDays: 1,
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between p-4 sm:p-6 lg:p-8 font-sans selection:bg-teal-100">
      {/* Top Header & Progress */}
      <div className="max-w-2xl mx-auto w-full pt-4">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
          <span className="text-teal-800 font-bold tracking-wider uppercase">Onboarding</span>
          <span className="px-2 py-0.5 bg-white border border-slate-200 rounded-md shadow-2xs font-mono text-slate-700">
            {step} of 5
          </span>
        </div>
        {/* Progress Bar */}
        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
          <div
            className="bg-teal-600 h-full rounded-full transition-all duration-300 ease-out"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Conversational Container */}
      <div className="max-w-2xl mx-auto w-full bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-10 shadow-sm my-6">
        {/* ================= STEP 1: FAMILY HISTORY ================= */}
        {step === 1 && (
          <div className="animate-in fade-in duration-200">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700">Step 1 of 5</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 mt-1">
              Family History
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2">
              Does anyone in your immediate family have a history of these conditions?
            </p>
            <p className="text-xs text-slate-400 mt-1">Select all that apply.</p>

            <div className="mt-6 space-y-2.5">
              {[
                { id: 'Hypertension', title: 'Hypertension (High Blood Pressure)', desc: 'Parents, siblings, or grandparents' },
                { id: 'Diabetes', title: 'Diabetes (Type 1 or Type 2)', desc: 'Elevated blood sugar regulation history' },
                { id: 'Hypotension', title: 'Hypotension (Low Blood Pressure)', desc: 'History of chronic low resting blood pressure' },
                { id: 'None', title: 'None', desc: 'No known family history of these conditions' },
                { id: 'Not sure', title: 'Not sure', desc: 'I do not have full visibility into family records' },
              ].map((opt) => {
                const selected = familyHistory.includes(opt.id);
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => toggleFamilyCondition(opt.id)}
                    className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between ${
                      selected
                        ? 'border-teal-600 bg-teal-50/70 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <span className={`text-sm font-bold ${selected ? 'text-teal-950' : 'text-slate-900'}`}>
                        {opt.title}
                      </span>
                      <p className="text-xs text-slate-500 mt-0.5">{opt.desc}</p>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                        selected ? 'bg-teal-600 border-teal-600 text-white' : 'border-slate-300 bg-white'
                      }`}
                    >
                      {selected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= STEP 2: MEDICAL HISTORY ================= */}
        {step === 2 && (
          <div className="animate-in fade-in duration-200">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700">Step 2 of 5</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 mt-1">
              Medical History
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2">
              Which of these conditions are you currently managing?
            </p>
            <p className="text-xs text-slate-400 mt-1">
              This determines which readings VitaTrack emphasizes across your dashboard and timeline.
            </p>

            <div className="mt-6 space-y-3">
              {[
                {
                  id: 'hypertension' as Condition,
                  name: 'Hypertension',
                  badge: 'Emphasizes Blood Pressure',
                  badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
                  desc: 'Focus on systolic & diastolic thresholds, resting baseline, and tension triggers.',
                  icon: Gauge,
                },
                {
                  id: 'hypotension' as Condition,
                  name: 'Hypotension',
                  badge: 'Emphasizes Blood Pressure',
                  badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
                  desc: 'Focus on low threshold monitoring, hydration habits, and postural dizziness symptoms.',
                  icon: Heart,
                },
                {
                  id: 'diabetes' as Condition,
                  name: 'Diabetes',
                  badge: 'Emphasizes Blood Glucose',
                  badgeColor: 'bg-teal-50 text-teal-700 border-teal-200',
                  desc: 'Focus on fasting vs post-meal glucose in mg/dL and dietary carbohydrate pairing.',
                  icon: Droplets,
                },
              ].map((c) => {
                const Icon = c.icon;
                const isSelected = conditions.includes(c.id);
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => toggleCondition(c.id)}
                    className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-4 ${
                      isSelected
                        ? 'border-teal-600 bg-teal-50/70 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${isSelected ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-base font-bold text-slate-900">{c.name}</span>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${c.badgeColor}`}>
                          {c.badge}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">{c.desc}</p>
                    </div>
                  </button>
                );
              })}

              {/* None Option */}
              <button
                type="button"
                onClick={() => toggleCondition('none')}
                className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between ${
                  conditions.length === 0
                    ? 'border-teal-600 bg-teal-50/70 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div>
                  <span className="text-sm font-bold text-slate-900">None / General Proactive Monitoring</span>
                  <p className="text-xs text-slate-500">I want to track both blood pressure and glucose equally.</p>
                </div>
                <div
                  className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                    conditions.length === 0 ? 'bg-teal-600 border-teal-600 text-white' : 'border-slate-300'
                  }`}
                >
                  {conditions.length === 0 && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 3: LOCATION ================= */}
        {step === 3 && (
          <div className="animate-in fade-in duration-200">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700">Step 3 of 5</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 mt-1">
              Your Location
            </h2>
            <div className="mt-3 p-3.5 bg-teal-50/70 border border-teal-200/80 rounded-xl flex items-start gap-3">
              <MapPin className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
              <p className="text-xs sm:text-sm text-teal-950 leading-relaxed">
                <strong>Why we ask:</strong> Your location helps VitaTrack understand the foods and resources that may be available around you.
              </p>
            </div>

            <div className="mt-6">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                City / Region
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Austin, TX or New York, NY"
                className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 text-slate-900 font-medium"
              />
              <p className="text-xs text-slate-400 mt-1.5">
                Quick pick suggestions:
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {['Austin, TX', 'New York, NY', 'Chicago, IL', 'London, UK', 'San Francisco, CA'].map((city) => (
                  <button
                    key={city}
                    type="button"
                    onClick={() => setLocation(city)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                      location === city
                        ? 'bg-teal-700 text-white border-teal-700'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800 mb-1">
                <Info className="w-4 h-4 text-teal-600" />
                <span>How this works in VitaTrack:</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                "Based on your location, here are common foods and healthier options you may encounter nearby." <br />
                <span className="text-slate-400 italic">VitaTrack uses location strictly for nutrition guidance and does not make medical claims based solely on location.</span>
              </p>
            </div>
          </div>
        )}

        {/* ================= STEP 4: NOTIFICATIONS ================= */}
        {step === 4 && (
          <div className="animate-in fade-in duration-200">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700">Step 4 of 5</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 mt-1">
              Check-In Reminders
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2">
              Would you like reminders to check in?
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Gentle prompts help maintain a consistent monitoring routine, which yields cleaner trend analysis.
            </p>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <button
                type="button"
                onClick={() => setRemindersEnabled(true)}
                className={`p-5 rounded-xl border text-left flex flex-col justify-between transition-all ${
                  remindersEnabled
                    ? 'border-teal-600 bg-teal-50/70 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2.5 rounded-lg ${remindersEnabled ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                    <Bell className="w-5 h-5" />
                  </div>
                  {remindersEnabled && <Check className="w-4 h-4 text-teal-700 stroke-[3]" />}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-base">Enable reminders</h4>
                  <p className="text-xs text-slate-600 mt-1">
                    Morning baseline & evening check-in nudges to keep your logs uninterrupted.
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setRemindersEnabled(false)}
                className={`p-5 rounded-xl border text-left flex flex-col justify-between transition-all ${
                  !remindersEnabled
                    ? 'border-teal-600 bg-teal-50/70 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2.5 rounded-lg ${!remindersEnabled ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  {!remindersEnabled && <Check className="w-4 h-4 text-teal-700 stroke-[3]" />}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-base">Maybe later</h4>
                  <p className="text-xs text-slate-600 mt-1">
                    Record readings completely on your own schedule without scheduled prompts.
                  </p>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 5: APP TOUR ================= */}
        {step === 5 && (
          <div className="animate-in fade-in duration-200">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700">Step 5 of 5</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 mt-1">
              Welcome to VitaTrack
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2">
              Here is how your companion works:
            </p>

            <div className="mt-6 space-y-3.5">
              <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="p-2.5 rounded-lg bg-teal-100 text-teal-700 shrink-0">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Capture</h4>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                    "Use your camera to capture a reading from your health device."
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="p-2.5 rounded-lg bg-teal-100 text-teal-700 shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Confirm</h4>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                    "VitaTrack reads the numbers and lets you verify them before saving."
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="p-2.5 rounded-lg bg-teal-100 text-teal-700 shrink-0">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Understand</h4>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                    "AI helps you recognize patterns in your readings over time."
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer Navigation Buttons */}
        <div className="mt-8 pt-5 border-t border-slate-100 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < 5 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="flex items-center gap-2 px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-xs transition-all active:scale-[0.99]"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              className="flex items-center gap-2 px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all active:scale-[0.99]"
            >
              <span>Enter My Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="text-center text-xs text-slate-400 py-2">
        Step {step} of 5 • Personalized setup for {initialName || 'your profile'}
      </div>
    </div>
  );
};
