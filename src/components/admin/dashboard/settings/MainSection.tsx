"use client";

import { useAdmin } from "@/contexts/AdminContext";
import { SupabaseLocation } from "@/types";
import { useState } from "react";

export const MainSection = () => {
    const {admin} = useAdmin();
const [location] = useState<SupabaseLocation | null>(null);

  return (
    <section className="flex h-full w-full flex-col gap-4 p-4">
        <h2 className="text-2xl font-bold">設定</h2>
    </section>
  );
};
