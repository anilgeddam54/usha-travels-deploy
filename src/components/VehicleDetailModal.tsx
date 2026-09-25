import React from 'react';
import { X, Users, Briefcase, Wind, CheckCircle2, Phone, MessageSquare, ShieldCheck, MapPin, KeyRound } from 'lucide-react';
import { Vehicle } from '../types/travel';
import { BUSINESS_INFO } from '../data/travelData';

interface VehicleDetailModalProps {
  vehicle: Vehicle | null;
  onClose: () => void;
  onEnquireNow: (vehicle: Vehicle) => void;
}

export const VehicleDetailModal: React.FC<VehicleDetailModalProps> = ({
  vehicle,
  onClose,
  onEnquireNow,
}) => {
  if (!vehicle) return null;

  const whatsappMessage = encodeURIComponent(
    `Hello Usha Travels, I would like to enquire about booking the ${vehicle.name} (${vehicle.seatingCapacity}) from Sankaraguptam.`
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div>
            <div className="text-xs font-semibold text-amber-700 uppercase tracking-wider">
              {vehicle.category}
            </div>
            <h3 className="text-xl font-bold text-[#0A192F]">{vehicle.name}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
            aria-label="Close vehicle modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-6 space-y-6">
          {/* Vehicle Image - Studio Showcase with zero cropping */}
          <div className="relative aspect-[16/10] sm:aspect-[16/9] rounded-xl overflow-hidden bg-gradient-to-b from-slate-50 via-slate-100/70 to-slate-100 border border-slate-200 shadow-inner flex items-center justify-center p-3 sm:p-4">
            <img
              src={vehicle.image}
              alt={vehicle.name}
              className="w-full h-full object-contain object-center drop-shadow-sm"
              referrerPolicy="no-referrer"
            />
            {/* Fleet Color Badge */}
            {vehicle.color && (
              <div className="absolute top-3 left-3 bg-white/95 border border-slate-200 backdrop-blur-sm text-slate-800 text-xs font-semibold px-2.5 py-1 rounded shadow-sm flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-white border-2 border-amber-400 inline-block shrink-0 shadow-xs" />
                <span>{vehicle.color}</span>
              </div>
            )}
            <div className="absolute bottom-3 right-3 bg-[#0A192F]/90 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded font-medium flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Sanitized & Inspected</span>
            </div>
          </div>

          {/* Key Specifications Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
                <Users className="w-4 h-4 text-amber-600" />
                <span>Capacity</span>
              </div>
              <div className="text-sm font-bold text-slate-900">{vehicle.seatingCapacity}</div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
                <Wind className="w-4 h-4 text-amber-600" />
                <span>Climate Control</span>
              </div>
              <div className="text-sm font-bold text-slate-900 truncate">{vehicle.acType}</div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
                <Briefcase className="w-4 h-4 text-amber-600" />
                <span>Luggage</span>
              </div>
              <div className="text-sm font-bold text-slate-900">{vehicle.luggageCapacity}</div>
            </div>
          </div>

          {/* Drive Mode & Self-Drive Info */}
          {vehicle.selfDriveAvailable ? (
            <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-4 flex items-start gap-3">
              <div className="p-2 bg-emerald-600 text-white rounded-lg shrink-0 mt-0.5 shadow-xs">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h5 className="text-sm font-bold text-emerald-950">
                    Self-Drive Service Available
                  </h5>
                  <span className="text-[10px] uppercase tracking-wider font-semibold bg-emerald-200/70 text-emerald-900 px-2 py-0.5 rounded">
                    Popular
                  </span>
                </div>
                <p className="text-xs text-emerald-900/80 leading-relaxed mb-2">
                  Drive this pristine white {vehicle.name} independently with complete freedom. Also available with our professional chauffeur if preferred.
                </p>
                <div className="flex flex-wrap gap-2 text-[11px] text-emerald-850 font-medium">
                  <span className="bg-emerald-100/70 px-2 py-0.5 rounded">✓ Valid Driving License Required</span>
                  <span className="bg-emerald-100/70 px-2 py-0.5 rounded">✓ Government ID Verification</span>
                  <span className="bg-emerald-100/70 px-2 py-0.5 rounded">✓ Flexible Daily / Weekly Rates</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-start gap-3">
              <div className="p-2 bg-[#0A192F] text-amber-400 rounded-lg shrink-0 mt-0.5">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h5 className="text-sm font-bold text-slate-900 mb-1">
                  Chauffeur-Driven Group Transit
                </h5>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Operated exclusively with our experienced, verified commercial highway drivers to ensure maximum safety, navigation ease, and comfort for large groups.
                </p>
              </div>
            </div>
          )}

          {/* Description */}
          <div>
            <h4 className="text-sm font-bold text-[#0A192F] uppercase tracking-wider mb-2">
              Vehicle Overview
            </h4>
            <p className="text-slate-600 text-sm leading-relaxed">
              {vehicle.fullDescription}
            </p>
          </div>

          {/* Features List */}
          <div>
            <h4 className="text-sm font-bold text-[#0A192F] uppercase tracking-wider mb-3">
              Comfort & Safety Features
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {vehicle.features.map((feat, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-md border border-slate-100">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Ideal For */}
          <div>
            <h4 className="text-sm font-bold text-[#0A192F] uppercase tracking-wider mb-3">
              Ideal Usage
            </h4>
            <div className="flex flex-wrap gap-2">
              {vehicle.idealFor.map((item, i) => (
                <span
                  key={i}
                  className="text-xs bg-slate-100 text-slate-800 px-3 py-1.5 rounded font-medium border border-slate-200 flex items-center gap-1.5"
                >
                  <MapPin className="w-3 h-3 text-amber-600" />
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            Base location: <strong className="text-slate-800">{BUSINESS_INFO.location}</strong> · 24/7 Dispatch
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`https://wa.me/${BUSINESS_INFO.whatsappNumber}?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp</span>
            </a>

            <button
              type="button"
              onClick={() => {
                onClose();
                onEnquireNow(vehicle);
              }}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-lg bg-[#0A192F] hover:bg-amber-500 hover:text-slate-950 text-white text-xs font-semibold shadow-sm transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span>Book / Enquire</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
