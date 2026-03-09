# LP分析機能 実装方針

## 1. 概要

- **目的**: LP（URL or テキスト）をLLMで分析し、後続のバナー生成に必要なコンテキスト（商材解剖・ターゲット・USP等）を生成する。
- **フロー**: ユーザーがLP情報を入力 → APIが分析 → 結果を返却 → ユーザーが加筆修正 → バナー生成へ進む。
- **技術**: モノレポの `api` ディレクトリに Cloudflare Workers + Hono でAPIを実装し、LLM（OpenAI）を呼び出す。

---

## 2. 実装方針

### 2.1 ディレクトリ・責務

```
kachi-banner-pro/
├── api/                          # Workers API（モノレポのAPI側）
│   ├── src/
│   │   ├── index.ts              # エントリ（Hono app）
│   │   ├── routes/
│   │   │   └── lp-analysis.ts    # POST /lp-analysis
│   │   ├── services/
│   │   │   ├── lp-fetcher.ts     # URL → HTML取得・テキスト抽出
│   │   │   └── llm.ts            # OpenAI 呼び出し（将来 LLMProvider 抽象化）
│   │   ├── prompts/              # または prompt/ をそのまま参照
│   │   └── types.ts
│   ├── prompt/                   # 既存（lpAnalisis.md, systemPrompt.md）
│   ├── wrangler.toml
│   └── package.json
├── web/                          # 既存フロント
│   └── src/features/new-project/
│       ├── api/                  # useAnalyzeLp が api/ の POST を呼ぶ
│       ├── stores/
│       ├── types/                # LPAnalysis は API 出力に合わせて拡張
│       └── components/
└── docs/
```

- **api**: LP分析エンドポイント、LP取得、LLM呼び出し、プロンプト読み込み。
- **web**: 既存の Step1/Step2 を活かし、`useAnalyzeLp` が実APIを叩き、返却結果を `lpAnalysisAtom` に反映。出力項目が決まったあとで Step2 のフォーム項目を調整。

### 2.2 API 設計

| 項目 | 内容 |
|------|------|
| エンドポイント | `POST /lp-analysis` |
| リクエスト | `{ "lpInput": string }` — URL または LP本文テキスト |
| レスポンス | `{ "ok": true, "analysis": { ... } }` または Markdown 文字列をそのまま返す案（後述） |
| エラー | `{ "ok": false, "error": "..." }`、ステータス 4xx/5xx |

- **lpInput**: URL の場合はサーバー側で fetch して HTML を取得しテキスト化。テキストの場合はそのままLLMへ。
- **分析結果の形式**: `api/prompt/lpAnalisis.md` は Markdown で出力する仕様のため、次の2案がある。
  - **A案（推奨・MVP）**: いったん **Markdown 文字列をそのまま返す**。フロントでは表示用に使い、Step2 では「編集可能なテキストエリア」で加筆修正。後から構造化（JSON）を増やしてもよい。
  - **B案**: LLMに「所定のJSON形式で返せ」と指示し、`LPAnalysis` 相当の型で返す。プロンプトとパースの手間が増えるが、Step2 のフォームと1:1で扱いやすい。

まずは **A案** で進め、レスポンスを `{ "ok": true, "markdown": string }` のようにし、フロントの型は `LPAnalysis` に `rawMarkdown?: string` を足して保持するか、別 atom で Markdown を保持する形にするとよい。

### 2.3 LP 内容の取得（URL の場合）

- Workers から `fetch(lpUrl)` で HTML を取得（サーバー側のため CORS の制約なし）。
- **HTML → テキスト**: Workers では Node 専用ライブラリ（cheerio 等）は使わない。次のいずれかで対応する。
  - **正規表現**: `<script>`, `<style>` を除き、タグを削除してテキストのみ抽出（簡易）。
  - **LLM に任せる**: HTML の先頭 N 文字（例: 15_000 文字）をそのまま送り、「本文テキストを分析して」と指示。実装が簡単で、LP分析の文脈では十分なことが多い。
- 推奨: **LLM に HTML 断片を渡す方式** で MVP を実装し、必要なら後でテキスト抽出（正規表現 or 軽量パーサ）に切り替える。

### 2.4 LLM 呼び出し

- **モデル**: OpenAI Chat Completions（例: `gpt-4o-mini` または `gpt-4o`）。コストと速度のバランスで選択。
- **プロンプト**: `api/prompt/lpAnalisis.md` の内容をシステム/ユーザーメッセージに組み立て、ユーザーメッセージには「以下がLPの内容です。」+ LPテキスト（またはHTML断片）を渡す。
- **Workers 制約**: Node 専用 API に依存しないこと。`openai` 公式 SDK は内部で `fetch` を使うため、Workers で利用可能。ただしバンドルサイズに注意し、必要なら `fetch` で Chat Completions API を直接呼ぶ実装でも可。
- **API キー**: 環境変数 `OPENAI_API_KEY` で渡す（wrangler.toml の `[vars]` ではなく `wrangler secret put OPENAI_API_KEY` を推奨）。

### 2.5 エラーハンドリング・制限

- LP の fetch 失敗（タイムアウト・4xx/5xx）: クライアントに「LPにアクセスできませんでした」旨を返す。
- LLM のレート制限・障害: リトライは MVP では 1 回まで（product.md 方針に準拠）。
- 入力制限: `lpInput` の長さ上限（例: URL なら 2_000 文字、テキストなら 50_000 文字）を設ける。
- 将来: Turnstile や Firestore による回数制限は、LP分析とは別フェーズで追加可能。

### 2.6 出力項目とフロントの調整

- **現状**: `lpAnalisis.md` の出力は「商材の深層解剖」の Markdown（コアバリュー、ターゲット、機能的/情緒的ベネフィット、競合優位性、ロゴの視覚的特徴など）。
- **フロント**: まずは API が返す **Markdown をそのまま表示**し、Step2 では「分析結果（Markdown）を編集するテキストエリア」＋必要に応じて構造化フィールド（商品名・ターゲット・メインメッセージなど）を追加する形がよい。出力が固まったあとで、Step2 のフォーム項目（`Step2BasicInfoForm` のフィールド）を増減・ラベル変更する。

---

## 3. あなたが行うべき作業（APIキー・環境まわり）

### 3.1 OpenAI API キーの発行

1. [OpenAI Platform](https://platform.openai.com/) にログインする。
2. **API keys** から「Create new secret key」でキーを発行する。
3. キーをコピーし、**ローカルやリポジトリにコミットしない**（`.env` は `.gitignore` に含める）。

### 3.2 ローカル開発用の環境変数

- プロジェクトルートまたは `api/` に `.dev.vars` を用意する（Cloudflare のローカル用シークレット）。
- 内容例:
  ```
  OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxx
  ```
- `api/.dev.vars` は `.gitignore` に追加する。

### 3.3 本番（Cloudflare Workers）でのシークレット設定

- デプロイ後、以下でシークレットを登録する:
  ```bash
  cd api && pnpm wrangler secret put OPENAI_API_KEY
  ```
- プロンプトに従ってキーを入力する。

### 3.4 その他

- **CORS**: フロントのオリジン（例: `http://localhost:5173`）を Workers の CORS で許可する必要がある。Hono の `cors()` ミドルウェアで対応する。
- **フロントの API ベースURL**: 開発時は `VITE_API_BASE_URL=http://localhost:8787` のような環境変数で Workers のローカル URL を指すようにする。本番ではデプロイ後の Workers の URL を設定する。

---

## 4. 実装の順序（提案）

1. **api**: `package.json`, `wrangler.toml` の追加、Hono アプリと `POST /lp-analysis` の骨組み。
2. **api**: LP取得（URL の場合は `fetch` + HTML をそのまま or 簡易テキスト化）、プロンプト読み込み（`lpAnalisis.md`）、OpenAI 呼び出し。
3. **api**: レスポンス形式の確定（A案: `{ ok, markdown }`）、エラーハンドリング・入力長制限。
4. **web**: `useAnalyzeLp` を実 API 呼び出しに差し替え、レスポンスを store（例: `lpAnalysisAtom` または `lpAnalysisMarkdownAtom`）に格納。
5. **web**: Step2 で分析結果（Markdown または構造化データ）の表示・編集 UI を、実際の出力に合わせて調整。

---

## 5. まとめ

- **API**: Cloudflare Workers + Hono で `POST /lp-analysis` を実装。LP は URL（fetch で取得） or テキスト。LLM は OpenAI で `lpAnalisis.md` に基づき分析し、まずは Markdown で返す。
- **あなたの作業**: OpenAI API キー発行、`api/.dev.vars` の作成と `.gitignore` 追加、本番では `wrangler secret put OPENAI_API_KEY` の実行。必要なら CORS とフロントの API ベースURLの確認。

GO が出たら、上記順序で実装に進めます。
