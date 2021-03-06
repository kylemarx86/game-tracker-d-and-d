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

    socket.on('joinLobby', (callback) => {
        socket.join('lobby');
        socket.game = 'lobby';
        
        // emit rooms to user in lobby
        socket.emit('updateRoomsList', JSON.stringify(games));
        callback();
    });

    socket.on('joinGame', (params, callback) => {
        // add authentication here
        
        // leave previous game sockets (or lobby)
        if(socket.game){
            socket.leave(socket.game);
            var game = games.removeUserFromGame(socket.game);
        }
        
        socket.join(params.game);
        socket.game = params.game;

        users.removeUser(socket.id);
        users.addUser(socket.id, params.name, params.game, params.role);
        console.log('user added');

        io.to(params.room).emit('updateUserList', users.getUserList(params.room));

        games.addUserToGame(params.game);
        
        socket.broadcast.to(params.game).emit('welcome', {name: params.name, role: params.role});
        console.log(`user entered ${params.game}`);
        callback();
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
        var user = users.removeUser(socket.id);

        if(user) {
            var game = games.removeUserFromGame(user.game);
            
            io.to('lobby').emit('updateRoomsList', JSON.stringify(games));

            io.to(user.game).emit('updateUserList', users.getUserList(user.game));
            // io.to(user.game).emit('newMessage', generateMessage('Admin', `${user.name} has left.`));
            console.log(`user left ${user.game}`);
        }
    });
});


server.listen(port, () => {
    console.log(`Started on port ${port}`);
});