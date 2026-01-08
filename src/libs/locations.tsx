export type Location = {
  id: string;
  city: string; // 例如：台北
  branch: string; // 例如：信義店
  imageUrl?: string; // 若為 undefined 則顯示預設圖標
};

export const locations: Location[] = [
  {
    id: "1",
    city: "竹縣",
    branch: "成功店",
  },
  {
    id: "2",
    city: "竹市",
    branch: "頂埔店",
  },
  {
    id: "3",
    city: "竹縣",
    branch: "十興店",
  },
];
