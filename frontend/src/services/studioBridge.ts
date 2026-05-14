import { evzoneApi, getStudioBridgeWebSocketUrl } from './apiClient';

export type StudioBridgeMessage = {
  type: string;
  payload?: Record<string, unknown>;
  createdAt: string;
};

export type StudioBridgeState = {
  connected: boolean;
  url?: string;
  name?: string;
  version?: string;
  heartbeatMs?: number;
  lastHeartbeatAt?: string;
  activeSession?: string;
  status?: 'connected' | 'disconnected' | 'paused' | 'recovering';
  scenes?: string[];
  cameras?: string[];
  overlays?: string[];
};

export class StudioBridgeClient {
  private socket?: WebSocket;
  private readonly listeners = new Set<(message: StudioBridgeMessage) => void>();

  constructor(private readonly url = getStudioBridgeWebSocketUrl()) {}

  async getStatus() {
    return evzoneApi<StudioBridgeState>('/studio-bridge/status');
  }

  async connect() {
    const state = await evzoneApi<StudioBridgeState>('/studio-bridge/connect', { method: 'POST' });
    this.emit('bridge.status', state);
    return state;
  }

  async reconnect() {
    const state = await evzoneApi<StudioBridgeState>('/studio-bridge/reconnect', { method: 'POST' });
    this.emit('bridge.status', state);
    return state;
  }

  async disconnect() {
    this.socket?.close();
    this.socket = undefined;
    const state = await evzoneApi<StudioBridgeState>('/studio-bridge/disconnect', { method: 'POST' });
    this.emit('bridge.status', state);
    return state;
  }

  send(type: string, payload?: Record<string, unknown>) {
    const message: StudioBridgeMessage = { type, payload, createdAt: new Date().toISOString() };
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    }
    void evzoneApi('/studio-bridge/events', {
      method: 'POST',
      body: { type, payload },
    }).catch(() => undefined);
    this.listeners.forEach((listener) => listener(message));
    return message;
  }

  subscribe(listener: (message: StudioBridgeMessage) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private emit(type: string, payload: Record<string, unknown>) {
    const message: StudioBridgeMessage = { type, payload, createdAt: new Date().toISOString() };
    this.listeners.forEach((listener) => listener(message));
  }
}

export const studioBridge = new StudioBridgeClient();
