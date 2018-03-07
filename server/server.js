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