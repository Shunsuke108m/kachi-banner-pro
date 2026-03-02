import { type ElementType } from "react";
import { X, Plus } from "lucide-react";

interface Props {
  title: string;
  items: string[];
  color: "red" | "emerald";
  icon: ElementType;
  onUpdate: (items: string[]) => void;
}

export const Step2PainDesirePanel = ({ title, items, color, icon: Icon, onUpdate }: Props) => {
  const dotColor = color === "red" ? "bg-red-400" : "bg-emerald-400";
  const iconColor = color === "red" ? "text-red-500" : "text-emerald-500";

  const handleItemChange = (idx: number, value: string) => {
    const next = [...items];
    next[idx] = value;
    onUpdate(next);
  };

  const handleRemove = (idx: number) => {
    onUpdate(items.filter((_, i) => i !== idx));
  };

  const handleAdd = () => onUpdate([...items, ""]);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <h3 className="text-slate-800 mb-4 flex items-center gap-2" style={{ fontSize: "14px", fontWeight: 600 }}>
        <Icon size={15} className={iconColor} />
        {title}
      </h3>
      <div className="space-y-2">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2 group">
            <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColor}`} />
            <input
              type="text"
              value={item}
              onChange={(e) => handleItemChange(idx, e.target.value)}
              className="flex-1 text-slate-600 bg-transparent border-b border-transparent focus:border-gray-200 focus:outline-none py-0.5 transition-all"
              style={{ fontSize: "12px" }}
            />
            <button
              onClick={() => handleRemove(idx)}
              className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400 transition-all"
            >
              <X size={12} />
            </button>
          </div>
        ))}
        <button
          onClick={handleAdd}
          className="flex items-center gap-1.5 text-gray-400 hover:text-violet-500 transition-colors mt-1"
          style={{ fontSize: "12px" }}
        >
          <Plus size={13} />追加
        </button>
      </div>
    </div>
  );
};
