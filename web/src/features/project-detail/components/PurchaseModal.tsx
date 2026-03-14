import { useAtom, useSetAtom } from "jotai";
import { X, CheckCircle2, Download, CreditCard, ShieldCheck, Sparkles } from "lucide-react";
import { purchaseTargetAtom, generationsAtom, purchaseCompleteAtom, markBannerPurchased } from "../stores";
import { usePurchaseBanner } from "../api";

const PURCHASE_BENEFITS = [
  "ウォーターマークなしの高解像度画像",
  "PNG / JPG 形式でダウンロード",
  "商用利用・広告配信OK",
  "購入後すぐにダウンロード可能",
] as const;

const SuccessView = ({ onClose }: { onClose: () => void }) => (
  <div className="p-8 text-center">
    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
      <CheckCircle2 size={32} className="text-emerald-500" />
    </div>
    <h2 className="text-slate-900 mb-2" style={{ fontSize: "20px", fontWeight: 700 }}>購入完了！</h2>
    <p className="text-slate-500 mb-6" style={{ fontSize: "14px" }}>高画質バナーのダウンロードが可能になりました</p>
    <button
      onClick={onClose}
      className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl py-3 transition-colors"
      style={{ fontSize: "14px" }}
    >
      <Download size={16} />バナーをダウンロード
    </button>
    <button onClick={onClose} className="w-full mt-2 text-slate-400 hover:text-slate-600 py-2 transition-colors" style={{ fontSize: "13px" }}>
      閉じる
    </button>
  </div>
);

export const PurchaseModal = () => {
  const [purchaseTarget, setPurchaseTarget] = useAtom(purchaseTargetAtom);
  const [purchaseComplete, setPurchaseComplete] = useAtom(purchaseCompleteAtom);
  const setGenerations = useSetAtom(generationsAtom);
  const { mutate: purchase, isPending } = usePurchaseBanner();

  if (!purchaseTarget) return null;

  const handleClose = () => {
    setPurchaseTarget(null);
    setPurchaseComplete(false);
  };

  const handleConfirm = () => {
    purchase(purchaseTarget.id, {
      onSuccess: () => {
        setPurchaseComplete(true);
        markBannerPurchased(setGenerations, purchaseTarget.id);
      },
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
        {purchaseComplete ? (
          <SuccessView onClose={handleClose} />
        ) : (
          <>
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-slate-900" style={{ fontSize: "18px", fontWeight: 700 }}>バナーを購入</h2>
              <button onClick={handleClose} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <X size={16} />
              </button>
            </div>
            <div className="p-6">
              <div className="relative rounded-xl overflow-hidden aspect-video mb-5 bg-gray-100">
                <img src={purchaseTarget.imageUrl} alt="購入バナー" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent flex items-end p-3">
                  <div>
                    <p className="text-white" style={{ fontSize: "13px", fontWeight: 600 }}>{purchaseTarget.title}</p>
                    <p className="text-white/70" style={{ fontSize: "11px" }}>{purchaseTarget.appealType}</p>
                  </div>
                </div>
              </div>
              <div className="bg-violet-50 rounded-xl p-4 mb-5 flex items-center justify-between">
                <div>
                  <p className="text-slate-600" style={{ fontSize: "13px" }}>高画質バナー（透かしなし）</p>
                  <p className="text-slate-400 mt-0.5" style={{ fontSize: "11px" }}>PNG形式・1200×628px・商用利用可</p>
                </div>
                <div className="text-right">
                  <p className="text-violet-700" style={{ fontSize: "24px", fontWeight: 700 }}>¥500</p>
                  <p className="text-slate-400" style={{ fontSize: "11px" }}>税込</p>
                </div>
              </div>
              <div className="space-y-2 mb-5">
                {PURCHASE_BENEFITS.map((benefit) => (
                  <div key={benefit} className="flex items-center gap-2 text-slate-600" style={{ fontSize: "13px" }}>
                    <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />{benefit}
                  </div>
                ))}
              </div>
              <button
                onClick={handleConfirm}
                disabled={isPending}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 disabled:from-gray-300 disabled:to-gray-300 text-white rounded-xl py-3.5 transition-all shadow-lg shadow-violet-200"
                style={{ fontSize: "15px" }}
              >
                {isPending ? <><Sparkles size={16} className="animate-pulse" />決済処理中...</> : <><CreditCard size={16} />¥500 で購入する</>}
              </button>
              <div className="flex items-center justify-center gap-1.5 mt-3 text-slate-400" style={{ fontSize: "11px" }}>
                <ShieldCheck size={12} />Stripe による安全な決済
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
