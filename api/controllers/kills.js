const Kills = require('../models/schemas/kill');

exports.createKill = (req, res, next) => {
    // validation?

    var killData = {
        killer: req.body.killer,
        killed: req.body.killed,
        gameCode: req.body.gameCode,
        approved: false
    };
    var newKill = new Kill(killData);
    newKill.save((err, kill) => {
        if (err) return next(err);
        return res.sendStatus(200);
    });
};

exports.getAllKills = (req, res, next) => {
    Kill.find({}, (err, kills) => {
        if (err) return next(err);
        return res.json(kills);
    });
};

exports.getAllKillsByGameCode = (req, res, next) => {
    Kill.find({ gameCode: req.params.gamecode }, (err, kills) => {
        if (err) return next(err);
        return res.json(kills);
    });
};

exports.getAllKillsByUserId = (req, res, next) => {
    Kill.find({ killer: req.params.id }, (err, kills) => {
        if (err) return next(err);
        return res.json(kills);
    });
};

exports.getApprovedKillsByGameCode = (req, res, next) => {
    Kill.find({ gameCode: req.params.gamecode, approved: true }, (err, kills) => {
        if (err) return next(err);
        return res.json(kills);
    });
};

exports.getUnapprovedKillsByGameCode = (req, res, next) => {
    Kill.find({ gameCode: req.params.gamecode, approved: false }, (err, kills) => {
        if (err) return next(err);
        return res.json(kills);
    });
};

exports.getApprovedKillsByUserId = (req, res, next) => {
    Kill.find({ killer: req.params.id, approved: true }, (err, kills) => {
        if (err) return next(err);
        return res.json(kills);
    });
};

exports.getUnapprovedKillsByUserId = (req, res, next) => {
    Kill.find({ killer: req.params.id, approved: false }, (err, kills) => {
        if (err) return next(err);
        return res.json(kills);
    });
};

exports.deleteAllKillsByUserId = (req, res, next) => {
    Kill.remove({ killer: req.params.id }, (err, kills) => {
        if (err) return next(err);
        return res.sendStatus(200);
    });
};

exports.deleteAllKillsByGameCode = (req, res, next) => {
    Kill.remove({ gameCode: req.params.gamecode }, (err, kills) => {
        if (err) return next(err);
        return res.sendStatus(200);
    });
};

exports.approveKill = (req, res, next) => {
    Kill.findByIdAndUpdate(req.params.id, { approved: true }, { new: true }, (err, kill) => {
        if (err) return next(err);
        if (!kill) return res.status(400).('No kill with that id');
        return res.json(kill);
    });
};

exports.updateKill = (req, res, next) => {
    Kill.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, kill) => {
        if (err) return next(err);
        if (!kill) return res.status(400).('No kill with that id');
        return res.json(kill);
    });
};
