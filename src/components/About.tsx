import React from 'react';
import { ShieldCheck, HeartHandshake, Clock, Check, Award, Phone } from 'lucide-react';
import { BUSINESS_INFO } from '../data/travelData';

interface AboutProps {
  onContactClick: () => void;
}

export const About: React.FC<AboutProps> = ({ onContactClick }) => {
  const highlights = [
    {
      icon: ShieldCheck,
      title: 'Safe & Reliable',
      description:
        'Safety is our foundational promise. We employ rigorously vetted, seasoned commercial drivers with clean track records. Every vehicle in our fleet undergoes pre-trip mechanical checks, regular brake and tyre audits, and adheres to all highway safety norms.',
      points: [
        'Vetted, background-checked professional drivers',
        'Routine vehicle maintenance and safety checks',
        'Transparent route guidance and honest pricing',
      ],
    },
    {
      icon: HeartHandshake,
      title: 'Comfortable Travel',
      description:
        'Your comfort transforms miles into smiles. From plush push-back reclining seats in our Force Travellers to whisper-quiet climate control in our Dzire and Ertiga vehicles, we guarantee clean, sanitized interiors and smooth suspension for long-distance relaxation.',
      points: [
        'High-capacity climate-controlled air conditioning',
        'Ergonomic cushioned pushback seating & legroom',
        'Quiet, odor-free, non-smoking sanitized cabins',
      ],
    },
    {
      icon: Clock,
      title: '24/7 Service',
      description:
        'Travel needs do not wait for business hours. We operate 24 hours a day, 7 days a week, 365 days a year. Whether you need a midnight railway pickup, dawn airport run, or round-the-clock wedding fleet dispatch, our team is always ready.',
      points: [
        'Instant phone response at 9948953702',
        'Zero late-night surcharge shocks',
        'Punctual arrival at your doorstep',
      ],
    },
  ];

  return (
    <section id="about" className="py-20 lg:py-28 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="text-xs font-semibold text-amber-700 uppercase tracking-wider mb-2">
            Who We Are
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0A192F] tracking-tight mb-6">
            About Usha Travels
          </h2>
          <div className="w-16 h-1 bg-amber-500 mx-auto mb-6 rounded-full" />
          <p className="text-lg sm:text-xl text-slate-700 leading-relaxed font-normal">
            Usha Travels provides reliable and comfortable passenger transportation services with a strong focus on safety, convenience and customer satisfaction. We are committed to making every journey smooth, comfortable and dependable.
          </p>
        </div>

        {/* Three Visual Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {highlights.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="bg-slate-50 border border-slate-200 rounded-xl p-8 hover:border-amber-400 hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  <div className="w-12 h-12 rounded-lg bg-[#0A192F] text-amber-400 flex items-center justify-center mb-6 shadow-sm group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-[#0A192F] mb-3">
                    {item.title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-6">
                    {item.description}
                  </p>
                </div>

                <div className="space-y-2 pt-4 border-t border-slate-200/80">
                  {item.points.map((pt, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                      <Check className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Company Narrative Bar */}
        <div className="bg-[#0A192F] rounded-2xl text-white p-8 lg:p-12 overflow-hidden relative shadow-lg">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8">
              <span className="text-amber-400 text-xs font-semibold tracking-wider uppercase">
                Rooted in Sankaraguptam
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold mt-2 mb-4 text-white">
                Connecting Andhra Pradesh with Dedication and Trust
              </h3>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
                Headquartered in Sankaraguptam (Konaseema / Godavari region), Usha Travels has served countless families, pilgrims, corporate professionals, and wedding parties. We take personal pride in every kilometer traveled under our care, ensuring safe arrivals and fond travel memories.
              </p>
              <div className="flex flex-wrap items-center gap-6 text-sm text-slate-200">
                <div>
                  <strong className="text-white block text-lg font-bold">24/7</strong>
                  <span className="text-slate-400 text-xs">Round-the-clock Service</span>
                </div>
                <div className="h-8 w-px bg-slate-700 hidden sm:block" />
                <div>
                  <strong className="text-white block text-lg font-bold">Sankaraguptam</strong>
                  <span className="text-slate-400 text-xs">Home Base & Fast Dispatch</span>
                </div>
                <div className="h-8 w-px bg-slate-700 hidden sm:block" />
                <div>
                  <strong className="text-white block text-lg font-bold">Pan-India</strong>
                  <span className="text-slate-400 text-xs">Highway Touring Permits</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end gap-3 justify-end">
              <a
                href={`tel:${BUSINESS_INFO.phone}`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-3.5 rounded-lg shadow transition-colors text-sm"
              >
                <Phone className="w-4 h-4 fill-slate-950" />
                <span>Call {BUSINESS_INFO.displayPhone}</span>
              </a>
              <button
                type="button"
                onClick={onContactClick}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-medium px-6 py-3.5 rounded-lg border border-slate-700 transition-colors text-sm"
              >
                <span>Send Booking Enquiry</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
