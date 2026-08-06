# syntax=docker/dockerfile:1

FROM node:20-bookworm-slim AS builder

WORKDIR /app

RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 make g++ \
  && rm -rf /var/lib/apt/lists/*

COPY . .

RUN yarn install --frozen-lockfile --ignore-scripts
ENV NODE_ENV=production
RUN yarn turbo run build --filter=web...

FROM nginx:alpine AS runtime

COPY apps/web/docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/apps/web/dist /usr/share/nginx/html

EXPOSE 80
