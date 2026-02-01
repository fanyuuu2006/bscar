import { useAdmin } from "@/contexts/AdminContext";
import { useAdminToken } from "@/hooks/useAdminToken";
import { SupabaseAdmin } from "@/types";
import { updateAdmin } from "@/utils/backend";
import { cn } from "@/utils/className";
import { useState, useMemo, useCallback } from "react";
import { FieldInput } from "../FieldInput";

type AccountInfoCardProps = React.HTMLAttributes<HTMLDivElement>;
export const AccountInfoCard = ({
  className,
  ...rest
}: AccountInfoCardProps) => {
  const { admin, refresh } = useAdmin();
  const { token } = useAdminToken();
  const [newAdmin, setNewAdmin] = useState<SupabaseAdmin | null>(admin);

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
    if (!token || !admin || !newAdmin) return;
    if (
      JSON.stringify(admin) === JSON.stringify(newAdmin)
    ) {
      alert("資料未變更");
      return;
    }
    updateAdmin(token, newAdmin).then((res) => {
      if (res.success) {
        alert("帳號資料已更新");
        refresh();
      } else {
        alert(`更新失敗${res.message ? `：${res.message}` : ""}`);
      }
    });
  }, [admin, newAdmin, refresh, token]);

  if (!newAdmin) return null;

  return (
    <div className={cn(`card p-4 md:p-6 rounded-xl`, className)} {...rest}>
      <h3 className="text-2xl font-extrabold">帳號資料</h3>

      <div className="mt-4 space-y-4">
        <div className="grid gap-3">
          <div>
            <div className="font-bold text-sm">ID</div>
            <div className="text-sm text-(--muted) font-mono wrap-break-word">
              {newAdmin.id}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {formFields.map((field) => (
            <FieldInput
              key={field.id}
              field={field}
              value={newAdmin[field.id as keyof SupabaseAdmin] as string}
              onChange={(e) => onAdminInputChange(field.id, e)}
            />
          ))}
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-lg btn secondary"
          >
            儲存變更
          </button>
        </div>
      </div>
    </div>
  );
};
