var twitter = require('twitter');
var fs = require('fs');
var config = require('./config');

var client = new twitter({
    consumer_key: config.twitter_consumer_key,
    consumer_secret: config.twitter_consumer_secret,
    access_token_key: config.twitter_access_token,
    access_token_secret: config.twitter_access_secret,
});

var data = fs.readFileSync('fruit.png');
var text = fs.readFileSync('text', 'utf8');

client.post('media/upload', {media: data}, function (error, media, response) {
    if (!error) {
        var status = {
            status: text,
            media_ids: media.media_id_string // Pass the media id string
        };

        client.post('statuses/update', status, function(error, tweet, response) {
            if (error) {
                console.log(error);
            }
        });

    } else {
        console.log(error);
    }
});
