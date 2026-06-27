# AGENTS.md

## React Hooks

`useFeed` is a mount-only hook.

- `topic` and `initialValue` are immutable after mount.
- Do not add them to `useEffect` dependencies.
- Changing either parameter requires remounting the component.
-
