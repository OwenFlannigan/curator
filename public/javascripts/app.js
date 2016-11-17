"use strict";

var searchForm = document.querySelector('#search form');

searchForm.addEventListener('submit', function (event) {
	event.preventDefault();
	audio.pause();
	$('.loader-container').fadeIn('fast');
	// adjustPlaylistHeight();
	$(window).resize(adjustPlaylistHeight);

	var input = $(searchForm).children('input').val();

	var url = "https://api.spotify.com/v1/search?type=album,track,artist&q=" + input;

	fetch(url).then(function (response) {
		return response.json();
	}).then(function (data) {
		// data.tracks.items.forEach(function(item) {
		// 	console.log(item.name + " by " + item.artists[0].name);
		// });
		fetch('/curate?seed_id=' + data.tracks.items[0].id).then(function (response) {
			return response.json();
		}).then(function (curatedData) {
			console.log(curatedData);
			showPlaylist(curatedData.tracks);
			showCuratedSearch(data.tracks.items[0]);
			$('.loader-container').fadeOut('fast');
			adjustPlaylistHeight();						
			showContent();
		});
		// showPlaylist(data.tracks.items);

		// base curation off of song or album)
		// showCuratedSearch(data.tracks.items[0]);

	});

	return false; // for IE
});

// Displays cover and info of the album or song that the 
// search was based on
function showCuratedSearch(song) {
	$('#album-cover').attr('src', song.album.images[0].url);
	$('#data h3').html('curated based on ' + '<a href="http://open.spotify.com/track/' + song.id + '">' + song.name + '</a> by <a href="http://open.spotify.com/artist/' + song.artists[0].id + '">' + song.artists[0].name + '</a>');
}

function showPlaylist(songs) {
	var body = $('#playlist-table tbody');
	body.empty();

	songs.forEach(function (song) {
		var row = $('<tr>');

		var nameElem = $('<td headers="songs" class="col-songs">');
		var songLink = $('<a href="http://open.spotify.com/track/' + song.id + '">');
		songLink.text(song.name);
		nameElem.append($(songLink));

		var playButton = $('<span>');
		// $(playButton).css('cursor', 'pointer');
		$(playButton).html('<i class="fa fa-play-circle" aria-hidden="true"></i>');
		$(nameElem).prepend($(playButton));

		// Sample song on click

		$(playButton).click(function () {
			sampleSong(song);
			toggleControlIcon(playButton);
		});

		var artistElem = $('<td headers="artists" class="col-artists">');
		var artistLink = $('<a href="http://open.spotify.com/artist/' + song.artists[0].id + '">');
		var mobileArtist = $('<p class="mobile-artist">'); 
		var artistList = (song.artists.map(function (artist) {
			return artist.name;
		}).join(', '));
		artistLink.text(artistList);
		mobileArtist.text(artistList);
		artistElem.append($(artistLink));

		// Mobile view
		nameElem.append($('<br class="mobile-artist"/>'));
		nameElem.append($(mobileArtist));

		var albumElem = $('<td headers="album" class="col-albums">');
		var albumLink = $('<a href="http://open.spotify.com/album/' + song.album.id + '">');
		albumLink.text(song.album.name);
		albumElem.append($(albumLink));

		// var durationElem = $('<td headers="duration">');
		// durationElem.text(numeral(song.duration_ms/1000).format('00:00:00'));

		row.append($(nameElem));
		row.append($(artistElem));
		row.append($(albumElem));
		// row.append($(durationElem));

		body.append($(row));
	});

}

function showContent() {
	$('body').css('background-color', '#080c10');
	$('#content').fadeIn(300);
}

function adjustPlaylistHeight() {
	var height = $(window).height() - $('header').height() - 75;
	$('#playlist').height(height);
}

var audio = new Audio();

function sampleSong(song) {
	if (audio.src === song.preview_url) { // same song
		if (audio.paused) { // if paused, play
			audio.play();
			audio.volume = 0;
			$(audio).animate({ volume: 1 }, 500); // fade in
		} else {
			audio.pause();
		}
	} else { // different song, or new song
		audio.pause();
		audio = new Audio(song.preview_url);
		audio.play();
		audio.volume = 0;
		$(audio).animate({ volume: 1 }, 500); // fade in
	}
}

function toggleControlIcon(playButton) {
	audio.onplay = function () {
		$(playButton).children('i').toggleClass('fa-stop-circle');
		$(playButton).children('i').toggleClass('fa-play-circle');
	}
	audio.onpause = function () {
		$(playButton).children('i').toggleClass('fa-stop-circle');
		$(playButton).children('i').toggleClass('fa-play-circle');
	}
}