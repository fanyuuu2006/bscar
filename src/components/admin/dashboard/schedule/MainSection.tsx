"use client";
import { Calender } from "@/components/Calender";
import { DateCell } from "./DateCell";

export const MainSection = () => {
  return (
    <section className="flex h-full w-full flex-col gap-4 p-4">
      <h1 className="text-2xl font-bold">行事曆</h1>
      <div className="w-full h-full">
        <Calender className="text-lg" DateCell={DateCell} />
      </div>
    </section>
  );
};
