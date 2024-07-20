#!/bin/bash

# Mover al directorio raíz del proyecto
cd "$(dirname "$0")/.."

# Exportar variables de entorno desde el archivo .env
export $(grep -v '^#' .env | xargs)

# Volver al directorio scripts
cd scripts

# Ejecutar docker build con las variables de entorno como argumentos de compilación
docker build \
  --build-arg APP_ENV="$APP_ENV" \
  --build-arg NODE_ENV="$NODE_ENV" \
  --build-arg MONGODB="$MONGODB" \
  --build-arg GAMMA_SERVICE_URL="$GAMMA_SERVICE_URL" \
  --build-arg GRAPH_URL="$GRAPH_URL" \
  --build-arg WALLET_CONNECT_PROJECT_ID="$WALLET_CONNECT_PROJECT_ID" \
  --build-arg NODE_PROVIDER_MUMBAI_URL="$NODE_PROVIDER_MUMBAI_URL" \
  --build-arg NODE_PROVIDER_BSC_TESTNET_URL="$NODE_PROVIDER_BSC_TESTNET_URL" \
  --build-arg NODE_PROVIDER_OPBNB_TESTNET="$NODE_PROVIDER_OPBNB_TESTNET" \
  --build-arg MAIL_CLIENT="$MAIL_CLIENT" \
  --build-arg MAIL_FROM="$MAIL_FROM" \
  --build-arg MAIL_TO="$MAIL_TO" \
  --build-arg MAIL_ETHEREAL_HOST="$MAIL_ETHEREAL_HOST" \
  --build-arg MAIL_ETHEREAL_PORT="$MAIL_ETHEREAL_PORT" \
  --build-arg MAIL_ETHEREAL_USER="$MAIL_ETHEREAL_USER" \
  --build-arg MAIL_ETHEREAL_PSWD="$MAIL_ETHEREAL_PSWD" \
  --build-arg MAIL_SG_KEY="$MAIL_SG_KEY" \
  --build-arg MAIL_SG_FROM="$MAIL_SG_FROM" \
  --build-arg NEXT_PUBLIC_STORAGE_URL_ALPHA="$NEXT_PUBLIC_STORAGE_URL_ALPHA" \
  --build-arg NEXT_PUBLIC_STORAGE_URL_GAMMA="$NEXT_PUBLIC_STORAGE_URL_GAMMA" \
  --build-arg NEXT_PUBLIC_ADMIN_ACCOUNTS="$NEXT_PUBLIC_ADMIN_ACCOUNTS" \
  --build-arg NEXT_PUBLIC_NOF_VERSION="$NEXT_PUBLIC_NOF_VERSION" \
  -t my-nextjs-app ..
