# syntax=docker/dockerfile:1

FROM node:20-bookworm-slim AS builder

WORKDIR /app

RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 make g++ \
  && rm -rf /var/lib/apt/lists/*

COPY . .

RUN yarn install --frozen-lockfile --ignore-scripts
RUN yarn turbo run build --filter=service...

FROM node:20-bookworm-slim AS runtime

WORKDIR /app

COPY --from=builder /app/package.json /app/yarn.lock ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/service ./apps/service
COPY --from=builder /app/packages ./packages

COPY apps/service/docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

WORKDIR /app/apps/service

EXPOSE 3678 9464

ENTRYPOINT ["/entrypoint.sh"]
