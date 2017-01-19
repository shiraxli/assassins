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
    // fix the path
    request.post({
<<<<<<< HEAD
        url:config.apiUrl + '/games',
=======
        url: config.apiUrl + '/games' + req.body.gameCode,
>>>>>>> 126bea2e592bb10ef60b5699b571c17e6b8a2287
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

router.get('/login/player', (req, res, next) => {
    return res.render('playerlogin', {title: 'Player Login' });
});

router.get('/login/admin', (req, res, next) => {
    return res.render('adminlogin', {title: 'Admin Login' });
});

module.exports = router;
