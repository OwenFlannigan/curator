var baseApiUrl = 'https://api.spotify.com/';

var controller = {
    search: function (query) {
        var resource = 'v1/search?type=album,track,artist&q=';
        var uri = baseApiUrl + resource + query;

        return fetch(uri).then(function (response) {
            return response.json();
        }).then(function (data) {
            // return fetch('/curate?seed_id=' + data.tracks.items[0].id)
            //     .then(function (response) {
            //         return response.json();
            //     })
            //     .then(function (data) {
            //         return data;
            //     });
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
    }
}

export default controller;