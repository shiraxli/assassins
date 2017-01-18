const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');
const validator = require('email-validator');

// child schema
var playerSchema = new Schema({
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
});

playerSchema.virtual('fullName').get(function() {
    return this.firstName + ' ' + this.lastName;
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
    livingPlayers: [playerSchema],
    killedPlayers: [playerSchema],
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
    if (this.email && !validator.validate(this.email))
        return callback(new Error('Invalid email'));
    if (!this.password)
        return callback(new Error('Missing password'));
    if (this.isModified('password'))
        this.password = bcrypt.hashSync(this.password);

    callback();
});

gameSchema.methods.comparePassword = function(pw, callback) {
    bcrypt.compare(pw, this.password, (err, isMatch) => {
        if(err) return callback(err);
        callback(null, isMatch);
    });
};

playerSchema.methods.comparePlayerPassword = function(pw, callback) {
    bcrypt.compare(pw, this.password, (err, isMatch) => {
        if (err) return callback(err);
        callback(null, isMatch);
    });
};

gameSchema.virtual('allPlayers').get(function() {
    var allPlayers = this.livingPlayers;
    if (this.killedPlayers.length !== 0) allPlayers.concat(this.killedPlayers);
    return allPlayers;
});

var schemas = [
    mongoose.model('Game', gameSchema),
    mongoose.model('Player', playerSchema)
]

module.exports = schemas;



// examples for testing in postman

// game example 

/*
{
    "email": "hjames@alpinedistrict.org",
    "password": "hjames",
    "gameCode": "LH2017",
    "gameName": "Lowell House 2017",
}
*/

// players examples

/*

{
    "firstName": "Dong",
    "lastName": "Hur",
    "email": "dong@gmail.com",
    "password": "dong"
}

{
    "firstName": "Jason",
    "lastName": "Thong",
    "email": "jason@gmail.com",
    "password": "jason"
}

{
    "firstName": "Hailey",
    "lastName": "James",
    "email": "hailey@gmail.com",
    "password": "hailey"
}

{
    "firstName": "Shira",
    "lastName": "Li",
    "email": "shira@gmail.com",
    "password": "shira"
}

{
    "firstName": "Tiff",
    "lastName": "Yu",
    "email": "tiff@gmail.com",
    "password": "tiff"
}

*/
