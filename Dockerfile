FROM node:16-alpine
LABEL maintainer=mail@srwip.com

RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh

COPY package.json /opt/bitbucket-cli/
COPY package-lock.json /opt/bitbucket-cli/

WORKDIR /opt/bitbucket-cli
RUN npm install

COPY . .
RUN npm link

ENTRYPOINT ["bitbucket-cli"]
CMD []
