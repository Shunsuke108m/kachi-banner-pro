import { useMutation } from "@tanstack/react-query";

const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

const analyzeLp = async (_url: string) => {
  await delay(2800);
};

const generateBanners = async (_banners: string[]) => {
  await delay(3500);
};

export const useAnalyzeLp = () =>
  useMutation({ mutationFn: analyzeLp });

export const useGenerateBanners = () =>
  useMutation({ mutationFn: generateBanners });
