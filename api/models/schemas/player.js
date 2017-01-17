/*
we don't use this file anymore, but I guess it'll be pushed anyway cause I'm too lazy to figure out git
*/

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');
const validator = require('email-validator');

var playerSchema = new Schema({
        firstName: {type: String, trim: true, required: true},
        lastName: {type: String, trim: true, required: true},
        email: {type: String, required: true},
        password: {type: String, required: true},
        target: [{Target: {target: Schema.ObjectId, timeAssigned: Date, timeKilled: Date}}],
        isLiving: Boolean,
        token: String
    },
    {
        toObject: {getters: true},
        timeStamps: {
            createdAt: 'createdDate',
            updatedAt: 'updatedDate'
        },
    }

});

playerSchema.methods.comparePassword = function(pw, callback) {
    bcrypt.compare(pw, this.password, (err, isMatch) => {
        if(err) return callback(err);
        callback(null, isMatch);
    })
};

module.exports = playerSchema;
