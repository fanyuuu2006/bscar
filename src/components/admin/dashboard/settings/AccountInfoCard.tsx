import { useAdmin } from "@/contexts/AdminContext";
import { useAdminToken } from "@/hooks/useAdminToken";
import { SupabaseAdmin } from "@/types";
import { updateAdmin } from "@/utils/backend";
import { cn } from "@/utils/className";
import { useState, useCallback } from "react";
import { FieldInput } from "../FieldInput";
import { useModal } from "@/hooks/useModal";

type AccountInfoCardProps = React.HTMLAttributes<HTMLDivElement>;
export const AccountInfoCard = ({
  className,
  ...rest
}: AccountInfoCardProps) => {
  const { admin, refresh } = useAdmin();
  const { token } = useAdminToken();
  const modal = useModal({});
  const [newAdmin, setNewAdmin] = useState<SupabaseAdmin | null>(admin);
  const [passwords, setPasswords] = useState<{
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
  }>({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const handlePasswordChange = useCallback(
    (key: keyof typeof passwords, value: string) => {
      setPasswords((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const handleSubmitPasswordChange = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!admin) return;

      if (passwords.currentPassword !== admin.password) {
        alert("舊密碼輸入錯誤");
        return;
      }
      if (passwords.newPassword !== passwords.confirmNewPassword) {
        alert("新密碼與確認密碼不符");
        return;
      }
      if (passwords.newPassword === admin.password) {
        alert("新密碼不能與舊密碼相同");
        return;
      }
      setNewAdmin((prev) =>
        prev ? { ...prev, password: passwords.newPassword } : prev,
      );
      alert("密碼已更新，請記得儲存變更");
      modal.close();
    },
    [
      admin,
      modal,
      passwords.confirmNewPassword,
      passwords.currentPassword,
      passwords.newPassword,
    ],
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

  const handleSave = useCallback(() => {
    if (!token || !admin || !newAdmin) return;
    if (JSON.stringify(admin) === JSON.stringify(newAdmin)) {
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
          <FieldInput
            field={{
              id: "account",
              label: "帳號",
              type: "text",
            }}
            value={newAdmin["account"] as string}
            onChange={(e) => handleAdminChange("account", e.target.value)}
          />
          <div>
            <button
              type="button"
              onClick={modal.open}
              className="btn mt-7 p-2 w-full rounded-lg font-medium"
            >
              變更密碼
            </button>
          </div>
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
      <modal.Container className="bg-black/50 z-50 flex items-center justify-center">
        <div className="card p-4 rounded-lg max-w-md w-full">
          <h4 className="text-xl font-bold mb-4">變更密碼</h4>
          <form
            className="flex flex-col gap-3"
            onSubmit={handleSubmitPasswordChange}
          >
            {[
              {
                id: "currentPassword",
                label: "舊密碼",
                type: "password",
                required: true,
              },
              {
                id: "newPassword",
                label: "新密碼",
                type: "password",
                required: true,
              },
              {
                id: "confirmNewPassword",
                label: "確認新密碼",
                type: "password",
                required: true,
              },
            ].map((field) => (
              <FieldInput
                key={field.id}
                field={field}
                value={passwords[field.id as keyof typeof passwords]}
                onChange={(e) =>
                  handlePasswordChange(
                    field.id as keyof typeof passwords,
                    e.target.value,
                  )
                }
              />
            ))}

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={modal.close}
                className="px-4 py-2 rounded-lg btn secondary"
              >
                取消
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg btn primary"
              >
                儲存
              </button>
            </div>
          </form>
        </div>
      </modal.Container>
    </div>
  );
};
