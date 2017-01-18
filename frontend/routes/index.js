const router = require('express').Router();
const request = require('request');
const config = require('../app/models/config');
const auth = require('./auth');

router.get('/', (req, res, next) => {
    return res.render('index', { title: 'Home' });
});

router.get('/admin', (req, res, next) => {
    return res.render('admin', { title: 'Admin' });
});

router.get('/join', (req, res, next) => {
    return res.render('join', { title: 'Join' });
});

module.exports = router;
