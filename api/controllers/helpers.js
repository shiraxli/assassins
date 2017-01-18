const schemas = require('../models/schemas/game');
const Game = schemas[0];
const Player = schemas[1];

exports.findPlayerById = (gameCode, id, callback) => {
    Game.findOne({ gameCode: gameCode }, (err, game) => {
        if (err) return callback(err, null);
        if (!game) {
            var e = new Error('No game with that game code');
            e.status = 404;
            return callback(e, null);
        };
        for (var i = 0; i < game.allPlayers.length; i++) {
            if (String(game.allPlayers[i]._id) === id)
                return callback(null, game.allPlayers[i]);
        };
        return callback(null, null);
    });
};
