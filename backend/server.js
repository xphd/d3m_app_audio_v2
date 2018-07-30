var express = require("express");
var http = require("http");
var socketIO = require("socket.io");
var fs = require("fs");
var app = express();
var router = express.Router();

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
  socket.on("requestAudioLinks", () => {
    console.log("requestAudioLinks received");
    // get the list of links to audio file in this server
    var audioLinks = [];
    const testFolder = "./public/";
    fs.readdirSync(testFolder).forEach(file => {
      audioLinks.push(BASE_URL + file);
    });

    // emit "returnAudioLinks" to the frontend with audioLinks
    socket.emit("responseAudioLinks", audioLinks);
    console.log("responseAudioLinks emitted");
  });
});

app.get("/", (req, res) => res.send("Hello"));
app.get("/world", (req, res) => res.send("Hello World!"));

const port = process.env.PORT || 3000;
server.listen(port, () => console.log(`Server running on port ${port}`));
