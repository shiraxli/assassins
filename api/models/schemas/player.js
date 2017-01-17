const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');
const validator = require('email-validator');

var playerSchema = new Schema({
        firstName: {type: String, trim: true, required: true},
        lastName: {type: String, trim: true, required: true},
        email: {type: String, required: true},
        hash: {type: String, required: true},
        gameCode: {type: String, required: true},
        target: [{Target: {target: Schema.ObjectId, timeAssigned: Date, timeKilled: Date}}],
        isLiving: Boolean
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

playerSchema.pre('save', function(callback){
    if (!this.email && !validator.validate(this.email))
        return callback(new Error('No Email'));
    if(!this.hash)
        return callback(new Error('No Password'));
    if(!this.game)
        return callback(new Error('Not Registered For a Game'));
    
    callback();
});

playerSchema.methods.comparePassword = function(pw, callback) {
    bcrypt.compare(pw, this.hash, (err, isMatch) => {
        if(err) return callback(err);
        callback(null, isMatch);
    })
};

var Player = mongoose.model('Player', playerSchema);

module.exports = Player;





