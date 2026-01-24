import { MainSection } from "@/components/booking/MainSection";
import { TimeDiv } from "@/components/booking/[locationId]/[serviceId]/TimeDiv";

export default async function Booking(
  props: PageProps<"/booking/[locationId]/[serviceId]">,
) {
  const { locationId, serviceId } = await props.params;
  return (
    <MainSection
      ContentComponent={TimeDiv}
      propsForComponent={{ locationId, serviceId }}
    />
  );
}
