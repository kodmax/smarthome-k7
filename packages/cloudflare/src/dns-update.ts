import { CloudflareDNS } from './CloudflareDNS'

const TOKEN = process.env.CLOUDFLARE_API_TOKEN ?? ''
const ZONE_ID = process.env.CLOUDFLARE_ZONE_ID ?? ''
const DOMAIN = process.env.CLOUDFLARE_DOMAIN ?? ''

const cloudflare = new CloudflareDNS({
  token: TOKEN,
})

cloudflare.getPublicIp().then(async publicIP => {
  console.log(`Public ip: ${publicIP}`)
  const record = await cloudflare.getRecord(ZONE_ID, DOMAIN, 'A')
  console.log(`Configured ip: ${record.content}`)

  if (publicIP === record.content) {
    console.log('No update needed.')
    return
  }

  await cloudflare.updateRecord(ZONE_ID, record.id, {
    type: 'A',
    content: publicIP,
    ttl: 120,
    proxied: false,
    name: DOMAIN,
  })

  console.log('Updated!')
})
