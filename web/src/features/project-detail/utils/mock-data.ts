import { type GeneratedBanner } from "../types";

export const MOCK_BANNERS: GeneratedBanner[] = [
  {
    id: "b1",
    title: "パターン A：数字訴求型",
    appealType: "社会的証明 × 具体的数字",
    appealScore: 94,
    ctrPrediction: "3.8%",
    cvrPrediction: "7.2%",
    imageUrl:
      "https://images.unsplash.com/photo-1734436387925-e8d4703c8539?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
    analysis: {
      eyeCatch: "「-5kg」の大きな数字とビフォーアフターのコントラストで視線を集める。赤×白の高コントラスト配色。",
      readability: "「飲むだけ30日」の短いコピーで瞬時に理解できる。ベネフィットが明確で読み進めさせる設計。",
      tapIncentive: "「今すぐ無料お試し」の緊急性CTAと残り在庫数を組み合わせ、タップを促進。",
      cvrBoost: "継続率92%・累計10万人突破の社会的証明と返金保証バッジでリスク解消。",
    },
    isPurchased: false,
  },
  {
    id: "b2",
    title: "パターン B：感情訴求型",
    appealType: "ペイン×ゲイン共鳴型",
    appealScore: 89,
    ctrPrediction: "3.2%",
    cvrPrediction: "8.5%",
    imageUrl:
      "https://images.unsplash.com/photo-1760621393386-3906922b0b78?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
    analysis: {
      eyeCatch: "「もう諦めないで」の共感コピーと笑顔の女性画像でスクロールを止める。",
      readability: "悩みからベネフィットへの感情の流れを3ステップで表現し、読者を引き込む。",
      tapIncentive: "「同じ悩みを持つ方へ」の限定感とLINE公式アカウント追加の低ハードルCTA。",
      cvrBoost: "ビフォーアフターの体験談と星5レビューで信頼感を高め、CVR向上を狙う。",
    },
    isPurchased: false,
  },
  {
    id: "b3",
    title: "パターン C：権威訴求型",
    appealType: "専門家推薦 × 希少性",
    appealScore: 86,
    ctrPrediction: "2.9%",
    cvrPrediction: "9.1%",
    imageUrl:
      "https://images.unsplash.com/photo-1759670686406-9fad6ff65358?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
    analysis: {
      eyeCatch: "医師・栄養士監修ロゴと白衣の専門家画像で権威性を瞬時に訴求。",
      readability: "「なぜ他のサプリと違うのか」の疑問形で興味喚起し、説明文へ誘導。",
      tapIncentive: "「定員100名限定・今月のみ」の希少性+「定価から50%OFF」の損失回避で行動を促す。",
      cvrBoost: "臨床試験データと3つの安全認証バッジで不安を解消し、高CVRを実現。",
    },
    isPurchased: false,
  },
];
