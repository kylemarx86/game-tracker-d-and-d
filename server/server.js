'use strict';

const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const bodyParser = require('body-parser');
// const request = require('request');

const {Users} = require('./utils/users');
const {Games} = require('./utils/games');


const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();

var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();
var games = new Games();

// MIDDLEWARE
app.use(express.static(publicPath));


io.on('connection', (socket) => {
    console.log('new user connected');

    socket.on('submitForm', (params, callback) => {
        // add authentication here

        socket.join(params.game);

        users.removeUser(socket.id);
        users.addUser(socket.id, params.name, params.game, params.role);

        games.addUserToGame(params.game);

        // inform users of entrance of new user
        // io.to(params.game).emit('addUserToGame', params.name);

        var destination;
        if(params.role === 'gameMaster') {
            destination = '/gameMaster.html';
        } else {
            destination = '/player.html';
        }

        // make request to post /game

        console.log('user added');
        console.log('users', users.users);
        console.log('games', games.games);
        // pass other info along as well, the game info
        socket.emit('redirect', destination);

        // app.
        // console.log('all rooms', io.sockets.adapter.rooms);

        callback();
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
        var user = users.removeUser(socket.id);

        if(user) {
            var game = games.removeUserFromGame(user.room);
            console.log('users', users.users);
            console.log('games', games.games);
        }


        // remove user from game
    });
});


server.listen(port, () => {
    console.log(`Started on port ${port}`);
});