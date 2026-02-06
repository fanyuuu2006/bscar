import { NextBookingCard } from "./NextBooking";
import { PendingCard } from "./PendingCard";
import { TodayCountCard } from "./TodayCountCard";

export const MainSection = () => {
  return (
    <section className="flex h-full w-full flex-col gap-4 p-4">
      <h1 className="text-2xl font-bold">主頁</h1>
      {/* ===== 統計卡片 ===== */}
      <div className="w-full grid grid-cols-1 md:grid-cols-3 p-4 gap-4">
        <PendingCard />
        <TodayCountCard />
        <NextBookingCard />
      </div>
    </section>
  );
};
