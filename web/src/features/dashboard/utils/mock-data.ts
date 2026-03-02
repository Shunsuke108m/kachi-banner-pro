import { type Project } from "../types";

export const MOCK_PROJECTS: Project[] = [
  {
    id: "1",
    name: "ダイエットサプリ「スリムエース」",
    lpUrl: "https://slim-ace.example.com",
    createdAt: "2026-02-28",
    status: "completed",
    bannerCount: 3,
    purchasedCount: 2,
    thumbnail:
      "https://images.unsplash.com/photo-1734436387925-e8d4703c8539?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80",
  },
  {
    id: "2",
    name: "オンライン英会話「EnglishNow」",
    lpUrl: "https://englishnow.example.com",
    createdAt: "2026-02-26",
    status: "completed",
    bannerCount: 3,
    purchasedCount: 1,
    thumbnail:
      "https://images.unsplash.com/photo-1762330917056-e69b34329ddf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80",
  },
  {
    id: "3",
    name: "美容液「グロウセラム」",
    lpUrl: "https://glow-serum.example.com",
    createdAt: "2026-02-24",
    status: "completed",
    bannerCount: 3,
    purchasedCount: 2,
    thumbnail:
      "https://images.unsplash.com/photo-1760621393386-3906922b0b78?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80",
  },
  {
    id: "4",
    name: "不動産投資セミナー",
    lpUrl: "https://realestate-seminar.example.com",
    createdAt: "2026-02-22",
    status: "completed",
    bannerCount: 3,
    purchasedCount: 2,
    thumbnail:
      "https://images.unsplash.com/photo-1759670686406-9fad6ff65358?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80",
  },
];

export const STATS = [
  { label: "今月の生成バナー", value: "12", unit: "本", colorKey: "violet" as const },
  { label: "購入済みバナー", value: "7", unit: "本", colorKey: "emerald" as const },
  { label: "推定節約額", value: "¥210,000", unit: "〜", colorKey: "amber" as const },
  { label: "平均生成時間", value: "1.5", unit: "分", colorKey: "blue" as const },
];
