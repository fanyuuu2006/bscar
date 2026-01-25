import { MainSection } from "@/components/booking/MainSection";
import { TimeDiv } from "@/components/booking/[locationId]/[serviceId]/TimeDiv";
import { getLocationById, getServiceById } from "@/utils/backend";

export default async function Booking(
  props: PageProps<"/booking/[locationId]/[serviceId]">,
) {
  const { locationId, serviceId } = await props.params;
  const {data: location} = await getLocationById(locationId);
  const {data: service} = await getServiceById(serviceId);
  return (
    <MainSection
      ContentComponent={TimeDiv}
      propsForComponent={{ locationId, serviceId }}
      data={{ location: location ?? undefined, service: service ?? undefined }}
    />
  );
}
