const Game = require('../models/schemas/game');

exports.createGame = (req, res, next) => {

    if (typeof req.body.email !== 'string')
        return res.status(400).send('No email');
    if (typeof req.body.gameCode !== 'string')
        return res.status(400).send('No gameCode');
    if (typeof req.body.password !== 'string')
        return res.status(400).send('No password');

    var gameData = {};

    // http://emailregex.com
    if (req.body.email) {
        if (!(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(req.body.email)))
            return res.status(400).send('Invalid email');
        else
            gameData.email = req.body.email;
    }

    gameData.gameCode = req.body.gameCode;
    gameData.password = req.body.password;

    if (req.body.gameStatus)
        gameData.gameStatus = req.body.gameStatus;

    var newGame = new Game(gameData);
    newGame.save((err, game) => {
        if (err) {
            if (err.code === 11000)
                return res.status(400).send('Game code already registered');
            return next(err);
        }
        return res.sendStatus(200);
    });
}

exports.getAllGames = (req, res, next) => {
    var gameQuery = {};
    if (req.query.active === "true")
        gameQuery[gameStatus] = 1;
    Game.find(gameQuery, (err, games) => {
        if (err) return next(err);
        res.json(games);
    });
};

exports.getGameById = (req, res, next) => {
    Game.findById(req.params.id, (err, game) => {
        if (err) return next(err);
        if (!game) return res.status(404).send('No game with that ID');
        res.json(game);
    });
};

exports.getActiveGames = (req, res, next) => {
    Game.find({gameStatus: 1}, (err, users) => {
        if (err) return next(err);
        res.json(users);
    });
};

exports.updateGameById = (req, res, next) => {
    User.findOneAndUpdate(req.params.id, req.body, (err, user) => {
        if (err) return next(err);
        if (!user) return res.status(404).send('No game with that ID');
        return res.sendStatus(200);
    });
};


exports.deleteGameById = (req, res, next) => {
    Game.findOneAndRemove(req.params.id, (err, user) => {
        if (err) return next(err);
        if (!user) return res.status(404).send('No game with that ID');
        return res.sendStatus(200);
    });
}
