import { MainSection } from "@/components/admin/dashboard/booking/[id]/MainSection";
import { getBookingById, getLocationById, getServiceById } from "@/utils/backend";

export default async function Booking(
  props: PageProps<"/admin/dashboard/booking/[id]">,
) {
  const { id } = await props.params;
  const { data: booking } = await getBookingById(id);
  const { data: location } = await getLocationById(booking?.location_id || "");
  const { data: service } = await getServiceById(booking?.service_id || "");

  return (
    <MainSection booking={booking} location={location} service={service} />
  );
}
