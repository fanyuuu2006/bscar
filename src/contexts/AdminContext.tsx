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
import { getAdminMe, adminLogin } from "@/utils/backend";
import { useAdminToken } from "@/hooks/useAdminToken";
import { useRouter } from "next/navigation";

interface AdminContextType {
  admin: SupabaseAdmin | null;
  loading: boolean;
  refresh: () => void;
  logIn: (...args: Parameters<typeof adminLogin>) => void;
  logOut: () => void;
}

const adminContext = createContext<AdminContextType | null>(null);

export const AdminProvider = ({ children }: { children: React.ReactNode }) => {
  const [admin, setAdmin] = useState<SupabaseAdmin | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Default loading to true until token check
  const { token, setToken, removeToken, isLoaded } = useAdminToken();
  const router = useRouter();

  const refresh = useCallback(() => {
    if (!token) {
      setAdmin(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    getAdminMe(token)
      .then((data) => {
        setAdmin(data.data);
        router.replace("/admin/dashboard");
      })
      .catch(() => {
        setAdmin(null);
        removeToken();
      })
      .finally(() => {
        setLoading(false);
      });
  }, [removeToken, router, token]);

  // 當 token 載入完成或變更時，觸發 refresh
  useEffect(() => {
    if (isLoaded) {
      setTimeout(() => {
        refresh();
      }, 0);
    }
  }, [isLoaded, token, refresh]);

  const logIn = useCallback(
    (...args: Parameters<typeof adminLogin>) => {
      adminLogin(...args)
        .then((res) => {
          if (!res.success) {
            alert("後台登入失敗，請檢查帳號密碼是否正確");
            console.error("後台登入失敗", res.message);
            return;
          }
          setToken(res.data!);
        })
        .catch((err) => {
          alert("後台登入失敗，請稍後再試");
          console.error("後台登入失敗", err);
        });
    },
    [setToken],
  );

  const logOut = useCallback(() => {
    removeToken();
    setAdmin(null);
    router.replace("/admin");
  }, [removeToken, router]);

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
