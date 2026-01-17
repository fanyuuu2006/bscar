import { Service } from "@/contexts/BookingContext";

export const services: Service[] = [
  {
    id: "1",
    name: "精緻洗車",
    description:
      "價格：1500 / 1800 / 2000 (小型 / 中型 / 大型 休旅 商務七人)\n全車細部刷清、ABC柱細部清洗、鋁圈表面、內壁、胎壁、內規板細部清洗、柏油、鐵粉、工業落塵去除、內裝高溫蒸汽殺菌、瑞士 Swissvax 手工棕櫚封體、全車塑料養護、胎壁養護",
    duration: 60,
  },
  {
    id: "2",
    name: "小美容",
    description:
      "價格：5000 ~ 7000 (看車報價)\n精緻洗車、全車鈑金淺層拋光、板金亮度提升、瑞士 Swissvax 手工棕櫚封體",
    duration: 60,
  },
  {
    id: "3",
    name: "大美容",
    description:
      "價格：10000 ~ 15000 (看車報價)\n精緻洗車、全車鈑金深層拋光、細紋、太陽紋、去除輕微刮傷修復、車身板金亮度恢復原廠亮度、瑞士 Swissvax 手工棕櫚封體",
    duration: 60,
  },
  {
    id: "4",
    name: "鍍膜",
    description:
      "價格：15000 ~ 38000 (看車報價)\n精緻洗車、大美容、英國 GTECHNIQ C1EXD 兩年期鍍膜、送全車玻璃鍍膜、塑膠防刮材質鍍膜",
    duration: 60,
  },
];
