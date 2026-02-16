import { create } from 'zustand';
import { Issue, CommunityEvent } from '@/types';
import { sampleIssues, sampleEvents } from '@/data/issues';
import {
  isFirebaseConfigured,
  subscribeToIssues,
  subscribeToEvents,
  createIssueInFirestore,
  updateIssueInFirestore,
  deleteIssueFromFirestore,
  createEventInFirestore,
  deleteEventFromFirestore,
} from '@/lib/firestore';

interface StoreState {
  issues: Issue[];
  events: CommunityEvent[];
  firestoreReady: boolean;

  // Internal setters for Firestore sync
  _setIssues: (issues: Issue[]) => void;
  _setEvents: (events: CommunityEvent[]) => void;
  _setFirestoreReady: (ready: boolean) => void;

  // Public actions
  addIssue: (issue: Issue) => void;
  updateIssueStatus: (id: string, status: Issue['status'], response?: string) => void;
  deleteIssue: (id: string) => void;
  upvoteIssue: (id: string) => void;
  addEvent: (event: CommunityEvent) => void;
  deleteEvent: (id: string) => void;
}

export const useStore = create<StoreState>((set, get) => ({
  // Start with sample data; Firestore will override when connected
  issues: sampleIssues,
  events: sampleEvents,
  firestoreReady: false,

  _setIssues: (issues) => set({ issues }),
  _setEvents: (events) => set({ events }),
  _setFirestoreReady: (ready) => set({ firestoreReady: ready }),

  addIssue: (issue) => {
    if (isFirebaseConfigured()) {
      const { id, ...data } = issue;
      createIssueInFirestore(data).catch(console.error);
      // Real-time listener will update local state
    } else {
      set((state) => ({ issues: [issue, ...state.issues] }));
    }
  },

  updateIssueStatus: (id, status, response) => {
    const data: Record<string, unknown> = {
      status,
      updatedAt: new Date().toISOString(),
    };
    if (response) data.corporatorResponse = response;
    if (status === 'resolved') data.resolvedAt = new Date().toISOString();

    if (isFirebaseConfigured()) {
      updateIssueInFirestore(id, data as Partial<Issue>).catch(console.error);
    } else {
      set((state) => ({
        issues: state.issues.map((i) => (i.id === id ? { ...i, ...(data as Partial<Issue>) } : i)),
      }));
    }
  },

  deleteIssue: (id) => {
    if (isFirebaseConfigured()) {
      deleteIssueFromFirestore(id).catch(console.error);
    } else {
      set((state) => ({ issues: state.issues.filter((i) => i.id !== id) }));
    }
  },

  upvoteIssue: (id) => {
    const current = get().issues.find((i) => i.id === id);
    const newCount = (current?.upvotes || 0) + 1;
    if (isFirebaseConfigured()) {
      updateIssueInFirestore(id, { upvotes: newCount } as Partial<Issue>).catch(console.error);
    }
    // Optimistic update for both modes
    set((state) => ({
      issues: state.issues.map((i) => (i.id === id ? { ...i, upvotes: newCount } : i)),
    }));
  },

  addEvent: (event) => {
    if (isFirebaseConfigured()) {
      const { id, ...data } = event;
      createEventInFirestore(data).catch(console.error);
    } else {
      set((state) => ({ events: [event, ...state.events] }));
    }
  },

  deleteEvent: (id) => {
    if (isFirebaseConfigured()) {
      deleteEventFromFirestore(id).catch(console.error);
    } else {
      set((state) => ({ events: state.events.filter((e) => e.id !== id) }));
    }
  },
}));

// Initialize Firestore real-time listeners (call once from a component)
let _initialized = false;
export function initFirestoreSync(): () => void {
  if (!isFirebaseConfigured() || _initialized) return () => {};
  _initialized = true;

  const store = useStore.getState();
  store._setFirestoreReady(true);

  const unsubIssues = subscribeToIssues((issues) => {
    useStore.getState()._setIssues(issues);
  });

  const unsubEvents = subscribeToEvents((events) => {
    useStore.getState()._setEvents(events);
  });

  return () => {
    unsubIssues();
    unsubEvents();
    _initialized = false;
  };
}
