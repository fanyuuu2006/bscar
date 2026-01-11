import { Service } from "@/contexts/BookingContext";

export const services: Service[] = [
  {
    id: "1",
    name: "精緻洗車",
    price: "1500 / 1800 / 2000",
    description:
      "全車細部刷清、ABC柱細部清洗、鋁圈表面、內壁、胎壁、內規板細部清洗、柏油、鐵粉、工業落塵去除、內裝高溫蒸汽殺菌、瑞士 Swissvax 手工棕櫚封體、全車塑料養護、胎壁養護",
  },
  {
    id: "2",
    name: "小美容",
    price: "5000 ~ 7000",
    description:
      "精緻洗車、全車鈑金淺層拋光、板金亮度提升、瑞士 Swissvax 手工棕櫚封體",
  },
  {
    id: "3",
    name: "大美容",
    price: "10000 ~ 15000",
    description:
      "精緻洗車、全車鈑金深層拋光、細紋、太陽紋、去除輕微刮傷修復、車身板金亮度恢復原廠亮度、瑞士 Swissvax 手工棕櫚封體",
  },
  {
    id: "4",
    name: "鍍膜",
    price: "15000 ~ 38000",
    description:
      "精緻洗車、大美容、英國 GTECHNIQ C1EXD 兩年期鍍膜、送全車玻璃鍍膜、塑膠防刮材質鍍膜",
  },
];