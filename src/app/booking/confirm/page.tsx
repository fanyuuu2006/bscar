"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function BookingSuccessPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/booking");
  }, [router]);
  return null;
}
