import { TimeDiv } from "@/components/booking/[locationId]/[serviceId]/TimeDiv";

export default async function Booking(
  props: PageProps<"/booking/[locationId]/[serviceId]">,
) {
  const { locationId, serviceId } = await props.params;
  return (
      <TimeDiv locationId={locationId} serviceId={serviceId} />
  );
}
