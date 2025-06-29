import axios from 'axios';

// 開発環境と本番環境でバックエンドURLを分ける
const API_BASE_URL = import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? 'http://localhost:8000' : 'https://kidscode-studio-backend.onrender.com');

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// リクエストインターセプター
api.interceptors.request.use(
  (config) => {
    // 必要に応じてトークンなどを追加
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// レスポンスインターセプター
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error);

    // エラーの詳細をログに出力
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
    } else if (error.request) {
      console.error('Request error:', error.request);
    } else {
      console.error('Error message:', error.message);
    }

    return Promise.reject(error);
  }
);

// APIの状態確認関数
export const checkApiStatus = async () => {
  try {
    const response = await api.get('/api/ai/status');
    return response.data;
  } catch (error) {
    console.error('API status check failed:', error);
    return { success: false, error: 'API接続エラー' };
  }
};

// 安全なJSONパース関数
export const safeJsonParse = (text: string) => {
  try {
    return JSON.parse(text);
  } catch (error) {
    console.error('JSON parse error:', error);
    console.error('Attempted to parse:', text.substring(0, 200) + '...');
    return null;
  }
};

export default api;
