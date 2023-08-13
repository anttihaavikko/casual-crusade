const fs = require("fs");
const chalk = require("chalk");

const MAX_BYTES = 13312;
const filename = "./zipped/game.zip";

function getFilesizeInBytes(filename) {
    return fs.statSync(filename).size;
}

function fileIsUnderMaxSize(fileSize) {
    return fileSize <= MAX_BYTES;
}

fileSize = getFilesizeInBytes(filename);
fileSizeDifference = Math.abs(MAX_BYTES - fileSize);

if (fileIsUnderMaxSize(fileSize)) {
    console.log(chalk.green(`Hooray! The file is ${fileSize} bytes (${fileSizeDifference} bytes under the limit).`));
    process.exit(0);
} else {
    console.log(chalk.red(`Nuts! The file is ${fileSize} bytes (${fileSizeDifference} bytes over the limit).`));
    process.exit(1);
}

