interface CodeAnalysis {
  title: string
  description: string
  icon: string
  level: 'beginner' | 'intermediate' | 'advanced'
  codeExample?: string
}

interface CodePattern {
  pattern: RegExp
  analysis: CodeAnalysis
}

interface ImprovementSuggestion {
  title: string
  description: string
  icon: string
  level: 'beginner' | 'intermediate' | 'advanced'
  codeExample?: string
}

// コードパターンの定義
const codePatterns: CodePattern[] = [
  // 基本的な図形
  {
    pattern: /\bcircle\s*\(/,
    analysis: {
      title: '円を描く',
      description: 'circle()を使って円を描いています。circle(x, y, r)のxは横の位置、yは縦の位置、rは円の大きさです。マウスについてくる円や、決まった場所に円を置くなど、いろんな使い方ができます！',
      icon: '🔴',
      level: 'beginner',
      codeExample: 'circle(100, 100, 50)  // 中心(100,100)に半径50の円'
    }
  },
  {
    pattern: /\brect\s*\(/,
    analysis: {
      title: '四角形を描く',
      description: 'rect()で四角形を描いています。rect(x, y, w, h)のxは横の位置、yは縦の位置、wは横の長さ、hは縦の長さです。長方形や正方形を作るのに使います。',
      icon: '⬜',
      level: 'beginner',
      codeExample: 'rect(50, 50, 100, 80)  // 左上(50,50)に幅100、高さ80の四角形'
    }
  },
  {
    pattern: /\btriangle\s*\(/,
    analysis: {
      title: '三角形を描く',
      description: 'triangle()で三角形を描いています。triangle(x1, y1, x2, y2, x3, y3)のx1, y1は1つ目の角、x2, y2は2つ目の角、x3, y3は3つ目の角の位置です。3つの角の場所を決めて三角形を作ります。',
      icon: '🔺',
      level: 'beginner',
      codeExample: 'triangle(100, 50, 150, 150, 50, 150)  // 3つの角の座標'
    }
  },
  {
    pattern: /\bline\s*\(/,
    analysis: {
      title: '線を描く',
      description: 'line()で直線を描いています。line(x1, y1, x2, y2)のx1, y1は線の始まりの場所、x2, y2は線の終わりの場所です。2つの点を結ぶ線を引くことができます。',
      icon: '📏',
      level: 'beginner',
      codeExample: 'line(0, 0, 200, 200)  // (0,0)から(200,200)まで線を引く'
    }
  },

  // 色とスタイル
  {
    pattern: /\bfill\s*\(/,
    analysis: {
      title: '色を塗る',
      description: 'fill()で図形の色を決めています。fill(赤, 緑, 青)の赤は赤い色の強さ、緑は緑の色の強さ、青は青い色の強さです。0から255までの数字で色の濃さを決めます。',
      icon: '🎨',
      level: 'beginner',
      codeExample: 'fill(255, 0, 0)  // 赤色\nfill(0, 255, 0)  // 緑色\nfill(0, 0, 255)  // 青色'
    }
  },
  {
    pattern: /\bstroke\s*\(/,
    analysis: {
      title: '枠線の色',
      description: 'stroke()で図形の周りの線の色を決めています。stroke(赤, 緑, 青)の赤は赤い色の強さ、緑は緑の色の強さ、青は青い色の強さです。',
      icon: '✏️',
      level: 'beginner',
      codeExample: 'stroke(255, 255, 0)  // 黄色の枠線\nstroke(0)  // 黒い枠線'
    }
  },
  {
    pattern: /\bnoStroke\s*\(/,
    analysis: {
      title: '枠線を消す',
      description: 'noStroke()で図形の周りの線を消しています。色を塗っただけの図形になります。',
      icon: '🚫',
      level: 'beginner',
      codeExample: 'noStroke()  // 枠線なし\ncircle(100, 100, 50)  // 枠線のない円'
    }
  },
  {
    pattern: /\bnoFill\s*\(/,
    analysis: {
      title: '塗りつぶしを消す',
      description: 'noFill()で図形の中の色を消しています。周りの線だけの図形になります。',
      icon: '🔄',
      level: 'beginner',
      codeExample: 'noFill()  // 塗りつぶしなし\ncircle(100, 100, 50)  // 中が空の円'
    }
  },

  // アニメーション
  {
    pattern: /\bmouseX\b/,
    analysis: {
      title: 'マウスで操作',
      description: 'mouseXを使ってマウスの横の位置を調べています。マウスについてくる図形を作れます！',
      icon: '🖱️',
      level: 'beginner',
      codeExample: 'circle(mouseX, 100, 30)  // マウスの横位置に円を描く'
    }
  },
  {
    pattern: /\bmouseY\b/,
    analysis: {
      title: 'マウスで操作',
      description: 'mouseYを使ってマウスの縦の位置を調べています。マウスについてくる図形を作れます！',
      icon: '🖱️',
      level: 'beginner',
      codeExample: 'circle(100, mouseY, 30)  // マウスの縦位置に円を描く'
    }
  },
  {
    pattern: /\bframeCount\b/,
    analysis: {
      title: '時間の経過',
      description: 'frameCountを使って時間の経過を調べています。動く絵を作るのに使います。',
      icon: '⏰',
      level: 'intermediate',
      codeExample: 'circle(frameCount, 100, 20)  // 右に動く円\ncircle(100, 100 + sin(frameCount * 0.1) * 50, 20)  // 上下に揺れる円'
    }
  },

  // 数学関数
  {
    pattern: /\bsin\s*\(/,
    analysis: {
      title: 'サイン関数',
      description: 'sin()を使って波のような動きを作っています。なめらかに動く絵に使えます。',
      icon: '🌊',
      level: 'intermediate',
      codeExample: 'let y = 100 + sin(frameCount * 0.1) * 50\ncircle(100, y, 20)  // 上下に波のように動く'
    }
  },
  {
    pattern: /\bcos\s*\(/,
    analysis: {
      title: 'コサイン関数',
      description: 'cos()を使って波のような動きを作っています。円を描くように動く絵に使えます。',
      icon: '🌀',
      level: 'intermediate',
      codeExample: 'let x = 200 + cos(frameCount * 0.1) * 100\nlet y = 200 + sin(frameCount * 0.1) * 100\ncircle(x, y, 20)  // 円を描くように動く'
    }
  },

  // ループ
  {
    pattern: /\bfor\s*\(/,
    analysis: {
      title: '繰り返し処理',
      description: 'for文を使って同じことを何度も繰り返しています。たくさんの図形を一度に描くのに便利です。',
      icon: '🔄',
      level: 'intermediate',
      codeExample: 'for(let i = 0; i < 10; i++) {\n  circle(i * 50, 100, 20)\n}  // 横一列に10個の円'
    }
  },
  {
    pattern: /\bwhile\s*\(/,
    analysis: {
      title: '条件付き繰り返し',
      description: 'while文を使って決まった条件が成り立つまで同じことを繰り返しています。',
      icon: '🔄',
      level: 'intermediate',
      codeExample: 'let i = 0\nwhile(i < 5) {\n  circle(i * 50, 100, 20)\n  i++\n}  // 5個の円を描く'
    }
  },

  // 変数
  {
    pattern: /\blet\s+\w+/,
    analysis: {
      title: '変数を使う',
      description: 'letを使って変数を作っています。数字や文字を保存して後で使うことができます。',
      icon: '📦',
      level: 'beginner',
      codeExample: 'let size = 30\ncircle(mouseX, mouseY, size)  // 変数で円の大きさを決める'
    }
  },
  {
    pattern: /\bconst\s+\w+/,
    analysis: {
      title: '定数を使う',
      description: 'constを使って変えられない数字や文字を決めています。',
      icon: '🔒',
      level: 'intermediate',
      codeExample: 'const PI = 3.14159\nconst MAX_SIZE = 100\ncircle(100, 100, MAX_SIZE)  // 決まった大きさの円'
    }
  },

  // 関数
  {
    pattern: /\bfunction\s+\w+\s*\(/,
    analysis: {
      title: '関数を作る',
      description: '自分で関数を作っています。同じことを何度も使う時に便利です。',
      icon: '⚙️',
      level: 'intermediate',
      codeExample: 'function drawStar(x, y) {\n  // 星を描く処理\n  triangle(x, y-20, x-10, y+10, x+10, y+10)\n}\ndrawStar(100, 100)  // 星を描く'
    }
  },

  // 条件分岐
  {
    pattern: /\bif\s*\(/,
    analysis: {
      title: '条件分岐',
      description: 'if文を使って状況に応じて違うことをさせています。いろんな場合に対応した動きを作れます。',
      icon: '🤔',
      level: 'intermediate',
      codeExample: 'if(mouseX > 200) {\n  fill(255, 0, 0)  // 赤色\n} else {\n  fill(0, 0, 255)  // 青色\n}\ncircle(mouseX, mouseY, 30)'
    }
  },

  // 配列
  {
    pattern: /\[\s*[^\]]*\s*\]/,
    analysis: {
      title: '配列を使う',
      description: '配列を使ってたくさんの数字や文字をまとめて管理しています。たくさんの情報を扱うのに便利です。',
      icon: '📋',
      level: 'advanced',
      codeExample: 'let colors = [255, 0, 0, 0, 255, 0, 0, 0, 255]\nlet positions = [100, 200, 300]\nfor(let i = 0; i < positions.length; i++) {\n  fill(colors[i*3], colors[i*3+1], colors[i*3+2])\n  circle(positions[i], 100, 30)\n}'
    }
  },

]

// 改善アイデアの定義
const improvementSuggestions: ImprovementSuggestion[] = [
  {
    title: '色をランダムにしてみよう',
    description: 'random()を使って色をランダムにすると、毎回違う色の図形が描けます！fill(random(255), random(255), random(255))で試してみてね。',
    icon: '🎨',
    level: 'beginner',
    codeExample: 'fill(random(255), random(255), random(255))'
  },
  {
    title: 'サイズをランダムにしてみよう',
    description: '図形の大きさをランダムにすると、大きさがバラバラの図形が描けます！circle(x, y, random(50))で試してみてね。',
    icon: '📏',
    level: 'beginner',
    codeExample: 'circle(x, y, random(50))'
  },
  {
    title: '位置をランダムにしてみよう',
    description: '図形の場所をランダムにすると、画面全体に散らばった図形が描けます！circle(random(width), random(height), 20)で試してみてね。',
    icon: '🎯',
    level: 'beginner',
    codeExample: 'circle(random(width), random(height), 20)'
  },
  {
    title: 'for文でたくさんの図形を描こう',
    description: 'for文を使うと、同じ図形をたくさん描けます！for(let i = 0; i < 10; i++) { circle(i * 50, 100, 20) }で試してみてね。',
    icon: '🔄',
    level: 'intermediate',
    codeExample: 'for(let i = 0; i < 10; i++) {\n  circle(i * 50, 100, 20)\n}'
  },
  {
    title: 'sin()で波のような動きを作ろう',
    description: 'sin()を使うと、波のように揺れる動きが作れます！circle(x, 100 + sin(frameCount * 0.1) * 50, 20)で試してみてね。',
    icon: '🌊',
    level: 'intermediate',
    codeExample: 'circle(x, 100 + sin(frameCount * 0.1) * 50, 20)'
  },
  {
    title: 'cos()で円運動を作ろう',
    description: 'cos()とsin()を組み合わせると、円を描くように動く図形が作れます！circle(200 + cos(frameCount * 0.1) * 100, 200 + sin(frameCount * 0.1) * 100, 20)で試してみてね。',
    icon: '🌀',
    level: 'intermediate',
    codeExample: 'circle(200 + cos(frameCount * 0.1) * 100, 200 + sin(frameCount * 0.1) * 100, 20)'
  },
  {
    title: 'if文で条件分岐してみよう',
    description: 'if文を使うと、状況に応じて図形の色や動きを変えられます！if(mouseX > 200) { fill(255, 0, 0) } else { fill(0, 0, 255) }で試してみてね。',
    icon: '🤔',
    level: 'intermediate',
    codeExample: 'if(mouseX > 200) {\n  fill(255, 0, 0)\n} else {\n  fill(0, 0, 255)\n}'
  },
  {
    title: '変数を使って整理しよう',
    description: '変数を使うと、コードが読みやすくなります！let size = 30; circle(mouseX, mouseY, size)で試してみてね。',
    icon: '📦',
    level: 'beginner',
    codeExample: 'let size = 30\ncircle(mouseX, mouseY, size)'
  },
  {
    title: '関数を作って再利用しよう',
    description: '関数を作ると、同じことを何度も使えます！function drawStar(x, y) { /* 星を描く処理 */ }で試してみてね。',
    icon: '⚙️',
    level: 'intermediate',
    codeExample: 'function drawStar(x, y) {\n  // 星を描く処理\n}'
  },
  {
    title: '透明度を変えてみよう',
    description: 'fill()の4番目の数字で透き通りの度合いを決められます！fill(255, 0, 0, 100)で透き通った赤になります。',
    icon: '👁️',
    level: 'intermediate',
    codeExample: 'fill(255, 0, 0, 100)'
  },
  {
    title: '線の太さを変えてみよう',
    description: 'strokeWeight()で線の太さを決められます！strokeWeight(5)で太い線になります。',
    icon: '✏️',
    level: 'beginner',
    codeExample: 'strokeWeight(5)'
  },
  {
    title: '図形を回転させてみよう',
    description: 'rotate()で図形を回転させられます！rotate(PI/4)で45度回転します。',
    icon: '🔄',
    level: 'intermediate',
    codeExample: 'rotate(PI/4)'
  },
  {
    title: '配列でたくさんの値を管理しよう',
    description: '配列を使うと、たくさんの数字や文字をまとめて管理できます！let colors = [255, 0, 0, 0, 255, 0, 0, 0, 255]で試してみてね。',
    icon: '📋',
    level: 'advanced',
    codeExample: 'let colors = [255, 0, 0, 0, 255, 0, 0, 0, 255]'
  },
  {
    title: 'マウスクリックで反応させよう',
    description: 'mouseIsPressedでマウスクリックを調べられます！if(mouseIsPressed) { fill(255, 0, 0) }で試してみてね。',
    icon: '🖱️',
    level: 'intermediate',
    codeExample: 'if(mouseIsPressed) {\n  fill(255, 0, 0)\n}'
  },
  {
    title: 'キーボードで操作してみよう',
    description: 'keyIsPressedでキーボード入力を調べられます！if(keyIsPressed) { circle(mouseX, mouseY, 50) }で試してみてね。',
    icon: '⌨️',
    level: 'intermediate',
    codeExample: 'if(keyIsPressed) {\n  circle(mouseX, mouseY, 50)\n}'
  },
  {
    title: 'AI先生に質問してみよう',
    description: 'わからないことがあったら、AI先生に質問してみてね！「このコードをどうやって良くできる？」「もっと楽しい動く絵を作りたい」など、どんなことでも聞いてみよう。AI先生が優しく教えてくれるよ！',
    icon: '🤖',
    level: 'beginner',
    codeExample: 'AI先生に質問してみよう！'
  }
]

// コードを分析して解説を生成
export const analyzeCode = (code: string): CodeAnalysis[] => {
  const foundPatterns = new Set<string>()
  const analyses: CodeAnalysis[] = []

  // 各パターンをチェック
  codePatterns.forEach(({ pattern, analysis }) => {
    if (pattern.test(code) && !foundPatterns.has(analysis.title)) {
      foundPatterns.add(analysis.title)
      analyses.push(analysis)
    }
  })

  // randomの解説を常に追加
  const randomAnalysis = codePatterns.find(p => p.analysis.title === 'ランダムな値')?.analysis
  if (randomAnalysis) {
    analyses.push(randomAnalysis)
  }

  return analyses
}

// レベルに応じた色を取得
export const getLevelColor = (level: string): string => {
  switch (level) {
    case 'beginner':
      return '#4CAF50'
    case 'intermediate':
      return '#FF9800'
    case 'advanced':
      return '#F44336'
    default:
      return '#666'
  }
}

// レベルに応じた日本語名を取得
export const getLevelName = (level: string): string => {
  switch (level) {
    case 'beginner':
      return '初級'
    case 'intermediate':
      return '中級'
    case 'advanced':
      return '上級'
    default:
      return '不明'
  }
}

// 改善アイデアをランダムに取得
export const getRandomImprovementSuggestions = (): ImprovementSuggestion[] => {
  const aiSuggestion = improvementSuggestions.find(s => s.title === 'AI先生に質問してみよう')
  const otherSuggestions = improvementSuggestions.filter(s => s.title !== 'AI先生に質問してみよう')
  const shuffled = [...otherSuggestions].sort(() => 0.5 - Math.random())
  const selected = shuffled.slice(0, 4)

  // AI質問を必ず最後に追加
  if (aiSuggestion) {
    selected.push(aiSuggestion)
  }

  return selected
}

// コードに基づいて改善アイデアを取得
export const getImprovementSuggestions = (code: string): ImprovementSuggestion[] => {
  // 現在のコードで使用されている機能をチェック
  const usedPatterns = new Set<string>()

  // コードパターンと照合して使用されている機能を特定
  codePatterns.forEach(({ pattern, analysis }) => {
    if (pattern.test(code)) {
      usedPatterns.add(analysis.title)
    }
  })

  // 使用されていない機能の改善アイデアを優先的に選択
  const unusedSuggestions = improvementSuggestions.filter(suggestion => {
    // 改善アイデアのタイトルとコードパターンのタイトルを照合
    return !Array.from(usedPatterns).some(usedPattern =>
      suggestion.title.includes(usedPattern) || usedPattern.includes(suggestion.title)
    )
  })

  // 未使用の機能があれば優先的に選択、なければランダムに選択
  const suggestionsToUse = unusedSuggestions.length > 0 ? unusedSuggestions : improvementSuggestions

  // AI質問以外のサジェストを選択
  const aiSuggestion = improvementSuggestions.find(s => s.title === 'AI先生に質問してみよう')
  const otherSuggestions = suggestionsToUse.filter(s => s.title !== 'AI先生に質問してみよう')
  const shuffled = [...otherSuggestions].sort(() => 0.5 - Math.random())
  const selected = shuffled.slice(0, 4)

  // AI質問を必ず最後に追加
  if (aiSuggestion) {
    selected.push(aiSuggestion)
  }

  return selected
}
