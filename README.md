# 博斯汽車美研

> 博斯汽車美研官方預約網站，提供顧客線上預約汽車美容服務，並協助門市管理每日預約流程。

---

## Overview

是為 **博斯汽車美研** 打造的官方預約網站，採用 **Next.js App Router** 開發，提供顧客快速完成汽車美容服務預約，同時提供管理後台協助門市管理每日預約資訊。

網站串接後端 REST API，即時取得門市、服務項目、可預約時段與預約資料，讓顧客與門市皆能擁有更便利的使用體驗。

---

## Features

### 顧客端

* 🚗 線上預約汽車美容服務
* 📍 選擇預約門市
* 🧽 選擇服務項目
* 📅 查詢可預約日期與時段
* 📝 填寫聯絡資訊完成預約
* ✅ 查看預約完成資訊
* 📞 聯絡我們（電話、LINE）
* 📱 響應式設計，支援手機與桌面瀏覽

### 管理後台

* 📊 儀表板顯示今日預約概況
* 📅 今日行程與下一筆預約資訊
* 📋 預約資料管理
* 🔍 關鍵字搜尋與條件篩選
* ✏️ 新增、編輯、刪除預約
* 🗓️ 月曆檢視每日預約狀況
* 👤 管理員帳號與門市資訊管理
* 🔐 Token 驗證保護管理功能

---

## Tech Stack

| 類別            | 技術                                  |
| ------------- | ----------------------------------- |
| Frontend      | Next.js 16 (App Router)             |
| UI Library    | React 19                            |
| Language      | TypeScript 5                        |
| Styling       | Tailwind CSS 4                      |
| Data Fetching | SWR                                 |
| Icons         | @ant-design/icons                   |
| Utilities     | clsx、tailwind-merge、fanyucomponents |
| Backend       | REST API                            |
| Deployment    | Vercel                              |

---

## Project Structure

```text
bscar/
├── public/
├── src/
│   ├── app/
│   ├── components/
│   ├── contexts/
│   ├── hooks/
│   ├── libs/
│   ├── styles/
│   ├── types/
│   └── utils/
├── next.config.ts
├── package.json
├── tsconfig.json
└── postcss.config.mjs
```

### 主要目錄

| 目錄                      | 說明                    |
| ----------------------- | --------------------- |
| `src/app/`              | Next.js App Router 頁面 |
| `src/components/`       | UI 元件                 |
| `src/utils/backend.tsx` | API 請求封裝              |
| `src/contexts/`         | React Context         |
| `src/libs/`             | 共用設定                  |
| `public/`               | 網站靜態資源                |

---

## Getting Started

### Prerequisites

* Node.js 18+
* npm / pnpm / yarn / bun
* 可連線之後端 API

### Installation

```bash
git clone <repository-url>

cd bscar

npm install
```

建立 `.env.local`

```env
NEXT_PUBLIC_BACKEND_URL=https://your-backend-api.example.com
```

啟動開發伺服器

```bash
npm run dev
```

瀏覽：

```plaintxt
http://localhost:3000
```

### Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

---

## Environment Variables

| Name                      | Description     |
| ------------------------- | --------------- |
| `NEXT_PUBLIC_BACKEND_URL` | 後端 API Base URL |

---

## Deployment

本專案可部署於任何支援 **Next.js** 的平台。

推薦部署至 **Vercel**：

1. Push Repository 至 GitHub
2. 匯入至 Vercel
3. 設定 `NEXT_PUBLIC_BACKEND_URL`
4. Deploy

---

## About This Project

本專案為 **博斯汽車美研** 官方網站的一部分，主要提供：

* 顧客線上預約汽車美容服務
* 門市管理每日預約資訊
* 提升預約流程效率與使用體驗

---

## License

本專案採用 MIT License。
