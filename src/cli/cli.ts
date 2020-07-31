#!/usr/bin/env ts-node


require('yargs')
    .demandCommand()
    .command(require('./commands/contractDeploy'))
    .help()
    .argv