import React from 'react';
import { 
  Activity, 
  Camera, 
  CheckCircle2, 
  TrendingUp, 
  ArrowRight, 
  Shield, 
  Heart, 
  Sparkles,
  ChevronRight,
  Eye,
  FileCheck2,
  Brain
} from 'lucide-react';

interface LandingScreenProps {
  onGetStarted: () => void;
  onAlreadyHaveAccount: () => void;
  onExploreDemo: () => void;
}

export const LandingScreen: React.FC<LandingScreenProps> = ({
  onGetStarted,
  onAlreadyHaveAccount,
  onExploreDemo,
}) => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-teal-100 selection:text-teal-900">
      {/* Top Navigation */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-xs">
            <Activity className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-slate-900">VitaTrack</span>
            <span className="block text-[11px] font-medium text-slate-500 uppercase tracking-wider">Health Companion</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onAlreadyHaveAccount}
            className="text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 px-3 py-2 rounded-lg transition-colors"
          >
            I already have an account
          </button>
          <button
            onClick={onExploreDemo}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200/80 rounded-lg transition-colors"
          >
            <span>Explore Demo</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 flex flex-col items-center">
        {/* Subtle pill badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 shadow-2xs text-xs font-medium text-slate-700 mb-6">
          <span className="w-2 h-2 rounded-full bg-teal-500"></span>
          <span>Designed for Hypertension, Hypotension & Diabetes</span>
        </div>

        {/* Main Headline & Supporting Copy */}
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-950 leading-[1.15]">
            See your health. <br />
            <span className="text-teal-700">Understand your trends.</span>
          </h1>
          <p className="mt-5 text-lg sm:text-xl text-slate-600 font-normal leading-relaxed max-w-2xl mx-auto">
            VitaTrack turns everyday health readings into a clearer picture of your health over time.
          </p>
        </div>

        {/* CTA Button Group */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full max-w-md">
          <button
            onClick={onGetStarted}
            className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm rounded-xl shadow-xs hover:shadow-md transition-all active:scale-[0.99]"
          >
            <span>Get Started</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={onExploreDemo}
            className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-white hover:bg-slate-100 text-slate-800 font-semibold text-sm rounded-xl border border-slate-200 shadow-2xs transition-colors"
          >
            <span>Explore Interactive Demo</span>
          </button>
        </div>

        <p className="mt-3 text-xs text-slate-500 text-center">
          No credit card required • Educational & personal tracking companion
        </p>

        {/* Interactive Core Principle Card: CAPTURE -> CONFIRM -> UNDERSTAND */}
        <div className="w-full max-w-5xl mt-14 bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs">
          <div className="text-center mb-8">
            <span className="text-xs font-bold uppercase tracking-widest text-teal-700">Core Product Principle</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
              Capture <span className="text-slate-400">→</span> Confirm <span className="text-slate-400">→</span> Understand
            </h2>
            <p className="text-sm text-slate-500 mt-1.5 max-w-xl mx-auto">
              Never feel like you are just typing numbers into a spreadsheet. VitaTrack guides you from physical device to medical insight.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1: Capture */}
            <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-5 flex flex-col relative group hover:border-teal-300 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-teal-100/80 text-teal-700 flex items-center justify-center font-bold text-sm mb-4">
                <Camera className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider text-teal-800">Step 1</span>
              <h3 className="text-lg font-bold text-slate-900 mt-0.5">Capture</h3>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                Use your phone or computer camera to point directly at your blood pressure monitor or glucose meter display.
              </p>
              <div className="mt-4 pt-3 border-t border-slate-200/60 text-xs font-medium text-slate-500 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-teal-600" />
                <span>Simulated or live computer vision</span>
              </div>
            </div>

            {/* Step 2: Confirm */}
            <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-5 flex flex-col relative group hover:border-teal-300 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-teal-100/80 text-teal-700 flex items-center justify-center font-bold text-sm mb-4">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider text-teal-800">Step 2</span>
              <h3 className="text-lg font-bold text-slate-900 mt-0.5">Confirm</h3>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                VitaTrack extracts systolic, diastolic, pulse, or glucose numbers and requires you to verify and edit before saving.
              </p>
              <div className="mt-4 pt-3 border-t border-slate-200/60 text-xs font-medium text-slate-500 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Zero accidental data entries</span>
              </div>
            </div>

            {/* Step 3: Understand */}
            <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-5 flex flex-col relative group hover:border-teal-300 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-teal-100/80 text-teal-700 flex items-center justify-center font-bold text-sm mb-4">
                <Brain className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider text-teal-800">Step 3</span>
              <h3 className="text-lg font-bold text-slate-900 mt-0.5">Understand</h3>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                AI recognizes longitudinal patterns, diurnal differences, and contextual symptoms to prepare meaningful discussions for your doctor.
              </p>
              <div className="mt-4 pt-3 border-t border-slate-200/60 text-xs font-medium text-slate-500 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-teal-600" />
                <span>Non-diagnostic, longitudinal trends</span>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="w-full max-w-5xl mt-12 grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
            <div className="p-2.5 bg-sky-50 text-sky-700 rounded-lg w-fit mb-3">
              <Activity className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-base">Condition-Tuned Metrics</h4>
            <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
              Prioritizes blood pressure for hypertension or hypotension, and blood glucose for diabetes, tailoring targets to your needs.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
            <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-lg w-fit mb-3">
              <Heart className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-base">Daily Symptom Check-In</h4>
            <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
              Track how you feel (Great, Okay, Not my best) alongside headaches or dizziness so you can view symptom-reading correlations.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
            <div className="p-2.5 bg-purple-50 text-purple-700 rounded-lg w-fit mb-3">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-base">Vita Health Assistant</h4>
            <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
              Ask questions directly grounded in your stored readings: peak measurements, weekly averages, and habits.
            </p>
          </div>
        </div>

        {/* Clear Medical Disclaimer Callout */}
        <div className="w-full max-w-4xl mt-12 bg-slate-100/80 border border-slate-200/90 rounded-xl p-4 text-center">
          <div className="flex items-center justify-center gap-2 text-slate-700 text-xs font-semibold mb-1">
            <Shield className="w-4 h-4 text-teal-700" />
            <span>Responsible Consumer Health Commitment</span>
          </div>
          <p className="text-xs text-slate-500 max-w-2xl mx-auto leading-relaxed">
            VitaTrack is an educational monitoring companion. It does not replace professional medical judgment, diagnosis, or emergency healthcare. Always discuss persistent or concerning readings with your licensed care team.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>VitaTrack • Chronic Illness Monitoring Companion</span>
          <span>Educational & Personal Monitoring Platform</span>
        </div>
      </footer>
    </div>
  );
};
