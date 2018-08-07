const fs = require("fs");
const csv = require("csvtojson");

const contents = fs.readFileSync("datasetDoc.json");

const jsonContents = JSON.parse(contents);

// console.log(jsonContents);

// console.log(jsonContents.dataResources);

var print = c => {
  console.log(c);
};

var drs = jsonContents.dataResources;

// print(typeof drs[0]["resID"]);

// console.log(drs.length);
var audioResIDs = {}; // dictionary/map, key is resID while value is dataResource object,
// for quick finding the corresponding dataResource element
var tables = []; // all dataResource element whose resType is "table", csv file
drs.forEach(dr => {
  // print(dr["resID"]);
  if (dr["resType"] === "audio") {
    audioResIDs[dr["resID"]] = dr;
  } else if (dr["resType"] === "table") {
    tables.push(dr);
  }
});

tables.forEach(table => {
  const csvFilePath = table["resPath"];
  var columns = table["columns"];
  var index_d3mIndex = -1;
  var index_filename = -1;

  var audiosPath = "";
  // inner loop
  columns.forEach(column => {
    if (column["colName"] === "d3mIndex") {
      index_d3mIndex = column["colIndex"];
    } else if (column["refersTo"]) {
      index_filename = column["colIndex"];
      var resID = column["refersTo"]["resID"];

      if (resID in audioResIDs) {
        audiosPath = audioResIDs[resID]["resPath"];
      }
    }
  });
  // deal with rows in table
  console.log(audiosPath);
  console.log(csvFilePath);

  // const csvFilePath = csvPath;
  console.log("==========");
  csv({ noheader: false })
    .fromFile(csvFilePath)
    .on("csv", row => {
      // console.log(row);
      console.log(row[0]);
      console.log(row[1]);
    })
    .on("done", error => {
      console.log("end");
    });
});

// print(audioResIDs);

// var path = jsonContents.dataResources[0].resPath;
// console.log(path);

// var csvPath = jsonContents.dataResources[1].resPath;
// console.log(csvPath);

// var col1 = jsonContents.dataResources[1].columns[0]["colIndex"];
// console.log("col1", typeof col1);

// var col2 = jsonContents.dataResources[1].columns[1]["colIndex"];
// console.log("col2", col2);

// var role = jsonContents.dataResources[1].columns[0]["role"];
// console.log(role.includes("index"));

// const csvFilePath = csvPath;
// console.log("==========");
// csv({ noheader: false })
//   .fromFile(csvFilePath)
//   .on("csv", row => {
//     console.log(row);
//     console.log(row[0]);
//     console.log(row[1]);
//   })
//   .on("done", error => {
//     console.log("end");
//   });

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
