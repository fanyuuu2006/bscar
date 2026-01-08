import { locations } from "@/libs/locations";

export const Mainsection = () => {
  return (
    <section>
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {locations.map((item) => {
            return (
              <div
                key={item.id}
                className="card flex flex-col overflow-hidden rounded-xl"
              >
                <div className="w-full aspect-video bg-(--muted) flex items-center justify-center">
                  {item.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.imageUrl}
                      alt={`${item.city} ${item.branch}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-zinc-400 gap-2">
                      <span className="text-4xl">🏙️</span>
                      <span className="text-sm font-medium">暫無圖片</span>
                    </div>
                  )}
                </div>
                <div className="p-4 flex flex-col gap-2">
                  <h2 className="text-2xl font-bold">
                    《{item.city}》 {item.branch}
                  </h2>
                  <div className="mt-2">
                    <button className="w-full btn primary px-4 rounded-full py-2">
                      選擇
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
