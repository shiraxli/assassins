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

router.get('/login/player', (req, res, next) => {
    return res.render('playerlogin', {title: 'Player Login' });
});
router.get('/login/admin', (req, res, next) => {
    return res.render('adminlogin', {title: 'Admin Login' });
});

router.post('/changeGameStatus', (req, res, next) => {
    request.post({
        url: config.apiUrl + '/games/' + req.body.gameCode,
        form: req.body
    }).pipe(res);
});

router.get('/admin', (req, res, next) => {
    return res.render('admin', {title: 'Admin'});
});
router.get('/admin/getPlayers', (req, res, next) => {
    // is this right?
    //decodedToken = JSON.parse(atob(req.headers['x-access-token'].split('.')[1]));
    //console.log(decodedToken);
    request.get(config.apiUrl + '/games/' + req.body.gameCode + '/players', {
        headers: { 'x-access-token': req.headers['x-access-token'] }
    }).pipe(res);
});

router.delete('/removePlayer', (req, res, next) => {
    request.delete({
        url: config.apiUrl + '/games/' + req.body.gameCode + '/players/' + req.body.user_id
    }).pipe(res);
});

module.exports = router;
