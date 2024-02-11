FROM node:18-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./ 
RUN apk add --no-cache libc6-compat && npm ci

FROM node:18-alpine AS builder
WORKDIR /app

# args
ARG APP_ENV
ARG NODE_ENV
ARG MONGODB
ARG GAMMA_SERVICE_URL
ARG GRAPH_URL
ARG WALLET_CONNECT_PROJECT_ID
ARG CHAIN_NODE_PROVIDER_URL
ARG MAIL_CLIENT
ARG MAIL_FROM
ARG MAIL_TO
ARG MAIL_ETHEREAL_HOST
ARG MAIL_ETHEREAL_PORT
ARG MAIL_ETHEREAL_USER
ARG MAIL_ETHEREAL_PSWD
ARG MAIL_SG_KEY
ARG MAIL_SG_FROM
ARG NEXT_PUBLIC_STORAGE_URL_ALPHA
ARG NEXT_PUBLIC_STORAGE_URL_GAMMA
ARG NEXT_PUBLIC_CHAIN_NAME
ARG NEXT_PUBLIC_CHAIN_ID
ARG NEXT_PUBLIC_CHAIN_CURRENCY
ARG NEXT_PUBLIC_CHAIN_RPC_URL
ARG NEXT_PUBLIC_CHAIN_EXPLORER_URL
ARG NEXT_PUBLIC_ADMIN_ACCOUNTS
ARG NEXT_PUBLIC_DAI_ADDRESS
ARG NEXT_PUBLIC_ALPHA_ADDRESS
ARG NEXT_PUBLIC_GAMMA_CARDS_ADDRESS
ARG NEXT_PUBLIC_GAMMA_PACKS_ADDRESS
ARG NEXT_PUBLIC_GAMMA_OFFERS_ADDRESS
ARG NEXT_PUBLIC_GAMMA_TICKETS_ADDRESS

# env
ENV APP_ENV $APP_ENV
ENV NODE_ENV $NODE_ENV
ENV MONGODB $MONGODB
ENV GAMMA_SERVICE_URL $GAMMA_SERVICE_URL
ENV GRAPH_URL $GRAPH_URL
ENV WALLET_CONNECT_PROJECT_ID $WALLET_CONNECT_PROJECT_ID
ENV CHAIN_NODE_PROVIDER_URL $CHAIN_NODE_PROVIDER_URL
ENV MAIL_CLIENT $MAIL_CLIENT
ENV MAIL_FROM $MAIL_FROM
ENV MAIL_TO $MAIL_TO
ENV MAIL_ETHEREAL_HOST $MAIL_ETHEREAL_HOST
ENV MAIL_ETHEREAL_PORT $MAIL_ETHEREAL_PORT
ENV MAIL_ETHEREAL_USER $MAIL_ETHEREAL_USER
ENV MAIL_ETHEREAL_PSWD $MAIL_ETHEREAL_PSWD
ENV MAIL_SG_KEY $MAIL_SG_KEY
ENV MAIL_SG_FROM $MAIL_SG_FROM
ENV NEXT_PUBLIC_STORAGE_URL_ALPHA $NEXT_PUBLIC_STORAGE_URL_ALPHA
ENV NEXT_PUBLIC_STORAGE_URL_GAMMA $NEXT_PUBLIC_STORAGE_URL_GAMMA
ENV NEXT_PUBLIC_CHAIN_NAME $NEXT_PUBLIC_CHAIN_NAME
ENV NEXT_PUBLIC_CHAIN_ID $NEXT_PUBLIC_CHAIN_ID
ENV NEXT_PUBLIC_CHAIN_CURRENCY $NEXT_PUBLIC_CHAIN_CURRENCY
ENV NEXT_PUBLIC_CHAIN_RPC_URL $NEXT_PUBLIC_CHAIN_RPC_URL
ENV NEXT_PUBLIC_CHAIN_EXPLORER_URL $NEXT_PUBLIC_CHAIN_EXPLORER_URL
ENV NEXT_PUBLIC_ADMIN_ACCOUNTS $NEXT_PUBLIC_ADMIN_ACCOUNTS
ENV NEXT_PUBLIC_DAI_ADDRESS $NEXT_PUBLIC_DAI_ADDRESS
ENV NEXT_PUBLIC_ALPHA_ADDRESS $NEXT_PUBLIC_ALPHA_ADDRESS
ENV NEXT_PUBLIC_GAMMA_CARDS_ADDRESS $NEXT_PUBLIC_GAMMA_CARDS_ADDRESS
ENV NEXT_PUBLIC_GAMMA_PACKS_ADDRESS $NEXT_PUBLIC_GAMMA_PACKS_ADDRESS
ENV NEXT_PUBLIC_GAMMA_OFFERS_ADDRESS $NEXT_PUBLIC_GAMMA_OFFERS_ADDRESS
ENV NEXT_PUBLIC_GAMMA_TICKETS_ADDRESS $NEXT_PUBLIC_GAMMA_TICKETS_ADDRESS

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN echo "***********************"
RUN env
RUN echo "***********************"
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT 3000
CMD ["node", "server.js"]
