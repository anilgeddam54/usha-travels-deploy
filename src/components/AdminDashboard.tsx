import React, { useState, useEffect } from 'react';
import {
  X,
  Users,
  Car,
  CalendarCheck,
  Image as ImageIcon,
  Settings as SettingsIcon,
  ShieldCheck,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Phone,
  MessageSquare,
  RefreshCw,
  Search,
  Filter,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useTravelData, WebsiteSettings } from '../context/DataContext';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'enquiries' | 'vehicles' | 'gallery' | 'services' | 'customers' | 'settings';

interface DbVehicle {
  id: string;
  name: string;
  category: string;
  passenger_capacity?: number;
  description?: string;
  features?: any;
  display_order?: number;
  availability?: boolean;
  featured?: boolean;
  main_image?: string;
  created_at?: string;
}

interface DbVehicleImage {
  id: string;
  vehicle_id: string;
  image_url: string;
  display_order?: number;
}

interface DbEnquiry {
  id: string;
  customer_name: string;
  phone: string;
  email?: string;
  travel_date?: string;
  pickup_location: string;
  destination: string;
  passengers?: number;
  message?: string;
  status: string;
  created_at: string;
  user_id?: string;
}

interface DbGalleryItem {
  id: string;
  title: string;
  description?: string;
  category: string;
  image_url: string;
  display_order?: number;
}

interface DbService {
  id: string;
  title: string;
  description?: string;
  active: boolean;
  display_order?: number;
}

interface DbProfile {
  id: string;
  full_name?: string;
  phone?: string;
  role?: string;
  created_at?: string;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ isOpen, onClose }) => {
  const { user, profile, isAdmin, isProfileLoading, profileError, refreshProfile } = useAuth();
  const { refetchData } = useTravelData();

  const [activeTab, setActiveTab] = useState<TabType>('enquiries');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Data states
  const [enquiries, setEnquiries] = useState<DbEnquiry[]>([]);
  const [vehicles, setVehicles] = useState<DbVehicle[]>([]);
  const [vehicleImages, setVehicleImages] = useState<DbVehicleImage[]>([]);
  const [gallery, setGallery] = useState<DbGalleryItem[]>([]);
  const [services, setServices] = useState<DbService[]>([]);
  const [profiles, setProfiles] = useState<DbProfile[]>([]);
  const [settings, setSettings] = useState<WebsiteSettings>({});

  // Filters & search
  const [enquiryStatusFilter, setEnquiryStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal / Form states for creation/editing
  const [vehicleModalOpen, setVehicleModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<DbVehicle | null>(null);
  const [vehicleFormData, setVehicleFormData] = useState({
    name: '',
    category: 'Sedan',
    passenger_capacity: 4,
    description: '',
    features: 'Chilled AC, Clean Interiors, Audio System',
    display_order: 1,
    availability: true,
    featured: false,
    main_image: '',
  });

  // Vehicle image sub-manager
  const [selectedVehicleForImages, setSelectedVehicleForImages] = useState<DbVehicle | null>(null);
  const [newImageUrl, setNewImageUrl] = useState('');

  // Gallery add modal
  const [galleryModalOpen, setGalleryModalOpen] = useState(false);
  const [galleryFormData, setGalleryFormData] = useState({
    title: '',
    description: '',
    category: 'Vehicles',
    image_url: '',
    display_order: 1,
  });

  // Service add/edit modal
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<DbService | null>(null);
  const [serviceFormData, setServiceFormData] = useState({
    title: '',
    description: '',
    active: true,
    display_order: 1,
  });

  // Settings form
  const [settingsFormData, setSettingsFormData] = useState<WebsiteSettings>({});

  // Load all admin data
  const loadAdminData = async () => {
    if (!isAdmin) return;
    setLoading(true);
    setErrorMsg(null);

    try {
      // 1. Enquiries
      const { data: enqData, error: enqError } = await supabase
        .from('enquiries')
        .select('*')
        .order('created_at', { ascending: false });
      if (!enqError && enqData) setEnquiries(enqData);

      // 2. Vehicles
      const { data: vehData, error: vehError } = await supabase
        .from('vehicles')
        .select('*')
        .order('display_order', { ascending: true });
      if (!vehError && vehData) setVehicles(vehData);

      // 3. Vehicle Images
      const { data: imgData, error: imgError } = await supabase
        .from('vehicle_images')
        .select('*')
        .order('display_order', { ascending: true });
      if (!imgError && imgData) setVehicleImages(imgData);

      // 4. Gallery
      const { data: galData, error: galError } = await supabase
        .from('gallery')
        .select('*')
        .order('display_order', { ascending: true });
      if (!galError && galData) setGallery(galData);

      // 5. Services
      const { data: serData, error: serError } = await supabase
        .from('services')
        .select('*')
        .order('display_order', { ascending: true });
      if (!serError && serData) setServices(serData);

      // 6. Profiles
      const { data: profData, error: profError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      if (!profError && profData) setProfiles(profData);

      // 7. Settings
      const { data: settsData, error: settsError } = await supabase
        .from('website_settings')
        .select('*')
        .limit(1)
        .maybeSingle();
      if (!settsError && settsData) {
        setSettings(settsData);
        setSettingsFormData(settsData);
      }
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMsg(error?.message || 'Failed to load data from Supabase backend');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && isAdmin) {
      loadAdminData();
    }
  }, [isOpen, isAdmin]);

  if (!isOpen) return null;

  // 10. Handle loading state while profile is being fetched so CUSTOMER is not temporarily shown as the final role
  if (isProfileLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-white shadow-2xl">
          <RefreshCw className="w-8 h-8 text-amber-400 animate-spin mx-auto mb-4" />
          <h3 className="text-lg font-bold mb-2">Verifying Admin Permissions...</h3>
          <p className="text-xs text-slate-400">
            Checking authenticated profile role from public.profiles table.
          </p>
        </div>
      </div>
    );
  }

  // 11. If the profile query fails, show an appropriate error instead of silently assuming CUSTOMER
  if (profileError) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-md w-full bg-white rounded-2xl p-6 text-center shadow-2xl border border-red-200">
          <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Profile Query Error</h3>
          <p className="text-xs text-red-600 mb-6 bg-red-50 p-3 rounded-lg border border-red-100 font-mono text-left break-words">
            {profileError}
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => refreshProfile()}
              className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2.5 px-4 rounded-lg text-sm transition-colors"
            >
              Retry
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold py-2.5 px-4 rounded-lg text-sm transition-colors"
            >
              Return to Website
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 12. Add a protected Admin Dashboard route/page that checks the actual profile role === "admin"
  const actualRole = profile?.role ? String(profile.role).trim().toLowerCase() : null;
  if (!isAdmin || actualRole !== 'admin') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-md w-full bg-white rounded-2xl p-6 text-center shadow-2xl border border-slate-200">
          <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Admin Access Required</h3>
          <p className="text-slate-600 text-sm mb-3">
            You must be authenticated with an administrative account (<code className="bg-slate-100 px-1 py-0.5 rounded text-xs font-mono font-semibold">role = 'admin'</code> in <code className="bg-slate-100 px-1 py-0.5 rounded text-xs font-mono">public.profiles</code>) to access the Usha Travels management console.
          </p>
          <p className="text-xs text-slate-500 mb-6">
            Current account role: <span className="font-bold text-slate-800">{actualRole ? actualRole.toUpperCase() : 'CUSTOMER'}</span>
          </p>
          <button
            type="button"
            onClick={onClose}
            className="w-full bg-[#0A192F] text-amber-400 font-bold py-2.5 px-4 rounded-lg hover:bg-slate-900 transition-colors"
          >
            Return to Website
          </button>
        </div>
      </div>
    );
  }

  // --- Handlers ---
  const handleUpdateEnquiryStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('enquiries')
        .update({ status: newStatus })
        .eq('id', id);
      if (error) throw error;
      setEnquiries((prev) =>
        prev.map((e) => (e.id === id ? { ...e, status: newStatus } : e))
      );
      setSuccessMsg('Enquiry status updated successfully.');
      setTimeout(() => setSuccessMsg(null), 2500);
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMsg(error.message);
    }
  };

  const handleDeleteEnquiry = async (id: string) => {
    if (!confirm('Are you sure you want to delete this enquiry?')) return;
    try {
      const { error } = await supabase.from('enquiries').delete().eq('id', id);
      if (error) throw error;
      setEnquiries((prev) => prev.filter((e) => e.id !== id));
      setSuccessMsg('Enquiry deleted.');
      setTimeout(() => setSuccessMsg(null), 2000);
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMsg(error.message);
    }
  };

  // Vehicle save (Add / Edit)
  const handleSaveVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    try {
      const payload: Record<string, unknown> = {
        name: vehicleFormData.name.trim(),
        category: vehicleFormData.category,
        passenger_capacity: Number(vehicleFormData.passenger_capacity) || 4,
        description: vehicleFormData.description.trim(),
        features: vehicleFormData.features.split(',').map((s) => s.trim()).filter(Boolean),
        display_order: Number(vehicleFormData.display_order) || 1,
        availability: vehicleFormData.availability,
        featured: vehicleFormData.featured,
        main_image: vehicleFormData.main_image.trim() || null,
      };

      if (editingVehicle) {
        const { error } = await supabase
          .from('vehicles')
          .update(payload)
          .eq('id', editingVehicle.id);
        if (error) throw error;
        setSuccessMsg('Vehicle updated successfully.');
      } else {
        const { error } = await supabase.from('vehicles').insert([payload]);
        if (error) throw error;
        setSuccessMsg('New vehicle added successfully.');
      }

      setVehicleModalOpen(false);
      setEditingVehicle(null);
      await loadAdminData();
      await refetchData();
      setTimeout(() => setSuccessMsg(null), 2500);
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMsg(error.message);
    }
  };

  const handleDeleteVehicle = async (id: string) => {
    if (!confirm('Are you sure you want to delete this vehicle? Linked images will also be removed.')) return;
    try {
      const { error } = await supabase.from('vehicles').delete().eq('id', id);
      if (error) throw error;
      setVehicles((prev) => prev.filter((v) => v.id !== id));
      await refetchData();
      setSuccessMsg('Vehicle deleted.');
      setTimeout(() => setSuccessMsg(null), 2000);
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMsg(error.message);
    }
  };

  // Add image to vehicle
  const handleAddVehicleImage = async () => {
    if (!selectedVehicleForImages || !newImageUrl.trim()) return;
    try {
      const { data, error } = await supabase.from('vehicle_images').insert([
        {
          vehicle_id: selectedVehicleForImages.id,
          image_url: newImageUrl.trim(),
          display_order: (vehicleImages.filter((img) => img.vehicle_id === selectedVehicleForImages.id).length || 0) + 1,
        },
      ]).select();
      if (error) throw error;
      if (data) {
        setVehicleImages((prev) => [...prev, data[0] as DbVehicleImage]);
      }
      setNewImageUrl('');
      await refetchData();
      setSuccessMsg('Image added to vehicle.');
      setTimeout(() => setSuccessMsg(null), 2000);
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMsg(error.message);
    }
  };

  const handleDeleteVehicleImage = async (imageId: string) => {
    try {
      const { error } = await supabase.from('vehicle_images').delete().eq('id', imageId);
      if (error) throw error;
      setVehicleImages((prev) => prev.filter((img) => img.id !== imageId));
      await refetchData();
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMsg(error.message);
    }
  };

  // Gallery Save
  const handleSaveGalleryItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from('gallery').insert([
        {
          title: galleryFormData.title.trim(),
          description: galleryFormData.description.trim(),
          category: galleryFormData.category,
          image_url: galleryFormData.image_url.trim(),
          display_order: Number(galleryFormData.display_order) || 1,
        },
      ]);
      if (error) throw error;
      setGalleryModalOpen(false);
      setGalleryFormData({
        title: '',
        description: '',
        category: 'Vehicles',
        image_url: '',
        display_order: 1,
      });
      await loadAdminData();
      await refetchData();
      setSuccessMsg('Gallery image added.');
      setTimeout(() => setSuccessMsg(null), 2000);
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMsg(error.message);
    }
  };

  const handleDeleteGalleryItem = async (id: string) => {
    if (!confirm('Delete this gallery photo?')) return;
    try {
      const { error } = await supabase.from('gallery').delete().eq('id', id);
      if (error) throw error;
      setGallery((prev) => prev.filter((g) => g.id !== id));
      await refetchData();
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMsg(error.message);
    }
  };

  // Service Save
  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        title: serviceFormData.title.trim(),
        description: serviceFormData.description.trim(),
        active: serviceFormData.active,
        display_order: Number(serviceFormData.display_order) || 1,
      };

      if (editingService) {
        const { error } = await supabase.from('services').update(payload).eq('id', editingService.id);
        if (error) throw error;
        setSuccessMsg('Service updated.');
      } else {
        const { error } = await supabase.from('services').insert([payload]);
        if (error) throw error;
        setSuccessMsg('New service added.');
      }

      setServiceModalOpen(false);
      setEditingService(null);
      await loadAdminData();
      await refetchData();
      setTimeout(() => setSuccessMsg(null), 2000);
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMsg(error.message);
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm('Are you sure you want to remove this service?')) return;
    try {
      const { error } = await supabase.from('services').delete().eq('id', id);
      if (error) throw error;
      setServices((prev) => prev.filter((s) => s.id !== id));
      await refetchData();
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMsg(error.message);
    }
  };

  // Save Website Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!settings.id) {
        // Insert if missing
        const { error } = await supabase.from('website_settings').insert([settingsFormData]);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('website_settings')
          .update(settingsFormData)
          .eq('id', settings.id);
        if (error) throw error;
      }

      await loadAdminData();
      await refetchData();
      setSuccessMsg('Website settings saved successfully.');
      setTimeout(() => setSuccessMsg(null), 2500);
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMsg(error.message);
    }
  };

  // Filtered enquiries
  const filteredEnquiries = enquiries.filter((e) => {
    const matchesStatus = enquiryStatusFilter === 'all' || e.status === enquiryStatusFilter;
    const matchesSearch =
      !searchQuery ||
      e.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.phone?.includes(searchQuery) ||
      e.destination?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-900 text-slate-100 overflow-hidden">
      {/* Top Bar */}
      <header className="bg-[#060D18] border-b border-slate-800 px-4 sm:px-6 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-amber-400 font-bold tracking-tight text-lg">USHA</span>
            <span className="text-white font-bold tracking-tight text-lg">TRAVELS</span>
          </div>
          <span className="hidden sm:inline-block text-xs bg-amber-500/20 text-amber-400 px-2.5 py-0.5 rounded font-semibold border border-amber-500/30">
            Admin Console
          </span>
          <span className="text-xs text-slate-400 hidden md:inline">
            Logged in as <strong className="text-slate-200">{user?.email}</strong>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadAdminData}
            disabled={loading}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
          >
            <X className="w-4 h-4" />
            <span>Close Dashboard</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Sidebar Nav */}
        <aside className="w-full md:w-64 bg-[#0A192F] border-r border-slate-800 p-3 sm:p-4 shrink-0 flex md:flex-col overflow-x-auto md:overflow-x-visible gap-1.5">
          <button
            type="button"
            onClick={() => setActiveTab('enquiries')}
            className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === 'enquiries'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <CalendarCheck className="w-4 h-4" />
              <span>Enquiries</span>
            </div>
            {enquiries.filter((e) => e.status === 'pending').length > 0 && (
              <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                activeTab === 'enquiries' ? 'bg-slate-950 text-amber-400' : 'bg-amber-500 text-slate-950'
              }`}>
                {enquiries.filter((e) => e.status === 'pending').length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('vehicles')}
            className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === 'vehicles'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            <Car className="w-4 h-4" />
            <span>Vehicles & Fleet</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('services')}
            className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === 'services'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Services</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('gallery')}
            className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === 'gallery'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Gallery Photos</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('customers')}
            className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === 'customers'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Customer Profiles</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === 'settings'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            <SettingsIcon className="w-4 h-4" />
            <span>Website Settings</span>
          </button>
        </aside>

        {/* Content Area */}
        <main className="flex-1 bg-slate-950 p-4 sm:p-6 overflow-y-auto">
          {/* Notification Banners */}
          {errorMsg && (
            <div className="mb-4 p-3 bg-red-950/80 border border-red-800 text-red-200 text-xs rounded-lg flex items-center justify-between">
              <span>{errorMsg}</span>
              <button type="button" onClick={() => setErrorMsg(null)} className="text-red-400">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 bg-emerald-950/80 border border-emerald-800 text-emerald-200 text-xs rounded-lg flex items-center justify-between">
              <span>{successMsg}</span>
              <button type="button" onClick={() => setSuccessMsg(null)} className="text-emerald-400">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* TAB 1: ENQUIRIES */}
          {activeTab === 'enquiries' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-white">Booking Enquiries</h3>
                  <p className="text-xs text-slate-400">
                    Direct travel requests received from visitors and registered customers.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-48">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                    <input
                      type="text"
                      placeholder="Search name, phone, route..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <select
                    value={enquiryStatusFilter}
                    onChange={(e) => setEnquiryStatusFilter(e.target.value)}
                    className="bg-slate-900 border border-slate-700 text-xs text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-amber-500"
                  >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {filteredEnquiries.length === 0 ? (
                <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-8 text-center text-slate-400 text-xs">
                  No enquiries found matching criteria.
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {filteredEnquiries.map((enq) => (
                    <div
                      key={enq.id}
                      className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 sm:p-5 hover:border-slate-700 transition-all flex flex-col md:flex-row items-start justify-between gap-4"
                    >
                      <div className="space-y-2 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-bold text-white">{enq.customer_name}</span>
                          <span
                            className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                              enq.status === 'confirmed'
                                ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                                : enq.status === 'completed'
                                ? 'bg-blue-950 text-blue-400 border border-blue-800'
                                : enq.status === 'cancelled'
                                ? 'bg-red-950 text-red-400 border border-red-800'
                                : 'bg-amber-950 text-amber-400 border border-amber-800'
                            }`}
                          >
                            {enq.status}
                          </span>
                          <span className="text-[11px] text-slate-500">
                            {new Date(enq.created_at).toLocaleString()}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs text-slate-300">
                          <div>
                            <span className="text-slate-500">Phone: </span>
                            <a
                              href={`tel:${enq.phone}`}
                              className="text-amber-400 font-semibold hover:underline"
                            >
                              {enq.phone}
                            </a>
                          </div>
                          <div>
                            <span className="text-slate-500">Email: </span>
                            <span>{enq.email || 'Not provided'}</span>
                          </div>
                          <div>
                            <span className="text-slate-500">Travel Date: </span>
                            <span className="font-medium text-slate-200">
                              {enq.travel_date || 'Flexible / Urgent'}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-500">Route: </span>
                            <span className="font-medium text-slate-200">
                              {enq.pickup_location} → {enq.destination}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-500">Passengers: </span>
                            <span className="font-medium text-slate-200">{enq.passengers || 1}</span>
                          </div>
                        </div>

                        {enq.message && (
                          <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800/80 text-xs text-slate-300 mt-2">
                            <span className="text-slate-500 font-semibold">Message & Mode: </span>
                            {enq.message}
                          </div>
                        )}
                      </div>

                      {/* Enquiry Action buttons */}
                      <div className="flex md:flex-col items-center gap-2 shrink-0 w-full md:w-auto pt-2 md:pt-0 border-t md:border-t-0 border-slate-800">
                        <select
                          value={enq.status}
                          onChange={(e) => handleUpdateEnquiryStatus(enq.id, e.target.value)}
                          className="bg-slate-800 border border-slate-700 text-xs text-slate-200 rounded px-2 py-1.5 focus:outline-none focus:border-amber-500 w-full"
                        >
                          <option value="pending">Set Pending</option>
                          <option value="confirmed">Set Confirmed</option>
                          <option value="completed">Set Completed</option>
                          <option value="cancelled">Set Cancelled</option>
                        </select>

                        <div className="flex items-center gap-1.5 w-full">
                          <a
                            href={`https://wa.me/91${enq.phone.replace(/\D/g, '')}?text=${encodeURIComponent(
                              `Hello ${enq.customer_name}, this is Usha Travels regarding your booking enquiry from Sankaraguptam.`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 inline-flex items-center justify-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-semibold py-1.5 px-2 rounded transition-colors"
                          >
                            <MessageSquare className="w-3 h-3" />
                            <span>WhatsApp</span>
                          </a>

                          <button
                            type="button"
                            onClick={() => handleDeleteEnquiry(enq.id)}
                            className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded transition-colors"
                            title="Delete Enquiry"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: VEHICLES */}
          {activeTab === 'vehicles' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white">Vehicles & Fleet Management</h3>
                  <p className="text-xs text-slate-400">
                    Add, edit, or configure vehicles stored in the Supabase backend.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEditingVehicle(null);
                    setVehicleFormData({
                      name: '',
                      category: 'Sedan',
                      passenger_capacity: 4,
                      description: '',
                      features: 'Chilled AC, Clean Interiors, Audio System',
                      display_order: (vehicles.length || 0) + 1,
                      availability: true,
                      featured: false,
                      main_image: '',
                    });
                    setVehicleModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-2 rounded-lg text-xs transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Vehicle</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {vehicles.map((v) => {
                  const linkedImages = vehicleImages.filter((img) => img.vehicle_id === v.id);
                  return (
                    <div
                      key={v.id}
                      className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col justify-between"
                    >
                      <div className="h-40 bg-slate-950 relative overflow-hidden flex items-center justify-center">
                        <img
                          src={
                            v.main_image ||
                            linkedImages[0]?.image_url ||
                            (v.category === 'Sedan'
                              ? '/images/swift-dzire-white.png'
                              : v.category === 'MUV / MPV'
                              ? '/images/ertiga-white.png'
                              : '/images/force-traveller.jpg')
                          }
                          alt={v.name}
                          className="w-full h-full object-contain p-2"
                        />
                        <span className="absolute top-2 left-2 bg-[#0A192F]/90 text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded">
                          {v.category}
                        </span>
                        {v.featured && (
                          <span className="absolute top-2 right-2 bg-amber-500 text-slate-950 text-[10px] font-bold px-2 py-0.5 rounded">
                            Featured
                          </span>
                        )}
                      </div>

                      <div className="p-4 space-y-2 flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-white text-base">{v.name}</h4>
                          <span className="text-xs text-slate-400">
                            {v.passenger_capacity ? `${v.passenger_capacity} seats` : ''}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 line-clamp-2">
                          {v.description || 'No description provided.'}
                        </p>
                        <div className="text-[11px] text-slate-500">
                          {linkedImages.length} linked gallery photo(s)
                        </div>
                      </div>

                      <div className="p-3 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedVehicleForImages(v)}
                          className="text-xs font-semibold text-amber-400 hover:text-amber-300"
                        >
                          Manage Photos ({linkedImages.length})
                        </button>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingVehicle(v);
                              setVehicleFormData({
                                name: v.name,
                                category: v.category,
                                passenger_capacity: v.passenger_capacity || 4,
                                description: v.description || '',
                                features: Array.isArray(v.features)
                                  ? v.features.join(', ')
                                  : v.features || '',
                                display_order: v.display_order || 1,
                                availability: v.availability !== false,
                                featured: !!v.featured,
                                main_image: v.main_image || '',
                              });
                              setVehicleModalOpen(true);
                            }}
                            className="p-1.5 text-slate-300 hover:text-white rounded hover:bg-slate-800"
                            title="Edit Vehicle"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteVehicle(v.id)}
                            className="p-1.5 text-red-400 hover:text-red-300 rounded hover:bg-slate-800"
                            title="Delete Vehicle"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Photo Manager Modal */}
              {selectedVehicleForImages && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
                  <div className="max-w-xl w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-base font-bold text-white">
                        Photos for {selectedVehicleForImages.name}
                      </h4>
                      <button
                        type="button"
                        onClick={() => setSelectedVehicleForImages(null)}
                        className="text-slate-400 hover:text-white"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="url"
                        placeholder="Paste image URL (https://... or /images/...)"
                        value={newImageUrl}
                        onChange={(e) => setNewImageUrl(e.target.value)}
                        className="flex-1 px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                      <button
                        type="button"
                        onClick={handleAddVehicleImage}
                        className="bg-amber-500 text-slate-950 font-bold px-3 py-2 rounded-lg text-xs hover:bg-amber-400"
                      >
                        Add Photo
                      </button>
                    </div>

                    <div className="grid grid-cols-3 gap-3 max-h-60 overflow-y-auto pt-2">
                      {vehicleImages
                        .filter((img) => img.vehicle_id === selectedVehicleForImages.id)
                        .map((img) => (
                          <div
                            key={img.id}
                            className="relative group rounded-lg overflow-hidden border border-slate-800 bg-slate-950 h-24"
                          >
                            <img
                              src={img.image_url}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => handleDeleteVehicleImage(img.id)}
                              className="absolute top-1 right-1 p-1 bg-red-600/90 hover:bg-red-600 text-white rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SERVICES */}
          {activeTab === 'services' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white">Services Configuration</h3>
                  <p className="text-xs text-slate-400">
                    Manage service offerings shown on the live website.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEditingService(null);
                    setServiceFormData({
                      title: '',
                      description: '',
                      active: true,
                      display_order: (services.length || 0) + 1,
                    });
                    setServiceModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-2 rounded-lg text-xs transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Service</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {services.map((s) => (
                  <div
                    key={s.id}
                    className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-white text-sm">{s.title}</h4>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            s.active
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {s.active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-3">
                        {s.description || 'No description.'}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                      <span className="text-slate-500">Order: {s.display_order || 1}</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingService(s);
                            setServiceFormData({
                              title: s.title,
                              description: s.description || '',
                              active: s.active,
                              display_order: s.display_order || 1,
                            });
                            setServiceModalOpen(true);
                          }}
                          className="p-1.5 text-slate-300 hover:text-white rounded hover:bg-slate-800"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteService(s.id)}
                          className="p-1.5 text-red-400 hover:text-red-300 rounded hover:bg-slate-800"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: GALLERY */}
          {activeTab === 'gallery' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white">Gallery Photos</h3>
                  <p className="text-xs text-slate-400">
                    Manage visual travel photographs displayed in the customer gallery.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setGalleryModalOpen(true)}
                  className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-2 rounded-lg text-xs transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Photo</span>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {gallery.map((g) => (
                  <div
                    key={g.id}
                    className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden group"
                  >
                    <div className="h-32 bg-slate-950 relative">
                      <img src={g.image_url} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleDeleteGalleryItem(g.id)}
                        className="absolute top-2 right-2 p-1.5 bg-red-600/90 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Delete Image"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="p-2.5">
                      <div className="text-xs font-bold text-white truncate">{g.title}</div>
                      <div className="text-[10px] text-amber-400">{g.category}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: CUSTOMER PROFILES */}
          {activeTab === 'customers' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-white">Registered Customer Profiles</h3>
                <p className="text-xs text-slate-400">
                  Accounts created through the registration portal stored in public.profiles.
                </p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0A192F] text-slate-300 border-b border-slate-800 uppercase font-semibold">
                    <tr>
                      <th className="p-3">Customer Name</th>
                      <th className="p-3">Phone</th>
                      <th className="p-3">Role</th>
                      <th className="p-3">Registered At</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    {profiles.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-800/40">
                        <td className="p-3 font-semibold text-white">
                          {p.full_name || 'Guest User'}
                        </td>
                        <td className="p-3">
                          {p.phone ? (
                            <a href={`tel:${p.phone}`} className="text-amber-400 hover:underline">
                              {p.phone}
                            </a>
                          ) : (
                            'N/A'
                          )}
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded font-bold uppercase text-[10px] ${
                              p.role === 'admin'
                                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {p.role || 'user'}
                          </span>
                        </td>
                        <td className="p-3 text-slate-500">
                          {p.created_at ? new Date(p.created_at).toLocaleDateString() : 'N/A'}
                        </td>
                      </tr>
                    ))}
                    {profiles.length === 0 && (
                      <tr>
                        <td colSpan={4} className="p-6 text-center text-slate-500">
                          No profiles found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 6: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-4 max-w-2xl">
              <div>
                <h3 className="text-xl font-bold text-white">Website & Company Settings</h3>
                <p className="text-xs text-slate-400">
                  Update primary contact, location, and hero copy across the entire website.
                </p>
              </div>

              <form onSubmit={handleSaveSettings} className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={settingsFormData.company_name || ''}
                    onChange={(e) => setSettingsFormData({ ...settingsFormData, company_name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                      Primary Phone
                    </label>
                    <input
                      type="text"
                      value={settingsFormData.phone || ''}
                      onChange={(e) => setSettingsFormData({ ...settingsFormData, phone: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                      WhatsApp Number
                    </label>
                    <input
                      type="text"
                      value={settingsFormData.whatsapp || ''}
                      onChange={(e) => setSettingsFormData({ ...settingsFormData, whatsapp: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                      Base Location
                    </label>
                    <input
                      type="text"
                      value={settingsFormData.location || ''}
                      onChange={(e) => setSettingsFormData({ ...settingsFormData, location: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                      Business Hours
                    </label>
                    <input
                      type="text"
                      value={settingsFormData.business_hours || '24/7'}
                      onChange={(e) => setSettingsFormData({ ...settingsFormData, business_hours: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                    Hero Heading
                  </label>
                  <input
                    type="text"
                    value={settingsFormData.hero_heading || ''}
                    onChange={(e) => setSettingsFormData({ ...settingsFormData, hero_heading: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                    Hero Description
                  </label>
                  <textarea
                    rows={2}
                    value={settingsFormData.hero_description || ''}
                    onChange={(e) => setSettingsFormData({ ...settingsFormData, hero_description: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2.5 rounded-lg text-xs transition-colors"
                >
                  Save Settings to Database
                </button>
              </form>
            </div>
          )}
        </main>
      </div>

      {/* Vehicle Add / Edit Modal */}
      {vehicleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="max-w-lg w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-base font-bold text-white">
                {editingVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}
              </h4>
              <button
                type="button"
                onClick={() => setVehicleModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveVehicle} className="space-y-3">
              <div>
                <label className="block text-xs text-slate-300 font-bold mb-1">Vehicle Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maruti Suzuki Ertiga"
                  value={vehicleFormData.name}
                  onChange={(e) => setVehicleFormData({ ...vehicleFormData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-300 font-bold mb-1">Category *</label>
                  <select
                    value={vehicleFormData.category}
                    onChange={(e) => setVehicleFormData({ ...vehicleFormData, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Sedan">Sedan</option>
                    <option value="MUV / MPV">MUV / MPV</option>
                    <option value="Minibus / Traveller">Minibus / Traveller</option>
                    <option value="SUV">SUV</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-slate-300 font-bold mb-1">
                    Passenger Capacity *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={vehicleFormData.passenger_capacity}
                    onChange={(e) =>
                      setVehicleFormData({
                        ...vehicleFormData,
                        passenger_capacity: parseInt(e.target.value, 10) || 4,
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-300 font-bold mb-1">Main Image URL</label>
                <input
                  type="text"
                  placeholder="https://... or /images/..."
                  value={vehicleFormData.main_image}
                  onChange={(e) =>
                    setVehicleFormData({ ...vehicleFormData, main_image: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-300 font-bold mb-1">Description</label>
                <textarea
                  rows={2}
                  value={vehicleFormData.description}
                  onChange={(e) =>
                    setVehicleFormData({ ...vehicleFormData, description: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-300 font-bold mb-1">
                  Features (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="Chilled AC, Pushback Seats, Music System"
                  value={vehicleFormData.features}
                  onChange={(e) =>
                    setVehicleFormData({ ...vehicleFormData, features: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center gap-4 pt-1">
                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={vehicleFormData.availability}
                    onChange={(e) =>
                      setVehicleFormData({ ...vehicleFormData, availability: e.target.checked })
                    }
                    className="rounded text-amber-500"
                  />
                  <span>Available for booking</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={vehicleFormData.featured}
                    onChange={(e) =>
                      setVehicleFormData({ ...vehicleFormData, featured: e.target.checked })
                    }
                    className="rounded text-amber-500"
                  />
                  <span>Mark as Featured</span>
                </label>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setVehicleModalOpen(false)}
                  className="px-3 py-2 rounded-lg text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-amber-500 text-slate-950 font-bold px-4 py-2 rounded-lg text-xs hover:bg-amber-400"
                >
                  Save Vehicle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Gallery Add Modal */}
      {galleryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-base font-bold text-white">Add Gallery Photo</h4>
              <button
                type="button"
                onClick={() => setGalleryModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveGalleryItem} className="space-y-3">
              <div>
                <label className="block text-xs text-slate-300 font-bold mb-1">Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Godavari Highway Drive"
                  value={galleryFormData.title}
                  onChange={(e) => setGalleryFormData({ ...galleryFormData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-300 font-bold mb-1">Image URL *</label>
                <input
                  type="url"
                  required
                  placeholder="https://..."
                  value={galleryFormData.image_url}
                  onChange={(e) =>
                    setGalleryFormData({ ...galleryFormData, image_url: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-300 font-bold mb-1">Category</label>
                  <select
                    value={galleryFormData.category}
                    onChange={(e) =>
                      setGalleryFormData({ ...galleryFormData, category: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Vehicles">Vehicles</option>
                    <option value="Journeys">Journeys</option>
                    <option value="Godavari Region">Godavari Region</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-slate-300 font-bold mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={galleryFormData.display_order}
                    onChange={(e) =>
                      setGalleryFormData({
                        ...galleryFormData,
                        display_order: parseInt(e.target.value, 10) || 1,
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-300 font-bold mb-1">Description</label>
                <textarea
                  rows={2}
                  value={galleryFormData.description}
                  onChange={(e) =>
                    setGalleryFormData({ ...galleryFormData, description: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setGalleryModalOpen(false)}
                  className="px-3 py-2 rounded-lg text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-amber-500 text-slate-950 font-bold px-4 py-2 rounded-lg text-xs hover:bg-amber-400"
                >
                  Save Photo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Service Modal */}
      {serviceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-base font-bold text-white">
                {editingService ? 'Edit Service' : 'Add New Service'}
              </h4>
              <button
                type="button"
                onClick={() => setServiceModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveService} className="space-y-3">
              <div>
                <label className="block text-xs text-slate-300 font-bold mb-1">
                  Service Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pilgrimage Tour Packages"
                  value={serviceFormData.title}
                  onChange={(e) =>
                    setServiceFormData({ ...serviceFormData, title: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-300 font-bold mb-1">Description</label>
                <textarea
                  rows={3}
                  value={serviceFormData.description}
                  onChange={(e) =>
                    setServiceFormData({ ...serviceFormData, description: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={serviceFormData.active}
                    onChange={(e) =>
                      setServiceFormData({ ...serviceFormData, active: e.target.checked })
                    }
                    className="rounded text-amber-500"
                  />
                  <span>Active & Shown on Website</span>
                </label>

                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <span>Order:</span>
                  <input
                    type="number"
                    value={serviceFormData.display_order}
                    onChange={(e) =>
                      setServiceFormData({
                        ...serviceFormData,
                        display_order: parseInt(e.target.value, 10) || 1,
                      })
                    }
                    className="w-16 px-2 py-1 bg-slate-950 border border-slate-700 rounded text-xs text-white"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setServiceModalOpen(false)}
                  className="px-3 py-2 rounded-lg text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-amber-500 text-slate-950 font-bold px-4 py-2 rounded-lg text-xs hover:bg-amber-400"
                >
                  Save Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
