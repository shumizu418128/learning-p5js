# ビルドステージ
FROM node:alpine AS builder

WORKDIR /app

# パッケージファイルをコピー
COPY package.json ./
COPY package-lock.json ./

# 依存関係をインストール
RUN npm ci

# ソースコードをコピー
COPY . .

# ビルド
RUN npm run build

# 本番ステージ
FROM nginx:alpine

# ビルド結果をnginxにコピー
COPY --from=builder /app/dist /usr/share/nginx/html

# nginx設定をコピー
COPY nginx.conf /etc/nginx/conf.d/default.conf

# ポートを公開
EXPOSE 80

# nginxを起動
CMD ["nginx", "-g", "daemon off;"]
