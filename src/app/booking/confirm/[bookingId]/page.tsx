import { ConfirmDiv } from "@/components/booking/confirm/[bookingId]/ConfirmDiv";
import { getBookingById } from "@/utils/backend";

export default async function BookingSuccessPage(
  props: PageProps<"/booking/confirm/[bookingId]">,
) {
  const { bookingId } = await props.params;
  const { data: booking } = await getBookingById(bookingId);
  return <ConfirmDiv bookingData={booking} />;
}
