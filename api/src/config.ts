/**
 * API 全体で共有する設定値・環境変数キーをまとめたファイル。
 * モデル変更やタイムアウト調整を行うときは、このファイルだけを見ればよい状態を目指す。
 */

// ========================
// OpenAI 関連設定
// ========================

/**
 * Chat Completions API のエンドポイント
 * - モデルを変えるだけなら通常ここは変えなくてよい
 */
export const OPENAI_CHAT_URL = "https://api.openai.com/v1/chat/completions";

/**
 * LP分析で使用するデフォルトのモデル
 * - 将来 gpt-4.1 などに差し替える場合はここを変更する
 */
export const OPENAI_MODEL = "gpt-4o-mini";

/**
 * 1回のLP分析で生成を許可する最大トークン数
 * - 長すぎるMarkdownを防ぐための上限
 */
export const OPENAI_MAX_TOKENS = 4096;

/**
 * OpenAI の API キーを格納する環境変数名
 * - .dev.vars / wrangler secret put のキーと一致させること
 */
export const ENV_OPENAI_API_KEY = "OPENAI_API_KEY" as const;

// ========================
// LP 分析用チューニング値
// ========================

/**
 * リクエストで受け付ける LP URL 文字列の最大長
 */
export const MAX_LP_URL_LENGTH = 2_000;

/**
 * 取得した LP HTML のうち、LLM に渡す最大文字数
 * - LP 全文を渡すとトークン数が膨れ上がるため、先頭部分だけを利用する
 */
export const LP_HTML_SLICE = 15_000;

/**
 * LP 取得時のタイムアウト（ミリ秒）
 */
export const LP_FETCH_TIMEOUT_MS = 15_000;

/**
 * リクエスト body.lpInput の最大長
 * - URL 以外が来たときでも、異常な長さの入力を弾くための保険
 */
export const MAX_LP_INPUT_LENGTH = 50_000;

