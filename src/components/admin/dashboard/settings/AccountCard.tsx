import { useAdmin } from "@/contexts/AdminContext";
import { useAdminToken } from "@/hooks/useAdminToken";
import { SupabaseAdmin } from "@/types";
import { updateAdmin } from "@/utils/backend";
import { cn } from "@/utils/className";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import { useState, useMemo, useCallback } from "react";

type AccountCardProps = React.HTMLAttributes<HTMLDivElement>;
export const AccountCard = ({ className, ...rest }: AccountCardProps) => {
  const { admin, refresh } = useAdmin();
  const { token } = useAdminToken();
  const [newAdmin, setNewAdmin] = useState<SupabaseAdmin | null>(admin);
  const [showPassword, setShowPassword] = useState(false);

  const formFields = useMemo(
    () =>
      [
        {
          id: "account",
          label: "帳號",
          type: "text",
        },
        {
          id: "password",
          label: "密碼",
          type: "password",
        },
      ] as const,
    [],
  );
  /**
   * 通用的欄位更新器，使用 functional update，避免依賴外部可變物件
   * 使用泛型確保 key 與 value 的型別相符
   */
  const handleAdminChange = useCallback(
    <T extends keyof SupabaseAdmin>(key: T, value: SupabaseAdmin[T]) => {
      setNewAdmin((prev) => (prev ? { ...prev, [key]: value } : prev));
    },
    [],
  );

  const onAdminInputChange = useCallback(
    (
      key: (typeof formFields)[number]["id"],
      e: React.ChangeEvent<HTMLInputElement>,
    ) => {
      handleAdminChange(
        key as keyof SupabaseAdmin,
        e.target.value as unknown as SupabaseAdmin[keyof SupabaseAdmin],
      );
    },
    [handleAdminChange],
  );

  const handleSave = useCallback(() => {
    if (!token || !newAdmin) return;
    updateAdmin(token, newAdmin).then((res) => {
      if (res.success) {
        alert("帳號資料已更新");
        refresh();
      } else {
        alert(`更新失敗${res.message ? `：${res.message}` : ""}`);
      }
    });
  }, [newAdmin, refresh, token]);

  if (!newAdmin) return null;

  return (
    <div className={cn(`card p-4 md:p-6 rounded-xl`, className)} {...rest}>
      <h3 className="text-2xl font-extrabold">帳號資料</h3>

      <div className="mt-2 flex flex-col gap-2">
        <div className="flex flex-col ">
          <span className="font-bold">ID</span>
          <span className="font-light">{newAdmin ? newAdmin.id : ""}</span>
        </div>
        {formFields.map((field) => (
          <div key={field.id} className="flex flex-col">
            <label className="font-bold mb-1" htmlFor={field.id}>
              {field.label}
            </label>
            <div className="relative">
              <input
                required
                id={field.id}
                type={
                  field.id === "password" && showPassword ? "text" : field.type
                }
                value={
                  newAdmin
                    ? newAdmin[field.id as keyof SupabaseAdmin] || ""
                    : ""
                }
                onChange={(e) =>
                  onAdminInputChange(
                    field.id as (typeof formFields)[number]["id"],
                    e,
                  )
                }
                className={cn(
                  "w-full p-2 border-(--border) rounded-lg bg-black/5",
                  field.id === "password" && "pr-10",
                )}
              />
              {field.id === "password" && (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-(--muted)"
                >
                  {showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex justify-end">
        <button
          onClick={handleSave}
          className="px-4 py-1 rounded-xl btn secondary"
        >
          儲存變更
        </button>
      </div>
    </div>
  );
};
