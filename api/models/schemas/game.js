const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');
const validator = require('email-validator');

// child schema
var Player = new Schema({
        firstName: {type: String, trim: true, required: true},
        lastName: {type: String, trim: true, required: true},
        email: {type: String, required: true, index: true},
        password: {type: String, required: true},
        target: {
            victim: Schema.ObjectId,
            timeAssigned: Date,
            timeKilled: Date
        },
        killedBy: Schema.ObjectId,
        deathApproved: {type: Boolean, default: false},
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

// parent schema
// game status: 0 sign-up, 1 active, 2 done
var gameSchema = new Schema({
    email: {type: String, trim: true, required: true, index: true},
    password: {type: String, trim: true, required: true},
    gameStatus: {type: Number, trim: true, default: 0},
    gameCode: {type: String, required: true, unique: true, trim: true, index: true},
    startDate: Date,
    gameName: String,
    rules: [String],
    livingPlayers: [Player],
    killedPlayers: [Player],
    token: String
    },
    {
    toObject:{getters: true},
    timestamps: {
        createdAt: 'createdDate',
        updatedAt: 'updatedDate'
    },
 });

gameSchema.pre('save', function(callback){
    if (!this.email)
        return callback(new Error('Missing email'));
    if (this.email && !validator(this.email))
        return callback(new Error('Invalid email'));
    if (!this.password)
        return callback(new Error('Missing password'));
    if (this.isModified('password'))
        this.hash = bcrypt.hashSync(this.password);

    callback();
};

gameSchema.methods.comparePassword = function(pw, callback) {
    bcrypt.compare(pw, this.password, (err, isMatch) => {
        if(err) return callback(err);
        callback(null, isMatch);
    });
};

Player.methods.comparePlayerPassword = function(pw, callback) {
    bcrypt.compare(pw, this.password, (err, isMatch) => {
        if (err) return callback(err);
        callback(null, isMatch);
    });
};

var Game = mongoose.model('Game', gameSchema);

module.exports = Game;
