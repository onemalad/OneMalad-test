import { db } from './firebase';
import {
  collection, doc, getDocs, getDoc, setDoc, addDoc, updateDoc, deleteDoc,
  query, orderBy, where, onSnapshot,
} from 'firebase/firestore';
import { Activity, CommunityEvent, Volunteer, GalleryImage, ImpactStat } from '@/types';

// Check if Firebase is configured with real values
export const isFirebaseConfigured = () => {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  return !!(apiKey && apiKey !== 'your_api_key_here' && apiKey.length > 10);
};

// --- Activities ---
export function subscribeToActivities(callback: (activities: Activity[]) => void) {
  const q = query(collection(db, 'activities'), orderBy('date', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const activities = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Activity));
    callback(activities);
  }, (error) => {
    console.error('Firestore activities listener error:', error);
  });
}

export async function createActivityInFirestore(activity: Omit<Activity, 'id'>): Promise<string> {
  const docRef = await addDoc(collection(db, 'activities'), activity);
  return docRef.id;
}

export async function deleteActivityFromFirestore(id: string) {
  await deleteDoc(doc(db, 'activities', id));
}

// --- Events ---
export function subscribeToEvents(callback: (events: CommunityEvent[]) => void) {
  const q = query(collection(db, 'events'), orderBy('date', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const events = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as CommunityEvent));
    callback(events);
  }, (error) => {
    console.error('Firestore events listener error:', error);
  });
}

export async function createEventInFirestore(event: Omit<CommunityEvent, 'id'>): Promise<string> {
  const docRef = await addDoc(collection(db, 'events'), event);
  return docRef.id;
}

export async function deleteEventFromFirestore(id: string) {
  await deleteDoc(doc(db, 'events', id));
}

// --- User Profiles ---
export interface UserProfile {
  email: string;
  displayName: string;
  role: 'volunteer' | 'admin';
  wardNumber?: number;
  createdAt: string;
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? (snap.data() as UserProfile) : null;
}

export async function setUserProfile(uid: string, profile: UserProfile) {
  await setDoc(doc(db, 'users', uid), profile);
}

export async function updateUserRole(uid: string, role: string, wardNumber?: number) {
  const data: Record<string, unknown> = { role };
  if (wardNumber !== undefined) data.wardNumber = wardNumber;
  await updateDoc(doc(db, 'users', uid), data);
}

// --- Banners ---
export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  placement: 'hero' | 'sidebar' | 'inline' | 'footer';
  bgGradient: string;
  active: boolean;
  imageUrl?: string;
}

export function subscribeToBanners(callback: (banners: Banner[]) => void) {
  return onSnapshot(collection(db, 'banners'), (snapshot) => {
    const banners = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Banner));
    callback(banners);
  }, (error) => {
    console.error('Firestore banners listener error:', error);
  });
}

export async function createBannerInFirestore(banner: Omit<Banner, 'id'>): Promise<string> {
  const docRef = await addDoc(collection(db, 'banners'), banner);
  return docRef.id;
}

export async function updateBannerInFirestore(id: string, data: Partial<Banner>) {
  await updateDoc(doc(db, 'banners', id), data);
}

export async function deleteBannerFromFirestore(id: string) {
  await deleteDoc(doc(db, 'banners', id));
}

// --- Volunteers ---
export function subscribeToVolunteers(callback: (volunteers: Volunteer[]) => void) {
  const q = query(collection(db, 'volunteers'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const volunteers = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Volunteer));
    callback(volunteers);
  }, (error) => {
    console.error('Firestore volunteers listener error:', error);
  });
}

export async function createVolunteerInFirestore(volunteer: Omit<Volunteer, 'id'>): Promise<string> {
  const docRef = await addDoc(collection(db, 'volunteers'), volunteer);
  return docRef.id;
}

export async function updateVolunteerInFirestore(id: string, data: Partial<Volunteer>) {
  await updateDoc(doc(db, 'volunteers', id), data);
}

// --- Gallery ---
export function subscribeToGallery(callback: (images: GalleryImage[]) => void) {
  const q = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const images = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as GalleryImage));
    callback(images);
  }, (error) => {
    console.error('Firestore gallery listener error:', error);
  });
}

export async function createGalleryImageInFirestore(image: Omit<GalleryImage, 'id'>): Promise<string> {
  const docRef = await addDoc(collection(db, 'gallery'), image);
  return docRef.id;
}

export async function deleteGalleryImageFromFirestore(id: string) {
  await deleteDoc(doc(db, 'gallery', id));
}

// --- Corporator Support ("I Support" feature) ---
export async function toggleSupport(wardNumber: number, userId: string): Promise<boolean> {
  const supportId = `${wardNumber}_${userId}`;
  const ref = doc(db, 'supports', supportId);
  const snap = await getDoc(ref);
  if (snap.exists()) {
    await deleteDoc(ref);
    return false;
  } else {
    await setDoc(ref, { wardNumber, userId, createdAt: new Date().toISOString() });
    return true;
  }
}

export function subscribeToSupportCount(wardNumber: number, callback: (count: number) => void) {
  const q = query(collection(db, 'supports'), where('wardNumber', '==', wardNumber));
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.size);
  });
}

export async function hasUserSupported(wardNumber: number, userId: string): Promise<boolean> {
  const supportId = `${wardNumber}_${userId}`;
  const snap = await getDoc(doc(db, 'supports', supportId));
  return snap.exists();
}

// --- Ward Updates ---
export interface WardUpdate {
  id: string;
  wardNumber: number;
  corporatorName: string;
  title: string;
  content: string;
  imageUrls: string[];
  createdAt: string;
}

export function subscribeToWardUpdates(callback: (updates: WardUpdate[]) => void) {
  const q = query(collection(db, 'wardUpdates'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const updates = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as WardUpdate));
    callback(updates);
  }, (error) => {
    console.error('Firestore ward updates listener error:', error);
  });
}

export async function createWardUpdateInFirestore(update: Omit<WardUpdate, 'id'>): Promise<string> {
  const docRef = await addDoc(collection(db, 'wardUpdates'), update);
  return docRef.id;
}

export async function deleteWardUpdateFromFirestore(id: string) {
  await deleteDoc(doc(db, 'wardUpdates', id));
}
