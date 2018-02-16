'use strict';

const path = require('path');
const http = require('http');
const fs = require('fs');

const express = require('express');
const socketIO = require('socket.io');
const bodyParser = require('body-parser');
const hbs = require('hbs');

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

// figure out which i actually need
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
hbs.registerPartials(__dirname + './../views/partials');
app.set('view engine', 'hbs');


app.post('/game_selection', (req, res) => {
    var name = req.body.name;
    var password = req.body.password;

    res.render('game_select.hbs');
});

app.post('/sign_up', (req, res) => {
    res.render('sign_up.hbs');
});


io.on('connection', (socket) => {
    console.log('new user connected');

    app.post('/game', (req, res) => {
        var game = req.body.game;
        var role = req.body.role;
        
        // make request to items.json
        fs.readFile(__dirname + './../public/data/items-base.json','utf8', (err, items) => {
            if(err) throw err;
            
            var items = JSON.parse(items).data;
            var data = {game, role, items};
            if(role === 'gameMaster') {
                res.render('game_master.hbs', {data});
            } else if(role === 'player') {
                res.render('game_player.hbs', {data});
            } else {
                // bad info, handle somehow
                res.send('bad info');
            }
        });
        // app.set('x-name', name);
        // app.set('x-game', game);
        // app.set('x-role', role);
    });

    socket.on('joinLobby', (callback) => {
        socket.join('lobby');
        socket.game = 'lobby';
        
        // emit rooms to user in lobby
        socket.emit('updateGamesList', JSON.stringify(games));
        callback();
    });

    socket.on('joinGame', (params, callback) => {
        // add authentication here
        
        // leave previous game sockets (or lobby)
        // will this still exist????
        if(socket.game){
            socket.leave(socket.game);
            var game = games.removeUserFromGame(socket.game);
        }
        
        socket.join(params.game);
        socket.game = params.game;

        users.removeUser(socket.id);
        users.addUser(socket.id, params.name, params.game, params.role);
        console.log('user added');

        
        games.addUserToGame(params.game);

        // first thing not used yet
        io.to(params.game).emit('updateUserList', users.getUserList(params.game));
        io.to('lobby').emit('updateGamesList', JSON.stringify(games));
        console.log('rooms/games: ', socket.adapter.rooms);
        
        socket.broadcast.to(params.game).emit('welcome', {name: params.name, role: params.role});
        console.log(`user entered ${params.game}`);
        callback();
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
        var user = users.removeUser(socket.id);

        if(user) {
            var game = games.removeUserFromGame(user.game);
            
            io.to('lobby').emit('updateGamesList', JSON.stringify(games));

            io.to(user.game).emit('updateUserList', users.getUserList(user.game));
            // io.to(user.game).emit('newMessage', generateMessage('Admin', `${user.name} has left.`));
            console.log(`user left ${user.game}`);
        }
    });
});


server.listen(port, () => {
    console.log(`Started on port ${port}`);
});