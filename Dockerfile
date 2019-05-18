FROM node:12.2.0-alpine
LABEL maintainer=mail@srwip.com

RUN npm install --global bitbucket-cli

ENTRYPOINT ["bitbucket-cli"]
CMD []
