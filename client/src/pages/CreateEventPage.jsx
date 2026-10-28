import React, { useState } from 'react';
import { useEvents } from '../context/EventContext';
import {
  Sparkles,
  Heart,
  Cake,
  Users2,
  Calendar,
  MapPin,
  DollarSign,
  Users,
  Palette,
  Utensils,
  Globe,
  Building,
  ArrowRight
} from 'lucide-react';
import TiltCard from '../components/TiltCard';

export default function CreateEventPage({ setActivePage }) {
  const { createEvent, aiGenerating } = useEvents();

  const [eventType, setEventType] = useState('Wedding');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [location, setLocation] = useState('');
  const [guestCount, setGuestCount] = useState(150);
  const [totalBudget, setTotalBudget] = useState(1000000);
  const [theme, setTheme] = useState('');
  const [foodPreference, setFoodPreference] = useState('');
  const [culturalPreference, setCulturalPreference] = useState('');
  const [venuePreference, setVenuePreference] = useState('Outdoor Courtyard & Lawns');
  const [specialRequirements, setSpecialRequirements] = useState('');
  const [error, setError] = useState('');

  // Quick budget chips in INR
  const budgetChips = [
    { label: '₹2 Lakhs', value: 200000 },
    { label: '₹5 Lakhs', value: 500000 },
    { label: '₹12 Lakhs', value: 1200000 },
    { label: '₹25 Lakhs', value: 2500000 },
    { label: '₹50 Lakhs', value: 5000000 }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !eventDate || !location) {
      setError('Please provide event name, event date, and location.');
      return;
    }
    setError('');

    try {
      await createEvent({
        eventType,
        name,
        description,
        eventDate,
        location,
        guestCount: Number(guestCount),
        totalBudget: Number(totalBudget),
        theme,
        foodPreference,
        culturalPreference,
        venuePreference,
        specialRequirements
      });
      setActivePage('plan');
    } catch (err) {
      setError(err.message || 'Failed to initialize event');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Page Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
          AI Event Architect
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
          Create & Orchestrate New Celebration
        </h1>
        <p className="text-xs text-slate-600 dark:text-slate-400 max-w-lg mx-auto">
          Share your vision. Our Gemini 3.8 AI engine will instantly compute optimal budget distribution, preparation milestones, vendor checklists, and contingency plans.
        </p>
      </div>

      <TiltCard className="p-6 sm:p-10 bg-white dark:bg-slate-900 border border-purple-500/20 shadow-2xl backdrop-blur-xl">
        {error && (
          <div role="alert" className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Step 1: Event Type Selector */}
          <fieldset>
            <legend className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-3">
              1. Select Event Type
            </legend>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { type: 'Wedding', label: 'Wedding Ceremony', icon: Heart, desc: 'Multi-day rituals, mandap decor, room blocks & royal catering.' },
                { type: 'Birthday', label: 'Birthday Celebration', icon: Cake, desc: 'Age-themed party, custom cake, gaming tournaments & return gifts.' },
                { type: 'Community', label: 'Community & Cultural', icon: Users2, desc: 'Festivals, charity galas, public permits & volunteer coordination.' }
              ].map((item) => {
                const Icon = item.icon;
                const isSelected = eventType === item.type;
                return (
                  <button
                    key={item.type}
                    type="button"
                    onClick={() => setEventType(item.type)}
                    aria-pressed={isSelected}
                    className={`p-4 rounded-2xl border text-left focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:outline-none transition-all ${
                      isSelected
                        ? 'border-purple-600 bg-purple-500/10 dark:bg-purple-950/40 shadow-md ring-2 ring-purple-500/20'
                        : 'border-slate-200 dark:border-slate-800 hover:border-purple-400 bg-slate-50/50 dark:bg-slate-800/40'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
                      isSelected ? 'bg-purple-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}>
                      <Icon className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <div className="font-bold text-sm text-slate-900 dark:text-white">{item.label}</div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">{item.desc}</p>
                  </button>
                );
              })}
            </div>
          </fieldset>

          {/* Step 2: Basic Details */}
          <div className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              2. Basic Event Coordinates
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="event-name-input" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Event Name *
                </label>
                <input
                  id="event-name-input"
                  type="text"
                  required
                  aria-required="true"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={eventType === 'Wedding' ? 'e.g. Diya & Kabir’s Destination Wedding' : (eventType === 'Birthday' ? 'e.g. Maya’s 25th Sunset Soiree' : 'e.g. Annual Tech Community Conclave')}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-purple-500 outline-none text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label htmlFor="event-date-input" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Target Event Date *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-slate-600 dark:text-slate-400" aria-hidden="true" />
                  <input
                    id="event-date-input"
                    type="date"
                    required
                    aria-required="true"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-purple-500 outline-none text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="event-location-input" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  City / Location *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-slate-600 dark:text-slate-400" aria-hidden="true" />
                  <input
                    id="event-location-input"
                    type="text"
                    required
                    aria-required="true"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Udaipur, Rajasthan or Bengaluru"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-purple-500 outline-none text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="event-guest-input" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Expected Number of Guests *
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-2.5 w-4 h-4 text-slate-600 dark:text-slate-400" aria-hidden="true" />
                  <input
                    id="event-guest-input"
                    type="number"
                    min="5"
                    max="5000"
                    required
                    aria-required="true"
                    value={guestCount}
                    onChange={(e) => setGuestCount(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-purple-500 outline-none text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Step 3: Budget in INR */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label htmlFor="event-budget-input" className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                3. Total Budget in Indian Rupees (INR ₹)
              </label>
              <span className="text-sm font-extrabold text-purple-600 dark:text-purple-400">
                ₹{Number(totalBudget).toLocaleString('en-IN')}
              </span>
            </div>

            <div className="relative">
              <DollarSign className="absolute left-3 top-2.5 w-4 h-4 text-slate-600 dark:text-slate-400" aria-hidden="true" />
              <input
                id="event-budget-input"
                type="number"
                min="10000"
                step="5000"
                required
                aria-required="true"
                value={totalBudget}
                onChange={(e) => setTotalBudget(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-purple-500 outline-none text-slate-900 dark:text-white font-bold"
              />
            </div>

            {/* Quick chips */}
            <div className="flex flex-wrap gap-2 pt-1" role="group" aria-label="Quick budget presets">
              {budgetChips.map(chip => (
                <button
                  key={chip.value}
                  type="button"
                  onClick={() => setTotalBudget(chip.value)}
                  aria-label={`Set budget to ${chip.label}`}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold border focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:outline-none transition-all ${
                    Number(totalBudget) === chip.value
                      ? 'bg-purple-600 text-white border-purple-600'
                      : 'border-slate-200 dark:border-slate-800 hover:border-purple-400 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>

          {/* Step 4: Preferences & Vibe */}
          <div className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              4. Event Aesthetics & Experience
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="event-theme-input" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-purple-500" aria-hidden="true" /> Preferred Theme & Decor
                </label>
                <input
                  id="event-theme-input"
                  type="text"
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  placeholder="e.g. Royal Marigold, Boho Pastel, Neon Cyberpunk"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-purple-500 outline-none text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label htmlFor="event-food-input" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                  <Utensils className="w-3.5 h-3.5 text-purple-500" aria-hidden="true" /> Food & Catering Preferences
                </label>
                <input
                  id="event-food-input"
                  type="text"
                  value={foodPreference}
                  onChange={(e) => setFoodPreference(e.target.value)}
                  placeholder="e.g. North Indian feast, Live Chaat, Continental vegan"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-purple-500 outline-none text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="event-culture-input" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-purple-500" aria-hidden="true" /> Cultural / Regional Nuances
                </label>
                <input
                  id="event-culture-input"
                  type="text"
                  value={culturalPreference}
                  onChange={(e) => setCulturalPreference(e.target.value)}
                  placeholder="e.g. Punjabi Sangeet, South Indian Muhurtham, Western Modern"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-purple-500 outline-none text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label htmlFor="event-venue-select" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-purple-500" aria-hidden="true" /> Venue Preference
                </label>
                <select
                  id="event-venue-select"
                  value={venuePreference}
                  onChange={(e) => setVenuePreference(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-purple-500 outline-none text-slate-900 dark:text-white cursor-pointer"
                >
                  <option value="Outdoor Courtyard & Lawns">Outdoor Courtyard & Lawns</option>
                  <option value="Indoor Luxury Banquet Hall">Indoor Luxury Banquet Hall</option>
                  <option value="Rooftop Terrace Lounge">Rooftop Terrace Lounge</option>
                  <option value="Heritage Palace / Haveli">Heritage Palace / Haveli</option>
                  <option value="Beachside / Waterfront Lawn">Beachside / Waterfront Lawn</option>
                  <option value="Community Amphitheater / Park">Community Amphitheater / Park</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="event-reqs-input" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Special Requirements & Accessibility Needs
              </label>
              <textarea
                id="event-reqs-input"
                rows={2}
                value={specialRequirements}
                onChange={(e) => setSpecialRequirements(e.target.value)}
                placeholder="e.g. Wheelchair access ramps, eco-friendly zero-plastic setup, cold fireworks, pet-friendly zone"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-purple-500 outline-none text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={aiGenerating}
            aria-label="Generate Smart Event Plan with Gemini AI"
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-extrabold text-sm shadow-xl shadow-purple-500/25 focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:outline-none transition-all hover:scale-[1.01] flex items-center justify-center gap-3 disabled:opacity-60"
          >
            {aiGenerating ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin text-lg" aria-hidden="true">✨</span>
                Gemini AI is Generating Your Complete Event Plan...
              </span>
            ) : (
              <>
                <Sparkles className="w-5 h-5 animate-pulse" aria-hidden="true" />
                <span>Generate Smart Event Plan with Gemini AI</span>
                <ArrowRight className="w-5 h-5" aria-hidden="true" />
              </>
            )}
          </button>
        </form>
      </TiltCard>
    </div>
  );
}
