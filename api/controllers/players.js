const Player = require('../models/schemas/player');
const Game = require('../models/schemas/game');

exports.createPlayer = (req, res, next) => {
    // email, password, gameCode, isLiving = true
    if (typeof req.body.email !== 'string')
        return res.status(400).send('No email');
    if (typeof req.body.password !== 'string')
        return res.status(400).send('No password');
    if (typeof req.body.gameCode !== 'string')
        return res.status(400).send('No game code');

    var playerData = {};
    if (req.body.firstName && typeof req.body.firstName === 'string')
        playerData.firstName = req.body.firstName;
    if (req.body.lastName && typeof req.body.lastName === 'string')
        playerData.lastName = req.body.lastName;

    // check that game exists
    Game.findOne({ gameCode: req.body.gameCode }, (err, game) => {
        if (err) return next(err);
        if (!game) return res.status(400).send('Game does not exist');
    });
    playerData.gameCode = gameCode;

    // validate email
    // http://emailregex.com
    if (!(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-
    9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(req.body.email))
        return res.status(400).send('Invalid email');
    else
        playerData.email = req.body.email;

    playerData.isLiving = true;

    var newPlayer = new Player(playerData);
    Player.save((err, user) => {
        if (err) return next(err);
        return res.sendStatus(200);
    });
};

exports.getAllPlayers = (req, res, next) => {
    Player.find({}, (err, users) => {
        if (err) return next(err);
        return res.json(users);
    });
};

exports.getPlayerById = (req, res, next) => {
    Player.findById(req.params.id, (err, user) => {
        if (err) return next(err);
        return res.json(user);
    });
};

exports.getPlayerByGame = (req, res, next) => {
    Player.find({ game: req.params.game }, (err, users) => {
        if (err) return next(err);
        return res.json(users);
    });
};

exports.getLivingPlayersByGame = (req, res, next) => {
    Player.find({ game: req.params.game, living: true }, (err, users) => {
        if (err) return next(err);
        return res.json(users);
    });
};

exports.getDeadPlayersByGame = (req, res, next) => {
    Player.find({ game: req.params.game, living: false }, (err, users) => {
        if (err) return next(err);
        return res.json(users);
    });
};

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
