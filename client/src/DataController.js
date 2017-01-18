import Cookie from 'react-cookie';
import moment from 'moment';
import firebase from 'firebase';
import _ from 'lodash';

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

    createPlaylist(userId, curatedTrack, tracks, title) {
        var playlistName = title ? title : 'Curated from ' + curatedTrack.name + ' on ' + moment().format('lll');
        console.log(playlistName);

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

        return fetch('https://api.spotify.com/v1/users/' + userId + '/playlists', createOptions)
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

                return fetch('https://api.spotify.com/v1/users/' + userId + '/playlists/' + data.id + '/tracks', addTracksOptions)
                    .then(function (response) {
                        return response.json();
                    })
                    .then(function (data) {
                        console.log('playlist after tracks', data);
                        return data;
                    });
            });


    },

    sharePlaylist(tracks, fromUserId, toUserId) {
        var userRef = firebase.database().ref('users/' + toUserId);
        userRef.once('value', function (snapshot) {
            var userObject = snapshot.val();
            if (userObject) {
                var playlistMessage = {
                    from: fromUserId,
                    playlist: tracks,
                    date: firebase.database.ServerValue.TIMESTAMP
                }
                var inboxRef = firebase.database().ref('users/' + toUserId + '/inbox');
                var postKey = inboxRef.push().key;
                var updates = {};
                updates[postKey] = playlistMessage;

                inboxRef.update(updates);
            }
        });
    }, 

    addUser(userId) {
        var usersRef = firebase.database().ref('users');
        usersRef.once('value', function(snapshot) {
            var usersObj = snapshot.val();
            if(!usersObj || !_.includes(Object.keys(usersObj), userId)) {
                var newUser = {
                    date_joined: firebase.database.ServerValue.TIMESTAMP
                }

                var updates = {};
                updates[userId] = newUser;
                usersRef.update(updates);
            }
        });
    }


}

export default controller;