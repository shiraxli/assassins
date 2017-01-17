const router = require('express').Router();
const request = require('request');
const config = require('../app/models/config');

router.get('/', (req, res, next) => {
    return res.render('index', { title: 'Home' });
});

module.exports = router;
