const fs = require("fs");
const path = require("path");

const publicDirectory = path.join(__dirname, "public");
const indexHtmlPath = path.join(publicDirectory, "index.html");

// Check if index.html exists in the "public" directory
fs.access(indexHtmlPath, fs.constants.F_OK, (err) => {
    if (err) {
        console.error("index.html does not exist in the public directory.");
    } else {
        console.log("index.html exists in the public directory.");
    }
});
