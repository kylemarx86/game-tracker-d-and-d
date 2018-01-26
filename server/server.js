'use strict';

const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();

var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log('new user connected');

    socket.on('sendData', (data) => {
        // add authentication here

        var destination;
        if(data.userType === 'gameMaster'){
            destination = '/gameMaster.html';
        }else{
            destination = '/player.html';
        }

        socket.emit('redirect', destination);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
        // remove user from game
    });
});




server.listen(port, () => {
    console.log(`Started on port ${port}`);
});