import { MainSection } from "@/components/admin/dashboard/booking/[id]/MainSection";
import { getBookingById } from "@/utils/backend";

export default async function Booking(
  props: PageProps<"/admin/dashboard/booking/[id]">,
) {
  const { id } = await props.params;
  const { data: booking } = await getBookingById(id);

  return <MainSection booking={booking} />;
}
