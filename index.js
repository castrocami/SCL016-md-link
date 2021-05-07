// module.exports = () => {}
// Node libraries 
const fs = require("fs");
const readline = require("readline");

const mdLinks = (path, { validate }) => {};

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
    // Regex emails
    const re = /\b(https?:\/\/\S*\b)/g;
    let lineNumber = 0;
    const resultLinksAndLines = [];    
    rl.on("line", (line) => {
      lineNumber++;
      const foundLinks = line.match(re);
      if (foundLinks != null){
        foundLinks.forEach((link)=>{
          const linkObject = {
            line : lineNumber,
            link : link,
          }
          resultLinksAndLines.push(linkObject);
        })
      }
    });
    // End of file
    rl.on("close", () => {
      resolve(resultLinksAndLines);
    });
  });
};

getLinksFromFile("readmeTest.md").then((linksArray) => {
  console.log(linksArray);
});

