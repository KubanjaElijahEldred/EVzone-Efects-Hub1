import { Logger } from '@nestjs/common';
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import type { Server, Socket } from 'socket.io';
import { AppStateService } from '../../database/app-state.service';

@WebSocketGateway({
  namespace: 'studio-bridge',
  cors: { origin: '*' },
})
export class StudioBridgeGateway {
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(StudioBridgeGateway.name);

  constructor(private readonly state: AppStateService) {}

  handleConnection(client: Socket) {
    this.logger.log(`Studio bridge client connected: ${client.id}`);
    client.emit('bridge.status', this.state.snapshot.studioBridge);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Studio bridge client disconnected: ${client.id}`);
  }

  @SubscribeMessage('bridge.ping')
  ping(@MessageBody() payload: Record<string, unknown>) {
    this.state.snapshot.studioBridge.lastHeartbeatAt = this.state.now();
    this.state.snapshot.studioBridge.connected = true;
    this.state.persist();
    const message = { type: 'bridge.pong', payload, createdAt: this.state.now() };
    this.server.emit('bridge.status', this.state.snapshot.studioBridge);
    return message;
  }

  @SubscribeMessage('studio.event')
  studioEvent(@MessageBody() payload: { type: string; payload?: Record<string, unknown> }) {
    const diagnostic = this.state.addDiagnostic({
      level: 'info',
      source: 'Studio Bridge Socket',
      message: payload.type,
    });
    this.server.emit('studio.event.received', { ...payload, diagnostic });
    return { accepted: true, diagnostic };
  }
}
