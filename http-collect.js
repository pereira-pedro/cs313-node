const http = require("http");

http
  .get(process.argv[2], resp => {
    let data = "";
    resp.on("data", chunk => {
      data += chunk;
    });

    resp.on("end", () => {
      console.log(`${data.length}\n${data.toString()}`);
    });
  })
  .on("error", err => {
    console.log("Error: " + err.message);
  });
