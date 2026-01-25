import { ServiceDiv } from "@/components/booking/[locationId]/ServiceDiv";
import { MainSection } from "@/components/booking/MainSection";
import { getLocationById, getServices } from "@/utils/backend";

export default async function Booking(
  props: PageProps<"/booking/[locationId]">,
) {
  const { locationId } = await props.params;
  const { data } = await getServices();
  const { data: location } = await getLocationById(locationId);
  return (
    <MainSection
      ContentComponent={ServiceDiv}
      propsForComponent={{ services: data || [], locationId }}
      data={{ location: location ?? undefined }}
    />
  );
}
