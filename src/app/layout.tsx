import "@/styles/globals.css";
import { Header } from "@/components/Header";
import type { Metadata } from "next";
import { description, title } from "@/libs/site";

export const metadata: Metadata = {
  title,
  description,
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
