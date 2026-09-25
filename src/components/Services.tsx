import React from 'react';
import {
  MapPin,
  Compass,
  Plane,
  Users,
  Calendar,
  Clock,
  Car,
  ShieldCheck,
  CheckCircle2,
  ArrowUpRight,
  KeyRound
} from 'lucide-react';
import { SERVICES_DATA, BUSINESS_INFO } from '../data/travelData';
import { ServiceItem } from '../types/travel';
import { useTravelData } from '../context/DataContext';

interface ServicesProps {
  onSelectServiceForEnquiry: (serviceTitle: string) => void;
}

const iconMap = {
  MapPin,
  Compass,
  Plane,
  Users,
  Calendar,
  Clock,
  Car,
  ShieldCheck,
  KeyRound,
};

export const Services: React.FC<ServicesProps> = ({ onSelectServiceForEnquiry }) => {
  const { services } = useTravelData();

  const handleServiceClick = (service: ServiceItem) => {
    onSelectServiceForEnquiry(service.title);
    const enquiryEl = document.getElementById('enquiry');
    if (enquiryEl) {
      enquiryEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="services" className="py-20 lg:py-28 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="text-xs font-semibold text-amber-700 uppercase tracking-wider mb-2">
            Comprehensive Transportation
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0A192F] tracking-tight mb-4">
            Our Travel Services
          </h2>
          <div className="w-16 h-1 bg-amber-500 mx-auto mb-6 rounded-full" />
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            From punctual airport pickups and spiritual family pilgrimages to full-scale event transportation, Usha Travels delivers 24/7 passenger transit solutions.
          </p>
        </div>

        {/* 8 Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {services.map((service, idx) => {
            const IconComponent = iconMap[service.iconName] || Car;
            return (
              <div
                key={service.id}
                className="bg-slate-50 border border-slate-200 rounded-xl p-6 hover:border-amber-400 hover:bg-white hover:shadow-md transition-all duration-200 flex flex-col justify-between group cursor-pointer"
                onClick={() => handleServiceClick(service)}
              >
                <div>
                  {/* Top Bar inside card */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-11 h-11 rounded-lg bg-[#0A192F] text-amber-400 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors shadow-sm">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-mono font-medium text-slate-400">
                      {(idx + 1).toString().padStart(2, '0')}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-[#0A192F] mb-2 group-hover:text-amber-700 transition-colors flex items-center justify-between">
                    <span>{service.title}</span>
                    <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h3>

                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4">
                    {service.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-200/80 space-y-1.5">
                  {service.features.map((feat, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-xs text-slate-700">
                      <CheckCircle2 className="w-3 h-3 text-amber-600 shrink-0" />
                      <span className="truncate">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* 24/7 Service Guarantee Banner */}
        <div className="bg-gradient-to-r from-[#0A192F] via-[#112240] to-[#0A192F] rounded-2xl p-8 text-white flex flex-col lg:flex-row items-center justify-between gap-6 border border-slate-800 shadow-md">
          <div className="space-y-2 text-center lg:text-left">
            <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
              Emergency & Scheduled Dispatch
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              Need immediate 24/7 passenger dispatch from Sankaraguptam?
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl">
              Call directly at {BUSINESS_INFO.displayPhone}. Our coordination team is on duty right now to allocate the nearest vehicle for you.
            </p>
          </div>

          <a
            href={`tel:${BUSINESS_INFO.phone}`}
            className="inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-7 py-3.5 rounded-lg shadow transition-colors text-sm whitespace-nowrap active:scale-[0.98]"
          >
            <Clock className="w-4 h-4" />
            <span>Call 24/7: {BUSINESS_INFO.phone}</span>
          </a>
        </div>
      </div>
    </section>
  );
};
