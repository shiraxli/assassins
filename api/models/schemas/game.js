const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validator = require('email-validator');


// create game schemas
var gameSchema = new Schema({
    firstName: {type: String, trim: true},
    lastName: {type: String, trim: true},
    email: {type: String, trim: true},
    gameStatus: {type: String, trim: true},
    gameCode: {type: String, unique: true, trim: true},
    },
    {
    toObject:{getters: true},
    timestamps: {
        createdAt: 'createdDate',
        updatedAt: 'updatedDate'
    },
 });

gameSchema.pre('save', function(callback){
    if (!this.firstName)
        return callback(new Error('Missing first name'));
    if (!this.lastName)
        return callback(new Error('Missing last name'));
    if (!this.email)
        return callback(new Error('Missing email'));
    if (this.email && !validator(this.email))
        return callback(new Error('Invalid email'));
};

var Game = mongoose.model('Game', gameSchema);

module.exports = Game;

                       

