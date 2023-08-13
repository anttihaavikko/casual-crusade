const fs = require("fs");
const archiver = require("archiver");

const distDir = process.cwd() + "/dist";
const zippedDir = process.cwd() + "/zipped";

fs.mkdirSync(zippedDir, { recursive: true });
const output = fs.createWriteStream(zippedDir + "/game.zip");
const archive = archiver("zip", { zlib: { level: 9 } });

archive.pipe(output);
archive.file(distDir + "/index.html", { name: "index.html" });

archive.finalize();