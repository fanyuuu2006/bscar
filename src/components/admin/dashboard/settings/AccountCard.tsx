import { useAdmin } from "@/contexts/AdminContext";
import { SupabaseAdmin } from "@/types";
import { cn } from "@/utils/className";
import { useState, useMemo, useCallback } from "react";

type AccountCardProps = React.HTMLAttributes<HTMLDivElement>;
export const AccountCard = ({ className, ...rest }: AccountCardProps) => {
  const { admin } = useAdmin();
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

  if (!admin) return null;

  return (
    <div className={cn(`card p-4 rounded-xl`, className)} {...rest}>
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
            <input
              id={field.id}
              type={field.type}
              value={
                newAdmin ? newAdmin[field.id as keyof SupabaseAdmin] || "" : ""
              }
              onChange={(e) =>
                onAdminInputChange(
                  field.id as (typeof formFields)[number]["id"],
                  e,
                )
              }
              className="p-2 border-(--border) rounded-lg bg-black/5"
            />
          </div>
        ))}
      </div>
    </div>
  );
};
