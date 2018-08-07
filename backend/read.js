const fs = require("fs");
const csv = require("csvtojson");

const contents = fs.readFileSync("datasetDoc.json");

const jsonContents = JSON.parse(contents);

// console.log(jsonContents);

var path = jsonContents.dataResources[0].resPath;
console.log(path);

var csvPath = jsonContents.dataResources[1].resPath;
console.log(csvPath);

var col1 = jsonContents.dataResources[1].columns[0]["colIndex"];
console.log("col1", typeof col1);

var col2 = jsonContents.dataResources[1].columns[1]["colIndex"];
console.log("col2", col2);

var role = jsonContents.dataResources[1].columns[0]["role"];
console.log(role.includes("index"));

const csvFilePath = csvPath;
console.log("==========");
csv({ noheader: false })
  .fromFile(csvFilePath)
  .on("csv", row => {
    console.log(row);
    console.log(row[0]);
    console.log(row[1]);
  })
  .on("done", error => {
    console.log("end");
  });

// csv()
//   .fromFile(csvFilePath)
//   .then(jsonObjs => {
//     jsonObjs.forEach(jsonObj => {
//       console.log(parseInt(jsonObj[col1]));
//       console.log(jsonObj[col2]);
//     });
//   });

// jsonObjs => {
// jsonObjs.forEach(obj=>{
//   console.log(parseInt(jsonObj[0][col1]));
//   console.logjsonObj[0][col2]);
// })

// jsonObj.forEach(obj => {
//   console.log(obj);
// });

// Async / await usage
// const jsonArray = csv().fromFile(csvFilePath);
// console.log(jsonArray.length);
