(function($){
    var url = '';
    url += 'https://kcifscozyq.spotilocal.com:4371/remote/'
    url += '${action}.json';
    url += '?csrf=2c171e8385b456cc4cea25b8d2ca6160&oauth=NAowChgKB1Nwb3RpZnkSABoGmAEByAEBJbkDFVQSFItVwlg3dN5e40hG83u6Vx5ZIJB_';
    url += '${actionCtx}';
    url += '&ref=&cors=';

    var contexts = {
    	'status': '&returnon=login%2Clogout%2Cplay%2Cpause%2Cerror%2Cap&returnafter=${returnAfter}',
    	'play': '&uri=${uri}&context=${uri}',
    	'pause': '&pause=${pause}'
    }
	
	function Spotify() {}

	$.extend(Spotify.prototype, {
		status: function(returnAfter){
			var req = createUrl('status', {
				returnAfter: returnAfter
			});
			console.log('url', req);
			return $.get(req);
		},
		play: function(uri){
			var req = createUrl('play', {
				uri: encodeURIComponent(uri)
			})
			return $.get(req);
		},
		togglePause: function(){
			var d = $.Deferred();
			this.status(1).done(function(currentStatus){
				var req = createUrl('pause', {
					pause: currentStatus.playing
				});
				return $.get(req).done(function(data){
					d.resolve(data);
				}).error(function(data){
					d.reject(data);
				});
			});
			return d.promise();
		},
		unpause: function(){
			var req = createUrl('pause',{
				pause: false
			});
			return $.get(req);
		}
	});

	var createUrl = function(action, ctx){
		var ctxTmpl = contexts[action];
		var ctxUrl = template(ctxTmpl, ctx);

		return template(url, {
			'action': action,
			'actionCtx': ctxUrl
		});
	}
	var template = function(template, data) {
    	return template.trim().replace(/\$\{(\d+|[a-z\d]+)\}/gi, function(match, backref) {
			return data[backref];
	    });
    }

	window.Spotify = Spotify;

})(jQuery);