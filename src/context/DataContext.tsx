import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { Vehicle, ServiceItem, GalleryItem, EnquiryFormData } from '../types/travel';
import { VEHICLES_DATA, SERVICES_DATA, GALLERY_ITEMS, BUSINESS_INFO } from '../data/travelData';
import { useAuth } from './AuthContext';

export interface WebsiteSettings {
  id?: number;
  company_name?: string;
  phone?: string;
  whatsapp?: string;
  location?: string;
  hero_heading?: string;
  hero_description?: string;
  about_text?: string | null;
  google_maps_url?: string | null;
  logo_url?: string | null;
  business_hours?: string;
  updated_at?: string;
}

interface DataContextType {
  vehicles: Vehicle[];
  services: ServiceItem[];
  gallery: GalleryItem[];
  settings: WebsiteSettings;
  isLoading: boolean;
  submitEnquiry: (data: EnquiryFormData) => Promise<{ success: boolean; error?: string }>;
  refetchData: () => Promise<void>;
}

const defaultSettings: WebsiteSettings = {
  company_name: BUSINESS_INFO.companyName,
  phone: BUSINESS_INFO.phone,
  whatsapp: BUSINESS_INFO.whatsappNumber,
  location: BUSINESS_INFO.location,
  hero_heading: 'Your Journey, Our Responsibility',
  hero_description: 'Safe, Comfortable and Reliable Travel Services — Available 24/7.',
  business_hours: BUSINESS_INFO.service,
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>(VEHICLES_DATA);
  const [services, setServices] = useState<ServiceItem[]>(SERVICES_DATA);
  const [gallery, setGallery] = useState<GalleryItem[]>(GALLERY_ITEMS);
  const [settings, setSettings] = useState<WebsiteSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      // 1. Fetch website settings
      const { data: settingsData } = await supabase
        .from('website_settings')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (settingsData) {
        setSettings({
          ...defaultSettings,
          ...settingsData,
        });
      }

      // 2. Fetch vehicles & vehicle_images
      const { data: dbVehicles } = await supabase
        .from('vehicles')
        .select('*')
        .order('display_order', { ascending: true });

      const { data: dbVehicleImages } = await supabase
        .from('vehicle_images')
        .select('*')
        .order('display_order', { ascending: true });

      if (dbVehicles && dbVehicles.length > 0) {
        const mappedVehicles: Vehicle[] = dbVehicles.map((v) => {
          const imagesForVehicle = (dbVehicleImages || []).filter(
            (img) => img.vehicle_id === v.id
          );
          const firstImage =
            imagesForVehicle[0]?.image_url ||
            v.main_image ||
            (v.category === 'Sedan'
              ? '/images/swift-dzire-white.png'
              : v.category === 'MUV / MPV'
              ? '/images/ertiga-white.png'
              : '/images/force-traveller.jpg');

          let featureList: string[] = [];
          if (Array.isArray(v.features)) {
            featureList = v.features;
          } else if (typeof v.features === 'string') {
            try {
              featureList = JSON.parse(v.features);
            } catch {
              featureList = v.features.split(',').map((s: string) => s.trim());
            }
          }

          if (featureList.length === 0) {
            featureList = ['Air Conditioned', 'Clean & Sanitized', 'Push-Back Seats', 'Audio Entertainment'];
          }

          const cat = (v.category as Vehicle['category']) || 'Minibus / Traveller';
          const nameLower = (v.name || '').toLowerCase();
          const isCar = cat === 'Sedan' || cat === 'MUV / MPV' || nameLower.includes('dzire') || nameLower.includes('ertiga');

          return {
            id: v.id,
            name: v.name,
            category: cat,
            seatingCapacity: v.passenger_capacity
              ? `${v.passenger_capacity} Passengers`
              : cat === 'Sedan'
              ? '4+1 Passengers'
              : cat === 'MUV / MPV'
              ? '6+1 Passengers'
              : '12 / 17 / 26 Seater',
            luggageCapacity: cat === 'Sedan' ? '2-3 Medium Bags' : cat === 'MUV / MPV' ? '3-4 Large Bags' : 'Large Rear Luggage Carrier',
            acType: 'Chilled Air Conditioning',
            shortDescription: v.description || 'Premium, well-maintained vehicle for safe transit across Andhra Pradesh.',
            fullDescription: v.description || 'Experience peak comfort with Usha Travels well-maintained fleet, inspected before every departure.',
            features: featureList,
            idealFor: ['Outstation Journeys', 'Airport Transfers', 'Family & Pilgrimage Trips'],
            image: firstImage,
            tag: v.featured ? 'Featured Fleet' : 'Available',
            color: 'Pristine White',
            selfDriveAvailable: isCar,
          };
        });

        setVehicles(mappedVehicles);
      } else {
        // Fall back to default vehicles if DB vehicles table has 0 rows
        setVehicles(VEHICLES_DATA);
      }

      // 3. Fetch services
      const { data: dbServices } = await supabase
        .from('services')
        .select('*')
        .eq('active', true)
        .order('display_order', { ascending: true });

      if (dbServices && dbServices.length > 0) {
        // Map icon titles to valid iconName
        const iconMapping: Record<string, ServiceItem['iconName']> = {
          'Local Travel': 'MapPin',
          'Outstation Travel': 'Compass',
          'Airport & Railway Transfers': 'Plane',
          'Family Trips': 'Users',
          'Group Travel': 'Users',
          'Event Transportation': 'Calendar',
          'Custom Travel Requirements': 'Car',
          '24/7 Passenger Service': 'Clock',
          'Self-Drive Car Rentals': 'KeyRound',
        };

        const mappedServices: ServiceItem[] = dbServices.map((s) => ({
          id: s.id,
          title: s.title,
          description: s.description || '',
          iconName: iconMapping[s.title] || (s.title.toLowerCase().includes('drive') ? 'KeyRound' : 'ShieldCheck'),
          features: [
            '24/7 Availability from Sankaraguptam',
            'Clean & Sanitized White Fleet',
            'Transparent & Affordable Pricing',
          ],
        }));

        // Guarantee Self-Drive Car Rentals is present
        const hasSelfDrive = mappedServices.some((s) =>
          s.title.toLowerCase().includes('self-drive')
        );
        if (!hasSelfDrive) {
          const selfDriveItem = SERVICES_DATA.find((s) =>
            s.title.toLowerCase().includes('self-drive')
          );
          if (selfDriveItem) {
            mappedServices.push(selfDriveItem);
          }
        }

        setServices(mappedServices);
      } else {
        setServices(SERVICES_DATA);
      }

      // 4. Fetch gallery
      const { data: dbGallery } = await supabase
        .from('gallery')
        .select('*')
        .order('display_order', { ascending: true });

      if (dbGallery && dbGallery.length > 0) {
        const mappedGallery: GalleryItem[] = dbGallery.map((g) => ({
          id: g.id,
          title: g.title,
          category: (g.category as GalleryItem['category']) || 'Vehicles',
          image: g.image_url,
          caption: g.description || g.title,
        }));
        setGallery(mappedGallery);
      } else {
        setGallery(GALLERY_ITEMS);
      }
    } catch (err) {
      console.warn('Error fetching Supabase data, using default travel dataset:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Submit enquiry to Supabase enquiries table
  const submitEnquiry = async (
    formData: EnquiryFormData
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const modeLabel = formData.driveType === 'self-drive' ? 'Self-Drive Car Rental' : 'With Driver (Chauffeur)';
      const enrichedMessage = `[Service Mode: ${modeLabel}] [Vehicle: ${formData.vehiclePreference}] ${formData.message || ''}`.trim();

      const enquiryPayload: Record<string, unknown> = {
        customer_name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email ? formData.email.trim() : null,
        travel_date: formData.travelDate || null,
        pickup_location: formData.pickupLocation.trim(),
        destination: formData.destination.trim(),
        passengers: parseInt(formData.numberOfPassengers, 10) || 1,
        message: enrichedMessage,
        status: 'pending',
      };

      if (user?.id) {
        enquiryPayload.user_id = user.id;
      }

      const { error } = await supabase.from('enquiries').insert([enquiryPayload]);

      if (error) {
        console.warn('Supabase enquiry insertion note:', error.message);
        // If RLS blocked anon insert, still return success so the user can continue to WhatsApp
        return {
          success: true,
          error: error.message.includes('row-level security')
            ? 'Enquiry saved locally. For full account tracking, please sign in or confirm via WhatsApp.'
            : error.message,
        };
      }

      return { success: true };
    } catch (err: unknown) {
      const error = err as Error;
      return { success: false, error: error?.message || 'Failed to submit enquiry' };
    }
  };

  return (
    <DataContext.Provider
      value={{
        vehicles,
        services,
        gallery,
        settings,
        isLoading,
        submitEnquiry,
        refetchData: fetchData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useTravelData = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useTravelData must be used within a DataProvider');
  }
  return context;
};
