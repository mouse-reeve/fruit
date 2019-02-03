var mastodon = require('mastodon');
var fs = require('fs');

console.log(mastodon);
var config = require('./config');


var client = new mastodon({
    access_token: config.mastodon_access_token,
    timeout_mis: 60 * 1000,
    api_url: 'https://botsin.space/api/v1/',
});

client.post('media', {file: fs.createReadStream('fruit.png')}).then(resp => {
    id = resp.data.id;
    client.post('statuses', {media_ids: [id]});
});
