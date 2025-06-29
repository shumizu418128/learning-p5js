import { io, Socket } from 'socket.io-client';

// 統合環境では同じドメイン内でWebSocketに接続
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || window.location.origin;

let socket: Socket | null = null;

export const initializeSocket = (): Socket => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
    });

    socket.on('connect', () => {
      console.log('WebSocket接続が確立されました');
    });

    socket.on('disconnect', () => {
      console.log('WebSocket接続が切断されました');
    });

    socket.on('connect_error', (error) => {
      console.error('WebSocket接続エラー:', error);
    });
  }

  return socket;
};

export const getSocket = (): Socket | null => {
  return socket;
};

export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export default {
  initializeSocket,
  getSocket,
  disconnectSocket,
};
