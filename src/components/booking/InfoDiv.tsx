import { useBooking, Info } from "@/contexts/BookingContext";
import { cn } from "@/utils/className";
import { formatDate } from "@/utils/date";
import { DistributiveOmit } from "fanyucomponents";
import {
  EnvironmentOutlined,
  CarOutlined,
  ClockCircleOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
} from "@ant-design/icons";
import { ChangeEvent, FormEvent } from "react";

type InfoDivProps = DistributiveOmit<
  React.HTMLAttributes<HTMLDivElement>,
  "children"
>;

export const InfoDiv = ({ className, ...rest }: InfoDivProps) => {
  const booking = useBooking();
  const { location, service, time, info } = booking.data;

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Ensure we handle the undefined case for info by defaulting to empty object structure if needed
    // But safely spreading works if we cast or ensure structure
    const currentInfo = booking.data.info || { name: "", phone: "", email: "" };

    booking.setBookingData("info", {
      ...currentInfo,
      [name]: value,
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!info?.name || !info?.phone || !info?.email) {
      alert("請填寫完整聯絡資訊");
      return;
    }
    console.log("Submit Booking:", booking.data);
    alert("預約成功！我們會盡快與您聯繫。");
    booking.resetBooking();
  };

  const items = [
    {
      icon: EnvironmentOutlined,
      label: "預約地點",
      value: location ? `${location.city} | ${location.branch}` : undefined,
      sub: location?.address,
      empty: "尚未選擇地點",
    },
    {
      icon: CarOutlined,
      label: "服務項目",
      value: service?.name,
      sub: service?.description,
      empty: "尚未選擇服務",
    },
    {
      icon: ClockCircleOutlined,
      label: "預約時間",
      value: time ? formatDate("YYYY/MM/DD HH:mm", time) : undefined,
      empty: "尚未選擇時間",
    },
  ];

  // Pick an image to show (Service image takes precedence, then Location)
  const displayImage = service?.image_url || location?.image_url;

  return (
    <div
      className={cn("grid grid-cols-1 md:grid-cols-2 gap-4", className)}
      {...rest}
    >
      <div className="card rounded-2xl overflow-hidden flex flex-col shadow-sm border border-(--border)">
        {/* Header Image */}
        <div className="w-full aspect-video bg-zinc-100 relative overflow-hidden">
          {displayImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={displayImage}
              alt="Booking Preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-(--muted) bg-black/5">
              <CarOutlined className="text-4xl opacity-50" />
            </div>
          )}
          <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent flex items-end p-6">
            <h2 className="text-white text-xl font-bold tracking-wide">
              預約摘要
            </h2>
          </div>
        </div>

        <div className="p-6 flex flex-col gap-6 bg-white">
          {items.map((item, index) => (
            <div key={index} className="flex gap-4 group">
              <div className="shrink-0 w-10 h-10 rounded-full bg-zinc-50 border border-zinc-200 flex items-center justify-center text-(--primary) group-hover:bg-(--primary) group-hover:text-white group-hover:border-(--primary) transition-all duration-300 shadow-sm">
                <item.icon className="text-lg" />
              </div>
              <div className="flex flex-col min-w-0 pt-0.5">
                <span className="text-xs text-(--muted) font-medium mb-0.5 tracking-wider uppercase">
                  {item.label}
                </span>
                <span
                  className={cn(
                    "text-base font-bold text-(--foreground) leading-snug",
                    !item.value && "text-(--muted) font-normal italic"
                  )}
                >
                  {item.value || item.empty}
                </span>
                {item.sub && (
                  <span className="text-xs text-(--muted) mt-1 line-clamp-2 md:line-clamp-none">
                    {item.sub}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card rounded-2xl p-6 md:p-8 h-full border border-(--border) flex flex-col bg-white shadow-sm">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-(--foreground) mb-2">
            填寫聯絡資料
          </h2>
          <p className="text-(--muted)">
            請留下您的聯絡方式，以便我們確認預約詳情。
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6 flex-1">
          <div className="space-y-4">
            {/* Name */}
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="text-sm font-bold text-(--foreground) flex items-center gap-2"
              >
                <UserOutlined /> 姓名
              </label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="請輸入您的姓名"
                className="w-full rounded-xl border border-(--border) bg-zinc-50 px-4 py-3 outline-none focus:border-(--primary) focus:ring-1 focus:ring-(--primary) transition-all placeholder:text-zinc-400"
                value={info?.name || ""}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <label
                htmlFor="phone"
                className="text-sm font-bold text-(--foreground) flex items-center gap-2"
              >
                <PhoneOutlined /> 電話
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                placeholder="請輸入聯絡電話"
                className="w-full rounded-xl border border-(--border) bg-zinc-50 px-4 py-3 outline-none focus:border-(--primary) focus:ring-1 focus:ring-(--primary) transition-all placeholder:text-zinc-400"
                value={info?.phone || ""}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-bold text-(--foreground) flex items-center gap-2"
              >
                <MailOutlined /> 電子郵件
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="example@email.com"
                className="w-full rounded-xl border border-(--border) bg-zinc-50 px-4 py-3 outline-none focus:border-(--primary) focus:ring-1 focus:ring-(--primary) transition-all placeholder:text-zinc-400"
                value={info?.email || ""}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="mt-auto pt-6">
            <button
              type="submit"
              className="btn primary w-full font-bold text-lg py-4 rounded-xl shadow-lg shadow-orange-900/10 hover:shadow-orange-900/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <span>確認預約</span>
            </button>
            <p className="text-center text-xs text-(--muted) mt-4">
              點擊確認預約即表示您同意我們的服務條款與隱私權政策
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
