import React from 'react';
import { AlertTriangle, PhoneCall, X, ShieldCheck } from 'lucide-react';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-rose-100 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start gap-4">
          <div className="p-3 bg-rose-100 text-rose-700 rounded-xl shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Important Safety Notice</h3>
            <p className="text-sm text-slate-600 mt-1">
              VitaTrack is a personal monitoring and educational companion. It is <strong className="text-slate-900">not an emergency medical service</strong> and does not provide clinical diagnoses.
            </p>
          </div>
        </div>

        <div className="mt-5 space-y-3 bg-rose-50/70 border border-rose-100 rounded-xl p-4 text-xs text-rose-900 leading-relaxed">
          <p className="font-semibold text-rose-950 text-sm">When to Seek Immediate Emergency Care:</p>
          <ul className="list-disc pl-4 space-y-1.5">
            <li>Severe chest pain, chest pressure, or shortness of breath.</li>
            <li>Sudden weakness or numbness in the face, arm, or leg (especially on one side).</li>
            <li>Blood pressure readings exceeding 180/120 mmHg accompanied by headache, blurry vision, or chest discomfort.</li>
            <li>Severe confusion, seizures, or fainting spells.</li>
          </ul>
        </div>

        <div className="mt-5 p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-medium">In the United States</p>
            <p className="text-sm font-bold text-slate-900">Emergency Medical Services: 911</p>
          </div>
          <a
            href="tel:911"
            className="flex items-center gap-1.5 px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <PhoneCall className="w-3.5 h-3.5" /> Call 911
          </a>
        </div>

        <div className="mt-5 flex items-center justify-between pt-3 border-t border-slate-100">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Educational use only</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded-lg transition-colors"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};
