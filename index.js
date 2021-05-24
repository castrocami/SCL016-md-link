// Node libraries 
const fs = require("fs");
const readline = require("readline");
const fetch = require('node-fetch');
const pathLib = require('path')


/**
 * https://stackoverflow.com/questions/13104411/how-to-specify-resolution-and-rejection-type-of-the-promise-in-jsdoc
 * @param {String} path route to file for link extraction 
 * @returns {Promise<[{line: Number, link: String}]>}
 */
const getLinksFromFile = (path) => {
  // https://nodejs.org/api/readline.html#readline_example_read_file_stream_line_by_line
  return new Promise((resolve, reject) => {
    //Read file
    const rl = readline.createInterface({
      input: fs.createReadStream(path),
      crlfDelay: Infinity,
    });
    // Regex emails https://regexr.com/
    const re = /\[([^\]]*)\]\(([^\)]+)\)/g;
    let lineNumber = 0;
    const resultLinksAndLines = [];
    rl.on("line", (line) => {
      lineNumber++;
      const foundLinks = line.matchAll(re);
      // console.log(`linea ${lineNumber}: ${line}`);
      for (const match of foundLinks) {
        // console.log(`match total: ${match[0]}` );
        // console.log(`text: ${match[1]}`);
        // console.log(`link: ${match[2]}`);    
        const linkObject = {
          line: lineNumber,
          file: path,
          text: match[1],
          link: match[2],
        }
        resultLinksAndLines.push(linkObject);
      }
    });
    // End of file
    rl.on("close", () => {
      resolve(resultLinksAndLines);
    });
  });
};
// getLinksFromFile("readmeTest.md").then((linksArray) => {
//   console.log(linksArray);
// });

/**
 * 
 * @param {String} url url to validate
 * @returns {{ok: String, status: Number}} 
 */
//https://www.npmjs.com/package/node-fetch
const getStatusForUrl = (link) => {
  return new Promise((resolve, reject) => {
    const result = {};
    fetch(link)
      .then((resp) => {
        result.status = resp.status;
        result.ok = resp.statusText;
        resolve(result);
      }).catch((error) => {
        result.ok = `fail`;
        resolve(result);
      })
  })
}
// getStatusForUrl('https://giteBwlivndvsnjvjnkvnsdn.com/').then((result) => {
//   console.log(result);
// });

/**
 * 
 * @param {String} path 
 * @param {{validate: Boolean}} options 
 */
const mdLinks = (path, { validate }) => {
  // https://stackoverflow.com/questions/15630770/node-js-check-if-path-is-file-or-directory
  if (fs.lstatSync(path).isFile() && pathLib.extname(path) === '.md') {
    if (validate) {
      return new Promise((resolve, reject) => {
        getLinksFromFile(path).then((arrayObjects) => {
          const promisesArray = arrayObjects.map((obj) => {
            return getStatusForUrl(obj.link);
          })
          //https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Promise/all
          Promise.all(promisesArray).then((resolvedPromisesArray) => {
            for (let i = 0; i < arrayObjects.length; i++) {
              // https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
              Object.assign(arrayObjects[i], resolvedPromisesArray[i]);
            }
            resolve(arrayObjects);
          })
        });
      })
    } else {
      return getLinksFromFile(path);
    }
  } else if (fs.lstatSync(path).isDirectory()) {
    return new Promise((resolve, reject) => {
      // crear arreglo vacio para guardar resultados
      const dirTotalLinks = [];
      fs.readdir(path, function (err, files) {
        if (err) {
          console.error("Could not list the directory.", err);
          process.exit(1);
        }
        const promisesFilesArray = files.map((eachFile) => {
          return mdLinks(`${path}/${eachFile}`, { validate: validate });
        })
        Promise.all(promisesFilesArray).then((resolvedMdLinks) => {
          resolvedMdLinks.forEach(arr => {
            dirTotalLinks.push(...arr);
          })
          resolve(dirTotalLinks);
        })
      })
    })
  } else {
    return new Promise((resolve, reject) => {
      resolve([]);
    })
  }
};
// mdLinks("./hola", { validate: true }).then((linksArray) => {
//   console.log(linksArray);
// });



module.exports = {
  getLinksFromFile,
  getStatusForUrl,
  mdLinks,
}