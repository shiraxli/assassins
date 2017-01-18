const router = require('express').Router();
const request = require('request');
const config = require('../app/models/config');
const auth = require('./auth');

router.get('/', (req, res, next) => {
    return res.render('index', { title: 'Home' });
});

router.get('/games', (req, res, next) => {
    return res.render('game', { title: 'Create Game' });
});
router.post('/games', (req, res, next) => {
    // fix the path
    request.post({
        url:config.apiUrl + '/games' + req.body.gameCode,
        form: req.body
    }).pipe(res);
});

module.exports = router;






