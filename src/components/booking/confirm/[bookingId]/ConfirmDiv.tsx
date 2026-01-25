import { SupabaseBooking } from "@/types";
import { OverrideProps } from "fanyucomponents";

export type ConfirmDivProps = OverrideProps<
  React.HTMLAttributes<HTMLDivElement>,
  {
    bookingData: SupabaseBooking | null;
  }
>;

export const ConfirmDiv = ({ bookingData, ...rest }: ConfirmDivProps) => {
  if (!bookingData) {
    return <div {...rest}>找不到預約資料。</div>;
  }
  return <div {...rest}>ConfirmDiv</div>;
};
