declare module 'process' {
  global {
    namespace NodeJS {
      interface ProcessEnv {
        readonly CLOUDFLARE_API_TOKEN: string
        readonly CLOUDFLARE_ZONE_ID: string
        readonly CLOUDFLARE_DOMAIN: string
      }
    }
  }
}
