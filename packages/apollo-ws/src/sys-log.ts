import { ApolloEvents } from './ApolloEvents'

const sysLog: (vent: ApolloEvents, maxPriority?: number, minPriority?: number) => void = (
  vent,
  maxPriority = 7,
  minPriority = 0,
) => {
  vent.addListener('sys-log', (pri: number, msg: string, e?: unknown) => {
    if (e) {
      console.log(`<4>`, msg, e)
    } else if (pri <= maxPriority && pri >= minPriority) {
      console.log(`<${pri}> ${msg}`)
    }
  })
}

export { sysLog }
