import { Location, useBooking } from "@/contexts/BookingContext";
import { locations } from "@/libs/locations";
import { cn } from "@/utils/className";
import { OverrideProps } from "fanyucomponents";

type LocationsDivProps = React.HTMLAttributes<HTMLDivElement>;
export const LocationsDiv = ({ className, ...rest }: LocationsDivProps) => {
  return (
    <div
      className={cn(
        "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6",
        className
      )}
      {...rest}
    >
      {locations.map((item) => {
        return <LocationCard key={item.id} item={item} />;
      })}
    </div>
  );
};

type LocationCardProps = OverrideProps<
  React.HTMLAttributes<HTMLDivElement>,
  {
    item: Location;
  }
>;

const LocationCard = ({ item, className, ...rest }: LocationCardProps) => {
  const booking = useBooking();
  return (
    <div
      className={cn(
        "card flex flex-col overflow-hidden rounded-2xl",
        className
      )}
      {...rest}
    >
      <div className="w-full aspect-video overflow-hidden bg-black/20 flex items-center justify-center relative">
        {item.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.image_url}
            alt={`${item.city} ${item.branch}`}
            className="w-full h-full object-cover transition-transform duration-500"
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-(--muted) gap-2">
            <span className="text-4xl" role="img">
              🏙️
            </span>
            <span className="text-sm font-medium">暫無圖片</span>
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1 gap-2">
        <div className="flex-1">
          <h2 className="text-xl md:text-2xl font-bold text-(--foreground) tracking-tight">
            <span role="img">📍</span>
            {item.city}{" "}
            <span className="text-base font-normal text-zinc-500">|</span>{" "}
            {item.branch}
          </h2>
          <address className="mt-2 text-sm text-(--muted) line-clamp-2">
            {item.address}
          </address>
        </div>

        {/* 功能按鈕區 */}
        <div className="pt-4 mt-auto">
          <button
            className="btn primary w-full font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2"
            onClick={() => {
              booking.setBookingData("location", item);
              booking.nextStep();
            }}
          >
            <span>選擇地點</span>
          </button>
        </div>
      </div>
    </div>
  );
};
