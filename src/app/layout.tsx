import "@/styles/globals.css";
import { Header } from "@/components/Header";
import type { Metadata } from "next";
import { description, title } from "@/libs/site";

export const metadata: Metadata = {
  title,
  description,
  icons: [
    {
      rel: "icon",
      url: "/icons/favicon.ico",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="grid grid-rows-[auto_1fr]">
        <Header className="sticky top-0 z-50" />
        <main>{children}</main>
      </body>
    </html>
  );
}
