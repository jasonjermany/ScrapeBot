const puppeteer = require('puppeteer');
const MAX = 6;
//const scrape = require('../scraper');
//const guitarIDs = require('../URL_IDs/guitarID');
// const guitarURLs = require('../URL_IDs/guitarURL');
// const xPaths = require('../URL_IDs/xPath');
let url = '';
let orig1 = '';
let sale1 = '';
let orig2 = '';
let sale2 = '';
let input = "";
let hold = 1;
module.exports = {
	name: 'scrape',
	description: 'scrape website',
	async execute(message,args) { 
		//console.log("test1");
		if(!args[0]){
			url = 'https://www.musiciansfriend.com/hot-deals?N=100202+100802+500002';
			orig1 = `//*[@id="plpResultsGrid"]/div/div[`;
			orig2 = `]/div[2]/div[5]/div[2]/span`;
			sale1 = `//*[@id="plpResultsGrid"]/div/div[`;
			sale2 = `]/div[2]/div[5]/div[1]/span[3]`;
			//console.log("test2");
		}
		else{
			//console.log("test3");
			switch(args[0]){
				case "fender":
					input = "202612";
				break;
				case "gibson":
					input = "202616";
				break;
				case "ibanez":
					input = "202617";
				break;
				case "schecter":
					input = "201873";
				break;
				case "jackson":
					input = "201045";
				break;
				case "prs":
					input = "201539";
				break;
				case "gretsch":
					input = "200886";
				break;
				case "legator":
					input = "3013029";
				break;
				default:
					console.log("invalid input");
					message.channel.send("invalid input");
					hold = 0;
				break;
			}
			orig1 = `//*[@id="plpResultsGrid"]/div/div[`;
			sale1 = `//*[@id="plpResultsGrid"]/div/div[`;
			orig2 = `]/div[2]/div[4]/div[2]/span`;
			sale2 = `]/div[2]/div[4]/div[1]/span[3]`;
			url = (`https://www.musiciansfriend.com/hot-deals?N=` + input + `+100202+100202+` + input + `+100802+500002`);
		} 
		if(hold !== 0){
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

			//console.log(url);
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
				//console.log('Original price: ' + origPrice + ' Sale price: ' + salePrice + ' Price difference: ' + Math.round((dif + Number.EPSILON) * 100) / 100 + '\n');
				message.channel.send(' ' + 'Original price:' + origPrice + ' Sale price: ' + salePrice + ' Price difference: $' + Math.round((dif + Number.EPSILON) * 100) / 100);
			}
			await browser.close();
		}else{
			console.log("terminated");
		}
	}
};
