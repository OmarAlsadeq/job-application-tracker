'use client';

import { createContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';

interface AuthContextProps {
  user: User | null;
  role: 'user' | 'admin' | null; // Include role in the context
  isRoleLoading: boolean;
}

export const AuthContext = createContext<AuthContextProps>({
  user: null, role: null,
  isRoleLoading: false
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<'user' | 'admin' | null>(null); // Add state for role
  const [isRoleLoading, setIsRoleLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        setIsRoleLoading(true);
        try {
          const token = await user.getIdToken();
          const response = await fetch(`/api/users/${user.uid}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          if (response.ok) {
            const data = await response.json();
            setRole(data.role);
          } else {
            console.error('Failed to fetch user role:', response.statusText);
            setRole(null);
          }
        } catch (error) {
          console.error('Error fetching user role:', error);
          setRole(null);
        } finally {
          setIsRoleLoading(false);
        }
      } else {
        setUser(null);
        setRole(null);
        setIsRoleLoading(false);
      }
    });
  
    return () => unsubscribe();
  }, []);
  
  return (
    <AuthContext.Provider value={{ user, role, isRoleLoading }}>
  {isRoleLoading ? <p>Loading...</p> : children}
    </AuthContext.Provider>
  )};