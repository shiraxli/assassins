const schemas = require('../models/schemas/game');
const Game = schemas[0];
const Player = schemas[1];

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
    newGame.save((err) => {
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

exports.getGameByCode = (req, res, next) => {
    Game.findOne({gameCode: req.params.gameCode}, (err, game) => {
        if (err) return next(err);
        if (!game) return res.status(404).send('No game with that code');
        return res.json(game);
    });
};

exports.updateGameByCode = (req, res, next) => {
    Game.findOneAndUpdate({ gameCode: req.params.gameCode }, req.body, (err, game) => {
        if (err) return next(err);
        if (!game) return res.status(404).send('No game with that code');
        return res.sendStatus(200);
    });
};


exports.deleteGameByCode = (req, res, next) => {
    Game.findOneAndRemove({ gameCode: req.params.gameCode }, (err, game) => {
        if (err) return next(err);
        if (!game) return res.status(404).send('No game with that code');
        return res.sendStatus(200);
    });
}

exports.startGame = (req, res, next) => {
    console.log("starting the game");
    Game.findOne({gameCode: req.params.gameCode}, (err, game) => {

        if (!game) return res.status(404).send('No game with that code');
        if (!game.livingPlayers) return res.status(404).send('No players in this game');
        console.log(game.livingPlayers);
        // shuffle array
        game.livingPlayers = shuffle(game.livingPlayers);
        console.log(livingPlayers);

        for (var i = 0; i < game.livingPlayers.length; i++) {
            if (i === game.livingPlayers.length -1) {
                game.livingPlayers[i].target = game.livingPlayers[0];
            } else {
                game.livingPlayers[i].target = game.livingPlayers[i++];
            }
        }
        game.markModified(livingPlayers);
        game.save();
    })
}


// https://github.com/coolaj86/knuth-shuffle
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}
