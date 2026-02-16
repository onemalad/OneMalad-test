export type UserRole = 'citizen' | 'corporator' | 'admin';

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

export type IssueStatus = 'pending' | 'in_progress' | 'resolved';
export type IssueCategory =
  | 'drainage'
  | 'roads'
  | 'garbage'
  | 'water'
  | 'electricity'
  | 'sanitation'
  | 'encroachment'
  | 'other';

export interface Issue {
  id: string;
  title: string;
  description: string;
  category: IssueCategory;
  status: IssueStatus;
  wardNumber: number;
  location: string;
  latitude?: number;
  longitude?: number;
  imageUrls: string[];
  userName: string;
  userEmail: string;
  upvotes: number;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  corporatorResponse?: string;
  resolvedImageUrls?: string[];
}

export interface Comment {
  id: string;
  issueId: string;
  userName: string;
  userEmail: string;
  text: string;
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
  achievements: number;
  issuesReceived: number;
  issuesInProgress: number;
  issuesResolved: number;
}

export type EventCategory = 'social' | 'cultural' | 'sports' | 'education' | 'health' | 'other';

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
