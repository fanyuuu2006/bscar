import { ServiceDiv } from "@/components/booking/[locationId]/ServiceDiv";
import { getServices } from "@/utils/backend";

export default async function Booking(
  props: PageProps<"/booking/[locationId]">,
) {
  const { locationId } = await props.params;
  const { data } = await getServices();
  return (
      <ServiceDiv services={data || []} locationId={locationId} />
  );
}
