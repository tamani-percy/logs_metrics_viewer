FROM node:24-alpine AS build

WORKDIR /workspace

ARG VITE_APP_BACKEND=http://localhost:8080/api/v1/
ENV VITE_APP_BACKEND=$VITE_APP_BACKEND

RUN corepack enable && corepack prepare pnpm@10.23.0 --activate

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm run build-only

FROM nginx:1.27-alpine

COPY --from=build /workspace/dist /usr/share/nginx/html

EXPOSE 80
