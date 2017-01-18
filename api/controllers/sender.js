const nodemailer = require('nodemailer');
const Game = require('../models/schemas/game');
const config = require('../models/config');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: config.emailAddress,
        pass: config.emailPassword
    }
});

exports.sendDeathNotification = function (req, res, next) {
	Game.findById(req.params.gameCode).exec()
	.then(function(game) {
		if(!game) {
			var err = new Error('No game with that Id');
			err.status = 404;
			throw err;
		}
		for(var i = 0; i < game.killedPlayers.length; i++) {
			currPlayer = game.killedPlayers[i];
			if(req.params.id === currPlayer.id && currPlayer.deathApproved && currPlayer.killedBy)
				return sendDeathMails(currPlayer);
		}
		var err = new Error('No dead player with that Id');
		err.status = 404;
		throw err;
	}).then(function(mailInfoArray) {
		return res.json(mailInfoArray);
	}).catch(next)
};

function sendDeathMails(player) {
	var victimMailOptions = {
		from: '"' + config.emailName + '" <' + config.emailAddress + '>',
		to: player.email.join(', '),
		subject: 'You\'ve been killed',
		text: 'You were killed by ' + player.killedBy.fullName + '. Good game.';
	};
	var killerMailOptions = {
		from: '"' + config.emailName + '" <' + config.emailAddress + '>',
		to: player.email.join(', '),
		subject: 'You\'ve have killed someone',
		text: 'You have killed' + player.killedBy.fullName + 
			'. Good job. \n Your new target is 
			player.killedBy.target.victim.fullName';
	};
	return Promise.all([
		transporter.sendMail(victimMailOptions),
		transporter.sendMail(killerMailOptions)
	]);
};