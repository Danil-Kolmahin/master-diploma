FROM node:20.10.0-alpine

ARG APP_NAME
ENV NODE_ENV production

WORKDIR /app

RUN addgroup --system dev && adduser --system --ingroup dev dev

COPY dist/apps/${APP_NAME} dev
COPY package*.json dev
RUN chown -R dev:dev .

RUN npm --prefix dev --omit=dev i

WORKDIR /app/dev

CMD [ "npm", "run", "serve-build-app" ]
