(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else if (typeof exports === 'object') {
        module.exports = factory;
    } else {
        root.Spotify = factory();
    }
}(this, function () {
    "use strict";
    return (function($){
        var versionUrl = 'https://tpcaahshvs.spotilocal.com:4371/service/version.json?service=remote&ref=&cors=';
        var oauthTokenUrl = 'http://open.spotify.com/token';

        var urlTemplate = '';
        urlTemplate += 'https://kcifscozyq.spotilocal.com:4371/remote/'
        urlTemplate += '${action}.json';
        urlTemplate += '?csrf=${csrf}&oauth=${oauth}';
        urlTemplate += '${actionCtx}';
        urlTemplate += '&ref=&cors=';

        var url = '';

        var contexts = {
            'status': '&returnon=login%2Clogout%2Cplay%2Cpause%2Cerror%2Cap&returnafter=${returnAfter}',
            'play': '&uri=${uri}&context=${uri}',
            'pause': '&pause=${pause}'
        };

        var readyH = $.Deferred();

        function Spotify(csrf) {
            if (typeof csrf === 'undefined'){
                readyH.reject(false, undefined, 'Must defined csrf token');
                return;//throw 'Must define csrf token';
            }
            getOAuthToken().then(function(data){
                var tokens = {
                    csrf: csrf,
                    oauth: data['t']
                }
                url = template(urlTemplate, tokens);
                this.status(1).then(function(d){
                    if (d.hasOwnProperty('error')){
                        readyH.reject(false, undefined, d.error.message);
                        throw d.error.message;
                    }
                    readyH.resolve(true, this, d);
                    console.log('resolved');
                }.bind(this));
            }.bind(this));
        }
        Spotify.start = function(token, cb){
            readyH = $.Deferred();
            var instance = new Spotify(token);
            return instance.ready().done(cb).fail(cb);
        }

        $.extend(Spotify.prototype, {
            status: function(returnAfter){
                var req = createUrl('status', {
                    returnAfter: returnAfter
                });
                return $.get(req);
            },
            play: function(uri){
                var req = createUrl('play', {
                    uri: encodeURIComponent(uri)
                });
                return $.get(req);
            },
            togglePause: function(){
                var state = this.status(1),
                    resp = state.then(function(currentStatus){
                        var req = createUrl('pause', {
                            pause: currentStatus.playing
                        });
                        return $.get(req)
                    });
                return resp;
            },
            version: function(){
                return $.get(versionUrl);
            },
            ready: function(){
                return readyH.promise();
            }
        });
        var getOAuthToken = function(){
            return $.ajax({
                url: "https://jsonp.afeld.me/?url=https%3A%2F%2Fopen.spotify.com%2Ftoken",
                dataType: "jsonp"
            });
        };

        var createUrl = function(action, ctx){
            var ctxTmpl = contexts[action];
            var ctxUrl = template(ctxTmpl, ctx);

            return template(url, {
                'action': action,
                'actionCtx': ctxUrl
            });
        };
        var template = function(template, data) {
            return template.trim().replace(/\$\{(\d+|[a-z\d]+)\}/gi, function(match, backref) {
                if (typeof data[backref] === 'undefined'){
                    return '${'+backref+'}';
                }
                return data[backref];
            });
        };

        return Spotify;

    })(jQuery);
}));
