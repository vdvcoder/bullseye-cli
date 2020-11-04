#!/usr/bin/env node

// System packages / variables
const program = require('commander');

// BullsEye packages
const main = require("../lib/main");
const git = require("../lib/git");


/* NEW COMMAND */
program
  .description('Create a new BullsEye project')
  .command("new [name]")
  .action(main.new);

/* GIT ROUTES */
program
    .description('Check the status of all the polyfier packages in current folder')
    .command("git-status")
    .action(git.status);
program
    .description('Add all files, commit them with the provided message and push them to server. All at once!')
    .command("git-commit")
    .option('-m', "Commit message")
    .action(git.commit);
program
    .description('Pull the updates from the server for all the packages')
    .command("git-pull")
    .action(git.pull);
// allow commander to parse `process.argv`
program.parse(process.argv);
