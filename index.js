#!/usr/bin/env node

const BitbucketCli = require('./bitbucket-cli')

BitbucketCli
  .make(__dirname + '/commands')
  .run()
