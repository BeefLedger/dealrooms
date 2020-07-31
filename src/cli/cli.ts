#!/usr/bin/env ts-node


require('yargs')
    .demandCommand()
    .command(require('./commands/cmdContractDeploy'))
    .help()
    .argv