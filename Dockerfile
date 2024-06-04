FROM node:20-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /

COPY . .

RUN pnpm i --frozen-lockfile --prod=true

FROM base AS build
RUN pnpm build

CMD [ "pnpm", "start" ]