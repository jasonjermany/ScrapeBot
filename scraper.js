
const puppeteer = require('puppeteer');
// const guitarIDs = require('./URL_IDs/guitarID');
// const guitarURLs = require('./URL_IDs/guitarURL');
//const xPaths = require('./URL_IDs/xPath');
const MAX = 6;

async function scrape(url, orig1,orig2,sale1,sale2) {  
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    await page.goto(url);
    console.log(url);
    for(let i = 1; i < MAX; i++){

        const [orig] = await page.$x(orig1 + i + orig2);
        const origTxt = await orig.getProperty('textContent');
        const origPrice = await origTxt.jsonValue();

        const [sale] = await page.$x(sale1 + i + sale2);
        const saleTxt = await sale.getProperty('textContent');
        const salePrice = await saleTxt.jsonValue();
        let n1 = origPrice.replace(/[^0-9.-]+/g,"");
        let n2 = salePrice.replace(/[^0-9.-]+/g,"");
        let dif = parseFloat(n1) - parseFloat(n2);
        console.log('Original price: ' + origPrice + ' Sale price: ' + salePrice + ' Price difference: ' + Math.round((dif + Number.EPSILON) * 100) / 100 + '\n');
        message.channel.send('Original price: ' + origPrice + ' Sale price: ' + salePrice + ' Price difference: ' + Math.round((dif + Number.EPSILON) * 100) / 100 + '\n');
    }
    
    await browser.close();
}
module.exports = scrape;