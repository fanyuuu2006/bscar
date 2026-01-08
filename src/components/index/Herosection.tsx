import Link from "next/link";

export const Herosection = () => {
  return (
    <section
      className="w-full h-screen"
    >
      <div className="container h-full flex items-center justify-center">
        <Link
          className="text-3xl btn primary py-3 px-6 rounded-full"
          href={"/booking"}
        >
          前往預約
        </Link>
      </div>
    </section>
  );
};
