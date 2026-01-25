"use client";
import { BookingData } from "@/types";
import { StepNavigator } from "./StepNavigator";
import { OverrideProps } from "fanyucomponents";
type MainsectionProps<T extends React.ElementType = React.ElementType> =
  OverrideProps<
    React.HTMLAttributes<HTMLElement>,
    {
      ContentComponent: T;
      propsForComponent: React.ComponentPropsWithRef<T>;
      data: BookingData;
    }
  >;
export const MainSection = <T extends React.ElementType>({
  ContentComponent,
  propsForComponent,
  data,
  ...rest
}: MainsectionProps<T>) => {
  return (
    <section {...rest}>
      <div className="container flex flex-col py-12 md:py-20">
        {/* 標籤切換欄 */}
        <StepNavigator className="w-full mb-8" data={data} />
        {/* 選擇區塊 */}
        <ContentComponent {...propsForComponent} />
      </div>
    </section>
  );
};
