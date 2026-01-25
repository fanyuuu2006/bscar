import { Metadata } from "next";

export const metadata:Metadata={
    title:'聯絡我們',
    description:'聯絡我們頁面',
};

export default function Layout({
  children,
}: Readonly<{
    children: React.ReactNode;
}>) {
  return <>{children}</>;
}