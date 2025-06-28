import { createTheme } from '@mui/material/styles'

// 小学生向けの親しみやすいカラーパレット
export const theme = createTheme({
  palette: {
    primary: {
      main: '#4CAF50', // 明るい緑
      light: '#81C784',
      dark: '#388E3C',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#FF9800', // オレンジ
      light: '#FFB74D',
      dark: '#F57C00',
      contrastText: '#ffffff',
    },
    error: {
      main: '#F44336',
      light: '#EF5350',
      dark: '#D32F2F',
    },
    warning: {
      main: '#FF9800',
      light: '#FFB74D',
      dark: '#F57C00',
    },
    info: {
      main: '#2196F3',
      light: '#64B5F6',
      dark: '#1976D2',
    },
    success: {
      main: '#4CAF50',
      light: '#81C784',
      dark: '#388E3C',
    },
    background: {
      default: '#F8F9FA',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#333333',
      secondary: '#666666',
    },
  },
  typography: {
    fontFamily: [
      'Hiragino Sans',
      'ヒラギノ角ゴシック',
      'Yu Gothic',
      '游ゴシック',
      'Meiryo',
      'メイリオ',
      'sans-serif',
    ].join(','),
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      color: '#333333',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      color: '#333333',
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 600,
      color: '#333333',
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: 500,
      color: '#333333',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
      color: '#333333',
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
      color: '#666666',
    },
    button: {
      textTransform: 'none', // ボタンテキストを小文字にしない
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12, // 丸みを帯びたデザイン
  },
  components: {
    // ボタンのカスタマイズ
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '12px 24px',
          fontSize: '1rem',
          fontWeight: 600,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
          },
        },
        contained: {
          '&:hover': {
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
          },
        },
      },
    },
    // カードのカスタマイズ
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
          },
        },
      },
    },
    // 入力フィールドのカスタマイズ
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#4CAF50',
            },
          },
        },
      },
    },
    // チップのカスタマイズ
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          fontWeight: 500,
        },
      },
    },
    // アラートのカスタマイズ
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          fontWeight: 500,
        },
      },
    },
  },
})

// 子供向けのカスタムカラー
export const kidColors = {
  // 楽しい色合い
  rainbow: {
    red: '#FF6B6B',
    orange: '#FF9F43',
    yellow: '#FEE856',
    green: '#26de81',
    blue: '#4834d4',
    purple: '#a55eea',
    pink: '#fd79a8',
  },
  // パステルカラー
  pastel: {
    pink: '#FFE5E5',
    blue: '#E5F3FF',
    green: '#E5FFE5',
    yellow: '#FFFBE5',
    purple: '#F5E5FF',
    orange: '#FFE5D5',
  },
  // バッジ用カラー
  badges: {
    bronze: '#CD7F32',
    silver: '#C0C0C0',
    gold: '#FFD700',
    diamond: '#B9F2FF',
  },
  // AIチャット用カラー
  chat: {
    userMessage: {
      background: 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)',
      text: '#ffffff',
      border: 'none',
    },
    aiMessage: {
      background: '#f8f9fa',
      text: '#2c3e50',
      border: '1px solid #e9ecef',
    },
    loading: {
      text: '#2c3e50',
      spinner: '#667eea',
    },
    input: {
      background: '#ffffff',
      placeholder: '#6c757d',
      border: '#dee2e6',
      focusBorder: '#4CAF50',
    },
    header: {
      background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      text: '#2c3e50',
    },
  },
}
