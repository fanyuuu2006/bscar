import { twMerge } from "tailwind-merge";
import { clsx } from "clsx";

export function cn(...args: Parameters<typeof clsx>) {
  return twMerge(clsx(...args));
}
