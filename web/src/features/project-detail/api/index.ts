import { useMutation } from "@tanstack/react-query";

const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

const purchaseBanner = async (_bannerId: string) => {
  await delay(2000);
};

export const usePurchaseBanner = () =>
  useMutation({ mutationFn: purchaseBanner });
