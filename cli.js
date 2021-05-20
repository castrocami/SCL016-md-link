#!/usr/bin/env node
const { mdLinks } = require('./index.js');

const [, , ...args] = process.argv;
mdLinks(`${args}`, { validate: true }).then((linksArray) => {
    console.log(linksArray);
});