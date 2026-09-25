import React, { useState, useEffect } from 'react';
import { Phone, Menu, X, Clock, LayoutDashboard } from 'lucide-react';
import { BUSINESS_INFO } from '../data/travelData';
import { UserProfileMenu } from './UserProfileMenu';
import { useTravelData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  onNavigate?: (id: string) => void;
  onOpenAuth: (mode?: 'login' | 'register') => void;
  onOpenAdmin: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onNavigate, onOpenAuth, onOpenAdmin }) => {
  const { settings } = useTravelData();
  const { isAdmin } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const baseNavLinks = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Vehicles', href: '#vehicles' },
    { label: 'Services', href: '#services' },
    { label: 'Gallery', href: '#gallery' },
    { label: 'Contact', href: '#contact' },
  ];

  // Enable admin navigation/options when role === 'admin'
  const navLinks = isAdmin
    ? [...baseNavLinks, { label: 'Admin Dashboard', href: '#admin' }]
    : baseNavLinks;

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);

    if (href === '#admin') {
      onOpenAdmin();
      return;
    }

    const targetId = href.replace('#', '');
    if (onNavigate) {
      onNavigate(targetId);
    }
    const targetEl = document.getElementById(targetId);
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Top emergency trust strip */}
      <div className="bg-[#060D18] text-slate-300 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-amber-400 font-medium">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              {settings.business_hours || BUSINESS_INFO.service}
            </span>
            <span className="hidden sm:inline text-slate-500">·</span>
            <span className="hidden sm:inline text-slate-300">
              Location: <strong className="text-white font-medium">{settings.location || BUSINESS_INFO.location}</strong>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-slate-400 text-xs hidden md:inline">24 Hours Travel Helpdesk</span>
            <a
              href={`tel:${settings.phone || BUSINESS_INFO.phone}`}
              className="text-amber-400 font-bold hover:text-amber-300 flex items-center gap-1 transition-colors"
            >
              <Phone className="w-3 h-3 fill-amber-400" />
              <span>{settings.phone || BUSINESS_INFO.displayPhone}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main navigation header */}
      <header
        className={`sticky top-0 z-40 transition-all duration-200 ${
          isScrolled
            ? 'bg-[#0A192F]/95 backdrop-blur-md shadow-lg shadow-black/20 border-b border-slate-800'
            : 'bg-[#0A192F] border-b border-slate-800'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Zone 1: Brand / Logo */}
            <a
              href="#home"
              onClick={(e) => handleLinkClick(e, '#home')}
              className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2 group"
            >
              <span className="text-amber-400">USHA</span>
              <span className="text-slate-100">TRAVELS</span>
            </a>

            {/* Zone 2: 4–6 clean text navigation links */}
            <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-200">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className={`py-1 relative transition-colors ${
                    link.href === '#admin'
                      ? 'text-amber-400 font-bold hover:text-amber-300 flex items-center gap-1.5 bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/30'
                      : 'hover:text-amber-400 hover:after:w-full after:transition-all after:duration-200 after:content-[\'\'] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-amber-400'
                  }`}
                >
                  {link.href === '#admin' && <LayoutDashboard className="w-3.5 h-3.5 text-amber-400" />}
                  <span>{link.label}</span>
                </a>
              ))}
            </nav>

            {/* Zone 3: 1–2 primary actions */}
            <div className="flex items-center gap-2.5">
              <UserProfileMenu
                onOpenAuth={onOpenAuth}
                onOpenAdmin={onOpenAdmin}
              />

              <a
                href={`tel:${settings.phone || BUSINESS_INFO.phone}`}
                className="hidden sm:inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-semibold px-4 py-2.5 rounded-lg shadow-sm hover:shadow-amber-500/20 transition-all duration-150 text-sm whitespace-nowrap active:scale-[0.98]"
              >
                <Phone className="w-4 h-4 fill-slate-950" />
                <span>Call Now: {settings.phone || BUSINESS_INFO.phone}</span>
              </a>

              {/* Mobile menu button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg text-slate-200 hover:text-white hover:bg-slate-800/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#0B1A30] border-b border-slate-800 px-4 pt-3 pb-6 space-y-3 animate-in fade-in slide-in-from-top-2 duration-150">
            {/* Mobile User Profile Section */}
            <div className="pb-1">
              <UserProfileMenu
                mobile
                onOpenAuth={(mode) => {
                  setMobileMenuOpen(false);
                  onOpenAuth(mode);
                }}
                onOpenAdmin={() => {
                  setMobileMenuOpen(false);
                  onOpenAdmin();
                }}
              />
            </div>

            <div className="flex flex-col space-y-2 pt-1 border-t border-slate-800/60">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    link.href === '#admin'
                      ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40 flex items-center gap-2'
                      : 'text-slate-200 hover:bg-slate-800 hover:text-amber-400'
                  }`}
                >
                  {link.href === '#admin' && <LayoutDashboard className="w-4 h-4 text-amber-400" />}
                  <span>{link.label}</span>
                </a>
              ))}
              <div className="pt-3 border-t border-slate-800">
                <a
                  href={`tel:${settings.phone || BUSINESS_INFO.phone}`}
                  className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold px-4 py-3 rounded-lg text-base shadow-sm transition-colors"
                >
                  <Phone className="w-5 h-5 fill-slate-950" />
                  <span>Call Now: {settings.phone || BUSINESS_INFO.phone}</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
