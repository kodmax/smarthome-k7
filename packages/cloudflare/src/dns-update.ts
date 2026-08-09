import { CloudflareDNS } from './CloudflareDNS'
import { rootLogger } from '@repo/logger'

const logger = rootLogger.child({ name: 'cloudflare-dns' })

const TOKEN = process.env.CLOUDFLARE_API_TOKEN ?? ''
const ZONE_ID = process.env.CLOUDFLARE_ZONE_ID ?? ''
const DOMAIN = process.env.CLOUDFLARE_DOMAIN ?? ''

const cloudflare = new CloudflareDNS({
  token: TOKEN,
})

const logContext = { domain: DOMAIN, zoneId: ZONE_ID }

cloudflare
  .getPublicIp()
  .then(async publicIP => {
    logger.info({ ...logContext, publicIP }, 'Public ip')
    const record = await cloudflare.getRecord(ZONE_ID, DOMAIN, 'A')
    logger.info({ ...logContext, configuredIp: record.content }, 'Configured ip')

    if (publicIP === record.content) {
      logger.info(logContext, 'No update needed')
      return
    }

    await cloudflare.updateRecord(ZONE_ID, record.id, {
      type: 'A',
      content: publicIP,
      ttl: 120,
      proxied: false,
      name: DOMAIN,
    })

    logger.info({ ...logContext, publicIP, previousIp: record.content }, 'DNS record updated')
  })
  .catch(err => {
    logger.error({ err, ...logContext }, 'DNS update failed')
    process.exitCode = 1
  })
