'use strict';
require('./config/config');

const path = require('path');
const http = require('http');
const fs = require('fs');

const express = require('express');

const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const _ = require('lodash');

// const socketIO = require('socket.io');

// const hbs = require('hbs');
const hbs = require('express-handlebars');


// LOCAL
var {mongoose} = require('./db/mongoose');
var {User} = require('./models/user');

const publicPath = path.join(__dirname, '..', 'public');
const viewsPath = path.join(__dirname, '..', 'views');
const port = process.env.PORT || 3000;
var app = express();

var server = http.createServer(app); 

// ******************* MIDDLEWARE **********************************

// VIEW ENGINE SETUP
app.engine('hbs', hbs({
    extname: 'hbs',
    layoutsDir: viewsPath,
    partialsDir: viewsPath + '/partials/'
}));
app.set('views', viewsPath);        // not sure if necessary
app.set('view engine', 'hbs');
app.use( bodyParser.json() );                               // to support JSON-encoded bodies
app.use( bodyParser.urlencoded( {extended: true} ));         // to support URL-encoded bodies
// example has exressValidator() middleware here
app.use(cookieParser());

app.use(express.static(publicPath));

/// SESSION STUFF
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

// This middleware will check if user's cookie is still saved in browser and user is not set, then automatically log the user out.
// This usually happens when you stop your express server after login, your cookie still remains saved in the browser.
app.use((req, res, next) => {
    if (req.cookies.user_sid && !req.session.user) {
        res.clearCookie('user_sid');        
    }
    next();
});

// middleware function to check for logged-in users
var sessionChecker = (req, res, next) => {
    if (req.session.user && req.cookies.user_sid) {
        res.redirect('/dashboard');
    } else {
        next();
    }
};

// ****************** ROUTES **********************************
// SIGNUP ROUTES
app.route('/signup')
    .get(sessionChecker, (req, res) => {
        res.render('login', {seccess: req.session.success, errors: req.session.errors });
    })
    .post((req, res) => {
        var body = _.pick(req.body, ['email', 'password']);
        var user = new User(body);

        user.save().then(user => {
            req.session.user = user;
            res.redirect('/dashboard');
        }).catch((err) => {
            // try to send error along
            // send error code
            res.redirect('/signup');
            // res.status(400).send(err);
        });
    });

    
app.get('/', sessionChecker, (req, res) => {
    res.render('login', {seccess: req.session.success, errors: req.session.errors });
    req.session.errors = null;
});

// LOGIN ROUTES
app.route('/login')
    .get(sessionChecker, (req, res) => {
        res.render('login', {seccess: req.session.success, errors: req.session.errors });
    })
    .post((req, res) => {
        var body = _.pick(req.body, ['email', 'password']);
    
        User.findByCredentials(body.email, body.password).then((user) => {

            if(!user){
                res.redirect('/');
            }else{
                req.session.user = user;
                res.redirect('/dashboard');
            }
        }).catch((e) => {
            res.redirect('/');
        });
    });


// DASHBOARD ROUTE
app.get('/dashboard', (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
        res.render('game_select');
    } else {
        res.redirect('/');
    }
});

// GAME ROUTES
// app.get('/create_game', (req, res) => {
//     if(req.session.user && req.cookies.user_sid) {
//         res.render(path.join(viewsPath, 'game.hbs'));
//     } else {
//         res.redirect('/');
//     }
// });
app.route('/create_game')
    .post((req, res) => {
        if(req.session.user && req.cookies.user_sid) {
            res.render('game');
        } else {
            res.redirect('/');
        }
    });
app.get('/join_game', (req, res) => {
    if(req.session.user && req.cookies.user_sid) {
        res.render('game');
    } else {
        res.redirect('/');
    }
})

// LOGOUT ROUTE
app.get('/logout', (req, res) => {
    if(req.session.user && req.cookies.user_sid){
        res.clearCookie('user_sid');
        res.redirect('/');
    } else {
        res.redirect('/');
    }
});




// POST
// app.post('/game_selection', (req, res) => {
//     var name = req.body.name;
//     var password = req.body.password;

//     res.render('game_select.hbs');
// });

// app.post('/sign_up', (req, res) => {
//     res.render('sign_up.hbs');
// });






// SOCKETS STUFF
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


server.listen(port, () => {
    console.log(`Started on port ${port}`);
});