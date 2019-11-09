const http = require("http");

http
  .get(process.argv[2], resp => {
    resp.on("data", chunk => {
      console.log(chunk.toString());
    });
  })
  .on("error", err => {
    console.log("Error: " + err.message);
  });
