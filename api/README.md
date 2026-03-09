# kachi-banner-pro API (Cloudflare Workers)

LP 分析・バナー生成用の API。Hono + Cloudflare Workers で動作します。

## セットアップ

```bash
pnpm install
```

## ローカル開発

1. **OpenAI API キー（必須）**: Wrangler は **ルートの `.env` を読まない**ため、`api/.dev.vars` にキーを用意する必要があります。
   - ルートに `.env` がある場合、次のコマンドでコピーできます（プロジェクトルートで実行）:
   ```bash
   grep OPENAI_API_KEY .env 2>/dev/null | head -1 > api/.dev.vars
   ```
   - または手動で `api/.dev.vars` を作成し、1行だけ書く:
   ```
   OPENAI_API_KEY=sk-xxxxxxxx（あなたのキー）
   ```

2. **API を起動**:

   ```bash
   pnpm dev
   ```

   デフォルトで http://localhost:8787 で起動します。

3. **フロントエンド**: `web` で `VITE_API_BASE_URL=http://localhost:8787` を設定して起動すると、LP 分析がローカル API に繋がります（未設定時もデフォルトで localhost:8787 を参照します）。

## 本番デプロイ

```bash
pnpm deploy
```

デプロイ後、シークレットを設定します。

```bash
pnpm wrangler secret put OPENAI_API_KEY
```

## エンドポイント

- `POST /lp-analysis` — LP（URL またはテキスト）を分析し、Markdown で結果を返す。
  - Body: `{ "lpInput": "https://example.com/lp" }` または `{ "lpInput": "LPの本文テキスト..." }`
  - Response: `{ "ok": true, "markdown": "..." }` / `{ "ok": false, "error": "..." }`
