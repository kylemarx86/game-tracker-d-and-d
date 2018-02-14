const LocalStrategy = require('passport-local').Strategy;

// load the user model
const User = require('../app/models/users');

// expose thsi function to our app using module.exports
module.exports = function (passport) {
    // passport session setup 

    // required for persistent login sessions
    // passport needs ability to serialize and unserialze users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    // LOCAL SIGNUP
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true     // allows us to pass back the entire request to the callback
    },

    function(req, email, password, done) {
        // asynchronous
        // User.findOne won't fire unless data is sent back
        process.nextTick(function() {
            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            User.findOne({'local.email': email}, function(err, user) {
                // if there are any errors, return the error
                if(err){
                    return done(err);
                }

                // check to see if there's already a user with that email
                if(user){
                    return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                } else {
                    // if there is no user with that email
                    // create the user
                    var newUser = new User();

                    // set th euser's local credentials
                    newUser.local.email = email;
                    newUser.local.password = newUser.generateHash(password);

                    // save the user
                    newUser.save(function(err) {
                        if(err){
                            throw err;
                        }
                        return done(null, newUser);
                    });
                }

            });
        });
    }));        // end passport config for local signup

    // LOCAL LOGIN
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be call 'local'

    passport.use('local-login', new LocalStrategy({
        // by defaul, local strategy uses username and password, we will overrirde with email
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true // allows us to pass back the entire request ot the callback
    }, 
    function(req, email, password, done) {  // callback with email and password from our form
        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({'local.email': email}, function(err, user){
            // if there are any errors, return the error before anything else
            if(err)
                return done(err);

            // // combined user and password validation to prevent abuse
            // if(!user || !user.validPassword(password))
            //     return done(null, false, req.flash('loginMessage', 'User and password do not match.')); // req.flash is the way to set flashdata using connect-flash
            
            // TEMP WHILE TESTING
            // if no user is found, return the message
            if (!user)
                return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash

            // if the user is found but the password is wrong
            if (!user.validPassword(password))
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

            // all is well, return successful user
            return done(null, user);
        });
    }));        // end passport config for local login

};