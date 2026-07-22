# @repo/common

Shared runtime logic used by backend and frontend.

## Scope

- Skill name normalization and IDs (`src/skills/`)

## Usage

```ts
import { toSkillId, unifySkillName } from '@repo/common'
```

Consumers:

- [`apps/web`](../../apps/web)
- [`apps/service`](../../apps/service)

## Scripts

| Script            | Description       |
| ----------------- | ----------------- |
| `lint` / `format` | ESLint / Prettier |
| `test`            | Vitest            |
