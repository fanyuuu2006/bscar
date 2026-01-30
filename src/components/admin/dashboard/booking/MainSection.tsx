import { BookingsTable } from "./BookingsTable";
export const MainSection = () => {
  return (
    <section className="flex h-full w-full flex-col gap-4 p-4">
      <h1 className="text-2xl font-bold">預約管理</h1>

      <div className="card w-full rounded-2xl overflow-auto">
        <BookingsTable className="w-full"/>
      </div>
    </section>
  );
};
