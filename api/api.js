const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const config = require('./models/config');

const players = require('./controllers/players.js');
const games = require('./controllers/games.js');

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
app.use(cookieParser());

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
	.post(games.createGame);
router.route('/games/:gameCode')
	.get(games.getGameByCode)
	.put(games.updateGameByCode)
	.delete(games.deleteGameByCode)
    .post(games.startGame);

router.route('/games/:gameCode/players')
	.get(players.getAllPlayers)
	.post(players.createPlayer);
router.route('/games/:gameCode/players/:id/kills')
    .get(players.getUnapprovedKills)
    .post(players.approveKill);
router.route('/games/:gameCode/players/:id')
	.get(players.getPlayerById)
    .post(players.submitKill)
	.put(players.updatePlayerById)
	.delete(players.deletePlayerById);

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
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        console.log(err);
        res.status(err.status || 500).send();
    });
}

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
