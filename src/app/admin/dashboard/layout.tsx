import { AsideBar } from "@/components/admin/dashboard/AsideBar";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <div className="flex h-full">
        <AsideBar className="shrink-0 sticky left-0 h-full" />
        <div role="main" className="flex-1 max-h-full overflow-y-auto">
          {children}
        </div>
      </div>
  );
}
