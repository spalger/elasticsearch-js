import yargs from 'yargs';

import {
  main,
  serverAction,
  testsAction,
  serverAndTestsAction
} from './cli_actions';

yargs
  .usage('node scripts/browser_tests [command] <flags>')
  .help('--help', 'Run browser tests in an instance of headless chrome')
  .option('url', {
    type: 'string',
    description: 'URL to use for the server',
    default: 'http://localhost:8080'
  })
  .option('chromePort', {
    type: 'number',
    description: 'port to use for the chrome debugger',
    default: 9922
  })
  .option('silent', {
    type: 'boolean',
    description: 'log nothing'
  })
  .option('quiet', {
    type: 'boolean',
    description: 'only log errors'
  })
  .option('debug', {
    type: 'boolean',
    description: 'turn on a little extra logging'
  })
  .option('verbose', {
    type: 'boolean',
    description: 'for people who love console.log'
  })
  .option('color', {
    type: 'boolean',
    description: 'set to false to disable colorized output',
    default: true,
  })
  .command({
    command: 'server',
    description: 'start the server and chrome but do not run tests',
    handler(argv) {
      main(argv, serverAction);
    }
  })
  .command({
    command: 'runner',
    description: 'run the tests against an already running server instance',
    handler(argv) {
      main(argv, testsAction);
    }
  })
  .command({
    command: 'test',
    aliases: '*',
    description: 'run the server, then the tests, and then quit',
    handler(argv) {
      main(argv, serverAndTestsAction);
    }
  })
  .demandCommand()
  .argv;
