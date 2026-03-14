import { X, Trash2 } from "lucide-react";

interface DeleteProjectModalProps {
  isOpen: boolean;
  projectName: string;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
}

export const DeleteProjectModal = ({
  isOpen,
  projectName,
  onClose,
  onConfirm,
  isDeleting,
}: DeleteProjectModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-slate-900" style={{ fontSize: "18px", fontWeight: 700 }}>
            プロジェクトを削除
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
            aria-label="閉じる"
          >
            <X size={16} />
          </button>
        </div>
        <div className="p-6">
          <p className="text-slate-600 mb-4" style={{ fontSize: "14px", lineHeight: 1.6 }}>
            「<span className="font-medium text-slate-800">{projectName}</span>」を削除しますか？この操作は取り消せません。
          </p>
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={isDeleting}
              className="px-4 py-2.5 text-slate-600 hover:bg-gray-100 rounded-xl transition-colors disabled:opacity-50"
              style={{ fontSize: "14px" }}
            >
              キャンセル
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isDeleting}
              className="flex items-center gap-2 px-4 py-2.5 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white rounded-xl transition-colors"
              style={{ fontSize: "14px" }}
            >
              <Trash2 size={16} />
              {isDeleting ? "削除中…" : "削除する"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
