import compression from 'compression'
import cors from 'cors'
import dotenv from 'dotenv'
import express, { RequestHandler } from 'express'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import { createServer } from 'http'
import { Server } from 'socket.io'
import aiRoutes from './routes/aiRoutes'
import geminiService from './services/geminiService'
import { logger } from './utils/logger'

// 環境変数の読み込み
dotenv.config()

// Static Outbound IP Addressesの設定
const ALLOWED_IPS = process.env.ALLOWED_IPS
  ? process.env.ALLOWED_IPS.split(',').map(ip => ip.trim())
  : ['::1', '127.0.0.1']; // デフォルトはlocalhostのみ

// IP制限ミドルウェア
const ipRestriction: RequestHandler = (req, res, next) => {
  const clientIP = req.ip || req.connection.remoteAddress || req.socket.remoteAddress;

  // 開発環境では全て許可
  if (process.env.NODE_ENV === 'development') {
    return next();
  }

  // 本番環境では許可されたIPのみ
  if (clientIP && ALLOWED_IPS.includes(clientIP)) {
    return next();
  }

  logger.warn(`アクセス拒否: ${clientIP} from ${req.path}`);
  res.status(403).json({
    error: 'Access denied',
    message: 'このIPアドレスからのアクセスは許可されていません'
  });
};

const app = express()
const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
})

const PORT = process.env.PORT || 8000

// レート制限の設定
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分
  max: 100, // リクエスト数制限
  message: 'リクエストが多すぎます。後でもう一度お試しください。'
})

// ミドルウェアの設定
app.use(helmet())
app.use(compression())
app.use(limiter)
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000', process.env.FRONTEND_URL].filter((url): url is string => Boolean(url)),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// IP制限を適用（ヘルスチェックとルートは除外）
app.use('/api', ipRestriction)

// ログミドルウェア
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('User-Agent')
  })
  next()
})

// 基本的なルート
app.get('/', (req, res) => {
  res.json({
    message: 'KidsCode API Server',
    version: '1.0.0',
    status: 'running'
  })
})

// ヘルスチェック
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  })
})

// APIルート
app.use('/api/ai', aiRoutes)

// その他のAPIルートのプレースホルダー
app.use('/api/auth', (req, res) => {
  res.json({ message: '認証APIをここに実装予定' })
})

app.use('/api/projects', (req, res) => {
  res.json({ message: 'プロジェクトAPIをここに実装予定' })
})

// フロントエンドの静的ファイル配信・SPAフォールバックは削除
// このサーバーはAPI専用とする

// WebSocket接続の処理
io.on('connection', (socket) => {
  logger.info(`ユーザーが接続しました: ${socket.id}`)

  // コードの共有機能
  socket.on('code-change', (data) => {
    socket.broadcast.emit('code-update', data)
  })

  // AI指導のリクエスト
  socket.on('ai-help-request', async (data) => {
    try {
      logger.info('AI指導リクエスト:', data)
      const result = await geminiService.analyzeCode({
        code: data.code,
        language: 'p5js',
        studentLevel: data.studentLevel || 'beginner',
        context: data.context
      })

      socket.emit('ai-response', {
        success: true,
        message: result.text,
        code: data.code,
        error: result.error
      })
    } catch (error) {
      logger.error('AI指導リクエスト エラー:', error)
      socket.emit('ai-response', {
        success: false,
        message: 'AI先生が忙しいみたいです。もう一度試してみてね！ 🤖',
        error: 'AI API エラー'
      })
    }
  })

  // エラー処理機能
  socket.on('code-error', async (data) => {
    try {
      logger.info('コードエラー:', data)
      const result = await geminiService.getErrorHelp({
        code: data.code,
        errorMessage: data.errorMessage,
        lineNumber: data.lineNumber
      })

      socket.emit('error-help', {
        success: true,
        error: data.errorMessage,
        help: result.text,
        apiError: result.error
      })
    } catch (error) {
      logger.error('エラーヘルプ生成 エラー:', error)
      socket.emit('error-help', {
        success: false,
        error: data.errorMessage,
        help: 'エラーの解決方法が見つかりませんでした。先生に聞いてみてね！ 📚'
      })
    }
  })

  // 質問への回答
  socket.on('ai-question', async (data) => {
    try {
      logger.info('AI質問:', data)
      const result = await geminiService.askQuestion(data.question, data.context)

      socket.emit('ai-answer', {
        success: true,
        question: data.question,
        answer: result.text,
        error: result.error
      })
    } catch (error) {
      logger.error('AI質問回答 エラー:', error)
      socket.emit('ai-answer', {
        success: false,
        question: data.question,
        answer: 'ごめんね、今は答えられないけど、また聞いてみてね！ 😊'
      })
    }
  })

  // コード改善提案
  socket.on('ai-improve', async (data) => {
    try {
      logger.info('コード改善提案:', data)
      const result = await geminiService.suggestImprovements(data.code, data.goal)

      socket.emit('ai-suggestions', {
        success: true,
        code: data.code,
        suggestions: result.text,
        error: result.error
      })
    } catch (error) {
      logger.error('コード改善提案 エラー:', error)
      socket.emit('ai-suggestions', {
        success: false,
        code: data.code,
        suggestions: '今はアイデアが思い浮かばないけど、君のコードはとても良いよ！ ✨'
      })
    }
  })

  socket.on('disconnect', () => {
    logger.info(`ユーザーが切断しました: ${socket.id}`)
  })
})

// エラーハンドリング
import { ErrorRequestHandler } from 'express'

// JSONパースエラーハンドリング
const jsonErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err instanceof SyntaxError && 'body' in err) {
    logger.error('JSONパースエラー:', err)
    res.setHeader('Content-Type', 'application/json')
    res.status(400).json({
      success: false,
      error: '無効なJSON形式です',
      message: 'リクエストボディのJSON形式が正しくありません'
    })
    return
  }
  next(err)
}

// 一般的なエラーハンドリング
const generalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  logger.error('エラーが発生しました:', err)
  res.setHeader('Content-Type', 'application/json')
  res.status(500).json({
    success: false,
    error: 'サーバーエラーが発生しました',
    message: process.env.NODE_ENV === 'development' ? err.message : '内部サーバーエラー'
  })
}

app.use(jsonErrorHandler)
app.use(generalErrorHandler)

// 404ハンドリング
// （SPAフォールバックより後ろには不要なので削除）
/*
app.all('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'リクエストされたリソースが見つかりません'
  })
})
*/

// サーバー起動
server.listen(PORT, () => {
  logger.info(`🚀 KidsCode バックエンドサーバーがポート${PORT}で起動しました`)
  console.log(`🚀 KidsCode バックエンドサーバーがポート${PORT}で起動しました`)
  console.log(`📱 フロントエンド URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`)
  console.log(`🔗 API エンドポイント: http://localhost:${PORT}`)
})

// グレースフルシャットダウン
process.on('SIGTERM', () => {
  logger.info('SIGTERMを受信しました。サーバーを終了します...')
  server.close(() => {
    logger.info('サーバーが正常に終了しました')
    process.exit(0)
  })
})

export default app
