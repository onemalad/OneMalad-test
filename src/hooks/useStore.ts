import { create } from 'zustand';
import { Activity, CommunityEvent, ImpactStat } from '@/types';
import { sampleActivities, sampleEvents, impactStats as defaultImpactStats } from '@/data/activities';
import {
  isFirebaseConfigured,
  subscribeToActivities,
  subscribeToEvents,
  createActivityInFirestore,
  deleteActivityFromFirestore,
  createEventInFirestore,
  deleteEventFromFirestore,
} from '@/lib/firestore';

interface StoreState {
  activities: Activity[];
  events: CommunityEvent[];
  impactStats: ImpactStat[];
  firestoreReady: boolean;

  // Internal setters for Firestore sync
  _setActivities: (activities: Activity[]) => void;
  _setEvents: (events: CommunityEvent[]) => void;
  _setImpactStats: (stats: ImpactStat[]) => void;
  _setFirestoreReady: (ready: boolean) => void;

  // Public actions
  addActivity: (activity: Activity) => void;
  deleteActivity: (id: string) => void;
  addEvent: (event: CommunityEvent) => void;
  deleteEvent: (id: string) => void;
}

export const useStore = create<StoreState>((set) => ({
  // Start with sample data; Firestore will override when connected
  activities: sampleActivities,
  events: sampleEvents,
  impactStats: defaultImpactStats,
  firestoreReady: false,

  _setActivities: (activities) => set({ activities }),
  _setEvents: (events) => set({ events }),
  _setImpactStats: (stats) => set({ impactStats: stats }),
  _setFirestoreReady: (ready) => set({ firestoreReady: ready }),

  addActivity: (activity) => {
    if (isFirebaseConfigured()) {
      const { id, ...data } = activity;
      createActivityInFirestore(data).catch(console.error);
    } else {
      set((state) => ({ activities: [activity, ...state.activities] }));
    }
  },

  deleteActivity: (id) => {
    if (isFirebaseConfigured()) {
      deleteActivityFromFirestore(id).catch(console.error);
    } else {
      set((state) => ({ activities: state.activities.filter((a) => a.id !== id) }));
    }
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

  const unsubActivities = subscribeToActivities((activities) => {
    useStore.getState()._setActivities(activities);
  });

  const unsubEvents = subscribeToEvents((events) => {
    useStore.getState()._setEvents(events);
  });

  return () => {
    unsubActivities();
    unsubEvents();
    _initialized = false;
  };
}
