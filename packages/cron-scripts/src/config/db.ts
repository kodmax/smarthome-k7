import { requireEnv } from "./env.js";

export const dbConfig = () => ({
  host: requireEnv("DB_HOST"),
  user: requireEnv("DB_USER"),
  password: requireEnv("DB_PASSWORD"),
  database: requireEnv("DB_SCHEMA"),
});
