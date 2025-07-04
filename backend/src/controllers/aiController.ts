import { Request, Response } from 'express'
import geminiService from '../services/geminiService'
import { logger } from '../utils/logger'

export class AIController {
  /**
   * コード分析API
   */
  async analyzeCode(req: Request, res: Response) {
    try {
      const { code, language = 'p5js', studentLevel = 'beginner', context } = req.body

      if (!code) {
        return res.status(400).json({
          success: false,
          error: 'コードが提供されていません'
        })
      }

      const result = await geminiService.analyzeCode({
        code,
        language,
        studentLevel,
        context
      })

      res.setHeader('Content-Type', 'application/json')
      return res.json({
        success: true,
        analysis: result.text,
        error: result.error
      })

    } catch (error) {
      logger.error('コード分析エラー:', error)
      res.setHeader('Content-Type', 'application/json')
      return res.status(500).json({
        success: false,
        error: 'コード分析中にエラーが発生しました'
      })
    }
  }

  /**
   * エラーヘルプAPI
   */
  async getErrorHelp(req: Request, res: Response) {
    try {
      const { code, errorMessage, lineNumber } = req.body

      if (!code || !errorMessage) {
        res.setHeader('Content-Type', 'application/json')
        return res.status(400).json({
          success: false,
          error: '必要な情報が不足しています',
          message: 'code と errorMessage は必須です'
        })
      }

      const result = await geminiService.getErrorHelp({
        code,
        errorMessage,
        lineNumber
      })

      res.setHeader('Content-Type', 'application/json')
      return res.json({
        success: true,
        help: result.text,
        error: result.error
      })

    } catch (error) {
      logger.error('エラーヘルプAPI エラー:', error)
      res.setHeader('Content-Type', 'application/json')
      return res.status(500).json({
        success: false,
        error: 'エラーヘルプの生成に失敗しました',
        message: 'サーバーエラーが発生しました'
      })
    }
  }

  /**
   * 質問回答API
   */
  async askQuestion(req: Request, res: Response) {
    try {
      const { question, context } = req.body

      if (!question) {
        res.setHeader('Content-Type', 'application/json')
        return res.status(400).json({
          success: false,
          error: '質問が入力されていません',
          message: 'question フィールドは必須です'
        })
      }

      const result = await geminiService.askQuestion(question, context)

      res.setHeader('Content-Type', 'application/json')
      return res.json({
        success: true,
        answer: result.text,
        error: result.error
      })

    } catch (error) {
      logger.error('質問回答API エラー:', error)
      res.setHeader('Content-Type', 'application/json')
      return res.status(500).json({
        success: false,
        error: '質問への回答に失敗しました',
        message: 'サーバーエラーが発生しました'
      })
    }
  }

  /**
   * コード改善提案API
   */
  async suggestImprovements(req: Request, res: Response) {
    try {
      const { code, goal } = req.body

      if (!code) {
        res.setHeader('Content-Type', 'application/json')
        return res.status(400).json({
          success: false,
          error: 'コードが提供されていません',
          message: 'code フィールドは必須です'
        })
      }

      const result = await geminiService.suggestImprovements(code, goal)

      res.setHeader('Content-Type', 'application/json')
      return res.json({
        success: true,
        suggestions: result.text,
        error: result.error
      })

    } catch (error) {
      logger.error('コード改善提案API エラー:', error)
      res.setHeader('Content-Type', 'application/json')
      return res.status(500).json({
        success: false,
        error: '改善提案の生成に失敗しました',
        message: 'サーバーエラーが発生しました'
      })
    }
  }

  /**
   * AIの状態確認API
   */
  async getStatus(req: Request, res: Response) {
    try {
      const hasApiKey = !!process.env.GEMINI_API_KEY

      res.setHeader('Content-Type', 'application/json')
      return res.json({
        success: true,
        status: hasApiKey ? 'ready' : 'not_configured',
        model: process.env.GEMINI_MODEL,
        features: [
          'code_analysis',
          'error_help',
          'question_answering',
          'improvement_suggestions',
          'example_code_generation'
        ]
      })

    } catch (error) {
      logger.error('AI状態確認API エラー:', error)
      res.setHeader('Content-Type', 'application/json')
      return res.status(500).json({
        success: false,
        error: 'AI状態の確認に失敗しました',
        message: 'サーバーエラーが発生しました'
      })
    }
  }

  /**
   * AI先生のお手本コード生成API
   */
  async generateExampleCode(req: Request, res: Response) {
    try {
      const { currentCode, context } = req.body

      if (!currentCode) {
        res.setHeader('Content-Type', 'application/json')
        return res.status(400).json({
          success: false,
          error: '現在のコードが提供されていません'
        })
      }

      const result = await geminiService.generateExampleCode({
        currentCode,
        context
      })

      res.setHeader('Content-Type', 'application/json')
      return res.json({
        success: true,
        code: result.code,
        explanation: result.explanation,
        error: result.error
      })

    } catch (error) {
      logger.error('お手本コード生成API エラー:', error)
      res.setHeader('Content-Type', 'application/json')
      return res.status(500).json({
        success: false,
        error: 'お手本コードの生成に失敗しました'
      })
    }
  }
}

export default new AIController()
