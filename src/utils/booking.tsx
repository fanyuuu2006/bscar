import {
  BookingStep,
  Service,
  Location,
  Info,
} from "@/contexts/BookingContext";
import { formatDate } from "./date";

export const getDisplayValue = <K extends BookingStep>(
  step: K,
  data: {
    location: Location;
    service: Service;
    time: Date;
    info: Info;
  }[K]
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


// export const generateTimeSlot = (
//   date: Date,
//   openTime: string,
//   closeTime: string,
//   duration: number
// ): Date[] => {
//   const [openH, openM] = openTime.split(":").map(Number);
//   const [closeH, closeM] = closeTime.split(":").map(Number);
//   const slots: Date[] = [];
//   const start = new Date(date);
//   start.setHours(openH, openM, 0, 0);
//   const end = new Date(date);
//   end.setHours(closeH, closeM, 0, 0);
//   const current = new Date(start);
//   while (current < end) {
//     const slotEnd = new Date(current);
//     slotEnd.setMinutes(slotEnd.getMinutes() + duration);
//     if (slotEnd <= end) {
//       slots.push(new Date(current));
//     }
//     current.setMinutes(current.getMinutes() + duration);
//   }

//   return slots;
// };
