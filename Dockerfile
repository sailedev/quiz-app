# syntax=docker/dockerfile:1.7

FROM node:20-slim AS base
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1
WORKDIR /app

RUN corepack enable

FROM base AS deps
RUN apt-get update -qq \
  && apt-get install -y -qq --no-install-recommends python3 make g++ \
  && rm -rf /var/lib/apt/lists/*

COPY package.json pnpm-lock.yaml ./

RUN --mount=type=cache,target=/root/.pnpm-store \
    pnpm install --frozen-lockfile

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN --mount=type=cache,target=/root/.pnpm-store \
    pnpm run build

RUN pnpm prune --prod
FROM node:20-slim AS runner
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=3000
WORKDIR /app
RUN useradd -m -u 1001 nodeusr
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
RUN chown -R nodeusr:nodeusr /app
USER nodeusr
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "require('http').get({host:'127.0.0.1',port:process.env.PORT,path:'/'},r=>{process.exit(r.statusCode<500?0:1)}).on('error',()=>process.exit(1)))"
CMD ["node", "server.js"]
