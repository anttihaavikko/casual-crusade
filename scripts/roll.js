var fs = require('fs');
const chalk = require("chalk");

const html = './dist/index.html';
const script = './dist/main.min.js';

fs.readFile(html, 'utf8', function (err, htmlData) {
    if (err) {
        return console.log(err);
    }

    fs.readFile(script, 'utf8', function (err, jsData) {
        if (err) {
            return console.log(err);
        }
        var result = htmlData.replace(/<script>.*<\/script>/g, '<script>' + jsData + '</script>');

        fs.writeFile(html, result, 'utf8', function (err) {
            if (err) return console.log(err);
        });
    });
});