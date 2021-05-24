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
// Without options
if (!options.validate && !options.stats) {
  mdLinks(`${args[0]}`, { validate: false }).then((linksArray) => {
    console.table(linksArray);
  });
  // --validate
} else if (options.validate && !options.stats) {
  mdLinks(`${args[0]}`, { validate: true }).then((linksArray) => {
    console.table(linksArray);
  });
  // -- stats
} else if (options.stats && !options.validate) {
  mdLinks(`${args[0]}`, { validate: true }).then((linksArray) => {
    const finalResume = resumeStatus(linksArray)
    console.log(`Total: ${finalResume.totalLinks} \nUnique: ${finalResume.uniqueLinks}`);
  });
  // --validate --stats
} else if (options.stats && options.validate) {
  mdLinks(`${args[0]}`, { validate: true }).then((linksArray) => {
    const finalResume = resumeStatus(linksArray)
    console.log(`Total: ${finalResume.totalLinks} \nUnique: ${finalResume.uniqueLinks} \nBroken: ${finalResume.brokenLinks} `);
  });
}


// Resume status for some options
const resumeStatus = (objectArray) => {
  const resumeObject = {
    totalLinks: 0,
    uniqueLinks: 0,
    brokenLinks: 0,
  };
  resumeObject.totalLinks = objectArray.length;
  const o = {};
  objectArray.forEach(element => {
    if (o[element.link] == null) {
      resumeObject.uniqueLinks++;
    };
    o[element.link] = true;
    if (element.ok.includes('fail')) {
      resumeObject.brokenLinks++;
    }
  });
  return resumeObject;
}


