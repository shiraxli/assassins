const schemas = require('../models/schemas/game');
const Game = schemas[0];
const Player = schemas[1];
const helper = require('./helpers');
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

    var newPlayer = new Player(playerData);
    Game.findOne({ gameCode: req.params.gameCode }).exec().then(function (game) {
        if (!game) return res.status(404).send('No game with that game code');
        game.livingPlayers.push(newPlayer);
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
    helper.findPlayerById(req.params.gameCode, req.params.id, (err, player, game) => {
        if (err) return next(err);
        if (!player) return res.status(404).send('No player with that id');
        return res.json(player);
    });
};


// TO DO

exports.updatePlayerById = (req, res, next) => {
    helper.findPlayerById(req.params.gameCode, req.params.id, (err, player, game) => {
        if (err) return next(err);
        if (!player) return res.status(404).send('No user with that ID');

        if (req.body.firstName) player.firstName = req.body.firstName;
        if (req.body.lastName) player.lastName = req.body.lastName;
        // validate email
        // http://emailregex.com
        if (req.body.email) {
            if (!(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(req.body.email)))
                return res.status(400).send('Invalid email');
            else
                player.email = req.body.email;
        };
        if (req.body.password) player.password = bcrypt.hashSync(req.body.password);

        game.save((err) => {
            if (err) return next(err);
            return res.json(player);
        });
    });
};

exports.deletePlayerById = (req, res, next) => {
    Game.findOne({ gameCode: req.params.gameCode }).exec().then(function(game) {
        if (!game) return res.status(404).send('No game with that game code');
        var found = false;
        for (var i = 0; i < game.livingPlayers.length; i++) {
            if (String(game.livingPlayers[i]._id) === req.params.id) {
                found = true;
                game.livingPlayers.splice(i, 1);
                game.markModified('livingPlayers');
            }
        }
        for (var i = 0; i < game.killedPlayers.length; i++) {
            if (String(game.killedPlayers[i]._id) === req.params.id) {
                found = true;
                game.killedPlayers.splice(i, 1);
                game.markModified('killedPlayers');
            }
        }
        if (!found) return res.status(404).send('No user with that id');
        return game.save();
    }).then(function (player) {
        return res.sendStatus(200);
    }).catch(next);
};

// 
exports.submitKill = (req, res, next)  => {
    helper.findPlayerById(req.params.gameCode, req.params.id, (err, player, game) => {
        if (err) return next(err);
        if (!player) return res.status(404).send('No player with that id');
        newKill = player.target.victim;
        newKill.killedBy.killer = player;
        newKill.killedBy.killTime = player.target.timeKilled = getTime(); 
        return res.sendStatus(200);
    });
};

exports.approveKill = (req, res, next) => {
    helper.findPlayerById(req.params.gameCode, req.params.id, (err, player, game) => {
        if (err) return next(err);
        if (!player) return res.status(404).send('No player with that id');

        // TODO : check time or unapprove kill?

        deadVictim = player.target.victim;
        player.target.victim = deadVictim.target;
        player.target.timeAssigned = getTime();
        player.target.timeKilled = null;
        var found = false;
        for (var i = 0; i < game.livingPlayers.length; i++) {
            if (!found && String(game.livingPlayers[i]._id) === deadVictim.id) {
                found = true;
                game.livingPlayers.splice(i, 1);
                game.markModified('livingPlayers');
            }
        }
        if(found) {
            game.killedPlayers.push(deadVictim);
            game.markModified('killedPlayers');
        }
        else
            return res.status(404).send('No user with that id');
    });
};
};
