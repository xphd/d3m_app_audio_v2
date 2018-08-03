const fs = require("fs");
const csv = require("csvtojson");

const contents = fs.readFileSync("datasetDoc.json");

const jsonContents = JSON.parse(contents);

// console.log(jsonContents);

var path = jsonContents.dataResources[0].resPath;
console.log(path);

var csvPath = jsonContents.dataResources[1].resPath;
console.log(csvPath);

var col1 = jsonContents.dataResources[1].columns[0].colName;

console.log(col1);

var col2 = jsonContents.dataResources[1].columns[1].colName;
console.log(col2);

const csvFilePath = csvPath;

csv()
  .fromFile(csvFilePath)
  .then(jsonObj => {
    console.log(jsonObj[0][col1]);
    console.log(jsonObj[0][col2]);
    // jsonObj.forEach(obj => {
    //   console.log(obj);
    // });
  });

// Async / await usage
// const jsonArray = csv().fromFile(csvFilePath);
// console.log(jsonArray.length);
