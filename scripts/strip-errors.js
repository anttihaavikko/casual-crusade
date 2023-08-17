var fs = require('fs');
const chalk = require("chalk");

let fileName = './dist/main.js';

fs.readFile(fileName, 'utf8', function (err, data) {
  if (err) {
    return console.log(err);
  }
  var result = data.replace(/Class extends value "\+String\(n\)\+" is not a constructor or null/g, '');

  fs.writeFile(fileName, result, 'utf8', function (err) {
     if (err) return console.log(err);
     console.log(chalk.green(`Stripped away duplicate error messages.`));
  });
});