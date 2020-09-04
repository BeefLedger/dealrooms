#!/usr/bin/env node
require('yargs')
    .demandCommand()
    .command(require('./commands/cmdContractDeploy'))
    .help()
    .argv