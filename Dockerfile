# syntax=docker/dockerfile:1.7

FROM node:20-slim AS base
ENV NODE_ENV=production
WORKDIR /app

RUN npm i -g npm@11

FROM base AS deps
RUN apt-get update -qq && apt-get install -y -qq --no-install-recommends python3 make g++ && rm -rf /var/lib/apt/lists/*
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci --include=dev

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN --mount=type=cache,target=/root/.npm npm run build
RUN npm prune --omit=dev

FROM node:20-slim AS runner
ENV NODE_ENV=production PORT=3000
WORKDIR /app
RUN useradd -m -u 1001 nodeusr
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
RUN chown -R nodeusr:nodeusr /app
USER nodeusr
EXPOSE 3000
CMD ["node", "server.js"]
