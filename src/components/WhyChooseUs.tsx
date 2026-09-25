import React from 'react';
import {
  ShieldCheck,
  Sparkles,
  CheckCircle,
  Clock,
  PhoneCall,
  HeartHandshake
} from 'lucide-react';
import { WHY_CHOOSE_US_DATA } from '../data/travelData';

const iconLookup: Record<string, React.ElementType> = {
  'passenger-safety': ShieldCheck,
  'clean-comfortable': Sparkles,
  'reliable-service': CheckCircle,
  '24-7-availability': Clock,
  'easy-booking-enquiry': PhoneCall,
  'customer-focused-service': HeartHandshake,
};

export const WhyChooseUs: React.FC = () => {
  return (
    <section className="py-20 lg:py-28 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="text-xs font-semibold text-amber-700 uppercase tracking-wider mb-2">
            The Usha Travels Standard
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0A192F] tracking-tight mb-4">
            Why Choose Us
          </h2>
          <div className="w-16 h-1 bg-amber-500 mx-auto mb-6 rounded-full" />
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            Every passenger journey is a bond of trust. Here is why travelers across Sankaraguptam and Andhra Pradesh depend on Usha Travels.
          </p>
        </div>

        {/* 6 Key Reasons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {WHY_CHOOSE_US_DATA.map((item) => {
            const Icon = iconLookup[item.id] || ShieldCheck;
            return (
              <div
                key={item.id}
                className="bg-white border border-slate-200 rounded-xl p-8 hover:border-amber-400 hover:shadow-md transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-lg bg-[#0A192F] text-amber-400 flex items-center justify-center mb-6 shadow-sm">
                    <Icon className="w-6 h-6" />
                  </div>

                  <div className="text-xs font-semibold text-amber-700 uppercase tracking-wider mb-1">
                    {item.stat}
                  </div>

                  <h3 className="text-lg font-bold text-[#0A192F] mb-3">
                    {item.title}
                  </h3>

                  <p className="text-slate-600 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
