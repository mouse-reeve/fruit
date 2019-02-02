var puppeteer = require('puppeteer');

(async () => {
    var browser = await puppeteer.launch();
    var page = await browser.newPage();

    await page.goto('file:///Users/mouse/Projects/fruit/index.html');

    var canvas = await page.$('canvas');
    await canvas.screenshot({
        path: 'fruit.png',
    });

    await browser.close();
})();
