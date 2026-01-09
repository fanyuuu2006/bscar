"use client";
import { useBooking } from "@/contexts/BookingContext";
import { LocationsDiv } from "./LocationsDiv";
import { cn } from "@/utils/className";

export const Mainsection = () => {
  const { currTag, setCurrTag, tags } = useBooking();

  return (
    <section>
      <div className="container flex flex-col py-12 md:py-20">
        {/* 標籤切換欄 */}
        <div className="w-full flex items-center gap-6 overflow-x-auto pb-4 mb-8 border-b border-(--border)">
          {tags.map((tag) => (
            <button
              key={tag.value}
              className={cn(
                `w-full text-(--muted) p-2 whitespace-nowrap font-medium`,
                {
                  "text-(--primary)": currTag === tag.value,
                }
              )}
              onClick={() => setCurrTag(tag.value)}
            >
              {tag.label}
            </button>
          ))}
        </div>
        <LocationsDiv />
      </div>
    </section>
  );
};
