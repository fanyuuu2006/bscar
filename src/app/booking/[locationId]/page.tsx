import { ServiceDiv } from "@/components/booking/[locationId]/ServiceDiv";
import { MainSection } from "@/components/booking/MainSection";

export default function Booking() {
  return <MainSection ContentComponent={ServiceDiv} />;
}
