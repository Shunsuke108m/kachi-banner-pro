# LP分析機能の実装解説（Cloudflare Workers × LLM の基礎）

「どこに何を実装したか」を、Cloudflare Workers と LLM 呼び出しの基礎と合わせて説明します。

---

## 1. 全体の流れ（1リクエストで何が起きるか）

```
[ブラウザ]  「AI分析開始」クリック
     │
     │  POST /lp-analysis  { lpInput: "https://example.com/lp" }
     ▼
[Cloudflare Worker]  ← wrangler が src/index.ts をエントリとして起動
     │
     │  ① ルート (routes/lp-analysis.ts) でリクエスト受付
     │  ② 環境変数 c.env.OPENAI_API_KEY を参照（.dev.vars または本番シークレット）
     │  ③ LP取得 (services/lp-fetcher.ts) … URLなら fetch でHTML取得
     │  ④ LLM呼び出し (services/llm.ts) … OpenAI API に fetch で送信
     │  ⑤ 返却 { ok: true, markdown: "..." }
     ▼
[ブラウザ]  結果を表示し、Step2 で編集可能に
```

**ポイント**: Worker は「サーバーless」。リクエストが来たときだけ実行され、`fetch` や `c.env` はそのリクエストのコンテキストで渡されます。Node の `process.env` や `fs` は使えません。

---

## 2. Cloudflare Workers の基礎

### 2.1 設定ファイル: `api/wrangler.toml`

```toml
name = "kachi-banner-pro-api"
main = "src/index.ts"
compatibility_date = "2024-11-01"
```

| 項目 | 意味 |
|------|------|
| `name` | Worker の名前。本番ではこの名前で Cloudflare にデプロイされる |
| `main` | **エントリポイント**。ここからバンドルが作られ、リクエストごとにこのコードが実行される |
| `compatibility_date` | Workers ランタイムの互換日付。指定した日付時点の挙動で動く |

**重要**: Wrangler は `main` の TypeScript をビルドし、1つのスクリプトにまとめて Cloudflare のエッジで実行します。`node_modules` や `fs` は使えず、**標準の `fetch` と Web API だけ**が使える環境です。

### 2.2 環境変数・シークレット（APIキーを渡す仕組み）

- **ローカル開発**: `api/.dev.vars` に書いたキーが、そのまま Worker の「環境」として渡される。
- **本番**: `wrangler secret put OPENAI_API_KEY` で設定した値が渡される。
- **コード側では**: リクエストハンドラの引数 `c`（Context）の `c.env` から参照する。

**なぜルートの `.env` が効かないか**: Wrangler は **`api/.dev.vars` だけ**を読みます。ルートの `.env` は Vite や Node 用で、Worker の実行環境には渡されません。

```ts
// api/src/routes/lp-analysis.ts より
const apiKey = c.env.OPENAI_API_KEY;  // ← ここで .dev.vars の値が入る
```

型定義は `api/src/index.ts` の `Env` で行い、`c.env` の型として使います。

```ts
// api/src/index.ts
export interface Env {
  OPENAI_API_KEY: string;
}
const app = new Hono<{ Bindings: Env }>();  // ← Bindings が c.env の型になる
```

---

## 3. どこに何があるか（ディレクトリと役割）

### 3.1 API（Worker）側 `api/`

| ファイル | 役割 |
|----------|------|
| **wrangler.toml** | Worker の名前・エントリ・互換日付。シークレットはここには書かず、`.dev.vars` / `wrangler secret` で渡す |
| **src/index.ts** | **エントリ**。Hono アプリを作り、CORS を付け、ルートを `app.route("/", lpAnalysisRoutes)` でマウント。`export default app` が Worker の本体 |
| **src/routes/lp-analysis.ts** | **HTTP の入り口**。`POST /lp-analysis` を受け、body から `lpInput` を取得し、バリデーション → LP取得 → LLM 呼び出し → JSON 返却まで一連の流れを書いている |
| **src/services/lp-fetcher.ts** | **LP コンテンツ取得**。`lpInput` が URL なら `fetch` で HTML を取得（先頭 15,000 文字）。テキストならそのまま。Worker からは「グローバルの `fetch`」で外部 URL にアクセスできる |
| **src/services/llm.ts** | **LLM 呼び出し**。OpenAI の Chat Completions API に `fetch` で POST し、プロンプトと LP 本文を送って Markdown を受け取る。詳細は後述 |
| **src/prompts/lp-analysis.ts** | **プロンプト文字列**。Worker にはファイルシステムがないので、`lpAnalisis.md` の内容をコード内の文字列として持っている |
| **src/types.ts** | リクエスト・レスポンスの型定義 |

### 3.2 フロント（Web）側 `web/`

| ファイル | 役割 |
|----------|------|
| **src/features/new-project/api/config.ts** | **API のベース URL**。`import.meta.env.VITE_API_BASE_URL` またはデフォルト `http://localhost:8787`。Vite は `VITE_` で始まる変数だけクライアントに渡す |
| **src/features/new-project/api/index.ts** | **API クライアント**。`analyzeLp(lpInput)` が `fetch(POST /lp-analysis)` を実行し、`{ markdown }` を返す。接続失敗時は「API サーバーに接続できません…」と分かるエラーにしている |
| **Step1LpAnalysis** | 入力と「AI分析開始」ボタン。`useAnalyzeLp()` で `analyzeLp` を呼び、成功時に `lpAnalysisMarkdownAtom` に結果を入れ、Step2 へ進む |
| **stores** | `lpAnalysisMarkdownAtom` に API から返った Markdown を保存。Step2 で表示・編集する |

---

## 4. LLM 呼び出しの仕組み（OpenAI API）

### 4.1 なぜ SDK ではなく `fetch` か

- Workers は**バンドルサイズが小さいほど起動が速い**。OpenAI の公式 SDK は Node 向けの依存が多く、そのままでは重くなりがち。
- 一方で **Chat Completions は HTTP の POST 1本**で完結するので、`fetch` で十分。
- そのため `api/src/services/llm.ts` では、**OpenAI の REST API を直接 `fetch` で呼ぶ**実装にしています。

### 4.2 呼び出し先とメッセージ形式

```ts
// api/src/services/llm.ts

const OPENAI_CHAT_URL = "https://api.openai.com/v1/chat/completions";
const MODEL = "gpt-4o-mini";
```

OpenAI の「チャット補完」は次の形です。

- **URL**: `https://api.openai.com/v1/chat/completions`
- **認証**: ヘッダー `Authorization: Bearer <APIキー>`
- **Body**: `model`, `messages`, `max_tokens` など

```ts
const body = {
  model: MODEL,
  max_tokens: MAX_TOKENS,
  messages: [
    { role: "system", content: LP_ANALYSIS_SYSTEM_PROMPT },  // 役割・出力形式の指示
    { role: "user", content: userMessage },                   // 「以下がLPの内容です」+ 実際のHTML/テキスト
  ],
};

const res = await fetchImpl(OPENAI_CHAT_URL, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
  },
  body: JSON.stringify(body),
});
```

- **system**: 常に「LP をマーケティング視点で分析し、指定の Markdown 形式で出せ」という指示（`src/prompts/lp-analysis.ts` の文字列）。
- **user**: 「以下がLPの内容です」＋ LP の HTML またはテキスト。URL の場合は `lp-fetcher` が取得した HTML の先頭部分。

### 4.3 レスポンスの取り方

OpenAI のレスポンスはだいたい次の形です。

```json
{
  "choices": [
    {
      "message": {
        "role": "assistant",
        "content": "# 1. 商材の深層解剖 ..."
      }
    }
  ]
}
```

なので、**1つ目の choice の `message.content`** を Markdown として使っています。

```ts
const data = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
const text = data.choices?.[0]?.message?.content?.trim() ?? "";
return { markdown: text };
```

ここまでが「LLM に投げて、返ってきたテキストをそのまま LP 分析結果として返す」部分です。

### 4.4 プロンプトがコード内にある理由

- Workers には **ランタイムでファイルを読む `fs` がない**。
- そのため `api/prompt/lpAnalisis.md` の内容を、**ビルド時にコードに含める**必要があります。
- そこで `api/src/prompts/lp-analysis.ts` に、同じ内容を**文字列として**持たせています。  
  （`lpAnalisis.md` を変更したら、このファイルの文字列も手動で同期する運用です。）

---

## 5. 用語の整理

| 用語 | 意味（このプロジェクトでの使われ方） |
|------|--------------------------------------|
| **Worker** | Cloudflare のエッジで動く小さなスクリプト。リクエストごとに起動し、`fetch` とバインド（env など）だけが使える |
| **Wrangler** | Cloudflare の CLI。`wrangler dev` でローカル実行、`wrangler deploy` で本番デプロイ、`wrangler secret put` でシークレット設定 |
| **Bindings / c.env** | リクエストコンテキストに紐づいた「環境」。`OPENAI_API_KEY` はここから渡され、コードでは `c.env.OPENAI_API_KEY` で参照 |
| **.dev.vars** | ローカルで `wrangler dev` したときだけ読まれるファイル。ここに書いたキーが `c.env` に入る。ルートの `.env` とは別 |
| **Chat Completions** | OpenAI の「会話形式」API。`system` / `user` / `assistant` のメッセージを送り、次の返答テキストを得る |
| **system / user** | `system`＝役割・形式の指示、`user`＝今回の入力（LP 本文）。LP 分析では「system で形式、user で LP 本文」という構成 |

---

## 6. まとめ

- **Cloudflare**: `wrangler.toml` の `main` がエントリ。環境変数は **`api/.dev.vars`（ローカル）** と **`wrangler secret`（本番）** で渡し、コードでは **`c.env`** で参照する。
- **LLM**: OpenAI の Chat Completions を **`fetch` 1本**で呼んでいる。プロンプトは Worker に `fs` がないので **コード内の文字列**（`prompts/lp-analysis.ts`）で持つ。
- **役割の分け方**: **ルート**で HTTP とバリデーション、**lp-fetcher** で LP 取得、**llm** で API 呼び出しとレスポンス整形、**prompts** でプロンプト文字列、という分担になっている。

この構成を押さえておくと、今後「別の LLM に差し替える」「別のエンドポイントを足す」といった変更をしやすくなります。
