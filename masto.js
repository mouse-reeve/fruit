var mastodon = require('mastodon');
var fs = require('fs');

var config = require('./config');

var client = new mastodon({
    access_token: config.mastodon_access_token,
    timeout_mis: 60 * 1000,
    api_url: 'https://botsin.space/api/v1/',
});

var text = fs.readFileSync('text', 'utf8').split('\n');
var description = text[0];
var fact = text[1];

client.post('media', {file: fs.createreadstream('fruit.png')}).then(resp => {
    id = resp.data.id;
    client.post('statuses', {status: description, media_ids: [id]}).then(main_post => {
        client.post('statuses', {status: fact, in_reply_to_id: main_post.data.id});
    });
});

