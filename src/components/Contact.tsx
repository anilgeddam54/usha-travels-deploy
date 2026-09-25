import React from 'react';
import { Phone, MessageSquare, MapPin, Clock, Navigation, ExternalLink, ShieldCheck } from 'lucide-react';
import { BUSINESS_INFO } from '../data/travelData';
import { EnquiryForm } from './EnquiryForm';
import { useTravelData } from '../context/DataContext';

interface ContactProps {
  selectedVehicleForEnquiry?: string;
}

export const Contact: React.FC<ContactProps> = ({ selectedVehicleForEnquiry }) => {
  const { settings } = useTravelData();
  const phone = settings.phone || BUSINESS_INFO.phone;
  const whatsappNumber = settings.whatsapp || BUSINESS_INFO.whatsappNumber;
  const companyName = settings.company_name || BUSINESS_INFO.companyName;
  const location = settings.location || BUSINESS_INFO.location;

  // Direct WhatsApp click URL
  const defaultWhatsAppUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    'Hello Usha Travels, I would like to inquire about booking a vehicle from Sankaraguptam.'
  )}`;

  // Google Maps search query placeholder link for Sankaraguptam
  const googleMapsDirectionsUrl = 'https://www.google.com/maps/search/?api=1&query=Sankaraguptam+Andhra+Pradesh';

  return (
    <section id="contact" className="py-20 lg:py-28 bg-slate-100 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="text-xs font-semibold text-amber-700 uppercase tracking-wider mb-2">
            Get In Touch
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0A192F] tracking-tight mb-4">
            Contact Usha Travels
          </h2>
          <div className="w-16 h-1 bg-amber-500 mx-auto mb-6 rounded-full" />
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            Our dispatch desk in Sankaraguptam is active 24 hours a day. Call, chat on WhatsApp, or send an enquiry to confirm your journey.
          </p>
        </div>

        {/* 2-Column Grid: Contact Information & Direct Action Card + Enquiry Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Business Details & Action Buttons */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#0A192F] rounded-2xl text-white p-8 shadow-xl border border-slate-800">
              <div className="text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
                Official Travel Partner
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
                {companyName}
              </h3>
              <p className="text-slate-300 text-sm italic mb-6">
                "{BUSINESS_INFO.tagline}"
              </p>

              {/* Business Key Highlights */}
              <div className="space-y-4 pt-2 border-t border-slate-800">
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 uppercase tracking-wider">Direct Hotline</div>
                    <a
                      href={`tel:${phone}`}
                      className="text-lg font-bold text-white hover:text-amber-400 transition-colors"
                    >
                      {phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 uppercase tracking-wider">Service Availability</div>
                    <div className="text-base font-bold text-amber-400">{settings.business_hours || BUSINESS_INFO.service}</div>
                    <div className="text-xs text-slate-400">Available day and night, 365 days</div>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 uppercase tracking-wider">Location / Head Office</div>
                    <div className="text-base font-bold text-white">{location}</div>
                    <div className="text-xs text-slate-400">Konaseema / East Godavari District, AP</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons as requested: Call Now, WhatsApp, Get Directions */}
              <div className="mt-8 pt-6 border-t border-slate-800 space-y-3">
                <a
                  href={`tel:${BUSINESS_INFO.phone}`}
                  className="w-full inline-flex items-center justify-center gap-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3.5 px-5 rounded-lg shadow transition-colors text-sm active:scale-[0.98]"
                >
                  <Phone className="w-4 h-4 fill-slate-950" />
                  <span>Call Now: {BUSINESS_INFO.phone}</span>
                </a>

                <a
                  href={defaultWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3.5 px-5 rounded-lg shadow transition-colors text-sm active:scale-[0.98]"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Chat on WhatsApp</span>
                </a>

                <a
                  href={googleMapsDirectionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-medium py-3 px-5 rounded-lg border border-slate-700 transition-colors text-xs active:scale-[0.98]"
                >
                  <Navigation className="w-4 h-4 text-amber-400" />
                  <span>Get Directions (Google Maps)</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </div>
            </div>

            {/* Trust Assurance Strip */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 flex items-center gap-3.5 shadow-sm text-xs text-slate-700">
              <ShieldCheck className="w-6 h-6 text-amber-600 shrink-0" />
              <div>
                <strong className="block text-slate-900 font-semibold">Immediate Driver Dispatch</strong>
                Quick response times for all Sankaraguptam and nearby Godavari pick-ups.
              </div>
            </div>
          </div>

          {/* Right Column: Enquiry Form */}
          <div className="lg:col-span-7">
            <EnquiryForm initialVehiclePreference={selectedVehicleForEnquiry} />
          </div>
        </div>
      </div>
    </section>
  );
};
