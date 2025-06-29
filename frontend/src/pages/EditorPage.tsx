import {
    Lightbulb as LightbulbIcon,
    PlayArrow as PlayIcon,
    Refresh as RefreshIcon,
    School as SchoolIcon,
    Send as SendIcon,
    Stop as StopIcon,
} from '@mui/icons-material'
import {
    Box,
    Button,
    Chip,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    List,
    ListItem,
    Paper,
    TextField,
    Typography
} from '@mui/material'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import MarkdownRenderer from '../components/MarkdownRenderer'
import { analyzeCode, getImprovementSuggestions, getLevelColor, getLevelName } from '../utils/codeAnalyzer'

// p5.jsの型定義
declare global {
  interface Window {
    p5: any
  }
}

interface ChatMessage {
  sender: 'user' | 'ai'
  text: string
  id?: string
}

const EditorPage: React.FC = () => {
  // デフォルトのコードを定数として定義
  const defaultCode = `// 🎨 p5.jsでお絵描きしよう！

// ⚙️ 初期設定 - プログラムの開始時に一度だけ実行される
function setup() {
  createCanvas(400, 400);
  background(240);
}

// 🎬 描画ループ - 毎フレーム（約60回/秒）実行される
function draw() {
  background(240);

  fill(255, 100, 100);
  circle(200, 200, 100);

  fill(100, 100, 255);
  circle(mouseX, mouseY, 20);
}`

  const [code, setCode] = useState(defaultCode)
  const [isRunning, setIsRunning] = useState(false)
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    { sender: 'ai', text: 'こんにちは！AI先生だよ。プログラミングで困ったことがあったら、何でも聞いてね！' },
  ])
  const [currentQuestion, setCurrentQuestion] = useState('')
  const [isLoadingAi, setIsLoadingAi] = useState(false)
  const [isP5Loaded, setIsP5Loaded] = useState(false)
  const [showPreviewButton, setShowPreviewButton] = useState(true)
  const [codeAnalysis, setCodeAnalysis] = useState<any[]>([])
  const [improvementSuggestions, setImprovementSuggestions] = useState<any[]>([])
  const previewRef = useRef<HTMLDivElement>(null)
  const p5Instance = useRef<any>(null)
  const p5ScriptRef = useRef<HTMLScriptElement | null>(null)
  const chatScrollRef = useRef<HTMLDivElement>(null)
  const [showResetDialog, setShowResetDialog] = useState(false)
  const [showChatResetDialog, setShowChatResetDialog] = useState(false)

  // 励ましメッセージの配列
  const encouragementMessages = [
    '💪 大丈夫！エラーは誰でも起こすよ。一緒に直そうね！',
    '🌟 エラーを見つけたのはすごいことだよ！一歩ずつ進もう！',
    '🎯 プログラミングは試行錯誤が大切！このエラーも学びのチャンスだよ！',
    '🌈 エラーは宝物！直すことで君はもっと強くなるよ！',
    '🚀 エラーなんて怖くない！AI先生が一緒に解決しよう！',
    '⭐ 君は頑張ってるよ！このエラーもきっと解決できる！',
    '🎨 アーティストも何度も描き直すよ。プログラミングも同じだね！',
    '🔧 エラーは修理のチャンス！一緒に直していこう！',
    '💡 エラーを見つけた君は、もう立派なプログラマーだよ！',
    '🎪 プログラミングは楽しい冒険！エラーも冒険の一部だね！'
  ]

  // ランダムな励ましメッセージを取得
  const getRandomEncouragement = () => {
    const randomIndex = Math.floor(Math.random() * encouragementMessages.length)
    return encouragementMessages[randomIndex]
  }

  // コードが変更された時に自動的に分析を実行
  useEffect(() => {
    const analysis = analyzeCode(code)
    setCodeAnalysis(analysis)

    // 改善アイデアも取得
    const suggestions = getImprovementSuggestions(code)
    setImprovementSuggestions(suggestions)
  }, [code])

  // p5.jsスクリプトの動的読み込み
  useEffect(() => {
    // 既存のp5.jsスクリプトタグを検索して削除
    const existingScript = document.querySelector('script[src*="p5.js"]')
    if (existingScript) {
      try {
        existingScript.remove()
      } catch (error) {
        console.warn('既存のp5.jsスクリプト削除中にエラー:', error)
      }
    }

    // 既存のスクリプトがあれば削除
    if (p5ScriptRef.current && document.head.contains(p5ScriptRef.current)) {
      try {
        document.head.removeChild(p5ScriptRef.current)
      } catch (error) {
        console.warn('既存のスクリプトタグ削除中にエラー:', error)
      }
    }

    const script = document.createElement('script')
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.7.0/p5.min.js'
    script.onload = () => {
      console.log('p5.js loaded')
      setIsP5Loaded(true)
    }
    script.onerror = () => {
      console.error('p5.jsの読み込みに失敗しました')
      setIsP5Loaded(false)
    }
    p5ScriptRef.current = script
    document.head.appendChild(script)

    return () => {
      // クリーンアップ時にp5インスタンスを削除
      if (p5Instance.current) {
        try {
          p5Instance.current.remove()
          p5Instance.current = null
        } catch (error) {
          console.warn('p5インスタンスの削除中にエラーが発生しました:', error)
        }
      }

      // スクリプトタグを安全に削除
      if (p5ScriptRef.current && document.head.contains(p5ScriptRef.current)) {
        try {
          document.head.removeChild(p5ScriptRef.current)
        } catch (error) {
          console.warn('スクリプトタグ削除中にエラー:', error)
        }
      }
    }
  }, [])

  // プレビューエリアのクリーンアップ
  const clearPreview = useCallback((showPlaceholder = true) => {
    // DOMの直接操作を避け、Reactの状態管理のみを使用
    if (showPlaceholder) {
      setShowPreviewButton(true)
    } else {
      setShowPreviewButton(false)
    }
  }, [])

  // コンポーネントのアンマウント時のクリーンアップ
  useEffect(() => {
    return () => {
      // コンポーネントがアンマウントされる時にp5インスタンスを確実に削除
      if (p5Instance.current) {
        try {
          p5Instance.current.remove()
          p5Instance.current = null
        } catch (error) {
          console.warn('アンマウント時のp5インスタンス削除エラー:', error)
        }
      }
    }
  }, [])

  // コード実行
  const runCode = useCallback(async () => {
    console.log('コード実行開始')

    if (!window.p5) {
      console.error('p5.jsが読み込まれていません')
      alert('p5.jsが読み込まれていません。しばらく待ってから再試行してください。')
      return
    }

    if (!isP5Loaded) {
      console.error('p5.jsの読み込みが完了していません')
      alert('p5.jsの読み込みが完了していません。しばらく待ってから再試行してください。')
      return
    }

    try {
      console.log('既存のp5インスタンスを削除中...')
      // 既存のp5インスタンスを安全に削除
      if (p5Instance.current) {
        try {
          p5Instance.current.remove()
          p5Instance.current = null
          console.log('既存のp5インスタンスを削除しました')
        } catch (error) {
          console.warn('既存のp5インスタンス削除中にエラー:', error)
        }
      }

      // プレビューエリアをクリア
      console.log('プレビューエリアをクリア中...')
      setShowPreviewButton(false)

      // 少し待ってから新しいインスタンスを作成（DOMの更新を待つ）
      setTimeout(() => {
        try {
          console.log('新しいp5インスタンスを作成中...')
          // p5.jsスケッチを作成（インスタンスモード）
          const sketch = (p: any) => {
            // グローバル変数を設定
            let userSetup: any = null
            let userDraw: any = null
            let userMousePressed: any = null
            let userMouseReleased: any = null
            let userMouseDragged: any = null
            let userKeyPressed: any = null
            let userKeyReleased: any = null

            try {
              // ユーザーコードを安全に評価
              const evalCode = new Function('p', `
                // p5の関数をグローバルスコープに定義
                window.createCanvas = p.createCanvas.bind(p)
                window.background = p.background.bind(p)
                window.fill = p.fill.bind(p)
                window.stroke = p.stroke.bind(p)
                window.noStroke = p.noStroke.bind(p)
                window.noFill = p.noFill.bind(p)
                window.circle = p.circle.bind(p)
                window.ellipse = p.ellipse.bind(p)
                window.rect = p.rect.bind(p)
                window.line = p.line.bind(p)
                window.point = p.point.bind(p)
                window.triangle = p.triangle.bind(p)
                window.text = p.text.bind(p)
                window.textSize = p.textSize.bind(p)
                window.textAlign = p.textAlign.bind(p)
                window.random = p.random.bind(p)
                window.map = p.map.bind(p)
                window.constrain = p.constrain.bind(p)
                window.lerp = p.lerp.bind(p)
                window.sin = p.sin.bind(p)
                window.cos = p.cos.bind(p)
                window.tan = p.tan.bind(p)
                window.degrees = p.degrees.bind(p)
                window.radians = p.radians.bind(p)
                window.push = p.push.bind(p)
                window.pop = p.pop.bind(p)
                window.translate = p.translate.bind(p)
                window.rotate = p.rotate.bind(p)
                window.scale = p.scale.bind(p)

                // 定数
                window.CENTER = p.CENTER
                window.LEFT = p.LEFT
                window.RIGHT = p.RIGHT
                window.TOP = p.TOP
                window.BOTTOM = p.BOTTOM

                // 動的プロパティをグローバルスコープに定義
                Object.defineProperty(window, 'mouseX', {
                  get: () => p.mouseX,
                  configurable: true
                })
                Object.defineProperty(window, 'mouseY', {
                  get: () => p.mouseY,
                  configurable: true
                })
                Object.defineProperty(window, 'width', {
                  get: () => p.width,
                  configurable: true
                })
                Object.defineProperty(window, 'height', {
                  get: () => p.height,
                  configurable: true
                })
                Object.defineProperty(window, 'frameCount', {
                  get: () => p.frameCount,
                  configurable: true
                })

                // デフォルトの空のイベント関数を定義
                function mousePressed() {}
                function mouseReleased() {}
                function mouseDragged() {}
                function keyPressed() {}
                function keyReleased() {}

                ${code}

                return { setup, draw, mousePressed, mouseReleased, mouseDragged, keyPressed, keyReleased }
              `)

              const result = evalCode(p)
              userSetup = result.setup
              userDraw = result.draw
              userMousePressed = result.mousePressed
              userMouseReleased = result.mouseReleased
              userMouseDragged = result.mouseDragged
              userKeyPressed = result.keyPressed
              userKeyReleased = result.keyReleased
              console.log('ユーザーコードの評価が完了しました')

            } catch (error) {
              console.error('ユーザーコード評価エラー:', error)
              // エラーメッセージを取得
              const errorMessage = error instanceof Error ? error.message : 'コードの実行中にエラーが発生しました'

              // エラー状態を設定
              setIsRunning(false)
              setShowPreviewButton(false) // プレビューボタンを非表示にする

              // エラーハンドリング用のsetup/draw
              userSetup = () => {
                p.createCanvas(400, 400)
                p.background(255, 220, 220)
                p.fill(200, 0, 0)
                p.textAlign(p.CENTER, p.CENTER)
                p.textSize(16)
                p.text('🚨 エラーが発生しました', 200, 150)
                p.textSize(12)
                p.fill(100)
                // エラーメッセージを複数行で表示
                const lines = errorMessage.split('\n')
                lines.forEach((line, index) => {
                  p.text(line, 200, 180 + (index * 20))
                })

                // AI先生への案内メッセージ
                p.fill(50, 100, 200)
                p.textSize(14)
                p.text('🤖 AI先生が原因を教えてくれるよ！', 200, 280)
                p.textSize(12)
                p.fill(80)
                p.text('チャットを確認してみてね', 200, 300)
              }
              userDraw = () => {}

              // AIチャットを自動で開始して修正方法を提案
              askAiForErrorHelp(errorMessage)
            }

            p.setup = () => {
              console.log('p5 setup実行中...')
              if (userSetup) {
                userSetup()
              } else {
                p.createCanvas(400, 400)
              }
              console.log('p5 setup完了')
            }

            p.draw = () => {
              if (userDraw) {
                userDraw()
              }
            }

            // イベント関数を設定
            p.mousePressed = () => {
              if (userMousePressed) {
                userMousePressed()
              }
            }

            p.mouseReleased = () => {
              if (userMouseReleased) {
                userMouseReleased()
              }
            }

            p.mouseDragged = () => {
              if (userMouseDragged) {
                userMouseDragged()
              }
            }

            p.keyPressed = () => {
              if (userKeyPressed) {
                userKeyPressed()
              }
            }

            p.keyReleased = () => {
              if (userKeyReleased) {
                userKeyReleased()
              }
            }
          }

          // 新しいp5インスタンスを作成
          if (previewRef.current) {
            try {
              p5Instance.current = new window.p5(sketch, previewRef.current)
              setIsRunning(true)
              console.log('新しいp5インスタンスが作成されました')
            } catch (error) {
              console.error('p5インスタンス作成エラー:', error)
              // エラー時はプレビューボタンを表示せず、エラーメッセージを表示
              setShowPreviewButton(false)
              setIsRunning(false)

              // AIチャットを自動で開始して修正方法を提案
              const p5ErrorMessage = error instanceof Error ? error.message : 'p5インスタンスの作成中にエラーが発生しました'
              askAiForErrorHelp(p5ErrorMessage)
            }
          } else {
            console.error('previewRef.currentがnullです')
          }
        } catch (error) {
          console.error('p5インスタンス作成エラー:', error)
          // エラー時はプレビューボタンを表示せず、エラーメッセージを表示
          setShowPreviewButton(false)
          setIsRunning(false)

          // AIチャットを自動で開始して修正方法を提案
          const sketchErrorMessage = error instanceof Error ? error.message : 'p5インスタンスの作成中にエラーが発生しました'
          askAiForErrorHelp(sketchErrorMessage)
        }
      }, 100) // 100ms待機

    } catch (error) {
      console.error('コード実行エラー:', error)
      // エラー時はプレビューボタンを表示せず、エラーメッセージを表示
      setShowPreviewButton(false)
      setIsRunning(false)

      // AIチャットを自動で開始して修正方法を提案
      const runErrorMessage = error instanceof Error ? error.message : '予期しないエラーが発生しました'
      askAiForErrorHelp(runErrorMessage)
    }
  }, [code, clearPreview, isP5Loaded])

  // 実行停止
  const stopCode = useCallback(() => {
    console.log('コード停止開始')

    if (p5Instance.current) {
      try {
        console.log('p5インスタンスを削除中...')
        p5Instance.current.remove()
        p5Instance.current = null
        console.log('p5インスタンスを削除しました')
      } catch (error) {
        console.warn('p5インスタンス削除中にエラー:', error)
      }
    } else {
      console.log('削除するp5インスタンスがありません')
    }

    // グローバル変数をクリア
    try {
      const globalVars = [
        'createCanvas', 'background', 'fill', 'stroke', 'noStroke', 'noFill',
        'circle', 'ellipse', 'rect', 'line', 'point', 'triangle',
        'text', 'textSize', 'textAlign', 'random', 'map', 'constrain',
        'lerp', 'sin', 'cos', 'tan', 'degrees', 'radians',
        'push', 'pop', 'translate', 'rotate', 'scale',
        'CENTER', 'LEFT', 'RIGHT', 'TOP', 'BOTTOM',
        'mouseX', 'mouseY', 'width', 'height', 'frameCount',
        'mousePressed', 'mouseReleased', 'mouseDragged', 'keyPressed', 'keyReleased'
      ]

      globalVars.forEach(varName => {
        if (window.hasOwnProperty(varName)) {
          delete (window as any)[varName]
        }
      })
      console.log('グローバル変数をクリアしました')
    } catch (error) {
      console.warn('グローバル変数クリア中にエラー:', error)
    }

    setShowPreviewButton(true)
    setIsRunning(false)
    console.log('コード停止完了')
  }, [clearPreview])

  // AI先生に質問
  const askAi = async () => {
    if (!currentQuestion.trim()) return

    const questionText = currentQuestion.trim() // 質問内容を保存
    const userMessage: ChatMessage = { sender: 'user', text: questionText }
    setChatHistory((prev) => [...prev, userMessage])
    setCurrentQuestion('')
    setIsLoadingAi(true)

    try {
      const response = await fetch('/api/ai/question', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: questionText,
          context: `現在のコード: ${code}\n\nチャット履歴:\n${chatHistory.map(msg => `${msg.sender}: ${msg.text}`).join('\n')}`
        }),
      })

      // レスポンスのステータスコードをチェック
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      // レスポンスのContent-Typeをチェック
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error(`Expected JSON response but got ${contentType}`)
      }

      const data = await response.json()
      if (data.success) {
        const aiResponse: ChatMessage = { sender: 'ai', text: data.answer || 'AI先生からのアドバイスを受け取りました！' }
        setChatHistory((prev) => [...prev, aiResponse])
      } else {
        const aiError: ChatMessage = { sender: 'ai', text: '今、AI先生は忙しいみたい。もう一度試してみてね！ 🤖' }
        setChatHistory((prev) => [...prev, aiError])
      }
    } catch (error) {
      console.error('AI API エラー:', error)
      const aiError: ChatMessage = { sender: 'ai', text: '🤖 AI先生は今、別のお友達を手伝っているみたい！少し待ってからもう一度聞いてみてね。それまでは自分でいろいろ試してみよう！' }
      setChatHistory((prev) => [...prev, aiError])
    }
    setIsLoadingAi(false)
  }

  // AI先生に自動フィードバックを求める
  const askAiForFeedback = async () => {
    setIsLoadingAi(true)

    try {
      const response = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: code,
          studentLevel: 'beginner',
          context: `現在のコードについて、小学生向けに優しくフィードバックしてください。

コードの内容: ${code}

実行状態: ${isRunning ? '実行中' : '停止中'}

以下の点について小学生向けに優しく説明してください：
1. コードの良い点（何ができているか）
2. 改善できる点（もっと良くする方法）
3. 次のステップの提案（何を試してみるといいか）
4. 励ましのメッセージ

小学生が理解しやすい言葉で、絵文字も使って親しみやすく説明してください。`
        }),
      })

      // レスポンスのステータスコードをチェック
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      // レスポンスのContent-Typeをチェック
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error(`Expected JSON response but got ${contentType}`)
      }

      const data = await response.json()
      if (data.success) {
        const aiResponse: ChatMessage = {
          sender: 'ai',
          text: data.analysis || 'AI先生からのフィードバックを受け取りました！'
        }
        setChatHistory((prev) => [...prev, aiResponse])
      } else {
        const aiError: ChatMessage = {
          sender: 'ai',
          text: '今、AI先生は忙しいみたい。もう一度試してみてね！ 🤖'
        }
        setChatHistory((prev) => [...prev, aiError])
      }
    } catch (error) {
      console.error('AI API エラー:', error)
      const aiError: ChatMessage = {
        sender: 'ai',
        text: '🤖 AI先生は今、別のお友達を手伝っているみたい！少し待ってからもう一度聞いてみてね。それまでは自分でいろいろ試してみよう！'
      }
      setChatHistory((prev) => [...prev, aiError])
    }
    setIsLoadingAi(false)
  }

  // AI先生に自動でエラー修正を求める
  const askAiForErrorHelp = async (errorMessage: string, errorLine?: number) => {
    setIsLoadingAi(true)

    // 最初に励ましメッセージを表示
    const encouragementMessage: ChatMessage = {
      sender: 'ai',
      text: getRandomEncouragement()
    }
    setChatHistory((prev) => [...prev, encouragementMessage])

    try {
      const response = await fetch('/api/ai/error-help', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: code,
          errorMessage: errorMessage,
          lineNumber: errorLine
        }),
      })

      // レスポンスのステータスコードをチェック
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      // レスポンスのContent-Typeをチェック
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error(`Expected JSON response but got ${contentType}`)
      }

      const data = await response.json()
      if (data.success) {
        const aiResponse: ChatMessage = {
          sender: 'ai',
          text: `🔧 修正方法を教えるね！\n\n${data.help || 'AI先生からの修正アドバイスを受け取りました！'}`,
          id: 'error-help-message' // 修正方法メッセージにIDを追加
        }
        setChatHistory((prev) => [...prev, aiResponse])
      } else {
        const aiError: ChatMessage = {
          sender: 'ai',
          text: '今、AI先生は忙しいみたい。もう一度試してみてね！ 🤖'
        }
        setChatHistory((prev) => [...prev, aiError])
      }
    } catch (error) {
      console.error('AI API エラー:', error)
      const aiError: ChatMessage = {
        sender: 'ai',
        text: '🤖 AI先生は今、別のお友達を手伝っているみたい！少し待ってからもう一度聞いてみてね。それまでは自分でいろいろ試してみよう！'
      }
      setChatHistory((prev) => [...prev, aiError])
    }
    setIsLoadingAi(false)

    // 修正方法のメッセージが表示された後にチャットを自動スクロール
    setTimeout(() => {
      const errorHelpElement = document.getElementById('error-help-message')
      if (errorHelpElement && chatScrollRef.current) {
        // 修正方法メッセージの一番上にスクロール
        const elementTop = errorHelpElement.offsetTop
        const containerTop = chatScrollRef.current.offsetTop
        chatScrollRef.current.scrollTop = elementTop - containerTop - 20 // 20pxの余白を追加
      }
    }, 100) // 100ms待機してからスクロール
  }

  // AI先生にお手本コードを求める
  const askAiForExampleCode = async () => {
    setIsLoadingAi(true)

    try {
      const response = await fetch('/api/ai/example-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentCode: code
        }),
      })

      // レスポンスのステータスコードをチェック
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      // レスポンスのContent-Typeをチェック
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error(`Expected JSON response but got ${contentType}`)
      }

      const data = await response.json()
      if (data.success) {
        // AIからのコードを自動でエディタに設定
        if (data.code) {
          setCode(data.code)
        }

        const aiResponse: ChatMessage = {
          sender: 'ai',
          text: `🎨 AI先生が君のコードをもとに楽しいお手本を書いたよ！\n
君のコードの良い部分を活かして、もっと楽しい機能を追加したんだ！\n
自動でコードエディタに書き込まれたから、実行ボタンを押して試してみてね！\n\n
${data.explanation || ''}`,
          id: 'example-code-message'
        }
        setChatHistory((prev) => [...prev, aiResponse])
      } else {
        const aiError: ChatMessage = {
          sender: 'ai',
          text: '今、AI先生は忙しいみたい。もう一度試してみてね！ 🤖'
        }
        setChatHistory((prev) => [...prev, aiError])
      }
    } catch (error) {
      console.error('AI API エラー:', error)
      const aiError: ChatMessage = {
        sender: 'ai',
        text: '🤖 AI先生は今、別のお友達を手伝っているみたい！少し待ってからもう一度聞いてみてね。それまでは自分でいろいろ試してみよう！'
      }
      setChatHistory((prev) => [...prev, aiError])
    }
    setIsLoadingAi(false)
  }

  // サンプルコード
  const examples = [
    {
      title: '🔴 シンプルな円',
      code: `// ⚙️ 初期設定 - プログラムの開始時に一度だけ実行される
function setup() {
  createCanvas(400, 400);
  background(240);
}

// 🎬 描画ループ - 毎フレーム（約60回/秒）実行される
function draw() {
  background(240);
  fill(255, 0, 0);
  circle(200, 200, 100);
}`
    },
    {
      title: '🌈 カラフルな円',
      code: `// ⚙️ 初期設定 - プログラムの開始時に一度だけ実行される
function setup() {
  createCanvas(400, 400);
  background(0);
}

// 🎬 描画ループ - 毎フレーム（約60回/秒）実行される
function draw() {
  background(0);
  for(let i = 0; i < 10; i++) {
    fill(i * 25, 100, 200);
    circle(50 + i * 30, 200, 50);
  }
}`
    },
    {
      title: '🎮 マウスで操作',
      code: `// ⚙️ 初期設定 - プログラムの開始時に一度だけ実行される
function setup() {
  createCanvas(400, 400);
  background(240);
}

// 🎬 描画ループ - 毎フレーム（約60回/秒）実行される
function draw() {
  background(240);
  fill(100, 200, 255);
  circle(mouseX, mouseY, 50);
}`
    }
  ]

  // チャット履歴が更新された時に一番下にスクロール
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight
    }
  }, [chatHistory, isLoadingAi])

  // リセット確認ダイアログを開く
  const handleResetClick = () => {
    setShowResetDialog(true)
  }

  // リセットを実行
  const handleResetConfirm = () => {
    setCode(defaultCode)
    setShowResetDialog(false)
  }

  // リセットをキャンセル
  const handleResetCancel = () => {
    setShowResetDialog(false)
  }

  // チャットリセット確認ダイアログを開く
  const handleChatResetClick = () => {
    setShowChatResetDialog(true)
  }

  // チャットリセットを実行
  const handleChatResetConfirm = () => {
    setChatHistory([
      { sender: 'ai', text: 'こんにちは！AI先生だよ。プログラミングで困ったことがあったら、何でも聞いてね！' },
    ])
    setShowChatResetDialog(false)
  }

  // チャットリセットをキャンセル
  const handleChatResetCancel = () => {
    setShowChatResetDialog(false)
  }

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        pointerEvents: 'none'
      }
    }}>
      {/* ヘッダー */}
      <Paper sx={{
        p: 2, // パディングを少し減らす
        background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.2)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        position: 'relative',
        zIndex: 1,
        flexShrink: 0, // ヘッダーのサイズを固定
        margin: '8px auto 0 auto'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
          <Typography variant="h4" sx={{ // サイズを少し小さく
            fontWeight: 800,
            mb: { xs: 1, md: 0 }, // マージンを減らす
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            🎨 KidsCode Studio
          </Typography>
          <Typography variant="body1" sx={{ // サイズを小さく
            opacity: 0.8,
            color: '#666',
            fontWeight: 500,
            textAlign: 'center'
          }}>
            楽しくプログラミングを学ぼう！
          </Typography>
        </Box>
      </Paper>

      {/* ツールバー */}
      <Paper sx={{
        p: 1.5, // パディングを減らす
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.2)',
        boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
        position: 'relative',
        zIndex: 1,
        flexShrink: 0, // ツールバーのサイズを固定
        margin: '8px auto 0 auto'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>

          <Button
            variant="contained"
            startIcon={isRunning ? <StopIcon /> : <PlayIcon />}
            onClick={isRunning ? stopCode : runCode}
            disabled={!isP5Loaded}
            sx={{
              background: isRunning
                ? 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)'
                : 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)',
              color: 'white',
              fontWeight: 600,
              borderRadius: '12px',
              px: 3,
              py: 1, // パディングを減らす
              boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
              },
              '&:disabled': {
                background: '#ccc',
                color: '#666',
                transform: 'none',
                boxShadow: 'none',
              },
              transition: 'all 0.3s ease',
            }}
          >
            {isRunning ? '停止' : isP5Loaded ? '実行' : '読み込み中...'}
          </Button>

          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleResetClick}
            sx={{
              color: '#667eea',
              borderColor: '#667eea',
              borderRadius: '12px',
              px: 3,
              py: 1, // パディングを減らす
              fontWeight: 600,
              '&:hover': {
                background: 'rgba(102, 126, 234, 0.1)',
                borderColor: '#5a6fd8',
                transform: 'translateY(-1px)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            リセット
          </Button>

          <Button
            variant="contained"
            startIcon={<LightbulbIcon />}
            onClick={askAiForFeedback}
            disabled={isLoadingAi}
            sx={{
              background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
              color: '#333',
              fontWeight: 600,
              borderRadius: '12px',
              px: 3,
              py: 1, // パディングを減らす
              boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 20px rgba(0,0,0,0.25)',
              },
              '&:disabled': {
                background: '#ccc',
                color: '#666',
                transform: 'none',
                boxShadow: 'none',
              },
              minWidth: '200px',
              transition: 'all 0.3s ease',
            }}
          >
            {isLoadingAi ? '考え中...' : 'AI先生に聞いてみる'}
          </Button>

          <Button
            variant="contained"
            startIcon={<SchoolIcon />}
            onClick={askAiForExampleCode}
            disabled={isLoadingAi}
            sx={{
              background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
              color: '#333',
              fontWeight: 600,
              borderRadius: '12px',
              px: 3,
              py: 1,
              boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 20px rgba(0,0,0,0.25)',
              },
              '&:disabled': {
                background: '#ccc',
                color: '#666',
                transform: 'none',
                boxShadow: 'none',
              },
              minWidth: '200px',
              transition: 'all 0.3s ease',
            }}
          >
            {isLoadingAi ? 'お手本作成中...' : 'AI先生のお手本を見る'}
          </Button>
        </Box>
      </Paper>

      {/* メインエディタエリア */}
      <Box sx={{
        height: '80vh', // 画面の縦幅8割を占めるように設定
        display: 'flex',
        p: 1,
        gap: 1,
        position: 'relative',
        zIndex: 1,
        minHeight: 0
      }}>
        <Box sx={{ display: 'flex', height: '100%', gap: 1, width: '100%' }}>
          {/* コードエディタ */}
          <Box sx={{
            flex: '1 1 35%',
            height: '100%',
            minWidth: 0
          }}>
            <Paper sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              background: 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
              borderRadius: '16px',
              overflow: 'hidden'
            }}>
              <Box sx={{
                p: 2,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                fontWeight: 600
              }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  📝 コードエディタ
                </Typography>
              </Box>
              <TextField
                multiline
                fullWidth
                value={code}
                onChange={(e) => setCode(e.target.value)}
                sx={{
                  flex: 1,
                  '& .MuiInputBase-root': {
                    height: '100%',
                    alignItems: 'flex-start',
                    fontFamily: '"Fira Code", "Consolas", "Monaco", monospace',
                    fontSize: '14px',
                    lineHeight: 1.6,
                    background: '#1e1e1e',
                    color: '#d4d4d4',
                    borderRadius: 0,
                  },
                  '& .MuiInputBase-input': {
                    height: '100% !important',
                    overflow: 'auto !important',
                    padding: '16px !important',
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    border: 'none',
                  },
                  '& .MuiInputBase-root:hover .MuiOutlinedInput-notchedOutline': {
                    border: 'none',
                  },
                  '& .MuiInputBase-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    border: 'none',
                  },
                }}
                placeholder="ここにp5.jsのコードを書いてね！"
              />
            </Paper>
          </Box>

          {/* プレビューエリア */}
          <Box sx={{
            flex: '1 1 35%',
            height: '100%',
            minWidth: 0,
            display: 'block'
          }}>
            <Paper sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              background: 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
              borderRadius: '16px',
              overflow: 'hidden'
            }}>
              <Box sx={{
                p: 2,
                background: 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)',
                color: 'white',
                fontWeight: 600
              }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  🎬 プレビュー
                </Typography>
              </Box>
              <Box
                ref={previewRef}
                sx={{
                  flex: 1,
                  bgcolor: '#f8f9fa',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  border: '2px dashed #dee2e6',
                  borderRadius: '12px',
                  margin: '12px',
                  position: 'relative',
                }}
              >
                {showPreviewButton && !isRunning && (
                  <Button
                    onClick={runCode}
                    disabled={!isP5Loaded}
                    sx={{
                      background: 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)',
                      color: 'white',
                      fontWeight: 600,
                      borderRadius: '20px',
                      px: 4,
                      py: 2,
                      boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                      fontSize: '1.1rem',
                      textTransform: 'none',
                      zIndex: 1,
                      position: 'relative',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
                        background: 'linear-gradient(135deg, #3db8b0 0%, #3a8f7d 100%)',
                      },
                      '&:disabled': {
                        background: '#ccc',
                        color: '#666',
                        transform: 'none',
                        boxShadow: 'none',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    {isP5Loaded ? '▶ 実行' : '読み込み中...'}
                  </Button>
                )}
              </Box>
            </Paper>
          </Box>

          {/* AI先生チャットパネル */}
          <Box sx={{
            display: 'block',
            flex: '1 1 30%',
            height: '100%',
            minWidth: 0
          }}>
            <Paper sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              background: 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
              borderRadius: '16px',
              overflow: 'hidden'
            }}>
              <Box sx={{
                p: 2,
                background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
                color: '#2c3e50', // 文字色を濃く
                fontWeight: 600,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <Typography variant="h6" sx={{
                  fontWeight: 700,
                  fontSize: '1.25rem', // フォントサイズを大きく
                  letterSpacing: '0.02em' // 文字間隔を少し広げる
                }}>
                  🤖 AI先生とチャット
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleChatResetClick}
                  sx={{
                    color: '#667eea',
                    borderColor: '#667eea',
                    borderRadius: '8px',
                    px: 1.5,
                    py: 0.5,
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    minWidth: 'auto',
                    '&:hover': {
                      background: 'rgba(102, 126, 234, 0.1)',
                      borderColor: '#5a6fd8',
                      transform: 'translateY(-1px)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  リセット
                </Button>
              </Box>
              <Box
                ref={chatScrollRef}
                sx={{
                  flex: 1,
                  overflowY: 'auto',
                  overflowX: 'hidden', // 横スクロールを無効化
                  p: 2,
                  bgcolor: '#ffffff', // より読みやすい白背景に変更
                  minHeight: 0 // 最小高さの制限を削除
                }}
              >
                <List sx={{ p: 0 }}>
                  {chatHistory.map((msg, index) => (
                    <ListItem
                      key={index}
                      id={msg.id}
                      sx={{
                        justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                        mb: 1.5, // メッセージ間の間隔を少し広げる
                        px: 0,
                        wordBreak: 'break-word', // 長いテキストの折り返し
                      }}
                    >
                      <Paper
                        sx={{
                          p: 2, // パディングを増やして読みやすく
                          borderRadius: '16px',
                          maxWidth: '85%', // 最大幅を少し広げる
                          background: msg.sender === 'user'
                            ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                            : '#f8f9fa', // AIメッセージの背景をより読みやすい色に変更
                          color: msg.sender === 'user' ? 'white' : '#2c3e50', // AIメッセージの文字色を濃く
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                          wordWrap: 'break-word', // 長い単語の折り返し
                          border: msg.sender === 'ai' ? '1px solid #e9ecef' : 'none', // AIメッセージにボーダーを追加
                        }}
                      >
                        {msg.sender === 'ai' ? (
                          <MarkdownRenderer
                            content={msg.text}
                            sx={{
                              '& p': {
                                margin: 0,
                                lineHeight: 1.6,
                                fontSize: { md: '1rem', lg: '1.05rem' },
                                fontWeight: 500,
                                letterSpacing: '0.01em',
                                color: '#2c3e50'
                              },
                              '& pre': {
                                margin: '8px 0',
                                borderRadius: '8px',
                                overflow: 'auto'
                              },
                              '& code': {
                                fontFamily: 'Consolas, Monaco, "Courier New", monospace'
                              }
                            }}
                          />
                        ) : (
                          <Typography
                            variant="body2"
                            sx={{
                              whiteSpace: 'pre-wrap',
                              wordBreak: 'break-word',
                              lineHeight: 1.6,
                              fontSize: { md: '1rem', lg: '1.05rem' },
                              fontWeight: 600,
                              letterSpacing: '0.01em',
                              color: 'white'
                            }}
                          >
                            {msg.text}
                          </Typography>
                        )}
                      </Paper>
                    </ListItem>
                  ))}
                  {isLoadingAi && (
                    <ListItem sx={{ justifyContent: 'flex-start', mb: 1, px: 0 }}>
                      <CircularProgress size={20} sx={{ color: '#667eea' }} />
                      <Typography variant="body2" sx={{
                        ml: 1,
                        color: '#2c3e50', // 文字色を濃く
                        fontWeight: 500,
                        fontSize: '1rem' // フォントサイズを大きく
                      }}>
                        AI先生が考えてるよ...
                      </Typography>
                    </ListItem>
                  )}
                </List>
              </Box>
              <Box sx={{
                p: 2,
                borderTop: '1px solid rgba(0,0,0,0.1)',
                bgcolor: '#ffffff', // 背景色を白に変更
                flexShrink: 0 // 入力エリアのサイズを固定
              }}>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="AI先生に質問してね！"
                  value={currentQuestion}
                  onChange={(e) => setCurrentQuestion(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !isLoadingAi) {
                      askAi()
                    }
                  }}
                  size="small" // 入力フィールドを少し小さくする
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      background: 'white',
                      fontSize: '1rem', // フォントサイズを大きく
                      '& input::placeholder': {
                        color: '#6c757d', // プレースホルダーの色を調整
                        opacity: 1,
                        fontSize: '1rem', // プレースホルダーのフォントサイズも大きく
                      },
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#dee2e6', // ボーダー色を調整
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#4CAF50', // ホバー時のボーダー色
                    },
                    '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#4CAF50', // フォーカス時のボーダー色
                    },
                  }}
                  InputProps={{
                    endAdornment: (
                      <Button
                        onClick={askAi}
                        disabled={isLoadingAi || !currentQuestion.trim()}
                        sx={{
                          minWidth: 'auto',
                          p: 1,
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          color: 'white',
                          borderRadius: '8px',
                          '&:hover': {
                            transform: 'translateY(-1px)',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                          },
                          '&:disabled': {
                            background: '#ccc',
                            transform: 'none',
                            boxShadow: 'none',
                          },
                          transition: 'all 0.3s ease',
                        }}
                      >
                        <SendIcon />
                      </Button>
                    ),
                  }}
                />
              </Box>
            </Paper>
          </Box>
        </Box>
      </Box>

      {/* サンプルコードエリア */}
      <Paper sx={{
        p: 1.5, // パディングを減らす
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.2)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        borderRadius: '16px',
        margin: '8px', // マージンを減らす
        position: 'relative',
        zIndex: 1,
        flexShrink: 0 // サイズを固定
      }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: '#333' }}> {/* マージンを減らす */}
          💡 サンプルコード
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}> {/* ギャップを減らす */}
          {examples.map((example, index) => (
            <Chip
              key={index}
              label={example.title}
              onClick={() => setCode(example.code)}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                fontWeight: 600,
                borderRadius: '20px',
                px: 1.5, // パディングを減らす
                py: 0.5, // パディングを減らす
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontSize: '0.875rem', // フォントサイズを小さく
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(102, 126, 234, 0.4)',
                },
              }}
            />
          ))}
        </Box>
      </Paper>

      {/* ここからコード解説エリア */}
      <Paper sx={{
        p: 1.5,
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.2)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
        borderRadius: '16px',
        margin: '8px',
        position: 'relative',
        zIndex: 1,
        flexShrink: 0
      }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: '#333' }}>
          📝 コードのポイント解説
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          {codeAnalysis.length === 0 ? (
            <Typography variant="body2" sx={{ color: '#888' }}>
              代表的なポイントはまだ見つかりませんでした。
            </Typography>
          ) : (
            codeAnalysis.map((item, idx) => (
              <Paper key={idx} sx={{
                p: 2,
                borderRadius: '14px',
                minWidth: 180,
                maxWidth: 320,
                background: '#f7fafd',
                border: `2px solid ${getLevelColor(item.level)}`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: 1,
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
              }}>
                <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: 1 }}>
                  <span style={{ fontSize: '1.4em' }}>{item.icon}</span> {item.title}
                </Typography>
                <Typography variant="body2" sx={{ color: '#333', mb: 1 }}>
                  {item.description}
                </Typography>
                {item.codeExample && (
                  <Paper sx={{
                    p: 1.5,
                    background: '#2d3748',
                    color: '#e2e8f0',
                    borderRadius: '8px',
                    fontFamily: 'monospace',
                    fontSize: '0.875rem',
                    width: '100%',
                    overflow: 'auto'
                  }}>
                    <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                      {item.codeExample}
                    </pre>
                  </Paper>
                )}
                <Chip label={getLevelName(item.level)} size="small" sx={{ background: getLevelColor(item.level), color: 'white', fontWeight: 600 }} />
              </Paper>
            ))
          )}
        </Box>
      </Paper>

      {/* 改善アイデアのサジェストエリア */}
      {improvementSuggestions.length > 0 && (
        <Paper sx={{
          p: 1.5,
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.2)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
          borderRadius: '16px',
          margin: '8px',
          position: 'relative',
          zIndex: 1,
          flexShrink: 0
        }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: '#333' }}>
            💡 もっと良くするアイデア
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            {improvementSuggestions.map((suggestion, idx) => (
              <Paper key={idx} sx={{
                p: 2,
                borderRadius: '14px',
                minWidth: 200,
                maxWidth: 350,
                background: 'linear-gradient(135deg, #f8f9ff 0%, #e8f4fd 100%)',
                border: `2px solid #667eea`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: 1,
                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.1)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(102, 126, 234, 0.2)',
                }
              }}>
                <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: 1 }}>
                  <span style={{ fontSize: '1.4em' }}>{suggestion.icon}</span> {suggestion.title}
                </Typography>
                <Typography variant="body2" sx={{ color: '#333', mb: 1 }}>
                  {suggestion.description}
                </Typography>
                {suggestion.codeExample && (
                  <Paper sx={{
                    p: 1.5,
                    background: '#2d3748',
                    color: '#e2e8f0',
                    borderRadius: '8px',
                    fontFamily: 'monospace',
                    fontSize: '0.875rem',
                    width: '100%',
                    overflow: 'auto'
                  }}>
                    <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                      {suggestion.codeExample}
                    </pre>
                  </Paper>
                )}
                <Chip label={getLevelName(suggestion.level)} size="small" sx={{ background: getLevelColor(suggestion.level), color: 'white', fontWeight: 600 }} />
              </Paper>
            ))}
          </Box>
        </Paper>
      )}

      {/* チャットリセット確認ダイアログ */}
      <Dialog
        open={showChatResetDialog}
        onClose={handleChatResetCancel}
        aria-labelledby="chat-reset-dialog-title"
        aria-describedby="chat-reset-dialog-description"
        PaperProps={{
          sx: {
            borderRadius: '16px',
            background: 'rgba(255,255,255,0.98)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
            border: '1px solid rgba(255,255,255,0.2)',
          }
        }}
      >
        <DialogTitle id="chat-reset-dialog-title" sx={{
          fontWeight: 700,
          color: '#2c3e50',
          textAlign: 'center',
          pb: 1
        }}>
          🤖 チャット履歴をリセットしますか？
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="chat-reset-dialog-description" sx={{
            color: '#555',
            fontSize: '1rem',
            textAlign: 'center',
            lineHeight: 1.6
          }}>
            現在のチャット履歴は削除されて、AI先生の最初の挨拶に戻ります。
            <br />
            この操作は元に戻すことができません。
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{
          p: 3,
          pt: 1,
          justifyContent: 'center',
          gap: 2
        }}>
          <Button
            onClick={handleChatResetCancel}
            variant="outlined"
            sx={{
              borderRadius: '12px',
              px: 3,
              py: 1,
              fontWeight: 600,
              color: '#6c757d',
              borderColor: '#6c757d',
              '&:hover': {
                background: 'rgba(108, 117, 125, 0.1)',
                borderColor: '#5a6268',
              },
              transition: 'all 0.3s ease',
            }}
          >
            キャンセル
          </Button>
          <Button
            onClick={handleChatResetConfirm}
            variant="contained"
            sx={{
              borderRadius: '12px',
              px: 3,
              py: 1,
              fontWeight: 600,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              '&:hover': {
                background: 'linear-gradient(135deg, #5a6fd8 0%, #6a5acd 100%)',
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            リセット
          </Button>
        </DialogActions>
      </Dialog>

      {/* リセット確認ダイアログ */}
      <Dialog
        open={showResetDialog}
        onClose={handleResetCancel}
        aria-labelledby="reset-dialog-title"
        aria-describedby="reset-dialog-description"
        PaperProps={{
          sx: {
            borderRadius: '16px',
            background: 'rgba(255,255,255,0.98)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
            border: '1px solid rgba(255,255,255,0.2)',
          }
        }}
      >
        <DialogTitle id="reset-dialog-title" sx={{
          fontWeight: 700,
          color: '#2c3e50',
          textAlign: 'center',
          pb: 1
        }}>
          🔄 コードをリセットしますか？
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="reset-dialog-description" sx={{
            color: '#555',
            fontSize: '1rem',
            textAlign: 'center',
            lineHeight: 1.6
          }}>
            現在のコードは削除されて、最初のサンプルコードに戻ります。
            <br />
            この操作は元に戻すことができません。
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{
          p: 3,
          pt: 1,
          justifyContent: 'center',
          gap: 2
        }}>
          <Button
            onClick={handleResetCancel}
            variant="outlined"
            sx={{
              borderRadius: '12px',
              px: 3,
              py: 1,
              fontWeight: 600,
              color: '#6c757d',
              borderColor: '#6c757d',
              '&:hover': {
                background: 'rgba(108, 117, 125, 0.1)',
                borderColor: '#5a6268',
              },
              transition: 'all 0.3s ease',
            }}
          >
            キャンセル
          </Button>
          <Button
            onClick={handleResetConfirm}
            variant="contained"
            sx={{
              borderRadius: '12px',
              px: 3,
              py: 1,
              fontWeight: 600,
              background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)',
              color: 'white',
              '&:hover': {
                background: 'linear-gradient(135deg, #ee5a52 0%, #e74c3c 100%)',
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 12px rgba(238, 90, 82, 0.3)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            リセット
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default EditorPage
