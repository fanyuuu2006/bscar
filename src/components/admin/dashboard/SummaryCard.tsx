"use client";
import { cn } from "@/utils/className";
import { RightOutlined } from "@ant-design/icons";
import { OverrideProps } from "fanyucomponents";
import React from "react";

export type SummaryCardProps<T extends React.ElementType = React.ElementType> =
  OverrideProps<
    React.HTMLAttributes<HTMLDivElement>,
    {
      label: string;
      Icon: React.ElementType;
      DetailComponent: T;
      detailProps: React.ComponentProps<T>;
    }
  >;

export const SummaryCard = <T extends React.ElementType = React.ElementType>({
  className,
  label,
  Icon,
  children,
  DetailComponent,
  detailProps,
  ...rest
}: SummaryCardProps<T>) => {
  const { className: detailClassName, ...restDetailProps } = detailProps;
  return (
    <div className={cn("card rounded-xl p-4", className)} {...rest}>
      <div className="flex flex-col h-full gap-2">
        <h3 className="text-lg font-bold flex items-center gap-2 text-(--foreground)">
          <Icon />
          {label}
        </h3>
        {children}
        <div>
          {React.createElement(
            DetailComponent,
            {
              className: cn(
                "group flex items-center text-sm font-medium text-(--muted) transition-colors duration-300 hover:text-(--primary)",
                detailClassName,
              ),
              ...restDetailProps,
            },
            <>
              查看詳情
              <RightOutlined className="ml-1 transition-transform group-hover:translate-x-1" />
            </>,
          )}
        </div>
      </div>
    </div>
  );
};
