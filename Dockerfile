FROM node:boron
MAINTAINER Andreas McDermott

RUN mkdir -p /service/blog
WORKDIR /service/blog

COPY ./package.json /service/blog/package.json
COPY ./templates /service/blog/templates
COPY ./static /service/blog/static
COPY ./server /service/blog/server
COPY ./posts /service/blog/posts
COPY ./config/prod-config.json /service/blog/config/config.json

RUN npm install --production

CMD ["npm", "start"]

EXPOSE 8080