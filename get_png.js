var puppeteer = require('puppeteer');

(async () => {
    var browser = await puppeteer.launch();
    var page = await browser.newPage();

    await page.goto('file://' + process.cwd() + '/index.html');

    var canvas = await page.$('canvas');
    await canvas.screenshot({
        path: 'fruit.png',
    });
    var description = await page.$eval('#description', node => node.innerText);
    console.log(description);

    var fact = await page.$eval('#fact', node => node.innerText);
    console.log(fact);

    await browser.close();
})();

