import React, { createContext, useState, useCallback, useEffect } from "react";
import {
  getToken,
  removeToken,
  setToken,
  getUser,
  setUser,
  removeUser,
  getUserType,
  setUserType,
} from "../utils/storage";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUserState] = useState(null);
  const [token, setTokenState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize from localStorage on mount
  useEffect(() => {
    const storedToken = getToken();
    const storedUser = getUser();
    if (storedToken && storedUser) {
      setTokenState(storedToken);
      setUserState(storedUser);
    }
    setLoading(false);
  }, []);

  const login = useCallback((userData, authToken, userType) => {
    setToken(authToken);
    setTokenState(authToken);

    setUser(userData);
    setUserState(userData);

    setUserType(userType); // 'rider' or 'captain'

    setError(null);
  }, []);

  const logout = useCallback(() => {
    removeToken();
    removeUser();
    removeUser(); // Clear userType as well
    setTokenState(null);
    setUserState(null);
    setError(null);
  }, []);

  const updateUser = useCallback(
    (updatedData) => {
      const updated = { ...user, ...updatedData };
      setUser(updated);
      setUserState(updated);
    },
    [user],
  );

  const isAuthenticated = Boolean(token && user);
  const isRider = user?.role === "rider";
  const isCaptain = user?.role === "captain";
  const isAdmin = user?.role === "admin";

  const value = {
    user,
    token,
    loading,
    error,
    login,
    logout,
    updateUser,
    isAuthenticated,
    isRider,
    isCaptain,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
