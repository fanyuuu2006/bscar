import { Header } from "@/components/Header";
import { site } from "@/libs/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: site.title,
  description: site.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Header className="sticky top-0 z-50" />
        {children}
      </body>
    </html>
  );
}
