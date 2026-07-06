const requireEnv = (name: string): string => {
  const value = process.env[name]
  if (value === undefined || value === '') {
    throw new Error(`Missing required environment variable: ${name}`)
  }

  return value
}

/** Runtime pool — DB_* from apps/service/.env (not DB_MIGRATE_* used by migrations). */
export const getDbConfig = () => ({
  host: requireEnv('DB_HOST'),
  user: requireEnv('DB_USER'),
  password: requireEnv('DB_PASSWORD'),
  database: requireEnv('DB_SCHEMA'),
})
