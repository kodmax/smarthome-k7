import { OnGatewayConnection, OnGatewayInit, WebSocketGateway } from '@nestjs/websockets'
import type { IncomingMessage } from 'http'
import type { WebSocket, WebSocketServer } from 'ws'
import { AppLogger } from '../logger/app-logger.service'
import type { Logger } from 'pino'
import { FeedWebSocketService } from './feed-websocket.service'
import { parseDeviceIdFromCookie } from './parseDeviceIdFromCookie'

@WebSocketGateway({ path: '/ws' })
export class EventsGateway implements OnGatewayInit<WebSocketServer>, OnGatewayConnection<WebSocket> {
  private readonly logger: Logger

  constructor(
    appLogger: AppLogger,
    private readonly feedWebSocket: FeedWebSocketService,
  ) {
    this.logger = appLogger.forComponent('EventsGateway')
  }

  afterInit() {
    this.logger.info({}, 'Websocket server initialized')
  }

  handleConnection(client: WebSocket, ...args: unknown[]) {
    const request = args[0]
    if (request === undefined || request === null || typeof request !== 'object' || !('socket' in request)) {
      this.logger.warn({}, 'Websocket connection without request socket')
      client.close()
      return
    }

    const incomingMessage = request as IncomingMessage
    const deviceId = parseDeviceIdFromCookie(incomingMessage.headers.cookie)

    this.feedWebSocket.registerClient(client, incomingMessage.socket, deviceId)
  }
}
