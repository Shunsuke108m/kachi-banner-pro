# 参照: 7フェーズの詳細と ADR テンプレート

## フェーズ詳細（feature-dev ベース）

- **Phase 1 Discovery**: 要件の本質を理解。ToDo 化、曖昧な点の質問、理解の要約と確認。
- **Phase 2 Codebase Exploration**: 類似機能・エントリポイント・データフロー・レイヤーを把握。重要ファイルを file:line でメモ。
- **Phase 3 Clarifying Questions**: 意思決定・判断が必要な場合は必ず質問。設計前に曖昧な点を確認（エッジケース、エラー処理、既存との統合、優先度）。
- **Phase 4 Architecture**: 複数アプローチを比較（Minimal / Clean / Pragmatic など）。トレードオフと推奨を明示し、ユーザーに選択させる。
- **Phase 5 Implementation**: 承認後に実装。既存規約・config・shared を守る。TodoWrite で進捗管理。
- **Phase 6 Quality Review**: code-reviewer を参考に、複数観点でレビュー（下記）。信頼度の高い指摘から報告・修正。
- **Phase 7 Summary**: 構築内容・決定事項・変更ファイル・次の推奨ステップを短文で出力。ADR は 4 桁ゼロパディングで作成。

### Phase 6 品質レビュー（code-reviewer 風）

- **観点1（シンプルさ・DRY・エレガンス）**: コード品質・保守性。無駄な複雑さ・重複がないか。
- **観点2（バグ・機能的正確性）**: ロジックエラー・エッジケース・漏れがないか。
- **観点3（プロジェクト規約・抽象化）**: docs/product.md や既存パターン（config/shared/レイヤー）への準拠。
- **信頼度ベースのフィルタリング**: 確信度の高い指摘を優先して報告する。曖昧な指摘は「検討候補」として区別してもよい。
- **出力**: 高優先度／中優先度に分け、修正案を簡潔に。ユーザーに「今すぐ修正・後で修正・このまま進める」を選んでもらう。

## ADR テンプレート

- ファイル名: `docs/adr/NNNN-短いタイトル.md`。**NNNN は 4 桁ゼロパディング**（0001, 0002, …）。

```markdown
# NNNN. タイトル（短い機能名・決定内容）

**日付**: YYYY-MM-DD

## 状況
何を決める必要があったか（要件・制約・選択肢が複数あった点）。

## 決定
採用した方針を 1〜3 文で。型・エンドポイント・ディレクトリ・技術選びなど。

## 理由
なぜその選択にしたか。トレードオフ・コスト・既存コードとの整合。

## 結果
その決定により何ができたか。残っている課題や後続でやること（あれば）。
```

## プロジェクト一覧API設計（一覧と詳細の分離）

- **一覧（サイドバー用）**: `GET /projects` → `{ ok: true, projects: { id, name }[] }` のみ。lpUrl やコンテキストは含めず、表示を軽くする。
- **詳細**: `GET /project/:id` → 既存どおり full `Project`（id, name, lpUrl, lpStructuredContext, lpRawAnalysisMarkdown 等）。各項目タップ時にこちらで取得する。単一リソースは単数形 `project`、一覧のみ複数形 `projects`。

## プロジェクト構成の目安

- `api/`: Workers + Hono。`config.ts` で定数一元化。`routes/` → `services/` → 必要なら repository。
- `web/`: React + Vite。`features/` 配下で機能ごとに api / components / stores / types。
- `shared/`: 型・空オブジェクト・パーサーなど api と web で共有するスキーマ。
- `docs/`: product.md, implementation-*.md, architecture-*.md。ADR は `docs/adr/NNNN-タイトル.md`。
