import pino from 'pino'
import pretty from 'pino-pretty'

const stream = pretty({ colorize: true, translateTime: 'SYS:standard' })
const logger = pino({ name: 'tryit', level: 'info' }, stream)

const ch = logger.child({ name: 'child' }, { level: 'debug' })

logger.info('Logger dziala')

ch.debug('debug')
