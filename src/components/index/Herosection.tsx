import Link from "next/link";

export const Herosection = () => {
  return (
    <section className="w-full h-screen flex">
      <div className="m-auto">
        <Link className="btn secondary py-2 px-4 rounded-full" href={"/booking"}>
          前往預約
        </Link>
      </div>
    </section>
  );
};
