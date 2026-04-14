import React, { createContext, useState, useCallback, useEffect } from 'react';
import type { User, AuthSession, UserRole } from '../types';
import {
  get, set, remove, KEYS, generateId,
  getUsers, saveUsers, getProfiles, saveProfiles,
} from '../utils/storage';
import type { CleanerProfile } from '../types';

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  location: string;
  role: UserRole;
}

interface AuthContextType {
  currentUser: User | null;
  session: AuthSession | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (data: RegisterData) => Promise<User>;
  logout: () => void;
  updateCurrentUser: (updates: Partial<User>) => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedSession = get<AuthSession>(KEYS.session);
    if (savedSession) {
      const users = getUsers();
      const user = users.find(u => u.id === savedSession.userId) ?? null;
      setSession(savedSession);
      setCurrentUser(user);
    }
    setIsLoading(false);
  }, []);

  const login = useCallback((email: string, password: string): Promise<User> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = getUsers();
        const user = users.find(
          u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
        );
        if (!user) {
          reject(new Error('Invalid email or password'));
          return;
        }
        const newSession: AuthSession = {
          userId: user.id,
          role: user.role,
          token: generateId(),
        };
        set(KEYS.session, newSession);
        setSession(newSession);
        setCurrentUser(user);
        resolve(user);
      }, 400);
    });
  }, []);

  const register = useCallback((data: RegisterData): Promise<User> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = getUsers();
        if (users.some(u => u.email.toLowerCase() === data.email.toLowerCase())) {
          reject(new Error('An account with this email already exists'));
          return;
        }
        const newUser: User = {
          id: `user-${generateId()}`,
          email: data.email,
          password: data.password,
          role: data.role,
          firstName: data.firstName,
          lastName: data.lastName,
          avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.firstName}${data.lastName}`,
          location: data.location,
          createdAt: new Date().toISOString(),
        };
        saveUsers([...users, newUser]);

        if (data.role === 'cleaner') {
          const profiles = getProfiles();
          const blankProfile: CleanerProfile = {
            userId: newUser.id,
            bio: '',
            yearsExperience: 0,
            servicesOffered: [
              { type: 'regular', label: 'Regular Cleaning', durationHours: 2, basePrice: 8000 },
            ],
            hourlyRate: 4000,
            availability: {
              mon: { start: '09:00', end: '17:00' },
              tue: { start: '09:00', end: '17:00' },
              wed: { start: '09:00', end: '17:00' },
              thu: { start: '09:00', end: '17:00' },
              fri: { start: '09:00', end: '17:00' },
            },
            coverageAreaMiles: 15,
            languages: ['English'],
            insuranceCertified: false,
            backgroundChecked: false,
            averageRating: 0,
            totalReviews: 0,
            totalJobsCompleted: 0,
            badges: [],
          };
          saveProfiles([...profiles, blankProfile]);
        }

        const newSession: AuthSession = {
          userId: newUser.id,
          role: newUser.role,
          token: generateId(),
        };
        set(KEYS.session, newSession);
        setSession(newSession);
        setCurrentUser(newUser);
        resolve(newUser);
      }, 400);
    });
  }, []);

  const logout = useCallback(() => {
    remove(KEYS.session);
    setSession(null);
    setCurrentUser(null);
  }, []);

  const updateCurrentUser = useCallback((updates: Partial<User>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updates };
    const users = getUsers();
    saveUsers(users.map(u => (u.id === updated.id ? updated : u)));
    setCurrentUser(updated);
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, session, isLoading, login, register, logout, updateCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
}
