import "@/styles/burger.css";
import { cn } from "@/utils/className";
import { DistributiveOmit } from "fanyucomponents";

export type BurgerProps = DistributiveOmit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type"
>;
export const Burger = ({ className, ...rest }: BurgerProps) => {
  return (
    <label className={cn("burger", className)}>
      <input type="checkbox" id={rest.id || "burger-toggle"} {...rest} />
      <span />
      <span />
      <span />
    </label>
  );
};
