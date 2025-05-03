FROM node:20-alpine as build

WORKDIR /opt/apps/PursuitPal

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM node:20-alpine as prod

WORKDIR /opt/apps/PursuitPal/ui

COPY --from=build /opt/apps/PursuitPal/build /opt/apps/PursuitPal/ui

RUN npm install -g serve

EXPOSE 3000

CMD ["serve", "-s", ".", "-l", "3000"]