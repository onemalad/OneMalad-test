'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  signOut,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '@/lib/firebase';
import { isFirebaseConfigured } from '@/lib/firestore';
import toast from 'react-hot-toast';

export type UserRole = 'citizen' | 'corporator' | 'admin';

export interface AppUser {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  wardNumber?: number;
}

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, name: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  demoSignIn: (role: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

// Demo accounts for testing without Firebase
const demoAccounts: Record<UserRole, AppUser> = {
  citizen: {
    uid: 'demo-citizen-1',
    email: 'citizen@onemalad.in',
    displayName: 'Rahul Sharma',
    role: 'citizen',
    wardNumber: 32,
  },
  corporator: {
    uid: 'demo-corporator-1',
    email: 'corporator@onemalad.in',
    displayName: 'Geeta Kiran Bhandari',
    role: 'corporator',
    wardNumber: 32,
  },
  admin: {
    uid: 'demo-admin-1',
    email: 'onemaladconnect@gmail.com',
    displayName: 'OneMalad Admin',
    role: 'admin',
  },
};

// Fetch or create Firestore user profile on login
async function getOrCreateProfile(fbUser: FirebaseUser): Promise<AppUser> {
  const userRef = doc(db, 'users', fbUser.uid);
  const snap = await getDoc(userRef);

  if (snap.exists()) {
    const data = snap.data();
    return {
      uid: fbUser.uid,
      email: fbUser.email || '',
      displayName: data.displayName || fbUser.displayName || '',
      role: data.role || 'citizen',
      wardNumber: data.wardNumber,
    };
  }

  // First-time user — create profile in Firestore
  const role: UserRole = fbUser.email === 'onemaladconnect@gmail.com' ? 'admin' : 'citizen';
  const profile = {
    email: fbUser.email || '',
    displayName: fbUser.displayName || '',
    role,
    createdAt: new Date().toISOString(),
  };
  await setDoc(userRef, profile);

  return { uid: fbUser.uid, ...profile };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const firebaseReady = isFirebaseConfigured();

  useEffect(() => {
    if (firebaseReady) {
      // Real Firebase auth listener
      const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
        if (fbUser) {
          try {
            const profile = await getOrCreateProfile(fbUser);
            setUser(profile);
          } catch (err) {
            console.error('Error fetching user profile:', err);
            // Fallback: use Firebase Auth data directly if Firestore fails
            const role: UserRole = fbUser.email === 'onemaladconnect@gmail.com' ? 'admin' : 'citizen';
            setUser({
              uid: fbUser.uid,
              email: fbUser.email || '',
              displayName: fbUser.displayName || fbUser.email?.split('@')[0] || '',
              role,
            });
          }
        } else {
          setUser(null);
        }
        setLoading(false);
      });
      return unsubscribe;
    } else {
      // Demo mode — check localStorage
      const saved = localStorage.getItem('onemalad_user');
      if (saved) {
        try {
          setUser(JSON.parse(saved));
        } catch { /* ignore */ }
      }
      setLoading(false);
    }
  }, [firebaseReady]);

  // --- Auth methods ---

  const handleSignInWithGoogle = async () => {
    if (!firebaseReady) {
      toast.error('Firebase not configured. Use Demo Login below.');
      return;
    }
    try {
      await signInWithPopup(auth, googleProvider);
      toast.success('Signed in with Google!');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Google sign-in failed';
      toast.error(message);
    }
  };

  const handleSignInWithEmail = async (email: string, password: string) => {
    if (!firebaseReady) {
      toast.error('Firebase not configured. Use Demo Login below.');
      return;
    }
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('Signed in successfully!');
    } catch (err: unknown) {
      console.error('Sign-in error:', err);
      const message = err instanceof Error ? err.message : 'Sign-in failed';
      toast.error(message);
      throw err;
    }
  };

  const handleSignUpWithEmail = async (email: string, password: string, name: string) => {
    if (!firebaseReady) {
      toast.error('Firebase not configured. Use Demo Login below.');
      return;
    }
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName: name });
      // Manually build profile since onAuthStateChanged may fire before updateProfile completes
      const role: UserRole = email === 'onemaladconnect@gmail.com' ? 'admin' : 'citizen';
      const profile = {
        email: cred.user.email || '',
        displayName: name,
        role,
        createdAt: new Date().toISOString(),
      };
      await setDoc(doc(db, 'users', cred.user.uid), profile);
      setUser({ uid: cred.user.uid, ...profile });
      toast.success('Account created successfully!');
    } catch (err: unknown) {
      console.error('Sign-up error:', err);
      const message = err instanceof Error ? err.message : 'Sign-up failed';
      toast.error(message);
      throw err;
    }
  };

  const demoSignIn = (role: UserRole) => {
    const account = demoAccounts[role];
    setUser(account);
    localStorage.setItem('onemalad_user', JSON.stringify(account));
    toast.success(
      `Signed in as ${role === 'admin' ? 'Admin' : role === 'corporator' ? 'Corporator' : 'Citizen'}: ${account.displayName}`,
    );
  };

  const handleForgotPassword = async (email: string) => {
    if (!firebaseReady) {
      toast.error('Firebase not configured. Demo mode does not support password reset.');
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success('Password reset email sent! Check your inbox.');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to send reset email';
      toast.error(message);
      throw err;
    }
  };

  const handleLogout = () => {
    if (firebaseReady) {
      signOut(auth);
    }
    setUser(null);
    localStorage.removeItem('onemalad_user');
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signInWithGoogle: handleSignInWithGoogle,
        signInWithEmail: handleSignInWithEmail,
        signUpWithEmail: handleSignUpWithEmail,
        forgotPassword: handleForgotPassword,
        demoSignIn,
        logout: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
