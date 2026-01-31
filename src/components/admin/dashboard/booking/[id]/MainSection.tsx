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
  if (!booking) return null;
  return (
    <section className={cn(className)} {...rest}>
      <div className="w-full flex flex-col p-4 gap-4">
        <h2 className="text-2xl font-bold mb-4">編輯預約</h2>

        <div className="card p-4 rounded-xl">

        </div>
            
      </div>
    </section>
  );
};
