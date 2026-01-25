"use client";
import { BookingData } from "@/types";
import { StepNavigator } from "./StepNavigator";
import { OverrideProps } from "fanyucomponents";
type MainsectionProps = OverrideProps<
  React.HTMLAttributes<HTMLElement>,
  {
    data: BookingData;
    children: React.ReactNode;
  }
>;
export const MainSection = ({
  data,
  children,
  ...rest
}: MainsectionProps) => {
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
