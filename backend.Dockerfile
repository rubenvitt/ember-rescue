# Basis-Image
FROM node:20-alpine AS build

# Arbeitsverzeichnis im Container
WORKDIR /usr/src/app

# Installation von pnpm
RUN npm install -g pnpm
ENV PNPM_HOME=/usr/src/app/.pnpm
ENV PATH=$PNPM_HOME:$PATH
RUN pnpm i -g @nestjs/cli

# Kopieren der pnpm-lock.yaml (falls vorhanden) und package.json
COPY pnpm-lock.yaml package.json ./
COPY backend/package.json backend/pnpm-lock.yaml ./backend/

# Installation der Abhängigkeiten
RUN pnpm install --frozen-lockfile --recursive


# Kopieren des Quellcodes
COPY backend backend

WORKDIR /usr/src/app/backend
RUN pnpx prisma generate

# Bauen der Anwendung
RUN pnpm run build

# Produktions-Image
FROM node:20-alpine

WORKDIR /usr/src/app

# Installation von pnpm und Prisma CLI
RUN npm install -g pnpm
ENV PNPM_HOME=/usr/src/app/.pnpm
ENV PATH=$PNPM_HOME:$PATH
RUN pnpm add -g prisma

# Kopieren der gebauten Anwendung und der Abhängigkeiten
COPY --from=build /usr/src/app/backend/dist ./dist
COPY --from=build /usr/src/app/backend/node_modules ./node_modules
COPY --from=build /usr/src/app/backend/package.json ./
COPY --from=build /usr/src/app/backend/prisma ./prisma

# Exponieren des Ports, auf dem die Anwendung läuft
EXPOSE 3000

# Starten der Anwendung
CMD ["npm", "run", "start:migrate:prod"]