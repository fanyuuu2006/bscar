"use client";
import {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
  useEffect,
} from "react";
import { SupabaseAdmin } from "@/types";
import { getAdminMe, postAdminLogin } from "@/utils/backend";

interface AdminContextType {
  admin: SupabaseAdmin | null;
  loading: boolean;
  refresh: () => void;
  logIn: (...args: Parameters<typeof postAdminLogin>) => void;
  logOut: () => void;
}

export const LOCAL_STORAGE_KEY = "authToken";

const adminContext = createContext<AdminContextType | null>(null);

export const AdminProvider = ({ children }: { children: React.ReactNode }) => {
  const [admin, setAdmin] = useState<SupabaseAdmin | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const refresh = useCallback(() => {
    const token = localStorage.getItem(LOCAL_STORAGE_KEY);
    setLoading(true);
    getAdminMe(token || "")
      .then((data) => {
        setAdmin(data.data);
      })
      .catch(() => {
        setAdmin(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const logIn = useCallback(
    (...args: Parameters<typeof postAdminLogin>) => {
      postAdminLogin(...args)
        .then((res) => {
          if (!res.success) {
            alert("管理員登入失敗，請檢查帳號密碼是否正確");
            console.error("管理員登入失敗", res.message);
            return;
          }
          localStorage.setItem(LOCAL_STORAGE_KEY, res.data!);
        })
        .catch((err) => {
            alert("管理員登入失敗，請稍後再試");
          console.error("管理員登入失敗", err);
        })
        .finally(() => {
          refresh();
        });
    },
    [refresh],
  );

  const logOut = useCallback(() => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  }, []);

  const value = useMemo(
    () => ({
      admin,
      loading,
      logIn,
      logOut,
      refresh,
    }),
    [admin, loading, logIn, logOut, refresh],
  );

  useEffect(() => {
    if (admin || !localStorage.getItem(LOCAL_STORAGE_KEY)) return;
    const fetchAdmin = async () => {
      refresh();
    };
    fetchAdmin();
  }, [refresh, admin]);

  return (
    <adminContext.Provider value={value}>{children}</adminContext.Provider>
  );
};
export const useAdmin = () => {
  const context = useContext(adminContext);
  if (!context) {
    throw new Error("useAdmin 必須在 AdminProvider 內使用");
  }
  return context;
};
