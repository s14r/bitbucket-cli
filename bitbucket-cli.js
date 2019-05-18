#!/usr/bin/env node

const Runner = require('./Runner')

Runner.make(__dirname + '/commands').run()
