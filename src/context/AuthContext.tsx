import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { useToast } from './ToastContext';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAdmin: boolean;
  isInstructor: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  register: (name: string, email: string, phone: string, pass: string, role?: 'STUDENT' | 'INSTRUCTOR', headline?: string) => Promise<boolean>;
  demoLogin: (role: 'admin' | 'student' | 'instructor') => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<boolean>;
  refreshMe: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('skillnest_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { success, error } = useToast();

  const fetchMe = async (authToken: string) => {
    try {
      const res = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        localStorage.removeItem('skillnest_token');
        setToken(null);
        setUser(null);
      }
    } catch (err) {
      console.error('Failed to fetch current user', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchMe(token);
    } else {
      // Auto-seed with default student for seamless immediate browsing
      demoLogin('student').finally(() => setIsLoading(false));
    }
  }, []);

  const login = async (email: string, pass: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass })
      });
      const data = await res.json();
      if (!res.ok) {
        error(data.error || 'লগইন ব্যর্থ হয়েছে');
        return false;
      }
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('skillnest_token', data.token);
      success(`স্বাগতম, ${data.user.name}!`);
      return true;
    } catch (err) {
      error('সার্ভারে যোগাযোগ করতে সমস্যা হয়েছে');
      return false;
    }
  };

  const isAdmin = user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN';
  const isInstructor = user?.role === 'INSTRUCTOR';

  const register = async (name: string, email: string, phone: string, pass: string, role?: 'STUDENT' | 'INSTRUCTOR', headline?: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, password: pass, role, headline })
      });
      const data = await res.json();
      if (!res.ok) {
        error(data.error || 'রেজিস্ট্রেশন সম্পন্ন করা যায়নি');
        return false;
      }
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('skillnest_token', data.token);
      success(role === 'INSTRUCTOR' ? 'শিক্ষক অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে!' : 'অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে!');
      return true;
    } catch (err) {
      error('সার্ভারে যোগাযোগ করতে সমস্যা হয়েছে');
      return false;
    }
  };

  const demoLogin = async (role: 'admin' | 'student' | 'instructor'): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/demo-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role })
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem('skillnest_token', data.token);
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('skillnest_token');
    success('সফলভাবে লগআউট হয়েছে');
  };

  const updateProfile = async (data: Partial<User>): Promise<boolean> => {
    if (!token) return false;
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });
      const resData = await res.json();
      if (res.ok) {
        setUser(resData.user);
        success('প্রোফাইল আপডেট হয়েছে');
        return true;
      } else {
        error(resData.error || 'প্রোফাইল আপডেট করা যায়নি');
        return false;
      }
    } catch (err) {
      error('সার্ভারে সমস্যা হয়েছে');
      return false;
    }
  };

  const refreshMe = async () => {
    if (token) await fetchMe(token);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAdmin,
        isInstructor,
        login,
        register,
        demoLogin,
        logout,
        updateProfile,
        refreshMe
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
