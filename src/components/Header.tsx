import Link from "next/link";
import { routes, title } from "@/libs/site";
import { DistributiveOmit } from "fanyucomponents";

type HeaderProps = DistributiveOmit<
  React.HtmlHTMLAttributes<HTMLElement>,
  "children"
>;

export const Header = (props: HeaderProps) => {
  return (
    <header {...props}>
      <div className="container mx-auto flex w-full items-center justify-between p-4">
        <Link href="/" className="h-20">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/icons/banner.png"
            alt={title}
            className="h-full w-auto object-contain"
          />
        </Link>
        <nav>
          <ul className="flex gap-4">
            {routes.map((route) => (
              <li key={route.url}>
                <Link href={route.url} className="hover:text-gray-500">
                  {route.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
};
