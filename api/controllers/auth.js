const schemas = require('../models/schemas/game');
const Game = schemas[0];
const Player = schemas[1];
const jwt = require('jwt-simple');
const config = require('../models/config');
const helper = require('./helpers');

exports.loginAdmin = (req, res, next) => {
    if (typeof req.body.gameCode !== 'string')
        return res.status(400).send('Missing game code');
    if (typeof req.body.password !== 'string')
        return res.status(400).send('Missing password');

    Game.findOne({ gameCode: req.body.gameCode }, (err, game) => {
        if (err) return next(err);
        if (!game) return res.status(400).send('No game with that game code');

        game.comparePassword(req.body.password, (err, isMatch) => {
            if (err) return next(err);
            if (!isMatch) return res.status(401).send('Incorrect password');

            var payload = {
                gameId: game._id,
                gameCode: game.gameCode
            };

            var token = jwt.encode(payload, config.secret);

            game.token = token;

            game.save((err) => {
                if (err) return next(err);
                return res.json({ token: token });
            });
        })
    });
}

exports.loginPlayer = function(req, res, next) {
    if (typeof req.body.gameCode !== 'string')
        return res.status(400).send('Missing game code');
    if (typeof req.body.email !== 'string')
        return res.status(400).send('Missing email');
    if (typeof req.body.password !== 'string')
        return res.status(400).send('Missing password');

    helper.findPlayerByEmail(req.body.gameCode, req.body.email, (err, player, game) => {
        if (err) return next(err);
        if (!player) return res.status(404).send('No player with that email');
        player.comparePlayerPassword(req.body.password, (err, isMatch) => {
            if (err) return next(err);
            if (!isMatch) return res.status(401).send('Incorrect password');

            var payload = {
                gameId: game._id,
                gameCode: game.gameCode,
                playerId: player._id
            };

            var token = jwt.encode(payload, config.secret);

            player.token = token;
            if (player.deathApproved) game.markModified('killedPlayers');
            else game.markModified('livingPlayers');

            game.save((err) => {
                if (err) return next(err);
                return res.json({ token: token });
            });
        })
    });

};

exports.adminRequired = (req, res, next) => { validateToken(req, res, next, true); }

exports.validateToken = (req, res, next) => { validateToken(req, res, next, false); }

function validateToken(req, res, next, isAdmin) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    if (!token) return res.status(403).send('This endpoint requires a token');

    try {
        var decoded = jwt.decode(token, config.secret);
    } catch(err) {
        return res.status(403).send('Failed to authenticate token');
    }

    if (isAdmin && !!decoded.playerId)
        return res.status(403).send('Admin privileges required');

    Game.findById(decoded.gameId, (err, game) => {
        if (err) return next(err);
        if (!game) return res.status(403).send('Invalid game');
        if (!!decoded.playerId) {
            if (req.params.id && req.params.id !== decoded.playerId)
                return res.status(403).send('Incorrect player');
            helper.findPlayerById(decoded.gameCode, decoded.playerId, (err, player, game) => {
                if (err) return next(err);
                if (!player) return res.status(403).send('Invalid player');
                if (token !== player.token)
                    return res.status(403).send('Expired player token');
                req.game = { gameId: decoded.gameId, gameCode: decoded.gameCode };
                req.player = decoded;
                next();
            });
        } else {
            if (token !== game.token) return res.status(403).send('Expired admin token');
            req.game = decoded;
            next();
        }
    })

}
