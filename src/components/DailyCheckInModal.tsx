import React, { useState } from 'react';
import { X, CalendarCheck, Smile, Meh, Frown, AlertCircle, Check, Info } from 'lucide-react';
import { CheckIn, Feeling } from '../types';

interface DailyCheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveCheckIn: (checkIn: CheckIn) => void;
}

export const DailyCheckInModal: React.FC<DailyCheckInModalProps> = ({
  isOpen,
  onClose,
  onSaveCheckIn,
}) => {
  const [feeling, setFeeling] = useState<Feeling>('okay');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const toggleSymptom = (sym: string) => {
    if (sym === 'None') {
      setSelectedSymptoms([]);
      return;
    }
    const filtered = selectedSymptoms.filter((s) => s !== 'None');
    if (filtered.includes(sym)) {
      setSelectedSymptoms(filtered.filter((s) => s !== sym));
    } else {
      setSelectedSymptoms([...filtered, sym]);
    }
  };

  const handleSave = () => {
    const newCheckIn: CheckIn = {
      id: `ci-${Date.now()}`,
      timestamp: new Date().toISOString(),
      feeling,
      symptoms: selectedSymptoms,
      notes: notes.trim() || undefined,
    };
    onSaveCheckIn(newCheckIn);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-3">
          <div className="p-2 rounded-lg bg-teal-100 text-teal-700">
            <CalendarCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Daily Health Check-In</h3>
            <p className="text-xs text-slate-500">Record how you feel alongside your measurements</p>
          </div>
        </div>

        {/* Question: How are you feeling today? */}
        <div className="mt-4">
          <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">
            How are you feeling today?
          </label>
          <div className="grid grid-cols-2 gap-2.5">
            {[
              { id: 'great' as Feeling, label: 'Great', icon: Smile, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
              { id: 'okay' as Feeling, label: 'Okay', icon: Meh, color: 'text-teal-600 bg-teal-50 border-teal-200' },
              { id: 'not_my_best' as Feeling, label: 'Not my best', icon: Frown, color: 'text-amber-600 bg-amber-50 border-amber-200' },
              { id: 'concerned' as Feeling, label: "I'm concerned", icon: AlertCircle, color: 'text-rose-600 bg-rose-50 border-rose-200' },
            ].map((item) => {
              const Icon = item.icon;
              const isSelected = feeling === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setFeeling(item.id)}
                  className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                    isSelected
                      ? `${item.color} font-bold shadow-xs ring-1 ring-teal-500`
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="text-xs">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Optional Symptoms */}
        <div className="mt-5">
          <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
            Any noticeable symptoms? (Optional)
          </label>
          <div className="flex flex-wrap gap-2">
            {['Headache', 'Dizziness', 'Fatigue', 'Increased thirst', 'None'].map((sym) => {
              const isSelected = selectedSymptoms.includes(sym) || (sym === 'None' && selectedSymptoms.length === 0);
              return (
                <button
                  key={sym}
                  type="button"
                  onClick={() => toggleSymptom(sym)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-teal-700 text-white border-teal-700'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  <span>{sym}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Notes */}
        <div className="mt-5">
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Personal Context Note
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Slept 6 hours, had coffee, finished busy work deadline..."
            className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 text-slate-900"
          />
        </div>

        <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-500 flex items-start gap-2">
          <Info className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
          <span>
            Check-ins are recorded directly in your health timeline so you and your doctor can observe how physical symptoms match up with your readings.
          </span>
        </div>

        <div className="mt-5 flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all active:scale-[0.99]"
          >
            Save Check-In
          </button>
        </div>
      </div>
    </div>
  );
};
