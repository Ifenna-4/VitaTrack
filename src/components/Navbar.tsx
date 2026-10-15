import React from 'react';
import { 
  Activity, 
  Camera, 
  TrendingUp, 
  Clock, 
  User, 
  Sparkles, 
  AlertCircle, 
  MapPin, 
  PlusCircle, 
  ShieldAlert,
  CalendarCheck
} from 'lucide-react';
import { UserProfile } from '../types';

export type TabType = 'dashboard' | 'capture' | 'insights' | 'history' | 'timeline' | 'food' | 'profile';

interface NavbarProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  onOpenCapture: () => void;
  onOpenCheckIn: () => void;
  onOpenVitaAssistant: () => void;
  onOpenEmergency: () => void;
  userProfile: UserProfile;
  onResetDemo: () => void;
  onSwitchToRealUser: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onOpenCapture,
  onOpenCheckIn,
  onOpenVitaAssistant,
  onOpenEmergency,
  userProfile,
  onResetDemo,
  onSwitchToRealUser,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Tagline */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => onSelectTab('dashboard')}
              className="flex items-center gap-2.5 text-left group focus:outline-hidden"
            >
              <div className="w-9 h-9 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-xs shadow-teal-600/20 group-hover:bg-teal-700 transition-colors">
                <Activity className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-teal-900 transition-colors">
                  VitaTrack
                </span>
                <span className="hidden sm:inline-block ml-2 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-teal-800 bg-teal-50 border border-teal-200/60 rounded-md">
                  Health Companion
                </span>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
              <button
                onClick={() => onSelectTab('dashboard')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  currentTab === 'dashboard'
                    ? 'text-teal-900 bg-teal-50 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => onSelectTab('history')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  currentTab === 'history'
                    ? 'text-teal-900 bg-teal-50 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                History
              </button>
              <button
                onClick={() => onSelectTab('insights')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  currentTab === 'insights'
                    ? 'text-teal-900 bg-teal-50 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                AI Insights
              </button>
              <button
                onClick={() => onSelectTab('timeline')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  currentTab === 'timeline'
                    ? 'text-teal-900 bg-teal-50 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                Timeline
              </button>
              <button
                onClick={() => onSelectTab('food')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  currentTab === 'food'
                    ? 'text-teal-900 bg-teal-50 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                Food Around You
              </button>
              <button
                onClick={() => onSelectTab('profile')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  currentTab === 'profile'
                    ? 'text-teal-900 bg-teal-50 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                Profile
              </button>
            </nav>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Demo Badge */}
            {userProfile.isDemo ? (
              <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 border border-amber-200/80 rounded-full text-xs font-medium text-amber-800">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                <span>Demo Profile</span>
                <button
                  onClick={onResetDemo}
                  title="Reset Demo Data"
                  className="ml-1 text-[11px] underline hover:text-amber-950 font-normal"
                >
                  Reset
                </button>
              </div>
            ) : (
              <div className="hidden lg:flex items-center gap-1 px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-full text-xs text-slate-700">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>{userProfile.name}</span>
              </div>
            )}

            {/* Daily Check-in quick button */}
            <button
              onClick={onOpenCheckIn}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 rounded-lg transition-colors"
            >
              <CalendarCheck className="w-3.5 h-3.5 text-teal-600" />
              <span>Check-In</span>
            </button>

            {/* Ask Vita AI button */}
            <button
              onClick={onOpenVitaAssistant}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-teal-900 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-lg transition-all shadow-2xs hover:shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              <span>Ask Vita</span>
            </button>

            {/* + Add Reading button */}
            <button
              onClick={onOpenCapture}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-all shadow-xs hover:shadow-sm"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Add Reading</span>
            </button>

            {/* Emergency Notice trigger */}
            <button
              onClick={onOpenEmergency}
              title="Safety & Emergency Notice"
              className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
              aria-label="Safety Notice"
            >
              <ShieldAlert className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
