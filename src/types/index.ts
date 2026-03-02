export type UserRole = 'volunteer' | 'admin';

export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: UserRole;
  wardNumber?: number;
  phone?: string;
  createdAt: string;
}

export interface Ward {
  number: number;
  name: string;
  zone: string;
  area: string;
  description: string;
  landmarks: string[];
  population?: number;
  voters?: number;
  image?: string;
}

export interface Corporator {
  id: string;
  name: string;
  party: string;
  wardNumber: number;
  votes: number;
  photo?: string;
  phone?: string;
  email?: string;
  bio?: string;
}

export type ActivityCategory =
  | 'cleanliness_drive'
  | 'health_camp'
  | 'food_distribution'
  | 'education'
  | 'tree_planting'
  | 'blood_donation'
  | 'sports'
  | 'cultural'
  | 'infrastructure'
  | 'other';

export interface Activity {
  id: string;
  title: string;
  description: string;
  category: ActivityCategory;
  date: string;
  location: string;
  wardNumber?: number;
  imageUrls: string[];
  volunteersCount: number;
  beneficiariesCount: number;
  createdAt: string;
}

export interface Volunteer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  wardNumber?: number;
  interests: ActivityCategory[];
  message?: string;
  createdAt: string;
  status: 'pending' | 'active';
}

export interface ImpactStat {
  id: string;
  label: string;
  value: number;
  suffix?: string;
  emoji: string;
  order: number;
}

export interface GalleryImage {
  id: string;
  url: string;
  caption?: string;
  activityId?: string;
  category?: ActivityCategory;
  date: string;
  createdAt: string;
}

export type BusinessCategory =
  | 'restaurant'
  | 'grocery'
  | 'medical'
  | 'education'
  | 'salon'
  | 'electronics'
  | 'clothing'
  | 'hardware'
  | 'services'
  | 'other';

export interface Business {
  id: string;
  name: string;
  category: BusinessCategory;
  description: string;
  address: string;
  wardNumber: number;
  phone?: string;
  whatsapp?: string;
  timing?: string;
  rating?: number;
}

export type HelplineCategory = 'emergency' | 'hospital' | 'police' | 'fire' | 'municipal' | 'women' | 'child' | 'utility' | 'other';

export interface Helpline {
  id: string;
  name: string;
  number: string;
  category: HelplineCategory;
  description?: string;
  available?: string;
}

export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export interface BloodDonor {
  id: string;
  name: string;
  phone: string;
  bloodGroup: BloodGroup;
  wardNumber?: number;
  age?: number;
  lastDonation?: string;
  createdAt: string;
  isAvailable: boolean;
}

export type EventCategory = 'social' | 'cultural' | 'sports' | 'education' | 'health' | 'cleanliness' | 'environment' | 'other';

export interface CommunityEvent {
  id: string;
  title: string;
  description: string;
  category: EventCategory;
  date: string;
  time: string;
  location: string;
  wardNumber?: number;
  organizer: string;
  imageUrl?: string;
  attendees: number;
  isUpcoming: boolean;
}
