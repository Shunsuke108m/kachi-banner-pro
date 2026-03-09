/**
 * 開発時: .env に VITE_API_BASE_URL=http://localhost:8787 を設定
 * 本番: デプロイした Workers の URL を設定
 */
export const getApiBaseUrl = (): string =>
  (import.meta as unknown as { env?: { VITE_API_BASE_URL?: string } }).env?.VITE_API_BASE_URL?.trim() ||
  "http://localhost:8787";
