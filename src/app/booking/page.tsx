import { LocationsDiv } from "@/components/booking/LocationsDiv";
import { MainSection } from "@/components/booking/MainSection";
import { getLocations } from "@/utils/backend";

export default async function Booking() {
  const { data } = await getLocations();
  return (
    <MainSection
      ContentComponent={LocationsDiv}
      propsForComponent={{
        locations: data || [],
      }}
      data={{}}
    />
  );
}
