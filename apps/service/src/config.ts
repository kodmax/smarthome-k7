import { configDotenv } from 'dotenv'

if (process.env.VITEST !== 'true') {
  configDotenv()
}

const getString = (name: string): string => {
  const value = process.env[name]
  if (value === undefined || value === '') {
    throw new Error(`Missing required environment variable: ${name}`)
  }

  return value
}

const getNumber = (name: string): number => {
  const value = Number(getString(name))
  if (Number.isNaN(value)) {
    throw new Error(`Environment variable ${name} must be a number`)
  }

  return value
}

const knxDisabled = process.env.NO_KNX === '1'

export const config = {
  db: {
    password: getString('DB_PASSWORD'),
    database: getString('DB_SCHEMA'),
    host: getString('DB_HOST'),
    user: getString('DB_USER'),
  },
  geoLocation: {
    long: getNumber('LOCATION_LONG'),
    lat: getNumber('LOCATION_LAT'),
  },
  cache: {
    dir: getString('CACHE_DIR'),
  },
  google: {
    socs_cookie: getString('GOOGLE_SOCS_COOKIE'),
  },
  jobs: {
    nfjCookie: getString('NFJ_COOKIE'),
    theprotocolCookie: getString('THEPROTOCOL_COOKIE'),
  },
  knx: {
    disabled: knxDisabled,
    host: knxDisabled ? (process.env.KNX_HOST ?? '') : getString('KNX_HOST'),
  },
}
