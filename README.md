# BSCar · 博斯汽車美研

> 專業汽車美容預約平台 — 面向顧客的線上預約流程與門市管理後台

---

## Overview

**BSCar（博斯汽車美研）** 是一套以 Next.js App Router 建置的汽車美容服務預約 Web 應用。前端負責顧客端的預約體驗與門市端的營運管理，所有資料透過外部 REST API 取得與提交。

### 解決的問題

- 顧客無需電話排隊，即可依步驟完成地點、服務、時段與個人資料的線上預約
- 各門市管理員可在後台即時掌握待處理預約、今日行程與下一筆預約
- 以行事曆與篩選工具集中管理預約狀態，降低人工對帳成本

### 適合對象

- 汽車美容、洗車、鍍膜等需要**分時段預約**的實體服務業
- 希望以 Next.js 快速部署現代化預約官網的前端團隊

---

## Features

### 顧客端

- **多步驟預約流程**：依序選擇地點 → 服務項目 → 可預約時段 → 填寫聯絡資料
- **即時時段查詢**：依日期與門市動態取得可預約時段，避免重複預約
- **預約確認頁**：提交後顯示預約詳情，方便顧客留存紀錄
- **聯絡我們**：提供電話直撥與 LINE QR Code，降低溝通門檻
- **響應式介面**：支援桌面與行動裝置瀏覽

### 管理後台

- **儀表板總覽**：待處理預約數、今日預約總數、下一筆預約倒數與今日行程列表
- **預約管理**：關鍵字搜尋、狀態／服務篩選、分頁、新增／編輯／刪除預約
- **行事曆檢視**：月曆呈現各日預約概況，點選日期查看當日詳細行程
- **帳號與門市設定**：檢視管理員帳號資訊與所屬門市資料
- **Token 驗證保護**：後台路由需登入後方可存取

---

## Tech Stack

| 類別 | 技術 |
| --- | --- |
| 前端框架 | [Next.js 16](https://nextjs.org/)（App Router） |
| UI 函式庫 | [React 19](https://react.dev/) |
| 語言 | [TypeScript 5](https://www.typescriptlang.org/) |
| 樣式 | [Tailwind CSS 4](https://tailwindcss.com/) |
| 資料請求 | [SWR](https://swr.vercel.app/) |
| 圖示 | [@ant-design/icons](https://ant.design/components/icon) |
| 工具函式 | `clsx`、`tailwind-merge`、`fanyucomponents` |
| API 串接 | 外部 REST API（`/v1/data/*`、`/v1/admin/*`） |
| 部署 | [Vercel](https://vercel.com/)（推薦）或任何支援 Node.js 的平台 |

---

## Project Structure

```
bscar/
├── public/                     # 靜態資源（favicon、聯絡 QR Code 等）
├── src/
│   ├── app/                    # Next.js App Router 路由
│   │   ├── page.tsx            # 首頁
│   │   ├── layout.tsx          # 根 Layout（Header、Metadata）
│   │   ├── booking/            # 顧客預約流程（多步驟動態路由）
│   │   ├── contact/            # 聯絡我們
│   │   └── admin/              # 管理後台（登入、儀表板、預約、行事曆、設定）
│   ├── components/             # UI 元件
│   │   ├── index/              # 首頁區塊
│   │   ├── booking/            # 預約流程元件
│   │   ├── contact/            # 聯絡頁元件
│   │   └── admin/              # 後台元件（表格、行事曆、側邊欄等）
│   ├── contexts/               # React Context（Admin、BookingModal）
│   ├── hooks/                  # 自訂 Hooks（useAdminToken、useModal）
│   ├── libs/                   # 站點設定、路由常數、環境變數
│   ├── styles/                 # 全域 CSS（globals.css、burger.css）
│   ├── types/                  # TypeScript 型別定義
│   └── utils/                  # 工具函式（API 封裝、日期、樣式合併）
├── next.config.ts
├── postcss.config.mjs
├── tsconfig.json
└── package.json
```

### 重要目錄說明

| 目錄 | 用途 |
| --- | --- |
| `src/app/` | 定義所有頁面路由與 Layout，遵循 Next.js App Router 慣例 |
| `src/components/` | 可重用 UI 元件，依功能域（booking、admin 等）分組 |
| `src/utils/backend.tsx` | 封裝所有後端 API 請求（顧客端與管理端） |
| `src/libs/` | 站點標題、導覽路由、預約步驟常數等共用設定 |
| `src/contexts/` | 跨元件狀態管理（管理員登入、預約 Modal） |

---

## Getting Started

### 前置需求

- [Node.js](https://nodejs.org/) 18.18 或以上
- npm（或 pnpm / yarn / bun）
- 可連線的後端 API 服務

### 安裝與啟動

```bash
# 1. 複製專案
git clone <repository-url>
cd bscar

# 2. 安裝依賴
npm install

# 3. 設定環境變數（見下方章節）
cp .env.example .env.local   # 若無 .env.example，請手動建立 .env.local

# 4. 啟動開發伺服器
npm run dev
```

開啟 [http://localhost:3000](http://localhost:3000) 即可預覽。

### 其他指令

```bash
# 程式碼 Lint
npm run lint

# 建置正式版
npm run build

# 啟動正式版（需先 build）
npm run start
```

---

## Environment Variables

在專案根目錄建立 `.env.local`，並設定以下變數：

```env
# 後端 API 根 URL（必填）
NEXT_PUBLIC_BACKEND_URL=https://your-backend-api.example.com
```

| 變數 | 必填 | 說明 |
| --- | --- | --- |
| `NEXT_PUBLIC_BACKEND_URL` | ✅ | 後端 REST API 的 Base URL，前端所有資料請求皆由此衍生 |

> **注意**：以 `NEXT_PUBLIC_` 為前綴的變數會暴露至瀏覽器端，請勿存放敏感金鑰。

---

## Deployment

### Vercel（推薦）

1. 將 Repository 推送至 GitHub
2. 在 [Vercel](https://vercel.com/new) 匯入專案
3. 於 **Environment Variables** 設定 `NEXT_PUBLIC_BACKEND_URL`
4. 部署完成後即可取得正式網址

Vercel 會自動偵測 Next.js 專案並執行 `npm run build`。

### 其他平台

任何支援 Node.js 18+ 且能執行 `next start` 的平台皆可部署，例如：

- Docker + Node.js 容器
- AWS Amplify
- Railway / Render

部署前請確認：

1. 已設定 `NEXT_PUBLIC_BACKEND_URL` 指向正式環境 API
2. 後端 API 已設定正確的 CORS，允許前端網域存取
3. 執行 `npm run build` 無錯誤

---

## License

本專案採 [MIT License](LICENSE) 授權。
