import { FeedManager } from '@repo/feeds'
import lightsSource from '@/data-sources/knx/lights'
import type { KnxLink } from 'js-knx'

export const addLightsFeed = (feeds: FeedManager, knx: KnxLink): void => {
  feeds.addFeed('home.lights', { lights: lightsSource(knx) })
}
