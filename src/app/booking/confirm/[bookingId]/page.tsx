import { ConfirmDiv } from "@/components/booking/confirm/[bookingId]/ConfirmDiv";
import {
  getBookingById,
  getLocationById,
  getServiceById,
} from "@/utils/backend";

export default async function BookingSuccessPage(
  props: PageProps<"/booking/confirm/[bookingId]">,
) {
  const { bookingId } = await props.params;
  const { data: bookingData } = await getBookingById(bookingId);
  const { data: location } = await getLocationById(
    bookingData?.location_id || "",
  );
  const { data: service } = await getServiceById(bookingData?.service_id || "");
  return (
    <ConfirmDiv
      bookingData={bookingData}
      location={location}
      service={service}
    />
  );
}
