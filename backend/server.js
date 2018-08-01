const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const fs = require("fs");
// const getMP3Duration = require("get-mp3-duration");
const app = express();
const router = express.Router();

const BASE_URL = "http://localhost:3000/";

// Add headers
app.use(function(req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});

app.use(express.static("public"));
var server = http.createServer(app);
var io = socketIO(server);
io.on("connection", socket => {
  console.log("Server: get Client");

  // listen to "getAudioLinks" emmited from frontend
  socket.on("requestAudios", () => {
    console.log("requestAudios received");
    // get the list of links to audio file in this server
    var audios = [];
    const testFolder = "./public/";
    var index = 0;
    fs.readdirSync(testFolder).forEach(file => {
      // var path = testFolder + file;
      // var buffer = fs.readFileSync(path);
      // var duration = getMP3Duration(buffer); // in ms
      // console.log(duration);
      var audio = {
        id: index,
        link: BASE_URL + file
        // duration: duration // in ms
      };
      audios.push(audio);
      index++;
    });

    // emit "returnAudioLinks" to the frontend with audioLinks
    socket.emit("responseAudios", audios);
    console.log("responseAudios emitted");
  });
});

app.get("/", (req, res) => res.send("Hello"));
app.get("/world", (req, res) => res.send("Hello World!"));

const port = process.env.PORT || 3000;
server.listen(port, () => console.log(`Server running on port ${port}`));
