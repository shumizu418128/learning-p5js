FROM node:18-alpine

WORKDIR /app

# パッケージファイルをコピー
COPY ./package*.json ./

# 依存関係をインストール
RUN npm install --omit=dev

# アプリケーションコードをコピー
COPY . .

# フロントエンドのコードをコピー
COPY ../frontend ./frontend

# フロントエンドの依存関係をインストール
RUN cd frontend && npm install

# TypeScriptをビルドし、フロントエンドもビルド
RUN npm run build

# 不要なファイルを削除してイメージサイズを削減
RUN rm -rf frontend/node_modules frontend/src

# ポートを公開
EXPOSE 8000

# アプリケーションを起動
CMD ["npm", "start"]
