FROM node:20.10.0-alpine as build

ARG APP_NAME
ENV NODE_ENV production

WORKDIR /app

RUN addgroup --system dev && adduser --system --ingroup dev dev

COPY dist/apps/${APP_NAME} dev
COPY package*.json dev
RUN chown -R dev:dev .

RUN npm --prefix dev --omit=dev i

FROM nginx:alpine

COPY --from=build /app/dev  /usr/share/nginx/html

COPY --from=build /app/dev/assets/nginx.conf /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]
