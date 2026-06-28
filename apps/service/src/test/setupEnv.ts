export const setupEnv = {
  DB_PASSWORD: 'test',
  DB_HOST: 'localhost',
  DB_SCHEMA: 'test',
  DB_USER: 'test',
  CACHE_DIR: '.cache',
  // Central Pacific Ocean — test coordinates away from real home location
  LOCATION_LONG: '-160',
  LOCATION_LAT: '0',
  GOOGLE_SOCS_COOKIE: 'test',
  NFJ_COOKIE: 'test',
  THEPROTOCOL_COOKIE: 'test',
  NO_KNX: '1',
} as const

export function applySetupEnv(): void {
  for (const [name, value] of Object.entries(setupEnv)) {
    process.env[name] = value
  }
}

applySetupEnv()
