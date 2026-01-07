export const title = "博斯汽車美容";
export const description =
  "專業汽車美容服務，讓您的愛車煥然一新。提供內外清潔、打蠟、鍍膜等多種服務，滿足您的需求。";

type Route = {
  label: string;
  url: string;
  sub?: Route[];
};

export const routes: Route[] = [
  { label: "首頁", url: "/" },
  {
    label: "預約",
    url: "/booking",
  },
];
