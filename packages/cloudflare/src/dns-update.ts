import { CloudflareDNS } from './CloudflareDNS'
import { createLogger } from '@repo/logger'

const logger = createLogger({ name: 'cloudflare-dns' })

const TOKEN = process.env.CLOUDFLARE_API_TOKEN ?? ''
const ZONE_ID = process.env.CLOUDFLARE_ZONE_ID ?? ''
const DOMAIN = process.env.CLOUDFLARE_DOMAIN ?? ''

const cloudflare = new CloudflareDNS({
  token: TOKEN,
})

cloudflare.getPublicIp().then(async publicIP => {
  logger.info({ publicIP }, 'Public ip')
  const record = await cloudflare.getRecord(ZONE_ID, DOMAIN, 'A')
  logger.info({ configuredIp: record.content }, 'Configured ip')

  if (publicIP === record.content) {
    logger.info('No update needed')
    return
  }

  await cloudflare.updateRecord(ZONE_ID, record.id, {
    type: 'A',
    content: publicIP,
    ttl: 120,
    proxied: false,
    name: DOMAIN,
  })

  logger.info('Updated')
})
