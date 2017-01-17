const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const config = require('./models/config');

const admins = require('./controllers/admins.js');
const players = require('./controllers/players.js');
const kills = require('./controllers/kills.js');

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

router.param('phone', (req, res, next, phone) => {
    if (!(+phone) || phone.length !== 10)
        return res.status(400).send('Invalid phone');
    next();
});

//================================================
// Routes
//================================================

router.route('/players')
	.get(players.getAllPlayers)
	.post(players.createPlayer);
router.route('/players/:id')
	.get(players.getPlayerById)
	.put(players.updatePlayerById)
	.delete(players.deletePlayerById);

router.route('/kills')
	.get(kills.getAllKills)
	.post(kills.createKill);
router.route('/kills/:id')
	.get(kills.getAllKillsByUserId)
	.post(kills.approveKill)
	.put(kills.updateKill);
	.delete(kills.deleteAllKillsByUserId)
router.route('/kills/game/:gamecode')
	.get(kills.getAllKillsByGameCode)
	.delete(kills.deleteAllKillsByGameCode);

router.route('/games')
	.post(games.createGame);
router.route('/games/:gamecode')
	.get(games.getGameById)
	.put(games.updateGameById)
	.delete(games.deleteGameById);
router.route('/games/:gamecode/kills')
	.get(kills.getUnapprovedKillsByGameCode);
router.route('/games/:gamecode/players')
	.get(players.getPlayerByGameCode);

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
    res.status(err.status || 500).send();
});

var server = app.listen(config.port);
console.log('Listening at http://localhost:%s in %s mode',
    server.address().port, app.get('env'));

module.exports = app;