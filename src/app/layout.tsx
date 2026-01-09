import "@/styles/globals.css";
import { Header } from "@/components/Header";
import type { Metadata } from "next";
import { description, title } from "@/libs/site";
import { BookingProvider } from "@/contexts/BookingContext";

export const metadata: Metadata = {
  title,
  description,
  icons: [
    {
      rel: "icon",
      url: "/images/icons/favicon.ico",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hant">
      <BookingProvider>
        <body className="flex min-h-screen flex-col">
          <Header className="sticky top-0 z-50" />
          <main className="flex-1 w-full">{children}</main>
        </body>
      </BookingProvider>
    </html>
  );
}
