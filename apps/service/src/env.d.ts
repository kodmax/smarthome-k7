declare module 'process' {
  global {
    namespace NodeJS {
      interface ProcessEnv {
        readonly NO_KNX?: string
        readonly DB_PASSWORD: string
        readonly DB_HOST: string
        readonly DB_SCHEMA: string
        readonly DB_USER: string

        readonly KNX_HOST?: string

        readonly CACHE_DIR: string

        readonly LOCATION_LONG: string
        readonly LOCATION_LAT: string

        readonly GOOGLE_SOCS_COOKIE: string
        readonly NFJ_COOKIE: string
      }
    }
  }
}
