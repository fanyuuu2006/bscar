import { MainSection } from "@/components/booking/MainSection";
import { InfoDiv } from "@/components/booking/[locationId]/[serviceId]/[time]/InfoDiv";
import { getLocationById, getServiceById } from "@/utils/backend";

export default async function Booking(
  props: PageProps<"/booking/[locationId]/[serviceId]/[time]">,
) {
  const { locationId, serviceId, time } = await props.params;
  const { data: location } = await getLocationById(locationId);
  const { data: service } = await getServiceById(serviceId);
  const timeDate = new Date(Number(time));
  if (!location || !service) {
    return null;
  }
  return (
    <MainSection
      ContentComponent={InfoDiv}
      propsForComponent={{ location, service, time: timeDate }}
    />
  );
}
