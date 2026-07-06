import path from 'node:path'
import { configDotenv } from 'dotenv'

if (process.env.VITEST !== 'true' && process.env.NODE_ENV !== 'production') {
  configDotenv({ path: path.resolve(__dirname, '../.env') })
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
const cronDisabled = process.env.NO_CRON === '1' || knxDisabled

export const config = {
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
  cron: {
    disabled: cronDisabled,
  },
}
