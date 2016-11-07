var express = require('express');
var request = require('request');
var router = express.Router();
var fs = require('fs');

var authentication = fs.readFileSync('client_info.txt', 'ascii', (err, data) => {
    if(err) { throw err; }
    return data;
});

router.get('/', function(req, response, next) {
    authentication = new Buffer(authentication).toString('base64');
    var seeds = req.query.seed_id;

    if(!(seeds)) {
        response.send({
            'error': 'Request is missing seed ID parameter'
        });
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
            response.send({
                'error': 'Authorization request failed. Please contact the site administration to resolve this issue.'
            });
        }
    });

});

module.exports = router;