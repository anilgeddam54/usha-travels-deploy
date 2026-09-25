/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Vehicles } from './components/Vehicles';
import { Services } from './components/Services';
import { WhyChooseUs } from './components/WhyChooseUs';
import { Gallery } from './components/Gallery';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { StickyMobileBar } from './components/StickyMobileBar';
import { AuthModal } from './components/AuthModal';
import { AdminDashboard } from './components/AdminDashboard';

function MainAppContent() {
  const [selectedVehicleForEnquiry, setSelectedVehicleForEnquiry] = useState<string>('Force Traveller');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [adminDashboardOpen, setAdminDashboardOpen] = useState(false);

  // Requirement 12: Add protected Admin Dashboard route/page that checks actual profile role === "admin"
  useEffect(() => {
    const syncAdminRoute = () => {
      const isHashAdmin = window.location.hash === '#admin';
      const isPathAdmin = window.location.pathname === '/admin';
      if (isHashAdmin || isPathAdmin) {
        setAdminDashboardOpen(true);
      }
    };

    syncAdminRoute();
    window.addEventListener('hashchange', syncAdminRoute);
    window.addEventListener('popstate', syncAdminRoute);
    return () => {
      window.removeEventListener('hashchange', syncAdminRoute);
      window.removeEventListener('popstate', syncAdminRoute);
    };
  }, []);

  const handleExploreVehicles = () => {
    const el = document.getElementById('vehicles');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleContactClick = () => {
    const el = document.getElementById('enquiry');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectVehicleForEnquiry = (vehicleName: string) => {
    setSelectedVehicleForEnquiry(vehicleName);
  };

  const handleSelectServiceForEnquiry = (serviceTitle: string) => {
    const el = document.getElementById('enquiry');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenAuth = (mode: 'login' | 'register' = 'login') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const handleOpenAdmin = () => {
    window.location.hash = 'admin';
    setAdminDashboardOpen(true);
  };

  const handleCloseAdmin = () => {
    if (window.location.hash === '#admin') {
      window.history.pushState(null, '', window.location.pathname + window.location.search);
    }
    setAdminDashboardOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-amber-500/20 selection:text-amber-950">
      {/* Top Header with Profile / Auth Access */}
      <Header
        onOpenAuth={handleOpenAuth}
        onOpenAdmin={handleOpenAdmin}
      />

      {/* Main Content Sections */}
      <main className="flex-1 pb-16 md:pb-0">
        {/* 1. Hero Section */}
        <Hero
          onExploreVehicles={handleExploreVehicles}
          onQuickBook={handleContactClick}
        />

        {/* 2. About Section */}
        <About onContactClick={handleContactClick} />

        {/* 3. Our Vehicles Section (Dynamic Supabase Fleet + Self-Drive available for cars) */}
        <Vehicles onSelectVehicleForEnquiry={handleSelectVehicleForEnquiry} />

        {/* 4. Services Section (Dynamic Supabase Services + Self-Drive Guarantee) */}
        <Services onSelectServiceForEnquiry={handleSelectServiceForEnquiry} />

        {/* 5. Why Choose Us Section */}
        <WhyChooseUs />

        {/* 6. Gallery Section (Dynamic Supabase Images & Lightbox) */}
        <Gallery />

        {/* 7. Contact & Enquiry Form Section (Connected to Supabase Enquiries table) */}
        <Contact selectedVehicleForEnquiry={selectedVehicleForEnquiry} />
      </main>

      {/* Footer */}
      <Footer />

      {/* Sticky Mobile Call & WhatsApp Bar */}
      <StickyMobileBar />

      {/* Auth Modal (Sign In & Registration) */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
      />

      {/* Protected Admin Dashboard */}
      <AdminDashboard
        isOpen={adminDashboardOpen}
        onClose={handleCloseAdmin}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <MainAppContent />
      </DataProvider>
    </AuthProvider>
  );
}
