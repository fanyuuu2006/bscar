"use client";

import { useAdmin } from "@/contexts/AdminContext";
import { AccountInfoCard } from "./AccountInfoCard";
import { LocationInfoCard } from "./LocationInfoCard";

export const MainSection = () => {
  const { logOut } = useAdmin();
  return (
    <section className="flex h-full w-full flex-col gap-4 p-4">
      <h2 className="text-2xl font-bold">設定</h2>
      <AccountInfoCard className="w-full" />
      <LocationInfoCard className="w-full" />
      <button
        onClick={logOut}
        className="mt-8 rounded-lg bg-(--accent) px-4 py-2 font-bold text-(--background)"
      >
        登出後台
      </button>
    </section>
  );
};
