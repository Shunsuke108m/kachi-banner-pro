/**
 * LP分析の構造化スキーマ（api / web 共通）
 * プロンプトや出力フォーマットを変えるときは、この型とパーサーを1箇所で直す。
 */

/** LP分析Markdownを項目ごとに分割した構造 */
export interface LpStructuredContext {
  /** コアバリュー (一言で言うと何を変える商品か) */
  coreValue: string;
  /** メインターゲット（誰がメインの顧客になり得るか） */
  mainTarget: string;
  /** 機能的ベネフィット (スペック・事実) */
  functionalBenefits: string[];
  /** 情緒的ベネフィット (得られる安心感や優越感) */
  emotionalBenefits: string[];
  /** 競合優位性 (なぜ他ではなくこれを選ぶべきか) */
  competitiveAdvantage: string;
}

export const EMPTY_STRUCTURED_CONTEXT: LpStructuredContext = {
  coreValue: "",
  mainTarget: "",
  functionalBenefits: [],
  emotionalBenefits: [],
  competitiveAdvantage: "",
};

/** 次のセクション見出し（- **）が現れるまでがこのセクションの範囲 */
const SECTION_HEADER = /^\s*-\s+\*\*/;

/**
 * 行インデックス start から、次のセクション見出しまたは終端までを収集する。
 * "  - テキスト" 形式は配列の1要素、"  - " で始まらない行は前の要素に続けるか無視。
 */
function collectLinesUntilNextSection(lines: string[], start: number): string[] {
  const items: string[] = [];
  for (let i = start; i < lines.length; i++) {
    const line = lines[i];
    if (SECTION_HEADER.test(line)) break;
    const bullet = line.match(/^\s*-\s+(.+)$/);
    if (bullet) {
      items.push(bullet[1].trim());
    }
  }
  return items;
}

/**
 * 見出し行のコロン以降＋直後行が1行だけのとき用（コアバリュー・ターゲット・競合優位の単文）
 */
function pickLineAfterColon(lines: string[], predicate: (line: string) => boolean): string | undefined {
  const idx = lines.findIndex(predicate);
  if (idx === -1) return undefined;
  const line = lines[idx];
  const afterColon = line.split(":").slice(1).join(":").trim();
  if (afterColon) return afterColon;
  // 見出し行に本文がなければ、次の行が単文ならそれを使う（競合優位性が複数行のときは collect に任せる）
  const next = lines[idx + 1];
  if (next && /^\s*-\s+/.test(next)) return undefined; // リストなら collect で別途取得
  return next?.trim() || undefined;
}

/**
 * LP分析Markdownから各項目を抽出する。
 * プロンプトのフォーマットに合わせてここだけ調整すればよい。
 * - コアバリュー・ターゲット: 見出し行のコロン後、または直後1行
 * - 機能的/情緒的ベネフィット・競合優位性: 見出しの次行から次のセクションまでの "  - 〜" を配列で取得
 */
export function parseLpAnalysisMarkdown(markdown: string): LpStructuredContext {
  const ctx: LpStructuredContext = { ...EMPTY_STRUCTURED_CONTEXT };
  if (!markdown.trim()) return ctx;

  const lines = markdown.split(/\r?\n/);

  ctx.coreValue =
    pickLineAfterColon(lines, (l) => l.includes("コアバリュー") && l.includes("**")) ?? ctx.coreValue;
  ctx.mainTarget =
    pickLineAfterColon(lines, (l) => l.includes("ターゲット") && l.includes("**")) ?? ctx.mainTarget;

  const funcIdx = lines.findIndex((l) => l.includes("機能的ベネフィット") && l.includes("**"));
  if (funcIdx !== -1) {
    const list = collectLinesUntilNextSection(lines, funcIdx + 1);
    if (list.length > 0) ctx.functionalBenefits = list;
  }

  const emotIdx = lines.findIndex((l) => l.includes("情緒的ベネフィット") && l.includes("**"));
  if (emotIdx !== -1) {
    const list = collectLinesUntilNextSection(lines, emotIdx + 1);
    if (list.length > 0) ctx.emotionalBenefits = list;
  }

  const compIdx = lines.findIndex((l) => l.includes("競合優位性") && l.includes("**"));
  if (compIdx !== -1) {
    const list = collectLinesUntilNextSection(lines, compIdx + 1);
    if (list.length > 0) {
      ctx.competitiveAdvantage = list.join("\n");
    } else {
      const single = pickLineAfterColon(lines, (l) => l.includes("競合優位性") && l.includes("**"));
      if (single) ctx.competitiveAdvantage = single;
    }
  }

  return ctx;
}
