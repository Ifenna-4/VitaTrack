import React, { useState } from 'react';
import { 
  MapPin, 
  UtensilsCrossed, 
  ShoppingCart, 
  Store, 
  RefreshCw, 
  Sparkles, 
  Info, 
  Heart, 
  Droplets, 
  ShieldCheck,
  Check
} from 'lucide-react';
import { UserProfile, Condition } from '../types';
import { LOCATION_FOOD_DATA, FoodOption } from '../data/demoData';

interface FoodPersonalizationViewProps {
  userProfile: UserProfile;
  onUpdateLocation: (newLocation: string) => void;
}

export const FoodPersonalizationView: React.FC<FoodPersonalizationViewProps> = ({
  userProfile,
  onUpdateLocation,
}) => {
  const [currentCity, setCurrentCity] = useState(userProfile.location || 'Austin, TX');
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Grocery' | 'Restaurant' | 'Local Staples' | 'Healthier Swaps'>('All');

  // Fetch foods matching current city or fallback to Universal
  const foodItems: FoodOption[] = LOCATION_FOOD_DATA[currentCity] || LOCATION_FOOD_DATA['Austin, TX'] || LOCATION_FOOD_DATA['General / Universal'];

  const filteredItems = foodItems.filter((item) => {
    if (selectedCategory === 'All') return true;
    return item.category === selectedCategory;
  });

  const handleCityChange = (city: string) => {
    setCurrentCity(city);
    onUpdateLocation(city);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800">
              <UtensilsCrossed className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest">
              Nutrition Geography
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight mt-1">
            Food Around You
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Practical, neighborhood-grounded food choices personalized for your chronic condition.
          </p>
        </div>

        {/* Location Selector Pill */}
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-2xs">
          <MapPin className="w-4 h-4 text-teal-600" />
          <select
            value={currentCity}
            onChange={(e) => handleCityChange(e.target.value)}
            className="text-xs sm:text-sm font-bold text-slate-800 bg-transparent border-none focus:outline-hidden cursor-pointer"
          >
            <option value="Austin, TX">Austin, TX</option>
            <option value="New York, NY">New York, NY</option>
            <option value="General / Universal">Other / General Regional</option>
          </select>
        </div>
      </div>

      {/* Tone & Framing Educational Philosophy Callout */}
      <div className="bg-emerald-50/80 border border-emerald-200/90 rounded-2xl p-5 text-emerald-950 flex items-start gap-3">
        <Info className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm leading-relaxed">
          <p className="font-bold text-emerald-950">Educational Suggestions, Not Rigid Prescriptions</p>
          <p className="text-emerald-900 mt-0.5">
            Instead of saying "Do not eat rice", VitaTrack provides sustainable guidance: <br />
            <em className="text-emerald-800">"If rice or bread is a regular part of your meals, consider pairing a smaller portion with vegetables and a lean protein source to buffer blood glucose."</em>
          </p>
        </div>
      </div>

      {/* Categories Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {['All', 'Grocery', 'Restaurant', 'Local Staples', 'Healthier Swaps'].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              selectedCategory === cat
                ? 'bg-teal-700 text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {cat === 'All' ? 'All Foods' : cat}
          </button>
        ))}
      </div>

      {/* Food Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredItems.map((item, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between hover:border-teal-300 transition-colors"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md uppercase tracking-wider">
                  {item.category}
                </span>
                {item.highlightBadge && (
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-teal-50 text-teal-800 border border-teal-200/60 rounded-md">
                    {item.highlightBadge}
                  </span>
                )}
              </div>

              <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                {item.description}
              </p>

              {/* Condition Specific Guidance Tips */}
              <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs">
                {userProfile.conditions.includes('hypertension') && item.conditionTips.hypertension && (
                  <div className="bg-rose-50/70 border border-rose-100 rounded-xl p-3 text-rose-950 flex items-start gap-2">
                    <Heart className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-[11px] font-bold uppercase tracking-wider text-rose-900">
                        Hypertension Note:
                      </strong>
                      <span className="text-xs text-rose-900 leading-relaxed">
                        {item.conditionTips.hypertension}
                      </span>
                    </div>
                  </div>
                )}

                {userProfile.conditions.includes('diabetes') && item.conditionTips.diabetes && (
                  <div className="bg-teal-50/70 border border-teal-100 rounded-xl p-3 text-teal-950 flex items-start gap-2">
                    <Droplets className="w-3.5 h-3.5 text-teal-700 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-[11px] font-bold uppercase tracking-wider text-teal-900">
                        Diabetes Note:
                      </strong>
                      <span className="text-xs text-teal-900 leading-relaxed">
                        {item.conditionTips.diabetes}
                      </span>
                    </div>
                  </div>
                )}

                {userProfile.conditions.includes('hypotension') && item.conditionTips.hypotension && (
                  <div className="bg-amber-50/70 border border-amber-100 rounded-xl p-3 text-amber-950 flex items-start gap-2">
                    <Heart className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-[11px] font-bold uppercase tracking-wider text-amber-900">
                        Hypotension Note:
                      </strong>
                      <span className="text-xs text-amber-900 leading-relaxed">
                        {item.conditionTips.hypotension}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 pt-2 text-[11px] text-slate-400 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Grounded in practical grocery & restaurant scenarios near {currentCity}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
