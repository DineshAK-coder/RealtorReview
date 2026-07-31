import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signInAnonymously, 
  signOut 
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db, handleFirestoreError } from '../lib/firebase';
import { OperationType, UserProfile } from '../types';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInAsGuest: () => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  loading: true,
  signInWithGoogle: async () => {},
  signInAsGuest: async () => {},
  logout: async () => {},
  error: null,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Sync or fetch user profile doc in Firestore
        const userRef = doc(db, 'users', currentUser.uid);
        try {
          const snap = await getDoc(userRef);
          if (snap.exists()) {
            setUserProfile(snap.data() as UserProfile);
          } else {
            const newProfile: UserProfile = {
              uid: currentUser.uid,
              email: currentUser.email || `${currentUser.uid.slice(0, 8)}@guest.local`,
              displayName: currentUser.displayName || (currentUser.isAnonymous ? 'Guest User' : 'User'),
              photoURL: currentUser.photoURL || undefined,
              createdAt: new Date().toISOString(),
            };
            await setDoc(userRef, newProfile);
            setUserProfile(newProfile);
          }
        } catch (err) {
          console.warn('User profile sync note:', err);
          setUserProfile({
            uid: currentUser.uid,
            email: currentUser.email || `${currentUser.uid.slice(0, 8)}@guest.local`,
            displayName: currentUser.displayName || (currentUser.isAnonymous ? 'Guest User' : 'User'),
            photoURL: currentUser.photoURL || undefined,
          });
        }
      } else {
        setUserProfile(null);
        // Attempt seamless guest auth if not signed in
        signInAnonymously(auth).catch((err) => {
          console.warn('Auto guest sign-in note:', err);
        });
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
      console.error('Google Sign In Error:', err);
    }
  };

  const signInAsGuest = async () => {
    setError(null);
    try {
      await signInAnonymously(auth);
    } catch (err: unknown) {
      const errObj = err as { code?: string; message?: string };
      if (errObj?.code === 'auth/admin-restricted-operation' || String(err).includes('admin-restricted-operation')) {
        const customMsg = 'Anonymous sign-in is disabled in Firebase Console for this project. Please sign in using Google.';
        setError(customMsg);
        console.warn('Guest Auth Error (Anonymous Auth disabled in Firebase Console):', err);
      } else {
        const msg = err instanceof Error ? err.message : String(err);
        setError(msg);
        console.error('Guest Auth Error:', err);
      }
    }
  };

  const logout = async () => {
    setError(null);
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Sign Out Error:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        signInWithGoogle,
        signInAsGuest,
        logout,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
