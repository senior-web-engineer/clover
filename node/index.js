require('colors');

console.log(`${'Honeyside'.yellow} © ${'2020'.yellow}`);
console.log(`Welcome to ${'Clover'.cyan}`);

const express = require('express');
const app = express();
const http = require('http');
const io = require('socket.io');
const store = require('./src/store');
const init = require('./src/init');
const mediasoup = require('./src/mediasoup');

Config = {...require('./src/defaults'), ...require('./config')};
if (Config.ip) Config.mediasoup.webRtcTransport.listenIps[0].ip = Config.ip;

app.use((req, res, next) => store.connected ? next() : res.status(500).send('Database not available.'));

app.use(express.static(`${__dirname}/../react/build`));
app.use('/login', express.static(`${__dirname}/../react/build`));
app.use('/login/*', express.static(`${__dirname}/../react/build`));
app.use('/admin', express.static(`${__dirname}/../react/build`));
app.use('/room/*', express.static(`${__dirname}/../react/build`));
app.use('/meeting/*', express.static(`${__dirname}/../react/build`));

const server = http.createServer(app);
store.app = app;
store.config = Config;
store.io = io(server);
init();
mediasoup.init();

const listen = () => server.listen(Config.port, () => console.log(`Server listening on port ${Config.port}`.green));

server.on('error', (e) => {
    if (e.code === 'EADDRINUSE') {
        console.log('Specified port unavailable, retrying in 10 seconds...'.red);
        setTimeout(() => {
            server.close();
            server.listen(Config.port);
        }, Config.retryAfter);
    }
});

listen();
