import { ServiceDiv } from "@/components/booking/[locationId]/ServiceDiv";
import { MainSection } from "@/components/booking/MainSection";
import { getServices } from "@/utils/backend";

export default async function Booking() {
  const { data } = await getServices();
  return (
    <MainSection
      ContentComponent={ServiceDiv}
      propsForComponent={{ services: data || [] }}
    />
  );
}
