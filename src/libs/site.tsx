export const title = "博斯汽車美研";
export const description =
  "博斯汽車美研 - 提供專業汽車美容與維護服務，讓您的愛車煥然一新，持久如新。";

type Route = {
  label: string;
  url: string;
  isActive?: (path: string) => boolean;
  sub?: Route[];
};

export const routes: Route[] = [
  { label: "首頁", url: "/", isActive: (path) => path === "/" },
  {
    label: "預約",
    url: "/booking",
  },
];
