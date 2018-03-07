const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema({
    // new
    // email: {
    //     type: String,
    //     required: true,
    //     trim: true,
    //     minlength: 1,
    //     unique: true,
    //     validate: {
    //         validator: value => validator.isEmail(value),
    //         message: '{VALUE} is not a valid email'
    //     }
    // },
    // password: {
    //     type: String,
    //     require: true,
    //     minlength: 6
    // },
    // tokens: [{
    //     access: {
    //         type: String,
    //         required: true
    //     },
    //     token: {
    //         type: String,
    //         required: true
    //     }
    // }],
    // original
    local: {
        email: String,
        password: String
    },
    google: {
        id: String,
        token: String,
        email: String,
        name: String
    }
});

// methods
// generating a hash
userSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);