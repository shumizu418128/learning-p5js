# KidsCode - AI学習支援付きp5.jsエディタ

小学生中学年向けのp5.js学習支援Webアプリケーション

## プロジェクト概要

**対象ユーザー**: 小学3〜4年生（8〜10歳）
**学習環境**: 家庭での自主学習
**学習スタイル**: 子供一人での独学をAIがサポート

p5.js公式エディタにAIによる学習支援機能を追加し、小学生が一人でもプログラミングを楽しく学べるプラットフォームを提供します。

## 主要機能

### 1. AIによる段階的なコーディング指導システム
- **スマートヒント機能**: コードを書く際のリアルタイムサジェスト
- **段階的チュートリアル**: 基本図形→動き→インタラクション→ゲーム作成
- **音声読み上げ機能**: 漢字が読めない子供へのサポート
- **ビジュアルコードブロック**: テキストコーディングへの橋渡し

### 2. リアルタイムフィードバック機能
- **エラー検出と優しい説明**: 「おっと！ここを直してみよう」
- **コード改善提案**: 「もっと簡単に書ける方法があるよ」
- **動作予測表示**: コードを実行する前の結果プレビュー

### 3. ゲーミフィケーション要素
- **バッジシステム**: 「初めての円」「カラフルマスター」など
- **キャラクター育成**: プログラミングで仮想ペットを育てる
- **チャレンジモード**: 日替わりお絵描きチャレンジ
- **作品ギャラリー**: 自分の作品を保存・共有

### 4. 進捗追跡システム
- **学習ダッシュボード**: 今日の学習時間、達成したスキル
- **スキルツリー**: p5.jsの概念を視覚的に表現
- **保護者向けレポート**: 子供の学習状況を保護者にメール通知

## 技術仕様

### アーキテクチャ

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   フロントエンド   │    │   バックエンド    │    │     AI/ML       │
│                 │    │                 │    │                 │
│ React+TypeScript│────│ Node.js+Express │────│ Google Gemini   │
│ p5.js Editor    │    │ REST API        │    │ コード解析エンジン  │
│ Monaco Editor   │    │ WebSocket       │    │ 教育コンテンツDB   │
│ Material-UI     │    │ シンプル認証     │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### 技術スタック

**フロントエンド**
- React 18 + TypeScript
- p5.js (最新版)
- Monaco Editor (VS Code風エディタ)
- Material-UI (子供向けカスタマイズ)
- React Query (状態管理)
- Vite (ビルドツール)

**バックエンド**
- Node.js + Express
- TypeScript
- Google Gemini Pro API統合
- WebSocket (リアルタイム通信)
- Winston (ログ機能)

**AI/ML**
- Google Gemini Pro API
- 独自のコード解析ライブラリ
- 教育的フィードバック生成システム

**デプロイ・インフラ**
- Docker化
- Render (バックエンド) + Vercel (フロントエンド)
- GitHub Actions (CI/CD)

## UI/UXデザイン指針

### デザインコンセプト
- **親しみやすさ**: 丸みを帯びた要素、明るい色彩
- **直感性**: アイコンベースのナビゲーション
- **達成感**: アニメーション効果で成功体験を演出
- **安全性**: 子供に適さないコンテンツのフィルタリング

### レスポンシブデザイン
- タブレット最適化（iPadサイズを基準）
- デスクトップ対応
- スマートフォンでの作品閲覧機能

## プロジェクト構造

```
learning-p5js/
├── frontend/              # Reactフロントエンド
│   ├── src/
│   │   ├── components/    # UI コンポーネント
│   │   ├── pages/         # ページコンポーネント
│   │   ├── hooks/         # カスタムフック
│   │   ├── services/      # API通信
│   │   ├── utils/         # ユーティリティ
│   │   └── types/         # TypeScript型定義
│   ├── public/            # 静的ファイル
│   └── package.json
├── backend/               # Node.jsバックエンド
│   ├── src/
│   │   ├── controllers/   # APIコントローラー
│   │   ├── services/      # ビジネスロジック
│   │   ├── middleware/    # ミドルウェア
│   │   └── utils/         # ユーティリティ
│   └── package.json
├── docker-compose.yml     # 開発環境用Docker設定
├── .github/workflows/     # CI/CD設定
└── docs/                  # プロジェクトドキュメント
```

## 開発ロードマップ

### Phase 1: 基盤構築 (1-2週間)
- [x] プロジェクト要件定義
- [x] 開発環境セットアップ
- [x] 基本的なReactアプリケーション構築
- [x] p5.jsエディタ統合
- [x] バックエンドAPI基盤

### Phase 2: コア機能実装 (3-4週間)
- [x] p5.jsコードエディタ機能
- [x] リアルタイムプレビュー
- [x] AI指導システム基盤
- [ ] ユーザー認証システム
- [ ] プロジェクト保存機能

### Phase 3: AI機能強化 (2-3週間)
- [x] Google Gemini API統合
- [x] コード解析エンジン
- [ ] 段階的チュートリアル
- [x] エラー検出とフィードバック

### Phase 4: ゲーミフィケーション (2週間)
- [ ] バッジシステム
- [ ] 進捗追跡
- [ ] チャレンジモード
- [ ] 作品ギャラリー

### Phase 5: 最適化とデプロイ (1週間)
- [ ] パフォーマンス最適化
- [ ] セキュリティ強化
- [ ] デプロイメント
- [ ] ドキュメント整備

## セットアップ手順

### 前提条件
- Node.js 18以上
- Docker & Docker Compose
- Git

### 開発環境構築

1. **リポジトリクローン**
```bash
git clone <repository-url>
cd learning-p5js
```

2. **依存関係インストール**
```bash
# フロントエンド
cd frontend
npm install

# バックエンド
cd ../backend
npm install
```

3. **環境変数設定**
```bash
# バックエンドの環境変数ファイルをコピー
cd backend
cp .env.example .env

# .envファイルを編集してGemini APIキーを設定
# GEMINI_API_KEY=your-actual-gemini-api-key-here
```

4. **開発サーバー起動**
```bash
# Docker Composeを使用
docker-compose up -d

# または個別に起動
# フロントエンド
cd frontend && npm run dev

# バックエンド
cd backend && npm run dev
```

### Gemini APIキーの取得方法

1. [Google AI Studio](https://makersuite.google.com/) にアクセス
2. Googleアカウントでログイン
3. 「Get API Key」をクリック
4. 新しいAPIキーを作成
5. 取得したAPIキーを `backend/.env` ファイルの `GEMINI_API_KEY` に設定

### API機能テスト

バックエンドサーバー起動後、以下のエンドポイントでAI機能をテストできます：

```bash
# AI状態確認
curl http://localhost:8000/api/ai/status

# コード分析テスト
curl -X POST http://localhost:8000/api/ai/analyze \
  -H "Content-Type: application/json" \
  -d '{"code":"function setup(){createCanvas(400,400);}\nfunction draw(){background(220);circle(200,200,100);}"}'

# 質問テスト
curl -X POST http://localhost:8000/api/ai/question \
  -H "Content-Type: application/json" \
  -d '{"question":"p5.jsで円を描くにはどうすればいいですか？"}'
```

## ライセンス

MIT License

## 貢献

プルリクエストや課題報告は歓迎します。詳細は[CONTRIBUTING.md](CONTRIBUTING.md)をご確認ください。

---

**作成日**: 2025年6月28日
**最終更新**: 2025年6月28日（シンプル化対応）
**コンセプト**: 小学生が気軽に始められるシンプルなp5.js学習環境
