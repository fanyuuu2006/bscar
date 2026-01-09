"use client";
import { useBooking } from "@/contexts/BookingContext";
import { LocationsDiv } from "./LocationsDiv";

export const Mainsection = () => {
  const { currTag, setCurrTag, tags } = useBooking();

  return (
    <section className="py-12 md:py-20">
      <div className="container flex flex-col">
        {/* 標籤切換欄 */}
        <div className="w-full flex items-center gap-6 overflow-x-auto pb-4 mb-8 border-b border-(--border)">
          {tags.map((tag) => (
            <button
              key={tag.value}
              className={`w-full px-4 py-2 whitespace-nowrap font-medium rounded-full transition-colors ${
                currTag === tag.value
                  ? "bg-(--primary)/10 text-(--primary)"
                  : "text-(--muted) hover:bg-(--foreground)/5"
              }`}
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
