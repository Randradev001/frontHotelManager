FROM node:22-bookworm-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --include=optional
COPY . .
ENV VITE_API_URL=/ VITE_APP_BASE_NAME=/free
RUN npm run build

FROM caddy:2-alpine
COPY deploy/Caddyfile /etc/caddy/Caddyfile
COPY --from=build /app/dist /srv/free
EXPOSE 80
