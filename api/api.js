const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');

const config = require('./models/config');

const players = require('./controllers/players.js');
const games = require('./controllers/games.js');
const auth = require('./controllers/auth.js');

// http://mongoosejs.com/docs/promises.html
mongoose.Promise = global.Promise;
mongoose.connect(config.dbUrl, {server: {socketOptions: {keepAlive: 120}}});

var app = express();
var router = express.Router();

// run init script
require('./init/init');

// log if in dev mode
app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//================================================
// Middleware
//================================================
router.param('id', (req, res, next, id) => {
    if (!id.match(/^[0-9a-fA-F]{24}$/))
        return res.status(400).send('Invalid ID');
    next();
});

//================================================
// Routes
//================================================

router.route('/games')
	.get(games.getAllGames)
	.post(games.createGame, auth.loginAdmin);
router.route('/games/:gameCode')
	.get(auth.validateToken, games.getGameByCode)
	.put(auth.adminRequired, games.updateGameByCode)
	.delete(auth.adminRequired, games.deleteGameByCode)
    .post(auth.adminRequired, games.changeGameStatus);

router.route('/games/:gameCode/players')
	.get(auth.adminRequired, players.getAllPlayers)
	.post(players.createPlayer, auth.loginPlayer);
router.route('/games/:gameCode/kills')
    .get(auth.adminRequired, players.getUnapprovedKills)
router.route('/games/:gameCode/players/:id/kills')
    .get(auth.validateToken, players.getMyKills)
    .post(auth.adminRequired, players.approveKill)
    .put(auth.validateToken, players.submitKill);

// lol could you update your own target based on this?
router.route('/games/:gameCode/players/:id')
	.get(auth.validateToken, players.getPlayerById)
	.put(auth.validateToken, players.updatePlayerById)
	.delete(auth.validateToken, players.deletePlayerById);

router.route('/auth/game')
    .post(auth.loginAdmin);
router.route('/auth/player')
    .post(auth.loginPlayer);

app.use('/', router);

//================================================
// Errors
//================================================

// handle 404
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// development error handler
/*if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        console.log(err);
        res.status(err.status || 500).send();
    });
}*/

// production error handler
app.use(function(err, req, res, next) {
    if (err.status) {
        return res.status(err.status).send(err.message);
    }
    res.status(500).send();
});

var server = app.listen(config.port);
console.log('Listening at http://localhost:%s in %s mode',
    server.address().port, app.get('env'));

module.exports = app;
