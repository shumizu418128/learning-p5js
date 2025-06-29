FROM node:alpine

WORKDIR /app

# パッケージファイルをコピー
COPY package*.json ./

# 依存関係をインストール
RUN npm install

# アプリケーションコードをコピー
COPY . ./

# TypeScriptをビルド（バックエンドのみ）
RUN npm run build

# 不要なファイルを削除してイメージサイズを削減
RUN rm -rf src logs

# ポートを公開
EXPOSE 8000

# アプリケーションを起動
CMD ["npm", "start"]
