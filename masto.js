var mastodon = require('mastodon');
var fs = require('fs');

var config = require('./config');

var client = new mastodon({
    access_token: config.mastodon_access_token,
    timeout_mis: 60 * 1000,
    api_url: 'https://botsin.space/api/v1/',
});

var text = fs.readFileSync('text', 'utf8');
client.post('media', {file: fs.createReadStream('fruit.png')}).then(resp => {
    id = resp.data.id;
    client.post('statuses', {status: text, media_ids: [id]});
});
