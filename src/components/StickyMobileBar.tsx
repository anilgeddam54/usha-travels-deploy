import React from 'react';
import { Phone, MessageSquare } from 'lucide-react';
import { BUSINESS_INFO } from '../data/travelData';
import { useTravelData } from '../context/DataContext';

export const StickyMobileBar: React.FC = () => {
  const { settings } = useTravelData();
  const phone = settings.phone || BUSINESS_INFO.phone;
  const whatsappNumber = settings.whatsapp || BUSINESS_INFO.whatsappNumber;

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    'Hello Usha Travels, I would like to book a travel vehicle from Sankaraguptam.'
  )}`;

  return (
    <aside
      aria-label="Quick contact bar"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0A192F]/95 backdrop-blur-md border-t border-slate-800 px-3 py-2 shadow-2xl flex items-center gap-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]"
    >
      <a
        href={`tel:${phone}`}
        className="flex-1 inline-flex items-center justify-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2.5 px-3 rounded-lg text-xs shadow transition-colors active:scale-[0.98]"
      >
        <Phone className="w-3.5 h-3.5 fill-slate-950" />
        <span>Call: {phone}</span>
      </a>

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 inline-flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2.5 px-3 rounded-lg text-xs shadow transition-colors active:scale-[0.98]"
      >
        <MessageSquare className="w-3.5 h-3.5" />
        <span>WhatsApp</span>
      </a>
    </aside>
  );
};
