const schemas = require('../models/schemas/game');
const Game = schemas[0];
const Player = schemas[1];

// TODO: find using subdocuments
exports.findPlayerById = (gameCode, id, callback) => {
    Game.findOne({ gameCode: gameCode }, (err, game) => {
        if (err) return callback(err);
        if (!game) {
            var e = new Error('No game with that game code');
            e.status = 404;
            return callback(e);
        };
        for (var i = 0; i < game.allPlayers.length; i++) {
            if (String(game.allPlayers[i]._id) === id) {
                var player = game.allPlayers[i];
            }
        };
        if (!player) {
            callback();
        } else {
            callback(null, player, game);
        }
    });
};

exports.findPlayerByEmail = (gameCode, email, callback) => {
    Game.findOne({ gameCode: gameCode }, (err, game) => {
        if (err) return callback(err);
        if (!game) {
            var e = new Error('No game with that game code');
            e.status = 404;
            return callback(e);
        };
        for (var i = 0; i < game.allPlayers.length; i++) {
            if (String(game.allPlayers[i].email) === email)
                return callback(null, game.allPlayers[i], game);
        };
        callback(null);
    });
};
