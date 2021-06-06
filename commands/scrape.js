const puppeteer = require('puppeteer');
const Guitar = require('../DB/guitar');
const MAX = 31;
let url = 'https://www.musiciansfriend.com/hot-deals?N=100802+500002#N=100202+100802+500002&pageName=deal-center&Nao=0&recsPerPage=30&Ns=bS';
async function scraper(){
	const browser = await puppeteer.launch({headless:true});
	const page = await browser.newPage();
	let s = 0;
	let e = 5;
	let count = 1;
	await page.goto(url);
	try{
		for(let i = 1; i < MAX; i++){
			let totnum = await page.$eval('#plpCounts > div',as => as.innerText);
			let totnum1 = parseInt(totnum.replace(/[^0-9.-]+/g,""));

			const [titname] = await page.$x('//*[@id="plpResultsGrid"]/div/div[' + i + ']/div[1]');
			const titnameTxt = await titname.getProperty('textContent');
			const titName = await titnameTxt.jsonValue();
			let stru = (titName).substring(1);

			//console.log(stru);
			if(stru === "Price Drop"){
				await page.goto('https://www.musiciansfriend.com/hot-deals?N=100802+500002#N=100202+100802+500002+100202+100802+500002&pageName=deal-center&Nao=120&recsPerPage=30&Ns=bS');
			}
			if(stru === "Used Sale\n" || stru === "Used Sale" || stru === "\n"){
				e = 4;
			}else{
				e = 5;
			}
			//console.log(e);
			const [name] = await page.$x('//*[@id="plpResultsGrid"]/div/div[' + i + ']/div[2]/div[3]/a');
			const nameTxt = await name.getProperty('textContent');
			const guitarName = await nameTxt.jsonValue();
			let GuitarName = guitarName.substring(1);


			let guitar_link = await page.$eval('#plpResultsGrid > div > div:nth-child(' + i + ') > div.product-card-content > div.product-card-title > a', as => as.href);
			let image_link = await page.$eval('#plpResultsGrid > div > div:nth-child(' + i + ') > div.product-card-content > div.product-card-image > a > img', as => as.src);

			const [orig] = await page.$x(`//*[@id="plpResultsGrid"]/div/div[` + i + `]/div[2]/div[` + e + `]/div[2]/span`);
			const origTxt = await orig.getProperty('textContent');
			const origPrice = await origTxt.jsonValue();
			let OrigPrice = origPrice.substring(1);

			const [sale] = await page.$x(`//*[@id="plpResultsGrid"]/div/div[` + i + `]/div[2]/div[` + e + `]/div[1]/span[3]`);
			const saleTxt = await sale.getProperty('textContent');
			const salePrice = await saleTxt.jsonValue();

			let n1 = origPrice.replace(/[^0-9.-]+/g,"");
			let n2 = salePrice.replace(/[^0-9.-]+/g,"");

			let dif = parseFloat(n1) - parseFloat(n2);
			let difr = (Math.round((dif + Number.EPSILON) * 100) / 100);
			let ident = guitarName.replace(/ .*/,'');
			let ident1 = (ident.toLowerCase()).substring(1).substring(0,ident.length-2);

			const guitar = new Guitar({
				count: count,
				guitar_name: GuitarName,
				link: guitar_link,
				name_identifier: ident1,
				sale_price: salePrice,
				original_price: OrigPrice,
				price_difference: difr,
				guitar_image: image_link
			});
			await guitar.save();
			count++;
			if(i === 30){
				i = 0;
				// if(page.url() === 'https://www.musiciansfriend.com/hot-deals?N=100802+500002#N=100202+100802+500002&pageName=deal-center&Nao=90&recsPerPage=30&Ns=bS'){
				// 	//console.log('beef');
				// 	await page.goto('about:blank');
				// 	page.waitForNavigation(1000);
				// 	await page.goto('https://www.musiciansfriend.com/hot-deals?N=100802+500002#N=100202+100802+500002+100202+100802+500002&pageName=deal-center&Nao=180&recsPerPage=30&Ns=bS');
				// 	console.log(page.url());
				// 	await page.waitForSelector('#plpResultsGrid > div > div:nth-child(1) > div.product-card-content > div.product-card-price > div:nth-child(2) > span', {
				// 		visible: true,
				// 	});
				// 	s += 90;
				// 	continue;
				// }
				
				await page.goto('about:blank');
				await page.goto('https://www.musiciansfriend.com/hot-deals?N=100802+500002#N=100202+100802+500002&pageName=deal-center&Nao='+ (s+30) +'&recsPerPage=30&Ns=bS', {
					waitUntil: 'networkidle0'
				});
				console.log(page.url());
				await page.waitForSelector('#plpResultsGrid > div > div:nth-child(1) > div.product-card-content > div.product-card-price > div:nth-child(2) > span', {
					visible: true,
				});
				s += 30;    
			}
		}	
	}catch (error) {
		console.error(error);
		console.log("done")
	  }

	await browser.close();
}
module.exports = scraper;

// function sleep(milliseconds) {
// 	var start = new Date().getTime();
// 	for (var i = 0; i < 1e7; i++) {
// 		if ((new Date().getTime() - start) > milliseconds){
// 			break;
// 		}
// 	}
//   }
