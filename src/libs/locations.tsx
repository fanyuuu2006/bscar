export type Location = {
  id: string;
  city: string; // 例如：台北
  branch: string; // 例如：信義店
  address: string;
  imageUrl?: string; // 若為 undefined 則顯示預設圖標
};

export const locations: Location[] = [
  {
    id: "1",
    city: "竹縣",
    branch: "成功店",
    address: "新竹縣竹北市成功一街88號",
    imageUrl: "/images/locations/1.jpg",
  },
  {
    id: "2",
    city: "竹市",
    branch: "頂埔店",
    address: "新竹市頂埔路338號",
    imageUrl: "/images/locations/2.jpg",
  },
  {
    id: "3",
    city: "竹縣",
    branch: "十興店",
    address: "新竹縣竹北市十興路一段616號",
    imageUrl: "/images/locations/3.jpg",
  },
];
