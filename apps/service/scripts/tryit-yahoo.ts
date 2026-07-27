import pino from 'pino'
import pretty from 'pino-pretty'

const stream = pretty({ colorize: true, translateTime: 'SYS:standard' })
const logger = pino({ name: 'tryit', level: 'info' }, stream)

const ch = logger.child({ prop: 'child', component: 'child-logger' }, { level: 'debug', redact: ['something'] })

logger.info({ foo: 'bar', baz: 'bar' }, 'Logger dziala')

ch.debug('debug')
ch.info({ something: true }, 'something else')
