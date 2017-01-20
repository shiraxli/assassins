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
        headers: { 'x-access-token': req.headers['x-access-token'] },
        url: config.apiUrl + '/games/' + req.body.gameCode,
        form: req.body
    }).pipe(res);
});

router.get('/admin', (req, res, next) => {
    return res.render('admin', {title: 'Admin'});
});
router.post('/admin/getPlayers', (req, res, next) => {
    request.get(config.apiUrl + '/games/' + req.body.gameCode + '/players', {
        headers: { 'x-access-token': req.headers['x-access-token'] }
    }).pipe(res);
});
/*
router.post('/admin/getPlayers', (req, res, next){
    request.get(config.apiUrl + '/games/' + req.body.gameCode + '/players/' + req.body.target.victim, {
        headers: { 'x-access-token': req.headers['x-access-token'] }
    }).pipe(res);
});*/

router.post('/getPlayer', (req, res, next) => {
    console.log("get player by Id");
    request.get(config.apiUrl + '/games/' + req.body.gameCode + '/players/' + req.body.playerId, {
        headers: { 'x-access-token': req.headers['x-access-token'] }
    }).pipe(res);
});
router.post('/admin/approveKill', (req, res, next) => {
    request.post({
        headers: { 'x-access-token': req.headers['x-access-token'] },
        url: config.apiUrl + '/games/' + req.body.gameCode + '/players' + req.body.killerId + '/kills',
        form: req.body
    }).pipe(res);
})

router.delete('/removePlayer', (req, res, next) => {
    request.delete(config.apiUrl + '/games/' + req.body.gameCode + '/players/' + req.body.user_id, {
        headers: { 'x-access-token': req.headers['x-access-token'] }
    }).pipe(res);
});


module.exports = router;
