"use client";
import Link from "next/link";
import { routes, title } from "@/libs/site";
import { Collapse, DistributiveOmit } from "fanyucomponents";
import { cn } from "@/utils/className";
import { usePathname } from "next/navigation";
import { useState, useCallback } from "react";
import { Burger } from "./Burger";

type HeaderProps = DistributiveOmit<
  React.HtmlHTMLAttributes<HTMLElement>,
  "children"
>;

export const Header = ({ className, ...rest }: HeaderProps) => {
  const pathName = usePathname();
  const [menuShow, setMenuShow] = useState<boolean>(false);

  const handleMenuToggle = useCallback(() => {
    setMenuShow((prev) => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setMenuShow(false);
  }, []);

  return (
    <header
      className={cn(
        `border-b border-(--border) bg-(--background)/75 backdrop-blur-md`,
        className
      )}
      {...rest}
    >
      <div className="container flex w-full items-center justify-between">
        <Link href="/" className="flex h-12 items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/icons/banner.png"
            alt={title}
            className="h-full w-auto object-contain"
          />
        </Link>

        <div className="text-xl md:hidden">
          <Burger
            id="header-burger"
            checked={menuShow}
            onChange={handleMenuToggle}
            aria-label={menuShow ? "關閉選單" : "開啟選單"}
            aria-expanded={menuShow}
            aria-controls="mobile-nav"
          />
        </div>

        <nav className="hidden md:block">
          <ul className="flex items-center gap-6">
            {routes.map((route) => {
              const isActive = route.isActive
                ? route.isActive(pathName)
                : pathName.startsWith(route.url);
              return (
                <li key={route.url}>
                  <Link
                    href={route.url}
                    className={cn(
                      `text-base md:text-lg font-semibold transition-colors hover:text-(--primary)`,
                      {
                        "text-(--primary)": isActive,
                      }
                    )}
                  >
                    {route.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
      <Collapse
        className="slide-collapse md:hidden"
        as="nav"
        state={menuShow}
        id="mobile-nav"
      >
        <ul className="flex flex-col gap-4 px-4 pb-4">
          {routes.map((route) => {
            const isActive = route.isActive
              ? route.isActive(pathName)
              : pathName.startsWith(route.url);
            return (
              <li key={route.url}>
                <Link
                  href={route.url}
                  onClick={closeMenu}
                  className={cn(
                    `block text-base font-semibold transition-colors hover:text-(--primary)`,
                    {
                      "text-(--primary)": isActive,
                    }
                  )}
                >
                  {route.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </Collapse>
    </header>
  );
};
