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

  const formFields: FieldInputProps["field"][] = useMemo(
    () => [
      { id: "city", label: "城市", type: "text" },
      { id: "branch", label: "分店名稱", type: "text", hint: "不用添加`店`" },
      { id: "address", label: "地址", type: "text" },
      { id: "open_time", label: "營業開始時間", type: "text",},
      { id: "close_time", label: "營業結束時間", type: "text" },
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
      key: (typeof formFields)[number]["id"],
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
        <h3 className="text-lg font-medium mb-2">所屬店家資訊</h3>
        <p className="text-(--muted)">載入中</p>
      </div>
    );

  return (
    <div className={cn("card p-4 md:p-6 rounded-xl", className)} {...rest}>
      <h3 className="text-2xl font-extrabold">店家資料</h3>

      <div className="mt-2 flex flex-col gap-2">
        <div className="flex flex-col ">
          <span className="font-bold">ID</span>
          <span className="font-light">
            {newLocation ? newLocation.id : ""}
          </span>
        </div>

        {formFields.map((field) => (
          <FieldInput
            field={field}
            key={field.id}
            value={
              newLocation
                ? newLocation[field.id as keyof SupabaseLocation] || ""
                : ""
            }
            onChange={(e) =>
              onLocationInputChange(
                field.id as (typeof formFields)[number]["id"],
                e,
              )
            }
          />
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
