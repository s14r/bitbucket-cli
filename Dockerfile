FROM node:12.2.0-alpine
LABEL maintainer=mail@srwip.com

COPY package.json /opt/bitbucket-cli/
COPY package-lock.json /opt/bitbucket-cli/
WORKDIR /opt/bitbucket-cli
RUN npm install

COPY . .
RUN npm link

ENTRYPOINT ["bitbucket-cli"]
CMD []
