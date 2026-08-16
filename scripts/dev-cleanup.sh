#!/usr/bin/env bash
# Kill orphaned monorepo dev processes left by interrupted Ctrl+C / yarn exits.
set -euo pipefail

REPO_DIR="$(cd "$(dirname "$0")/.." && pwd)"
SERVICE_DIR="$REPO_DIR/apps/service"
KILLED=0
TARGET_PIDS=""

kill_pid() {
  local pid=$1
  local reason=$2
  case " $TARGET_PIDS " in
    *" $pid "*)
      return
      ;;
  esac
  if kill -0 "$pid" 2>/dev/null; then
    echo "[dev-cleanup] killing pid $pid ($reason)"
    TARGET_PIDS="$TARGET_PIDS $pid"
    kill -TERM "$pid" 2>/dev/null || true
    KILLED=$((KILLED + 1))
  fi
}

for port in 9464 3679; do
  while read -r pid; do
    [[ -n "$pid" ]] && kill_pid "$pid" "port $port"
  done < <(lsof -ti :"$port" 2>/dev/null || true)
done

while read -r line; do
  pid="${line%% *}"
  cmd="${line#* }"
  case "$cmd" in
    *scripts/dev.mjs*|*./dist/preload.js*)
      cwd=$(lsof -a -p "$pid" -d cwd -Fn 2>/dev/null | sed -n 's/^n//p' | head -1)
      if [[ "$cwd" == "$SERVICE_DIR" ]]; then
        kill_pid "$pid" "$cmd"
      fi
      ;;
  esac
done < <(ps ax -o pid=,command= | grep -E 'node.*(scripts/dev\.mjs|-r \./dist/preload\.js)' | grep -v grep || true)

while read -r pid ppid cmd; do
  [[ "$ppid" == "1" ]] || continue
  case "$cmd" in
    *yarn.js\ run\ dev*)
      cwd=$(lsof -a -p "$pid" -d cwd -Fn 2>/dev/null | sed -n 's/^n//p' | head -1)
      case "$cwd" in
        "$REPO_DIR"/*)
          kill_pid "$pid" "orphan yarn dev: $cwd"
          ;;
      esac
      ;;
  esac
done < <(ps ax -o pid=,ppid=,command=)

if [[ "$KILLED" -gt 0 ]]; then
  sleep 1
  for pid in $TARGET_PIDS; do
    if kill -0 "$pid" 2>/dev/null; then
      echo "[dev-cleanup] force-killing pid $pid"
      kill -KILL "$pid" 2>/dev/null || true
    fi
  done
  echo "[dev-cleanup] done ($KILLED process(es))"
fi
