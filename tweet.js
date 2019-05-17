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
var text = fs.readFileSync('text', 'utf8').split('\n');
var description = text[0];
var fact = text[1];

client.post('media/upload', {media: data}, function (error, media, response) {
    if (!error) {
        var status = {
            status: description,
            media_ids: media.media_id_string // Pass the media id string
        };

        client.post('statuses/update', status, function(error, tweet, response) {
            if (error) {
                console.log(error);
            }

            // only post fun facts every so often
            if (Math.random() > 0.2) {
                return;
            }
            var followup = {
                status: '@new_facts ' + fact,
                in_reply_to_status_id: tweet.id_str,
            };
            client.post('statuses/update', followup, function(error, tweet, response) {
                if (error) {
                    console.log(error);
                }
            });
        });

    } else {
        console.log(error);
    }
});
