#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const run = require('../lib/run');
const list = require('../lib/list');
const kill = require('../lib/kill');
const cleanup = require('../lib/cleanup');

const [,, command, ...args] = process.argv;

// Prompt helper
function prompt(question, defaultValue) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise(resolve => rl.question(question, answer => {
    rl.close();
    resolve(answer.trim() || defaultValue);
  }));
}

// Parse CLI flags manually
function parseFlags(args) {
  const flags = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith('--')) {
      const key = args[i].replace(/^--/, '');
      const next = args[i + 1];
      if (next && !next.startsWith('--')) {
        flags[key] = next;
        i++;
      } else {
        flags[key] = true;
      }
    }
  }
  return flags;
}

(async () => {
  const flags = parseFlags(args);

  switch(command) {
    case 'run': {
      cleanup();
      // 1️⃣ Ask env file
      let envFile = flags['env-file'];
      if (!envFile) {
        envFile = await prompt('Enter env file path (relative to project root): ');
      }
      const envFilePath = path.resolve(process.cwd(), envFile);
      if (!fs.existsSync(envFilePath)) {
        console.error(`Env file does not exist: ${envFilePath}`);
        process.exit(1);
      }

      // 2️⃣ Auto-cleanup
      let autoCleanup = flags['auto-cleanup'];
      if (autoCleanup === undefined) {
        let autoAnswer = await prompt('Auto-cleanup temp env file after exit? (y/n): ', 'y');
        autoCleanup = autoAnswer.toLowerCase().startsWith('y');
      }

      // 3️⃣ Command to run
      let commandString = flags.cmd;
      if (!commandString) {
        const defaultCmd = 'npm run dev';
        commandString = await prompt(`Enter command to run (default: "${defaultCmd}"): `, defaultCmd);
      }

      run({ envFilePath, autoCleanup, commandString });
      break;
    }

    case 'list':
      cleanup();
      list();
      break;

    case 'kill': {
      cleanup();
      let id = flags.id || args[0];
      if (!id) {
        console.log('Please provide instance ID to kill');
        process.exit(1);
      }
      kill(id);
      break;
    }

    default:
      console.log(`
Usage:
  multi-env run         # Run a new instance (interactive or with flags)
  multi-env list        # List running instances
  multi-env kill <id>   # Kill a running instance

Flags for 'run':
  --env-file <file>       Env file path to use
  --cmd "<command>"       Command to run (default: npm run dev)
  --auto-cleanup          Automatically remove temp env file after exit
Flags for 'kill':
  --id <instance-id>      Kill instance by ID
`);
  }
})();