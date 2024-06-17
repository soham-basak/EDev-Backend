FROM node:18-alpine AS build

# Installing pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Service name as build args
ARG service_name
ENV SERVICE_NAME=$service_name

WORKDIR /app

# Copying root package.json and workspaces.
# Copying the packages and service folder.
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY packages ./packages
COPY apps/backend/${SERVICE_NAME} ./apps/backend/${SERVICE_NAME}

# Installing deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Building the app, this will bundle the service in one dist/index.cjs file.
RUN pnpm build

# Prod stage
FROM node:18-alpine as prod

ARG service_name
ENV SERVICE_NAME=$service_name

LABEL org.opencontainers.image.title "evolve-as-dev/${SERVICE_NAME}"
LABEL org.opencontainers.image.description "Auth Service for evolveasdev.com"
LABEL org.opencontainers.image.url="https://github.com/nilotpaul/evolve-as-dev"
LABEL org.opencontainers.image.licenses="MIT"

WORKDIR /app

# Copying the dist folder from prev build stage.
COPY --from=build --chown=node:node /app/apps/backend/${SERVICE_NAME}/dist ./

EXPOSE $PORT

CMD ["node", "index.cjs", "--migrate"]