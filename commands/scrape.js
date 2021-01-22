const scrape = require('../scraper');
const guitarIDs = require('../URL_IDs/guitarID');
const guitarURLs = require('../URL_IDs/guitarURL');
const xPaths = require('../URL_IDs/xPath');
let url = '';
let orig1 = '';
let sale1 = '';
let orig2 = '';
let sale2 = '';
let input = "";
module.exports = {
	name: 'scrape',
	description: 'scrape website',
	async execute(message,args) { 
		console.log("test1");
		if(!args[0]){
			url = (guitarURLs.allBrand);
			console.log(guitarURLs.allBrand);
			orig1 = xPaths.origAll1;
			orig2 = xPaths.origAll2;
			sale1 = xPaths.saleAll1;
			sale2 = xPaths.saleAll2;
			console.log("test2");
		}
		else{
			console.log("test3");
			switch(args[0]){
				case "fender":
					input = guitarIDs.fender;
				break;
				case "gibson":
					input = guitarIDs.gibson;
				break;
				case "ibanez":
					input = guitarIDs.ibanez;
				break;
				case "schecter":
					input = guitarIDs.schecter;
				break;
				case "jackson":
					input = guitarIDs.jackson;
				break;
				case "prs":
					input = guitarIDs.prs;
				break;
				case "gretsch":
					input = guitarIDs.gretsch;
				break;
				case "legator":
					input = guitarIDs.legator;
				break;
				default:
					console.log("invalid input");
					message.channel.send("invalid input");
					input = 0;
				break;
			}
			orig1 = xPaths.origSpec1;
			sale1 = xPaths.saleSpec1;
			orig2 = xPaths.origSpec2;
			sale2 = xPaths.saleSpec2;
			url = (guitarURLs.specificBrand1 + input + guitarURLs.specificBrand2 + input + guitarURLs.specificBrand3);
		} 
		if(input !== 0){
			scrape(url,orig1,orig2,sale1,sale2);
		}else{
			console.log("terminated");
		}
	}
};
