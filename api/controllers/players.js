const schemas = require('../models/schemas/game');
const Game = schemas[0];
const Player = schemas[1];
const helper = require('./helpers');
const bcrypt = require('bcrypt-nodejs');
const sender = require('./sender');

exports.createPlayer = (req, res, next) => {

    if (typeof req.body.firstName !== 'string')
        return res.status(400).send('No first name');
    if (typeof req.body.lastName !== 'string')
        return res.status(400).send('No last name');
    if (typeof req.body.email !== 'string')
        return res.status(400).send('No email');
    if (typeof req.body.password !== 'string')
        return res.status(400).send('No password');
    // check that the user was not created before
    var playerData = {};
    playerData.firstName = req.body.firstName;
    playerData.lastName = req.body.lastName;

    // validate email
    // http://emailregex.com
    if (!(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(req.body.email)))
        return res.status(400).send('Invalid email');
    else
        playerData.email = req.body.email;

    playerData.password = bcrypt.hashSync(req.body.password);

    var newPlayer = new Player(playerData);
    Game.findOne({ gameCode: req.params.gameCode }, (err, game) => {
        if (err) return next(err);
        if (!game) return res.status(404).send('No game with that game code');
        game.livingPlayers.push(newPlayer);
        game.markModified('livingPlayers');
        game.save((err) => {
            if (err) return next(err);
            next();
        });
    });
};

exports.getAllPlayers = (req, res, next) => {
    Game.findOne({ gameCode: req.params.gameCode }, (err, game) => {
        if (err) return next(err);
        if (!game) return res.status(404).send('No game with that game code');
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
            return res.sendStatus(200);
        });
    });
};

exports.deletePlayerById = (req, res, next) => {
    Game.findOne({ gameCode: req.params.gameCode }, (err, game) => {
        if (err) return next(err);
        if (!game) return res.status(404).send('No game with that game code');
        var player = game.allPlayers.id(req.params.id).remove();

        game.save((err) => {
            if (err) return next(err);
            return res.sendStatus(200);
        });
    });
};


exports.submitKill = (req, res, next)  => {
    helper.findPlayerById(req.params.gameCode, req.params.id, (err, killer, game) => {
        if (err) return next(err);
        if (!killer) return res.status(404).send('No killer with that id');

        var victim = game.livingPlayers.id(killer.target.victim);

        if (!victim) return res.status(404).send('No victim with that id');
        victim.killedBy.killer = killer._id;
        victim.killedBy.killTime = killer.target.timeKilled = Date.now();
        game.markModified('livingPlayers');

        game.save((err) => {
            if (err) return next(err);
            return res.sendStatus(200);
        });
    });
};

exports.getUnapprovedKills = (req, res, next) => {
    Game.findOne({ gameCode: req.params.gameCode }, (err, game) => {
        if (err) return next(err);
        if (!game) return res.status(400).send('No game with that game code');
        var unapproved = [];
        for (var i = 0; i < game.livingPlayers.length; i++) {
            if(game.livingPlayers[i].killedBy.killer && !game.livingPlayers[i].deathApproved)
                unapproved.push(game.livingPlayers[i]);
        }
        return res.json(unapproved);
    });
}

exports.approveKill = (req, res, next) => {
    helper.findPlayerById(req.params.gameCode, req.params.id, (err, killer, game) => {
        if (err) return next(err);
        if (!killer) return res.status(404).send('No killer with that id');
        // TODO : At the moment, no way to check if kill is within time limit (need to set some config global for that?)
        // TODO: add 'must kill by' date
        // No way to not approve kill yet, not sure how the route works for that, should it be a query?

        var killed = game.livingPlayers.id(killer.target.victim);

        if (!killed) return res.status(404).send('No victim with that id');

        killer.target.victim = killed.target.victim;
        killer.target.timeAssigned = Date.now();
        killer.target.timeKilled = null;
        killed.deathApproved = true;
        game.killedPlayers.push(killed);
        game.markModified('killedPlayers');
        killed.remove();
        game.markModified('livingPlayers');

        // checks for end game
        if(game.livingPlayers.length === 1) {
            game.gameStatus = 2;
        }

        game.save((err) => {
            if (err) return next(err);
            //return sender.sendDeathNotification(req, res, next);
            return res.sendStatus(200);
        });
    });
};
