"use client";
import {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
  useEffect,
} from "react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const logIn = useCallback(
    (...args: Parameters<typeof postAdminLogin>) => {
      postAdminLogin(...args)
        .then((res) => {
          if (!res.success) {
            console.error("管理員登入失敗", res.message);
            return;
          }
          localStorage.setItem(LOCAL_STORAGE_KEY, res.data!);
          router.replace("/admin/dashboard");
        })
        .catch((err) => {
          console.error("管理員登入失敗", err);
        });
    },
    [router],
  );

  const logOut = useCallback(() => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    router.replace("/admin");
    setAdmin(null);
  }, [router]);
  const refresh = useCallback(() => {
    const token = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!token) return;
    setLoading(true);
    getAdminMe(token)
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
