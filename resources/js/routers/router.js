/*
* The MIT License (MIT)
* 
* Copyright (c) 2012 Richard Backhouse
* 
* Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"),
* to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense,
* and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
* 
* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
* 
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
* DEALINGS IN THE SOFTWARE.
*/
define([
	'jquery', 
	'backbone', 
	'underscore',
	'jquerymobile',
	'models/ArtistList',
	'models/AlbumList',
	'models/SongList',
	'models/PlayList',
	'views/ArtistListView',
	'views/AlbumListView',
	'views/SongListView',
	'views/PlayListView',
	], 
function($, Backbone, _, mobile, ArtistList, AlbumList, SongList, PlayList, ArtistListView, AlbumListView, SongListView, PlayListView){
	var Router = Backbone.Router.extend({
		initialize: function() {
			$('.back').on('click', function(event) {
	            window.history.back();
	            return false;
	        });
	        this.firstPage = true;			
	        this.on("route:addsong", function(song) {
	        	$.ajax({
	        		url: "./music/playlist/song/"+song,
	        		type: "PUT",
		        	contentTypeString: "application/x-www-form-urlencoded; charset=utf-8",
		        	dataType: "text",
		        	success: function(data, textStatus, jqXHR) {
			        	this.fetchPlayList();
		        	}.bind(this),
		        	error: function(jqXHR, textStatus, errorThrown) {
		        	}
	        	});
	        });
	        this.on("route:addalbum", function(album) {
	        	$.ajax({
	        		url: "./music/playlist/album/"+album,
	        		type: "PUT",
		        	contentTypeString: "application/x-www-form-urlencoded; charset=utf-8",
		        	dataType: "text",
		        	success: function(data, textStatus, jqXHR) {
			        	this.fetchPlayList();
		        	}.bind(this),
		        	error: function(jqXHR, textStatus, errorThrown) {
		        	}
	        	});
	        });
	        this.on("route:playlist", function() {
	        	this.fetchPlayList();
			});
			this.on("route:songs", function(album) {
				var songlist = new SongList({album: album});
				songlist.fetch({
					success: function(collection, response, options) {
						this.changePage(new SongListView({songs: collection, album: album}));
					}.bind(this),
					error: function(collection, xhr, options) {
						console.log("failed!!!");
					}
				});
			});
			this.on("route:albums", function(artist) {
				var albumslist = new AlbumList({artist: artist});
				albumslist.fetch({
					success: function(collection, response, options) {
						this.changePage(new AlbumListView({albums: collection}));
					}.bind(this),
					error: function(collection, xhr, options) {
						console.log("failed!!!");
					}
				});
			});
			this.on("route:artists", function() {
				var artistlist = new ArtistList();
				artistlist.fetch({
					success: function(collection, response, options) {
						this.changePage(new ArtistListView({artists: collection}));
					}.bind(this),
					error: function(collection, xhr, options) {
						console.log("failed!!!");
					}
				});
			});
			Backbone.history.start();
		},
		fetchPlayList: function(statusJSON) {
			this.navigate("playlist", {replace: true});
			if (this.currentView) {
				this.currentView.close();
				this.currentView.remove();
				this.currentView.unbind();
			}
			var playlist = new PlayList();
			playlist.fetch({
				success: function(collection, response, options) {
					this.currentView = new PlayListView({playlist: collection})
					this.changePage(this.currentView);
				}.bind(this),
				error: function(collection, xhr, options) {
					console.log("failed!!!");
				}
			});
		},
	    changePage:function (page) {
	        $(page.el).attr('data-role', 'page');
	        page.render();
	        $('body').append($(page.el));
	        mobile.changePage($(page.el), {changeHash:false, reverse: false});
	    },
		routes: {
			'playlist': 'playlist',
			'playlist/song/:song': 'addsong',
			'playlist/album/:album': 'addalbum',
			'songs/:album': 'songs',
			'albums/:artist': 'albums',
			'artists': 'artists',
			'albums': 'albums',
			'songs': 'songs',
			'': 'playlist'
		}
	});
	
	return Router;
});
