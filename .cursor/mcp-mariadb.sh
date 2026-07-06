#!/usr/bin/env bash
set -eo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"

export MYSQL_DSN="$("$ROOT/.cursor/mcp-dsn.py")"
export MYSQL_MAX_ROWS=200
export MYSQL_MCP_EXTENDED=1

exec mysql-mcp-server
