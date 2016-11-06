var express = require('express');
var request = require('request');
var router = express.Router();

var clientID = '09031e5e116b41058b8c32ce8d4c882c';
var secret = 'c13c3a5aee31458e841316192545e5f8';

router.get('/', function(req, response, next) {
    var authentication = new Buffer(clientID + ':' + secret).toString('base64');
    var seeds = req.query.seed_id;
    console.log(seeds);

    if(!(seeds)) {
        response.send('Request is missing seed ID parameter');
        return;
    }

    var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        form: {
            grant_type: 'client_credentials'
        },
        headers: {
            'Authorization': 'Basic ' + (authentication)
        },
        json: true
    };

    request.post(authOptions, function(err, res, body) {
        if(!err && res.statusCode === 200) {
            var token = body.access_token;

            var reqOptions = {
                url: 'https://api.spotify.com/v1/recommendations?seed_tracks=' + seeds,
                headers: {
                    'Authorization': 'Bearer ' + token
                },
                json: true
            };

            request.get(reqOptions, function(err, res, body) {
                response.send(body);
            });

        } else {
            console.log('error requesting auth', err);
            response.send('Authorization request failed. Please contact the site administration to resolve this issue.');
        }
    });

});

module.exports = router;