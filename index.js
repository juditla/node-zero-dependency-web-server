import fs from 'node:fs';
import http from 'node:http';

// check if public directory exists
const folderPath = './Public/';
try {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
  }
} catch (err) {
  console.error(err);
}

let fileList = [];
const files = fs.readdirSync(folderPath);

const directoryFiles = files.filter((file) =>
  fs.statSync(folderPath + file).isDirectory(),
);
directoryFiles.forEach((file) => {
  fileList = files.concat(fs.readdirSync(folderPath + file));
  console.log(fs.readdirSync(folderPath + file));
});

console.log(directoryFiles);
console.log(files);
console.log(fileList);

// files.forEach(function (file) {
//   if (fs.statSync(folderPath + file).isDirectory()) {
//     fs.readdirSync(folderPath + file, (fileInDirectory) =>
//       fileList.push(fileInDirectory),
//     );
//   }

//   fileList.push(file);
// });

// create server
const port = 3000;
const server = http.createServer(function (req, res) {
  console.log(req.url);
  console.log(req.url.slice(1));

  if (fileList.includes(req.url.slice(1))) {
    fs.readFile(folderPath + req.url.slice(1), function (error, content) {
      if (error) {
        console.log(error);
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(content);
        res.end();
      }
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.write('Error 404 - file not found!');
    res.end();
  }
});

// if (fileList.includes(req.url.slice(1))) {
//   console.log(req.url);
// } else {
//   console.log('404');
// }
// });

server.listen(port);
