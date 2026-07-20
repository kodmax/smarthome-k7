import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const outputDir = path.resolve(__dirname, '../src/assets/technology-logos')

/** Job market technology ids (from toTechnologyId) -> logo URL. */
const TECHNOLOGY_LOGOS = {
  javascript: 'https://svgl.app/library/javascript.svg',
  react: 'https://svgl.app/library/react_light.svg',
  typescript: 'https://svgl.app/library/typescript.svg',
  'node-js': 'https://svgl.app/library/nodejs.svg',
  java: 'https://svgl.app/library/java.svg',
  angular: 'https://svgl.app/library/angular.svg',
  'next-js': 'https://svgl.app/library/nextjs_icon_dark.svg',
  git: 'https://svgl.app/library/git.svg',
  aws: 'https://svgl.app/library/aws_light.svg',
  css: 'https://svgl.app/library/css.svg',
  html: 'https://svgl.app/library/html5.svg',
  python: 'https://svgl.app/library/python.svg',
  'rest-api': 'https://svgl.app/library/swagger.svg',
  'nest-js': 'https://svgl.app/library/nestjs.svg',
  ai: 'https://svgl.app/library/openai.svg',
  net: 'https://svgl.app/library/dotnet.svg',
  html5: 'https://svgl.app/library/html5.svg',
  'spring-boot': 'https://svgl.app/library/spring.svg',
  c: 'https://svgl.app/library/csharp.svg',
  'ci-cd': 'https://github.githubassets.com/images/modules/site/features/actions-icon-actions.svg',
  docker: 'https://svgl.app/library/docker.svg',
  postgresql: 'https://svgl.app/library/postgresql.svg',
  redux: 'https://svgl.app/library/redux.svg',
  rxjs: 'https://svgl.app/library/rxjs.svg',
  sql: 'https://svgl.app/library/mysql-icon-light.svg',
  'react-native': 'https://reactnative.dev/img/header_logo.svg',
  rest: 'https://svgl.app/library/swagger.svg',
  api: 'https://svgl.app/library/postman.svg',
  kubernetes: 'https://svgl.app/library/kubernetes.svg',
  mongodb: 'https://svgl.app/library/mongodb-icon-light.svg',
  azure: 'https://svgl.app/library/azure.svg',
  frontend: 'https://svgl.app/library/chrome.svg',
  scss: 'https://svgl.app/library/sass.svg',
  'tailwind-css': 'https://svgl.app/library/tailwindcss.svg',
  'vue-js': 'https://svgl.app/library/vue.svg',
  cypress: 'https://svgl.app/library/cypress.svg',
  gitlab: 'https://svgl.app/library/gitlab.svg',
  graphql: 'https://svgl.app/library/graphql.svg',
  jest: 'https://svgl.app/library/jest.svg',
  kotlin: 'https://svgl.app/library/kotlin.svg',
  'net-core': 'https://svgl.app/library/dotnet.svg',
  agile: 'https://svgl.app/library/atlassian.svg',
  backend: 'https://svgl.app/library/nginx.svg',
  css3: 'https://svgl.app/library/css.svg',
  'express-js': 'https://svgl.app/library/expressjs.svg',
  microservices: 'https://svgl.app/library/apache-kafka-light.svg',
  ngrx: 'https://ngrx.io/ngrx-logo-pink.svg',
  php: 'https://svgl.app/library/php.svg',
  'spring-framework': 'https://svgl.app/library/spring.svg',
  mysql: 'https://svgl.app/library/mysql-icon-light.svg',
  webpack: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/webpack.svg',
  bootstrap: 'https://svgl.app/library/bootstrap.svg',
  figma: 'https://svgl.app/library/figma.svg',
  gcp: 'https://svgl.app/library/google-cloud.svg',
  golang: 'https://svgl.app/library/golang.svg',
  jasmine: 'https://svgl.app/library/jasmine.svg',
  karma: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/karma/karma-original.svg',
  playwright: 'https://svgl.app/library/playwright.svg',
  'automated-testing': 'https://svgl.app/library/playwright.svg',
}

const downloadLogo = async (id, url) => {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'smarthome-k7-logo-downloader/1.0',
      Accept: 'image/svg+xml,text/plain,*/*',
    },
  })

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for ${id} (${url})`)
  }

  const contentType = response.headers.get('content-type') ?? ''
  const body = await response.text()

  if (!body.trimStart().startsWith('<svg') && !body.includes('<svg')) {
    throw new Error(`Unexpected content for ${id} (${url})`)
  }

  await writeFile(path.join(outputDir, `${id}.svg`), body, 'utf8')
}

await mkdir(outputDir, { recursive: true })

const results = await Promise.allSettled(
  Object.entries(TECHNOLOGY_LOGOS).map(([id, url]) => downloadLogo(id, url)),
)

const failed = results
  .map((result, index) => ({ result, id: Object.keys(TECHNOLOGY_LOGOS)[index] }))
  .filter(({ result }) => result.status === 'rejected')

if (failed.length > 0) {
  for (const { id, result } of failed) {
    console.error(`Failed ${id}:`, result.reason)
  }
  process.exitCode = 1
}

const succeeded = Object.keys(TECHNOLOGY_LOGOS).length - failed.length
console.log(`Downloaded ${succeeded}/${Object.keys(TECHNOLOGY_LOGOS).length} technology logos to ${outputDir}`)
