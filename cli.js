#!/usr/bin/env node
const { program } = require('commander');
const { mdLinks } = require('./index.js');

// Declare options https://www.npmjs.com/package/commander
program
    .option('--validate', 'validate links')
    .option('--stats', 'show statistics instead of list')
program.parse(process.argv);
const options = program.opts();
// Get path argument
const [, , ...args] = process.argv;

if (args.length !== 1) {
    console.log("Please enter exactly one argument")
    return;
}

// Options cases
if (!options.validate && !options.stats) {
    mdLinks(`${args[0]}`, { validate: false }).then((linksArray) => {
        console.log(linksArray);
    });
} else if (options.validate && !options.stats) {
    mdLinks(`${args[0]}`, { validate: true }).then((linksArray) => {
        console.log(linksArray);
    });
} else if (options.stats && !options.validate) {
    console.log("proximamente");
} else if (options.stats && options.validate) {
    console.log("proximamente");
}




