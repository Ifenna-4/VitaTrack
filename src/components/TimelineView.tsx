import React from 'react';
import { 
  Clock, 
  Gauge, 
  Droplets, 
  CalendarCheck, 
  Smile, 
  Meh, 
  Frown, 
  AlertCircle, 
  Plus, 
  FileText,
  Calendar,
  Sparkles
} from 'lucide-react';
import { HealthReading, CheckIn, Feeling } from '../types';
import { isBloodPressure, isBloodGlucose, classifyBloodPressure, classifyGlucose } from '../utils/healthCalculations';

interface TimelineViewProps {
  readings: HealthReading[];
  checkIns: CheckIn[];
  onOpenCapture: () => void;
  onOpenCheckIn: () => void;
}

interface TimelineEvent {
  id: string;
  timestamp: string;
  type: 'blood_pressure' | 'blood_glucose' | 'check_in';
  data: any;
}

export const TimelineView: React.FC<TimelineViewProps> = ({
  readings,
  checkIns,
  onOpenCapture,
  onOpenCheckIn,
}) => {
  // Combine readings and check-ins into unified timeline events
  const allEvents: TimelineEvent[] = [
    ...readings.map((r) => ({
      id: r.id,
      timestamp: r.timestamp,
      type: r.type,
      data: r,
    })),
    ...checkIns.map((ci) => ({
      id: ci.id,
      timestamp: ci.timestamp,
      type: 'check_in' as const,
      data: ci,
    })),
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  // Group events by Date String (e.g., "October 7, 2026")
  const groupedByDay: { [dateStr: string]: TimelineEvent[] } = {};
  allEvents.forEach((evt) => {
    const d = new Date(evt.timestamp);
    const dateKey = d.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
    if (!groupedByDay[dateKey]) {
      groupedByDay[dateKey] = [];
    }
    groupedByDay[dateKey].push(evt);
  });

  const feelingIcon = (feeling: Feeling) => {
    switch (feeling) {
      case 'great':
        return <Smile className="w-4 h-4 text-emerald-600" />;
      case 'okay':
        return <Meh className="w-4 h-4 text-teal-600" />;
      case 'not_my_best':
        return <Frown className="w-4 h-4 text-amber-600" />;
      case 'concerned':
        return <AlertCircle className="w-4 h-4 text-rose-600" />;
    }
  };

  const feelingLabel = (feeling: Feeling) => {
    switch (feeling) {
      case 'great':
        return 'Feeling great';
      case 'okay':
        return 'Feeling okay';
      case 'not_my_best':
        return 'Not my best';
      case 'concerned':
        return "I'm concerned";
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-teal-800 uppercase tracking-widest">
            Signature Chronology
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight mt-0.5">
            Health Timeline
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Correlates physical device measurements with daily sensations and symptoms.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenCheckIn}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl shadow-2xs transition-colors"
          >
            <CalendarCheck className="w-4 h-4 text-teal-600" />
            <span>+ Check-In</span>
          </button>
          <button
            onClick={onOpenCapture}
            className="flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>+ Reading</span>
          </button>
        </div>
      </div>

      {/* Days List */}
      <div className="space-y-8">
        {Object.entries(groupedByDay).map(([dayLabel, events]) => (
          <div key={dayLabel} className="bg-white rounded-2xl p-5 sm:p-7 border border-slate-200/90 shadow-xs">
            {/* Day Title Header */}
            <div className="flex items-center gap-2 pb-4 mb-4 border-b border-slate-100">
              <div className="p-2 bg-teal-50 text-teal-700 rounded-lg">
                <Calendar className="w-4 h-4" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                {dayLabel}
              </h2>
              <span className="text-xs font-semibold text-slate-400 ml-auto">
                {events.length} logs
              </span>
            </div>

            {/* Vertical Connected Events Spine */}
            <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
              {events.map((evt) => {
                const timeString = new Date(evt.timestamp).toLocaleTimeString([], {
                  hour: 'numeric',
                  minute: '2-digit',
                });

                return (
                  <div key={evt.id} className="relative group">
                    {/* Spine Node Marker */}
                    <div
                      className={`absolute -left-6 sm:-left-8 top-1.5 w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 border-white shadow-xs flex items-center justify-center -translate-x-1/2 ${
                        evt.type === 'blood_pressure'
                          ? 'bg-rose-500 text-white'
                          : evt.type === 'blood_glucose'
                          ? 'bg-teal-600 text-white'
                          : 'bg-amber-500 text-white'
                      }`}
                    >
                      {evt.type === 'blood_pressure' && <Gauge className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
                      {evt.type === 'blood_glucose' && <Droplets className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
                      {evt.type === 'check_in' && <CalendarCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
                    </div>

                    {/* Event Content Card */}
                    <div className="bg-slate-50/80 hover:bg-slate-50 border border-slate-200/80 rounded-xl p-4 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1.5">
                        <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{timeString}</span>
                        </span>

                        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                          {evt.type === 'blood_pressure' && 'Blood Pressure'}
                          {evt.type === 'blood_glucose' && 'Blood Glucose'}
                          {evt.type === 'check_in' && 'Daily Check-In'}
                        </span>
                      </div>

                      {/* Event Specific Body */}
                      {evt.type === 'blood_pressure' && isBloodPressure(evt.data.values) && (
                        <div>
                          <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-extrabold text-slate-950">
                              {evt.data.values.systolic} / {evt.data.values.diastolic}
                            </span>
                            <span className="text-xs font-semibold text-slate-500">mmHg</span>
                            <span className="text-xs text-slate-500 ml-2">
                              Pulse: <strong>{evt.data.values.pulse || '—'} bpm</strong>
                            </span>
                          </div>

                          {(() => {
                            const c = classifyBloodPressure(evt.data.values.systolic, evt.data.values.diastolic);
                            return (
                              <div className="mt-2 flex items-center gap-2">
                                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${c.bgColor} ${c.borderColor} ${c.color}`}>
                                  {c.label}
                                </span>
                                {evt.data.notes && (
                                  <span className="text-xs text-slate-600 italic">
                                    "{evt.data.notes}"
                                  </span>
                                )}
                              </div>
                            );
                          })()}
                        </div>
                      )}

                      {evt.type === 'blood_glucose' && isBloodGlucose(evt.data.values) && (
                        <div>
                          <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-extrabold text-slate-950">
                              {evt.data.values.glucose}
                            </span>
                            <span className="text-xs font-semibold text-slate-500">mg/dL</span>
                            <span className="text-xs text-slate-500 ml-2 capitalize">
                              ({(evt.data.values.mealContext || 'fasting').replace('_', ' ')})
                            </span>
                          </div>

                          {evt.data.notes && (
                            <p className="text-xs text-slate-600 mt-1 italic">
                              "{evt.data.notes}"
                            </p>
                          )}
                        </div>
                      )}

                      {evt.type === 'check_in' && (
                        <div>
                          <div className="flex items-center gap-2">
                            {feelingIcon(evt.data.feeling)}
                            <span className="text-sm font-bold text-slate-900">
                              {feelingLabel(evt.data.feeling)}
                            </span>
                          </div>

                          {/* Symptoms list */}
                          {evt.data.symptoms && evt.data.symptoms.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1.5">
                              {evt.data.symptoms.map((sym: string) => (
                                <span
                                  key={sym}
                                  className="px-2 py-0.5 bg-amber-100 text-amber-900 font-medium text-[11px] rounded-md border border-amber-200"
                                >
                                  {sym}
                                </span>
                              ))}
                            </div>
                          )}

                          {evt.data.notes && (
                            <p className="text-xs text-slate-600 mt-2 italic border-l-2 border-slate-300 pl-2">
                              "{evt.data.notes}"
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
