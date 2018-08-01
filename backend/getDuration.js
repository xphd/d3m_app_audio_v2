var ffprobe = require("ffprobe"),
  ffprobeStatic = require("ffprobe-static");
console.log(ffprobeStatic.path);

ffprobe("http://localhost:3000/344.wav", { path: ffprobeStatic.path }, function(
  err,
  info
) {
  if (err) return done(err);
  console.log(info.streams[0].duration);
});
