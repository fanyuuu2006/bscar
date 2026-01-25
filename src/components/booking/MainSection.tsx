"use client";
import { StepNavigator } from "./StepNavigator";
import { OverrideProps } from "fanyucomponents";
import { useBookingData } from "@/hooks/useBookingData";

type MainsectionProps = OverrideProps<
  React.HTMLAttributes<HTMLElement>,
  {
    children: React.ReactNode;
  }
>;
export const MainSection = ({
  children,
  ...rest
}: MainsectionProps) => {
  const data = useBookingData();
  return (
    <section {...rest}>
      <div className="container flex flex-col py-12 md:py-20">
        {/* 標籤切換欄 */}
        <StepNavigator className="w-full mb-8" data={data} />
        {/* 選擇區塊 */}
        {children}
      </div>
    </section>
  );
};
