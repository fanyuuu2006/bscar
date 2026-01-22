import {
  BookingData,
  BookingStep,
  bookingSteps,
  Location,
  Service,
  useBooking,
} from "@/contexts/BookingContext";
import { cn } from "@/utils/className";
import { formatDate } from "@/utils/date";
import { DistributiveOmit } from "fanyucomponents";

const getDisplayValue = <K extends BookingStep>(
  step: K,
  data: BookingData[K]
) => {
  if (!data) return "";

  switch (step) {
    case "location": {
      const { city, branch } = data as Location;
      return `${city}-${branch}`;
    }
    case "service":
      return (data as Service).name;
    case "time":
      return formatDate("YYYY/MM/DD hh:mm A", data as Date);
    default:
      return "";
  }
};

type StepNavigatorProps = DistributiveOmit<
  React.HTMLAttributes<HTMLDivElement>,
  "children"
>;

export const StepNavigator = ({ className, ...rest }: StepNavigatorProps) => {
  const booking = useBooking();
  return (
    <div
      className={cn(
        "flex items-center gap-6 overflow-x-auto pb-4 border-b border-(--border)",
        className
      )}
      {...rest}
    >
      {bookingSteps.map((step, index) => {
        const displayValue = getDisplayValue(
          step.value,
          booking.data[step.value]
        );
        const isActive = booking.currStep === step.value;

        return (
          <button
            disabled={booking.getStepIndex(booking.currStep) < index}
            key={step.value}
            className={cn(
              `w-full h-[3em] whitespace-nowrap font-medium`,
              "flex flex-col justify-center items-center rounded-lg"
            )}
            onClick={() => {
              booking.toStep(step.value);
            }}
          >
            <span
              className={cn("text-lg md:text-xl", {
                "font-extrabold": isActive,
              })}
            >
              {step.label}
            </span>
            {displayValue && (
              <span className="text-xs md:text-sm  text-(--muted) mt-1 font-normal opacity-80">
                {displayValue}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
