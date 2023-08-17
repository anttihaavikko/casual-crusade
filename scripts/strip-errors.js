var fs = require('fs');
const chalk = require("chalk");

let files = ['./dist/main.js', './dist/index.html'];

files.forEach(file => {
  fs.readFile(file, 'utf8', function (err, data) {
    if (err) {
      return console.log(err);
    }
    var result = data.replace(/Class extends value "\+String\(n\)\+" is not a constructor or null/g, '');
  
    fs.writeFile(file, result, 'utf8', function (err) {
       if (err) return console.log(err);
       console.log(chalk.green(`Stripped away duplicate error messages from ${file}.`));
    });
  });
})