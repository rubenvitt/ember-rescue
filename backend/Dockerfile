# Basis-Image
FROM node:22-alpine AS build

# pnpm installieren
RUN npm install -g pnpm

# Arbeitsverzeichnis erstellen
WORKDIR /usr/src/app

# Abhängigkeiten kopieren und installieren
COPY package.json ./
RUN pnpm install

# Quellcode kopieren
COPY . .

# Anwendung bauen
RUN pnpm run prisma:generate
RUN pnpm run build

# Production-Image
FROM node:22-alpine

# pnpm installieren
RUN npm install -g pnpm

# Arbeitsverzeichnis erstellen
WORKDIR /usr/src/app

# Nur produktionsrelevante Abhängigkeiten installieren
COPY package.json ./
RUN pnpm install --prod

# Prisma-Treiber und -Dateien kopieren
COPY prisma ./prisma/
COPY --from=build /usr/src/app/node_modules node_modules
RUN rm -rf node_modules/.cache
RUN pnpm prune

# Kompilierte Anwendung aus dem Build-Stage kopieren
COPY --from=build /usr/src/app/dist ./dist

# Port freigeben
EXPOSE 3000

# Anwendung starten
CMD ["pnpm", "start:migrate:prod"]