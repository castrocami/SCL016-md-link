// module.exports = () => {}
// Node libraries 
const fs = require("fs");
const readline = require("readline");
const http = require('http');
const { URL } = require('url');

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

/*getLinksFromFile("readmeTest.md").then((linksArray) => {
  console.log(linksArray);
});*/

/**
 * 
 * @param {String} url url to validate
 * @returns {{ok: String, status: Number}} 
 */
const getStatusForURl = (link) => {
  return new Promise((resolve, reject) => {
    const result = {};
    try {
      const url = new URL(link);
      const options = {
        host: url.host,
        path: url.pathname,
        method: 'GET',
      };
      const req = http.request(options, (res) => {
        result.status = res.statusCode;
        result.ok = 'ok';
        resolve(result);
      });
      req.on('error', (error) => {
        result.ok = `fail: ${error.message}`;
        resolve(result);
      });
      req.end();
    } catch (error) {
      result.ok = `fail: ${error}`;
      resolve(result);
    }
  });
}
/**
 * 
 * @param {String} path 
 * @param {{validate: Boolean}} options 
 */
const mdLinks = (path, { validate }) => {
  if (validate) {
    //crear promesa que llame a getlinks from file... obtener el resultado y por cada item llamar a funcion que valide el link y cuando
    //todo eso haya terminado resuelvo la promesa
    return new Promise((resolve, reject) => {
      getLinksFromFile(path).then((arrayObjects) => {
        const promisesArray = arrayObjects.map((obj) => {
          return getStatusForURl(obj.link);
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
};

mdLinks("readmeTest.md", { validate: true }).then((linksArray) => {
  console.log(linksArray);
});

// getStatusForURl("https://aula.cdichile.org/mod/page/view.php?id=749&forceview=1").then(result => {
//   console.log(result);
// })

