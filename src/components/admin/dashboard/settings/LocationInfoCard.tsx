"use client";
import { useAdmin } from "@/contexts/AdminContext";
import { useAdminToken } from "@/hooks/useAdminToken";
import { SupabaseLocation } from "@/types";
import { getLocationById, updateLocationByAdmin } from "@/utils/backend";
import { cn } from "@/utils/className";
import { useEffect, useState, useMemo, useCallback } from "react";
import { FieldInput, FieldInputProps } from "../FieldInput";

type LocationInfoCardProps = React.HTMLAttributes<HTMLDivElement>;
export const LocationInfoCard = ({
  className,
  ...rest
}: LocationInfoCardProps) => {
  const { admin, refresh } = useAdmin();
  const { token } = useAdminToken();
  const [newLocation, setNewLocation] = useState<SupabaseLocation | null>(null);
  const [origLocation, setOrigLocation] = useState<SupabaseLocation | null>(
    null,
  );

  const formFields: { label: string; fields: FieldInputProps["field"][] }[] = useMemo(
    () => [
      {
        label: "基本資料",
        fields: [
          { id: "city", label: "城市", type: "text" },
          { id: "branch", label: "分店名稱", type: "text", hint: "不用添加`店`" },
          { id: "address", label: "地址", type: "text" },
        ],
      },
      {
        label: "營業時間",
        fields: [
          { id: "open_time", label: "開始時間", type: "time" },
          { id: "close_time", label: "結束時間", type: "time" },
        ],
      },
    ],
    [],
  );

  const handleLocationChange = useCallback(
    <T extends keyof SupabaseLocation>(key: T, value: SupabaseLocation[T]) => {
      setNewLocation((prev) => (prev ? { ...prev, [key]: value } : prev));
    },
    [],
  );

  const onLocationInputChange = useCallback(
    (
      key: string,
      e: React.ChangeEvent<HTMLInputElement>,
    ) => {
      handleLocationChange(
        key as keyof SupabaseLocation,
        e.target.value as unknown as SupabaseLocation[keyof SupabaseLocation],
      );
    },
    [handleLocationChange],
  );

  useEffect(() => {
    if (!admin) return;
    getLocationById(admin.location_id)
      .then((res) => {
        if (res.success) {
          setNewLocation(res.data || null);
          setOrigLocation(res.data || null);
        }
      })
      .catch(() => {
        setNewLocation(null);
        setOrigLocation(null);
      });
  }, [admin]);

  const handleSave = useCallback(() => {
    if (!token || !admin || !newLocation) return;

    if (
      origLocation &&
      JSON.stringify(origLocation) === JSON.stringify(newLocation)
    ) {
      alert("資料未變更");
      return;
    }

    updateLocationByAdmin(token, newLocation).then((res) => {
      if (res.success) {
        alert("店家資料已更新");
        refresh();
      } else {
        alert(`更新失敗${res.message ? `：${res.message}` : ""}`);
      }
    });
  }, [newLocation, origLocation, refresh, token, admin]);

  if (!newLocation)
    return (
      <div className={cn("card p-4 md:p-6 rounded-xl", className)} {...rest}>
        <h3 className="text-2xl font-extrabold mb-2">店家資料</h3>
        <p className="text-(--muted)">載入中</p>
      </div>
    );

  return (
    <div className={cn("card p-4 md:p-6 rounded-xl", className)} {...rest}>
      <h3 className="text-2xl font-extrabold">店家資料</h3>

      <div className="mt-4 space-y-4">
        <div className="grid gap-3">
          <div>
            <div className="font-bold text-sm">ID</div>
            <div className="text-sm text-(--muted) font-mono wrap-break-word ">{newLocation.id}</div>
          </div>
        </div>

        {formFields.map((section) => (
          <section key={section.label} className="mt-2">
            <h4 className="text-xl font-semibold">{section.label}</h4>
            <div className="px-2 mt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {section.fields.map((f) => (
                <FieldInput
                  field={f}
                  key={f.id}
                  className={cn(
                    f.id === "address" ? "sm:col-span-2" : undefined,
                  )}
                  value={
                    (newLocation[f.id as keyof SupabaseLocation] as string) || ""
                  }
                  onChange={(e) => onLocationInputChange(f.id, e)}
                />
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-6 flex justify-end">
        <button onClick={handleSave} className="px-4 py-2 rounded-lg btn secondary">
          儲存變更
        </button>
      </div>
    </div>
  );
};
