# Render.com でのデプロイ手順

このリポジトリ（フロントエンド＋バックエンド統合）を Render.com で動かすための手順です。

---

## 1. リポジトリ連携

1. Render.com にログインし、「New +」→「Web Service」を選択
2. GitHub でこのリポジトリを選択

---

## 2. Webサービスの作成

- **Name**: 任意（例: kidscode-app）
- **Root Directory**: `backend` （フロントエンドとバックエンドが統合されています）
- **Dockerfile**: `backend/Dockerfile`
- **Build Command**: 空欄でOK（Dockerfileに記載済み）
- **Start Command**: 空欄でOK（Dockerfileに記載済み）
- **Port**: `8000`
- **環境変数**: 必要に応じて設定（例: APIキーなど）

---

## 3. 注意点

- **統合構成**: フロントエンドとバックエンドが1つのサービスに統合されています
- **API URL**: フロントエンドからバックエンドへのアクセスは同じドメイン内で行われるため、環境変数の設定は不要です
- **CORS**: 同一ドメイン内での通信のため、CORS設定は不要です
- **docker-compose.yml** はローカル開発用です。Render.comでは統合サービスとしてデプロイします

---

## 4. デプロイ後

- WebサービスのURLにアクセスして動作確認
- 必要に応じて環境変数を調整

---

## 5. ローカル開発

ローカル開発時は、フロントエンドとバックエンドを別々に起動できます：

```bash
# バックエンド
cd backend
npm run dev

# フロントエンド（別ターミナル）
cd frontend
npm run dev
```
