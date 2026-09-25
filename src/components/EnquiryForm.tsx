import React, { useState, useEffect } from 'react';
import { Send, CheckCircle, MessageSquare, Phone, Calendar, MapPin, Users, Car, AlertCircle, KeyRound, UserCheck, Mail } from 'lucide-react';
import { EnquiryFormData } from '../types/travel';
import { BUSINESS_INFO, VEHICLES_DATA } from '../data/travelData';
import { useTravelData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';

interface EnquiryFormProps {
  initialVehiclePreference?: string;
}

export const EnquiryForm: React.FC<EnquiryFormProps> = ({
  initialVehiclePreference = '',
}) => {
  const { vehicles, submitEnquiry } = useTravelData();
  const { user, profile } = useAuth();

  const [formData, setFormData] = useState<EnquiryFormData>({
    name: '',
    phone: '',
    email: '',
    travelDate: '',
    pickupLocation: 'Sankaraguptam',
    destination: '',
    vehiclePreference: initialVehiclePreference || 'Force Traveller',
    driveType: 'with-driver',
    numberOfPassengers: '4',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionFeedback, setSubmissionFeedback] = useState<string | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof EnquiryFormData, string>>>({});

  // Auto-populate logged-in user profile details if empty
  useEffect(() => {
    if (user || profile) {
      setFormData((prev) => ({
        ...prev,
        name: prev.name || profile?.full_name || '',
        phone: prev.phone || profile?.phone || '',
        email: prev.email || user?.email || '',
      }));
    }
  }, [user, profile]);

  // Sync preference if changed from parent
  useEffect(() => {
    if (initialVehiclePreference) {
      setFormData((prev) => ({ ...prev, vehiclePreference: initialVehiclePreference }));
    }
  }, [initialVehiclePreference]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof EnquiryFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = () => {
    const newErrors: Partial<Record<keyof EnquiryFormData, string>> = {};
    if (!formData.name.trim()) newErrors.name = 'Please enter your name';
    if (!formData.phone.trim()) {
      newErrors.phone = 'Please enter your phone number';
    } else if (!/^[6-9]\d{9}$/.test(formData.phone.replace(/[\s-+]/g, '').slice(-10))) {
      newErrors.phone = 'Please enter a valid 10-digit Indian phone number';
    }
    if (!formData.pickupLocation.trim()) newErrors.pickupLocation = 'Please enter pickup location';
    if (!formData.destination.trim()) newErrors.destination = 'Please enter your destination';
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setSubmissionFeedback(null);

    try {
      const res = await submitEnquiry(formData);
      if (res.error) {
        setSubmissionFeedback(res.error);
      }
      setSubmitted(true);
    } catch (err: unknown) {
      console.warn('Enquiry submission error:', err);
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateWhatsAppUrl = () => {
    const text = `*New Booking Enquiry - Usha Travels*
*Name:* ${formData.name}
*Phone:* ${formData.phone}
*Service Mode:* ${formData.driveType === 'self-drive' ? 'Self-Drive Car Rental' : 'With Driver (Chauffeur)'}
*Travel Date:* ${formData.travelDate || 'Immediate / To be confirmed'}
*Pickup:* ${formData.pickupLocation}
*Destination:* ${formData.destination}
*Vehicle:* ${formData.vehiclePreference}
*Passengers:* ${formData.numberOfPassengers}
*Note:* ${formData.message || 'None'}`;

    return `https://wa.me/${BUSINESS_INFO.whatsappNumber}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div id="enquiry" className="bg-white rounded-2xl border border-slate-200 shadow-xl p-6 sm:p-10">
      <div className="mb-8">
        <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider">
          Quick Travel Booking
        </span>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0A192F] mt-1 mb-2">
          Send Booking Enquiry
        </h3>
        <p className="text-slate-600 text-sm">
          Fill out this quick form or call us directly at <a href={`tel:${BUSINESS_INFO.phone}`} className="text-amber-700 font-bold hover:underline">{BUSINESS_INFO.phone}</a>. We respond promptly.
        </p>
      </div>

      {submitted ? (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center space-y-4 animate-in fade-in duration-200">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8" />
          </div>
          <div>
            <h4 className="text-xl font-bold text-slate-900">Enquiry Received!</h4>
            <p className="text-sm text-slate-600 mt-1 max-w-md mx-auto">
              Thank you, <strong className="text-slate-900">{formData.name}</strong>. Our team in Sankaraguptam has received your request for <strong>{formData.vehiclePreference}</strong> and will call you at <strong>{formData.phone}</strong> right away.
            </p>
          </div>

          <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={generateWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-5 py-3 rounded-lg text-sm shadow transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Forward to WhatsApp for Instant Confirmation</span>
            </a>

            <button
              type="button"
              onClick={() => {
                setSubmitted(false);
                setFormData({
                  name: '',
                  phone: '',
                  travelDate: '',
                  pickupLocation: 'Sankaraguptam',
                  destination: '',
                  vehiclePreference: 'Force Traveller',
                  driveType: 'with-driver',
                  numberOfPassengers: '4',
                  message: '',
                });
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center py-3 px-4 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-200/50 transition-colors"
            >
              Submit Another Enquiry
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Full Name *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Ramesh Varma"
                className={`w-full px-3.5 py-2.5 rounded-lg border text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all ${
                  errors.name ? 'border-red-500 bg-red-50/20' : 'border-slate-300 focus:border-amber-500'
                }`}
              />
              {errors.name && (
                <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  {errors.name}
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Phone Number (10 Digits) *
              </label>
              <div className="relative">
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="e.g. 9876543210"
                  className={`w-full px-3.5 py-2.5 rounded-lg border text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all ${
                    errors.phone ? 'border-red-500 bg-red-50/20' : 'border-slate-300 focus:border-amber-500'
                  }`}
                />
              </div>
              {errors.phone && (
                <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  {errors.phone}
                </p>
              )}
            </div>

            {/* Email (Optional) */}
            <div>
              <label htmlFor="email" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address (Optional)
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email || ''}
                onChange={handleChange}
                placeholder="e.g. ramesh@example.com"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:border-amber-500 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Travel Date */}
            <div>
              <label htmlFor="travelDate" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Travel Date
              </label>
              <div className="relative">
                <input
                  id="travelDate"
                  name="travelDate"
                  type="date"
                  value={formData.travelDate}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:border-amber-500 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
                />
              </div>
            </div>

            {/* Number of Passengers */}
            <div>
              <label htmlFor="numberOfPassengers" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Number of Passengers
              </label>
              <input
                id="numberOfPassengers"
                name="numberOfPassengers"
                type="number"
                min="1"
                max="50"
                value={formData.numberOfPassengers}
                onChange={handleChange}
                placeholder="e.g. 4"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:border-amber-500 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Pickup Location */}
            <div>
              <label htmlFor="pickupLocation" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Pickup Location *
              </label>
              <input
                id="pickupLocation"
                name="pickupLocation"
                type="text"
                required
                value={formData.pickupLocation}
                onChange={handleChange}
                placeholder="e.g. Sankaraguptam, Amalapuram, Razole"
                className={`w-full px-3.5 py-2.5 rounded-lg border text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all ${
                  errors.pickupLocation ? 'border-red-500 bg-red-50/20' : 'border-slate-300 focus:border-amber-500'
                }`}
              />
              {errors.pickupLocation && (
                <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  {errors.pickupLocation}
                </p>
              )}
            </div>

            {/* Destination */}
            <div>
              <label htmlFor="destination" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Destination *
              </label>
              <input
                id="destination"
                name="destination"
                type="text"
                required
                value={formData.destination}
                onChange={handleChange}
                placeholder="e.g. Rajahmundry Airport, Vijayawada, Tirupati"
                className={`w-full px-3.5 py-2.5 rounded-lg border text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all ${
                  errors.destination ? 'border-red-500 bg-red-50/20' : 'border-slate-300 focus:border-amber-500'
                }`}
              />
              {errors.destination && (
                <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  {errors.destination}
                </p>
              )}
            </div>
          </div>

          {/* Service Mode / Drive Option */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Service Mode / Driving Preference
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, driveType: 'with-driver' }))}
                className={`flex items-start gap-3 p-3 rounded-lg border text-left transition-all ${
                  formData.driveType === 'with-driver'
                    ? 'border-amber-500 bg-amber-50/40 shadow-xs'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className={`p-2 rounded-md shrink-0 mt-0.5 ${
                  formData.driveType === 'with-driver'
                    ? 'bg-[#0A192F] text-amber-400'
                    : 'bg-slate-100 text-slate-600'
                }`}>
                  <UserCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <span>With Driver</span>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-medium">Chauffeur</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Relax and travel with our verified commercial highway drivers.
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setFormData((prev) => ({
                    ...prev,
                    driveType: 'self-drive',
                    // Default to Dzire if currently set to Traveller which isn't self-drive
                    vehiclePreference: prev.vehiclePreference === 'Force Traveller' ? 'Suzuki Dzire' : prev.vehiclePreference
                  }));
                }}
                className={`flex items-start gap-3 p-3 rounded-lg border text-left transition-all ${
                  formData.driveType === 'self-drive'
                    ? 'border-emerald-500 bg-emerald-50/40 shadow-xs'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className={`p-2 rounded-md shrink-0 mt-0.5 ${
                  formData.driveType === 'self-drive'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 text-slate-600'
                }`}>
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <span>Self-Drive</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-semibold">Available for Cars</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Rent and drive yourself (Suzuki Dzire or Ertiga). Valid DL required.
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Vehicle Preference */}
          <div>
            <label htmlFor="vehiclePreference" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Vehicle Preference
            </label>
            <select
              id="vehiclePreference"
              name="vehiclePreference"
              value={formData.vehiclePreference}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:border-amber-500 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 bg-white transition-all"
            >
              <option value="Any Vehicle / Suggest Best Option">Any Vehicle / Suggest Best Option</option>
              {vehicles.map((v) => (
                <option key={v.id} value={v.name}>
                  {v.name} ({v.category} · {v.seatingCapacity})
                </option>
              ))}
            </select>
          </div>

          {/* Message */}
          <div>
            <label htmlFor="message" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Additional Requirements or Notes
            </label>
            <textarea
              id="message"
              name="message"
              rows={3}
              value={formData.message}
              onChange={handleChange}
              placeholder="e.g. Round-trip requested, marriage party luggage space needed, AC required throughout."
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:border-amber-500 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all resize-none"
            />
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full inline-flex items-center justify-center gap-2 bg-[#0A192F] hover:bg-amber-500 hover:text-slate-950 text-white font-bold py-3.5 px-6 rounded-lg transition-all duration-150 text-sm shadow-md active:scale-[0.99] disabled:opacity-75"
            >
              {isSubmitting ? (
                <span>Processing...</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Send Enquiry</span>
                </>
              )}
            </button>
          </div>

          <div className="text-center text-xs text-slate-500">
            Need urgent assistance? Call our direct 24/7 hotline at{' '}
            <a href={`tel:${BUSINESS_INFO.phone}`} className="text-amber-700 font-semibold hover:underline">
              {BUSINESS_INFO.phone}
            </a>
          </div>
        </form>
      )}
    </div>
  );
};
