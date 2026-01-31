import { SupabaseBooking } from "@/types";
import { cn } from "@/utils/className";
import { OverrideProps } from "fanyucomponents";

type MainSectionProps = OverrideProps<
  React.HTMLAttributes<HTMLDivElement>,
  { booking: SupabaseBooking | null }
>;
export const MainSection = ({
  booking,
  className,
  ...rest
}: MainSectionProps) => {
  return (
    <section className={cn(className)} {...rest}>
      MainSection Booking ID
    </section>
  );
};
