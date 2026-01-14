import { BookingStep, BookingData, Service, Time, Location } from "@/contexts/BookingContext";
import { formatDate } from "./date";

export const getDisplayValue = <K extends BookingStep>(
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
      return formatDate("YYYY/MM/DD HH:mm", data as Time);
    default:
      return "";
  }
};