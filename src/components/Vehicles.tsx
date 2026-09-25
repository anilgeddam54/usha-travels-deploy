import React, { useState } from 'react';
import { Vehicle } from '../types/travel';
import { VehicleCard } from './VehicleCard';
import { VehicleDetailModal } from './VehicleDetailModal';
import { Phone, Shield, Sparkles } from 'lucide-react';
import { BUSINESS_INFO } from '../data/travelData';
import { useTravelData } from '../context/DataContext';

interface VehiclesProps {
  onSelectVehicleForEnquiry: (vehicleName: string) => void;
}

export const Vehicles: React.FC<VehiclesProps> = ({ onSelectVehicleForEnquiry }) => {
  const { vehicles } = useTravelData();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeModalVehicle, setActiveModalVehicle] = useState<Vehicle | null>(null);

  const categories = ['All', 'Minibus / Traveller', 'Sedan', 'MUV / MPV'];

  const filteredVehicles = selectedCategory === 'All'
    ? vehicles
    : vehicles.filter((v) => v.category === selectedCategory);

  const handleEnquireNow = (vehicle: Vehicle) => {
    onSelectVehicleForEnquiry(vehicle.name);
    const enquiryEl = document.getElementById('enquiry');
    if (enquiryEl) {
      enquiryEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="vehicles" className="py-20 lg:py-28 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="text-xs font-semibold text-amber-700 uppercase tracking-wider mb-2">
            Our Premium Fleet
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0A192F] tracking-tight mb-4">
            Our Vehicles
          </h2>
          <div className="w-16 h-1 bg-amber-500 mx-auto mb-6 rounded-full" />
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            Choose from our impeccably maintained fleet. Whether traveling solo, with family, or in large tour groups, we provide safe, comfortable, and air-conditioned travel.
          </p>
        </div>

        {/* Category Filter Controls */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-150 whitespace-nowrap active:scale-[0.98] ${
                selectedCategory === cat
                  ? 'bg-[#0A192F] text-amber-400 shadow-sm border border-[#0A192F]'
                  : 'bg-white text-slate-700 hover:text-[#0A192F] hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat === 'All' ? 'All Vehicles' : cat}
            </button>
          ))}
        </div>

        {/* Reusable Vehicle Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {filteredVehicles.map((vehicle) => (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              onViewDetails={(v) => setActiveModalVehicle(v)}
              onEnquireNow={handleEnquireNow}
            />
          ))}
        </div>

        {/* Fleet Guarantee Banner */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center shrink-0">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-[#0A192F]">
                Need a Special Fleet Configuration or Multi-Day Booking?
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                We organize customized multi-car convoys for marriages, pilgrimages, and long-term rentals from Sankaraguptam.
              </p>
            </div>
          </div>

          <a
            href={`tel:${BUSINESS_INFO.phone}`}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#0A192F] hover:bg-slate-800 text-amber-400 hover:text-amber-300 font-semibold px-6 py-3 rounded-lg text-xs sm:text-sm transition-colors shrink-0"
          >
            <Phone className="w-4 h-4" />
            <span>Call Fleet Desk: {BUSINESS_INFO.phone}</span>
          </a>
        </div>
      </div>

      {/* Interactive Vehicle Detail Modal */}
      <VehicleDetailModal
        vehicle={activeModalVehicle}
        onClose={() => setActiveModalVehicle(null)}
        onEnquireNow={handleEnquireNow}
      />
    </section>
  );
};
