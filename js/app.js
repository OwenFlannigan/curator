"use strict";

var searchForm = document.querySelector('#search form');

searchForm.addEventListener('submit', function(event) {
	event.preventDefault();

	var input = $(searchForm).children('input').val();

	var url = "https://api.spotify.com/v1/search?type=album,track,artist&q=" + input;

	fetch(url).then(function(response) {
		return response.json();
	}).then(function(data) {
		// data.tracks.items.forEach(function(item) {
		// 	console.log(item.name + " by " + item.artists[0].name);
		// });
		showPlaylist(data.tracks.items);
	});

	return false; // for IE
});

function showPlaylist(songs) {
	var body = $('#playlist-table tbody');
	body.empty();

	songs.forEach(function(song) {
		var row = $('<tr>');
		console.log(song);

		var nameElem = $('<td headers="songs">');
		nameElem.text(song.name);
		var artistElem = $('<td headers="artists">');
		artistElem.text(song.artists.map(function(artist) {
			return artist.name;
		}).join(', '));
		var albumElem = $('<td headers="album">');
		albumElem.text(song.album.name);
		var durationElem = $('<td headers="duration">');
		durationElem.text(numeral(song.duration_ms/1000).format('00:00:00'));

		row.append($(nameElem));
		row.append($(artistElem));
		row.append($(albumElem));
		row.append($(durationElem));

		body.append($(row));
	});
	
}
