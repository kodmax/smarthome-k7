const CANONICAL_SKILL_NAMES: Record<string, string> = {
  ai: 'AI',
  agile: 'Agile',
  angular: 'Angular',
  angularjs: 'AngularJS',
  api: 'REST API',
  automatedtesting: 'Automated Testing',
  aws: 'AWS',
  azure: 'Azure',
  backend: 'Backend',
  cicd: 'CI/CD',
  csharp: 'C#',
  css: 'CSS',
  cypress: 'Cypress',
  docker: 'Docker',
  dotnet: '.NET',
  dotnetcore: '.NET Core',
  express: 'Express.js',
  frontend: 'Frontend',
  fullstack: 'Fullstack',
  git: 'Git',
  github: 'GitHub',
  graphql: 'GraphQL',
  html: 'HTML',
  java: 'Java',
  javascript: 'JavaScript',
  jest: 'Jest',
  kotlin: 'Kotlin',
  kubernetes: 'Kubernetes',
  microservices: 'Microservices',
  mongodb: 'MongoDB',
  nest: 'Nest.js',
  next: 'Next.js',
  node: 'Node.js',
  ngrx: 'NgRx',
  php: 'PHP',
  postgresql: 'PostgreSQL',
  projectmanagement: 'Project Management',
  python: 'Python',
  react: 'React',
  reactnative: 'React Native',
  redux: 'Redux',
  rxjs: 'RxJS',
  scss: 'SCSS',
  springboot: 'Spring Boot',
  springframework: 'Spring Framework',
  sql: 'SQL',
  tailwindcss: 'Tailwind CSS',
  teammanagement: 'Team Management',
  typescript: 'TypeScript',
  vue: 'Vue.js',
  webdevelopment: 'Web Development',
}

const SCRIPT_SKILL_KEYS = new Set(['javascript', 'typescript'])

const IGNORED_SKILL_KEYS = new Set([
  'agile',
  'backend',
  'datascience',
  'degree',
  'frontend',
  'fullstack',
  'jira',
  'json',
  'softwaredevelopment',
  'scrum',
  'testing',
  'ui',
])

export const isIgnoredSkillKey = (key: string): boolean => IGNORED_SKILL_KEYS.has(key)

export const normalizeSkillKey = (skill: string): string => {
  let normalized = skill
    .trim()
    .toLowerCase()
    .replace(/\.(js|jsx)$/u, '')
  normalized = normalized.replace(/[^a-z0-9+#/]+/gu, '')

  if (normalized === 'net' || normalized === 'netcore') {
    return normalized === 'netcore' ? 'dotnetcore' : 'dotnet'
  }

  if (normalized === 'amazonaws') {
    return 'aws'
  }

  if (normalized === 'rest' || normalized === 'restapi' || normalized === 'restapis' || normalized === 'restfulapi') {
    return 'api'
  }

  if (normalized === 'gitlab') {
    return 'git'
  }

  if (normalized === 'aitools' || normalized === 'aitool') {
    return 'ai'
  }

  if (normalized === 'testautomation') {
    return 'automatedtesting'
  }

  if (normalized === 'html5') {
    return 'html'
  }

  if (normalized === 'css3') {
    return 'css'
  }

  if (normalized === 'js') {
    return 'javascript'
  }

  if (normalized === 'spring') {
    return 'springboot'
  }

  if (normalized === 'tailwind') {
    return 'tailwindcss'
  }

  if (normalized.endsWith('js') && normalized.length > 4 && !SCRIPT_SKILL_KEYS.has(normalized) && normalized !== 'js') {
    normalized = normalized.slice(0, -2)
  }

  return normalized
}

export const unifySkillName = (skill: string): string => {
  const key = normalizeSkillKey(skill)
  return CANONICAL_SKILL_NAMES[key] ?? skill.trim()
}
