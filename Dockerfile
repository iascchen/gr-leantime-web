# FROM node
FROM nginx:alpine

MAINTAINER IascCHEN

# 更新Alpine的软件源为国内（清华大学）的站点 TUNA
RUN echo "https://mirror.tuna.tsinghua.edu.cn/alpine/v3.13/main/" > /etc/apk/repositories

RUN apk update && apk upgrade && \
    apk add --no-cache nodejs npm

ARG NPM_REGISTRY="https://registry.npm.taobao.org"

RUN npm config set registry ${NPM_REGISTRY}
RUN npm config get registry

WORKDIR /opt/app
COPY package.json /opt/app/package.json
# COPY yarn.lock /opt/app/yarn.lock
RUN npm install

COPY . /opt/app
RUN npm run build
RUN cp -r build/* /usr/share/nginx/html
