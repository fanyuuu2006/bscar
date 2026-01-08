import Link from "next/link";

export const Herosection = () => {
  return (
    <section className="w-full h-screen">
      <div>
        <Link className="btn" href={"/booking"}>前往預約</Link>
      </div>
    </section>
  );
};
