#!/usr/bin/env python3
"""Load DB settings from apps/service/.env for MCP."""

from __future__ import annotations

import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ENV_FILE = os.path.join(ROOT, "apps", "service", ".env")


def load_env(path: str) -> dict[str, str]:
    env: dict[str, str] = {}
    with open(path, encoding="utf-8") as file:
        for line in file:
            line = line.strip()
            if not line or line.startswith("#"):
                continue
            key, _, value = line.partition("=")
            value = value.strip()
            if len(value) >= 2 and value[0] == value[-1] and value[0] in "\"'":
                value = value[1:-1]
            env[key.strip()] = value
    return env


def pick(env: dict[str, str], key: str, fallback: str) -> str:
    value = env.get(key, "")
    if value:
        return value
    return env.get(fallback, "")


def build_dsn(env: dict[str, str]) -> str:
    host = pick(env, "DB_MCP_HOST", "DB_HOST")
    port = pick(env, "DB_MCP_PORT", "") or "3306"
    user = pick(env, "DB_MCP_USER", "DB_USER")
    password = pick(env, "DB_MCP_PASSWORD", "DB_PASSWORD")
    schema = env.get("DB_SCHEMA", "")

    if not all([host, user, password, schema]):
        print("Missing DB_HOST, DB_USER, DB_PASSWORD, or DB_SCHEMA in apps/service/.env", file=sys.stderr)
        sys.exit(1)

    # go-sql-driver splits user:password on the first colon before @; raw password is fine.
    return f"{user}:{password}@tcp({host}:{port})/{schema}?parseTime=true"


def main() -> None:
    if len(sys.argv) > 1 and sys.argv[1] == "--yaml":
        env = load_env(ENV_FILE)
        dsn = build_dsn(env)
        print("connections:")
        print("  default:")
        print(f'    dsn: "{dsn}"')
        print("    description: smarthome MariaDB")
        print("query:")
        print("  max_rows: 200")
        print("  timeout_seconds: 30")
        print("features:")
        print("  extended_tools: true")
        return

    print(build_dsn(load_env(ENV_FILE)))


if __name__ == "__main__":
    main()
