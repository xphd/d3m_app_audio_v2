const fs = require("fs");

const contents = fs.readFileSync("datasetDoc.json");

const jsonContents = JSON.parse(contents);

console.log(jsonContents);
