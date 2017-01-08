import Cookie from 'react-cookie';
import moment from 'moment';
var baseApiUrl = 'https://api.spotify.com/';

var controller = {
    search: function (query) {
        var resource = 'v1/search?type=album,track,artist&q=';
        var uri = baseApiUrl + resource + query;

        return fetch(uri).then(function (response) {
            return response.json();
        }).then(function (data) {
            return data;
        });
    },

    getRecommendations(id) {
        return fetch('/curate?seed_id=' + id)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                return data;
            });
    },

    createPlaylist(userId, curatedTrack, tracks) {
        var playlistName = 'Curated from ' + curatedTrack.name + ' on ' + moment().format('lll');

        var createOptions = {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + Cookie.load('access_token'),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'name': playlistName
            })
        }

        fetch('https://api.spotify.com/v1/users/' + userId + '/playlists', createOptions)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                console.log('playlist data', data);

                var trackUris = tracks.map(function (track) {
                    return 'spotify:track:' + track.id;
                });

                var addTracksOptions = {
                    method: 'POST',
                    headers: {
                        'Authorization': 'Bearer ' + Cookie.load('access_token'),
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        'uris': trackUris
                    })
                }

                fetch('https://api.spotify.com/v1/users/' + userId + '/playlists/' + data.id + '/tracks', addTracksOptions)
                    .then(function (response) {
                        return response.json();
                    })
                    .then(function (data) {
                        console.log('playlist after tracks', data);
                        return data;
                    });
            });


    }
}

export default controller;