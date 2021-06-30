const api = require('./api');
const http = require('http');

const server = http.createServer(api);

const sockets = require('./sockets');
const io = require('socket.io')(server, {
    cors: {
        origin: "*",
        methods: ["GET","POST"]
    }
});

const PORT = 3000;

server.listen(PORT);
console.log(`Listening on port ${PORT}...`);

sockets.listen(io);