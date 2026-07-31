import * as esbuild from 'esbuild'
import { sentryEsbuildPlugin } from '@sentry/bundler-plugins/esbuild'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

export const externalizeThirdPartyPackagesPlugin = (bundleImports = []) => {
  return {
    name: 'externalize-third-party-packages',

    setup(build) {
      build.onResolve({ filter: /^[^./]/ }, args => {
        if (bundleImports.some(pathPrefix => args.path.startsWith(pathPrefix))) {
          return;
        }

        return {
          path: args.path,
          external: true,
        };
      });
    },
  }
}