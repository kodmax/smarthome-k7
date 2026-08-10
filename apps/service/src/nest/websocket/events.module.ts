import { DynamicModule, Module } from '@nestjs/common'
import { EventsGateway } from './events.gateway'
import { FEED_EVENTS, WS_ON_ERROR, type EventsModuleDeps } from './events.constants'
import { FeedWebSocketService } from './feed-websocket.service'

@Module({})
export class EventsModule {
  static forRoot({ feedEvents, onError }: EventsModuleDeps): DynamicModule {
    return {
      module: EventsModule,
      providers: [
        { provide: FEED_EVENTS, useValue: feedEvents },
        { provide: WS_ON_ERROR, useValue: onError },
        FeedWebSocketService,
        EventsGateway,
      ],
    }
  }
}
