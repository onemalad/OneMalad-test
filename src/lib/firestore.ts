import { db } from './firebase';
import {
  collection, doc, getDocs, getDoc, setDoc, addDoc, updateDoc, deleteDoc,
  query, orderBy, where, onSnapshot,
} from 'firebase/firestore';
import { Issue, CommunityEvent } from '@/types';

// Check if Firebase is configured with real values
export const isFirebaseConfigured = () => {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  return !!(apiKey && apiKey !== 'your_api_key_here' && apiKey.length > 10);
};

// --- Issues ---
export function subscribeToIssues(callback: (issues: Issue[]) => void) {
  const q = query(collection(db, 'issues'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const issues = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Issue));
    callback(issues);
  }, (error) => {
    console.error('Firestore issues listener error:', error);
  });
}

export async function createIssueInFirestore(issue: Omit<Issue, 'id'>): Promise<string> {
  const docRef = await addDoc(collection(db, 'issues'), issue);
  return docRef.id;
}

export async function updateIssueInFirestore(id: string, data: Partial<Issue>) {
  await updateDoc(doc(db, 'issues', id), data);
}

export async function deleteIssueFromFirestore(id: string) {
  await deleteDoc(doc(db, 'issues', id));
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
  role: 'citizen' | 'corporator' | 'admin';
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

// --- Community Thoughts ---
export interface Thought {
  id: string;
  userName: string;
  userEmail: string;
  text: string;
  wardNumber?: number;
  createdAt: string;
}

export function subscribeToThoughts(callback: (thoughts: Thought[]) => void) {
  const q = query(collection(db, 'thoughts'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const thoughts = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Thought));
    callback(thoughts);
  }, (error) => {
    console.error('Firestore thoughts listener error:', error);
  });
}

export async function createThoughtInFirestore(thought: Omit<Thought, 'id'>): Promise<string> {
  const docRef = await addDoc(collection(db, 'thoughts'), thought);
  return docRef.id;
}

// --- Ward Updates (Corporator Blog Posts) ---
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
