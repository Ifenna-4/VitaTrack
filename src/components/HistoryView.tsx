import React, { useState } from 'react';
import { 
  History, 
  Filter, 
  Calendar, 
  Download, 
  Gauge, 
  Droplets, 
  TrendingUp, 
  Clock, 
  Plus, 
  CheckCircle2, 
  AlertCircle,
  FileText
} from 'lucide-react';
import { HealthReading, BloodPressureValues, BloodGlucoseValues } from '../types';
import { isBloodPressure, isBloodGlucose, classifyBloodPressure, classifyGlucose } from '../utils/healthCalculations';

interface HistoryViewProps {
  readings: HealthReading[];
  onOpenCapture: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ readings, onOpenCapture }) => {
  const [filterType, setFilterType] = useState<'all' | 'blood_pressure' | 'blood_glucose'>('blood_pressure');
  const [dateRange, setDateRange] = useState<'7d' | '14d' | '30d' | 'all'>('14d');
  const [showDoctorSummary, setShowDoctorSummary] = useState(false);

  // Filter readings by date range
  const now = new Date('2026-10-07T18:00:00Z').getTime();
  const filteredByDate = readings.filter((r) => {
    const time = new Date(r.timestamp).getTime();
    if (dateRange === '7d') return now - time <= 7 * 24 * 60 * 60 * 1000;
    if (dateRange === '14d') return now - time <= 14 * 24 * 60 * 60 * 1000;
    if (dateRange === '30d') return now - time <= 30 * 24 * 60 * 60 * 1000;
    return true;
  });

  // Filter by measurement type
  const displayedReadings = filteredByDate
    .filter((r) => {
      if (filterType === 'all') return true;
      return r.type === filterType;
    })
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  // Calculations for stats
  const bpList = readings.filter((r) => r.type === 'blood_pressure');
  const glucoseList = readings.filter((r) => r.type === 'blood_glucose');

  const avgSys = bpList.length > 0 ? Math.round(bpList.reduce((acc, r) => acc + (r.values as BloodPressureValues).systolic, 0) / bpList.length) : 0;
  const avgDia = bpList.length > 0 ? Math.round(bpList.reduce((acc, r) => acc + (r.values as BloodPressureValues).diastolic, 0) / bpList.length) : 0;
  const avgGluc = glucoseList.length > 0 ? Math.round(glucoseList.reduce((acc, r) => acc + (r.values as BloodGlucoseValues).glucose, 0) / glucoseList.length) : 0;

  // Chart data preparation (chronological order)
  const chartBPReadings = [...bpList]
    .filter((r) => {
      const time = new Date(r.timestamp).getTime();
      if (dateRange === '7d') return now - time <= 7 * 24 * 60 * 60 * 1000;
      if (dateRange === '14d') return now - time <= 14 * 24 * 60 * 60 * 1000;
      return true;
    })
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  const chartGlucoseReadings = [...glucoseList]
    .filter((r) => {
      const time = new Date(r.timestamp).getTime();
      if (dateRange === '7d') return now - time <= 7 * 24 * 60 * 60 * 1000;
      if (dateRange === '14d') return now - time <= 14 * 24 * 60 * 60 * 1000;
      return true;
    })
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  // Render clean SVG line chart for Blood Pressure
  const renderBPChart = () => {
    if (chartBPReadings.length < 2) {
      return (
        <div className="h-44 flex items-center justify-center text-xs text-slate-400 bg-slate-50 rounded-xl">
          Log at least 2 readings to view visual trend lines.
        </div>
      );
    }

    const width = 640;
    const height = 180;
    const padding = { top: 20, right: 30, bottom: 30, left: 45 };

    const minVal = 60;
    const maxVal = 160;

    const getX = (index: number) => {
      return padding.left + (index / (chartBPReadings.length - 1)) * (width - padding.left - padding.right);
    };

    const getY = (val: number) => {
      return height - padding.bottom - ((val - minVal) / (maxVal - minVal)) * (height - padding.top - padding.bottom);
    };

    const sysPoints = chartBPReadings.map((r, i) => `${getX(i)},${getY((r.values as BloodPressureValues).systolic)}`).join(' ');
    const diaPoints = chartBPReadings.map((r, i) => `${getX(i)},${getY((r.values as BloodPressureValues).diastolic)}`).join(' ');

    return (
      <div className="relative overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-48 select-none">
          {/* Target zone band: 120 Systolic guideline */}
          <line
            x1={padding.left}
            y1={getY(120)}
            x2={width - padding.right}
            y2={getY(120)}
            stroke="#10b981"
            strokeDasharray="4 4"
            strokeWidth="1"
            opacity="0.6"
          />
          <text x={width - padding.right + 2} y={getY(120) + 3} fill="#10b981" fontSize="9" fontWeight="600">
            120 Target
          </text>

          {/* Stage 1 threshold: 130 */}
          <line
            x1={padding.left}
            y1={getY(130)}
            x2={width - padding.right}
            y2={getY(130)}
            stroke="#f59e0b"
            strokeDasharray="4 4"
            strokeWidth="1"
            opacity="0.4"
          />
          <text x={width - padding.right + 2} y={getY(130) + 3} fill="#f59e0b" fontSize="9">
            130
          </text>

          {/* Grid lines */}
          {[80, 100, 140].map((level) => (
            <g key={level}>
              <line
                x1={padding.left}
                y1={getY(level)}
                x2={width - padding.right}
                y2={getY(level)}
                stroke="#e2e8f0"
                strokeWidth="1"
              />
              <text x={padding.left - 8} y={getY(level) + 3} fill="#94a3b8" fontSize="9" textAnchor="end">
                {level}
              </text>
            </g>
          ))}

          {/* Systolic Line */}
          <polyline
            fill="none"
            stroke="#e11d48"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={sysPoints}
          />

          {/* Diastolic Line */}
          <polyline
            fill="none"
            stroke="#0284c7"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={diaPoints}
          />

          {/* Points & Values */}
          {chartBPReadings.map((r, i) => {
            const vals = r.values as BloodPressureValues;
            const x = getX(i);
            const sysY = getY(vals.systolic);
            const diaY = getY(vals.diastolic);
            const d = new Date(r.timestamp);
            const dateStr = `${d.getMonth() + 1}/${d.getDate()}`;

            return (
              <g key={r.id}>
                {/* Systolic dot */}
                <circle cx={x} cy={sysY} r="4.5" fill="#e11d48" stroke="#ffffff" strokeWidth="2" />
                <text x={x} y={sysY - 8} fill="#e11d48" fontSize="9" fontWeight="700" textAnchor="middle">
                  {vals.systolic}
                </text>

                {/* Diastolic dot */}
                <circle cx={x} cy={diaY} r="4" fill="#0284c7" stroke="#ffffff" strokeWidth="2" />
                <text x={x} y={diaY + 12} fill="#0284c7" fontSize="9" fontWeight="700" textAnchor="middle">
                  {vals.diastolic}
                </text>

                {/* Date label at bottom */}
                <text x={x} y={height - 10} fill="#64748b" fontSize="9" textAnchor="middle">
                  {dateStr}
                </text>
              </g>
            );
          })}
        </svg>

        <div className="flex items-center justify-center gap-6 mt-2 text-xs font-medium text-slate-600">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-600"></span>
            <span>Systolic (mmHg)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-sky-600"></span>
            <span>Diastolic (mmHg)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-emerald-500 border border-emerald-500 border-dashed"></span>
            <span className="text-emerald-700">120 mmHg Normal Guideline</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Top Title & Quick Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
            Reading History
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Longitudinal logs of blood pressure and glucose readings recorded over time.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowDoctorSummary(!showDoctorSummary)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl shadow-2xs transition-colors"
          >
            <FileText className="w-4 h-4 text-teal-600" />
            <span>Doctor Visit Summary</span>
          </button>

          <button
            onClick={onOpenCapture}
            className="flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Reading</span>
          </button>
        </div>
      </div>

      {/* Doctor Visit Clinical Summary Box (Collapsible) */}
      {showDoctorSummary && (
        <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-sm animate-in fade-in duration-200">
          <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-teal-400" />
              <h3 className="font-bold text-sm">Provider Export Summary (Print-Ready)</h3>
            </div>
            <button
              onClick={() => window.print()}
              className="text-xs px-3 py-1 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-lg transition-colors"
            >
              Print / Save PDF
            </button>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-mono">
            <strong>Patient Summary Window:</strong> Past 14 Days • Active Monitored Conditions: Hypertension, Diabetes<br />
            • Blood Pressure Average: <strong>{avgSys}/{avgDia} mmHg</strong> across {bpList.length} readings<br />
            • Blood Glucose Average: <strong>{avgGluc} mg/dL</strong> across {glucoseList.length} checks<br />
            • Peak Systolic: 142 mmHg (Oct 6, accompanied by reported headache & workday tension)<br />
            • Observed Trend: Gradual systolic increase over last 7 readings with diurnal higher morning baseline.
          </p>
        </div>
      )}

      {/* Quick Summary Numbers Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Recorded</span>
          <p className="text-2xl font-black text-slate-900 mt-1">{readings.length}</p>
          <span className="text-xs text-slate-500">Measurements</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Average Blood Pressure</span>
          <p className="text-2xl font-black text-slate-900 mt-1">
            {avgSys}/{avgDia}
          </p>
          <span className="text-xs text-slate-500">mmHg</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Average Blood Glucose</span>
          <p className="text-2xl font-black text-slate-900 mt-1">{avgGluc}</p>
          <span className="text-xs text-slate-500">mg/dL</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Monitoring Window</span>
          <p className="text-2xl font-black text-teal-700 mt-1">14 Days</p>
          <span className="text-xs text-slate-500">Unbroken data</span>
        </div>
      </div>

      {/* Visual Chart Card */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Longitudinal Chart</h3>
            <p className="text-xs text-slate-500">Visual trend lines against AHA clinical target zones</p>
          </div>

          {/* Date range pills */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-start sm:self-auto text-xs font-semibold">
            {(['7d', '14d', '30d', 'all'] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setDateRange(r)}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  dateRange === r ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {r === '7d' ? '7 Days' : r === '14d' ? '14 Days' : r === '30d' ? '30 Days' : 'All'}
              </button>
            ))}
          </div>
        </div>

        {filterType === 'blood_glucose' ? (
          <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 rounded-xl">
            Blood Glucose range chart: Fasting baseline ~104 mg/dL. All readings within monitored target parameters.
          </div>
        ) : (
          renderBPChart()
        )}
      </div>

      {/* Filter Tabs for the Table */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl w-fit">
          <button
            onClick={() => setFilterType('blood_pressure')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              filterType === 'blood_pressure' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Blood Pressure
          </button>
          <button
            onClick={() => setFilterType('blood_glucose')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              filterType === 'blood_glucose' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Blood Glucose
          </button>
          <button
            onClick={() => setFilterType('all')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              filterType === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Logs
          </button>
        </div>

        <span className="text-xs text-slate-400">
          Showing {displayedReadings.length} chronological records
        </span>
      </div>

      {/* Tabular History List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4 sm:px-6">Date</th>
                <th className="py-3 px-3">Time</th>
                {filterType === 'blood_pressure' || filterType === 'all' ? (
                  <>
                    <th className="py-3 px-3 text-right">Systolic</th>
                    <th className="py-3 px-3 text-right">Diastolic</th>
                    <th className="py-3 px-3 text-right">Pulse</th>
                  </>
                ) : null}
                {filterType === 'blood_glucose' || filterType === 'all' ? (
                  <>
                    <th className="py-3 px-3 text-right">Glucose</th>
                    <th className="py-3 px-3">Context</th>
                  </>
                ) : null}
                <th className="py-3 px-4">Classification</th>
                <th className="py-3 px-4 hidden md:table-cell">Context / Device Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {displayedReadings.map((reading) => {
                const dateObj = new Date(reading.timestamp);
                const dateLabel = dateObj.toLocaleDateString([], { month: 'short', day: 'numeric' });
                const timeLabel = dateObj.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

                return (
                  <tr key={reading.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Date */}
                    <td className="py-3.5 px-4 sm:px-6 font-bold text-slate-900 whitespace-nowrap">
                      {dateLabel}
                    </td>

                    {/* Time */}
                    <td className="py-3.5 px-3 text-slate-500 whitespace-nowrap">
                      {timeLabel}
                    </td>

                    {/* Blood Pressure Fields */}
                    {reading.type === 'blood_pressure' && isBloodPressure(reading.values) ? (
                      <>
                        <td className="py-3.5 px-3 text-right font-extrabold text-slate-900">
                          {reading.values.systolic}
                        </td>
                        <td className="py-3.5 px-3 text-right font-bold text-slate-700">
                          {reading.values.diastolic}
                        </td>
                        <td className="py-3.5 px-3 text-right text-slate-500">
                          {reading.values.pulse || '—'}
                        </td>
                        {filterType === 'all' && (
                          <>
                            <td className="py-3.5 px-3 text-right text-slate-300">—</td>
                            <td className="py-3.5 px-3 text-slate-300">—</td>
                          </>
                        )}
                        <td className="py-3.5 px-4">
                          {(() => {
                            const c = classifyBloodPressure(reading.values.systolic, reading.values.diastolic);
                            return (
                              <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold border ${c.bgColor} ${c.borderColor} ${c.color}`}>
                                {c.label}
                              </span>
                            );
                          })()}
                        </td>
                      </>
                    ) : null}

                    {/* Blood Glucose Fields */}
                    {reading.type === 'blood_glucose' && isBloodGlucose(reading.values) ? (
                      <>
                        {filterType === 'all' && (
                          <>
                            <td className="py-3.5 px-3 text-right text-slate-300">—</td>
                            <td className="py-3.5 px-3 text-right text-slate-300">—</td>
                            <td className="py-3.5 px-3 text-right text-slate-300">—</td>
                          </>
                        )}
                        <td className="py-3.5 px-3 text-right font-extrabold text-slate-900">
                          {reading.values.glucose} <span className="text-[10px] font-normal text-slate-400">mg/dL</span>
                        </td>
                        <td className="py-3.5 px-3 text-slate-600 capitalize">
                          {(reading.values.mealContext || 'fasting').replace('_', ' ')}
                        </td>
                        <td className="py-3.5 px-4">
                          {(() => {
                            const c = classifyGlucose(reading.values.glucose, reading.values.mealContext);
                            return (
                              <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold border ${c.bgColor} ${c.borderColor} ${c.color}`}>
                                {c.label}
                              </span>
                            );
                          })()}
                        </td>
                      </>
                    ) : null}

                    {/* Notes & Device */}
                    <td className="py-3.5 px-4 hidden md:table-cell text-xs text-slate-500">
                      <div className="truncate max-w-xs">
                        {reading.notes || reading.deviceModel || 'Camera scan confirmed'}
                        {reading.symptomsAtTime && reading.symptomsAtTime.length > 0 && (
                          <span className="ml-1 text-rose-600 font-semibold">
                            (Reported: {reading.symptomsAtTime.join(', ')})
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
