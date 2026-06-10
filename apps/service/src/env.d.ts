declare module 'process' {
  global {
    namespace NodeJS {
      interface ProcessEnv {
        readonly DB_PASSWORD: string
        readonly DB_HOST: string
        readonly DB_SCHEMA: string
        readonly DB_USER: string

        readonly CACHE_DIR: string

        readonly LOCATION_LONG: string
        readonly LOCATION_LAT: string
      }
    }
  }
}
