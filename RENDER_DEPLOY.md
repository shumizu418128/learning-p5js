# Render.com でのデプロイ手順

このリポジトリ（フロントエンド・バックエンド分離構成）を Render.com で動かすための手順です。

---

## 1. バックエンド API サーバーの作成

### 1.1 リポジトリ連携
1. Render.com にログインし、「New +」→「Web Service」を選択
2. GitHub でこのリポジトリを選択

### 1.2 バックエンドサービスの設定
- **Name**: `kidscode-backend` （任意）
- **Root Directory**: `backend`
- **Dockerfile**: `backend/Dockerfile`
- **Build Command**: 空欄でOK（Dockerfileに記載済み）
- **Start Command**: 空欄でOK（Dockerfileに記載済み）
- **Port**: `8000`

### 1.3 環境変数の設定
バックエンドサービスで以下の環境変数を設定：

```
NODE_ENV=production
PORT=8000
FRONTEND_URL=https://your-frontend-service-name.onrender.com
GEMINI_API_KEY=your_gemini_api_key_here
```

### 1.4 デプロイ
- 「Create Web Service」をクリックしてデプロイ開始
- デプロイ完了後、バックエンドのURLをメモ（例: `https://kidscode-studio-backend.onrender.com`）

---

## 2. フロントエンドサーバーの作成

### 2.1 新しいWebサービスの作成
1. 「New +」→「Web Service」を選択
2. 同じGitHubリポジトリを選択

### 2.2 フロントエンドサービスの設定
- **Name**: `kidscode-frontend` （任意）
- **Root Directory**: `frontend`
- **Dockerfile**: `frontend/Dockerfile`
- **Build Command**: 空欄でOK（Dockerfileに記載済み）
- **Start Command**: 空欄でOK（Dockerfileに記載済み）
- **Port**: `80`

### 2.3 環境変数の設定
フロントエンドサービスで以下の環境変数を設定：

```
VITE_API_URL=https://kidscode-studio-backend.onrender.com
```

### 2.4 デプロイ
- 「Create Web Service」をクリックしてデプロイ開始
- デプロイ完了後、フロントエンドのURLをメモ（例: `https://kidscode-frontend.onrender.com`）

---

## 3. 設定の確認と調整

### 3.1 バックエンドのCORS設定確認
バックエンドの `backend/src/index.ts` で、フロントエンドのURLが許可されていることを確認：

```typescript
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'https://kidscode-frontend.onrender.com',  // フロントエンドのURL
    process.env.FRONTEND_URL
  ].filter((url): url is string => Boolean(url)),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}))
```

### 3.2 フロントエンドのAPI接続確認
フロントエンドの `frontend/src/services/api.ts` で、バックエンドのURLが正しく設定されていることを確認。

---

## 4. 動作確認

1. フロントエンドのURLにアクセス
2. アプリケーションが正常に動作することを確認
3. バックエンドAPIとの通信が正常に行われることを確認

---

## 5. ローカル開発

ローカル開発時は、docker-compose.ymlを使用：

```bash
# 両方のサービスを起動
docker-compose up --build

# または個別に起動
docker-compose up backend
docker-compose up frontend
```

または、個別に起動：

```bash
# バックエンド
cd backend
npm run dev

# フロントエンド（別ターミナル）
cd frontend
npm run dev
```

---

## 6. 注意点

- **分離構成**: フロントエンドとバックエンドが別々のサービスとして動作
- **CORS設定**: フロントエンドからバックエンドへのアクセスには適切なCORS設定が必要
- **環境変数**: 各サービスで適切な環境変数を設定する必要がある
- **ネットワーク**: Render.comでは各サービスが独立したネットワークで動作
- **nginx**: フロントエンドはnginxを使用して静的ファイルを配信

---

## 7. トラブルシューティング

### 7.1 CORSエラーが発生する場合
- バックエンドのCORS設定でフロントエンドのURLが許可されているか確認
- 環境変数 `FRONTEND_URL` が正しく設定されているか確認

### 7.2 API接続エラーが発生する場合
- フロントエンドの環境変数 `VITE_API_URL` が正しく設定されているか確認
- バックエンドサービスが正常に起動しているか確認

### 7.3 ビルドエラーが発生する場合
- Dockerfileの内容を確認
- 必要な依存関係が正しくインストールされているか確認
- package.jsonファイルが正しくコピーされているか確認

### 7.4 nginxエラーが発生する場合
- nginx.confファイルが正しく設定されているか確認
- ビルド結果が正しくnginxにコピーされているか確認
