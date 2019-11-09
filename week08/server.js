const http = require("http");
const fs = require("fs");
const mime = require("mime-types");

const settings = {
  pages: {
    default: "index.html",
    error: [{ code: 404, file: "404.html" }, { code: 503, file: "503.html" }]
  },
  debug: true,
  routes: [
    {
      url: "/home",
      file: "index.html"
    },
    {
      url: "/home/index.html",
      file: "index.html"
    },
    { url: "/getData", file: "data.json" }
  ],
  root: "./"
};

isFile = url => {
  const res = url instanceof Object ? "" : url.match(/\.[\S]+$/g);
  if (settings.debug) {
    console.log(`isFile('${url}') = ${res}`);
  }

  return res;
};

class MyError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
  }
}

getFileName = url => {
  if (settings.debug) {
    console.log(`getFileName('${url}')`);
  }

  const fileMap = settings.routes.find(e => e.url === url);

  if (settings.debug) {
    console.log(`getFileName('${url}') => fileMap: ${fileMap}`);
  }

  if (!fileMap) {
    if (isFile(url)) {
      return url;
    }
    throw new MyError(404, "This is not a valid URL.");
  }

  if (settings.debug) {
    console.log(`getFileName('${url}') = ${fileMap.file}`);
  }

  return fileMap.file;
};

readFile = url => {
  const fileName = getFileName(url);
  if (!fs.existsSync(fileName)) {
    if (settings.debug) {
      console.log(`File ${fileName} doesn't exist.`);
    }
    throw new MyError(404, "This is not a valid URL.");
  }
  const type = mime.lookup(fileName);
  const buffer = fs.readFileSync(fileName);
  return { mime: type, data: buffer };
};

onRequest = (req, res) => {
  try {
    const file = readFile(req.url);
    res.writeHead(200, { "Content-Type": file.mime });
    res.write(file.data.toString());
  } catch (err) {
    if (err instanceof MyError) {
      const file = readFile(
        settings.pages.error.find(e => e.code === err.code).file
      );
      res.writeHead(err.code, { "Content-Type": file.mime });
      res.write(file.data.toString());
    } else {
      res.writeHead(500);
      res.write(err.toString());
    }
  } finally {
    res.end();
  }
};

http.createServer(onRequest).listen(8888);
