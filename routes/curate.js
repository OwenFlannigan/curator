var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    var authentication = window.btoa();

    res.send('success!');
});

module.exports = router;