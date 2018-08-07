const fs = require("fs");
const csv = require("csvtojson");

const contents = fs.readFileSync("datasetDoc.json");

const jsonContents = JSON.parse(contents);

var drs = jsonContents.dataResources;

var audioResIDs = {}; // dictionary/map, key is resID while value is dataResource object,
var tables = []; // all dataResource element whose resType is "table", csv file
drs.forEach(dr => {
  if (dr["resType"] === "audio") {
    audioResIDs[dr["resID"]] = dr;
  } else if (dr["resType"] === "table") {
    tables.push(dr);
  }
});

var audioTables = []; // among all tables, only some of them are for audio
tables.forEach(table => {
  const columns = table["columns"];
  for (var i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column["refersTo"]) {
      const resID = column["refersTo"]["resID"];
      if (resID in audioResIDs) {
        audioTables.push(table);
        console.log(resID);
        break;
      }
    }
  }
});

var count = 0;
const numOfAudioTables = audioTables.length;

audioTables.forEach(table => {
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

  // console.log("==========");
  csv({ noheader: false })
    .fromFile(csvFilePath)
    .on("csv", row => {})
    .on("done", error => {
      count++;
      if (count === numOfAudioTables) {
        console.log("All done");
      }
    });
});

// console.log("tables end");

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
