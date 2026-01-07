import Link from "next/link";

export const Herosection = () => {
  return (
    <section className="w-full h-screen">
      <div className="bg-black w-full h-full">
        <div>
          <Link href={"/booking"}>前往預約</Link>
        </div>
      </div>
    </section>
  );
};
