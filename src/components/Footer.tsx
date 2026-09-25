import React from 'react';
import { Phone, MapPin, Clock, ShieldCheck, ArrowUp } from 'lucide-react';
import { BUSINESS_INFO } from '../data/travelData';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Vehicles', href: '#vehicles' },
    { label: 'Services', href: '#services' },
    { label: 'Gallery', href: '#gallery' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <footer className="bg-[#060D18] text-slate-400 text-sm border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-800/80">
          {/* Brand Info */}
          <div className="lg:col-span-5 space-y-4">
            <div className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <span className="text-amber-400">USHA</span>
              <span className="text-slate-100">TRAVELS</span>
            </div>
            <p className="text-amber-400/90 font-medium text-sm">
              {BUSINESS_INFO.tagline}
            </p>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-sm">
              Providing safe, comfortable, and dependable passenger travel services 24/7 across Andhra Pradesh, Telangana, and inter-state highway destinations.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400 pt-2">
              <ShieldCheck className="w-4 h-4 text-amber-500" />
              <span>Certified Professional Commercial Drivers</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="hover:text-amber-400 transition-colors inline-block"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Contact Information
            </h4>
            <div className="space-y-3 text-xs sm:text-sm">
              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-400 block text-xs">Direct Line</span>
                  <a
                    href={`tel:${BUSINESS_INFO.phone}`}
                    className="text-white hover:text-amber-400 font-semibold transition-colors"
                  >
                    {BUSINESS_INFO.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-400 block text-xs">Location</span>
                  <span className="text-white font-medium">{BUSINESS_INFO.location}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-400 block text-xs">Service Availability</span>
                  <span className="text-amber-400 font-semibold">{BUSINESS_INFO.service}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            © 2026 Usha Travels. All Rights Reserved.
          </div>

          <div className="flex items-center gap-6">
            <span>Location: Sankaraguptam</span>
            <button
              type="button"
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors"
              aria-label="Back to top"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
