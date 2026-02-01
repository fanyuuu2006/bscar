"use client";
import { useAdmin } from "@/contexts/AdminContext";
import { SupabaseLocation } from "@/types";
import { getLocationById } from "@/utils/backend";
import { cn } from "@/utils/className";
import { useEffect, useState } from "react";

type LocationInfoCardProps = React.HTMLAttributes<HTMLDivElement>;
export const LocationInfoCard = ({
  className,
  ...rest
}: LocationInfoCardProps) => {
  const { admin } = useAdmin();
  const [newLocation, setNewLocation] = useState<SupabaseLocation | null>(null);

  useEffect(() => {
    if (!admin) return;
    getLocationById(admin.location_id)
      .then((res) => {
        if (res.success) {
          setNewLocation(res.data || null);
        }
      })
      .catch(() => {
        setNewLocation(null);
      });
  }, [admin]);
  return (
    <div className={cn("card p-4 md:p-6 rounded-xl", className)} {...rest}>
      <h3 className="text-lg font-medium mb-2">所屬店家資訊</h3>
      {newLocation ? (
        <div className="text-(--foreground)">
          <p>
            <strong>店名：</strong>
            {newLocation.city} - {newLocation.branch} 店
          </p>
          <p>
            <strong>地址：</strong>
            {newLocation.address}
          </p>
        </div>
      ) : (
        <p className="text-(--muted)">載入中</p>
      )}
    </div>
  );
};
