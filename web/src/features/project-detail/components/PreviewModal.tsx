import { useAtom, useSetAtom } from "jotai";
import { X, Lock } from "lucide-react";
import { previewBannerAtom, purchaseTargetAtom } from "../stores";

export const PreviewModal = () => {
  const [previewBanner, setPreviewBanner] = useAtom(previewBannerAtom);
  const setPurchaseTarget = useSetAtom(purchaseTargetAtom);

  if (!previewBanner) return null;

  const handlePurchaseClick = () => {
    setPreviewBanner(null);
    setPurchaseTarget(previewBanner);
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={() => setPreviewBanner(null)}
    >
      <div className="relative max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={() => setPreviewBanner(null)}
          className="absolute -top-10 right-0 w-8 h-8 flex items-center justify-center text-white/70 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        <div className="relative rounded-2xl overflow-hidden">
          <img
            src={previewBanner.imageUrl}
            alt="プレビュー"
            className={`w-full ${previewBanner.isPurchased ? "" : "blur-md brightness-50"}`}
          />
          {!previewBanner.isPurchased && (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div
                className="text-white/30 select-none mb-6"
                style={{ fontSize: "48px", fontWeight: 700, transform: "rotate(-20deg)", letterSpacing: "12px" }}
              >
                SAMPLE
              </div>
              <button
                onClick={handlePurchaseClick}
                className="flex items-center gap-2 bg-white text-violet-700 hover:bg-violet-50 rounded-xl px-6 py-3 transition-colors shadow-xl"
                style={{ fontSize: "14px", fontWeight: 600 }}
              >
                <Lock size={15} />¥500 で購入して高画質を確認
              </button>
            </div>
          )}
        </div>

        <div className="mt-3 text-center">
          <p className="text-white/80" style={{ fontSize: "14px", fontWeight: 500 }}>{previewBanner.title}</p>
          <p className="text-white/50" style={{ fontSize: "12px" }}>{previewBanner.appealType}</p>
        </div>
      </div>
    </div>
  );
};
