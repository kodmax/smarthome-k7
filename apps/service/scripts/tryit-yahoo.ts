import { createLogger } from '@repo/logger'

const logger = createLogger({ name: 'tryit' })
const ch = logger.child({ component: 'yahoo-fetch' }, { level: 'debug' })

logger.info({ foo: 'bar' }, 'Logger dziala')

ch.debug({ prop: 'child' }, 'debug message')
ch.info({ something: true }, 'something else')
