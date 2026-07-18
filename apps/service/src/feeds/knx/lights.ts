import { Feeds } from '@repo/apollo-ws'
import lightsSource from '@/data-sources/knx/lights'
import type { KnxLink } from 'js-knx'

export const addLightsFeed = (feeds: Feeds, knx: KnxLink): void => {
  feeds.addFeed('home.lights', { lights: lightsSource(knx) })
}
