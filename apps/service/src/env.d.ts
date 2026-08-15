declare module 'process' {
  global {
    namespace NodeJS {
      interface ProcessEnv {
        readonly NO_KNX?: string
        readonly NO_CRON?: string
        readonly NO_REDIS?: string
        readonly DB_PASSWORD: string
        readonly DB_HOST: string
        readonly DB_SCHEMA: string
        readonly DB_USER: string

        readonly REDIS_URL?: string

        readonly KNX_HOST?: string

        readonly CACHE_DIR: string

        readonly LOCATION_LONG: string
        readonly LOCATION_LAT: string

        readonly GOOGLE_SOCS_COOKIE: string
        readonly NFJ_COOKIE: string
        readonly THEPROTOCOL_COOKIE: string

        readonly TRANSMISSION_URL: string
        readonly TRANSMISSION_USERNAME: string
        readonly TRANSMISSION_PASSWORD: string

        readonly OPENAI_API_KEY: string

        readonly SENTRY_DSN?: string
        readonly SENTRY_RELEASE?: string

        readonly NO_METRICS?: string
        readonly METRICS_PORT?: string

        readonly OTEL_SDK_DISABLED?: string
        readonly OTEL_SERVICE_NAME?: string
        readonly OTEL_TRACES_EXPORTER?: string
        readonly OTEL_EXPORTER_OTLP_PROTOCOL?: string
        readonly OTEL_EXPORTER_OTLP_ENDPOINT?: string
        readonly OTEL_TRACES_SAMPLER?: string
        readonly OTEL_TRACES_SAMPLER_ARG?: string

        readonly API_PORT?: string
      }
    }
  }
}
