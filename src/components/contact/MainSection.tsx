import Image from "next/image";
import { PhoneFilled } from "@ant-design/icons";

export const Mainsection = () => {
  return (
    <section className="container py-12 md:py-24">
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-12 md:flex-row md:justify-center md:gap-24">
        {/* 左側：聯絡電話 */}
        <div className="flex flex-col items-center gap-6 text-center md:items-start md:text-left">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-(--foreground)">
              聯絡我們
            </h1>
            <p className="text-(--muted)">如果有任何問題，歡迎隨時聯繫</p>
          </div>

          <a
            href="tel:0975775890"
            className="group flex flex-col items-center gap-2 transition-opacity hover:opacity-80 md:items-start"
          >
            <span className="flex items-center gap-2 text-xl font-medium text-(--secondary)">
              <PhoneFilled className="text-(--primary)" />
              聯絡電話
            </span>
            <span className="text-4xl font-bold tracking-wider text-(--primary) group-hover:underline">
              0975-775-890
            </span>
          </a>
        </div>

        {/* 分隔線 (手機隱藏) */}
        <div className="hidden h-48 w-px bg-(--border) md:block"></div>

        {/* 右側：QR Code */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative aspect-square w-48 overflow-hidden rounded-lg bg-white p-2 shadow-md md:w-56">
            <Image
              src="/images/contact/qrcode.jpg"
              alt="Line QR Code"
              fill
              className="object-contain"
              sizes="(max-width: 768px) 192px, 224px"
            />
          </div>
          <p className="font-medium text-(--secondary)">
            掃描加入 LINE 好友
          </p>
        </div>
      </div>
    </section>
  );
};