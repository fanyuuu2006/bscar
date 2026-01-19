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

export const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
export const normalizePhone = (phone: string) => {
  return phone.replace(/[^\d+]/g, "");
};

export const isValidPhone = (phone: string) => {
  const p = normalizePhone(phone);
  const phoneRegex = /^\+?[0-9]{7,15}$/;
  return phoneRegex.test(p);
}

