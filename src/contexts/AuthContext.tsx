import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  deleteUser
} from 'firebase/auth';
import { doc, getDoc, deleteDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

interface AuthContextType {
  user: FirebaseUser | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  deleteAccount: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const adminDoc = await getDoc(doc(db, 'admins', result.user.email || ''));
      
      if (!adminDoc.exists()) {
        await signOut(auth);
        setError('Unauthorized access. Please contact the administrator.');
        throw new Error('Unauthorized access');
      }
    } catch (err) {
      console.error('Login error:', err);
      throw err;
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  const deleteAccount = async () => {
    if (!user) return;

    try {
      // Delete all posts by the user
      const postsQuery = query(collection(db, 'posts'), where('authorId', '==', user.email));
      const postsSnapshot = await getDocs(postsQuery);
      
      const deletions = postsSnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletions);

      // Delete admin document
      if (user.email) {
        await deleteDoc(doc(db, 'admins', user.email));
      }

      // Delete user account
      await deleteUser(user);
    } catch (error) {
      console.error('Error deleting account:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, deleteAccount, loading, error }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}