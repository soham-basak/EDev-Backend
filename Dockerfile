FROM node:20-alpine

ARG service_name
ENV SERVICE_NAME=$service_name

WORKDIR /app

COPY /apps/backend/${SERVICE_NAME}/dist /app/

EXPOSE 3000 5000 8550

CMD ["node", "index.cjs"]
