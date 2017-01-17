const Game = require('../models/schemas/game');

exports.createPlayer = (req, res, next) => {

    if (typeof req.body.firstName !== 'string')
        return res.status(400).send('No firstName');
    if (typeof req.body.lastName !== 'string')
        return res.status(400).send('No lastName');
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

    playerData.password = req.body.password;


    var newPlayer = new Player(playerData);
    Game.find({gameCode: req.params.gameCode}, (err, game) => {
        if (err) return next(err);
        if (!game) return res.status(404).send('No game with that gameCode');
        game.livingPlayers.push(newPlayer);
        game.markModified('livingPlayers');
    })
});
};

exports.getAllPlayers = (req, res, next) => {
    Game.find({ game: req.params.gameCode }, (err, game) => {
        if (err) return next(err);
        var gameQuery = {};
        if (req.query.living === 'true')
            return res.json(game.livingPlayers);
        if (req.query.living === 'false')
            return res.json(game.killedPlayers);
        var allPlayers = game.livingPlayers.concat(game.killedplayers);
        return res.json(allPlayers);
    });
};



exports.getPlayerById = (req, res, next) => {
    Game.find({ game: req.params.gameCode }, (err, game) => {
        if (err) return next(err);
        var allPlayers = game.livingPlayers.concat(game.killedplayers);
        for (var i = 0; i < allPlayers.length; i++) {
            if allPlayers[i]._id == Number(req.params.id)
                return res.json(allPlayers[i]);
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
