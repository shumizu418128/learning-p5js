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

export interface ExampleCodeRequest {
  currentCode: string
  context?: string
}

export interface ExampleCodeResponse {
  code: string
  explanation: string
  error?: string
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

      const model = process.env.GEMINI_MODEL
      if (!model) {
        throw new Error('GEMINI_MODEL環境変数が設定されていません')
      }
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

      const model = process.env.GEMINI_MODEL
      if (!model) {
        throw new Error('GEMINI_MODEL環境変数が設定されていません')
      }
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

  /**
   * AI先生のお手本コード生成
   */
  async generateExampleCode(request: ExampleCodeRequest): Promise<ExampleCodeResponse> {
    try {
      this.initialize()

      const prompt = `
小学生向けプログラミング指導者として、現在のコードを踏まえて楽しいp5.jsのお手本コードを生成してください。

【現在のコード】
\`\`\`javascript
${request.currentCode}
\`\`\`

【要求事項】
1. 現在のコードの良い部分は活かす
2. 小学生が理解しやすいコメントをたくさん入れる（絵文字使用）
3. 楽しくて面白い機能を追加する
4. 色やアニメーションを豊富に使う
5. 実行可能な完全なコードにする
6. キーボードの使用は禁止

【回答形式】
以下のJSON形式で回答してください：

\`\`\`json
{
  "code": "生成されたp5.jsコード（完全なコード）",
  "explanation": "コードの説明（小学生向け、100字以内）"
}
\`\`\`

必ずJSON形式で回答し、コードは実行可能な完全なものにしてください。
`

      const model = process.env.GEMINI_MODEL
      if (!model) {
        throw new Error('GEMINI_MODEL環境変数が設定されていません')
      }
      const response = await this.genAI!.models.generateContent({
        model: model,
        contents: prompt
      })

      const text = response.text || '回答を生成できませんでした'

      // JSONレスポンスを解析
      try {
        const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/)
        if (jsonMatch) {
          const jsonData = JSON.parse(jsonMatch[1])
          return {
            code: jsonData.code || request.currentCode,
            explanation: jsonData.explanation || '楽しいコードができました！'
          }
        } else {
          // JSONが見つからない場合は、コードブロックを探す
          const codeMatch = text.match(/```javascript\s*([\s\S]*?)\s*```/)
          if (codeMatch) {
            return {
              code: codeMatch[1],
              explanation: 'AI先生が楽しいコードを書いてくれました！実行してみてね！'
            }
          }
        }
      } catch (parseError) {
        logger.warn('JSON解析エラー、フォールバック処理を実行:', parseError)
      }

      // フォールバック: 現在のコードをそのまま返す
      return {
        code: request.currentCode,
        explanation: 'AI先生が忙しいみたいだけど、君のコードはとても良いよ！もう一度試してみてね！'
      }

    } catch (error) {
      logger.error('Gemini API - お手本コード生成エラー:', error)

      // エラー時は現在のコードをそのまま返す
      return {
        code: request.currentCode,
        explanation: 'AI先生が忙しいみたいだけど、君のコードはとても良いよ！もう一度試してみてね！',
        error: error instanceof Error ? error.message : '不明なエラー'
      }
    }
  }
}

export default new GeminiService()
