export interface Project {
  id: string;
  name: string;
  lpUrl: string;
  createdAt: string;
  status: "completed" | "generating" | "failed";
  bannerCount: number;
  purchasedCount: number;
  thumbnail: string;
}
