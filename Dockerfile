FROM oven/bun:1 AS builder

WORKDIR /app

# Install dependencies
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Copy source code and build
COPY . .
RUN bun run build

# Production image
FROM oven/bun:1-slim AS runner

WORKDIR /app

# Copy built server and public assets
COPY --from=builder /app/.output ./.output
COPY --from=builder /app/package.json ./

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

# Start the nitro node server
CMD ["bun", "run", ".output/server/index.mjs"]
