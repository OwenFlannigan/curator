var express = require('express');
var router = express.Router();
var request = require('request');
var querystring = require('querystring');
var fs = require('fs');

var client_id = '09031e5e116b41058b8c32ce8d4c882c';
var redirect_uri = 'http://localhost:3001/login/callback';

var generateRandomString = function (length) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

router.get('/', function (req, res) {
    var state = generateRandomString(16);

    var scope = 'playlist-modify-public user-top-read';
    res.redirect('https://accounts.spotify.com/authorize?' +
        querystring.stringify({
            response_type: 'code',
            client_id: client_id,
            scope: scope,
            redirect_uri: redirect_uri,
            state: state
        }));
});

// Adjust file name for client information here
var authentication = fs.readFileSync('client_information.txt', 'ascii', (err, data) => {
    if (err) { throw err; }
    return data;
});
authentication = new Buffer(authentication).toString('base64');

router.get('/callback', function (req, res) {
    var code = req.query.code || null;
    var state = req.query.state || null;

    if (state === null) {
        res.redirect('/#' +
            querystring.stringify({
                error: 'state_mismatch'
            }));
    } else {
        var authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            form: {
                code: code,
                redirect_uri: redirect_uri,
                grant_type: 'authorization_code'
            },
            headers: {
                'Authorization': 'Basic ' + authentication
            },
            json: true
        };

        request.post(authOptions, function (err, response, body) {
            if (!err && response.statusCode === 200) {
                var access_token = body.access_token;
                var refresh_token = body.refresh_token;

                // var options = {
                //     url: 'https://api.spotify.com/v1/me',
                //     headers: { 'Authorization': 'Bearer ' + access_token },
                //     json: true
                // };

                // request.get(options, function (error, response, body) {
                //     // console.log(body);
                //     res.send(body);
                // });

                res.redirect('http://localhost:3000/#/redirect/' +
                    querystring.stringify({
                        access_token: access_token,
                        refresh_token: refresh_token
                    })
                );
            } else {
                res.redirect('/#/redirect/' +
                    querystring.stringify({
                        error: 'invalid_token'
                    })
                );
            }
        });
    }
});

module.exports = router;