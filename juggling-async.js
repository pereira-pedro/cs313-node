const http = require("http");

for (i = 2; i < process.argv.length; i++) {
  http
    .get(process.argv[i], resp => {
      let data = [];
      resp.on("data", chunk => {
        data[i] += chunk;
      });

      resp.on("end", () => {
        console.log(data[i].toString());
      });
    })
    .on("error", err => {
      console.log("Error: " + err.message);
    });
}
