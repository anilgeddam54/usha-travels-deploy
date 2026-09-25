import React, { useState } from 'react';
import { X, ZoomIn, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';
import { GALLERY_ITEMS } from '../data/travelData';
import { GalleryItem } from '../types/travel';
import { useTravelData } from '../context/DataContext';

export const Gallery: React.FC = () => {
  const { gallery } = useTravelData();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeItemIndex, setActiveItemIndex] = useState<number | null>(null);

  const categories = ['All', 'Vehicles', 'Journeys', 'Godavari Region'];

  const filteredItems = selectedCategory === 'All'
    ? gallery
    : gallery.filter((item) => item.category === selectedCategory);

  const openLightbox = (index: number) => {
    setActiveItemIndex(index);
  };

  const closeLightbox = () => {
    setActiveItemIndex(null);
  };

  const showPrev = () => {
    if (activeItemIndex === null) return;
    setActiveItemIndex((prev) => (prev! > 0 ? prev! - 1 : filteredItems.length - 1));
  };

  const showNext = () => {
    if (activeItemIndex === null) return;
    setActiveItemIndex((prev) => (prev! < filteredItems.length - 1 ? prev! + 1 : 0));
  };

  return (
    <section id="gallery" className="py-20 lg:py-28 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="text-xs font-semibold text-amber-700 uppercase tracking-wider mb-2">
            Visual Experience
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0A192F] tracking-tight mb-4">
            Gallery
          </h2>
          <div className="w-16 h-1 bg-amber-500 mx-auto mb-6 rounded-full" />
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            A glimpse into our modern fleet and the scenic journeys we facilitate across Sankaraguptam, the Godavari basin, and interstate highways.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-150 whitespace-nowrap active:scale-[0.98] ${
                selectedCategory === cat
                  ? 'bg-[#0A192F] text-amber-400 border border-[#0A192F] shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:text-slate-900 hover:bg-slate-200/70 border border-slate-200'
              }`}
            >
              {cat === 'All' ? 'All Photos' : cat}
            </button>
          ))}
        </div>

        {/* Responsive Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, idx) => (
            <div
              key={item.id}
              className="group relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
              onClick={() => openLightbox(idx)}
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                referrerPolicy="no-referrer"
              />

              {/* Hover overlay with measured gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F]/90 via-[#0A192F]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-5">
                <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">
                  {item.category}
                </span>
                <h4 className="text-base font-bold text-white mb-1">{item.title}</h4>
                <p className="text-xs text-slate-200 line-clamp-2">{item.caption}</p>
                <div className="mt-3 flex items-center gap-1.5 text-xs text-amber-300 font-medium">
                  <ZoomIn className="w-3.5 h-3.5" />
                  <span>Click to expand</span>
                </div>
              </div>

              {/* Quiet category corner tag */}
              <div className="absolute top-3 left-3 bg-[#0A192F]/75 backdrop-blur-sm text-slate-200 text-xs px-2.5 py-1 rounded group-hover:opacity-0 transition-opacity">
                {item.category}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {activeItemIndex !== null && filteredItems[activeItemIndex] && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-200"
          onClick={closeLightbox}
        >
          <div
            className="relative max-w-4xl w-full bg-[#0A192F] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Close Bar */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800 text-white">
              <span className="text-xs font-medium text-amber-400 uppercase tracking-wider">
                {filteredItems[activeItemIndex].category} · Image {activeItemIndex + 1} of {filteredItems.length}
              </span>
              <button
                type="button"
                onClick={closeLightbox}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                aria-label="Close image modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Main Image View */}
            <div className="relative aspect-[16/10] bg-black flex items-center justify-center overflow-hidden">
              <img
                src={filteredItems[activeItemIndex].image}
                alt={filteredItems[activeItemIndex].title}
                className="max-h-full max-w-full object-contain"
                referrerPolicy="no-referrer"
              />

              {/* Prev / Next buttons */}
              {filteredItems.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      showPrev();
                    }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-slate-900/80 hover:bg-amber-500 hover:text-slate-950 text-white transition-colors"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      showNext();
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-slate-900/80 hover:bg-amber-500 hover:text-slate-950 text-white transition-colors"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Bottom Caption */}
            <div className="p-5 text-white bg-[#060D18]">
              <h3 className="text-lg font-bold text-white mb-1">
                {filteredItems[activeItemIndex].title}
              </h3>
              <p className="text-sm text-slate-300">
                {filteredItems[activeItemIndex].caption}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
