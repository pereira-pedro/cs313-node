const fs = require("fs");

try {
  const buffer = fs.readFileSync(process.argv[2]);
  const arrayBuffer = buffer.toString().split("\n");
  console.log(arrayBuffer.length - 1);
} catch (err) {
  console.log(err);
}
