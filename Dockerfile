FROM node:22-bookworm-slim AS app

WORKDIR /app
RUN corepack enable
RUN apt-get update && apt-get install -y --no-install-recommends bubblewrap util-linux chromium tini && rm -rf /var/lib/apt/lists/*

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN apt-get update && apt-get install -y --no-install-recommends gcc libc6-dev && gcc -O2 -Wall -Wextra -Werror server/isolation/linux-job-launcher.c -o /usr/local/bin/cocreate-job-launcher && apt-get purge -y gcc libc6-dev && apt-get autoremove -y && rm -rf /var/lib/apt/lists/*
ARG VITE_COCREATE_AUTH_MODE
ARG VITE_COCREATE_APP_ORIGIN
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_PUBLISHABLE_KEY
ENV VITE_COCREATE_AUTH_MODE=$VITE_COCREATE_AUTH_MODE
ENV VITE_COCREATE_APP_ORIGIN=$VITE_COCREATE_APP_ORIGIN
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_PUBLISHABLE_KEY=$VITE_SUPABASE_PUBLISHABLE_KEY
RUN pnpm build
RUN node scripts/release-fingerprint.mjs --write-image
RUN pnpm exec tsx scripts/prepare-isolation.ts --files-only && mkdir -p /app/data /app/generated && chown -R node:node /app/.runtime /app/data /app/generated
USER root

ENV NODE_ENV=production
ENV COCREATE_HOSTED=true
ENV PORT=5173

EXPOSE 5173
ENTRYPOINT ["/bin/sh", "/app/scripts/start-container.sh"]
CMD ["node", "--import", "tsx", "server/index.ts"]
