import { LocationsDiv } from "@/components/booking/LocationsDiv";
import { getLocations } from "@/utils/backend";

export default async function Booking() {
  const { data } = await getLocations();
  return (
      <LocationsDiv locations={data || []} />
  );
}
