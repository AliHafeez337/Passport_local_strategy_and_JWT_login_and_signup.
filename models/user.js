
const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

mongoose.connect('mongodb://localhost/passportLocal', 
{
    useNewUrlParser: true, 
    useUnifiedTopology: true, 
    useCreateIndex: true,  
    useFindAndModify: false,
    useUnifiedTopology: true
});

const Schema = mongoose.Schema;
var UserDetail = new Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        unique: true,
        validate: {
          validator: validator.isEmail,
          message: '{VALUE} is not a valid email'
        }
    },
    password: {
        type: String,
        require: true,
        minlength: 6
    }
});

UserDetail.methods.toJSON = function () {
    var user = this;
    var userObject = user.toObject();
  
    return _.pick(userObject, 
      ['_id', 
      'email'
    ]);
};

UserDetail.statics.findByCredentials = function (email, password) {
    var User = this; //it is just a reservation of a variable, that a user would be this from a group of all the users
  
    return User.findOne({email}).then((user) => {
      if (!user) {
        return Promise.reject('User not found');
      }
      console.log(user)
      console.log(password)
      return new Promise((resolve, reject) => {
        // Use bcrypt.compare to compare password and user.password
        bcrypt.compare(password, user.password, (err, res) => {
            console.log(res)
          if (res) {
            resolve(user);
          } else {
            reject();
          }
        });
      });
    });
};

UserDetail.pre('save', function (next) {
    var user = this;
    console.log('called');
    if (user.isModified('password')) {
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(user.password, salt, (err, hash) => {
          user.password = hash;
        //   console.log(user);
          next();
        });
      });
    } else {
      next();
    }
});

const UserDetails = mongoose.model('userInfo', UserDetail, 'userInfo');

module.exports = {UserDetails}