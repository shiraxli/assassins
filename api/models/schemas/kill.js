const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var killSchema = new Schemas({
        _id: true,
        gameCode: {type: String, trim: true, unique: true, required: true},
        killer: {type: String, trim: true, required: true},
        killed: {type: String, trim: true, required: true},
        approved: Boolean
    },
    {
        toObject: {getters: true},
        timeStamps: {
            createdAt: 'createdDate',
            updatedAt: 'updatedDate'
        },
    }    
});

killSchema.pre('save', function(callback) {
    if (!this.killer)
        return callback(new Error('No Killer'));
    if (!this.killed)
        return callback(new Error('No Person Killed'));
    if (!this.gameCode)
        return callback(new Error('No Game Code'));
    
    callback();
});

var Kill = mongoose.model('Kill', killSchema);

module.exports = Kill;
