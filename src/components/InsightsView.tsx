import React, { useMemo } from 'react';
import { 
  TrendingUp, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  HelpCircle, 
  Activity, 
  ShieldCheck, 
  CalendarCheck,
  ChevronRight,
  MessageSquare
} from 'lucide-react';
import { HealthReading, HealthInsight, BloodPressureValues, UserProfile } from '../types';
import { generateHealthInsights } from '../utils/healthCalculations';

interface InsightsViewProps {
  readings: HealthReading[];
  userProfile: UserProfile;
  onOpenVitaAssistant: () => void;
  onOpenCapture: () => void;
}

export const InsightsView: React.FC<InsightsViewProps> = ({
  readings,
  userProfile,
  onOpenVitaAssistant,
  onOpenCapture,
}) => {
  // Generate insights dynamically from the actual stored readings
  const insights = useMemo(() => {
    return generateHealthInsights(readings);
  }, [readings]);

  // BP readings for chart display
  const bpReadings = readings
    .filter((r) => r.type === 'blood_pressure')
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  // Sufficient data check guardrail
  const hasEnoughData = readings.length >= 4;

  // Render Longitudinal Trend Chart
  const renderTrendChart = () => {
    if (bpReadings.length < 4) {
      return (
        <div className="h-44 flex items-center justify-center text-xs text-slate-400 bg-slate-50 rounded-xl">
          More readings needed to establish a trendline. Record at least 4 readings.
        </div>
      );
    }

    const last7 = bpReadings.slice(-7);
    const width = 600;
    const height = 160;
    const padding = { top: 20, right: 30, bottom: 30, left: 40 };

    const minSys = 110;
    const maxSys = 150;

    const getX = (index: number) => {
      return padding.left + (index / (last7.length - 1)) * (width - padding.left - padding.right);
    };

    const getY = (val: number) => {
      return height - padding.bottom - ((val - minSys) / (maxSys - minSys)) * (height - padding.top - padding.bottom);
    };

    const points = last7.map((r, i) => `${getX(i)},${getY((r.values as BloodPressureValues).systolic)}`).join(' ');

    return (
      <div className="w-full overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-44 select-none">
          {/* Target 120 guide */}
          <line
            x1={padding.left}
            y1={getY(120)}
            x2={width - padding.right}
            y2={getY(120)}
            stroke="#10b981"
            strokeDasharray="4 4"
            strokeWidth="1.5"
            opacity="0.7"
          />
          <text x={width - padding.right + 2} y={getY(120) + 3} fill="#10b981" fontSize="9" fontWeight="bold">
            120 Target
          </text>

          {/* Upward Trend Line */}
          <polyline
            fill="none"
            stroke="#0d9488"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={points}
          />

          {/* Area gradient under curve */}
          <polygon
            points={`${getX(0)},${height - padding.bottom} ${points} ${getX(last7.length - 1)},${height - padding.bottom}`}
            fill="#0d9488"
            fillOpacity="0.08"
          />

          {/* Points */}
          {last7.map((r, i) => {
            const vals = r.values as BloodPressureValues;
            const x = getX(i);
            const y = getY(vals.systolic);
            const d = new Date(r.timestamp);
            const dateStr = `${d.getMonth() + 1}/${d.getDate()}`;

            return (
              <g key={r.id}>
                <circle cx={x} cy={y} r="5" fill="#0d9488" stroke="#ffffff" strokeWidth="2.5" />
                <text x={x} y={y - 8} fill="#0f766e" fontSize="10" fontWeight="700" textAnchor="middle">
                  {vals.systolic}
                </text>
                <text x={x} y={height - 10} fill="#64748b" fontSize="9" textAnchor="middle">
                  {dateStr}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-teal-100 text-teal-800">
              <Sparkles className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold text-teal-800 uppercase tracking-widest">
              AI Trend Engine
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight mt-1">
            Personal Health Insights
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            VitaTrack turns raw readings into longitudinal pattern recognition for thoughtful doctor consultations.
          </p>
        </div>

        <button
          onClick={onOpenVitaAssistant}
          className="flex items-center gap-2 px-4 py-2.5 bg-teal-50 hover:bg-teal-100 text-teal-900 border border-teal-200 rounded-xl text-xs sm:text-sm font-bold shadow-2xs transition-all self-start sm:self-auto"
        >
          <MessageSquare className="w-4 h-4 text-teal-600" />
          <span>Ask Vita About My Trends</span>
        </button>
      </div>

      {/* Main Showcase Trend Card: "Your blood pressure trend" */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">
              Primary Trajectory
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">
              Your blood pressure trend
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              "Your systolic readings have gradually increased over your last 7 recorded measurements."
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <span className="px-3 py-1 bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold rounded-lg flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-amber-600" />
              <span>Shift Observed</span>
            </span>
          </div>
        </div>

        {/* The Corresponding Visual Trend Chart */}
        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between text-xs text-slate-500">
            <span>Systolic Reading Trajectory (Past 7 Checks)</span>
            <span className="text-emerald-700 font-medium">Target: &lt;120 mmHg</span>
          </div>
          {renderTrendChart()}
        </div>

        <div className="mt-4 p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 leading-relaxed flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
          <span>
            <strong>Observational note:</strong> VitaTrack frames this as an educational summary rather than a medical diagnosis. Your morning systolic average rose from 122 mmHg (Oct 1) to 128–142 mmHg (Oct 5–7). Bring this 7-day trajectory to your upcoming appointment.
          </span>
        </div>
      </div>

      {/* Insight Cards Grid */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3">
          Recognized Pattern Cards
        </h3>

        {!hasEnoughData ? (
          <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center">
            <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <h4 className="font-bold text-slate-800">More data required to establish reliable trends</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              VitaTrack adheres strictly to responsible health principles: we only generate insights when there is enough data to support them. Record a few more readings to unlock pattern recognition.
            </p>
            <button
              onClick={onOpenCapture}
              className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-xl text-xs font-bold"
            >
              + Add a Reading Now
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Card 1: Trend Detected */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs flex flex-col justify-between hover:border-teal-300 transition-colors">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-amber-50 text-amber-700 rounded-lg">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md">
                    Week-over-week
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 text-base">Trend detected</h4>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  "Your average systolic reading this week is higher than your previous week."
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-semibold text-slate-700 flex items-center justify-between">
                <span>Shift metric:</span>
                <span className="text-amber-800 font-bold">+7 mmHg average</span>
              </div>
            </div>

            {/* Card 2: Consistency */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs flex flex-col justify-between hover:border-teal-300 transition-colors">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-emerald-50 text-emerald-700 rounded-lg">
                    <CalendarCheck className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded-md">
                    Adherence
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 text-base">Consistency</h4>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  "You've recorded your blood pressure 6 times this week, maintaining an unbroken monitoring routine."
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-semibold text-slate-700 flex items-center justify-between">
                <span>Weekly checks:</span>
                <span className="text-emerald-700 font-bold">6 readings logged</span>
              </div>
            </div>

            {/* Card 3: Pattern (Diurnal morning vs evening) */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs flex flex-col justify-between hover:border-teal-300 transition-colors">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-sky-50 text-sky-700 rounded-lg">
                    <Clock className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-sky-50 text-sky-800 rounded-md">
                    Time of Day
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 text-base">Pattern identified</h4>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  "Your morning readings have generally been higher than your evening readings."
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-semibold text-slate-700 flex items-center justify-between">
                <span>Morning variance:</span>
                <span className="text-sky-800 font-bold">Avg +8 mmHg AM vs PM</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Actionable Doctor Talking Points Section */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 mb-2">
          <HelpCircle className="w-5 h-5 text-teal-600" />
          <h3 className="font-bold text-slate-900 text-base">Suggested Questions for Your Care Team</h3>
        </div>
        <p className="text-xs text-slate-500 mb-4">
          Based on the patterns identified in your 14-day history, these non-diagnostic talking points can help guide your conversation with your doctor:
        </p>

        <div className="space-y-2.5">
          {[
            'Is my morning systolic increase typical for my current medication timing, or should we adjust when I take my dose?',
            'On days where I logged a headache (e.g. Oct 6), my systolic reached 142 mmHg. What should my action threshold be if that recurs?',
            'My fasting glucose has remained stable around 104 mg/dL. Are there specific post-prandial meal windows you recommend focusing on next?',
          ].map((q, idx) => (
            <div key={idx} className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl text-xs text-slate-700 flex items-start gap-2.5">
              <span className="font-bold text-teal-700 text-xs shrink-0">{idx + 1}.</span>
              <p className="leading-relaxed">{q}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
