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
if (args.length > 4 || args.length == 0) {
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
    mdLinks(`${args[0]}`, { validate: true }).then((linksArray) => {
        let totalLinks = 0;
        let uniqueLinks = 0;
        totalLinks = linksArray.length;
        console.log(`Total: ${totalLinks}`);
        const o = {};
        linksArray.forEach(element => {
            if (o[element.link] == null) {
                uniqueLinks++;
            };
            o[element.link] = true;
        });
        console.log(`Unique: ${uniqueLinks}`);
    });
} else if (options.stats && options.validate) {
    mdLinks(`${args[0]}`, { validate: true }).then((linksArray) => {
        let totalLinks = 0;
        let uniqueLinks = 0;
        let brokenLinks = 0;
        totalLinks = linksArray.length;
        console.log(`Total: ${totalLinks}`);
        const o = {};
        linksArray.forEach(element => {
            if (o[element.link] == null) {
                uniqueLinks++;
            };
            o[element.link] = true;
            if (element.ok.includes('fail')) {
                brokenLinks++;
            }
        });
        console.log(`Unique: ${uniqueLinks}`);
        console.log(`Broken: ${brokenLinks}`)
    });
}




