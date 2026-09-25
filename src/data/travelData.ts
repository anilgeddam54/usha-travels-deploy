import { ContactDetails, GalleryItem, ServiceItem, Vehicle } from '../types/travel';

// Real vehicle imagery
import heroHighwayImg from '../assets/images/hero_travel_highway_1790244246330.jpg';
import forceTravellerImg from '../assets/images/real_force_traveller_1790245413463.jpg';
import suzukiDzireImg from '../assets/images/real_dzire.jpg';
import marutiErtigaImg from '../assets/images/real_ertiga.jpg';
import scenicJourneyImg from '../assets/images/scenic_highway_journey_1790244316128.jpg';

export const BUSINESS_INFO: ContactDetails = {
  companyName: 'USHA TRAVELS',
  phone: '9948953702',
  displayPhone: '+91 99489 53702',
  service: '24/7 Service',
  location: 'Sankaraguptam',
  tagline: 'Safe Journey • Happy Journey',
  address: 'Sankaraguptam, East Godavari / Konaseema, Andhra Pradesh, India',
  whatsappNumber: '919948953702',
};

export const VEHICLES_DATA: Vehicle[] = [
  {
    id: 'force-traveller',
    name: 'Force Traveller',
    category: 'Minibus / Traveller',
    seatingCapacity: '12 to 26 Seater Options',
    luggageCapacity: 'Ample Carrier & Boot Space',
    acType: 'High-Capacity Multi-Vent Air Conditioning',
    shortDescription: 'The ultimate group travel choice for pilgrimage trips, family functions, weddings, and long-distance outstation tours with pushback comfort.',
    fullDescription: 'Our Force Traveller fleet represents the gold standard for Indian group journeys. Designed with luxury pushback recliner seats, generous legroom, individual AC vents, and dedicated overhead luggage racks. Whether visiting Tirupati, Bhadrachalam, or organizing wedding family transit, the Force Traveller ensures everyone travels together in safety and utmost comfort.',
    features: [
      'Luxury Reclining Push-back Seats',
      'Dual Roof-Mounted Powerful AC',
      'Spacious Rear Luggage Carrier & Boot',
      'Music System & Mobile Charging Ports',
      'Experienced Long-Haul Highway Drivers',
      'First Aid Kit & Emergency Equipment'
    ],
    idealFor: [
      'Family Pilgrimages & Temple Tours',
      'Wedding Guest Transportation',
      'Corporate Team Outings',
      'Large Group Outstation Journeys'
    ],
    image: forceTravellerImg,
    tag: 'Group Travel Specialist',
    color: 'Pristine White',
    selfDriveAvailable: false
  },
  {
    id: 'suzuki-dzire',
    name: 'Suzuki Dzire',
    category: 'Sedan',
    seatingCapacity: '4 + 1 Passengers',
    luggageCapacity: '380L Boot Space (3-4 Medium Bags)',
    acType: 'Automatic Climate Control AC',
    shortDescription: 'Sophisticated, fuel-efficient sedan in pristine pearl white. Available for self-drive or with professional chauffeur for business trips, airport pick-and-drops, and small families.',
    fullDescription: 'The Maruti Suzuki Dzire is India’s most trusted executive sedan. Available for both Self-Drive and Chauffeur-Driven rentals. Finished in elegant Pearl Arctic White, meticulously sanitised, quiet, and equipped with plush cushioned seating and balanced suspension. Ideal for punctual airport commutes to Rajahmundry or Vijayawada, business executive travel, or independent self-drive weekend trips with family.',
    features: [
      'Self-Drive Available (Simple KYC & Valid DL)',
      'Option for Chauffeur-Driven Service',
      'Pristine White Exterior Fleet',
      'Plush Cushioned Fabric Seating',
      'Rear AC Vents with Quick Cooling',
      'Generous Trunk for Suitcases',
      'Smooth Highway Ride & High Mileage',
      'Clean Sanitized Cabin on Every Trip',
      'Punctual On-Time Pickup Guarantee'
    ],
    idealFor: [
      'Self-Drive Outstation & City Commutes',
      'Airport & Railway Station Transfers',
      'Executive & Business Commutes',
      'Small Family Outstation Trips',
      'Local City & Intercity Travel'
    ],
    image: suzukiDzireImg,
    tag: 'Executive Choice',
    color: 'Pearl Arctic White',
    selfDriveAvailable: true
  },
  {
    id: 'maruti-ertiga',
    name: 'Maruti Suzuki Ertiga',
    category: 'MUV / MPV',
    seatingCapacity: '6 + 1 Passengers',
    luggageCapacity: 'Flexible Foldable Third-Row Luggage',
    acType: 'Dual Zone AC with Roof Blower',
    shortDescription: 'Versatile and spacious 7-seater multi-utility vehicle in pristine pearl white. Available for self-drive or with driver for family vacations and outstation getaways.',
    fullDescription: 'The Maruti Suzuki Ertiga in pristine Pearl White is available for both Self-Drive and Chauffeur-Driven bookings. Combining the comfort of a passenger car with the spacious versatility of a 7-seater MPV. With flexible seating arrangements, dedicated roof-mounted blowers for 2nd and 3rd row passengers, and generous legroom, it provides effortless long-distance touring across Andhra Pradesh and neighbouring states.',
    features: [
      'Self-Drive Available for Family Vacations',
      'Option for Experienced Highway Driver',
      'Pristine White Exterior Fleet',
      'Flexible 7-Seater Interior Configuration',
      'Dedicated 2nd & 3rd Row Roof AC Vents',
      'Smooth NVH Insulation for Silent Ride',
      'High Ground Clearance for Indian Roads',
      'USB Charging Ports & Cupholders',
      'Clean Sanitized Cabin on Every Trip'
    ],
    idealFor: [
      'Self-Drive Family Holiday Road Trips',
      'Medium Family Vacations',
      'Weekend Outstation Getaways',
      'Temple & Heritage Circuit Trips',
      'Railway Station & Airport Pickups'
    ],
    image: marutiErtigaImg,
    tag: 'Family Favorite',
    color: 'Pearl Arctic White',
    selfDriveAvailable: true
  }
];

export const SERVICES_DATA: ServiceItem[] = [
  {
    id: 'self-drive',
    title: 'Self-Drive Car Rentals',
    description: 'Enjoy complete freedom and privacy. Rent our pristine white Suzuki Dzire or Maruti Suzuki Ertiga for personal driving with simple documentation.',
    iconName: 'KeyRound',
    features: ['Flexible Daily & Weekly Plans', 'Doorstep Delivery Available', 'Minimal Document Verification']
  },
  {
    id: 'local-travel',
    title: 'Local Travel',
    description: 'Dependable and punctual point-to-point transportation within Sankaraguptam and surrounding Godavari towns and villages.',
    iconName: 'MapPin',
    features: ['Hourly & Daily Packages', 'Doorstep Pickup & Drop', 'Fixed Honest Pricing']
  },
  {
    id: 'outstation-travel',
    title: 'Outstation Travel',
    description: 'Smooth inter-city and inter-state highway journeys across Andhra Pradesh, Telangana, Tamil Nadu, and Karnataka.',
    iconName: 'Compass',
    features: ['Well-Maintained Highway Fleet', 'Kilometer & Package Plans', 'Experienced Highway Drivers']
  },
  {
    id: 'airport-railway-transfers',
    title: 'Airport / Railway Transfers',
    description: 'Punctual 24/7 transfers to Rajahmundry Airport (RJA), Vijayawada Airport (VGA), Samalkot, and Kakinada railway stations.',
    iconName: 'Plane',
    features: ['Flight Tracking & On-Time Arrival', 'Luggage Assistance', 'Midnight & Early Morning Pickups']
  },
  {
    id: 'family-trips',
    title: 'Family Trips',
    description: 'Comfortable leisure and sightseeing travel designed with elder-friendly seating, child safety, and periodic refreshment stops.',
    iconName: 'Users',
    features: ['Spacious Cabin Space', 'Comfortable Suspension', 'Flexible Itinerary Halts']
  },
  {
    id: 'group-travel',
    title: 'Group Travel',
    description: 'Specialized passenger transport for pilgrimage Yatras, spiritual tours, educational excursions, and sports teams.',
    iconName: 'Users',
    features: ['Force Traveller Fleet', 'High Passenger Capacity', 'Unified Group Coordination']
  },
  {
    id: 'event-transportation',
    title: 'Event Transportation',
    description: 'End-to-end guest logistics for marriage celebrations, receptions, political events, and corporate gatherings.',
    iconName: 'Calendar',
    features: ['Multi-Vehicle Coordination', 'Guest Reception Support', 'Reliable Scheduled Convoys']
  },
  {
    id: 'custom-travel-requirements',
    title: 'Custom Travel Requirements',
    description: 'Tailored multi-day tour packages, temple darshan circuits (Dwaraka Tirumala, Annavaram, Antarvedi), and customized itineraries.',
    iconName: 'Car',
    features: ['Custom Route Planning', 'Personalized Halts & Stays', 'Transparent Billing']
  },
  {
    id: '24-7-passenger-service',
    title: '24/7 Passenger Service',
    description: 'Round-the-clock emergency travel and prompt dispatch whenever you require immediate, reliable transit assistance.',
    iconName: 'Clock',
    features: ['Always-On Hotline Support', 'Rapid Response Dispatch', 'Zero Late-Night Cancellations']
  }
];

export const WHY_CHOOSE_US_DATA = [
  {
    id: 'passenger-safety',
    title: 'Passenger Safety',
    description: 'Our top priority. Every vehicle undergoes routine mechanical audits, speed-governor checks, tyre condition inspections, and carries verified safety kits.',
    stat: '100% Verified Drivers'
  },
  {
    id: 'clean-comfortable',
    title: 'Clean & Comfortable Vehicles',
    description: 'Deep-cleaned, sanitized cabins before every departure. Chilled air conditioning, odorless interiors, and ergonomic pushback seating.',
    stat: 'Pristine Cabins'
  },
  {
    id: 'reliable-service',
    title: 'Reliable Service',
    description: 'Zero last-minute cancellations. Once booked, our vehicle arrives on time at your pickup address, guaranteed.',
    stat: 'Punctual Dispatch'
  },
  {
    id: '24-7-availability',
    title: '24/7 Availability',
    description: 'Available day and night. Connect with us at 9948953702 for immediate bookings, midnight emergency travel, or future schedule planning.',
    stat: '365 Days a Year'
  },
  {
    id: 'easy-booking-enquiry',
    title: 'Easy Booking Enquiry',
    description: 'Simple phone call, WhatsApp enquiry, or one-minute online booking. Transparent quotes without hidden surprises or surge charges.',
    stat: 'Direct WhatsApp & Phone'
  },
  {
    id: 'customer-focused-service',
    title: 'Customer-Focused Service',
    description: 'Courteous, polite, and patient commercial drivers who prioritize the passenger’s ease, safe driving speeds, and seamless trip experience.',
    stat: 'Thousands of Happy Journeys'
  }
];

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'g1',
    title: 'Force Traveller Luxury Fleet',
    category: 'Vehicles',
    image: forceTravellerImg,
    caption: 'Clean, modern Force Traveller minibus ready for group outstation tours.'
  },
  {
    id: 'g2',
    title: 'Suzuki Dzire Compact Sedan',
    category: 'Vehicles',
    image: suzukiDzireImg,
    caption: 'Premium white sedan tailored for executive travel and airport transfers.'
  },
  {
    id: 'g3',
    title: 'Maruti Suzuki Ertiga 7-Seater',
    category: 'Vehicles',
    image: marutiErtigaImg,
    caption: 'Spacious 7-seater MUV equipped for comfortable family holidays.'
  },
  {
    id: 'g4',
    title: 'Scenic Highway & Godavari Journeys',
    category: 'Journeys',
    image: scenicJourneyImg,
    caption: 'Comfortable long-haul tours through Andhra Pradesh and scenic coastal routes.'
  },
  {
    id: 'g5',
    title: 'Highway Transport Excellence',
    category: 'Godavari Region',
    image: heroHighwayImg,
    caption: 'Smooth morning journeys connecting Sankaraguptam with state highways.'
  }
];

export { heroHighwayImg };
