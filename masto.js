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

client.post('media', {file: fs.createReadStream('fruit.png')}).then(resp => {
    id = resp.data.id;
    client.post('statuses', {status: description, media_ids: [id]}).then(main_post => {
        // only post fun facts every so often
        if (Math.random() > 0.2) {
            return;
        }
        client.post('statuses', {status: fact, in_reply_to_id: main_post.data.id});
    });
});

