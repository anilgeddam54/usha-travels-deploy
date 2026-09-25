export interface Vehicle {
  id: string;
  name: string;
  category: 'Sedan' | 'MUV / MPV' | 'Minibus / Traveller' | 'SUV';
  seatingCapacity: string;
  luggageCapacity: string;
  acType: string;
  shortDescription: string;
  fullDescription: string;
  features: string[];
  idealFor: string[];
  image: string;
  tag?: string;
  color?: string;
  selfDriveAvailable?: boolean;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  iconName: 'Compass' | 'MapPin' | 'Plane' | 'Users' | 'Calendar' | 'Clock' | 'ShieldCheck' | 'Car' | 'KeyRound';
  features: string[];
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'Vehicles' | 'Journeys' | 'Godavari Region';
  image: string;
  caption: string;
}

export interface EnquiryFormData {
  name: string;
  phone: string;
  email?: string;
  travelDate: string;
  pickupLocation: string;
  destination: string;
  vehiclePreference: string;
  driveType: 'with-driver' | 'self-drive';
  numberOfPassengers: string;
  message: string;
}

export interface ContactDetails {
  companyName: string;
  phone: string;
  displayPhone: string;
  service: string;
  location: string;
  tagline: string;
  address: string;
  whatsappNumber: string;
}
