import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { NextConfig } from 'next'

const projectDir = path.dirname(fileURLToPath(import.meta.url))
const monorepoRoot = path.join(projectDir, '../..')

const nextConfig: NextConfig = {
  outputFileTracingRoot: monorepoRoot,
  transpilePackages: ['@repo/design-tokens', '@repo/styles'],
}

export default nextConfig
