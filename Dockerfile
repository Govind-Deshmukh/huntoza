FROM node:20-alpine as build

WORKDIR /opt/apps/PursuitPal

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run prod

FROM node:20-alpine as prod

ENV NODE_ENV=production
ENV REACT_APP_API_URL=https://api.pursuitpal.app/api/v1
ENV GENERATE_SOURCEMAP=false

WORKDIR /opt/apps/PursuitPal/ui


COPY --from=build /opt/apps/PursuitPal/build /opt/apps/PursuitPal/ui

RUN npm install -g serve

EXPOSE 3000

CMD ["serve", "-s", ".", "-l", "3000"]