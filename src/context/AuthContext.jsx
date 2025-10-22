import React, { createContext, useState, useContext, useEffect } from 'react';
import { getCurrentUser, loginUser, logoutUser, signupUser, updateUser as svcUpdateUser } from '@/services/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setUser(getCurrentUser());
    setReady(true);
  }, []);

  const login = (creds) => {
    const u = loginUser(creds);
    setUser({ id: u.id, name: u.name, email: u.email, role: u.role });
  };

  const signup = (data) => {
    const u = signupUser(data);
    setUser({ id: u.id, name: u.name, email: u.email, role: u.role });
  };

  const updateUser = (updates) => {
    if (!user) return null;
    const updated = svcUpdateUser(user.id, updates);
    setUser({ ...user, ...updates });
    return updated;
  };

  const logout = () => {
    logoutUser();
    setUser(null);
  };

  const value = { user, ready, login, signup, logout, updateUser };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
