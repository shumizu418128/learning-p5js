FROM node:alpine

WORKDIR /app

# パッケージファイルをコピー
COPY package.json package-lock.json ./

# 依存関係をインストール
RUN npm install

# アプリケーションコードをコピー
COPY . .

# ビルド
RUN npm run build

# ポートを公開
EXPOSE 3000

# 本番サーバーで起動
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0"]
