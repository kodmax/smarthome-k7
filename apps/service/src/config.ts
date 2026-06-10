import { configDotenv } from 'dotenv'
configDotenv()

export const config = {
  db: {
    password: process.env.DB_PASSWORD,
    database: process.env.DB_SCHEMA,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
  },
  geoLocation: {
    long: +process.env.LOCATION_LONG,
    lat: +process.env.LOCATION_LAT,
  },
  cache: {
    dir: process.env.CACHE_DIR,
  },
}
