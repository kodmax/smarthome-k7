# @repo/i18n-react

Lightweight i18n factory for React — locale storage, provider, and typed translation hooks.

## API

| Export                | Description                                                |
| --------------------- | ---------------------------------------------------------- |
| `createI18n`          | Factory — returns provider, `useLocale`, `useTranslations` |
| `createLocaleStorage` | Persist locale in `localStorage` (or custom storage)       |

```tsx
import { createI18n } from '@repo/i18n-react'

const { I18nProvider, useLocale, useTranslations } = createI18n({
  storageKey: 'locale',
  locales: ['pl', 'en'] as const,
  fallbackLocale: 'pl',
  getTranslations: locale => (locale === 'pl' ? pl : en),
})

// In app root
<I18nProvider>{children}</I18nProvider>

// In components
const { t } = useTranslations()
const { locale, setLocale } = useLocale()
```

## Usage

Consumed by [`apps/web`](../../apps/web) — configured in `src/i18n/index.ts`.

The package exports TypeScript source with no separate build step — Vite compiles it together with the web app.

## Scripts

| Script            | Description       |
| ----------------- | ----------------- |
| `test`            | Vitest            |
| `lint` / `format` | ESLint / Prettier |
