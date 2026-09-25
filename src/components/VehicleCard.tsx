import React, { useState } from 'react';
import { Users, Briefcase, Wind, Info, CalendarCheck, ShieldCheck, KeyRound } from 'lucide-react';
import { Vehicle } from '../types/travel';

interface VehicleCardProps {
  vehicle: Vehicle;
  onViewDetails: (vehicle: Vehicle) => void;
  onEnquireNow: (vehicle: Vehicle) => void;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({
  vehicle,
  onViewDetails,
  onEnquireNow,
}) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-amber-400 hover:shadow-lg transition-all duration-200 flex flex-col justify-between group">
      <div>
        {/* Vehicle Image Container - Studio Showcase with zero cropping */}
        <div className="relative aspect-[16/10] sm:aspect-[4/3] bg-gradient-to-b from-slate-50 via-slate-100/60 to-slate-100 flex items-center justify-center p-3 sm:p-4 overflow-hidden border-b border-slate-100">
          {!imageError ? (
            <img
              src={vehicle.image}
              alt={`${vehicle.name} - Usha Travels`}
              className="w-full h-full object-contain object-center group-hover:scale-105 transition-transform duration-500 ease-out drop-shadow-sm"
              loading="lazy"
              referrerPolicy="no-referrer"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-6 text-slate-400 bg-slate-100">
              <ShieldCheck className="w-12 h-12 text-slate-300 mb-2" />
              <span className="text-sm font-medium text-slate-600">{vehicle.name}</span>
              <span className="text-xs text-slate-400">Usha Travels Fleet</span>
            </div>
          )}

          {/* Subdued category watermark badge */}
          {vehicle.tag && (
            <div className="absolute top-3 left-3 bg-[#0A192F]/90 backdrop-blur-sm text-amber-400 text-xs font-semibold px-2.5 py-1 rounded">
              {vehicle.tag}
            </div>
          )}

          {/* Pristine White Fleet Badge */}
          {vehicle.color && (
            <div className="absolute top-3 right-3 bg-white/95 border border-slate-200 backdrop-blur-sm text-slate-850 text-xs font-semibold px-2.5 py-1 rounded shadow-sm flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-white border-2 border-amber-400 inline-block shrink-0 shadow-xs" />
              <span className="text-slate-800 font-medium">{vehicle.color}</span>
            </div>
          )}
        </div>

        {/* Content Container */}
        <div className="p-6">
          {/* Metadata: Category unboxed */}
          <div className="text-xs font-medium text-amber-700 tracking-wide uppercase mb-1">
            {vehicle.category}
          </div>

          <h3 className="text-xl font-bold text-[#0A192F] tracking-tight mb-2 group-hover:text-amber-600 transition-colors">
            {vehicle.name}
          </h3>

          <p className="text-slate-600 text-sm leading-relaxed mb-4 line-clamp-3">
            {vehicle.shortDescription}
          </p>

          {/* Drive Mode Indicator */}
          {vehicle.selfDriveAvailable ? (
            <div className="mb-4 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-semibold">
              <KeyRound className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Self-Drive & With-Driver Available</span>
            </div>
          ) : (
            <div className="mb-4 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span>With Experienced Driver</span>
            </div>
          )}

          {/* Key Quick Specifications */}
          <div className="grid grid-cols-2 gap-2 text-xs text-slate-700 py-3 border-y border-slate-100 mb-4 bg-slate-50/50 rounded-lg px-3">
            <div className="flex items-center gap-1.5 font-medium truncate">
              <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{vehicle.seatingCapacity}</span>
            </div>
            <div className="flex items-center gap-1.5 font-medium truncate">
              <Wind className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">Chilled AC</span>
            </div>
            <div className="flex items-center gap-1.5 col-span-2 text-slate-500 truncate">
              <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{vehicle.luggageCapacity}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-6 pb-6 pt-0 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => onViewDetails(vehicle)}
          className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold transition-colors whitespace-nowrap active:scale-[0.98]"
        >
          <Info className="w-3.5 h-3.5 text-slate-500" />
          <span>View Details</span>
        </button>

        <button
          type="button"
          onClick={() => onEnquireNow(vehicle)}
          className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-[#0A192F] hover:bg-amber-500 hover:text-slate-950 text-white text-xs font-semibold transition-all duration-150 shadow-sm whitespace-nowrap active:scale-[0.98]"
        >
          <CalendarCheck className="w-3.5 h-3.5" />
          <span>Enquire Now</span>
        </button>
      </div>
    </div>
  );
};
