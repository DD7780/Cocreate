FROM node:22-bookworm-slim AS app

WORKDIR /app
RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

ENV NODE_ENV=production
ENV COCREATE_HOSTED=true
ENV PORT=5173

EXPOSE 5173
CMD ["pnpm", "start"]
