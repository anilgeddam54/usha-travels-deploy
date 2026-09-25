import React from 'react';
import { Phone, ArrowRight, Shield, Clock, MapPin, CheckCircle2 } from 'lucide-react';
import { BUSINESS_INFO, heroHighwayImg } from '../data/travelData';
import { useTravelData } from '../context/DataContext';

interface HeroProps {
  onExploreVehicles: () => void;
  onQuickBook?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreVehicles, onQuickBook }) => {
  const { settings } = useTravelData();
  const phone = settings.phone || BUSINESS_INFO.phone;
  const location = settings.location || 'Sankaraguptam, Andhra Pradesh';
  const heroHeading = settings.hero_heading || 'Your Journey, Our Responsibility';
  const heroDescription = settings.hero_description || 'Safe, Comfortable and Reliable Travel Services — Available 24/7.';
  return (
    <section id="home" className="relative min-h-[90vh] flex items-center justify-center bg-[#07111E] overflow-hidden">
      {/* Background Image with Dark Navy Gradient Scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroHighwayImg}
          alt="Usha Travels Highway Passenger Travel"
          className="w-full h-full object-cover object-center transform scale-105 transition-transform duration-1000 ease-out"
          referrerPolicy="no-referrer"
        />
        {/* Multilayered rich scrim for maximum WCAG AA readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#07111E]/95 via-[#0A192F]/85 to-[#0A192F]/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#07111E] via-transparent to-[#07111E]/40" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 w-full">
        <div className="max-w-3xl">
          {/* Subtle location & trust kicker (unboxed, clean typography) */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm font-medium text-amber-400 mb-4 tracking-wide uppercase">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
              {location}
            </span>
            <span className="text-slate-500" aria-hidden="true">·</span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-400 shrink-0" />
              24/7 Available
            </span>
            <span className="text-slate-500" aria-hidden="true">·</span>
            <span>{BUSINESS_INFO.tagline}</span>
          </div>

          {/* Primary Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.12] mb-6 [text-wrap:balance]">
            {heroHeading.includes(',') ? (
              <>
                {heroHeading.split(',')[0]}, <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500">
                  {heroHeading.split(',').slice(1).join(',')}
                </span>
              </>
            ) : (
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500">
                {heroHeading}
              </span>
            )}
          </h1>

          {/* Subheading */}
          <p className="text-lg sm:text-xl text-slate-200 font-normal leading-relaxed mb-8 max-w-2xl">
            {heroDescription}
          </p>

          {/* Trust Highlights Checklist */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 pb-8 text-sm text-slate-200">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Clean Sanitized Fleet</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Experienced Drivers</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Punctual On-Time Service</span>
            </div>
          </div>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <a
              href={`tel:${phone}`}
              className="inline-flex items-center justify-center gap-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-7 py-4 rounded-lg shadow-lg hover:shadow-amber-500/25 transition-all duration-200 text-base whitespace-nowrap active:scale-[0.98]"
            >
              <Phone className="w-5 h-5 fill-slate-950" />
              <span>Call Now: {phone}</span>
            </a>

            <button
              type="button"
              onClick={onExploreVehicles}
              className="inline-flex items-center justify-center gap-2.5 bg-slate-900/80 hover:bg-slate-800 text-white font-semibold px-6 py-4 rounded-lg border border-slate-700/80 hover:border-amber-400/50 backdrop-blur-sm transition-all duration-200 text-base whitespace-nowrap active:scale-[0.98]"
            >
              <span>Explore Our Vehicles</span>
              <ArrowRight className="w-4 h-4 text-amber-400" />
            </button>
          </div>
        </div>

        {/* Floating Quick Feature Card at bottom */}
        <div className="mt-14 pt-8 border-t border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-6 text-slate-300">
          <div>
            <div className="text-2xl font-bold text-white tracking-tight">24/7</div>
            <div className="text-xs text-slate-400 uppercase tracking-wider mt-1">Passenger Support</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white tracking-tight">100%</div>
            <div className="text-xs text-slate-400 uppercase tracking-wider mt-1">Safety Commitment</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white tracking-tight">3+ Categories</div>
            <div className="text-xs text-slate-400 uppercase tracking-wider mt-1">Dzire · Ertiga · Traveller</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white tracking-tight">Pan-Andhra</div>
            <div className="text-xs text-slate-400 uppercase tracking-wider mt-1">Local & Outstation Routes</div>
          </div>
        </div>
      </div>
    </section>
  );
};
