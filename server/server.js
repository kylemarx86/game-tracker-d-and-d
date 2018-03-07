'use strict';
require('./config/config');

const path = require('path');
const http = require('http');
const fs = require('fs');

const express = require('express');
const session = require('express-session');

// const socketIO = require('socket.io');
const bodyParser = require('body-parser');
const hbs = require('hbs');

// LOCAL
var {mongoose} = require('./db/mongoose');
var {User} = require('./models/user');

const publicPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../views');
const port = process.env.PORT || 3000;
var app = express();

var server = http.createServer(app); 

// MIDDLEWARE
app.use(express.static(publicPath));

// figure out which i actually need
app.use( bodyParser.json() );                               // to support JSON-encoded bodies
app.use(bodyParser.urlencoded( {extended: true} ));         // to support URL-encoded bodies
// hbs.registerPartials(__dirname + './../views/partials');
hbs.registerPartials(path.join(__dirname, './../views/partials'));
app.set('view engine', 'hbs');


// POST
// app.post('/game_selection', (req, res) => {
//     var name = req.body.name;
//     var password = req.body.password;

//     res.render('game_select.hbs');
// });

// app.post('/sign_up', (req, res) => {
//     res.render('sign_up.hbs');
// });

// SOCKETS
// io.on('connection', (socket) => {
//     console.log('new user connected');

//     app.post('/game', (req, res) => {
//         var game = req.body.game;
//         var role = req.body.role;
        
//         // make request to items.json
//         fs.readFile(__dirname + './../public/data/items-base.json','utf8', (err, items) => {
//             if(err) throw err;
            
//             var items = JSON.parse(items).data;
//             var data = {game, role, items};
//             if(role === 'gameMaster') {
//                 res.render('game_master.hbs', {data});
//             } else if(role === 'player') {
//                 res.render('game_player.hbs', {data});
//             } else {
//                 // bad info, handle somehow
//                 res.send('bad info');
//             }
//         });
//         // app.set('x-name', name);
//         // app.set('x-game', game);
//         // app.set('x-role', role);
//     });

//     socket.on('joinLobby', (callback) => {
//         socket.join('lobby');
//         socket.game = 'lobby';
        
//         // emit rooms to user in lobby
//         socket.emit('updateGamesList', JSON.stringify(games));
//         callback();
//     });

//     socket.on('joinGame', (params, callback) => {
//         // add authentication here
        
//         // leave previous game sockets (or lobby)
//         // will this still exist????
//         if(socket.game){
//             socket.leave(socket.game);
//             var game = games.removeUserFromGame(socket.game);
//         }
        
//         socket.join(params.game);
//         socket.game = params.game;
//     });
// });


/// SESSION STUFFS

// initialize express-session to allow us track the logged-in user across sessions.
app.use(session({
    key: 'user_sid',
    secret: 'somerandonstuffs',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000
    }
}));

server.listen(port, () => {
    console.log(`Started on port ${port}`);
});