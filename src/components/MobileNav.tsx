import React from 'react';
import { LayoutDashboard, Camera, TrendingUp, History, User, UtensilsCrossed, CalendarCheck } from 'lucide-react';
import { TabType } from './Navbar';

interface MobileNavProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  onOpenCapture: () => void;
  onOpenCheckIn: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  currentTab,
  onSelectTab,
  onOpenCapture,
  onOpenCheckIn,
}) => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-2 py-1.5 shadow-lg safe-area-pb">
      <div className="flex items-center justify-around">
        {/* Home / Dashboard */}
        <button
          onClick={() => onSelectTab('dashboard')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-lg text-[10px] font-medium transition-colors ${
            currentTab === 'dashboard' ? 'text-teal-700 font-semibold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <LayoutDashboard className="w-5 h-5 mb-0.5" />
          <span>Home</span>
        </button>

        {/* History */}
        <button
          onClick={() => onSelectTab('history')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-lg text-[10px] font-medium transition-colors ${
            currentTab === 'history' ? 'text-teal-700 font-semibold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <History className="w-5 h-5 mb-0.5" />
          <span>History</span>
        </button>

        {/* Center Primary Capture Button */}
        <button
          onClick={onOpenCapture}
          className="flex flex-col items-center justify-center -mt-4 bg-teal-600 hover:bg-teal-700 text-white rounded-full w-12 h-12 shadow-md shadow-teal-600/30 transition-transform active:scale-95"
          aria-label="Capture Reading"
        >
          <Camera className="w-5 h-5 stroke-[2.2]" />
        </button>

        {/* Insights */}
        <button
          onClick={() => onSelectTab('insights')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-lg text-[10px] font-medium transition-colors ${
            currentTab === 'insights' ? 'text-teal-700 font-semibold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <TrendingUp className="w-5 h-5 mb-0.5" />
          <span>Insights</span>
        </button>

        {/* Profile */}
        <button
          onClick={() => onSelectTab('profile')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-lg text-[10px] font-medium transition-colors ${
            currentTab === 'profile' ? 'text-teal-700 font-semibold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <User className="w-5 h-5 mb-0.5" />
          <span>Profile</span>
        </button>
      </div>
    </nav>
  );
};
