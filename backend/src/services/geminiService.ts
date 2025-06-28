import { GoogleGenAI } from '@google/genai'
import { logger } from '../utils/logger'

export interface GeminiResponse {
  text: string
  error?: string
}

export interface CodeAnalysisRequest {
  code: string
  language: 'p5js'
  studentLevel: 'beginner' | 'intermediate' | 'advanced'
  context?: string
}

export interface ErrorHelpRequest {
  code: string
  errorMessage: string
  lineNumber?: number
}

class GeminiService {
  private genAI: GoogleGenAI | null = null
  private initialized = false

  private initialize() {
    if (this.initialized) return

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY環境変数が設定されていません')
    }

    this.genAI = new GoogleGenAI({ apiKey })
    this.initialized = true
  }

  /**
   * 小学生向けのプロンプトを生成
   */
  private createKidFriendlyPrompt(basePrompt: string): string {
    return `
小学生のユーザー向けプログラミング指導者として回答してください：

【基本方針】
- やさしい日本語、絵文字使用
- 具体的なコード例を必ず提供
- 褒めて励ます姿勢
- 小学生にも分かりやすい説明

【回答形式】
- マークダウン形式で回答
- コード例は\`\`\`javascript で囲む
- 重要ポイントは **太字** で強調

${basePrompt}
`
  }

  /**
   * コード分析とフィードバック生成
   */
  async analyzeCode(request: CodeAnalysisRequest): Promise<GeminiResponse> {
    try {
      this.initialize()

      const prompt = this.createKidFriendlyPrompt(`
小学生のコード分析：
\`\`\`javascript
${request.code}
\`\`\`

以下を小学生向けに優しく回答：
1. 良い点を褒める
2. 改善提案（コード例付き）
3. 次の挑戦アイデア

200字以内で回答してください。
`)

      const model = process.env.GEMINI_MODEL || 'gemini-1.5-flash'
      const response = await this.genAI!.models.generateContent({
        model: model,
        contents: prompt
      })

      const text = response.text || '回答を生成できませんでした'

      logger.info('Gemini API - コード分析完了', {
        codeLength: request.code.length,
        level: request.studentLevel
      })

      return { text }
    } catch (error) {
      logger.error('Gemini API - コード分析エラー:', error)
      return {
        text: '申し訳ありません。今、AIの先生が忙しいみたいです。もう一度試してみてね！ 🤖',
        error: error instanceof Error ? error.message : '不明なエラー'
      }
    }
  }

  /**
   * エラー解決のヘルプ生成
   */
  async getErrorHelp(request: ErrorHelpRequest): Promise<GeminiResponse> {
    try {
      this.initialize()

      const prompt = this.createKidFriendlyPrompt(`
小学生のエラー修正：
\`\`\`javascript
${request.code}
\`\`\`

エラー: ${request.errorMessage}

以下を小学生向けに優しく回答：
1. 問題の説明
2. 修正方法（コード例付き）
3. 励ましの言葉

200字以内で回答してください。
`)

      const model = process.env.GEMINI_MODEL || 'gemini-1.5-flash'
      const response = await this.genAI!.models.generateContent({
        model: model,
        contents: prompt
      })

      const text = response.text || '回答を生成できませんでした'

      logger.info('Gemini API - エラーヘルプ生成完了')

      return { text }
    } catch (error) {
      logger.error('Gemini API - エラーヘルプ生成エラー:', error)
      return {
        text: 'エラーを直すお手伝いができませんでした。先生や大人の人に聞いてみてね！ 📚',
        error: error instanceof Error ? error.message : '不明なエラー'
      }
    }
  }

  /**
   * 自由な質問への回答
   */
  async askQuestion(question: string, context?: string): Promise<GeminiResponse> {
    try {
      this.initialize()

      const prompt = this.createKidFriendlyPrompt(`
小学生からの質問: ${question}
${context ? `背景: ${context}` : ''}

p5.jsについて小学生向けに優しく回答：
1. 簡単な説明
2. 具体的なコード例
3. 励ましの言葉

200字以内で回答してください。
`)

      const model = process.env.GEMINI_MODEL || 'gemini-1.5-flash'
      const response = await this.genAI!.models.generateContent({
        model: model,
        contents: prompt
      })

      const text = response.text || '回答を生成できませんでした'

      logger.info('Gemini API - 質問回答完了')

      return { text }
    } catch (error) {
      logger.error('Gemini API - 質問回答エラー:', error)
      return {
        text: 'ごめんね、今は答えられないけど、また聞いてみてね！ 😊',
        error: error instanceof Error ? error.message : '不明なエラー'
      }
    }
  }

  /**
   * コード改善提案
   */
  async suggestImprovements(code: string, goal?: string): Promise<GeminiResponse> {
    try {
      this.initialize()

      const prompt = this.createKidFriendlyPrompt(`
小学生のコード改善：
\`\`\`javascript
${code}
\`\`\`
${goal ? `目標: ${goal}` : ''}

以下を小学生向けに優しく回答：
1. 改善アイデア（コード例付き）
2. 新しい機能の提案
3. 励ましの言葉

200字以内で回答してください。
`)

      const model = process.env.GEMINI_MODEL || 'gemini-1.5-flash'
      const response = await this.genAI!.models.generateContent({
        model: model,
        contents: prompt
      })

      const text = response.text || '回答を生成できませんでした'

      logger.info('Gemini API - 改善提案生成完了')

      return { text }
    } catch (error) {
      logger.error('Gemini API - 改善提案生成エラー:', error)
      return {
        text: '今はアイデアが思い浮かばないけど、君のコードはとても良いよ！ ✨',
        error: error instanceof Error ? error.message : '不明なエラー'
      }
    }
  }
}

export default new GeminiService()
