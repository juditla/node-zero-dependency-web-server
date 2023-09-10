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

// read content of directories recursively
function getFiles(dir, files = []) {
  const fileList = fs.readdirSync(dir);
  for (const file of fileList) {
    const name = `${dir}/${file}`;
    // Check if the current file/directory is a directory
    if (fs.statSync(name).isDirectory()) {
      // recursion
      getFiles(name, files);
      files.push('/' + file + '/');
    } else {
      // If it is a file, push the full path to the files array
      if (dir !== './Public/') {
        files.push(name.slice(9));
      } else {
        files.push('/' + file);
      }
    }
  }
  return files;
}

const filesInTheFolder = getFiles(folderPath);

// create server
const port = 3000;
const server = http.createServer(function (req, res) {
  console.log(req.rawHeaders);
  // go to index.html per default
  if (req.url === '/') {
    fs.readFile(folderPath + 'index.html', function (error, content) {
      if (error) {
        console.log(error);
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(content);
        res.end();
      }
    });
    // check if file exists in Public directory
  } else if (filesInTheFolder.includes(req.url)) {
    // check if file is a directory, if yes - check if in this directory is a index file
    if (req.url.endsWith('/')) {
      let fileToUse;
      if (filesInTheFolder.includes(req.url + 'index.html')) {
        fileToUse = req.url.slice(1) + 'index.html';
      } else if (filesInTheFolder.includes(req.url + 'index.htm')) {
        fileToUse = req.url.slice(1) + 'index.htm';
      }
      if (fileToUse) {
        fs.readFile(folderPath + fileToUse, function (error, content) {
          if (error) {
            console.log(error);
          } else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(content);
            res.end();
          }
        });
      }
      // use matching file from the Public directory
    } else {
      fs.readFile(folderPath + req.url.slice(1), function (error, content) {
        if (error) {
          console.log(error);
        } else {
          // const contentType = req.getHeader('content-type');
          res.write(content);
          res.end();
        }
      });
    }
    // send 404 error if the file doesn't exist
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.write('Error 404 - file not found!');
    res.end();
  }
});

server.listen(port);
