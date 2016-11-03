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

		// base curation off of song or album)
		showCuratedSearch(data.tracks.items[0]);
	});

	return false; // for IE
});

// Displays cover and info of the album or song that the 
// search was based on
function showCuratedSearch(song) {
	$('#album-cover').attr('src', song.album.images[0].url);
	$('#data h3').text('curated based on ' + song.name + ' by ' + song.artists[0].name);
}

function showPlaylist(songs) {
	var body = $('#playlist-table tbody');
	body.empty();

	songs.forEach(function(song) {
		var row = $('<tr>');
		console.log(song);

		var nameElem = $('<td headers="songs">');
		nameElem.text(song.name);
		$(nameElem).prepend(playButton);

		var playButton = $('<span>');
		$(playButton).html('<i class="fa fa-play" aria-hidden="true"></i>');
		$(nameElem).prepend($(playButton));

		// Sample song on click

		// NEED TO FIX PAUSE PLAY TOGGLE ICONS
		$(playButton).click(function() {
			$(this).children('i').toggleClass('fa-play');
			$(this).children('i').toggleClass('fa-pause');
			$('tbody').children('td').each(function(td) {
				if(td.children('i').hasClass('fa-pause')) {
					td.children('i').toggleClass('fa-pause');
					td.children('i').toggleClass('fa-play');
				}
			});
			sampleSong(song);
		});

		var artistElem = $('<td headers="artists">');
		artistElem.text(song.artists.map(function(artist) {
			return artist.name;
		}).join(', '));

		var albumElem = $('<td headers="album">');
		albumElem.text(song.album.name);

		// var durationElem = $('<td headers="duration">');
		// durationElem.text(numeral(song.duration_ms/1000).format('00:00:00'));

		row.append($(nameElem));
		row.append($(artistElem));
		row.append($(albumElem));
		// row.append($(durationElem));

		body.append($(row));
	});
	
}

var audio = new Audio();

function sampleSong(song) {
	if(audio.src === song.preview_url) {
		if(audio.paused)
			audio.play();
		else
			audio.pause();
	} else {
		audio.pause();
		audio = new Audio(song.preview_url);
		audio.play();
	}
	
}