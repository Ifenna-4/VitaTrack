import React from 'react';
import { 
  User, 
  Heart, 
  MapPin, 
  Bell, 
  Activity, 
  Flame, 
  ShieldCheck, 
  Calendar, 
  Clock, 
  Gauge, 
  Droplets,
  RotateCcw,
  Check
} from 'lucide-react';
import { UserProfile, HealthReading, BloodPressureValues, BloodGlucoseValues } from '../types';
import { isBloodPressure, isBloodGlucose } from '../utils/healthCalculations';

interface HealthProfileViewProps {
  userProfile: UserProfile;
  readings: HealthReading[];
  onResetDemo: () => void;
  onUpdateConditions: (conditions: any[]) => void;
}

export const HealthProfileView: React.FC<HealthProfileViewProps> = ({
  userProfile,
  readings,
  onResetDemo,
  onUpdateConditions,
}) => {
  const bpList = readings.filter((r) => r.type === 'blood_pressure');
  const glucoseList = readings.filter((r) => r.type === 'blood_glucose');

  const latestReading = readings.length > 0
    ? [...readings].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0]
    : null;

  const avgSys = bpList.length > 0
    ? Math.round(bpList.reduce((acc, r) => acc + (r.values as BloodPressureValues).systolic, 0) / bpList.length)
    : null;

  const avgDia = bpList.length > 0
    ? Math.round(bpList.reduce((acc, r) => acc + (r.values as BloodPressureValues).diastolic, 0) / bpList.length)
    : null;

  const avgGluc = glucoseList.length > 0
    ? Math.round(glucoseList.reduce((acc, r) => acc + (r.values as BloodGlucoseValues).glucose, 0) / glucoseList.length)
    : null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Top Profile Header Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-teal-600 text-white flex items-center justify-center font-bold text-2xl shadow-sm">
            {userProfile.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-950">
                {userProfile.name}
              </h1>
              {userProfile.isDemo && (
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                  Demo Profile
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{userProfile.email}</p>
            <div className="flex items-center gap-3 mt-2 text-xs text-slate-600">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-teal-600" />
                <span>{userProfile.location}</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Bell className="w-3.5 h-3.5 text-teal-600" />
                <span>{userProfile.remindersEnabled ? 'Reminders On' : 'Reminders Paused'}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Monitoring Streak Badge (Encouraging without excessive gamification) */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-center self-stretch sm:self-auto">
          <div className="flex items-center justify-center gap-1.5 text-amber-600 mb-0.5">
            <Flame className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Streak</span>
          </div>
          <p className="text-xl font-black text-slate-900">{userProfile.streakDays} Day</p>
          <span className="text-[11px] text-slate-500">Check-in streak</span>
        </div>
      </div>

      {/* Grid: Conditions & Family History */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Conditions I'm Monitoring */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700">Medical Focus</span>
          <h2 className="text-lg font-bold text-slate-900 mt-1">Conditions I'm Monitoring</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Determines priority measurements and dashboard insights.
          </p>

          <div className="mt-4 space-y-2">
            {['hypertension', 'hypotension', 'diabetes'].map((cond) => {
              const isMonitored = userProfile.conditions.includes(cond as any);
              return (
                <div
                  key={cond}
                  className={`p-3 rounded-xl border flex items-center justify-between text-xs font-semibold ${
                    isMonitored
                      ? 'bg-teal-50/70 border-teal-200 text-teal-950'
                      : 'bg-slate-50 border-slate-200 text-slate-400'
                  }`}
                >
                  <span className="capitalize">{cond}</span>
                  {isMonitored ? (
                    <span className="px-2 py-0.5 bg-teal-600 text-white text-[10px] rounded-md font-bold">
                      Active
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-400">Not monitored</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Family History */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700">Contextual Genetics</span>
          <h2 className="text-lg font-bold text-slate-900 mt-1">Family History</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Immediate family conditions provided during onboarding.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {userProfile.familyHistory.length > 0 ? (
              userProfile.familyHistory.map((item) => (
                <span
                  key={item}
                  className="px-3 py-1.5 bg-slate-100 border border-slate-200 text-slate-800 text-xs font-semibold rounded-xl"
                >
                  {item}
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-400">None specified</span>
            )}
          </div>

          <div className="mt-6 pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Used strictly for personalized context in AI summaries.</span>
          </div>
        </div>
      </div>

      {/* Monitoring Summary Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs">
        <span className="text-xs font-bold uppercase tracking-wider text-teal-700">Longitudinal Aggregation</span>
        <h2 className="text-lg font-bold text-slate-900 mt-1">Monitoring Summary</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Cumulative statistics across your recorded health logs.
        </p>

        <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {/* Number of readings */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Number of Readings</span>
            <p className="text-2xl font-black text-slate-900 mt-1">{readings.length}</p>
            <span className="text-xs text-slate-500">Total logs</span>
          </div>

          {/* Most recent reading */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Most Recent</span>
            <p className="text-lg font-extrabold text-slate-900 mt-1">
              {latestReading
                ? latestReading.type === 'blood_pressure'
                  ? `${(latestReading.values as BloodPressureValues).systolic}/${(latestReading.values as BloodPressureValues).diastolic}`
                  : `${(latestReading.values as BloodGlucoseValues).glucose} mg/dL`
                : '—'}
            </p>
            <span className="text-[11px] text-slate-500">
              {latestReading ? new Date(latestReading.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' }) : 'No data'}
            </span>
          </div>

          {/* Average readings */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Average Blood Pressure</span>
            <p className="text-lg font-extrabold text-slate-900 mt-1">
              {avgSys && avgDia ? `${avgSys} / ${avgDia}` : '—'}
            </p>
            <span className="text-[11px] text-slate-500">mmHg</span>
          </div>

          {/* Recent trends */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Recent Trend</span>
            <p className="text-sm font-extrabold text-teal-800 mt-2">Active Trajectory</p>
            <span className="text-[10px] text-slate-500">Past 7 measurements</span>
          </div>
        </div>
      </div>

      {/* Prototype Reset Controls */}
      <div className="p-4 bg-slate-100/80 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div>
          <p className="font-bold text-slate-800">Sample Prototype Controls</p>
          <p className="text-slate-500">Reset the sample readings to their initial default state at any time.</p>
        </div>
        <button
          onClick={onResetDemo}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-700 shadow-2xs transition-colors shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-600" />
          <span>Reset Sample Readings</span>
        </button>
      </div>
    </div>
  );
};
