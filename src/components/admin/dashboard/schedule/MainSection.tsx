"use client";
import { Calender } from "@/components/Calender";
import { DateCell } from "./DateCell";
import { statusMap } from "@/libs/booking";
import { cn } from "@/utils/className";

export const MainSection = () => {
  return (
    <section className="flex h-full w-full flex-col gap-4 p-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">行事曆</h1>
        <div className="flex flex-wrap gap-3">
          {Object.values(statusMap).map((status) => (
            <div key={status.label} className="flex items-center gap-1.5">
              <span
                className={cn(
                  "h-3 w-3 rounded-full border",
                  status.className,
                )}
              />
              <span className="text-sm">{status.label}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="w-full h-full">
        <Calender
          className="text-lg"
          pastDateDisabled={false}
          DateCell={DateCell}
        />
      </div>
    </section>
  );
};
