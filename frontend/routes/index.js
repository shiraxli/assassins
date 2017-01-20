const router = require('express').Router();
const request = require('request');
const config = require('../app/models/config');
const auth = require('./auth');

router.get('/', (req, res, next) => {
    return res.render('index', { title: 'Home' });
});

router.get('/create', (req, res, next) => {
    return res.render('create', { title: 'Create Game' });
});
router.post('/create', (req, res, next) => {
    request.post({
        url: config.apiUrl + '/games',
        form: req.body
    }).pipe(res);
});

router.get('/join', (req, res, next) => {
    return res.render('join', { title: 'Join' });
});
router.post('/join', (req, res, next) => {
    request.post({
        url: config.apiUrl + '/games/' + req.body.gameCode + '/players',
        form: req.body
    }).pipe(res);
});

router.post('/login/player', (req, res, next) => {
    re
})

router.get('/login/player', (req, res, next) => {
    return res.render('playerlogin', {title: 'Player Login' });
});
router.get('/login/admin', (req, res, next) => {
    return res.render('adminlogin', {title: 'Admin Login' });
});

router.post('/changeGameStatus', (req, res, next) => {
    request.post({
        headers: { 'x-access-token': req.headers['x-access-token'] },
        url: config.apiUrl + '/games/' + req.body.gameCode,
        form: req.body
    }).pipe(res);
});

// is this right?
router.get('/games/:gameCode/players', (req, res, next) => {
    var gameCode = req.params.gameCode
    request.get(config.apiUrl + '/games/' + gameCode + '/players', (err, response, body) => {
        if(!err && response.statusCode == 200)
            return res.render('/admin', {users: JSON.parse(body)});
        else return res.render('/admin', {users: []});
    });
});
router.delete('/removePlayer', (req, res, next) => {
    request.delete({
        url: config.apiUrl + '/games/' + req.body.gameCode + '/players/' + req.body.user_id
    }).pipe(res);
});


module.exports = router;
