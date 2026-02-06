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
        `border-b border-(--border) bg-(--background) shadow-sm`,
        className
      )}
      {...rest}
    >
      <div className="container flex w-full items-center justify-between">
        <Link href="/" className="flex h-10 items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/icons/banner.png"
            alt={title}
            className="h-full w-auto object-contain"
          />
        </Link>

        <div className="text-xl hover:text-(--primary) md:hidden">
          <Burger
            id="header-burger"
            checked={menuShow}
            onChange={handleMenuToggle}
            aria-label={menuShow ? "關閉選單" : "開啟選單"}
            aria-expanded={menuShow}
            aria-controls="mobile-nav"
          />
        </div>

        <nav className="text-2xl hidden md:block">
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
                    <span>{route.label}</span>
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
        <ul className="w-full flex flex-col px-4 pb-2">
          {routes.map((route) => {
            const isActive = route.isActive
              ? route.isActive(pathName)
              : pathName.startsWith(route.url);
            return (
              <li className="w-full" key={route.url}>
                <Link
                  href={route.url}
                  onClick={closeMenu}
                  className={cn(
                    `w-full flex items-center justify-center p-2 font-semibold transition-colors hover:text-(--primary)`,
                    {
                      "text-(--primary)": isActive,
                    }
                  )}
                >
                  <span>{route.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </Collapse>
    </header>
  );
};
