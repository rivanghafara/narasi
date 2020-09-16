#################
# BUILDER IMAGE #
#################
FROM node:12-alpine as builder


WORKDIR /src/app

RUN apk add --update --no-cache build-base python python-dev bash
RUN apk update
RUN apk upgrade
RUN apk add ca-certificates && \
    update-ca-certificates

# update timezone
RUN apk add --update tzdata

# install pkg
ARG PKG_VERION
ENV PKG_VERION ${PKG_VERION:-4.3.7}
RUN npm install -g npm && \
    npm install -g pkg@$PKG_VERION && \
    npm install -g nodemon

# cache pkg's base Node.js
ARG PKG_NODE_ARCH
ENV PKG_NODE_ARCH ${PKG_NODE_ARCH:-node8-alpine-x64}
RUN mkdir -p /tmp/pkg && \
    cd /tmp/pkg && \
    touch tmp.js && \
    pkg tmp.js -t ${PKG_NODE_ARCH} && \
    rm -rf /tmp/pkg

COPY . $WORKDIR

# resolve dependencies
RUN yarn

# build pkg
# RUN pkg . -t ${PKG_NODE_ARCH} --output ./bin/narasi_app

#################
#  FINAL IMAGE  #
#################
FROM alpine:latest

WORKDIR /src/app

RUN apk update && apk add --no-cache libstdc++ libgcc
RUN apk upgrade
RUN apk add ca-certificates && \
    update-ca-certificates

# update timezone
RUN apk add --update tzdata

COPY --from=builder /src/app/bin/narasi_app /src/app/narasi_app
COPY ./config /src/app/config

CMD ["/src/app/narasi_app"]