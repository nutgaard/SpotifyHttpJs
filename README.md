SpotifyHttpJs
=============

A simple wrapper for Spotify's internal HTTP server.

In order for the script to work you need to extract the csrf token embedded in your Spotify HTTP server.
To get the token you can run the following command in your terminal:

```
curl "https://tpcaahshvs.spotilocal.com:4371/simplecsrf/token.json?&ref=&cors=" -H "Pragma: no-cache" -H "Origin: https://embed.spotify.com" -H "Accept-Encoding: gzip,deflate" -H "Accept-Language: en-US,en;q=0.8,da;q=0.6,nb;q=0.4" -H "User-Agent: Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2156.0 Safari/537.36" -H "Accept: */*" -H "Referer: https://embed.spotify.com/?uri=spotify:track:4bz7uB4edifWKJXSDxwHcs" -H "Connection: keep-alive" -H "Cache-Control: no-cache" --compressed
```

As an alternative you can go to [Spotify's webpage](https://embed.spotify.com/?uri=spotify:track:4bz7uB4edifWKJXSDxwHcs)
and run this javascript in your console (Press F12).

```
$.get('https://tpcaahshvs.spotilocal.com:4371/simplecsrf/token.json?&ref=&cors=').done(function(d){prompt('This is your token', d.token)});	
```

The same script can be executed directly in the url bar as well:

```
javascript:$.get('https://tpcaahshvs.spotilocal.com:4371/simplecsrf/token.json?&ref=&cors=').done(function(d){prompt('This is your token', d.token)});
```


When you got your csrf token handy you are ready to test the library.
```Javascript
var spotify = new Spotify(csrf_token);
spotify.play('spotify:track:0iTlGLAhCU7jojPx7zh4ap')
spotify.togglePause();
spotify.togglePause();
```