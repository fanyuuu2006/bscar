"use client";
import { cn } from "@/utils/className";
import { RightOutlined } from "@ant-design/icons";
import { OverrideProps } from "fanyucomponents";
import Link from "next/link";

export type SummaryCardProps = OverrideProps<
  React.HTMLAttributes<HTMLDivElement>,
  {
    label: string;
    Icon: React.ElementType;
    href: string;
  }
>;

export const SummaryCard = ({
  className,
  label,
  Icon,
  href,
  children,
  ...rest
}: SummaryCardProps) => {

  return (
    <div className={cn("card rounded-xl p-6", className)} {...rest}>
      <div className="flex flex-col h-full gap-2">
        <h3 className="text-lg font-bold flex items-center gap-2 text-(--foreground)">
          <Icon />
          {label}
        </h3>{children}
        <div>
          <Link
            href={href}
            className="group flex items-center text-sm font-medium text-(--muted) transition-colors duration-300 hover:text-(--primary)"
          >
            查看詳情
            <RightOutlined className="ml-1 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
};
