import { Metadata } from "next";

export const metadata: Metadata = {
    title: '預約',
    description: '預約頁面',
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
