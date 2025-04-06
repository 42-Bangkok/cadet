FROM node:22-slim as deps

WORKDIR /app
COPY app/package*.json .
# forcing for v7.10.1
RUN npm install --force  

FROM node:22-slim as builder

# Put NEXT_PUBLIC_* ENV vars here
ARG NEXT_PUBLIC_URL
# ARG NEXT_PUBLIC_FE_URL

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY app .
RUN rm -rf "app/(test)"
RUN npm run build

FROM node:22-slim as runner
WORKDIR /app
COPY app/next.config.mjs .
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY app/scripts /app/scripts
COPY app/drizzle /app/drizzle
COPY app/drizzle.config.ts .
COPY app/migrate.mjs .

EXPOSE 3000
CMD ["npm", "run", "start"]
