"use client";

import { useState, useEffect, useCallback } from "react";

const LOCAL_STORAGE_KEY = "authToken";

export const useAdminToken = () => {
  const [token, setTokenState] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // 確保只在客戶端執行
    const storedToken = localStorage.getItem(LOCAL_STORAGE_KEY);
    setTimeout(() => {
      setTokenState(storedToken);
      setIsLoaded(true);
    }, 0);
  }, []);

  const setToken = useCallback((newToken: string) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, newToken);
    setTokenState(newToken);
  }, []);

  const removeToken = useCallback(() => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setTokenState(null);
  }, []);

  return { token, setToken, removeToken, isLoaded };
};
