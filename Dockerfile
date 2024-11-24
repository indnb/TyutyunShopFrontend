FROM node:23 AS builder

WORKDIR /frontend

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM nginx:alpine

WORKDIR /usr/share/nginx/html

RUN rm -rf ./*

COPY --from=builder /frontend/build ./

CMD ["nginx", "-g", "daemon off;"]
