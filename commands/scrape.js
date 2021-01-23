const puppeteer = require('puppeteer');
const Guitar = require('../DB/guitar');
const MAX = 100;
//const scrape = require('../scraper');
//const guitarIDs = require('../URL_IDs/guitarID');
// const guitarURLs = require('../URL_IDs/guitarURL');
// const xPaths = require('../URL_IDs/xPath');

async function scraper(){
	let url = 'https://www.musiciansfriend.com/hot-deals?N=100202+100802+500002+100202+100902+100802+500002&pageName=deal-center&Nao=0&recsPerPage=90&Ns=bS';
	let orig1 = `//*[@id="plpResultsGrid"]/div/div[`;
	let orig2 = `]/div[2]/div[5]/div[2]/span`;
	let sale1 = `//*[@id="plpResultsGrid"]/div/div[`;
	let sale2 = `]/div[2]/div[5]/div[1]/span[3]`;

	const browser = await puppeteer.launch();
	const page = await browser.newPage();

	await page.setRequestInterception(true);
	page.on('request', (req) => {
		if(req.resourceType() == 'stylesheet' || req.resourceType() == 'font' || req.resourceType() == 'image'){
			req.abort();
		}
		else {
			req.continue();
		}
	});

	await page.goto(url);

	for(let i = 1; i < MAX; i++){
		const [name] = await page.$x('//*[@id="plpResultsGrid"]/div/div[' + i + ']/div[2]/div[3]/a');
		const nameTxt = await name.getProperty('textContent');
		const guitarName = await nameTxt.jsonValue();
		let GuitarName = guitarName.substring(1);

		const [orig] = await page.$x(orig1 + i + orig2);
		const origTxt = await orig.getProperty('textContent');
		const origPrice = await origTxt.jsonValue();
		let OrigPrice = origPrice.substring(1);

		const [sale] = await page.$x(sale1 + i + sale2);
		const saleTxt = await sale.getProperty('textContent');
		const salePrice = await saleTxt.jsonValue();

		let n1 = origPrice.replace(/[^0-9.-]+/g,"");
		let n2 = salePrice.replace(/[^0-9.-]+/g,"");

		let dif = parseFloat(n1) - parseFloat(n2);
		let difr = (Math.round((dif + Number.EPSILON) * 100) / 100);
		let ident = guitarName.replace(/ .*/,'');
		let ident1 = (ident.toLowerCase()).substring(1);

		const guitar = new Guitar({
			guitar_name: GuitarName,
			name_identifier: ident1,
			sale_price: salePrice,
			original_price: OrigPrice,
			price_difference: difr
		});
		await guitar.save();

		//console.log(data);
	}
	await browser.close();
}
module.exports = scraper;