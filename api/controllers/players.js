const schemas = require('../models/schemas/game');
const Game = schemas[0];
const Player = schemas[1];
const bcrypt = require('bcrypt-nodejs');

exports.createPlayer = (req, res, next) => {

    if (typeof req.body.firstName !== 'string')
        return res.status(400).send('No first name');
    if (typeof req.body.lastName !== 'string')
        return res.status(400).send('No last name');
    if (typeof req.body.email !== 'string')
        return res.status(400).send('No email');
    if (typeof req.body.password !== 'string')
        return res.status(400).send('No password');

    var playerData = {};
    playerData.firstName = req.body.firstName;
    playerData.lastName = req.body.lastName;

    // validate email
    // http://emailregex.com
    if (req.body.email) {
        if (!(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(req.body.email)))
            return res.status(400).send('Invalid email');
        else
            playerData.email = req.body.email;
    };

    playerData.password = bcrypt.hashSync(req.body.password);

    Game.findOne({ gameCode: req.params.gameCode }).exec().then(function (game) {
        if (!game) return res.status(404).send('No game with that game code');
        game.livingPlayers.push(playerData);
        game.markModified('livingPlayers');
        return game.save();
    }).then(function (game) {
        return res.sendStatus(200);
    }).catch(function (err) { return next(err); });
};

exports.getAllPlayers = (req, res, next) => {
    Game.findOne({ gameCode: req.params.gameCode }, (err, game) => {
        if (err) return next(err);
        if (!game) return res.status(400).send('No game with that game code');
        var gameQuery = {};
        if (req.query.living === 'true')
            return res.json(game.livingPlayers);
        if (req.query.living === 'false')
            return res.json(game.killedPlayers);
        return res.json(game.allPlayers);
    });
};



exports.getPlayerById = (req, res, next) => {
    Game.findOne({ gameCode: req.params.gameCode }, (err, game) => {
        if (err) return next(err);
        if (!game) return res.status(404).send('No game with that game code');
        for (var i = 0; i < game.allPlayers.length; i++) {
            if (String(game.allPlayers[i]._id) === req.params.id)
                return res.json(game.allPlayers[i]);
        }
        return res.status(404).send('No player with that id');
    });
};


// TO DO

exports.updatePlayerById = (req, res, next) => {
    Player.findByIdAndUpdate(req.params.id, req.body, {new: true}, (err, user) => {
        if (err) return next(err);
        if (!user) return res.status(404).send('No user with that ID');
        return res.json(user);
    });
};

exports.deletePlayerById = (req, res, next) => {
    Player.findByIdAndRemove(req.params.id, (err, user) => {
        if (err) return next(err);
        if (!user) return res.status(404).send('No user with that ID');
        return res.sendStatus(200);
    });
};
