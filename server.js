const http = require('http');
const fs = require('fs');
const path = require('path');
const ejs = require('ejs');
const { PeerServer } = require('peer');
PeerServer({ port: 2132, path: '/' });
const { workerData } = require('worker_threads');

http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(ejs.render(fs.readFileSync(path.join(__dirname, 'src', 'url.ejs'), 'utf-8'), { ip: workerData.ip }));
}).listen(9302);